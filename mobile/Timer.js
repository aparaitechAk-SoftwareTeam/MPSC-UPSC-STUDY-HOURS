
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
  zenMode='Light Zen',
  setZenMode,
  deepZenUnlocked=false,
  setDeepZenUnlocked,
  setFocusMode,
  requestExitFocus,
}) {
  const deepZenLocked =
  focusMode &&
  zenMode === 'Deep Zen' &&
  !deepZenUnlocked;

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
    <View style={styles.container}>
        
{focusMode ? (
  deepZenLocked ? (
    <Text style={styles.subtitle}>
      Deep Zen is locked. Complete the countdown to exit Focus Mode.
    </Text>
  ) : (
    <TouchableOpacity
      style={styles.focusButton}
      onPress={requestExitFocus}
    >
      <Text style={styles.focusButtonText}>Exit Focus Mode</Text>
    </TouchableOpacity>
  )
) : (
  <TouchableOpacity
    style={styles.focusButton}
    onPress={() => setFocusMode(true)}
  >
    <Text style={styles.focusButtonText}>Enter Focus Mode</Text>
  </TouchableOpacity>
)}

      <Text style={styles.heading}>Study Timer</Text>
      <Text style={styles.subtitle}>
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
    ? 'Deep Zen is designed to keep you focused until the countdown ends.'
    : 'Light Zen lets you leave Focus Mode whenever you need.'}
</Text>
      <View style={styles.modeRow}>
        {['Pomodoro', 'Stopwatch', 'Custom'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.modeButton,
              mode === item && styles.activeMode,
            ]}
            onPress={() => changeMode(item)}
          >
            <Text
              style={[
                styles.modeText,
                mode === item && styles.activeModeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>STUDY SUBJECT</Text>

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
                    selected === id && styles.selectedSubject,
                  ]}
                  disabled={!setSelected || running || elapsed > 0 || saving}
                  onPress={() => setSelected?.(id)}
                >
                  <Text style={styles.subjectText}>{name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.subtitle}>
            Your subjects will appear here when loaded.
          </Text>
        )}
        

{mode === 'Custom' && (
  <View style={{ marginTop: 18 }}>
    <Text style={styles.label}>CUSTOM DURATION</Text>

    <View style={styles.subjectList}>
      {[10, 15, 20, 30, 45, 60].map((minutes) => (
        <TouchableOpacity
          key={minutes}
          style={[
            styles.subjectButton,
            customMinutes === minutes && styles.selectedSubject,
          ]}
          disabled={running || elapsed > 0 || saving}
          onPress={() => setCustomMinutes?.(minutes)}
        >
          <Text style={styles.subjectText}>{minutes} min</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={[styles.label, { marginTop: 14 }]}>
      OR ENTER YOUR OWN TIME (MINUTES)
    </Text>

    <TextInput
      style={styles.durationInput}
      value={String(customMinutes ?? '')}
      onChangeText={(text) => {
        if (/^\d*$/.test(text)) {
          setCustomMinutes?.(text === '' ? '' : Number(text));
        }
      }}
      keyboardType="number-pad"
      placeholder="Enter minutes"
      placeholderTextColor="#94A3B8"
      editable={!running && elapsed === 0 && !saving}
    />
  </View>
)}


    
        <View style={styles.timerCircle}>
          <Text style={styles.timerLabel}>STUDY TIME</Text>
          <Text style={styles.time}>
  {formatTime(
  mode === 'Pomodoro'
    ? Math.max(0, 25 * 60 - elapsed)
    : mode === 'Custom'
    ? Math.max(0, customMinutes * 60 - elapsed)
    : elapsed
)}
</Text>
          <Text style={styles.status}>
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
          style={[styles.primaryButton, saving && styles.disabledButton]}
          disabled={saving}
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
          style={[styles.secondaryButton,
            deepZenLocked && styles.disabledButton,]
          }
          disabled={saving || deepZenLocked}
          onPress={finish}
        >
          <Text style={styles.secondaryText}>Finish & Save Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resetButton,
            deepZenLocked && styles.disabledButton,]}
          disabled={saving || deepZenLocked}
          onPress={resetSession}
        >
          <Text style={styles.resetText}>Reset Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    focusButton: {
  backgroundColor: '#E0EFFF',
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 16,
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
