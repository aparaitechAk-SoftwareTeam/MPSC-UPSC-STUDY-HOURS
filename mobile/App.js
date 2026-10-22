import React, { useEffect, useRef, useState } from 'react';
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
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import Timer from './Timer';

const C = {
  bg: '#f7f9fe',
  white: '#fff',
  ink: '#142841',
  muted: '#72849f',
  blue: '#37689f',
  mid: '#80a9e5',
  soft: '#e9f0fc',
  line: '#e8eef8',
  light: '#dce8fb'
};

const API =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api');

const card = {
  backgroundColor: C.white,
  borderRadius: 20,
  padding: 18,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#edf2fc'
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

const today = () => new Date().toISOString().slice(0, 10);

function Chip({ label, active, onPress }) {
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
      <Text style={txt(11, true, active ? 'white' : C.blue)}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Card({ children, style }) {
  return <View style={[card, style]}>{children}</View>;
}

function Title({ children, sub }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={txt(23, true)}>{children}</Text>
      {sub && (
        <Text
          style={[
            txt(12, false, C.muted),
            { marginTop: 5, lineHeight: 17 }
          ]}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

function Ring({ value = 65, size = 160, label = 'Mastered' }) {
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

      <Text style={txt(25, true)}>{safeValue}%</Text>
      <Text style={txt(11, false, C.muted)}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress, subtle = false, disabled = false }) {
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
      <Text style={txt(13, true, subtle ? C.blue : C.white)}>
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

  // Reset confirmation state belongs inside the App component.
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exitFocusConfirmOpen, setExitFocusConfirmOpen] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});

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

    const data = await response.json();

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

        // Trigger the existing save flow once.
        if (!autoSaveTriggered.current) {
          autoSaveTriggered.current = true;
          void finish();
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
    try {
      const response = await fetch(
        API + '/auth/' + (register ? 'register' : 'login'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email: loginEmail,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw Error(data.error || 'Unable to sign in');
      }

      if (data.user.role !== 'student') {
        throw Error('Use a student account');
      }

      setToken(data.token);
      setUser(data.user);

      await AsyncStorage.setItem('abhyasToken', data.token);
      await refresh(data.token);
    } catch (error) {
      Alert.alert('Sign in error', error.message);
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
    if (savingSession.current) return;
    setResetConfirmOpen(true);
  }

  // Cancel must not change the timer or elapsed time.
  function cancelReset() {
    setResetConfirmOpen(false);
  }

  // Confirmed reset stops the timer and clears elapsed time.
  function confirmReset() {
    if (savingSession.current) return;

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
  async function finish() {
    if (savingSession.current) return;

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
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={C.blue} />
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
              value={name}
              onChangeText={setName}
              style={input}
            />
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

  const Dashboard = () => (
    <>
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

      <Title sub="Your study sanctuary • One session at a time">
        Good morning, {user?.name?.split(' ')[0]}!
      </Title>

      <Card>
        <Text style={txt(14, true)}>Today's Study Progress</Text>

        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Ring
            value={Math.min(100, Math.round((total / 480) * 100))}
            size={172}
            label={`${Math.floor(total / 60)}h ${total % 60}m logged`}
          />
        </View>

        <Text style={txt(12, false, C.muted)}>Daily goal: 8h 00m</Text>

        <Button
          label="▶ Start Studying Now"
          onPress={() => setTab('Timer')}
        />
      </Card>

      <Card>
        <Text style={txt(15, true)}>Study Briefing & Prep</Text>
        <Text style={[txt(12, false, C.muted), { marginTop: 8 }]}>
          Chapter 7 • Fundamental Rights
        </Text>
        <Text style={[txt(20, true), { marginTop: 8 }]}>
          Target Focus Block: 1h 30m
        </Text>

        <Button
          label="Open Focus Timer"
          subtle
          onPress={() => setTab('Timer')}
        />
      </Card>

      <Card>
        <Text style={txt(15, true)}>Chapter Milestone</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <Ring value={completion} size={130} />

          <View>
            <Text style={txt(12)}>Target Today: 90 min</Text>
            <Text
              style={[
                txt(12, false, C.muted),
                { marginTop: 12 }
              ]}
            >
              Retention: 84% • SRS T2
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={txt(15, true)}>Revision Queue</Text>
        <Text style={[txt(12, false, C.muted), { marginTop: 7 }]}>
          {unread.length} notification(s) need your attention.
        </Text>

        <Button
          label="Review Now"
          subtle
          onPress={() => setNotifOpen(true)}
        />
      </Card>
    </>
  );


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
          label="Review Notifications →"
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

  const Analytics = () => (
    <>
      <Title sub="Study performance, retention and endurance trends">
        Analytics & Focus Trends
      </Title>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Chip label="This Week" active />
        <Chip label="Last Week" />
        <Chip label="This Month" />
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 12,
          marginBottom: 14
        }}
      >
        {[
          ['Logged Hours', `${Math.floor(total / 60)}h ${total % 60}m`],
          ['Focus Quality', `${focus}%`],
          ['Total Sessions', analytics.sessionCount || 0],
          ['Daily Target', '8h 00m']
        ].map(([label, value]) => (
          <View
            key={label}
            style={[card, { width: '48%', marginBottom: 0 }]}
          >
            <Text style={txt(11, false, C.muted)}>{label}</Text>
            <Text style={[txt(24, true), { marginTop: 15 }]}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Card>
        <Text style={txt(16, true)}>Focus Quality Breakdown</Text>

        <View style={{ alignItems: 'center', padding: 20 }}>
          <Ring value={focus} size={200} label="Focus purity" />
        </View>

        <Text style={txt(12, false, C.muted)}>
          Based on your recorded sessions. Weekly chart updates as you study.
        </Text>
      </Card>

      <Card>
        <Text style={txt(15, true)}>Session History</Text>

        {sessions.length === 0 ? (
          <Text>No sessions yet.</Text>
        ) : (
          sessions.map(session => (
            <View
              key={session.id}
              style={{
                paddingVertical: 13,
                borderBottomWidth: 1,
                borderColor: C.line
              }}
            >
              <Text style={txt(14, true)}>
                {subjects.find(subject => subject.id === session.subjectId)
                  ?.name || 'Study Session'}
              </Text>

              <Text style={txt(12, false, C.muted)}>
                {session.minutes} mins • {session.focusScore}% focus •{' '}
                {session.startedAt
                  ? new Date(session.startedAt).toLocaleDateString()
                  : 'Date unavailable'}
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
        paddingTop:
          Platform.OS === 'android' ? StatusBar.currentHeight : 0
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

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
          <>
            <TouchableOpacity onPress={() => setNotifOpen(false)}>
              <Text style={txt(12, true, C.blue)}>← Back to {tab}</Text>
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
                      ? 'Read ✓'
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
  />
        ) : tab === 'Syllabus' ? (
          <Syllabus />
        ) : tab === 'Planner' ? (
          <Planner />
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
            onPress={() => {
              setTab(tabName);
              setNotifOpen(false);
              refresh();
            }}
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

      )}
    </SafeAreaView>
  );
}