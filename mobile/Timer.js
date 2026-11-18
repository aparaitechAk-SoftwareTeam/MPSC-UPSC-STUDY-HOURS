import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient,
  Stop,
  Ellipse,
} from 'react-native-svg';
import {
  getTranslation,
  getSubjectName,
  DEFAULT_SYLLABUS_SUBJECTS,
} from './translations';

const COLORS = {
  bg: '#F6F9F6',
  white: '#FFFFFF',
  ink: '#0F291E',
  muted: '#4B6357',
  blue: '#059669',
  soft: '#ECFDF5',
  line: '#D1FAE5',
};

import BotanicalTree from './BotanicalTree';

export default function Timer({
  elapsed = 0,
  running = false,
  mode = 'Pomodoro',
  setMode,
  startSession,
  pauseSession,
  finish,
  resetSession,
  saving = false,
  selected = '',
  subjects = [],
  setSelected,
  customMinutes = 30,
  setCustomMinutes,
  focusMode = false,
  setFocusMode,
  zenMode = 'Light Zen',
  setZenMode,
  deepZenUnlocked = false,
  setDeepZenUnlocked,
  deepZenLocked = false,
  requestExitFocus,
  theme,
  isDarkMode = false,
  lang = 'en',
  t = (k, fb) => getTranslation(lang, k, fb),
}) {
  const C = theme || COLORS;
  const [timerExamFilter, setTimerExamFilter] = useState('ALL');

  // Standardize subjects matching syllabus exactly
  const sourceSubjects = (Array.isArray(subjects) && subjects.length > 0)
    ? subjects
    : DEFAULT_SYLLABUS_SUBJECTS;

  const validSubjects = sourceSubjects.filter(
    s => s && s.id && (String(s.id).startsWith('upsc-') || String(s.id).startsWith('mpsc-'))
  );

  const cleanSubjects = validSubjects.length > 0 ? validSubjects : DEFAULT_SYLLABUS_SUBJECTS;

  const displayedSubjects = cleanSubjects.filter(s => {
    if (timerExamFilter === 'ALL') return true;
    const sExam = s.exam || (String(s.id).startsWith('mpsc') ? 'MPSC' : 'UPSC');
    return sExam === timerExamFilter;
  });

  // Lock controls only after a Deep Zen session has started
  const deepZenSessionLocked = deepZenLocked && (running || elapsed > 0 || saving);

  // Helper: Format seconds to MM:SS or HH:MM:SS
  const formatTime = (totalSeconds) => {
    const s = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

  // Forest growth follows the selected countdown duration.
  // Stopwatch retains its original elapsed-time milestones.
  const treeStages = [
    { icon: '\uD83C\uDF31', title: 'Seed', titleKey: 'forestSeed', description: 'Your focus journey begins.', descriptionKey: 'forestSeedDesc' },
    { icon: '\uD83C\uDF3F', title: 'Sprout', titleKey: 'forestSprout', description: 'You are building consistency.', descriptionKey: 'forestSproutDesc' },
    { icon: '\uD83E\uDEB4', title: 'Sapling', titleKey: 'forestSapling', description: 'Your dedication is growing.', descriptionKey: 'forestSaplingDesc' },
    { icon: '\uD83C\uDF33', title: 'Growing Tree', titleKey: 'forestGrowingTree', description: 'Strong focus creates strong roots.', descriptionKey: 'forestGrowingDesc' },
    { icon: '\uD83C\uDF32', title: 'Mature Tree', titleKey: 'forestMatureTree', description: 'A beautiful session of dedication.', descriptionKey: 'forestMatureDesc' },
  ];

  const countdownDurationSeconds =
    mode === 'Pomodoro' ? 25 * 60 :
    mode === 'Custom' ? Number(customMinutes) * 60 : null;

  const hasCountdownDuration =
    countdownDurationSeconds !== null &&
    Number.isFinite(countdownDurationSeconds) &&
    countdownDurationSeconds > 0;

  const treeThresholds = hasCountdownDuration
    ? Array.from({ length: 6 }, (_, index) =>
        Math.round((countdownDurationSeconds * index) / 5)
      )
    : [0, 300, 900, 1500, 2700, 3600];

  const nextStageIndex = treeThresholds.slice(1).findIndex(
    (threshold) => elapsed < threshold
  );

  const treeStageIndex = nextStageIndex === -1 ? 4 : nextStageIndex;
  const treeStage = treeStages[treeStageIndex];

  const treeStageProgress =
    !hasCountdownDuration && treeStageIndex === 4
      ? 100
      : Math.min(100, Math.max(0,
          ((elapsed - treeThresholds[treeStageIndex]) /
            (treeThresholds[treeStageIndex + 1] - treeThresholds[treeStageIndex])) * 100
        ));

  const nextTreeMilestone =
    hasCountdownDuration
      ? elapsed >= countdownDurationSeconds
        ? null
        : treeThresholds[treeStageIndex + 1] / 60
      : treeStageIndex === 4
        ? null
        : treeThresholds[treeStageIndex + 1] / 60;

  // Selected session duration in seconds (dynamic source of truth)
  const selectedDuration =
    mode === 'Pomodoro'
      ? 25 * 60
      : mode === 'Custom'
        ? Math.max(1, (Number(customMinutes) || 30)) * 60
        : 3600; // Stopwatch: 60-minute milestone cycle

  // Remaining duration for countdown display
  const remainingSeconds =
    mode === 'Stopwatch'
      ? elapsed
      : Math.max(0, selectedDuration - elapsed);

  // Growth progress: 0 to 1 based on actual timer elapsed / selectedDuration
  const rawProgress = selectedDuration > 0 ? elapsed / selectedDuration : 0;
  const growthProgress = Math.max(0, Math.min(1, rawProgress));
  const growthPercentage = Math.round(growthProgress * 100);
  const isSessionComplete = growthProgress >= 1;

  // 7 Stages Data Mapping
  const getStageInfo = (p) => {
    const pct = Math.round(p * 100);
    if (pct >= 100) {
      return {
        title: t('forestMatureTree', 'Mature Tree'),
        emoji: '🌲',
        desc: t('forestMatureDesc', 'Session complete! Full growth achieved'),
      };
    }
    if (pct >= 80) {
      return {
        title: t('forestNearlyMature', 'Nearly Mature'),
        emoji: '🌳',
        desc: t('forestNearlyDesc', 'Deep roots, rich crown'),
      };
    }
    if (pct >= 60) {
      return {
        title: t('forestThrivingTree', 'Thriving Tree'),
        emoji: '🌳',
        desc: t('forestGrowingDesc', 'Strong canopy developing'),
      };
    }
    if (pct >= 40) {
      return {
        title: t('forestGrowingSapling', 'Growing Sapling'),
        emoji: '🌿',
        desc: t('forestSaplingDesc', 'Branches & foliage expanding'),
      };
    }
    if (pct >= 20) {
      return {
        title: t('forestYoungSprout', 'Young Sprout'),
        emoji: '🪴',
        desc: t('forestSproutDesc', 'Stem & leaves taking shape'),
      };
    }
    if (pct >= 1) {
      return {
        title: t('forestSeedling', 'Seedling'),
        emoji: '🌿',
        desc: t('forestSeedlingDesc', 'First green shoot emerging'),
      };
    }
    return {
      title: t('forestSeed', 'Seed'),
      emoji: '🌱',
      desc: t('forestSeedDesc', 'Your focus journey begins'),
    };
  };

  const currentStage = getStageInfo(growthProgress);

  const changeMode = (nextMode) => {
    if (running || elapsed > 0 || saving) {
      Alert.alert(
        t('sessionInProgressAlert', 'Session in progress'),
        t('sessionInProgressDesc', 'Finish or reset the current session before changing timer mode.')
      );
      return;
    }
    if (nextMode === 'Stopwatch' && zenMode === 'Deep Zen') {
      setZenMode?.('Light Zen');
    }
    setMode?.(nextMode);
  };

  // Circular ring geometry (280x280)
  const circleSize = 280;
  const strokeWidth = 10;
  const radius = (circleSize - strokeWidth) / 2 - 6; // 129
  const center = circleSize / 2; // 140
  const circumference = 2 * Math.PI * radius; // ~810.53
  const strokeDashoffset = circumference * (1 - growthProgress);

  const trackColor = isDarkMode ? '#132A20' : '#E6F4EA';
  const progressRingColor = isDarkMode ? '#10B981' : '#059669';

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {/* Top Focus Mode Bar */}
      {focusMode ? (
        <TouchableOpacity
          style={[
            styles.focusButton,
            { backgroundColor: isDarkMode ? '#064e3b' : (C.soft || '#ECFDF5') },
          ]}
          onPress={() => {
            if (deepZenSessionLocked) {
              Alert.alert(
                t('deepZenActiveAlert', 'Deep Zen is active'),
                t('deepZenActiveDesc', 'Wait until the countdown reaches 00:00 before exiting Focus Mode.')
              );
              return;
            }
            requestExitFocus?.();
          }}
        >
          <Text
            style={[
              styles.focusButtonText,
              { color: isDarkMode ? '#6ee7b7' : (C.blue || '#059669') },
            ]}
          >
            {t('exitFocusMode', 'Exit Focus Mode')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.focusButton,
            { backgroundColor: isDarkMode ? '#064e3b' : (C.soft || '#ECFDF5') },
          ]}
          onPress={() => setFocusMode?.(true)}
        >
          <Text
            style={[
              styles.focusButtonText,
              { color: isDarkMode ? '#6ee7b7' : (C.blue || '#059669') },
            ]}
          >
            {t('enterFocusMode', 'Enter Focus Mode')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Screen Title */}
      <Text style={[styles.heading, { color: C.ink }]}>
        {t('studyTimer', 'Study Timer')}
      </Text>
      <Text style={[styles.subtitle, { color: C.muted }]}>
        {t('trackStudySessions', 'Track your study sessions and stay consistent.')}
      </Text>

      {/* Mode & Zen Selector Chips */}
      <View style={styles.topControlRow}>
        {/* Mode Selector */}
        <View style={styles.segmentGroup}>
          {[
            { key: 'Pomodoro', label: t('pomodoro', 'Pomodoro') },
            { key: 'Custom', label: t('custom', 'Custom') },
            { key: 'Stopwatch', label: t('stopwatch', 'Stopwatch') },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.segmentButton,
                { backgroundColor: C.white, borderColor: C.line },
                mode === item.key && { backgroundColor: C.blue, borderColor: C.blue },
              ]}
              onPress={() => changeMode(item.key)}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: C.muted },
                  mode === item.key && { color: '#ffffff', fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Zen Style Selector */}
        <View style={styles.segmentGroup}>
          {['Light Zen', 'Deep Zen'].map((item) => {
            const unavailable = mode === 'Stopwatch' && item === 'Deep Zen';
            const label = item === 'Light Zen' ? t('lightZen', 'Light') : t('deepZen', 'Deep');

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.segmentButton,
                  { backgroundColor: C.white, borderColor: C.line },
                  zenMode === item && { backgroundColor: C.blue, borderColor: C.blue },
                  unavailable && { opacity: 0.35 },
                ]}
                disabled={unavailable || running || elapsed > 0 || saving}
                onPress={() => {
                  setDeepZenUnlocked?.(false);
                  setZenMode?.(item);
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: C.muted },
                    zenMode === item && { color: '#ffffff', fontWeight: '700' },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ========================================================= */}
      {/* 1. CUSTOM DURATION & 2. OR ENTER YOUR OWN TIME (MINUTES)  */}
      {/* 3. Custom duration input / minute selection controls      */}
      {/* (SHOWN ONLY WHEN mode === 'Custom')                       */}
      {/* ========================================================= */}
      {mode === 'Custom' && (
        <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line, marginTop: 12 }]}>
          <Text style={[styles.label, { color: C.muted }]}>
            {t('customDuration', 'CUSTOM DURATION')}
          </Text>

          {/* Quick Minute Selection Controls */}
          <View style={styles.presetRow}>
            {[5, 10, 15, 20, 25, 30, 45, 60].map((minutes) => {
              const isSelected = customMinutes === minutes;
              return (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.presetChip,
                    { borderColor: C.line, backgroundColor: C.white },
                    isSelected && { borderColor: C.blue, backgroundColor: C.soft },
                  ]}
                  disabled={running || elapsed > 0 || saving}
                  onPress={() => setCustomMinutes?.(minutes)}
                >
                  <Text
                    style={[
                      styles.presetChipText,
                      {
                        color: isSelected ? C.blue : C.ink,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.label, { color: C.muted, marginTop: 10 }]}>
            {t('enterOwnTime', 'OR ENTER YOUR OWN TIME (MINUTES)')}
          </Text>

          <TextInput
            style={[
              styles.durationInput,
              { backgroundColor: isDarkMode ? '#0A1612' : '#FFFFFF', borderColor: C.line, color: C.ink },
            ]}
            value={String(customMinutes ?? '')}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setCustomMinutes?.(text === '' ? '' : Number(text));
              }
            }}
            keyboardType="number-pad"
            placeholder={t('enterMinutesPlaceholder', 'Enter minutes (1 - 720)')}
            placeholderTextColor={C.muted}
            editable={!running && elapsed === 0 && !saving}
          />
        </View>
      )}

      {/* ========================================================= */}
      {/* 4. & 5. STUDY SUBJECT CARD (BELOW CUSTOM DURATION)        */}
      {/* ========================================================= */}
      <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line, marginTop: 10 }]}>
        <View style={styles.subjectCardHeader}>
          <Text style={[styles.label, { color: C.muted, marginBottom: 0 }]}>
            {t('studySubject', 'STUDY SUBJECT')}
          </Text>

          {/* Exam Filter Chips */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['ALL', 'UPSC', 'MPSC'].map((ef) => (
              <TouchableOpacity
                key={ef}
                onPress={() => setTimerExamFilter(ef)}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: timerExamFilter === ef ? C.blue : C.soft,
                  borderWidth: 1,
                  borderColor: timerExamFilter === ef ? C.blue : C.line,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: timerExamFilter === ef ? '#ffffff' : C.blue,
                  }}
                >
                  {ef === 'ALL' ? t('all', 'ALL') : ef === 'UPSC' ? t('upsc', 'UPSC') : t('mpsc', 'MPSC')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {displayedSubjects.length > 0 ? (
          <View style={styles.subjectList}>
            {displayedSubjects.map((subject) => {
              const id = subject.id ?? subject._id;
              const isMpsc = (subject.exam === 'MPSC') || String(id).startsWith('mpsc-');
              const subName = getSubjectName(subject, lang);
              const isSelected = selected === id;

              return (
                <TouchableOpacity
                  key={String(id)}
                  style={[
                    styles.subjectButton,
                    { borderColor: C.line, backgroundColor: C.white },
                    isSelected && { borderColor: C.blue, backgroundColor: C.soft },
                  ]}
                  disabled={!setSelected || running || elapsed > 0 || saving}
                  onPress={() => setSelected?.(id)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '700',
                        color: isMpsc ? C.amber : C.blue,
                        backgroundColor: isMpsc ? C.amberSoft : C.blueLight,
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}
                    >
                      {isMpsc ? t('mpsc', 'MPSC') : t('upsc', 'UPSC')}
                    </Text>
                    <Text
                      style={[
                        styles.subjectText,
                        {
                          color: isSelected ? C.blue : C.ink,
                          fontWeight: isSelected ? '700' : '400',
                        },
                      ]}
                    >
                      {subName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.subtitle, { color: C.muted }]}>
            {t('noAnalyticsData', 'Your subjects will appear here when loaded.')}
          </Text>
        )}
      </View>

      {/* ========================================================= */}
      {/* 6. CIRCULAR TIMER COMPONENT WITH DYNAMIC TREE GROWTH      */}
      {/* ========================================================= */}
      <View style={styles.circleContainer}>
        {/* Outer Circular SVG Track and Animated Progress Ring */}
        <Svg width={circleSize} height={circleSize} style={styles.svgAbsolute}>
          {/* Subtle Outer Glow Aura when running */}
          {running && (
            <Circle
              cx={center}
              cy={center}
              r={radius + 4}
              stroke={progressRingColor}
              strokeWidth={2}
              opacity={0.3}
              fill="none"
            />
          )}

          {/* Background Track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill={isDarkMode ? '#0E1F18' : '#FAFDFB'}
          />

          {/* Foreground Dynamic Progress Ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={progressRingColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>

        {/* Integrated Center Content */}
        <View style={styles.circleContent}>
          {/* Top Session Mode Tag */}
          <View style={[styles.timerModePill, { backgroundColor: C.soft, borderColor: C.line }]}>
            <Text style={[styles.timerModePillText, { color: C.blue }]}>
              {mode === 'Pomodoro'
                ? `25 MIN • ${t('pomodoro', 'POMODORO')}`
                : mode === 'Custom'
                  ? `${customMinutes || 30} MIN • ${t('custom', 'CUSTOM')}`
                  : t('stopwatch', 'STOPWATCH')}
            </Text>
          </View>

          {/* Central Living Botanical Tree */}
          <View style={styles.treeWrapper}>
            <BotanicalTree
              progress={growthProgress}
              isDark={isDarkMode}
              running={running}
              isComplete={isSessionComplete}
            />
          </View>
          {/* Crisp Digital Countdown Display */}
          <Text style={[styles.timeDisplay, { color: C.ink }]}>
            {formatTime(remainingSeconds)}
          </Text>

          {/* Growth Stage and Session Status Label */}
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: isSessionComplete ? '#059669' : C.muted }]}>
              {saving
                ? t('saving', 'Saving session...')
                : isSessionComplete
                  ? `🎉 ${t('forestFullyGrown', 'Tree fully grown! Session complete!')}`
                  : running
                    ? `${currentStage.emoji} ${currentStage.title} • ${growthPercentage}%`
                    : elapsed > 0
                      ? `⏸ ${t('pausedFocus', 'Paused')} • ${growthPercentage}%`
                      : `${currentStage.emoji} ${currentStage.title} • ${t('readyToFocus', 'Ready')}`}
            </Text>
          </View>
        </View>
      </View>

      {/* ========================================================= */}
      {/* 7. EXISTING START, PAUSE, RESUME AND RESET CONTROLS       */}
      {/* ========================================================= */}
      <View style={styles.controlsCard}>
        {/* Main Action Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            { backgroundColor: C.blue },
            (saving || (deepZenSessionLocked && running)) && styles.disabledButton,
          ]}
          disabled={saving || (deepZenSessionLocked && running)}
          onPress={running ? pauseSession : startSession}
        >
          <Text style={styles.primaryText}>
            {saving
              ? t('saving', 'Saving...')
              : running
                ? t('pauseTimer', 'Pause Session')
                : elapsed > 0
                  ? t('resumeTimer', 'Resume Session')
                  : t('startTimer', 'Start Focus Session')}
          </Text>
        </TouchableOpacity>

        {/* Action Row: Finish & Reset */}
        <View style={styles.secondaryActionsRow}>
          {/* Finish & Save Session */}
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { backgroundColor: C.soft, borderColor: C.line },
              (saving || deepZenSessionLocked) && styles.disabledButton,
            ]}
            disabled={saving || deepZenSessionLocked}
            onPress={finish}
          >
            <Text style={[styles.secondaryText, { color: C.blue }]}>
              {t('saveSession', 'Finish & Save')}
            </Text>
          </TouchableOpacity>

          {/* Reset Session */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: isDarkMode ? '#172E24' : '#F1F5F9', borderColor: C.line },
              (saving || deepZenSessionLocked) && styles.disabledButton,
            ]}
            disabled={saving || deepZenSessionLocked}
            onPress={resetSession}
          >
            <Text style={[styles.resetText, { color: C.muted }]}>
              {t('reset', 'Reset')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  focusButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginBottom: 8,
  },
  focusButtonText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 12,
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentButton: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 13,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Circular Central Timer
  circleContainer: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginVertical: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circleContent: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  timerModePill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 2,
  },
  timerModePillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  treeWrapper: {
    width: 140,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -2,
  },
  timeDisplay: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  statusRow: {
    marginTop: 3,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Controls
  controlsCard: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 2,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Subject & Presets
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  presetChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  presetChipText: {
    fontSize: 12,
  },
  durationInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  subjectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  subjectText: {
    fontSize: 12,
  },
});



