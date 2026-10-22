import React, { useEffect, useRef, useState, useMemo } from 'react';
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
  StyleSheet
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

const API = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api');

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
  polity: [
    { id: 'polity-1', name: 'Preamble & Salient Features', chapter: 'Basics of Constitution' },
    { id: 'polity-2', name: 'Fundamental Rights (Articles 12–35)', chapter: 'Part III' },
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
    { id: 'history-7', name: 'Peasant, Tribal & Working Class Struggles', chapter: 'People’s Movements' },
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
  const [planSubject, setPlanSubject] = useState('polity');
  const [planPriority, setPlanPriority] = useState('Medium');
  const [planDateType, setPlanDateType] = useState('today');

  // Syllabus State
  const [expandedSubject, setExpandedSubject] = useState('polity');

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

  async function login() {
    try {
      const res = await fetch(API + '/auth/' + (register ? 'register' : 'login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: loginEmail, password })
      });
      const d = await res.json();
      if (!res.ok) throw Error(d.error || 'Unable to sign in');
      if (d.user.role !== 'student') throw Error('Use a student account');
      setToken(d.token);
      setUser(d.user);
      await AsyncStorage.setItem('abhyasToken', d.token);
      await refresh(d.token);
    } catch (e) {
      Alert.alert('Sign in error', e.message);
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
        priority: planPriority
      });
      setPlanTitle('');
      await refresh();
      Alert.alert('Task Planned', `Scheduled for ${planDateType === 'tomorrow' ? 'Tomorrow' : 'Today'}!`);
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
    try {
      await req('/plan', 'POST', {
        title: `${subName}: ${topic.name}`,
        minutes: 45,
        date: today(),
        subjectId: subId,
        priority: 'High'
      });
      Alert.alert('Scheduled!', `"${topic.name}" added to today's study planner.`);
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

  // Dynamic syllabus calculations
  const syllabusStats = useMemo(() => {
    let totalTopicsCount = 0;
    let completedTopicsCount = 0;
    let inProgressCount = 0;
    let toReviseCount = 0;

    Object.entries(SYLLABUS_TOPICS).forEach(([sId, topics]) => {
      topics.forEach(t => {
        totalTopicsCount++;
        const prog = topicProgress.find(p => p.topicId === t.id);
        if (prog) {
          if (prog.status === 'Completed') completedTopicsCount++;
          else if (prog.status === 'In Progress') inProgressCount++;
          else if (prog.status === 'To Revise') toReviseCount++;
        }
      });
    });

    const overallPct = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;
    return { totalTopicsCount, completedTopicsCount, inProgressCount, toReviseCount, overallPct };
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
          <Text style={[txt(28, true), { textAlign: 'center', marginTop: 18 }]}>Abhyas Tracker</Text>
          <Text style={[txt(13, false, C.muted), { textAlign: 'center', marginBottom: 28 }]}>
            Focused study • Dynamic syllabus • Smart planner
          </Text>
          {register && (
            <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={input} />
          )}
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            value={loginEmail}
            onChangeText={setEmail}
            style={input}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={input}
          />
          <Button label={register ? 'Create Account' : 'Sign In'} onPress={login} />
          <Button
            label={register ? 'Already registered? Sign in' : 'Create a student account'}
            subtle
            onPress={() => setRegister(!register)}
          />
          <Text style={[txt(11, false, C.muted), { textAlign: 'center', marginTop: 22 }]}>
            Demo student: student@abhyas.local / Student123!
          </Text>
        </View>
      </SafeAreaView>
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
          <Text style={txt(13, true, C.blue)}>{syllabusStats.overallPct}%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6, marginVertical: 10 }}>
          <View
            style={{
              backgroundColor: C.blue,
              width: `${syllabusStats.overallPct}%`,
              height: 8,
              borderRadius: 6
            }}
          />
        </View>
        <Text style={txt(12, false, C.muted)}>
          {syllabusStats.completedTopicsCount} of {syllabusStats.totalTopicsCount} topics mastered •{' '}
          {syllabusStats.toReviseCount} to revise
        </Text>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {subjects.map(s => (
            <Chip key={s.id} label={s.name} active={selected === s.id} onPress={() => setSelected(s.id)} />
          ))}
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

  // ---------------- PLANNER TAB ----------------
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
            {todayPlannedMinutes} min scheduled today • {Math.max(0, 480 - todayPlannedMinutes)} min available capacity
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

          <Button label="+ Schedule Study Task" onPress={addPlan} />
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
          onPress={() =>
            Alert.alert('Account', `${user?.name}\n${user?.email}`, [
              {
                text: 'Sign Out',
                onPress: async () => {
                  setRunning(false);
                  await AsyncStorage.removeItem('abhyasToken');
                  setToken('');
                  setUser(null);
                }
              },
              { text: 'Cancel' }
            ])
          }
          style={{ padding: 6, marginLeft: 4 }}
        >
          <Ionicons name="person-circle-outline" size={26} color={C.blue} />
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
