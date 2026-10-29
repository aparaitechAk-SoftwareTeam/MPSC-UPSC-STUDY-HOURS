import React, { useEffect, useRef, useState } from 'react';
import AuthScreens from './AuthScreens';
import { smartApiFetch, getApiBase } from './api';

import {
  AppState,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import Timer from './Timer';
import SettingsScreen from './SettingsScreen';
import TicketSupportScreen from './TicketSupportScreen';

const LIGHT_THEME = {
  bg: '#f7f9fe',
  white: '#ffffff',
  card: '#ffffff',
  ink: '#142841',
  muted: '#72849f',
  blue: '#37689f',
  mid: '#80a9e5',
  soft: '#e9f0fc',
  line: '#e8eef8',
  light: '#dce8fb',
  border: '#edf2fc',
  danger: '#ef4444',
  dangerSoft: '#fef2f2',
};

const DARK_THEME = {
  bg: '#0f172a',
  white: '#1e293b',
  card: '#1e293b',
  ink: '#f8fafc',
  muted: '#94a3b8',
  blue: '#60a5fa',
  mid: '#93c5fd',
  soft: '#334155',
  line: '#334155',
  light: '#1e293b',
  border: '#334155',
  danger: '#ef4444',
  dangerSoft: '#450a0a',
};

const ThemeContext = React.createContext({
  theme: LIGHT_THEME,
  isDarkMode: false,
  toggleTheme: () => { }
});
const useTheme = () => React.useContext(ThemeContext);

const API =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android'
    ? 'http://192.168.1.5:4000/api'
    : 'http://localhost:4000/api');

const today = () => new Date().toISOString().slice(0, 10);

function Chip({ label, active, onPress }) {
  const { theme: C } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: active ? C.blue : C.soft,
        paddingHorizontal: 13,
        paddingVertical: 9,
        borderRadius: 21,
        marginRight: 7,
        marginBottom: 6
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '700', color: active ? '#ffffff' : C.blue }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Card({ children, style }) {
  const { theme: C } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: C.card || C.white,
          borderRadius: 20,
          padding: 18,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: C.border || C.line
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function Title({ children, sub }) {
  const { theme: C } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 23, fontWeight: '700', color: C.ink }}>{children}</Text>
      {sub && (
        <Text
          style={{
            fontSize: 12,
            fontWeight: '400',
            color: C.muted,
            marginTop: 5,
            lineHeight: 17
          }}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

function Ring({ value = 65, size = 160, label = 'Mastered' }) {
  const { theme: C } = useTheme();
  const r = (size - 18) / 2;
  const circumference = 2 * Math.PI * r;
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: [{ rotate: '-90deg' }]
        }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.soft}
          strokeWidth={9}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.mid}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * safeValue / 100} ${circumference}`}
        />
      </Svg>

      <Text style={{ fontSize: 25, fontWeight: '700', color: C.ink }}>{safeValue}%</Text>
      <Text style={{ fontSize: 11, fontWeight: '400', color: C.muted }}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress, subtle = false, disabled = false }) {
  const { theme: C } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: subtle ? C.soft : C.blue,
        borderRadius: 12,
        paddingVertical: 13,
        paddingHorizontal: 17,
        alignItems: 'center',
        marginTop: 9,
        opacity: disabled ? 0.55 : 1
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '700', color: subtle ? C.blue : '#ffffff' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setEmail] = useState('student@abhyas.local');
  const [password, setPassword] = useState('Student123!');
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [tab, setTab] = useState('Dashboard');
  const [focusMode, setFocusMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Reset confirmation state belongs inside the App component.
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exitFocusConfirmOpen, setExitFocusConfirmOpen] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [analyticsRange, setAnalyticsRange] = useState('7');

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState('polity');
  const [mode, setMode] = useState('Pomodoro');
  const [customMinutes, setCustomMinutes] = useState(30);

  const [planTitle, setPlanTitle] = useState('');
  const [planMinutes, setPlanMinutes] = useState('45');
  const [notifOpen, setNotifOpen] = useState(false);

  // Timer and save reliability references.
  const interval = useRef(null);
  const savingSession = useRef(false);
  const activeStartedAt = useRef(null);
  const elapsedBase = useRef(0);
  const autoSaveTriggered = useRef(false);
  const nativePinningActive = useRef(false);
  const pinningPromptAttempted = useRef(false);

  // Android screen pinning for an active Deep Zen countdown.
  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeModules.FocusLock) {
      return;
    }

    const shouldPin = deepZenLocked && (running || elapsed > 0);

    
    if (
      shouldPin &&
      !nativePinningActive.current &&
      !pinningPromptAttempted.current
    ) {
      pinningPromptAttempted.current = true;

      NativeModules.FocusLock.startPinning()
        .then((status) => {
          nativePinningActive.current = Boolean(status?.active);

          if (status?.mode !== 'LOCKED') {
            console.warn(
              'Deep Zen enforcement status:',
              status?.mode ?? 'UNKNOWN'
            );
          }
        })
        .catch((error) => {
          nativePinningActive.current = false;
          console.warn('Deep Zen screen pinning failed:', error);

          Alert.alert(
            'Screen pinning unavailable',
            'Android could not start screen pinning. Strict app-switch prevention is not guaranteed on this device.'
          );
        });
    } else if (!shouldPin && nativePinningActive.current) {
      nativePinningActive.current = false;

      NativeModules.FocusLock.stopPinning().catch((error) => {
        console.warn('Could not stop screen pinning:', error);
      });
    }
  }, [deepZenLocked, running, elapsed]);

  // Recheck Android screen pinning when Abhyas returns to the foreground.
  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeModules.FocusLock) {
      return;
    }

    let checking = false;
    let mounted = true;

    const shouldKeepLocked = () =>
      deepZenLocked && (running || elapsed > 0);

    const subscription = AppState.addEventListener(
      'change',
      async (nextState) => {
        if (
          nextState !== 'active' ||
          !shouldKeepLocked() ||
          checking
        ) {
          return;
        }

        checking = true;

        try {
          const status =
            await NativeModules.FocusLock.getPinningStatus();

          if (!mounted || !shouldKeepLocked()) {
            return;
          }

          nativePinningActive.current = status.active;

          

          if (!status.active) {
            pinningPromptAttempted.current = true;

            const newStatus =
              await NativeModules.FocusLock.startPinning();

            if (mounted) {
              nativePinningActive.current = Boolean(newStatus?.active);

              if (newStatus?.mode !== 'LOCKED') {
                console.warn(
                  'Deep Zen recovery mode:',
                  newStatus?.mode ?? 'UNKNOWN'
                );
              }
            }
          }

        } catch (error) {
          nativePinningActive.current = false;
          console.warn(
            'Deep Zen foreground lock recovery failed:',
            error
          );
        } finally {
          checking = false;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [deepZenLocked, running, elapsed]);

  // Track when a student leaves Abhyas during an active Deep Zen session.
useEffect(() => {
  if (Platform.OS !== 'android') {
    return;
  }

  const subscription = AppState.addEventListener(
    'change',
    (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      const sessionActive =
        deepZenLocked && running && !deepZenUnlocked;

      const leftApp =
        previousState === 'active' &&
        (nextState === 'background' || nextState === 'inactive');

      if (sessionActive && leftApp) {
        setDeepZenInterruptions((count) => count + 1);

        console.warn(
          'Deep Zen interruption detected: Abhyas left the foreground.'
        );
      }

      if (
        sessionActive &&
        nextState === 'active' &&
        previousState !== 'active'
      ) {
        Alert.alert(
          'Stay focused',
          'You left Abhyas during Deep Zen. Return to your study session and continue focusing.'
        );
      }
    }
  );

  return () => subscription.remove();
}, [deepZenLocked, running, deepZenUnlocked]);

  // Load persistent theme preference on mount
  useEffect(() => {
    async function loadThemePreference() {
      try {
        const saved = await AsyncStorage.getItem('abhyas_theme_mode');
        if (saved !== null) {
          setIsDarkMode(saved === 'dark');
        }
      } catch (e) { }
    }
    loadThemePreference();
  }, []);

  const toggleTheme = async (nextValue) => {
    const next = typeof nextValue === 'boolean' ? nextValue : !isDarkMode;
    setIsDarkMode(next);
    try {
      await AsyncStorage.setItem('abhyas_theme_mode', next ? 'dark' : 'light');
    } catch (e) { }
  };

  const C = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const card = {
    backgroundColor: C.card || C.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border || C.line
  };

  const input = {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 11,
    color: C.ink
  };

  const txt = (size = 14, bold = false, color = C.ink) => ({
    fontSize: size,
    fontWeight: bold ? '700' : '400',
    color
  });

  const handleSignOut = async () => {
    if (savingSession.current) {
      Alert.alert(
        'Save in progress',
        'Wait until the session save finishes before signing out.'
      );
      return;
    }

    if (running || elapsed > 0) {
      Alert.alert(
        'Study session in progress',
        'Finish or reset your unsaved session before signing out.'
      );
      return;
    }

    setRunning(false);
    await AsyncStorage.removeItem('abhyasToken');
    setToken('');
    setUser(null);
    setTab('Dashboard');
  };

  async function req(route, method = 'GET', body, t = token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(API + route, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + t
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { error: `Request returned status ${response.status}` };
      }

      if (!response.ok) {
        throw Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw Error('Server is not responding. Check the backend connection and try again.');
      }

      if (
        error instanceof TypeError ||
        error.message === 'Network request failed'
      ) {
        throw Error('Cannot connect to the server. Check that the backend is running.');
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }


  async function refresh(t = token) {
    try {
      const [
        subjectData,
        historyData,
        planData,
        noteData,
        analyticsData
      ] = await Promise.all(
        [
          '/subjects',
          '/sessions',
          '/plan',
          '/notifications',
          '/analytics'
        ].map(route => req(route, 'GET', null, t))
      );

      setSubjects(subjectData);
      setSessions(historyData);
      setPlans(planData);
      setNotes(noteData);
      setAnalytics(analyticsData);

      return true;
    } catch (error) {
      Alert.alert('Connection error', error.message);
      return false;
    }
  }

  // Restore authentication on app startup.
  useEffect(() => {
    let mounted = true;
    const safetyTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 2000);

    async function restoreLogin() {
      try {
        const savedToken = await AsyncStorage.getItem('abhyasToken');

        if (savedToken) {
          try {
            const response = await req('/me', 'GET', null, savedToken);

            if (!mounted) return;

            setToken(savedToken);
            setUser(response.user);
            await refresh(savedToken);
          } catch {
            await AsyncStorage.removeItem('abhyasToken');
          }
        }
      } catch (error) {
        console.error('Unable to restore login:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    restoreLogin();

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Update the display using timestamps rather than counting timer ticks.

  // Update the timer using timestamps and automatically save completed Pomodoro sessions.

  // Update timer using timestamps and automatically save completed countdowns.
  useEffect(() => {
    if (!running || activeStartedAt.current === null) {
      return;
    }

    const countdownSeconds =
      mode === 'Pomodoro'
        ? 25 * 60
        : mode === 'Custom'
          ? customMinutes * 60
          : null;

    interval.current = setInterval(() => {
      const activeSeconds = Math.floor(
        (Date.now() - activeStartedAt.current) / 1000
      );

      const nextElapsed = elapsedBase.current + activeSeconds;

      if (
        countdownSeconds !== null &&
        nextElapsed >= countdownSeconds
      ) {
        // Freeze actual active study time at the selected duration.
        elapsedBase.current = countdownSeconds;
        activeStartedAt.current = null;

        setElapsed(countdownSeconds);
        setRunning(false);
        setDeepZenUnlocked(true);

        // Trigger the existing save flow once.
        if (!autoSaveTriggered.current) {
          autoSaveTriggered.current = true;
          void finish(true);
        }

        return;
      }

      setElapsed(nextElapsed);
    }, 250);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [running, mode, customMinutes]);




  // Clean up the timer interval when the component unmounts.
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  
    async function handleLogin(credentials) {
    if (credentials?.token && credentials?.user) {
      setToken(credentials.token);
      setUser(credentials.user);
      await AsyncStorage.setItem('abhyasToken', credentials.token);
      await AsyncStorage.setItem('abhyasUser', JSON.stringify(credentials.user));
      await refresh(credentials.token);
      return;
    }

    const isReg = credentials?.isRegister;
    const body = isReg
      ? { name: credentials.name, email: credentials.email, password: credentials.password }
      : { email: credentials.email, password: credentials.password };
    const route = isReg ? '/auth/register' : '/auth/login';

    try {
      const res = await req(route, 'POST', body);
      if (res?.token) {
        setToken(res.token);
        setUser(res.user);
        await AsyncStorage.setItem('abhyasToken', res.token);
        if (res.user) {
          await AsyncStorage.setItem('abhyasUser', JSON.stringify(res.user));
        }
        await refresh(res.token);
      }
    } catch (err) {
      Alert.alert('Authentication Error', err.message || 'Login failed');
    }
  }


  // Start a new session or resume a paused session.

  function startSession() {
    if (savingSession.current) return;
    if (activeStartedAt.current !== null) return;

    const limitSeconds =
      mode === 'Pomodoro'
        ? 25 * 60
        : mode === 'Custom'
          ? customMinutes * 60
          : null;

    if (limitSeconds !== null && elapsed >= limitSeconds) {
      Alert.alert(
        'Timer complete',
        'Your countdown has finished. Save the session or reset the timer before starting again.'
      );
      return;
    }

    activeStartedAt.current = Date.now();
    setRunning(true);
  }


  // Accumulate only active study time.
  function pauseSession() {
    if (savingSession.current) return;
    if (activeStartedAt.current === null) return;

    const activeSeconds = Math.floor(
      (Date.now() - activeStartedAt.current) / 1000
    );

    elapsedBase.current += activeSeconds;
    activeStartedAt.current = null;

    setElapsed(elapsedBase.current);
    setRunning(false);
  }

  // Open the in-app reset confirmation dialog.
  function resetSession() {
    if (savingSession.current || deepZenLocked) return;
    setResetConfirmOpen(true);
  }

  // Cancel must not change the timer or elapsed time.
  function cancelReset() {
    setResetConfirmOpen(false);
  }

  // Confirmed reset stops the timer and clears elapsed time.
  function confirmReset() {
    if (savingSession.current || deepZenLocked) return;

    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }

    activeStartedAt.current = null;
    elapsedBase.current = 0;

    setRunning(false);
    setElapsed(0);
    setResetConfirmOpen(false);
  }

  // Save the session with a synchronous duplicate-submit guard.
  async function finish(automatic = false) {
  if (savingSession.current || (deepZenLocked && !automatic)) return;

    const finalElapsed =
      elapsedBase.current +
      (activeStartedAt.current !== null
        ? Math.floor(
          (Date.now() - activeStartedAt.current) / 1000
        )
        : 0);

    if (finalElapsed <= 0) {
      Alert.alert('No study time', 'Start a session before saving.');
      return;
    }

    savingSession.current = true;

    // Freeze the timer at its final duration.
    activeStartedAt.current = null;
    elapsedBase.current = finalElapsed;

    setRunning(false);
    setElapsed(finalElapsed);

    const minutes = Math.max(1, Math.round(finalElapsed / 60));

    try {
      await req('/sessions', 'POST', {
        subjectId: selected,
        minutes,
        focusScore: 94,
        mode
      });

      // Clear timer state only after the POST succeeds.
      elapsedBase.current = 0;
      activeStartedAt.current = null;
      setElapsed(0);

      const refreshed = await refresh();

      if (refreshed) {
        Alert.alert('Session saved', `${minutes} minute(s) logged`);
      } else {
        Alert.alert(
          'Session submitted',
          'The server accepted your session, but history could not be refreshed. Reopen Analytics to verify it.'
        );
      }
    } catch (error) {
      // Keep the time available for a retry.
      elapsedBase.current = finalElapsed;
      activeStartedAt.current = null;

      setElapsed(finalElapsed);
      setRunning(false);

      Alert.alert(
        'Save failed',
        `Your timer value has been kept. Check your connection before retrying.\n\n${error.message}`
      );
    } finally {
      savingSession.current = false;
    }
  }

  async function addPlan() {
    if (!planTitle.trim()) return;

    try {
      await req('/plan', 'POST', {
        title: planTitle,
        minutes: Number(planMinutes) || 45,
        date: today(),
        subjectId: selected
      });

      setPlanTitle('');
      await refresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async function markPlan(plan) {
    try {
      await req('/plan/' + plan.id, 'PATCH', {
        done: !plan.done
      });

      await refresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async function markNote(note) {
    try {
      await req('/notifications/' + note.id + '/read', 'PATCH');
      await refresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: C.bg,
          minHeight: Platform.OS === 'web' ? '100vh' : '100%',
          height: '100%'
        }}
      >
        <ActivityIndicator size="large" color={C.blue} />
      </View>
    );
  }

  if (!token) {
    return (
      <ThemeContext.Provider value={{ theme: C, ...C, isDarkMode, toggleTheme }}>
        <View
          style={{
            flex: 1,
            backgroundColor: C.bg,
            minHeight: Platform.OS === 'web' ? '100vh' : '100%',
            height: '100%'
          }}
        >
          <AuthScreens
            onLogin={handleLogin}
            apiUrl={API}
            isDark={isDarkMode}
            onToggleTheme={toggleTheme}
          />
        </View>
      </ThemeContext.Provider>
    );
  }

  const total = analytics.totalMinutes || 0;
  const focus = analytics.averageFocus || 0;

  const unread = notes.filter(
    note => !(note.readBy || []).includes(user?.id)
  );

  const completion = subjects.length
    ? Math.round(
      100 *
      subjects.reduce((sum, subject) => sum + subject.completed, 0) /
      Math.max(
        1,
        subjects.reduce((sum, subject) => sum + subject.topics, 0)
      )
    )
    : 0;

  const Dashboard = () => {
    // Real calculation of today's study progress from recorded sessions
    const todayDateStr = today();
    const todaySessions = sessions.filter(
      s => s.startedAt && s.startedAt.slice(0, 10) === todayDateStr
    );
    const todayMinutes = todaySessions.reduce(
      (sum, s) => sum + (Number(s.minutes) || 0),
      0
    );
    const dailyGoalMinutes = 480; // Standard 8h 00m daily target
    const progressPercent = Math.min(
      100,
      Math.round((todayMinutes / dailyGoalMinutes) * 100)
    );
    const todayHours = Math.floor(todayMinutes / 60);
    const todayMinsRemainder = todayMinutes % 60;
    const remainingMinutes = Math.max(0, dailyGoalMinutes - todayMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinsRemainder = remainingMinutes % 60;

    // Time-based greeting & student name
    const currentHour = new Date().getHours();
    const greetingText =
      currentHour < 12
        ? 'Good morning'
        : currentHour < 17
          ? 'Good afternoon'
          : 'Good evening';
    const studentFirstName = user?.name ? user.name.trim().split(' ')[0] : 'Aspirant';

    // Upcoming or active study plan
    const activePlan =
      plans.find(p => !p.done && p.date === todayDateStr) ||
      plans.find(p => !p.done);
    const selectedSubjectObj = subjects.find(
      s => s.id === (activePlan?.subjectId || selected)
    );

    // Quick actions connecting directly to existing working app features
    const quickActions = [
      {
        id: 'timer',
        title: 'Focus Timer',
        subtitle: 'Start Session',
        icon: 'stopwatch-outline',
        onPress: () => setTab('Timer')
      },
      {
        id: 'planner',
        title: 'Study Plan',
        subtitle:
          plans.filter(p => !p.done).length > 0
            ? `${plans.filter(p => !p.done).length} active`
            : 'Schedule',
        icon: 'calendar-outline',
        onPress: () => setTab('Planner')
      },
      {
        id: 'syllabus',
        title: 'Syllabus',
        subtitle: `${completion}% done`,
        icon: 'book-outline',
        onPress: () => setTab('Syllabus')
      },
      {
        id: 'analytics',
        title: 'Reports',
        subtitle: `${Math.floor(total / 60)}h logged`,
        icon: 'analytics-outline',
        onPress: () => setTab('Analytics')
      },
      {
        id: 'attendance',
        title: 'Attendance',
        subtitle:
          todaySessions.length > 0
            ? 'Present today'
            : '14-Day streak',
        icon: 'calendar-number-outline',
        onPress: () =>
          Alert.alert(
            'Study Attendance',
            todaySessions.length > 0
              ? `Status: Present\n\nYou have logged ${todayHours}h ${todayMinsRemainder}m across ${todaySessions.length} session(s) today.`
              : `Status: Not yet marked today\n\nStart a focus session from the timer to record today's attendance.`,
            todaySessions.length > 0
              ? [{ text: 'OK' }]
              : [
                  { text: 'Start Session', onPress: () => setTab('Timer') },
                  { text: 'Cancel', style: 'cancel' }
                ]
          )
      },
      {
        id: 'quiz',
        title: 'Quiz',
        subtitle: 'Coming Soon',
        icon: 'help-circle-outline',
        onPress: () =>
          Alert.alert(
            'Daily Quiz & MCQs',
            'Prelims practice questions and topic-wise mock tests are coming in the next update. Keep completing your syllabus topics in the meantime.',
            [
              { text: 'View Syllabus', onPress: () => setTab('Syllabus') },
              { text: 'OK' }
            ]
          )
      }
    ];

    return (
      <>
        {/* Top Badges */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}
        >
          <Chip label="≡ƒöÑ 14-Day Streak" active />
          <Chip label="UPSC / MPSC 2026" />
        </View>

        {/* Personalized Welcome Header */}
        <Title sub="Your study sanctuary ΓÇó One session at a time">
          {greetingText}, {studentFirstName}!
        </Title>

        {/* Revision Alert Banner (Shown when unread reminders exist) */}
        {unread.length > 0 && (
          <TouchableOpacity
            onPress={() => setNotifOpen(true)}
            activeOpacity={0.8}
            style={[
              card,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderColor: C.blue,
                borderLeftWidth: 4,
                borderLeftColor: C.blue,
                marginBottom: 14
              }
            ]}
            accessibilityLabel="Unread revision alerts"
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: C.soft,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}
            >
              <Ionicons name="notifications" size={19} color={C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={txt(14, true, C.ink)}>
                {unread.length} Revision Alert{unread.length > 1 ? 's' : ''}
              </Text>
              <Text
                numberOfLines={1}
                style={[txt(12, false, C.muted), { marginTop: 2 }]}
              >
                {unread[0].title || unread[0].message}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>
        )}

        {/* Today's Study Progress Card */}
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}
          >
            <Text style={txt(15, true, C.ink)}>Today's Study Progress</Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 12,
                backgroundColor: C.soft
              }}
            >
              <Text style={txt(11, true, C.blue)}>
                {todaySessions.length}{' '}
                {todaySessions.length === 1 ? 'session' : 'sessions'}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Ring
              value={progressPercent}
              size={168}
              label={
                todayMinutes > 0
                  ? `${todayHours}h ${todayMinsRemainder}m logged`
                  : '0h 00m logged'
              }
            />
          </View>

          {/* 3-Column Metrics Breakdown */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingVertical: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: C.line,
              marginBottom: 12
            }}
          >
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={txt(11, false, C.muted)}>Logged Today</Text>
              <Text style={[txt(14, true, C.ink), { marginTop: 3 }]}>
                {todayHours}h {todayMinsRemainder}m
              </Text>
            </View>
            <View style={{ width: 1, height: 26, backgroundColor: C.line }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={txt(11, false, C.muted)}>Daily Goal</Text>
              <Text style={[txt(14, true, C.ink), { marginTop: 3 }]}>
                8h 00m
              </Text>
            </View>
            <View style={{ width: 1, height: 26, backgroundColor: C.line }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={txt(11, false, C.muted)}>Remaining</Text>
              <Text
                style={[
                  txt(
                    14,
                    true,
                    remainingMinutes === 0 ? C.blue : C.ink
                  ),
                  { marginTop: 3 }
                ]}
              >
                {remainingMinutes === 0
                  ? 'Goal Met! ≡ƒÄë'
                  : `${remainingHours}h ${remainingMinsRemainder}m`}
              </Text>
            </View>
          </View>

          {todayMinutes === 0 && (
            <Text
              style={[
                txt(12, false, C.muted),
                { textAlign: 'center', marginBottom: 10, lineHeight: 17 }
              ]}
            >
              No sessions logged today yet. Ready to start your preparation?
            </Text>
          )}

          <Button
            label="Γû╢ Start Studying Now"
            onPress={() => setTab('Timer')}
          />
        </Card>

        {/* Study Motivation / Daily Encouragement */}
        <Card style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              gap: 6
            }}
          >
            <Ionicons name="bulb-outline" size={16} color={C.blue} />
            <Text style={txt(11, true, C.blue)}>DAILY STUDY ENCOURAGEMENT</Text>
          </View>
          <Text
            style={[
              txt(13, false, C.ink),
              { fontStyle: 'italic', lineHeight: 19 }
            ]}
          >
            "Discipline is choosing between what you want now and what you want most. Every focused hour brings you closer to the civil services list."
          </Text>
          <Text style={[txt(11, false, C.muted), { marginTop: 6 }]}>
            Abhyas Discipline ΓÇó MPSC & UPSC Aspirants
          </Text>
        </Card>

        {/* Quick Actions (Direct access to working app features) */}
        <View style={{ marginBottom: 14 }}>
          <Text style={[txt(14, true, C.ink), { marginBottom: 10 }]}>
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                activeOpacity={0.75}
                style={{
                  width: '31%',
                  backgroundColor: C.card || C.white,
                  borderRadius: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: C.border || C.line
                }}
                accessibilityLabel={action.title}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 11,
                    backgroundColor: C.soft,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 6
                  }}
                >
                  <Ionicons name={action.icon} size={20} color={C.blue} />
                </View>
                <Text
                  numberOfLines={1}
                  style={[txt(12, true, C.ink), { textAlign: 'center' }]}
                >
                  {action.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    txt(10, false, C.muted),
                    { marginTop: 2, textAlign: 'center' }
                  ]}
                >
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Study Briefing & Prep */}
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6
            }}
          >
            <Text style={txt(15, true, C.ink)}>Study Briefing & Prep</Text>
            <Ionicons name="flag-outline" size={17} color={C.blue} />
          </View>

          <Text style={[txt(12, false, C.muted), { marginTop: 4 }]}>
            {activePlan
              ? `${selectedSubjectObj?.name || 'General Studies'} ΓÇó Target Task`
              : `${selectedSubjectObj?.name || 'Indian Polity'} ΓÇó Standard Session`}
          </Text>

          <Text style={[txt(18, true, C.ink), { marginTop: 6 }]}>
            {activePlan?.title || 'Chapter 7 ΓÇó Fundamental Rights'}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 4,
              gap: 16
            }}
          >
            <Text style={txt(12, false, C.muted)}>
              Target Focus Block:{' '}
              <Text style={{ fontWeight: '700', color: C.ink }}>
                {activePlan ? `${activePlan.minutes}m` : '1h 30m'}
              </Text>
            </Text>
          </View>

          <Button
            label="Open Focus Timer"
            subtle
            onPress={() => setTab('Timer')}
          />
        </Card>

        {/* Chapter Milestone & Syllabus Mastery */}
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <Text style={txt(15, true, C.ink)}>Syllabus Milestone</Text>
            <TouchableOpacity onPress={() => setTab('Syllabus')}>
              <Text style={txt(11, true, C.blue)}>View All ΓåÆ</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingVertical: 6
            }}
          >
            <Ring value={completion} size={130} label="Mastered" />

            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={txt(13, true, C.ink)}>
                {subjects.reduce(
                  (sum, subject) => sum + (subject.completed || 0),
                  0
                )}{' '}
                of{' '}
                {subjects.reduce(
                  (sum, subject) => sum + (subject.topics || 0),
                  0
                )}{' '}
                Topics
              </Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 6 }]}>
                Average Focus: {focus}%
              </Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 4 }]}>
                {subjects.length} active syllabus subjects
              </Text>
            </View>
          </View>
        </Card>
      </>
    );
  };


  const Syllabus = () => (
    <>
      <Title sub="Track completion, mastery and revision flags">
        Subjects & Syllabus
      </Title>

      <Card>
        <Text style={txt(13, true)}>Overall Completion</Text>
        <Text style={[txt(25, true), { marginVertical: 10 }]}>
          {completion}%
        </Text>

        <View
          style={{
            height: 9,
            backgroundColor: C.soft,
            borderRadius: 10
          }}
        >
          <View
            style={{
              backgroundColor: C.blue,
              width: completion + '%',
              height: 9,
              borderRadius: 10
            }}
          />
        </View>

        <Text style={[txt(11, false, C.muted), { marginTop: 10 }]}>
          {subjects.reduce((sum, subject) => sum + subject.completed, 0)} /{' '}
          {subjects.reduce((sum, subject) => sum + subject.topics, 0)} Topics
          Mastered
        </Text>
      </Card>

      <Card>
        <Text style={txt(15, true)}>Spaced Revision Queue</Text>
        <Button
          label="Review Notifications ├óΓÇáΓÇÖ"
          subtle
          onPress={() => setNotifOpen(true)}
        />
      </Card>

      {subjects.map(subject => (
        <Card key={subject.id}>
          <Text style={txt(17, true)}>{subject.name}</Text>

          <Text style={[txt(12, false, C.muted), { marginTop: 5 }]}>
            {subject.paper} • {subject.completed}/{subject.topics} topics
            mastered
          </Text>

          <View
            style={{
              height: 7,
              backgroundColor: C.soft,
              borderRadius: 6,
              marginTop: 15
            }}
          >
            <View
              style={{
                backgroundColor: C.mid,
                height: 7,
                borderRadius: 6,
                width:
                  Math.round(
                    (100 * subject.completed) / Math.max(1, subject.topics)
                  ) + '%'
              }}
            />
          </View>
        </Card>
      ))}
    </>
  );

  const Planner = () => (
    <>
      <Title sub="Today's schedule & smart workload balance">
        Study Planner
      </Title>

      <Card>
        <Text style={txt(15, true)}>Today's Plan • {today()}</Text>

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Chip label="Today's Plan" active />
          <Chip label="Weekly View" />
          <Chip label="Routine" />
        </View>
      </Card>

      {plans.map(plan => (
        <Card key={plan.id}>
          <TouchableOpacity
            onPress={() => markPlan(plan)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12
            }}
          >
            <Ionicons
              name={plan.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={26}
              color={C.blue}
            />

            <View style={{ flex: 1 }}>
              <Text style={txt(15, true)}>{plan.title}</Text>
              <Text style={txt(12, false, C.muted)}>
                {plan.date} • {plan.minutes} mins •{' '}
                {plan.done ? 'Completed' : 'Scheduled'}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      ))}

      <Card>
        <Text style={txt(16, true)}>Add Study Block</Text>

        <TextInput
          placeholder="Topic or chapter"
          style={input}
          value={planTitle}
          onChangeText={setPlanTitle}
        />

        <TextInput
          keyboardType="numeric"
          placeholder="Minutes"
          style={input}
          value={planMinutes}
          onChangeText={setPlanMinutes}
        />

        <Button label="+ Add to Planner" onPress={addPlan} />
        <TouchableOpacity
          onPress={async () => {
            const studySlots = [
              { title: 'Core Concept & Standard Reference', durationMinutes: 90, defaultSubjectId: subjects[0]?.id || 'upsc-polity' },
              { title: 'Deep Focus Problem Solving / Answer Writing', durationMinutes: 120, defaultSubjectId: subjects[1]?.id || 'upsc-history-culture' },
              { title: 'Current Affairs & Daily Newspaper Analysis', durationMinutes: 60, defaultSubjectId: subjects[2]?.id || 'upsc-current-affairs' },
              { title: 'Active Spaced Revision & Mock Practice', durationMinutes: 60, defaultSubjectId: subjects[3]?.id || 'upsc-economy' }
            ];
            try {
              for (const slot of studySlots) {
                await req('/plan', 'POST', {
                  title: slot.title,
                  subjectId: slot.defaultSubjectId,
                  exam: 'UPSC',
                  minutes: slot.durationMinutes,
                  date: today(),
                  done: false
                });
              }
              await refresh();
              Alert.alert('Routine Applied', 'Daily 4-Slot Study Routine added to today\'s plan!');
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          }}
          style={{
            backgroundColor: C.soft,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            marginTop: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: C.blue
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
            + Apply Daily 4-Slot Study Routine
          </Text>
        </TouchableOpacity>
      </Card>

      <Card>
        <Text style={txt(15, true)}>Workload Capacity</Text>

        <Text style={[txt(12, false, C.muted), { marginTop: 7 }]}>
          {plans
            .filter(plan => plan.date === today() && !plan.done)
            .reduce((sum, plan) => sum + plan.minutes, 0)}{' '}
          minutes planned today • 8h capacity
        </Text>
      </Card>
    </>
  );

  
  const Analytics = () => {
    const [analyticsTab, setAnalyticsTab] = useState('Overview');
    const allDaily = Array.isArray(analytics.daily) ? analytics.daily : [];
    const chartDays = allDaily.slice(analyticsRange === '7' ? -7 : -30);

    const today = new Date();
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    const todayMinutes = Number(
      allDaily.find(day => day.date === todayKey)?.minutes
    ) || 0;

    const dailyGoalMinutes = 120;
    const goalProgress = Math.min(
      100,
      Math.round((todayMinutes / dailyGoalMinutes) * 100)
    );

    const visibleDates = new Set(chartDays.map(day => day.date));
    const rangeSessions = sessions.filter(
      session =>
        session.startedAt &&
        visibleDates.has(session.startedAt.slice(0, 10))
    );

    const rangeMinutes = chartDays.reduce(
      (sum, day) => sum + (Number(day.minutes) || 0),
      0
    );

    const maxMinutes = Math.max(
      1,
      ...chartDays.map(day => Number(day.minutes) || 0)
    );

    const rangeFocus = rangeSessions.length
      ? Math.round(
          rangeSessions.reduce(
            (sum, session) => sum + (Number(session.focusScore) || 0),
            0
          ) / rangeSessions.length
        )
      : 0;

    const averageSession = rangeSessions.length
      ? Math.round(rangeMinutes / rangeSessions.length)
      : 0;

    const subjectTotals = rangeSessions.reduce((result, session) => {
      const subject = subjects.find(
        item => item.id === session.subjectId
      );
      const key = session.subjectId || 'unassigned';

      if (!result[key]) {
        result[key] = {
          name: subject?.name || 'Unassigned',
          minutes: 0,
          count: 0
        };
      }

      result[key].minutes += Number(session.minutes) || 0;
      result[key].count += 1;
      return result;
    }, {});

    const subjectRows = Object.values(subjectTotals).sort(
      (a, b) => b.minutes - a.minutes
    );

    const recentSessions = rangeSessions
      .slice()
      .sort((a, b) =>
        (b.startedAt || '').localeCompare(a.startedAt || '')
      )
      .slice(0, 8);

    const activeDays = chartDays.filter(
      day => (Number(day.minutes) || 0) > 0
    ).length;

    const formatMinutes = value => {
      const minutes = Math.max(0, Number(value) || 0);
      const hours = Math.floor(minutes / 60);
      const remainder = Math.round(minutes % 60);

      return hours
        ? `${hours}h ${remainder}m`
        : `${remainder}m`;
    };

    const sectionSubtitle = {
      marginTop: 5,
      marginBottom: 16
    };

    const sectionHeading = txt(16, true);

    return (
      <>
        <Title sub="Understand your habits, track progress and build consistency">
          Study Analytics
        </Title>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <Text style={txt(12, false, C.muted)}>
            Your study overview
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Chip
              label="7 Days"
              active={analyticsRange === '7'}
              onPress={() => setAnalyticsRange('7')}
            />
            <View style={{ width: 6 }} />
            <Chip
              label="30 Days"
              active={analyticsRange === '30'}
              onPress={() => setAnalyticsRange('30')}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingBottom: 12,
            paddingRight: 4
          }}
        >
          {['Overview', 'Activity', 'Subjects', 'Sessions'].map(tab => (
            <Chip
              key={tab}
              label={tab}
              active={analyticsTab === tab}
              onPress={() => setAnalyticsTab(tab)}
            />
          ))}
        </ScrollView>

        {analyticsTab === 'Overview' && (
          <>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={txt(17, true)}>Today's Study Goal</Text>
              <Text
                style={[
                  txt(12, false, C.muted),
                  { marginTop: 6, lineHeight: 19 }
                ]}
              >
                Build a daily habit, one focused session at a time.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: C.soft,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12
              }}
            >
              <Text style={txt(11, true, C.blue)}>
                {goalProgress}% done
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: 18,
              marginBottom: 8
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ring
                value={goalProgress}
                size={125}
                label="Daily goal"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 18 }}>
              <Text style={txt(22, true)}>
                {formatMinutes(todayMinutes)}
              </Text>
              <Text
                style={[
                  txt(12, false, C.muted),
                  { marginTop: 4 }
                ]}
              >
                studied today
              </Text>

              <View
                style={{
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: C.soft,
                  overflow: 'hidden',
                  marginTop: 14
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${goalProgress}%`,
                    backgroundColor: C.blue,
                    borderRadius: 8
                  }}
                />
              </View>

              <Text
                style={[
                  txt(11, false, C.muted),
                  { marginTop: 7 }
                ]}
              >
                {todayMinutes >= dailyGoalMinutes
                  ? 'Daily goal reached!'
                  : `${formatMinutes(
                      dailyGoalMinutes - todayMinutes
                    )} remaining of 2h`}
              </Text>
            </View>
          </View>
        </Card>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 4
          }}
        >
          {[
            {
              label: 'Study Time',
              value: formatMinutes(rangeMinutes),
              detail: 'Total recorded'
            },
            {
              label: 'Sessions',
              value: String(rangeSessions.length),
              detail: 'Completed records'
            },
            {
              label: 'Average Focus',
              value: `${rangeFocus}%`,
              detail: 'Recorded focus score'
            },
            {
              label: 'Avg. Session',
              value: formatMinutes(averageSession),
              detail: 'Per recorded session'
            }
          ].map((item, index) => (
            <View
              key={item.label}
              style={[
                card,
                {
                  width: '48%',
marginBottom: 10,
padding: 15,
borderRadius: 16,
backgroundColor: [
  '#EEF2FF',
  '#E6FFFA',
  '#FFF1E6',
  '#FCE7F3'
][index % 4],
borderWidth: 1,
borderColor: [
  '#C7D2FE',
  '#99F6E4',
  '#FED7AA',
  '#FBCFE8'
][index % 4]
                }
              ]}
            >
              <View
                style={{
                  width: 34,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor:
                    index % 2 === 0 ? C.blue : C.muted,
                  marginBottom: 12
                }}
              />

              <Text style={txt(11, false, C.muted)}>
                {item.label}
              </Text>
              <Text
                style={[
                  txt(22, true),
                  { marginTop: 8 }
                ]}
              >
                {item.value}
              </Text>
              <Text
                style={[
                  txt(10, false, C.muted),
                  { marginTop: 5 }
                ]}
              >
                {item.detail}
              </Text>
            </View>
          ))}
        </View>
                  <Card>
          <Text style={sectionHeading}>Focus Quality</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            Average focus score from recorded sessions.
          </Text>

          <View
            style={{
              alignItems: 'center',
              paddingVertical: 12
            }}
          >
            <Ring
              value={rangeFocus}
              size={155}
              label="Average focus"
            />
          </View>

          <Text
            style={[
              txt(12, false, C.muted),
              { textAlign: 'center', lineHeight: 19 }
            ]}
          >
            {rangeSessions.length
              ? `Based on ${rangeSessions.length} recorded ${
                  rangeSessions.length === 1 ? 'session' : 'sessions'
                } in this period.`
              : 'Complete a study session to begin tracking focus quality.'}
          </Text>
        </Card>
</>
        )}


        {analyticsTab === 'Activity' && (
          <>
        <Card>
          <Text style={sectionHeading}>Daily Study Activity</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            {analyticsRange === '7'
              ? 'Minutes studied each day this week'
              : 'Minutes studied across the selected month'}
          </Text>

          {chartDays.length === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              Daily analytics are not available yet. Refresh after the API is running.
            </Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                height: 155,
                justifyContent: 'space-between'
              }}
            >
              {chartDays.map((day, index) => {
                const minutes = Number(day.minutes) || 0;
                const barHeight =
                  minutes > 0
                    ? Math.max(5, (minutes / maxMinutes) * 105)
                    : 3;

                const date = new Date(`${day.date}T12:00:00`);
                const label =
                  analyticsRange === '7'
                    ? date.toLocaleDateString(undefined, {
                        weekday: 'short'
                      })
                    : date.getDate() % 5 === 0 || index === 0
                      ? String(date.getDate())
                      : '';

                return (
                  <View
                    key={day.date}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '100%'
                    }}
                  >
                    {minutes > 0 && analyticsRange === '7' && (
                      <Text style={txt(9, false, C.muted)}>
                        {minutes}
                      </Text>
                    )}

                    <View
                      style={{
                        width: analyticsRange === '7' ? '55%' : '65%',
                        maxWidth: 18,
                        height: barHeight,
                        borderRadius: 5,
                        backgroundColor:
  minutes > 0
    ? [
        '#5B6CFF',
        '#22B8A7',
        '#FF9F43',
        '#E879F9',
        '#F06464',
        '#38BDF8',
        '#A3E635'
      ][index % 7]
    : C.soft,
                        marginTop: 5
                      }}
                    />

                    <Text
                      style={[
                        txt(9, false, C.muted),
                        { marginTop: 7, height: 14 }
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderColor: C.line,
              marginTop: 14,
              paddingTop: 13,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View>
              <Text style={txt(11, false, C.muted)}>
                Total study time
              </Text>
              <Text
                style={[
                  txt(17, true),
                  { marginTop: 4 }
                ]}
              >
                {formatMinutes(rangeMinutes)}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={txt(11, false, C.muted)}>
                Active days
              </Text>
              <Text
                style={[
                  txt(17, true),
                  { marginTop: 4 }
                ]}
              >
                {activeDays} / {chartDays.length}
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={sectionHeading}>Study Consistency</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            Each square represents one day. Stronger color means more study time.
          </Text>

          {chartDays.length === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              Activity will appear when daily analytics are available.
            </Text>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6
                }}
              >
                {chartDays.map(day => {
                  const minutes = Number(day.minutes) || 0;
                  const intensity =
                    minutes === 0
                      ? 0
                      : Math.ceil((minutes / maxMinutes) * 4);

                  return (
                    <View
                      key={day.date}
                      style={{
                        width: analyticsRange === '7' ? '12%' : '8.2%',
                        aspectRatio: 1,
                        minWidth: 14,
                        maxWidth: 28,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          intensity === 0
                            ? C.soft
                            : intensity === 1
                              ? C.line
                              : intensity === 2
                                ? C.muted
                                : C.blue
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          color:
                            intensity >= 3
                              ? '#FFFFFF'
                              : C.muted
                        }}
                      >
                        {new Date(
                          `${day.date}T12:00:00`
                        ).getDate()}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16
                }}
              >
                <Text style={txt(11, false, C.muted)}>
                  {activeDays} active days
                </Text>
                <Text style={txt(11, false, C.muted)}>
                  {chartDays.length - activeDays} days without study
                </Text>
              </View>
            </>
          )}
        </Card>
          </>
        )}


        
        {analyticsTab === 'Subjects' && (
        <Card>
          <Text style={txt(17, true)}>Subject Breakdown</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              { marginTop: 5, marginBottom: 18 }
            ]}
          >
            See how your study time is distributed across subjects.
          </Text>

          {subjectRows.length === 0 ||
          subjectRows.reduce(
            (sum, subject) => sum + subject.minutes,
            0
          ) === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              No subject study time recorded for this period.
            </Text>
          ) : (
            <>
              {/*
                Donut chart based on actual subject minutes.
                Each segment represents one subject.
              */}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22
                }}
              >
                <View
                  style={{
                    width: 210,
                    height: 210,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {(() => {
                    const chartColors = [
                      '#5B6CFF',
                      '#22B8A7',
                      '#FF9F43',
                      '#E879F9',
                      '#F06464',
                      '#38BDF8',
                      '#A3E635',
                      '#F472B6'
                    ];

                    const total = subjectRows.reduce(
                      (sum, subject) => sum + subject.minutes,
                      0
                    );

                    const radius = 68;
                    const strokeWidth = 25;
                    const circumference = 2 * Math.PI * radius;
                    let offset = 0;

                    return (
                      <>
                        <Svg
                          width={190}
                          height={190}
                          viewBox="0 0 200 200"
                        >
                          <Circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={C.soft}
                            strokeWidth={strokeWidth}
                          />

                          {subjectRows.map((subject, index) => {
                            const fraction = subject.minutes / total;
                            const segmentLength =
                              fraction * circumference;
                            const currentOffset = offset;

                            offset += segmentLength;

                            return (
                              <Circle
                                key={subject.name}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke={
                                  chartColors[
                                    index % chartColors.length
                                  ]
                                }
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLength} ${
                                  circumference - segmentLength
                                }`}
                                strokeDashoffset={-currentOffset}
                                strokeLinecap="butt"
                                rotation={-90}
                                origin="100, 100"
                              />
                            );
                          })}
                        </Svg>

                        <View
                          style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text style={txt(11, false, C.muted)}>
                            Total studied
                          </Text>
                          <Text
                            style={[
                              txt(22, true),
                              { marginTop: 5 }
                            ]}
                          >
                            {formatMinutes(total)}
                          </Text>
                          <Text
                            style={[
                              txt(10, false, C.muted),
                              { marginTop: 4 }
                            ]}
                          >
                            {subjectRows.length}{' '}
                            {subjectRows.length === 1
                              ? 'subject'
                              : 'subjects'}
                          </Text>
                        </View>
                      </>
                    );
                  })()}
                </View>
              </View>

              <View
                style={{
                  backgroundColor: C.soft,
                  borderRadius: 14,
                  padding: 13,
                  marginBottom: 18,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View>
                  <Text style={txt(11, false, C.muted)}>
                    Total sessions
                  </Text>
                  <Text
                    style={[
                      txt(18, true),
                      { marginTop: 5 }
                    ]}
                  >
                    {subjectRows.reduce(
                      (sum, subject) => sum + subject.count,
                      0
                    )}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={txt(11, false, C.muted)}>
                    Leading subject
                  </Text>
                  <Text
                    style={[
                      txt(14, true),
                      { marginTop: 5 }
                    ]}
                  >
                    {subjectRows
                      .slice()
                      .sort((a, b) => b.minutes - a.minutes)[0]
                      .name}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  txt(13, true),
                  { marginBottom: 13 }
                ]}
              >
                Subject details
              </Text>

              {subjectRows.map((subject, index) => {
                const chartColors = [
                  '#5B6CFF',
                  '#22B8A7',
                  '#FF9F43',
                  '#E879F9',
                  '#F06464',
                  '#38BDF8',
                  '#A3E635',
                  '#F472B6'
                ];

                const total = subjectRows.reduce(
                  (sum, item) => sum + item.minutes,
                  0
                );

                const percentage = total > 0
                  ? Math.round((subject.minutes / total) * 100)
                  : 0;

                const color =
                  chartColors[index % chartColors.length];

                return (
                  <View
                    key={subject.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth:
                        index === subjectRows.length - 1 ? 0 : 1,
                      borderColor: C.line
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: color,
                        marginRight: 11
                      }}
                    />

                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={txt(13, true)}>
                        {subject.name}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {subject.count}{' '}
                        {subject.count === 1
                          ? 'session'
                          : 'sessions'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={txt(13, true)}>
                        {formatMinutes(subject.minutes)}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </Card>
        )}
{analyticsTab === 'Sessions' && (
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}
          >
            <Text style={sectionHeading}>Recent Sessions</Text>
            <Text style={txt(11, false, C.muted)}>
              Latest {recentSessions.length}
            </Text>
          </View>

          <Text
            style={[
              txt(12, false, C.muted),
              { marginTop: 5, marginBottom: 8 }
            ]}
          >
            Your latest recorded study sessions in this period.
          </Text>

          {recentSessions.length === 0 ? (
            <Text
              style={[
                txt(12, false, C.muted),
                { marginTop: 12 }
              ]}
            >
              No sessions recorded during this period.
            </Text>
          ) : (
            recentSessions.map((session, index) => {
              const subjectName = subjects.find(
                subject => subject.id === session.subjectId
              )?.name || 'Study Session';

              return (
                <View
                  key={session.id || `${session.startedAt}-${index}`}
                  style={{
                    paddingVertical: 13,
                    borderBottomWidth:
                      index === recentSessions.length - 1 ? 0 : 1,
                    borderColor: C.line
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: C.soft,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 11
                      }}
                    >
                      <Text style={txt(11, true, C.blue)}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={txt(13, true)}>
                        {subjectName}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 5 }
                        ]}
                      >
                        {session.startedAt
                          ? new Date(
                              session.startedAt
                            ).toLocaleDateString()
                          : 'Date unavailable'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={txt(13, true)}>
                        {formatMinutes(session.minutes)}
                      </Text>
                      <Text
                        style={[
                          txt(10, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {Number(session.focusScore) || 0}% focus
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Card>
        )}

      </>
    );
  };


  const tabs = [
    ['Dashboard', 'home-outline'],
    ['Timer', 'stopwatch-outline'],
    ['Syllabus', 'book-outline'],
    ['Planner', 'calendar-outline'],
    ['Analytics', 'analytics-outline'],
    ['Ticket Support', 'headset-outline']
  ];

  return (
    <ThemeContext.Provider value={{ theme: C, isDarkMode, toggleTheme }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: C.bg,
          minHeight: Platform.OS === 'web' ? '100vh' : '100%',
          height: '100%',
          paddingTop:
            Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.bg} />

        {!focusMode && (
          <View
            style={{
              paddingHorizontal: 19,
              paddingVertical: 14,
              backgroundColor: C.white,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: C.line
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                borderRadius: 10,
                backgroundColor: C.soft,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name="book-outline" color={C.blue} size={20} />
            </View>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={txt(15, true)}>Abhyas Tracker</Text>
              <Text style={txt(10, false, C.muted)}>{tab}</Text>
            </View>

            <TouchableOpacity
              onPress={() => setNotifOpen(!notifOpen)}
              style={{ padding: 10 }}
              accessibilityLabel="Notifications"
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color={C.ink}
              />

              {unread.length > 0 && (
                <View
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 5,
                    backgroundColor: '#e44242',
                    position: 'absolute',
                    right: 7,
                    top: 6
                  }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setNotifOpen(false);
                setTab('Settings');
              }}
              style={{ padding: 8 }}
              accessibilityLabel="Settings"
            >
              <Ionicons
                name={tab === 'Settings' ? 'settings' : 'settings-outline'}
                size={22}
                color={tab === 'Settings' ? C.blue : C.ink}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert('Account', `${user?.name || ''}\n${user?.email || ''}`, [
                  {
                    text: 'Settings',
                    onPress: () => {
                      setNotifOpen(false);
                      setTab('Settings');
                    }
                  },
                  {
                    text: 'Sign Out',
                    onPress: handleSignOut
                  },
                  { text: 'Cancel', style: 'cancel' }
                ])
              }
              style={{ padding: 8 }}
              accessibilityLabel="Account Options"
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={C.blue}
              />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView
          style={{ flex: 1, backgroundColor: C.bg }}
          contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
        >
          {notifOpen ? (
            <>
              <TouchableOpacity onPress={() => setNotifOpen(false)}>
                <Text style={txt(12, true, C.blue)}>ΓåÉ Back to {tab}</Text>
              </TouchableOpacity>

              <Title sub="Your revision and study reminders">
                Notifications
              </Title>

              {notes.map(note => (
                <Card key={note.id}>
                  <Text style={txt(11, true, C.blue)}>
                    SPACED REPETITION PROTOCOL
                  </Text>

                  <Text style={[txt(17, true), { marginTop: 8 }]}>
                    {note.title}
                  </Text>

                  <Text
                    style={[
                      txt(13, false, C.muted),
                      { marginTop: 8 }
                    ]}
                  >
                    {note.message}
                  </Text>

                  <Button
                    label={
                      (note.readBy || []).includes(user.id)
                        ? 'Read Γ£ô'
                        : 'Mark as Read'
                    }
                    subtle
                    onPress={() => markNote(note)}
                  />
                </Card>
              ))}
            </>
          ) : tab === 'Dashboard' ? (
            <Dashboard />
          ) : tab === 'Timer' ? (
            <Timer
              elapsed={elapsed}
              running={running}
              mode={mode}
              setMode={setMode}
              startSession={startSession}
              pauseSession={pauseSession}
              finish={finish}
              resetSession={resetSession}
              saving={savingSession.current}
              selected={selected}
              subjects={subjects}
              setSelected={setSelected}
              customMinutes={customMinutes}
              setCustomMinutes={setCustomMinutes}
              focusMode={focusMode}
              setFocusMode={setFocusMode}
              requestExitFocus={() => setExitFocusConfirmOpen(true)}
              theme={C}
              isDarkMode={isDarkMode}
            />
          ) : tab === 'Syllabus' ? (
            <Syllabus />
          ) : tab === 'Planner' ? (
            <Planner />
          ) : tab === 'Analytics' ? (
            <Analytics />
          ) : tab === 'Ticket Support' ? (
            <TicketSupportScreen
              user={user}
              theme={C}
              isDarkMode={isDarkMode}
              onBack={() => setTab('Dashboard')}
              req={req}
            />
          ) : tab === 'Settings' ? (
            <SettingsScreen
              user={user}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              theme={C}
              onBack={() => setTab('Dashboard')}
              onSignOut={handleSignOut}
              req={req}
            />
          ) : (
            <Dashboard />
          )}
        </ScrollView>
        {!focusMode && (
          <View
            style={{
              backgroundColor: C.white,
              borderTopWidth: 1,
              borderColor: C.line,
              flexDirection: 'row',
              paddingVertical: 10
            }}
          >
            {tabs.map(([tabName, iconName]) => (
              <TouchableOpacity
                key={tabName}
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() => {
                  setTab(tabName);
                  setNotifOpen(false);
                  refresh();
                }}
                accessibilityLabel={`${tabName} tab`}
              >
                <Ionicons
                  name={iconName}
                  size={23}
                  color={tab === tabName ? C.blue : (isDarkMode ? '#64748b' : '#667080')}
                />

                <Text
                  numberOfLines={1}
                  style={txt(
                    10,
                    tab === tabName,
                    tab === tabName ? C.blue : C.muted
                  )}
                >
                  {tabName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Reset confirmation dialog: inside the main SafeAreaView. */}
        {resetConfirmOpen && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              zIndex: 999,
              elevation: 20
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 380,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 24,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>
                Reset study session?
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 24,
                  color: C.muted,
                  fontSize: 14,
                  lineHeight: 21
                }}
              >
                Your current unsaved study time will be discarded.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={cancelReset}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.soft,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: C.blue, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmReset}
                  disabled={savingSession.current}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: '#DC2626',
                    alignItems: 'center',
                    opacity: savingSession.current ? 0.55 : 1
                  }}
                >
                  <Text style={{ color: C.white, fontWeight: '600' }}>
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {/* Exit Focus Mode confirmation dialog */}
        {exitFocusConfirmOpen && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              zIndex: 1000,
              elevation: 21,
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 380,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 24,
                borderWidth: 1,
                borderColor: C.line,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>
                Exit Focus Mode?
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 24,
                  color: C.muted,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                Are you sure you want to leave Focus Mode and return to normal navigation?
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setExitFocusConfirmOpen(false)}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.soft,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: C.blue, fontWeight: '600' }}>
                    Stay Focused
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setExitFocusConfirmOpen(false);
                    setFocusMode(false);
                  }}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.blue,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: C.white, fontWeight: '600' }}>
                    Exit Focus Mode
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}


