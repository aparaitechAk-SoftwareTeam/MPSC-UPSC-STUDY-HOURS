import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';

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
}) {
  const C = theme || COLORS;
  // Lock controls only after a Deep Zen session has started. Selecting Deep Zen
  // before starting a countdown should not trap the user in Focus Mode.
  const deepZenSessionLocked =
    deepZenLocked && (running || elapsed > 0 || saving);
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  const changeMode = (nextMode) => {
    if (running || elapsed > 0 || saving) {
      Alert.alert(
        'Session in progress',
        'Finish or reset the current session before changing timer mode.'
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
      isDarkMode && { backgroundColor: '#1e3a8a' },
    ]}
    onPress={() => {
      if (deepZenSessionLocked) {
        Alert.alert(
          'Deep Zen is active',
          'Wait until the countdown reaches 00:00 before exiting Focus Mode.'
        );
        return;
      }

      requestExitFocus?.();
    }}
  >
    <Text
      style={[
        styles.focusButtonText,
        isDarkMode && { color: '#93c5fd' },
      ]}
    >
      Exit Focus Mode
    </Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={[
      styles.focusButton,
      isDarkMode && { backgroundColor: '#1e3a8a' },
    ]}
    onPress={() => setFocusMode?.(true)}
  >
    <Text
      style={[
        styles.focusButtonText,
        isDarkMode && { color: '#93c5fd' },
      ]}
    >
      Enter Focus Mode
    </Text>
  </TouchableOpacity>
)}
      <Text style={[styles.heading, { color: C.ink }]}>Study Timer</Text>
      <Text style={[styles.subtitle, { color: C.muted }]}>
        Track your study sessions and stay consistent.
      </Text>
      <Text style={[styles.label, { marginTop: 18 }]}>
  FOCUS STYLE
</Text>

<View style={styles.modeRow}>
  {['Light Zen', 'Deep Zen'].map((item) => {
    const unavailable = mode === 'Stopwatch' && item === 'Deep Zen';

    return (
      <TouchableOpacity
        key={item}
        style={[
          styles.modeButton,
          zenMode === item && styles.activeMode,
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
            zenMode === item && styles.activeModeText,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>

<Text style={styles.subtitle}>
  {mode === 'Stopwatch'
    ? 'Stopwatch supports Light Zen only.'
    : zenMode === 'Deep Zen'
    ? 'Deep Zen locks pause, reset, finish, and exit during an active countdown. It unlocks when the countdown finishes.'
    : 'Light Zen lets you leave Focus Mode whenever you need.'}
</Text>
      <View style={styles.modeRow}>
        {['Pomodoro', 'Stopwatch', 'Custom'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.modeButton,
              { backgroundColor: C.white, borderColor: C.line },
              mode === item && { backgroundColor: C.blue, borderColor: C.blue },
            ]}
            onPress={() => changeMode(item)}
          >
            <Text
              style={[
                styles.modeText,
                { color: C.muted },
                mode === item && { color: '#ffffff', fontWeight: '700' },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: C.white, borderColor: C.line }]}>
        <Text style={[styles.label, { color: C.muted }]}>STUDY SUBJECT</Text>

        {subjects.length > 0 ? (
          <View style={styles.subjectList}>
            {subjects.map((subject) => {
              const id = subject.id ?? subject._id;
              const name =
                subject.name ?? subject.title ?? 'Subject';

              return (
                <TouchableOpacity
                  key={String(id ?? name)}
                  style={[
                    styles.subjectButton,
                    { borderColor: C.line, backgroundColor: C.white },
                    selected === id && { borderColor: C.blue, backgroundColor: C.soft },
                  ]}
                  disabled={!setSelected || running || elapsed > 0 || saving}
                  onPress={() => setSelected?.(id)}
                >
                  <Text style={[styles.subjectText, { color: selected === id ? C.blue : C.ink, fontWeight: selected === id ? '700' : '400' }]}>{name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.subtitle, { color: C.muted }]}>
            Your subjects will appear here when loaded.
          </Text>
        )}


        {mode === 'Custom' && (
          <View style={{ marginTop: 18 }}>
            <Text style={[styles.label, { color: C.muted }]}>CUSTOM DURATION</Text>

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
                  <Text style={[styles.subjectText, { color: customMinutes === minutes ? C.blue : C.ink, fontWeight: customMinutes === minutes ? '700' : '400' }]}>{minutes} min</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: C.muted, marginTop: 14 }]}>
              OR ENTER YOUR OWN TIME (MINUTES)
            </Text>

            <TextInput
              style={[styles.durationInput, { backgroundColor: C.white, borderColor: C.line, color: C.ink }]}
              value={String(customMinutes ?? '')}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setCustomMinutes?.(text === '' ? '' : Number(text));
                }
              }}
              keyboardType="number-pad"
              placeholder="Enter minutes"
              placeholderTextColor={C.muted}
              editable={!running && elapsed === 0 && !saving}
            />
          </View>
        )}



        <View style={[styles.timerCircle, { borderColor: C.soft }]}>
          <Text style={[styles.timerLabel, { color: C.muted }]}>STUDY TIME</Text>
          <Text style={[styles.time, { color: C.ink }]}>
            {formatTime(
              mode === 'Pomodoro'
                ? Math.max(0, 25 * 60 - elapsed)
                : mode === 'Custom'
                  ? Math.max(0, customMinutes * 60 - elapsed)
                  : elapsed
            )}
          </Text>
          <Text style={[styles.status, { color: C.muted }]}>
            {saving
              ? 'Saving session...'
              : running
                ? 'Session in progress'
                : elapsed > 0
                  ? 'Session paused'
                  : 'Ready to focus'}
          </Text>
        </View>

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
              ? 'Saving...'
              : running
                ? 'Pause Session'
                : elapsed > 0
                  ? 'Resume Session'
                  : 'Start Session'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { backgroundColor: C.soft },
            (saving || deepZenSessionLocked) && styles.disabledButton,
          ]}
          disabled={saving || deepZenSessionLocked}
          onPress={finish}
        >
          <Text style={[styles.secondaryText, { color: C.blue }]}>Finish & Save Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resetButton,
            deepZenSessionLocked && styles.disabledButton,]}
          disabled={saving || deepZenSessionLocked}
          onPress={resetSession}
        >
          <Text style={[styles.resetText, { color: C.muted }]}>Reset Timer</Text>
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
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: COLORS.soft,
    borderRadius: 120,
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginVertical: 28,
  },
  timerLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.muted,
    fontWeight: '700',
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
});
