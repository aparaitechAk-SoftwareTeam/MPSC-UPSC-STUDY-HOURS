
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const file = path.join(__dirname, '../data/db.json');
const secret = process.env.JWT_SECRET || 'development-only-change-this-secret';

function initDb() {
  const email = process.env.ADMIN_EMAIL || 'admin@abhyas.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const now = new Date().toISOString();

  const initial = {
    users: [
      {
        id: 'admin1',
        name: 'Admin',
        email: email.toLowerCase(),
        role: 'admin',
        passwordHash: bcrypt.hashSync(password, 10)
      },
      {
        id: 'student1',
        name: 'Demo Aspirant',
        email: 'student@abhyas.local',
        role: 'student',
        passwordHash: bcrypt.hashSync('Student123!', 10)
      }
    ],
    subjects: [
      // UPSC Civil Services
      { id: 'upsc-polity', exam: 'UPSC', name: 'Indian Polity & Governance', paper: 'UPSC GS Paper II', topics: 95, completed: 48 },
      { id: 'upsc-history', exam: 'UPSC', name: 'Modern Indian History & Culture', paper: 'UPSC GS Paper I', topics: 76, completed: 35 },
      { id: 'upsc-economy', exam: 'UPSC', name: 'Indian Economy & Agriculture', paper: 'UPSC GS Paper III', topics: 64, completed: 29 },
      { id: 'upsc-geography', exam: 'UPSC', name: 'Geography, Environment & Climate', paper: 'UPSC GS Paper I & III', topics: 80, completed: 40 },
      { id: 'upsc-ethics', exam: 'UPSC', name: 'Ethics, Integrity & Aptitude', paper: 'UPSC GS Paper IV', topics: 45, completed: 18 },
      { id: 'upsc-security-ir', exam: 'UPSC', name: 'International Relations & Security', paper: 'UPSC GS Paper II & III', topics: 40, completed: 15 },

      // MPSC Maharashtra State Services
      { id: 'mpsc-history', exam: 'MPSC', name: 'History of Modern Maharashtra & Reformers', paper: 'MPSC GS Paper I', topics: 65, completed: 32 },
      { id: 'mpsc-geography', exam: 'MPSC', name: 'Geography & Agriculture of Maharashtra', paper: 'MPSC GS Paper I', topics: 58, completed: 28 },
      { id: 'mpsc-polity', exam: 'MPSC', name: 'Maharashtra Polity & District Administration', paper: 'MPSC GS Paper II', topics: 72, completed: 36 },
      { id: 'mpsc-economy', exam: 'MPSC', name: 'Economy of Maharashtra & Rural Development', paper: 'MPSC GS Paper III', topics: 60, completed: 24 },
      { id: 'mpsc-marathi-english', exam: 'MPSC', name: 'Marathi & English Language Skills', paper: 'MPSC Language Paper', topics: 50, completed: 30 },
      { id: 'mpsc-science-agri', exam: 'MPSC', name: 'Science, Tech & Agriculture Ecology', paper: 'MPSC GS Paper IV', topics: 54, completed: 20 }
    ],
    topicProgress: [],
    plans: [
      {
        id: 'plan1',
        userId: 'student1',
        title: 'Chapter 7: Fundamental Rights',
        minutes: 90,
        date: new Date().toISOString().slice(0, 10),
        subjectId: 'polity',
        priority: 'High',
        done: false
      }
    ],
    sessions: [
      {
        id: 'sess1',
        userId: 'student1',
        subjectId: 'polity',
        minutes: 45,
        mode: 'Pomodoro',
        focusScore: 94,
        startedAt: now
      }
    ],
    notifications: [
      {
        id: 'notice1',
        userId: 'all',
        title: 'Spaced Repetition Due',
        message: 'Review Fundamental Rights (Articles 14–32)',
        readBy: [],
        createdAt: now
      }
    ]
  };

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(initial, null, 2));
  return initial;
}

function read() {
  try {
    if (!fs.existsSync(file)) return initDb();

    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (!parsed || !Array.isArray(parsed.users) || parsed.users.length === 0) {
      return initDb();
    }

    return {
      users: parsed.users || [],
      subjects: parsed.subjects || [],
      topicProgress: parsed.topicProgress || [],
      plans: parsed.plans || [],
      sessions: parsed.sessions || [],
      notifications: parsed.notifications || []
    };
  } catch (err) {
    console.error('Error reading db.json:', err);
    throw err;
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

function auth(role) {
  return (req, res, next) => {
    try {
      const token = (req.headers.authorization || '').replace(/^Bearer /, '');
      const user = jwt.verify(token, secret);

      if (role && user.role !== role) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = user;
      next();
    } catch {
      return res.status(401).json({ error: 'Authentication required' });
    }
  };
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'Abhyas Tracker API' });
});

// Authentication
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();

  if (!name || !normalizedEmail || !cleanPassword || cleanPassword.length < 8) {
    return res.status(400).json({
      error: 'Name, email, and password (8+ characters) required'
    });
  }

  const db = read();

  if (db.users.some(user => user.email === normalizedEmail)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = {
    id: Date.now().toString(),
    name: String(name).trim(),
    email: normalizedEmail,
    role: 'student',
    passwordHash: bcrypt.hashSync(cleanPassword, 10)
  };

  db.users.push(user);
  save(db);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();

  const user = read().users.find(
    item => item.email === normalizedEmail
  );

  if (!user || !bcrypt.compareSync(cleanPassword, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: '7d' }
  );

  res.json({ token, user: publicUser(user) });
});

app.get('/api/me', auth(), (req, res) => {
  const user = read().users.find(item => item.id === req.user.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user: publicUser(user) });
});

// Syllabus: subjects
app.get('/api/subjects', auth(), (req, res) => {
  res.json(read().subjects);
});

// Syllabus: fetch individual topic progress for logged-in student
app.get('/api/topic-progress', auth(), (req, res) => {
  const db = read();

  res.json(
    db.topicProgress.filter(item => item.userId === req.user.id)
  );
});

// Syllabus: save or update an individual topic's status
app.patch('/api/topic-progress/:topicId', auth(), (req, res) => {
  const allowedStatuses = [
    'Not Started',
    'In Progress',
    'Completed',
    'To Revise'
  ];

  const { status, subjectId } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid topic status' });
  }

  const db = read();

  let item = db.topicProgress.find(
    entry =>
      entry.userId === req.user.id &&
      entry.topicId === req.params.topicId
  );

  if (item) {
    item.status = status;
    if (subjectId) item.subjectId = subjectId;
  } else {
    item = {
      id: Date.now().toString(),
      userId: req.user.id,
      topicId: req.params.topicId,
      subjectId: subjectId || null,
      status
    };

    db.topicProgress.push(item);
  }

  const sId = subjectId || item.subjectId;
  if (sId) {
    const sub = db.subjects.find(s => s.id === sId);
    if (sub) {
      const completedCount = db.topicProgress.filter(
        tp => tp.userId === req.user.id && tp.subjectId === sId && tp.status === 'Completed'
      ).length;
      sub.completed = completedCount;
    }
  }

  save(db);
  res.json(item);
});

// Planner: get plans belonging to logged-in student
app.get('/api/plan', auth(), (req, res) => {
  const db = read();

  res.json(
    db.plans.filter(item => item.userId === req.user.id)
  );
});

// Planner: create a plan
app.post('/api/plan', auth(), (req, res) => {
  const { title, minutes, date, subjectId, priority } = req.body;
  const duration = Number(minutes);

  if (
    typeof title !== 'string' ||
    !title.trim() ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    duration > 1440
  ) {
    return res.status(400).json({
      error: 'Enter a title and a duration between 1 and 1440 minutes'
    });
  }

  const validPriority = ['Low', 'Medium', 'High'];
  const selectedPriority = validPriority.includes(priority)
    ? priority
    : 'Medium';

  const db = read();

  const plan = {
    id: Date.now().toString(),
    userId: req.user.id,
    title: title.trim(),
    minutes: duration,
    date: date || new Date().toISOString().slice(0, 10),
    subjectId: subjectId || null,
    exam: req.body.exam || (String(subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC'),
    priority: selectedPriority,
    done: false
  };

  db.plans.push(plan);
  save(db);

  res.status(201).json(plan);
});

// Planner: update completion and priority
app.patch('/api/plan/:id', auth(), (req, res) => {
  const db = read();

  const plan = db.plans.find(
    item => item.id === req.params.id && item.userId === req.user.id
  );

  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  if (typeof req.body.done === 'boolean') {
    plan.done = req.body.done;
  }

  if (req.body.priority !== undefined) {
    if (!['Low', 'Medium', 'High'].includes(req.body.priority)) {
      return res.status(400).json({ error: 'Invalid priority' });
    }

    plan.priority = req.body.priority;
  }

  save(db);
  res.json(plan);
});

// Planner: delete a plan
app.delete('/api/plan/:id', auth(), (req, res) => {
  const db = read();
  const initialLength = db.plans.length;
  db.plans = db.plans.filter(
    item => !(item.id === req.params.id && item.userId === req.user.id)
  );

  if (db.plans.length === initialLength) {
    return res.status(404).json({ error: 'Plan not found' });
  }

  save(db);
  res.json({ success: true, id: req.params.id });
});

// Study sessions
app.get('/api/sessions', auth(), (req, res) => {
  res.json(
    read().sessions
      .filter(item => item.userId === req.user.id)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  );
});

app.post('/api/sessions', auth(), (req, res) => {
  const { subjectId, minutes, mode, focusScore } = req.body;
  const duration = Number(minutes);

  if (!Number.isFinite(duration) || duration <= 0 || duration > 1440) {
    return res.status(400).json({ error: 'Minutes must be 1–1440' });
  }

  const db = read();

  const session = {
    id: Date.now().toString(),
    userId: req.user.id,
    subjectId: subjectId || null,
    minutes: duration,
    mode: mode || 'Pomodoro',
    focusScore: Math.min(100, Math.max(0, Number(focusScore) || 90)),
    startedAt: new Date().toISOString()
  };

  db.sessions.push(session);
  save(db);

  res.status(201).json(session);
});

// Notifications
app.get('/api/notifications', auth(), (req, res) => {
  res.json(
    read().notifications.filter(
      item => item.userId === req.user.id || item.userId === 'all'
    )
  );
});

app.patch('/api/notifications/:id/read', auth(), (req, res) => {
  const db = read();

  const notification = db.notifications.find(
    item =>
      item.id === req.params.id &&
      (item.userId === req.user.id || item.userId === 'all')
  );

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.readBy = notification.readBy || [];

  if (!notification.readBy.includes(req.user.id)) {
    notification.readBy.push(req.user.id);
  }

  save(db);
  res.json(notification);
});

// Analytics
app.get('/api/analytics', auth(), (req, res) => {
  const sessions = read().sessions.filter(
    item => item.userId === req.user.id
  );

  const totalMinutes = sessions.reduce(
    (sum, item) => sum + item.minutes,
    0
  );

  const averageFocus = sessions.length
    ? Math.round(
        sessions.reduce((sum, item) => sum + item.focusScore, 0) /
        sessions.length
      )
    : 0;

  res.json({
    sessionCount: sessions.length,
    totalMinutes,
    averageFocus,
    weekly: sessions.slice(-7).map(item => ({
      date: item.startedAt.slice(0, 10),
      minutes: item.minutes
    }))
  });
});

// Admin routes
app.get('/api/admin/overview', auth('admin'), (req, res) => {
  const db = read();

  res.json({
    users: db.users.length,
    subjects: db.subjects.length,
    sessions: db.sessions.length,
    minutes: db.sessions.reduce((sum, item) => sum + item.minutes, 0)
  });
});

app.get('/api/admin/users', auth('admin'), (req, res) => {
  res.json(read().users.map(publicUser));
});

app.post('/api/admin/users', auth('admin'), (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '').trim();

  if (!name || !normalizedEmail || !cleanPassword || cleanPassword.length < 8) {
    return res.status(400).json({ error: 'Name, email, and password (8+ characters) required' });
  }

  const db = read();
  if (db.users.some(u => u.email === normalizedEmail)) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = {
    id: Date.now().toString(),
    name: String(name).trim(),
    email: normalizedEmail,
    role: role === 'admin' ? 'admin' : 'student',
    passwordHash: bcrypt.hashSync(cleanPassword, 10)
  };

  db.users.push(user);
  save(db);
  res.status(201).json(publicUser(user));
});

app.delete('/api/admin/users/:id', auth('admin'), (req, res) => {
  const db = read();
  if (req.params.id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete current logged-in administrator' });
  }

  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== req.params.id);
  if (db.users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }

  save(db);
  res.json({ ok: true, id: req.params.id });
});

app.get('/api/admin/subjects', auth('admin'), (req, res) => {
  res.json(read().subjects);
});

app.post('/api/admin/subjects', auth('admin'), (req, res) => {
  const { name, paper, topics, exam } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name required' });
  }

  const db = read();

  const subject = {
    id: Date.now().toString(),
    name: name.trim(),
    exam: (exam || (paper && paper.includes('MPSC') ? 'MPSC' : 'UPSC')).toUpperCase(),
    paper: paper || 'GS Paper II',
    topics: Math.max(0, Number(topics) || 0),
    completed: 0
  };

  db.subjects.push(subject);
  save(db);

  res.status(201).json(subject);
});

app.put('/api/admin/subjects/:id', auth('admin'), (req, res) => {
  const { name, paper, topics, exam } = req.body;
  const db = read();
  const subject = db.subjects.find(s => s.id === req.params.id);

  if (!subject) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  if (name && name.trim()) subject.name = name.trim();
  if (paper && paper.trim()) subject.paper = paper.trim();
  if (exam) subject.exam = exam.toUpperCase();
  if (topics !== undefined) subject.topics = Math.max(0, Number(topics) || 0);

  save(db);
  res.json(subject);
});

app.delete('/api/admin/subjects/:id', auth('admin'), (req, res) => {
  const db = read();

  db.subjects = db.subjects.filter(
    subject => subject.id !== req.params.id
  );

  save(db);
  res.json({ ok: true });
});

app.get('/api/admin/notifications', auth('admin'), (req, res) => {
  const db = read();
  res.json(db.notifications || []);
});

app.post('/api/admin/notifications', auth('admin'), (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      error: 'Title and message required'
    });
  }

  const db = read();

  const notification = {
    id: Date.now().toString(),
    userId: 'all',
    title: title.trim(),
    message: message.trim(),
    readBy: [],
    createdAt: new Date().toISOString()
  };

  db.notifications.unshift(notification);
  save(db);

  res.status(201).json(notification);
});

app.delete('/api/admin/notifications/:id', auth('admin'), (req, res) => {
  const db = read();
  db.notifications = (db.notifications || []).filter(n => n.id !== req.params.id);
  save(db);
  res.json({ ok: true, id: req.params.id });
});

app.get('/api/admin/sessions', auth('admin'), (req, res) => {
  const db = read();
  const enriched = (db.sessions || []).map(s => {
    const u = db.users.find(user => user.id === s.userId);
    const sub = db.subjects.find(subject => subject.id === s.subjectId);
    return {
      ...s,
      userName: u?.name || 'Aspirant',
      userEmail: u?.email || '',
      subjectName: sub?.name || 'General'
    };
  });
  res.json(enriched.sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || '')));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Abhyas API http://localhost:${port}`);
});
