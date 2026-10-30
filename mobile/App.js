import React, { useEffect, useRef, useState, useMemo } from 'react';
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
import NotificationsScreen from './NotificationsScreen';

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

  green: '#10b981',
  greenSoft: '#ecfdf5',
  amber: '#f59e0b',
  amberSoft: '#fffbeb',
  purple: '#8b5cf6',
  purpleSoft: '#f5f3ff',
  red: '#ef4444',
  redSoft: '#fef2f2'
};

const SYLLABUS_TOPICS = {
  polity: [
    { id: 'polity-1', name: 'Preamble & Salient Features', chapter: 'Basics of Constitution' },
    { id: 'polity-2', name: 'Fundamental Rights (Articles 12-35)', chapter: 'Part III' },
    { id: 'polity-3', name: 'Directive Principles & Fundamental Duties', chapter: 'Part IV & IV-A' },
    { id: 'polity-4', name: 'Union Executive & Parliament', chapter: 'Union Government' },
    { id: 'polity-5', name: 'Supreme Court & Judicial Review', chapter: 'Judiciary' },
    { id: 'polity-6', name: 'Center-State Relations & Federalism', chapter: 'Federal System' },
    { id: 'polity-7', name: 'Panchayati Raj & Urban Local Bodies', chapter: 'Local Self-Govt' },
    { id: 'polity-8', name: 'Constitutional Bodies (Election Comm, UPSC, CAG)', chapter: 'Institutions' }
  ],
  history: [
    { id: 'history-1', name: 'Revolt of 1857 & Early Resistance', chapter: 'British Expansion' },
    { id: 'history-2', name: 'Socio-Religious Reform Movements', chapter: 'Social Awakening' },
    { id: 'history-3', name: 'INC Foundation & Moderate-Extremist Era', chapter: 'Early Nationalism' },
    { id: 'history-4', name: 'Swadeshi & Home Rule Movements', chapter: 'Mass Struggle' },
    { id: 'history-5', name: 'Gandhian Era (Non-Cooperation & Salt March)', chapter: 'Gandhian Phase' },
    { id: 'history-6', name: 'Quit India Movement & INA Trials', chapter: 'Towards Freedom' },
    { id: 'history-7', name: "Peasant, Tribal & Working Class Struggles", chapter: "People's Movements" },
    { id: 'history-8', name: 'Partition & Post-Independence Consolidation', chapter: 'Integration' }
  ],
  economy: [
    { id: 'economy-1', name: 'National Income Accounting & GDP Metrics', chapter: 'Macro Fundamentals' },
    { id: 'economy-2', name: 'Inflation Indices (CPI/WPI) & Monetary Policy', chapter: 'Prices & RBI' },
    { id: 'economy-3', name: 'Fiscal Policy, Union Budget & Deficits', chapter: 'Public Finance' },
    { id: 'economy-4', name: 'Banking Structure, IBC & NPA Resolution', chapter: 'Financial System' },
    { id: 'economy-5', name: 'Agriculture, MSP, Subsidies & Food Security', chapter: 'Primary Sector' },
    { id: 'economy-6', name: 'External Sector, Balance of Payments & Forex', chapter: 'Foreign Trade' },
    { id: 'economy-7', name: 'Poverty Measurement & Inclusive Growth', chapter: 'Human Development' },
    { id: 'economy-8', name: 'Infrastructure, Industrial Policy & FDI', chapter: 'Economic Reforms' }
  ],
  geography: [
    { id: 'geography-1', name: 'Geomorphology & Plate Tectonics', chapter: 'Physical Geology' },
    { id: 'geography-2', name: 'Climatology, Wind Belts & Cyclones', chapter: 'Atmosphere' },
    { id: 'geography-3', name: 'Ocean Currents & Marine Resources', chapter: 'Oceanography' },
    { id: 'geography-4', name: 'Physiographic Divisions of India', chapter: 'Indian Geography' },
    { id: 'geography-5', name: 'Himalayan & Peninsular River Systems', chapter: 'Drainage' },
    { id: 'geography-6', name: 'Indian Monsoon Dynamics & Rainfall Patterns', chapter: 'Indian Climate' },
    { id: 'geography-7', name: 'Soils, Natural Vegetation & Wildlife Parks', chapter: 'Biogeography' },
    { id: 'geography-8', name: 'Mineral Belts & Energy Resources of India', chapter: 'Economic Resources' }
  ]

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
    ? 'http://192.168.1.2:4000/api'
    : 'http://localhost:4000/api');

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

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

  // Zen mode state shared with the Timer component.
  const [zenMode, setZenMode] = useState('Light Zen');
  const [deepZenUnlocked, setDeepZenUnlocked] = useState(false);
  const [deepZenInterruptions, setDeepZenInterruptions] = useState(0);


const handleTabChange = (nextTab) => {
  if (deepZenSessionActive && nextTab !== 'Timer') {
    Alert.alert(
      'Deep Zen Active',
      'You cannot switch to another screen while a Deep Zen session is active. Return to the Timer and finish the session first.'
    );
    return;
  }

  setTab(nextTab);
  setNotifOpen(false);
  refresh();
};

  // Reset confirmation state belongs inside the App component.
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exitFocusConfirmOpen, setExitFocusConfirmOpen] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [analyticsRange, setAnalyticsRange] = useState('7');
  const [topicProgress, setTopicProgress] = useState([]);
  const [expandedSubject, setExpandedSubject] = useState('polity');
  const [sessionTopicTitle, setSessionTopicTitle] = useState('Chapter 7: Fundamental Rights');

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const deepZenLocked = zenMode === 'Deep Zen' && !deepZenUnlocked;
const deepZenSessionActive =
  deepZenLocked && (running || elapsed > 0);
  const [selected, setSelected] = useState('polity');
  const [mode, setMode] = useState('Pomodoro');
  const [customMinutes, setCustomMinutes] = useState(30);

  const [planTitle, setPlanTitle] = useState('');
  const [planMinutes, setPlanMinutes] = useState('45');
  const [plannerView, setPlannerView] = useState("Today's Plan");
  const [planSubject, setPlanSubject] = useState('polity');
  const [planPriority, setPlanPriority] = useState('Medium');
  const [planDateType, setPlanDateType] = useState('today');
  const [notifOpen, setNotifOpen] = useState(false);

  // Timer and save reliability references.
  const interval = useRef(null);
  const appStateRef = useRef(AppState.currentState);
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
        analyticsData,
        progressData
      ] = await Promise.all([
        req('/subjects', 'GET', null, t),
        req('/sessions', 'GET', null, t),
        req('/plan', 'GET', null, t),
        req('/notifications', 'GET', null, t),
        req('/analytics', 'GET', null, t),
        req('/topic-progress', 'GET', null, t).catch(() => [])
      ]);

      setSubjects(subjectData);
      setSessions(historyData);
      setPlans(planData);
      setNotes(noteData);
      setAnalytics(analyticsData);
      setTopicProgress(progressData || []);

      return true;
    } catch (error) {
      Alert.alert('Connection error', error.message);
      return false;
    }
  }

  // Restore authentication on app startup.
  useEffect(() => {
    let mounted = true;

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


  async function login() {
    const loginUrl = API + '/auth/' + (register ? 'register' : 'login');

    try {
      console.log('[LOGIN DEBUG] API:', API);
      console.log('[LOGIN DEBUG] Request URL:', loginUrl);

      let response;

      try {
        response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email: loginEmail,
            password
          })
        });
      } catch (networkError) {
        throw Error(
          'LOGIN REQUEST FAILED\nURL: ' + loginUrl +
          '\nError: ' + String(networkError)
        );
      }

      console.log('[LOGIN DEBUG] HTTP status:', response.status);

      let data;

      try {
        data = await response.json();
      } catch {
        throw Error('Login response was not valid JSON. HTTP status: ' + response.status);
      }

      if (!response.ok) {
        throw Error(data.error || 'Unable to sign in. HTTP status: ' + response.status);
      }

      if (!data.user || data.user.role !== 'student') {
        throw Error('Invalid response or non-student account.');
      }

      setToken(data.token);
      setUser(data.user);

      await AsyncStorage.setItem('abhyasToken', data.token);

      try {
        await refresh(data.token);
      } catch (refreshError) {
        throw Error(
          'LOGIN SUCCEEDED, BUT DATA REFRESH FAILED: ' +
          String(refreshError)
        );
      }
    } catch (error) {
      console.log('[LOGIN DEBUG] Failure:', String(error));
      Alert.alert('Sign in diagnostics', String(error));
    }
  }


  // Start a new session or resume a paused session.

  function startSession() {
    if (savingSession.current) return;
    if (activeStartedAt.current !== null) return;
    autoSaveTriggered.current = false;

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

  if (deepZenLocked && (running || elapsed > 0)) {
    Alert.alert(
      'Deep Zen Active',
      'You cannot pause this session. Wait until the countdown reaches 00:00.'
    );
    return;
  }

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
    autoSaveTriggered.current = false;

    setRunning(false);
    setElapsed(0);
    setResetConfirmOpen(false);
  }

  // Save the session with a synchronous duplicate-submit guard.
  async function finish(automatic = false) {
  const isAutomatic = automatic === true;

  if (savingSession.current || (deepZenLocked && !isAutomatic)) {
    return;
  }

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

  // Update syllabus topic status and persist it through the API.
  async function updateTopicStatus(topic, currentStatus, subjectId) {
    const cycle = {
      'Not Started': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'To Revise',
      'To Revise': 'Not Started'
    };
    const nextStatus = cycle[currentStatus] || 'In Progress';

    setTopicProgress(previous => {
      const index = previous.findIndex(item => item.topicId === topic.id);
      if (index >= 0) {
        const updated = [...previous];
        updated[index] = { ...updated[index], status: nextStatus, subjectId };
        return updated;
      }
      return [...previous, { topicId: topic.id, subjectId, status: nextStatus }];
    });

    try {
      await req('/topic-progress/' + topic.id, 'PATCH', { status: nextStatus, subjectId });
      await refresh();
    } catch (error) {
      Alert.alert('Error updating topic', error.message);
      await refresh();
    }
  }

  async function quickScheduleTopic(topic, subjectName, subjectId) {
    try {
      await req('/plan', 'POST', {
        title: `${subjectName}: ${topic.name}`,
        minutes: 45,
        date: today(),
        subjectId,
        priority: 'High'
      });
      Alert.alert('Scheduled!', `"${topic.name}" added to today's study planner.`);
      await refresh();
      setTab('Planner');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  const syllabusStats = useMemo(() => {
    let totalTopicsCount = 0;
    let completedTopicsCount = 0;
    let inProgressCount = 0;
    let toReviseCount = 0;

    Object.entries(SYLLABUS_TOPICS).forEach(([subjectId, topics]) => {
      topics.forEach(topic => {
        totalTopicsCount++;
        const progress = topicProgress.find(item => item.topicId === topic.id);
        if (progress?.status === 'Completed') completedTopicsCount++;
        else if (progress?.status === 'In Progress') inProgressCount++;
        else if (progress?.status === 'To Revise') toReviseCount++;
      });
    });

    const overallPct = totalTopicsCount
      ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
      : 0;
    return {
      totalTopicsCount,
      completedTopicsCount,
      inProgressCount,
      toReviseCount,
      overallPct
    };
  }, [topicProgress]);

  async function addPlan() {
    if (!planTitle.trim()) {
      Alert.alert('Input needed', 'Please enter a topic or chapter title.');
      return;
    }
    const targetDate = planDateType === 'tomorrow' ? tomorrow() : today();
    try {
      await req('/plan', 'POST', {
        title: planTitle.trim(),
        minutes: Number(planMinutes) || 45,
        date: targetDate,
        subjectId: planSubject,
        priority: planPriority
      });
      setPlanTitle('');
      await refresh();
      Alert.alert('Task Planned', `Scheduled for ${planDateType === 'tomorrow' ? 'Tomorrow' : 'Today'}!`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async function markPlan(plan) {
    try {
      await req('/plan/' + plan.id, 'PATCH', { done: !plan.done });
      await refresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  async function deletePlan(plan) {
    try {
      await req('/plan/' + plan.id, 'DELETE');
      await refresh();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  function startPlanFocus(plan) {
    if (plan.subjectId) setSelected(plan.subjectId);
    setSessionTopicTitle(plan.title);
    setTab('Timer');
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
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator color={C.blue} />
      </View>
    );
  }

  if (!token) {
    return (
      <ThemeContext.Provider value={{ theme: C, isDarkMode, toggleTheme }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{ flex: 1, justifyContent: 'center', padding: 28 }}>
            <View
              style={{
                alignSelf: 'center',
                width: 74,
                height: 74,
                borderRadius: 22,
                backgroundColor: C.soft,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name="book-outline" size={38} color={C.blue} />
            </View>

            <Text
              style={[
                txt(30, true),
                { textAlign: 'center', marginTop: 20 }
              ]}
            >
              Abhyas Tracker
            </Text>

            <Text
              style={[
                txt(13, false, C.muted),
                { textAlign: 'center', marginBottom: 35 }
              ]}
            >
              Focused study. Smarter revision.
            </Text>

            {register && (
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={C.muted}
                value={name}
                onChangeText={setName}
                style={input}
              />
            )}

            <TextInput
              placeholder="Email"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              value={loginEmail}
              onChangeText={setEmail}
              style={input}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={C.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={input}
            />

            <Button
              label={register ? 'Create Account' : 'Sign In'}
              onPress={login}
            />

            <Button
              label={
                register
                  ? 'Already registered? Sign in'
                  : 'Create a student account'
              }
              subtle
              onPress={() => setRegister(!register)}
            />

            <Text
              style={[
                txt(11, false, C.muted),
                { textAlign: 'center', marginTop: 25 }
              ]}
            >
              Demo: student@abhyas.local / Student123!
            </Text>
          </View>
        </SafeAreaView>
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

      <Title sub="Your study sanctuary - One session at a time">
        Good morning, {user?.name?.split(' ')[0]}!
      </Title>


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
          <Chip label="🔥 14-Day Streak" active />
          <Chip label="UPSC / MPSC 2026" />
        </View>

        {/* Personalized Welcome Header */}
        <Title sub="Your study sanctuary - One session at a time">
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
                  ? 'Goal Met! ??'
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

              Retention: 84%  SRS T2

            </Text>
          )}

          <Button
            label="? Start Studying Now"
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
            Abhyas Discipline - MPSC & UPSC Aspirants
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
              ? `${selectedSubjectObj?.name || 'General Studies'} - Target Task`
              : `${selectedSubjectObj?.name || 'Indian Polity'} - Standard Session`}
          </Text>

          <Text style={[txt(18, true, C.ink), { marginTop: 6 }]}>
            {activePlan?.title || 'Chapter 7 - Fundamental Rights'}
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
              <Text style={txt(11, true, C.blue)}>View All →</Text>
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
      <Title sub="Interactive topic checklist, revision markers & mastery tracking">
        Subjects & Syllabus
      </Title>

      {/* Overview Card */}
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={txt(13, true)}>Overall Completion</Text>
            <Text style={[txt(26, true), { marginVertical: 6 }]}>{syllabusStats.overallPct}%</Text>
            <Text style={txt(11, false, C.muted)}>
              {syllabusStats.completedTopicsCount} of {syllabusStats.totalTopicsCount} topics completed
            </Text>
          </View>
          <Ring value={syllabusStats.overallPct} size={110} label="Completed" />
        </View>

        {/* Status Legends / Breakdown */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderColor: C.line
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={txt(14, true, C.green)}>{syllabusStats.completedTopicsCount}</Text>
            <Text style={txt(10, false, C.muted)}>Mastered</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={txt(14, true, C.amber)}>{syllabusStats.inProgressCount}</Text>
            <Text style={txt(10, false, C.muted)}>In Progress</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={txt(14, true, C.purple)}>{syllabusStats.toReviseCount}</Text>
            <Text style={txt(10, false, C.muted)}>To Revise</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={txt(14, true, C.muted)}>
              {syllabusStats.totalTopicsCount - syllabusStats.completedTopicsCount - syllabusStats.inProgressCount - syllabusStats.toReviseCount}
            </Text>
            <Text style={txt(10, false, C.muted)}>Remaining</Text>
          </View>
        </View>
      </Card>

      {/* Revision Queue Notice */}
      {syllabusStats.toReviseCount > 0 && (
        <Card style={{ backgroundColor: C.purpleSoft, borderColor: '#ddd6fe' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="refresh-circle-outline" size={24} color={C.purple} />
            <Text style={txt(14, true, C.purple)}>Spaced Repetition Queue</Text>
          </View>
          <Text style={[txt(12, false, C.ink), { marginTop: 6 }]}>
            You have {syllabusStats.toReviseCount} topic(s) flagged for revision. Schedule a revision block today!
          </Text>
        </Card>
      )}

      {/* Subject Cards with Interactive Topics */}
      {subjects.map(s => {
        const topicsList = SYLLABUS_TOPICS[s.id] || [];
        const isExpanded = expandedSubject === s.id;
        const sCompleted = topicsList.filter(t => {
          const prog = topicProgress.find(p => p.topicId === t.id);
          return prog && prog.status === 'Completed';
        }).length;
        const sPct = topicsList.length ? Math.round((sCompleted / topicsList.length) * 100) : 0;

        return (
          <Card key={s.id} style={{ paddingBottom: isExpanded ? 12 : 16 }}>
            <TouchableOpacity
              onPress={() => setExpandedSubject(isExpanded ? null : s.id)}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={txt(16, true)}>{s.name}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: C.blue,
                      backgroundColor: C.soft,
                      paddingHorizontal: 7,
                      paddingVertical: 2,
                      borderRadius: 6
                    }}
                  >
                    {s.paper}
                  </Text>
                </View>
                <Text style={[txt(12, false, C.muted), { marginTop: 4 }]}>
                  {sCompleted} / {topicsList.length} topics mastered - {sPct}%
                </Text>
              </View>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={22} color={C.blue} />
            </TouchableOpacity>

            {/* Progress Bar */}
            <View style={{ height: 7, backgroundColor: C.soft, borderRadius: 6, marginTop: 12 }}>
              <View
                style={{
                  backgroundColor: C.blue,
                  height: 7,
                  borderRadius: 6,
                  width: `${sPct}%`
                }}
              />
            </View>

            {/* Expanded Topics List */}
            {isExpanded && (
              <View style={{ marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderColor: C.line }}>
                <Text style={[txt(11, true, C.muted), { marginBottom: 8, letterSpacing: 0.5 }]}>
                  TOPIC CHECKLIST (TAP TO UPDATE STATUS)
                </Text>
                {topicsList.map((t, idx) => {
                  const prog = topicProgress.find(p => p.topicId === t.id);
                  const status = prog?.status || 'Not Started';

                  // Badge colors
                  const statusColors = {
                    'Completed': { bg: C.greenSoft, fg: C.green, icon: 'checkmark-circle' },
                    'In Progress': { bg: C.amberSoft, fg: C.amber, icon: 'time-outline' },
                    'To Revise': { bg: C.purpleSoft, fg: C.purple, icon: 'repeat-outline' },
                    'Not Started': { bg: C.soft, fg: C.muted, icon: 'ellipse-outline' }
                  };
                  const cfg = statusColors[status] || statusColors['Not Started'];

                  return (
                    <View
                      key={t.id}
                      style={{
                        paddingVertical: 10,
                        borderBottomWidth: idx === topicsList.length - 1 ? 0 : 1,
                        borderColor: '#f1f5f9'
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={txt(10, false, C.muted)}>{t.chapter}</Text>
                          <Text
                            style={[
                              txt(13, true),
                              status === 'Completed' ? { color: '#047857' } : null
                            ]}
                          >
                            {t.name}
                          </Text>
                        </View>

                        {/* Interactive Status Button */}
                        <TouchableOpacity
                          onPress={() => updateTopicStatus(t, status, s.id)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: cfg.bg,
                            paddingHorizontal: 9,
                            paddingVertical: 6,
                            borderRadius: 14,
                            gap: 4
                          }}
                        >
                          <Ionicons name={cfg.icon} size={14} color={cfg.fg} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.fg }}>
                            {status}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Quick Action: Schedule for today */}
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6, gap: 10 }}>
                        <TouchableOpacity
                          onPress={() => quickScheduleTopic(t, s.name, s.id)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                        >
                          <Ionicons name="calendar-outline" size={13} color={C.blue} />
                          <Text style={txt(11, true, C.blue)}>Plan for Today</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}
    </>
  );

  const Planner = () => {
    // Filter plans according to view
    const filteredPlans = useMemo(() => {
      if (plannerView === "Today's Plan") {
        return plans.filter(p => p.date === today() || !p.date);
      }
      if (plannerView === 'Weekly View') {
        return plans;
      }
      return plans;
    }, [plans, plannerView]);

    const todayPlannedMinutes = plans
      .filter(p => p.date === today() && !p.done)
      .reduce((a, p) => a + Number(p.minutes || 0), 0);
    const capacityPct = Math.min(100, Math.round((todayPlannedMinutes / 480) * 100));

    // Suggested unfinished topics for the selected plan subject
    const suggestedTopics = useMemo(() => {
      const all = SYLLABUS_TOPICS[planSubject] || [];
      return all
        .filter(t => {
          const prog = topicProgress.find(p => p.topicId === t.id);
          return !prog || prog.status !== 'Completed';
        })
        .slice(0, 3);
    }, [planSubject, topicProgress]);

    return (
      <>
        <Title sub="Target scheduling, task execution & daily workload balance">
          Study Planner
        </Title>

        {/* View Switcher Chips */}
        <Card style={{ paddingVertical: 12 }}>
          <Text style={[txt(12, true, C.muted), { marginBottom: 8 }]}>PLANNER VIEW</Text>
          <View style={{ flexDirection: 'row' }}>
            {["Today's Plan", 'Weekly View', 'Workload & Routine'].map(v => (
              <Chip key={v} label={v} active={plannerView === v} onPress={() => setPlannerView(v)} />
            ))}
          </View>
        </Card>

        {/* Workload Capacity Meter */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={txt(15, true)}>Daily Workload vs. 8h Target</Text>
            <Text style={txt(13, true, C.blue)}>{capacityPct}% Capacity</Text>
          </View>
          <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6, marginVertical: 10 }}>
            <View
              style={{
                backgroundColor: capacityPct > 90 ? C.amber : C.blue,
                height: 8,
                borderRadius: 6,
                width: `${capacityPct}%`
              }}
            />
          </View>
          <Text style={txt(12, false, C.muted)}>
            {todayPlannedMinutes} min scheduled today - {Math.max(0, 480 - todayPlannedMinutes)} min available capacity
          </Text>
        </Card>

        {/* Tasks List */}
        <View style={{ marginBottom: 6 }}>
          <Text style={[txt(14, true), { marginBottom: 8 }]}>
            {plannerView === "Today's Plan" ? `Today's Tasks (${today()})` : 'All Scheduled Tasks'}
          </Text>
        </View>

        {filteredPlans.length === 0 ? (
          <Card>
            <Text style={[txt(13, false, C.muted), { textAlign: 'center', paddingVertical: 12 }]}>
              No study tasks found for this view. Add a study block below to get started!
            </Text>
          </Card>
        ) : (
          filteredPlans.map(p => {
            const priorityColors = {
              'High': { bg: C.redSoft, fg: C.red },
              'Medium': { bg: C.amberSoft, fg: C.amber },
              'Low': { bg: C.soft, fg: C.blue }
            };
            const pStyle = priorityColors[p.priority || 'Medium'] || priorityColors['Medium'];
            const subName = subjects.find(s => s.id === p.subjectId)?.name || p.subjectId || 'General';

            return (
              <Card key={p.id} style={{ paddingVertical: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  {/* Complete Checkbox */}
                  <TouchableOpacity onPress={() => markPlan(p)} style={{ marginTop: 2 }}>
                    <Ionicons
                      name={p.done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={p.done ? C.green : C.blue}
                    />
                  </TouchableOpacity>

                  <View style={{ flex: 1 }}>
                    {/* Header tags */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: pStyle.fg,
                          backgroundColor: pStyle.bg,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          borderRadius: 6
                        }}
                      >
                        {p.priority || 'Medium'}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '600',
                          color: C.blue,
                          backgroundColor: C.soft,
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          borderRadius: 6
                        }}
                      >
                        {subName}
                      </Text>
                      {p.date && (
                        <Text style={txt(10, false, C.muted)}>
                          {p.date === today() ? 'Today' : p.date}
                        </Text>
                      )}
                    </View>

                    {/* Title */}
                    <Text
                      style={[
                        txt(14, true),
                        p.done ? { textDecorationLine: 'line-through', color: C.muted } : null
                      ]}
                    >
                      {p.title}
                    </Text>

                    <Text style={[txt(11, false, C.muted), { marginTop: 4 }]}>
                      {p.minutes} mins - {p.done ? 'Completed' : 'Pending'}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    {!p.done && (
                      <TouchableOpacity
                        onPress={() => startPlanFocus(p)}
                        style={{
                          backgroundColor: C.blue,
                          paddingHorizontal: 11,
                          paddingVertical: 6,
                          borderRadius: 8
                        }}
                      >
                        <Text style={txt(11, true, C.white)}>Focus</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => deletePlan(p)} style={{ padding: 4 }}>
                      <Ionicons name="trash-outline" size={17} color={C.muted} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            );
          })
        )}

        {/* Add Study Block Form */}
        <Card style={{ marginTop: 8 }}>
          <Text style={txt(16, true)}>+ Add Study Block</Text>
          <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 12 }]}>
            Schedule focus intervals aligned with your syllabus.
          </Text>

          {/* Subject Selector */}
          <Text style={txt(11, true, C.muted)}>SELECT SUBJECT</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, marginBottom: 8 }}>
            {subjects.map(s => (
              <Chip
                key={s.id}
                label={s.name}
                active={planSubject === s.id}
                onPress={() => setPlanSubject(s.id)}
              />
            ))}
          </View>

          {/* Quick Syllabus Topic Suggestions */}
          {suggestedTopics.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={txt(11, true, C.muted)}>QUICK PICK FROM UNFINISHED SYLLABUS</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                {suggestedTopics.map(t => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setPlanTitle(t.name)}
                    style={{
                      backgroundColor: C.soft,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginRight: 6,
                      marginBottom: 6
                    }}
                  >
                    <Text style={txt(11, false, C.blue)}>+ {t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Title Input */}
          <Text style={txt(11, true, C.muted)}>TOPIC OR CHAPTER TITLE</Text>
          <TextInput
            placeholder="e.g. Fundamental Rights (Art 14-18)"
            style={input}
            value={planTitle}
            onChangeText={setPlanTitle}
          />

          {/* Duration Chips */}
          <Text style={[txt(11, true, C.muted), { marginTop: 12 }]}>TARGET DURATION (MINUTES)</Text>
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            {['30', '45', '60', '90'].map(m => (
              <Chip
                key={m}
                label={`${m}m`}
                active={planMinutes === m}
                onPress={() => setPlanMinutes(m)}
              />
            ))}
          </View>

          {/* Priority & Date Selector */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={txt(11, true, C.muted)}>PRIORITY</Text>
              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                {['High', 'Medium', 'Low'].map(p => (
                  <Chip
                    key={p}
                    label={p}
                    active={planPriority === p}
                    onPress={() => setPlanPriority(p)}
                  />
                ))}
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={txt(11, true, C.muted)}>DATE</Text>
              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                {['today', 'tomorrow'].map(d => (
                  <Chip
                    key={d}
                    label={d === 'today' ? 'Today' : 'Tomorrow'}
                    active={planDateType === d}
                    onPress={() => setPlanDateType(d)}
                  />
                ))}
              </View>
            </View>
          </View>

          <Button label="+ Schedule Study Task" onPress={addPlan} />
        </Card>
      </>
    );
  };

  // ---------------- ANALYTICS TAB ----------------

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
          paddingTop:
            Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={C.bg} />


        {!focusMode && (

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={txt(15, true)}>Abhyas Tracker</Text>
          <Text style={txt(10, false, C.muted)}>{tab}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setNotifOpen(!notifOpen)}
          style={{ padding: 12 }}
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
                right: 9,
                top: 8
              }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert('Account', `${user.name}\n${user.email}`, [
              {
                text: 'Sign Out',
                onPress: async () => {
                  if (savingSession.current) {
                    Alert.alert(
                      'Save in progress',
                      'Wait until the session save finishes before signing out.'
                    );
                    return;
                  }

                  // Do not silently discard an active timer.
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
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ])
          }
          style={{ padding: 9 }}
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
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 18, paddingBottom: 30 }}
      >
        {notifOpen ? (
          <NotificationsScreen
            notes={notes}
            user={user}
            onMarkRead={markNote}
            onBack={() => setNotifOpen(false)}
            C={C}
          />
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
    zenMode={zenMode}
    setZenMode={setZenMode}
    deepZenUnlocked={deepZenUnlocked}
    setDeepZenUnlocked={setDeepZenUnlocked}
    deepZenLocked={deepZenLocked}
    requestExitFocus={() => setExitFocusConfirmOpen(true)}
  />
                ) : tab === 'Syllabus' ? (
          <Syllabus />
        ) : tab === 'Planner' ? (
          <Planner />
        ) : tab === 'Ticket Support' ? (
          <TicketSupportScreen
            user={user}
            theme={C}
            isDarkMode={isDarkMode}
            req={req}
            onBack={() => setTab('Dashboard')}
          />
        ) : (
          <Analytics />
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
            onPress={() => handleTabChange(tabName)}
          >
            <Ionicons
              name={iconName}
              size={23}
              color={tab === tabName ? C.blue : '#667080'}
            />

            <Text
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
                Are you sure you want to exit Focus Mode?
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
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (deepZenSessionActive) {
                      setExitFocusConfirmOpen(false);
                      return;
                    }

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
                    Exit
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
                Are you sure you want to exit Focus Mode?
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
                    if (deepZenSessionActive) {
                      setExitFocusConfirmOpen(false);
                      return;
                    }

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
                    Yes, Exit
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
