import React, { useEffect, useRef, useState, useMemo } from 'react';
import AuthScreens from './AuthScreens';
import {
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
  StyleSheet,
  NativeModules,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#f7f9fe',
  white: '#ffffff',
  ink: '#142841',
  muted: '#72849f',
  blue: '#37689f',
  blueLight: '#edf3fc',
  mid: '#80a9e5',
  soft: '#e9f0fc',
  line: '#e8eef8',
  light: '#dce8fb',
  green: '#10b981',
  greenSoft: '#ecfdf5',
  amber: '#f59e0b',
  amberSoft: '#fffbeb',
  purple: '#8b5cf6',
  purpleSoft: '#f5f3ff',
  red: '#ef4444',
  redSoft: '#fef2f2'
};

const resolveApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:4000/api`;
    }
    return 'http://localhost:4000/api';
  }
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const host = scriptURL.split('://')[1]?.split('/')[0]?.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:4000/api`;
    }
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';
};

const API = resolveApiUrl();

const txt = (size = 14, bold = false, color = C.ink) => ({
  fontSize: size,
  fontWeight: bold ? '700' : '400',
  color
});

const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const SYLLABUS_TOPICS = {
  // ==================== UPSC CIVIL SERVICES (9 SUBJECTS) ====================
  'upsc-history-culture': [
    { id: 'uh-1', name: 'Ancient Indian history', chapter: 'History and Culture' },
    { id: 'uh-2', name: 'Medieval Indian history', chapter: 'History and Culture' },
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' },
    { id: 'uh-4', name: 'Indian freedom struggle', chapter: 'History and Culture' },
    { id: 'uh-5', name: 'Art, architecture and culture', chapter: 'History and Culture' },
    { id: 'uh-6', name: 'World history (Mains)', chapter: 'History and Culture' }
  ],
  'upsc-geography': [
    { id: 'ug-1', name: 'Physical geography', chapter: 'Geography' },
    { id: 'ug-2', name: 'Indian geography', chapter: 'Geography' },
    { id: 'ug-3', name: 'World geography', chapter: 'Geography' },
    { id: 'ug-4', name: 'Climate, rivers and monsoons', chapter: 'Geography' },
    { id: 'ug-5', name: 'Agriculture and natural resources', chapter: 'Geography' },
    { id: 'ug-6', name: 'Human and economic geography', chapter: 'Geography' }
  ],
  'upsc-polity': [
    { id: 'up-1', name: 'Constitution of India', chapter: 'Indian Polity and Governance' },
    { id: 'up-2', name: 'Fundamental Rights and Duties', chapter: 'Indian Polity and Governance' },
    { id: 'up-3', name: 'Parliament and state legislatures', chapter: 'Indian Polity and Governance' },
    { id: 'up-4', name: 'President, Prime Minister and judiciary', chapter: 'Indian Polity and Governance' },
    { id: 'up-5', name: 'Panchayati Raj and local government', chapter: 'Indian Polity and Governance' },
    { id: 'up-6', name: 'Constitutional and statutory bodies', chapter: 'Indian Polity and Governance' }
  ],
  'upsc-economy': [
    { id: 'ue-1', name: 'GDP, inflation and national income', chapter: 'Indian Economy' },
    { id: 'ue-2', name: 'Banking and monetary policy', chapter: 'Indian Economy' },
    { id: 'ue-3', name: 'Budget and taxation', chapter: 'Indian Economy' },
    { id: 'ue-4', name: 'Poverty, unemployment and development', chapter: 'Indian Economy' },
    { id: 'ue-5', name: 'Agriculture and industry', chapter: 'Indian Economy' },
    { id: 'ue-6', name: 'Government economic schemes', chapter: 'Indian Economy' }
  ],
  'upsc-environment': [
    { id: 'uen-1', name: 'Ecosystems and food chains', chapter: 'Environment and Ecology' },
    { id: 'uen-2', name: 'Biodiversity and conservation', chapter: 'Environment and Ecology' },
    { id: 'uen-3', name: 'National parks and wildlife sanctuaries', chapter: 'Environment and Ecology' },
    { id: 'uen-4', name: 'Climate change and global warming', chapter: 'Environment and Ecology' },
    { id: 'uen-5', name: 'Pollution and environmental laws', chapter: 'Environment and Ecology' }
  ],
  'upsc-science-tech': [
    { id: 'ust-1', name: 'Physics, chemistry and biology basics', chapter: 'Science and Technology' },
    { id: 'ust-2', name: 'Space technology and satellites', chapter: 'Science and Technology' },
    { id: 'ust-3', name: 'Biotechnology', chapter: 'Science and Technology' },
    { id: 'ust-4', name: 'Artificial intelligence and emerging technologies', chapter: 'Science and Technology' },
    { id: 'ust-5', name: 'Health and scientific developments', chapter: 'Science and Technology' }
  ],
  'upsc-current-affairs': [
    { id: 'uca-1', name: 'National and international news', chapter: 'Current Affairs' },
    { id: 'uca-2', name: 'Government policies and schemes', chapter: 'Current Affairs' },
    { id: 'uca-3', name: 'Important reports and indices', chapter: 'Current Affairs' },
    { id: 'uca-4', name: 'International organisations', chapter: 'Current Affairs' },
    { id: 'uca-5', name: 'Awards, appointments and major events', chapter: 'Current Affairs' }
  ],
  'upsc-csat': [
    { id: 'ucs-1', name: 'Reading comprehension', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-2', name: 'Logical reasoning', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-3', name: 'Analytical ability', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-4', name: 'Basic mathematics', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-5', name: 'Data interpretation', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-6', name: 'Decision-making and problem-solving', chapter: 'CSAT (Prelims Paper II)' }
  ],
  'upsc-ethics': [
    { id: 'uet-1', name: 'Ethics and human values', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-2', name: 'Integrity and impartiality', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-3', name: 'Emotional intelligence', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-4', name: 'Public service values', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-5', name: 'Case studies and ethical dilemmas', chapter: 'Ethics, Integrity and Aptitude' }
  ],

  // ==================== MPSC MAHARASHTRA (9 SUBJECTS) ====================
  'mpsc-history': [
    { id: 'mh-1', name: 'Ancient and medieval Indian history', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-2', name: 'Modern India and freedom struggle', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-3', name: 'Chhatrapati Shivaji Maharaj', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-4', name: 'Maratha Empire and Peshwa period', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-5', name: 'Social reformers of Maharashtra', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-6', name: "Maharashtra's formation in 1960", chapter: 'Maharashtra and Indian History' }
  ],
  'mpsc-geography': [
    { id: 'mg-1', name: 'Sahyadri and Western Ghats', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-2', name: "Maharashtra's districts and divisions", chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-3', name: 'Godavari, Krishna and other river systems', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-4', name: 'Climate, rainfall and soils', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-5', name: 'Agriculture and irrigation', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-6', name: 'Minerals, industries and population', chapter: 'Maharashtra and Indian Geography' }
  ],
  'mpsc-polity': [
    { id: 'mp-1', name: 'Indian Constitution and fundamental rights', chapter: 'Constitution & Administration' },
    { id: 'mp-2', name: 'Parliament and state legislature', chapter: 'Constitution & Administration' },
    { id: 'mp-3', name: 'Governor and Chief Minister', chapter: 'Constitution & Administration' },
    { id: 'mp-4', name: 'Maharashtra government structure', chapter: 'Constitution & Administration' },
    { id: 'mp-5', name: 'Local self-government', chapter: 'Constitution & Administration' },
    { id: 'mp-6', name: 'Panchayati Raj and urban administration', chapter: 'Constitution & Administration' }
  ],
  'mpsc-economy': [
    { id: 'me-1', name: 'Basic economic concepts', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-2', name: 'State budget and economic survey', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-3', name: 'Maharashtra agriculture and industries', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-4', name: 'Banking, inflation and taxation', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-5', name: 'Poverty and unemployment', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-6', name: 'State and central government schemes', chapter: 'Indian and Maharashtra Economy' }
  ],
  'mpsc-marathi': [
    { id: 'mm-1', name: 'Grammar and sentence structure', chapter: 'Marathi Language' },
    { id: 'mm-2', name: 'Vocabulary and synonyms', chapter: 'Marathi Language' },
    { id: 'mm-3', name: 'Antonyms and idioms', chapter: 'Marathi Language' },
    { id: 'mm-4', name: 'Reading comprehension', chapter: 'Marathi Language' },
    { id: 'mm-5', name: 'Sentence correction and usage', chapter: 'Marathi Language' }
  ],
  'mpsc-english': [
    { id: 'men-1', name: 'Grammar and vocabulary', chapter: 'English Language' },
    { id: 'men-2', name: 'Synonyms and antonyms', chapter: 'English Language' },
    { id: 'men-3', name: 'Sentence correction', chapter: 'English Language' },
    { id: 'men-4', name: 'Comprehension', chapter: 'English Language' },
    { id: 'men-5', name: 'Basic usage and writing skills', chapter: 'English Language' }
  ],
  'mpsc-aptitude': [
    { id: 'ma-1', name: 'Number systems and percentages', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-2', name: 'Ratio and proportion', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-3', name: 'Time, speed and distance', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-4', name: 'Logical reasoning', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-5', name: 'Data interpretation', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-6', name: 'Mental ability', chapter: 'Aptitude and Reasoning' }
  ],
  'mpsc-environment-science': [
    { id: 'mes-1', name: 'Ecology and biodiversity', chapter: 'Environment and Science' },
    { id: 'mes-2', name: 'Pollution and climate change', chapter: 'Environment and Science' },
    { id: 'mes-3', name: 'General science', chapter: 'Environment and Science' },
    { id: 'mes-4', name: 'Health and technology', chapter: 'Environment and Science' },
    { id: 'mes-5', name: 'Maharashtra forests and wildlife', chapter: 'Environment and Science' }
  ],
  'mpsc-current-affairs': [
    { id: 'mca-1', name: 'Maharashtra government decisions', chapter: 'Current Affairs' },
    { id: 'mca-2', name: 'State and national schemes', chapter: 'Current Affairs' },
    { id: 'mca-3', name: 'National and international events', chapter: 'Current Affairs' },
    { id: 'mca-4', name: 'Important appointments and awards', chapter: 'Current Affairs' },
    { id: 'mca-5', name: 'Maharashtra economic and social developments', chapter: 'Current Affairs' }
  ],

  // Backward compatibility aliases
  'upsc-history': [
    { id: 'uh-1', name: 'Ancient Indian history', chapter: 'History and Culture' },
    { id: 'uh-2', name: 'Medieval Indian history', chapter: 'History and Culture' },
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' },
    { id: 'uh-4', name: 'Indian freedom struggle', chapter: 'History and Culture' },
    { id: 'uh-5', name: 'Art, architecture and culture', chapter: 'History and Culture' },
    { id: 'uh-6', name: 'World history (Mains)', chapter: 'History and Culture' }
  ],
  'mpsc-marathi-english': [
    { id: 'mm-1', name: 'Grammar and sentence structure', chapter: 'Marathi Language' },
    { id: 'mm-2', name: 'Vocabulary and synonyms', chapter: 'Marathi Language' },
    { id: 'men-1', name: 'Grammar and vocabulary', chapter: 'English Language' }
  ],
  'mpsc-science-agri': [
    { id: 'mes-1', name: 'Ecology and biodiversity', chapter: 'Environment and Science' },
    { id: 'mes-2', name: 'Pollution and climate change', chapter: 'Environment and Science' }
  ],
  'history': [
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' }
  ],
  'polity': [
    { id: 'up-1', name: 'Constitution of India', chapter: 'Indian Polity and Governance' }
  ],
  'economy': [
    { id: 'ue-1', name: 'GDP, inflation and national income', chapter: 'Indian Economy' }
  ],
  'geography': [
    { id: 'ug-1', name: 'Physical geography', chapter: 'Geography' }
  ]
};

function Chip({ label, active, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: active ? C.blue : C.soft,
          paddingHorizontal: 13,
          paddingVertical: 8,
          borderRadius: 20,
          marginRight: 8,
          marginBottom: 8
        },
        style
      ]}
    >
      <Text style={txt(12, true, active ? C.white : C.blue)}>{label}</Text>
    </TouchableOpacity>
  );
}

function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: C.white,
          borderRadius: 18,
          padding: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: '#edf2fc'
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function Title({ children, sub }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={txt(22, true)}>{children}</Text>
      {sub ? <Text style={[txt(12, false, C.muted), { marginTop: 4, lineHeight: 18 }]}>{sub}</Text> : null}
    </View>
  );
}

function Ring({ value = 65, size = 150, label = 'Mastered' }) {
  const r = (size - 18) / 2;
  const co = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.soft} strokeWidth={9} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={C.blue}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${(co * clamped) / 100} ${co}`}
        />
      </Svg>
      <Text style={txt(24, true)}>{clamped}%</Text>
      <Text style={txt(11, false, C.muted)}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress, subtle = false, danger = false, style, textStyle }) {
  const bg = danger ? C.redSoft : subtle ? C.soft : C.blue;
  const fg = danger ? C.red : subtle ? C.blue : C.white;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
          marginTop: 9
        },
        style
      ]}
    >
      <Text style={[txt(13, true, fg), textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setEmail] = useState('student@abhyas.local');
  const [password, setPassword] = useState('Student123!');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [tab, setTab] = useState('Dashboard');

  // Core Data
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [topicProgress, setTopicProgress] = useState([]);

  // Timer State
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState('polity');
  const [sessionTopicTitle, setSessionTopicTitle] = useState('Chapter 7: Fundamental Rights');
  const [mode, setMode] = useState('Pomodoro');

  // Planner State
  const [plannerView, setPlannerView] = useState("Today's Plan");
  const [planTitle, setPlanTitle] = useState('');
  const [planMinutes, setPlanMinutes] = useState('45');
  const [planSubject, setPlanSubject] = useState('upsc-polity');
  const [planPriority, setPlanPriority] = useState('Medium');
  const [planDateType, setPlanDateType] = useState('today');
  const [plannerExamFilter, setPlannerExamFilter] = useState('ALL');
  const [planExamTarget, setPlanExamTarget] = useState('UPSC');

  // Syllabus State
  const [expandedSubject, setExpandedSubject] = useState('upsc-polity');
  const [syllabusExamFilter, setSyllabusExamFilter] = useState('ALL');

  // Timer Focus State
  const [focusExamFilter, setFocusExamFilter] = useState('ALL');

  const [notifOpen, setNotifOpen] = useState(false);
  const interval = useRef(null);

  async function req(route, method = 'GET', body, t = token) {
    const r = await fetch(API + route, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + t
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || 'Request failed');
    return d;
  }

  async function refresh(t = token) {
    try {
      const [s, h, p, n, a, tp] = await Promise.all([
        req('/subjects', 'GET', null, t),
        req('/sessions', 'GET', null, t),
        req('/plan', 'GET', null, t),
        req('/notifications', 'GET', null, t),
        req('/analytics', 'GET', null, t),
        req('/topic-progress', 'GET', null, t).catch(() => [])
      ]);
      setSubjects(s);
      setSessions(h);
      setPlans(p);
      setNotes(n);
      setAnalytics(a);
      setTopicProgress(tp || []);
    } catch (e) {
      Alert.alert('Connection error', e.message);
    }
  }

  useEffect(() => {
    AsyncStorage.getItem('abhyasToken').then(async t => {
      if (t) {
        try {
          const me = await req('/me', 'GET', null, t);
          setToken(t);
          setUser(me.user);
          await refresh(t);
        } catch {
          await AsyncStorage.removeItem('abhyasToken');
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (running) interval.current = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(interval.current);
  }, [running]);

  async function login(credentialsOrEmail, overridePassword) {
    setAuthError('');
    setIsLoggingIn(true);
    try {
      let emailToUse = '';
      let passwordToUse = '';
      let isReg = register;
      let nameToUse = name;

      if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
        if (credentialsOrEmail.token) {
          setToken(credentialsOrEmail.token);
          setUser(credentialsOrEmail.user || { role: 'student', name: 'Demo Aspirant' });
          await AsyncStorage.setItem('abhyasToken', credentialsOrEmail.token);
          await refresh(credentialsOrEmail.token);
          return;
        }
        emailToUse = (credentialsOrEmail.email || '').trim();
        passwordToUse = (credentialsOrEmail.password || '').trim();
        isReg = credentialsOrEmail.isRegister ?? register;
        nameToUse = (credentialsOrEmail.name || name || '').trim();
      } else {
        emailToUse = (credentialsOrEmail || loginEmail || '').trim();
        passwordToUse = (overridePassword || password || '').trim();
      }

      const endpoint = API + '/auth/' + (isReg ? 'register' : 'login');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameToUse,
          email: emailToUse,
          password: passwordToUse
        })
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw Error(d.error || `Unable to sign in (Status ${res.status})`);
      setToken(d.token);
      setUser(d.user || { role: 'student', name: nameToUse || 'Demo Aspirant' });
      await AsyncStorage.setItem('abhyasToken', d.token);
      await refresh(d.token);
    } catch (e) {
      const isNetwork = e.message === 'Network request failed' || (e.message && e.message.toLowerCase().includes('failed to fetch'));
      const msg = isNetwork
        ? `Cannot connect to server at ${API}.\nPlease ensure the backend is running.`
        : e.message;
      setAuthError(msg);
      Alert.alert('Sign in error', msg);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSignOut() {
    setRunning(false);
    await AsyncStorage.removeItem('abhyasToken');
    setToken('');
    setUser(null);
  }

  function quickDemoFill(demoType = 'student') {
    if (demoType === 'admin') {
      setEmail('admin@abhyas.local');
      setPassword('ChangeMe123!');
      login('admin@abhyas.local', 'ChangeMe123!');
    } else {
      setEmail('student@abhyas.local');
      setPassword('Student123!');
      login('student@abhyas.local', 'Student123!');
    }
  }

  async function finish() {
    setRunning(false);
    let mins = Math.max(1, Math.round(elapsed / 60));
    try {
      await req('/sessions', 'POST', { subjectId: selected, minutes: mins, focusScore: 94, mode });
      setElapsed(0);
      await refresh();
      Alert.alert('Session saved', `${mins} minute(s) logged for ${subjects.find(x => x.id === selected)?.name || selected}!`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  // Planner actions
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
        exam: planExamTarget,
        priority: planPriority
      });
      setPlanTitle('');
      await refresh();
      Alert.alert('Task Planned', `Scheduled for ${planDateType === 'tomorrow' ? 'Tomorrow' : 'Today'} (${planExamTarget})!`);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function markPlan(p) {
    try {
      await req('/plan/' + p.id, 'PATCH', { done: !p.done });
      await refresh();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function deletePlan(p) {
    try {
      await req('/plan/' + p.id, 'DELETE');
      await refresh();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  function startPlanFocus(p) {
    if (p.subjectId) setSelected(p.subjectId);
    setSessionTopicTitle(p.title);
    setTab('Timer');
  }

  // Syllabus actions
  async function updateTopicStatus(topic, currentStatus, subjectId) {
    const cycle = {
      'Not Started': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'To Revise',
      'To Revise': 'Not Started'
    };
    const nextStatus = cycle[currentStatus] || 'In Progress';

    // Optimistic UI update
    setTopicProgress(prev => {
      const idx = prev.findIndex(item => item.topicId === topic.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status: nextStatus, subjectId };
        return updated;
      }
      return [...prev, { topicId: topic.id, subjectId, status: nextStatus }];
    });

    try {
      await req('/topic-progress/' + topic.id, 'PATCH', { status: nextStatus, subjectId });
      await refresh();
    } catch (e) {
      Alert.alert('Error updating topic', e.message);
      refresh();
    }
  }

  async function quickScheduleTopic(topic, subName, subId) {
    const isMpsc = String(subId).startsWith('mpsc') || String(subName).toLowerCase().includes('mpsc') || String(subName).toLowerCase().includes('maharashtra');
    const exam = isMpsc ? 'MPSC' : 'UPSC';
    try {
      await req('/plan', 'POST', {
        title: `${subName}: ${topic.name}`,
        minutes: 45,
        date: today(),
        subjectId: subId,
        exam,
        priority: 'High'
      });
      Alert.alert('Scheduled!', `"${topic.name}" added to today's ${exam} study planner.`);
      await refresh();
      setTab('Planner');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  async function markNote(n) {
    try {
      await req('/notifications/' + n.id + '/read', 'PATCH');
      refresh();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  }

  // Dynamic syllabus calculations with UPSC and MPSC separation
  const syllabusStats = useMemo(() => {
    const calc = (filterFn) => {
      let total = 0;
      let completed = 0;
      let inProgress = 0;
      let toRevise = 0;

      Object.entries(SYLLABUS_TOPICS).forEach(([sId, topics]) => {
        // Exclude legacy alias keys from double counting
        if (sId === 'polity' || sId === 'history' || sId === 'economy' || sId === 'geography' || sId === 'upsc-history' || sId === 'mpsc-marathi-english' || sId === 'mpsc-science-agri') return;
        if (filterFn && !filterFn(sId)) return;

        topics.forEach(t => {
          total++;
          const prog = topicProgress.find(p => p.topicId === t.id);
          if (prog) {
            if (prog.status === 'Completed') completed++;
            else if (prog.status === 'In Progress') inProgress++;
            else if (prog.status === 'To Revise') toRevise++;
          }
        });
      });

      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, inProgress, toRevise, pct };
    };

    const overall = calc(() => true);
    const upsc = calc(id => id.startsWith('upsc'));
    const mpsc = calc(id => id.startsWith('mpsc'));

    return {
      totalTopicsCount: overall.total,
      completedTopicsCount: overall.completed,
      inProgressCount: overall.inProgress,
      toReviseCount: overall.toRevise,
      overallPct: overall.pct,
      overall,
      upsc,
      mpsc
    };
  }, [topicProgress]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.blue} />
      </View>
    );
  }

  if (!token) {
    return (
      <AuthScreens
        onLogin={login}
        authError={authError}
        isSubmitting={isLoggingIn}
        apiUrl={API}
      />
    );
  }

  const total = analytics.totalMinutes || 0;
  const focus = analytics.averageFocus || 0;
  const unread = notes.filter(n => !(n.readBy || []).includes(user?.id));

  // ---------------- DASHBOARD TAB ----------------
  const Dashboard = () => (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Chip label="🔥 14-Day Streak" active />
        <Chip label="UPSC / MPSC 2026" />
      </View>
      <Title sub="Daily progress, focus milestones and target breakdown">
        Good morning, {user?.name?.split(' ')[0] || 'Aspirant'}!
      </Title>

      <Card>
        <Text style={txt(14, true)}>Today's Study Progress</Text>
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Ring
            value={Math.min(100, Math.round((total / 480) * 100))}
            size={160}
            label={`${Math.floor(total / 60)}h ${total % 60}m logged`}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={txt(12, false, C.muted)}>Daily goal: 8h 00m</Text>
          <Text style={txt(12, true, C.blue)}>
            {Math.max(0, 480 - total)} mins remaining
          </Text>
        </View>
        <Button label="▶ Start Studying Now" onPress={() => setTab('Timer')} />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={txt(15, true)}>Curriculum Completion</Text>
          <Text style={txt(13, true, C.blue)}>{syllabusStats.overallPct}% Overall</Text>
        </View>

        {/* Dual Progress: UPSC vs MPSC */}
        <View style={{ marginTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderColor: C.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={txt(12, true, '#1e40af')}>🏛️ UPSC Civil Services</Text>
            <Text style={txt(12, true, '#1e40af')}>{syllabusStats.upsc.pct}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: C.soft, borderRadius: 6, overflow: 'hidden' }}>
            <View style={{ backgroundColor: '#1e40af', width: `${syllabusStats.upsc.pct}%`, height: 6, borderRadius: 6 }} />
          </View>
          <Text style={[txt(10, false, C.muted), { marginTop: 3 }]}>
            {syllabusStats.upsc.completed} of {syllabusStats.upsc.total} UPSC topics mastered
          </Text>
        </View>

        <View style={{ marginTop: 10, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={txt(12, true, '#b45309')}>🚩 MPSC Maharashtra</Text>
            <Text style={txt(12, true, '#b45309')}>{syllabusStats.mpsc.pct}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#fef3c7', borderRadius: 6, overflow: 'hidden' }}>
            <View style={{ backgroundColor: '#b45309', width: `${syllabusStats.mpsc.pct}%`, height: 6, borderRadius: 6 }} />
          </View>
          <Text style={[txt(10, false, C.muted), { marginTop: 3 }]}>
            {syllabusStats.mpsc.completed} of {syllabusStats.mpsc.total} MPSC topics mastered
          </Text>
        </View>

        <Button label="Open Syllabus & Checklist →" subtle onPress={() => setTab('Syllabus')} />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={txt(15, true)}>Today's Scheduled Tasks</Text>
          <TouchableOpacity onPress={() => setTab('Planner')}>
            <Text style={txt(12, true, C.blue)}>View All ({plans.filter(p => p.date === today()).length})</Text>
          </TouchableOpacity>
        </View>
        {plans.filter(p => p.date === today()).length === 0 ? (
          <Text style={[txt(12, false, C.muted), { marginTop: 10 }]}>
            No tasks scheduled for today yet. Plan a study block now!
          </Text>
        ) : (
          plans
            .filter(p => p.date === today())
            .slice(0, 3)
            .map(p => (
              <View
                key={p.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: C.line
                }}
              >
                <TouchableOpacity onPress={() => markPlan(p)} style={{ marginRight: 10 }}>
                  <Ionicons
                    name={p.done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={p.done ? C.green : C.blue}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      txt(13, true),
                      p.done ? { textDecorationLine: 'line-through', color: C.muted } : null
                    ]}
                  >
                    {p.title}
                  </Text>
                  <Text style={txt(11, false, C.muted)}>
                    {p.minutes} mins • {p.priority || 'Medium'} priority
                  </Text>
                </View>
                {!p.done && (
                  <TouchableOpacity
                    onPress={() => startPlanFocus(p)}
                    style={{ backgroundColor: C.soft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 }}
                  >
                    <Text style={txt(11, true, C.blue)}>▶ Focus</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
        )}
        <Button label="+ Plan Today's Study" subtle onPress={() => setTab('Planner')} />
      </Card>
    </>
  );

  // ---------------- TIMER TAB ----------------
  const Timer = () => (
    <>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Chip label="Distraction-Free Mode ON" active />
        <Chip label="Rain White Noise" />
      </View>
      <View style={{ flexDirection: 'row' }}>
        {['Pomodoro', 'Stopwatch', 'Custom'].map(m => (
          <Chip key={m} label={m} active={mode === m} onPress={() => setMode(m)} />
        ))}
      </View>

      <Card>
        <Text style={txt(12, false, C.muted)}>FOCUS SUBJECT</Text>
        <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
          <Chip label="All Subjects" active={focusExamFilter === 'ALL'} onPress={() => setFocusExamFilter('ALL')} />
          <Chip label="🏛️ UPSC" active={focusExamFilter === 'UPSC'} onPress={() => setFocusExamFilter('UPSC')} />
          <Chip label="🚩 MPSC" active={focusExamFilter === 'MPSC'} onPress={() => setFocusExamFilter('MPSC')} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          {subjects
            .filter(s => {
              if (focusExamFilter === 'ALL') return true;
              const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
              return sExam === focusExamFilter;
            })
            .map(s => {
              const isMp = (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC';
              return (
                <Chip
                  key={s.id}
                  label={`${isMp ? '🚩 ' : '🏛️ '}${s.name}`}
                  active={selected === s.id}
                  onPress={() => setSelected(s.id)}
                />
              );
            })}
        </View>
        <Text style={[txt(12, false, C.muted), { marginTop: 12 }]}>SESSION FOCUS TOPIC</Text>
        <TextInput
          value={sessionTopicTitle}
          onChangeText={setSessionTopicTitle}
          placeholder="What topic are you studying?"
          style={input}
        />
      </Card>

      <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
        <Text style={txt(12, true, C.blue)}>◉ DEEP FOCUS • {mode.toUpperCase()}</Text>
        <View
          style={{
            width: 210,
            height: 210,
            borderRadius: 105,
            borderWidth: 10,
            borderColor: C.light,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 18,
            backgroundColor: '#fafcff'
          }}
        >
          <Text style={txt(38, true)}>
            {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
          </Text>
          <Text style={txt(12, false, C.muted)}>{running ? 'Focus in progress...' : 'Ready to start'}</Text>
        </View>
        <View style={{ width: '100%' }}>
          <Button
            label={running ? '⏸ Pause Session' : '▶ Start Focus Session'}
            onPress={() => setRunning(!running)}
          />
          <Button subtle label="✓ Finish & Save Session" onPress={finish} />
          <Button
            subtle
            label="↺ Reset Timer"
            onPress={() => {
              setRunning(false);
              setElapsed(0);
            }}
          />
        </View>
      </Card>
    </>
  );

  // ---------------- SYLLABUS TAB ----------------
  const Syllabus = () => {
    const isUPSC = syllabusExamFilter === 'UPSC';
    const isMPSC = syllabusExamFilter === 'MPSC';
    const currentScope = isUPSC ? syllabusStats.upsc : isMPSC ? syllabusStats.mpsc : syllabusStats.overall;

    const displayedSubjects = subjects.filter(s => {
      if (syllabusExamFilter === 'ALL') return true;
      const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
      return sExam === syllabusExamFilter;
    });

    const upscCount = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC').length;
    const mpscCount = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC').length;

    return (
      <>
        <Title sub="Interactive topic checklist, revision markers & mastery tracking">
          Subjects & Syllabus
        </Title>

        {/* Exam Section Switcher */}
        <Card style={{ paddingVertical: 12 }}>
          <Text style={[txt(11, true, C.muted), { marginBottom: 8 }]}>EXAM CURRICULUM SECTION</Text>
          <View style={{ flexDirection: 'row' }}>
            <Chip
              label={`All Modules (${subjects.length})`}
              active={syllabusExamFilter === 'ALL'}
              onPress={() => setSyllabusExamFilter('ALL')}
            />
            <Chip
              label={`🏛️ UPSC (${upscCount})`}
              active={syllabusExamFilter === 'UPSC'}
              onPress={() => setSyllabusExamFilter('UPSC')}
            />
            <Chip
              label={`🚩 MPSC (${mpscCount})`}
              active={syllabusExamFilter === 'MPSC'}
              onPress={() => setSyllabusExamFilter('MPSC')}
            />
          </View>
        </Card>

        {/* Overview Card */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={txt(13, true)}>
                {isUPSC ? '🏛️ UPSC Civil Services Completion' : isMPSC ? '🚩 MPSC Maharashtra Completion' : 'Overall Curriculum Completion'}
              </Text>
              <Text style={[txt(26, true), { marginVertical: 6 }]}>{currentScope.pct}%</Text>
              <Text style={txt(11, false, C.muted)}>
                {currentScope.completed} of {currentScope.total} topics mastered
              </Text>
            </View>
            <Ring value={currentScope.pct} size={110} label="Completed" />
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
              <Text style={txt(14, true, C.green)}>{currentScope.completed}</Text>
              <Text style={txt(10, false, C.muted)}>Mastered</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.amber)}>{currentScope.inProgress}</Text>
              <Text style={txt(10, false, C.muted)}>In Progress</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.purple)}>{currentScope.toRevise}</Text>
              <Text style={txt(10, false, C.muted)}>To Revise</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.muted)}>
                {Math.max(0, currentScope.total - currentScope.completed - currentScope.inProgress - currentScope.toRevise)}
              </Text>
              <Text style={txt(10, false, C.muted)}>Remaining</Text>
            </View>
          </View>
        </Card>

        {/* Revision Queue Notice */}
        {currentScope.toRevise > 0 && (
          <Card style={{ backgroundColor: C.purpleSoft, borderColor: '#ddd6fe' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="refresh-circle-outline" size={24} color={C.purple} />
              <Text style={txt(14, true, C.purple)}>Spaced Repetition Queue</Text>
            </View>
            <Text style={[txt(12, false, C.ink), { marginTop: 6 }]}>
              You have {currentScope.toRevise} topic(s) flagged for revision. Schedule a revision block today!
            </Text>
          </Card>
        )}

        {/* Subject Cards with Interactive Topics */}
        {displayedSubjects.map(s => {
          const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
          const isMp = sExam === 'MPSC';
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
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                {/* Small Subject Thumbnail Image (User-friendly, 46x46) */}
                {s.imageUrl ? (
                  <Image
                    source={{ uri: s.imageUrl }}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                      borderWidth: 1,
                      borderColor: isMp ? '#fde68a' : '#bfdbfe'
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                      borderWidth: 1,
                      borderColor: isMp ? '#fde68a' : '#bfdbfe',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Ionicons name={isMp ? 'flag' : 'school'} size={22} color={isMp ? '#b45309' : '#1e40af'} />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: isMp ? '#b45309' : '#1e40af',
                        backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 6
                      }}
                    >
                      {isMp ? '🚩 MPSC' : '🏛️ UPSC'}
                    </Text>
                    <Text style={txt(15, true)}>{s.name}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: C.muted,
                        backgroundColor: C.soft,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6
                      }}
                    >
                      {s.paper}
                    </Text>
                  </View>
                  <Text style={[txt(12, false, C.muted), { marginTop: 4 }]}>
                    {sCompleted} / {topicsList.length} topics mastered • {sPct}%
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
                  const targetDate = prog?.targetDate;
                  const timeSpent = prog?.timeSpentMinutes || 0;
                  const revisions = prog?.revisionCount || 0;
                  const pct = prog?.completionPercentage !== undefined
                    ? prog.completionPercentage
                    : (status === 'Completed' ? 100 : status === 'In Progress' ? 50 : status === 'To Revise' ? 75 : 0);

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
                        paddingVertical: 11,
                        borderBottomWidth: idx === topicsList.length - 1 ? 0 : 1,
                        borderColor: '#f1f5f9'
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
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

                          {/* Metadata row: Target Date, Time Spent, Revisions, Completion % */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                            {targetDate && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="calendar-outline" size={11} color={C.muted} />
                                <Text style={txt(10, false, C.muted)}>Due {targetDate}</Text>
                              </View>
                            )}
                            {timeSpent > 0 && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="time-outline" size={11} color={C.muted} />
                                <Text style={txt(10, false, C.muted)}>{timeSpent}m spent</Text>
                              </View>
                            )}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <Ionicons name="repeat-outline" size={11} color={revisions > 0 ? C.purple : C.muted} />
                              <Text style={txt(10, false, revisions > 0 ? C.purple : C.muted)}>
                                {revisions} rev{revisions === 1 ? '' : 's'}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <Text style={{ fontSize: 10, fontWeight: '700', color: pct === 100 ? C.green : C.blue }}>
                                {pct}% done
                              </Text>
                            </View>
                          </View>
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

                      {/* Mini Topic Progress Line */}
                      <View style={{ height: 3, backgroundColor: '#f1f5f9', borderRadius: 2, marginTop: 8 }}>
                        <View
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: status === 'Completed' ? C.green : status === 'To Revise' ? C.purple : C.blue,
                            borderRadius: 2
                          }}
                        />
                      </View>

                      {/* Topic Action Buttons (+1 Revise, Plan for Today) */}
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 6, gap: 14 }}>
                        <TouchableOpacity
                          onPress={() => {
                            const nextRev = revisions + 1;
                            updateTopicStatus(t, status, s.id, {
                              revisionCount: nextRev,
                              status: 'To Revise'
                            });
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                        >
                          <Ionicons name="add-circle-outline" size={13} color={C.purple} />
                          <Text style={txt(11, true, C.purple)}>+1 Revise</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => quickScheduleTopic(t, s.name, s.id)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
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
  };

  // ---------------- PLANNER TAB ----------------
  const Planner = () => {
    // Filter plans according to view and exam section
    const filteredPlans = useMemo(() => {
      let list = plans;
      if (plannerView === "Today's Plan") {
        list = list.filter(p => p.date === today() || !p.date);
      }
      if (plannerExamFilter !== 'ALL') {
        list = list.filter(p => {
          const pExam = p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC');
          return pExam === plannerExamFilter;
        });
      }
      return list;
    }, [plans, plannerView, plannerExamFilter]);

    const todayPlans = plans.filter(p => (p.date === today() || !p.date) && !p.done);
    const todayPlannedMinutes = todayPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
    const upscPlannedMinutes = todayPlans
      .filter(p => (p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC')
      .reduce((a, p) => a + Number(p.minutes || 0), 0);
    const mpscPlannedMinutes = todayPlans
      .filter(p => (p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC')
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

    const targetSubjects = subjects.filter(
      s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === planExamTarget
    );

    return (
      <>
        <Title sub="Target scheduling, task execution & daily workload balance">
          Study Planner
        </Title>

        {/* View Switcher Chips */}
        <Card style={{ paddingVertical: 12 }}>
          <Text style={[txt(11, true, C.muted), { marginBottom: 8 }]}>PLANNER TIMEFRAME</Text>
          <View style={{ flexDirection: 'row' }}>
            {["Today's Plan", 'Weekly View', 'Workload & Routine'].map(v => (
              <Chip key={v} label={v} active={plannerView === v} onPress={() => setPlannerView(v)} />
            ))}
          </View>
        </Card>

        {/* Exam Section Filter Chips */}
        <Card style={{ paddingVertical: 12 }}>
          <Text style={[txt(11, true, C.muted), { marginBottom: 8 }]}>EXAM FILTER</Text>
          <View style={{ flexDirection: 'row' }}>
            <Chip
              label="All Exam Tasks"
              active={plannerExamFilter === 'ALL'}
              onPress={() => setPlannerExamFilter('ALL')}
            />
            <Chip
              label="🏛️ UPSC Plans"
              active={plannerExamFilter === 'UPSC'}
              onPress={() => setPlannerExamFilter('UPSC')}
            />
            <Chip
              label="🚩 MPSC Plans"
              active={plannerExamFilter === 'MPSC'}
              onPress={() => setPlannerExamFilter('MPSC')}
            />
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
            {todayPlannedMinutes} min total • 🏛️ UPSC: {upscPlannedMinutes}m • 🚩 MPSC: {mpscPlannedMinutes}m
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
            const pExam = p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC');
            const isMp = pExam === 'MPSC';
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color: isMp ? '#b45309' : '#1e40af',
                          backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 6
                        }}
                      >
                        {isMp ? '🚩 MPSC' : '🏛️ UPSC'}
                      </Text>
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
                      ⏱ {p.minutes} mins • {p.done ? '✓ Completed' : 'Pending'}
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
                        <Text style={txt(11, true, C.white)}>▶ Focus</Text>
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
            Schedule focus intervals aligned with your MPSC or UPSC syllabus.
          </Text>

          {/* Exam Section Selector */}
          <Text style={txt(11, true, C.muted)}>TARGET EXAM SECTION</Text>
          <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 10 }}>
            <Chip
              label="🏛️ UPSC Civil Services"
              active={planExamTarget === 'UPSC'}
              onPress={() => {
                setPlanExamTarget('UPSC');
                const upSubs = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC');
                if (upSubs.length) setPlanSubject(upSubs[0].id);
              }}
            />
            <Chip
              label="🚩 MPSC Maharashtra"
              active={planExamTarget === 'MPSC'}
              onPress={() => {
                setPlanExamTarget('MPSC');
                const mpSubs = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC');
                if (mpSubs.length) setPlanSubject(mpSubs[0].id);
              }}
            />
          </View>

          {/* Subject Selector */}
          <Text style={txt(11, true, C.muted)}>SELECT {planExamTarget} SUBJECT</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, marginBottom: 8 }}>
            {(targetSubjects.length ? targetSubjects : subjects).map(s => (
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
              <Text style={txt(11, true, C.muted)}>⚡ QUICK PICK FROM UNFINISHED SYLLABUS</Text>
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
            placeholder="e.g. Fundamental Rights (Art 14–18)"
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

          <Button label={`+ Schedule ${planExamTarget} Study Task`} onPress={addPlan} />
        </Card>
      </>
    );
  };

  // ---------------- ANALYTICS TAB ----------------
  const Analytics = () => (
    <>
      <Title sub="Study performance, retention and endurance trends">
        Analytics & Focus Trends
      </Title>
      <View style={{ flexDirection: 'row' }}>
        <Chip label="This Week" active />
        <Chip label="Last Week" />
        <Chip label="This Month" />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12, marginBottom: 14 }}>
        {[
          ['Logged Hours', `${Math.floor(total / 60)}h ${total % 60}m`],
          ['Focus Quality', `${focus}%`],
          ['Total Sessions', analytics.sessionCount || sessions.length || 0],
          ['Daily Target', '8h 00m']
        ].map(([k, v]) => (
          <View key={k} style={[styles.card, { width: '48%', marginBottom: 0 }]}>
            <Text style={txt(11, false, C.muted)}>{k}</Text>
            <Text style={[txt(24, true), { marginTop: 12 }]}>{v}</Text>
          </View>
        ))}
      </View>
      <Card>
        <Text style={txt(16, true)}>Focus Quality Breakdown</Text>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Ring value={focus} size={180} label="Focus purity" />
        </View>
        <Text style={txt(12, false, C.muted)}>
          Calculated from completed sessions. Increases as you log distraction-free study blocks.
        </Text>
      </Card>
      <Card>
        <Text style={txt(15, true)}>Recent Sessions History</Text>
        {sessions.length === 0 ? (
          <Text style={[txt(12, false, C.muted), { marginTop: 8 }]}>No sessions recorded yet.</Text>
        ) : (
          sessions.slice(0, 5).map(s => (
            <View key={s.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: C.line }}>
              <Text style={txt(14, true)}>
                {subjects.find(x => x.id === s.subjectId)?.name || 'Study Session'}
              </Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 3 }]}>
                {s.minutes} mins • {s.focusScore}% focus • {new Date(s.startedAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </Card>
    </>
  );

  const tabs = [
    ['Dashboard', 'home-outline'],
    ['Timer', 'stopwatch-outline'],
    ['Syllabus', 'book-outline'],
    ['Planner', 'calendar-outline'],
    ['Analytics', 'analytics-outline']
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: C.bg,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 18,
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
            width: 36,
            height: 36,
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
        <TouchableOpacity onPress={() => setNotifOpen(!notifOpen)} style={{ padding: 8 }}>
          <Ionicons name="notifications-outline" size={22} color={C.ink} />
          {unread.length > 0 && (
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: '#e44242',
                position: 'absolute',
                right: 7,
                top: 7
              }}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            if (Platform.OS === 'web' && typeof window !== 'undefined') {
              if (window.confirm(`Signed in as: ${user?.name || 'Student'} (${user?.email || ''})\n\nDo you want to sign out and return to the sign-in page?`)) {
                await handleSignOut();
              }
            } else {
              Alert.alert('Account', `${user?.name}\n${user?.email}`, [
                {
                  text: 'Sign Out',
                  onPress: async () => {
                    await handleSignOut();
                  }
                },
                { text: 'Cancel' }
              ]);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: C.soft,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 14,
            marginLeft: 6,
            gap: 4
          }}
        >
          <Ionicons name="log-out-outline" size={17} color={C.blue} />
          <Text style={txt(12, true, C.blue)}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
        {notifOpen ? (
          <>
            <TouchableOpacity onPress={() => setNotifOpen(false)} style={{ marginBottom: 12 }}>
              <Text style={txt(13, true, C.blue)}>← Back to {tab}</Text>
            </TouchableOpacity>
            <Title sub="Your revision and study reminders">Notifications</Title>
            {notes.map(n => (
              <Card key={n.id}>
                <Text style={txt(11, true, C.blue)}>SPACED REPETITION PROTOCOL</Text>
                <Text style={[txt(16, true), { marginTop: 6 }]}>{n.title}</Text>
                <Text style={[txt(13, false, C.muted), { marginTop: 6 }]}>{n.message}</Text>
                <Button
                  label={(n.readBy || []).includes(user.id) ? 'Read ✓' : 'Mark as Read'}
                  subtle
                  onPress={() => markNote(n)}
                />
              </Card>
            ))}
          </>
        ) : tab === 'Dashboard' ? (
          <Dashboard />
        ) : tab === 'Timer' ? (
          <Timer />
        ) : tab === 'Syllabus' ? (
          <Syllabus />
        ) : tab === 'Planner' ? (
          <Planner />
        ) : (
          <Analytics />
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={{
          backgroundColor: C.white,
          borderTopWidth: 1,
          borderColor: C.line,
          flexDirection: 'row',
          paddingVertical: 10
        }}
      >
        {tabs.map(([t, ic]) => (
          <TouchableOpacity
            key={t}
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => {
              setTab(t);
              setNotifOpen(false);
              refresh();
            }}
          >
            <Ionicons name={ic} size={22} color={tab === t ? C.blue : '#667080'} />
            <Text style={txt(10, tab === t, tab === t ? C.blue : C.muted)}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const input = {
  backgroundColor: C.white,
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 11,
  marginTop: 6,
  marginBottom: 10,
  color: C.ink,
  fontSize: 13
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#edf2fc'
  }
});
