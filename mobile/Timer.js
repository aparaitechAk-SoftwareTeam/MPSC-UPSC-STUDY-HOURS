import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import {
  getTranslation,
  getSubjectName,
  DEFAULT_SYLLABUS_SUBJECTS
} from './translations';

const COLORS = {
  bg: '#F7F9FE',
  white: '#FFFFFF',
  ink: '#142841',
  muted: '#72849F',
  blue: '#37689F',
  soft: '#E9F0FC',
  line: '#E8EEF8',
};

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
  t = (k, fb) => getTranslation(lang, k, fb)
}) {
  const C = theme || COLORS;
  const [timerExamFilter, setTimerExamFilter] = useState('ALL'); // 'ALL' | 'UPSC' | 'MPSC'

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

  // Lock controls only after a Deep Zen session has started.
  const deepZenSessionLocked =
    deepZenLocked && (running || elapsed > 0 || saving);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

    // Forest growth is based only on active elapsed study time.
  const treeStages = [
    {
      icon: '\uD83C\uDF31',
      title: 'Seed',
      titleKey: 'forestSeed',
      description: 'Your focus journey begins.',
      descriptionKey: 'forestSeedDesc',
    },
    {
      icon: '\uD83C\uDF3F',
      title: 'Sprout',
      titleKey: 'forestSprout',
      description: 'You are building consistency.',
      descriptionKey: 'forestSproutDesc',
    },
    {
      icon: '\uD83E\uDEB4',
      title: 'Sapling',
      titleKey: 'forestSapling',
      description: 'Your dedication is growing.',
      descriptionKey: 'forestSaplingDesc',
    },
    {
      icon: '\uD83C\uDF33',
      title: 'Growing Tree',
      titleKey: 'forestGrowingTree',
      description: 'Strong focus creates strong roots.',
      descriptionKey: 'forestGrowingDesc',
    },
    {
      icon: '\uD83C\uDF32',
      title: 'Mature Tree',
      titleKey: 'forestMatureTree',
      description: 'A beautiful session of dedication.',
      descriptionKey: 'forestMatureDesc',
    },
  ];

  const treeThresholds = [0, 300, 900, 1500, 2700, 3600];

  const treeStageIndex =
    elapsed >= 2700 ? 4 :
    elapsed >= 1500 ? 3 :
    elapsed >= 900 ? 2 :
    elapsed >= 300 ? 1 : 0;

  const treeStage = treeStages[treeStageIndex];

  const treeStageProgress =
    treeStageIndex === 4
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            ((elapsed - treeThresholds[treeStageIndex]) /
              (treeThresholds[treeStageIndex + 1] -
                treeThresholds[treeStageIndex])) * 100
          )
        );

  const nextTreeMilestone =
    treeStageIndex === 4
      ? null
      : treeThresholds[treeStageIndex + 1] / 60;
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

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>
      {focusMode ? (
        <TouchableOpacity
          style={[
            styles.focusButton,
            { backgroundColor: C.blueLight },
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
              { color: C.blue },
            ]}
          >
            {t('exitFocusMode', 'Exit Focus Mode')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.focusButton,
            { backgroundColor: C.blueLight },
          ]}
          onPress={() => setFocusMode?.(true)}
        >
          <Text
            style={[
              styles.focusButtonText,
              { color: C.blue },
            ]}
          >
            {t('enterFocusMode', 'Enter Focus Mode')}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.heading, { color: C.ink }]}>
        {t('studyTimer', 'Study Timer')}
      </Text>
      <Text style={[styles.subtitle, { color: C.muted }]}>
        {t('trackStudySessions', 'Track your study sessions and stay consistent.')}
      </Text>


      {/* Focus Style */}
      <Text style={[styles.label, { color: C.muted, marginTop: 18 }]}>
        {t('focusStyle', 'FOCUS STYLE')}
      </Text>

      <View style={styles.modeRow}>
        {['Light Zen', 'Deep Zen'].map((item) => {
          const unavailable = mode === 'Stopwatch' && item === 'Deep Zen';
          const label = item === 'Light Zen' ? t('lightZen', 'Light Zen') : t('deepZen', 'Deep Zen');

          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.modeButton,
                { backgroundColor: C.white, borderColor: C.line },
                zenMode === item && { backgroundColor: C.blue, borderColor: C.blue },
                unavailable && { opacity: 0.4 },
              ]}
              disabled={unavailable || running || elapsed > 0 || saving}
              onPress={() => {
                setDeepZenUnlocked?.(false);
                setZenMode?.(item);
              }}
            >
              <Text
                style={[
                  styles.modeText,
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

      <Text style={[styles.subtitle, { color: C.muted, marginTop: -6, marginBottom: 14 }]}>
        {mode === 'Stopwatch'
          ? t('stopwatchLightZenOnly', 'Stopwatch supports Light Zen only.')
          : zenMode === 'Deep Zen'
          ? t('deepZenDesc', 'Deep Zen locks pause, reset, finish, and exit during an active countdown. It unlocks when the countdown finishes.')
          : t('lightZenDesc', 'Light Zen lets you leave Focus Mode whenever you need.')}
      </Text>

      {/* Timer Modes */}
      <View style={styles.modeRow}>
        {[
          { key: 'Pomodoro', label: t('pomodoro', 'Pomodoro') },
          { key: 'Stopwatch', label: t('stopwatch', 'Stopwatch') },
          { key: 'Custom', label: t('custom', 'Custom') }
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.modeButton,
              { backgroundColor: C.white, borderColor: C.line },
              mode === item.key && { backgroundColor: C.blue, borderColor: C.blue },
            ]}
            onPress={() => changeMode(item.key)}
          >
            <Text
              style={[
                styles.modeText,
                { color: C.muted },
                mode === item.key && { color: '#ffffff', fontWeight: '700' },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Study Subject Card */}
      <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={[styles.label, { color: C.muted, marginBottom: 0 }]}>
            {t('studySubject', 'STUDY SUBJECT')}
          </Text>

          {/* Exam Switcher (Matches Syllabus Section) */}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['ALL', 'UPSC', 'MPSC'].map(ef => (
              <TouchableOpacity
                key={ef}
                onPress={() => setTimerExamFilter(ef)}
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: timerExamFilter === ef ? C.blue : C.soft,
                  borderWidth: 1,
                  borderColor: timerExamFilter === ef ? C.blue : C.line
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: timerExamFilter === ef ? '#ffffff' : C.blue
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
                        borderRadius: 4
                      }}
                    >
                      {isMpsc ? t('mpsc', 'MPSC') : t('upsc', 'UPSC')}
                    </Text>
                    <Text
                      style={[
                        styles.subjectText,
                        {
                          color: isSelected ? C.blue : C.ink,
                          fontWeight: isSelected ? '700' : '400'
                        }
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

        {/* Custom Duration Selector */}
        {mode === 'Custom' && (
          <View style={{ marginTop: 18 }}>
            <Text style={[styles.label, { color: C.muted }]}>
              {t('customDuration', 'CUSTOM DURATION')}
            </Text>

            <View style={styles.subjectList}>
              {[10, 15, 20, 30, 45, 60].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.subjectButton,
                    { borderColor: C.line, backgroundColor: C.white },
                    customMinutes === minutes && { borderColor: C.blue, backgroundColor: C.soft },
                  ]}
                  disabled={running || elapsed > 0 || saving}
                  onPress={() => setCustomMinutes?.(minutes)}
                >
                  <Text
                    style={[
                      styles.subjectText,
                      {
                        color: customMinutes === minutes ? C.blue : C.ink,
                        fontWeight: customMinutes === minutes ? '700' : '400'
                      }
                    ]}
                  >
                    {minutes} {t('mins', 'min')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: C.muted, marginTop: 14 }]}>
              {t('enterOwnTime', 'OR ENTER YOUR OWN TIME (MINUTES)')}
            </Text>

            <TextInput
              style={[
                styles.durationInput,
                { backgroundColor: C.white, borderColor: C.line, color: C.ink }
              ]}
              value={String(customMinutes ?? '')}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setCustomMinutes?.(text === '' ? '' : Number(text));
                }
              }}
              keyboardType="number-pad"
              placeholder={t('enterMinutesPlaceholder', 'Enter minutes')}
              placeholderTextColor={C.muted}
              editable={!running && elapsed === 0 && !saving}
            />
          </View>
        )}
        {/* Tree-Based Timer UI */}
        <View
          style={[
            styles.forestCard,
            {
              backgroundColor: C.white,
              borderColor: C.line,
              alignItems: 'center',
              paddingVertical: 28,
            },
          ]}
        >
          <Text style={[styles.forestEyebrow, { color: C.muted }]}>
            YOUR FOCUS FOREST
          </Text>

          <Text style={{ fontSize: 105, marginVertical: 15 }}>
            {treeStage.icon}
          </Text>

          <Text style={[styles.forestStageTitle, { color: C.ink, fontSize: 22 }]}>
            {t(treeStage.titleKey, treeStage.title)}
          </Text>

          <Text style={[
            styles.forestDescription,
            { color: C.muted, textAlign: 'center', marginTop: 6 },
          ]}>
            {t(treeStage.descriptionKey, treeStage.description)}
          </Text>

          <Text style={[
            styles.time,
            { color: C.ink, marginTop: 20, marginBottom: 4 },
          ]}>
            {formatTime(
              mode === 'Pomodoro'
                ? Math.max(0, 25 * 60 - elapsed)
                : mode === 'Custom'
                  ? Math.max(0, (customMinutes || 30) * 60 - elapsed)
                  : elapsed
            )}
          </Text>

          <Text style={[styles.status, { color: C.muted }]}>
            {saving
              ? t('saving', 'Saving session...')
              : running
                ? t('runningFocus', 'Session in progress')
                : elapsed > 0
                  ? t('pausedFocus', 'Session paused')
                  : t('readyToFocus', 'Ready to focus')}
          </Text>

          <View style={[
            styles.forestProgressTrack,
            { backgroundColor: C.soft, width: '100%' },
          ]}>
            <View
              style={[
                styles.forestProgressFill,
                { width: `${treeStageProgress}%`, backgroundColor: C.green },
              ]}
            />
          </View>

          <Text style={[
            styles.forestNext,
            { color: C.muted, textAlign: 'center' },
          ]}>
            {nextTreeMilestone === null
              ? t('forestFullyGrown', 'Your tree has fully grown!')
              : `${t('nextGrowthStage', 'Next growth stage in')} ${Math.max(
                  0,
                  nextTreeMilestone - Math.floor(elapsed / 60)
                )} ${t('mins', 'min')}`}
          </Text>
        </View>

        {/* Primary Action Button */}
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
                  : t('startTimer', 'Start Session')}
          </Text>
        </TouchableOpacity>

        {/* Finish & Save Button */}
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: C.soft },
            (saving || deepZenSessionLocked) && styles.disabledButton,
          ]}
          disabled={saving || deepZenSessionLocked}
          onPress={finish}
        >
          <Text style={[styles.secondaryText, { color: C.blue }]}>
            {t('saveSession', 'Finish & Save Session')}
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={[
            styles.resetButton,
            deepZenSessionLocked && styles.disabledButton,
          ]}
          disabled={saving || deepZenSessionLocked}
          onPress={resetSession}
        >
          <Text style={[styles.resetText, { color: C.muted }]}>
            {t('reset', 'Reset Timer')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  focusButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0EFFF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  focusButtonText: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },
  heading: {
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.ink,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 18,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeMode: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  modeText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  activeModeText: {
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: COLORS.muted,
    fontWeight: '700',
    marginBottom: 10,
  },
  subjectList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectButton: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  selectedSubject: {
    borderColor: COLORS.blue,
    backgroundColor: COLORS.soft,
  },
  subjectText: {
    color: COLORS.ink,
    fontSize: 12,
  },
  time: {
    color: COLORS.ink,
    fontSize: 42,
    fontWeight: '700',
    marginVertical: 8,
    fontVariant: ['tabular-nums'],
  },
  status: {
    color: COLORS.muted,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: COLORS.soft,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryText: {
    color: COLORS.blue,
    fontWeight: '700',
  },
  resetButton: {
    padding: 12,
    alignItems: 'center',
  },
  resetText: {
    color: COLORS.muted,
    fontWeight: '600',
  },
    forestCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  forestTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  forestIcon: {
    fontSize: 43,
  },
  forestEyebrow: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 4,
  },
  forestStageTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  forestDescription: {
    fontSize: 11,
    marginTop: 3,
  },
  forestTime: {
    fontSize: 22,
    fontWeight: '800',
  },
  forestTimeLabel: {
    fontSize: 9,
  },
  forestProgressTrack: {
    height: 7,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 15,
  },
  forestProgressFill: {
    height: 7,
    backgroundColor: '#65A66A',
    borderRadius: 10,
  },
  forestNext: {
    fontSize: 10,
    marginTop: 8,
  },
});



