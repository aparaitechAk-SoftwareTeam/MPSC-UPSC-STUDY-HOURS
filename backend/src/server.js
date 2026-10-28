
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = Number(process.env.PORT) || 4000;
const DB_NAME = process.env.DB_NAME || 'abhyas_tracker';
const JWT_SECRET = process.env.JWT_SECRET;

let client;
let db;

const asyncRoute = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const col = name => db.collection(name);
const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function auth(role) {
  return (req, res, next) => {
    try {
      const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (!token) return res.status(401).json({ error: 'Authentication required' });
      const user = jwt.verify(token, JWT_SECRET);
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

app.get('/api/health', (req, res) =>
  res.json({ ok: true, service: 'Abhyas Tracker API' })
);

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || String(password).length < 8) {
    return res.status(400).json({
      error: 'Name, email, and password (8+ characters) required'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (await col('users').findOne({ email: normalizedEmail })) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = {
    id: makeId(),
    name: String(name).trim(),
    email: normalizedEmail,
    role: 'student',
    passwordHash: await bcrypt.hash(String(password), 10)
  };

  try {
    await col('users').insertOne(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.status(201).json({ token, user: publicUser(user) });
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = await col('users').findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token, user: publicUser(user) });
}));

app.get('/api/me', auth(), asyncRoute(async (req, res) => {
  const user = await col('users').findOne({ id: req.user.id });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
}));

app.get('/api/subjects', auth(), asyncRoute(async (req, res) => {
  res.json(await col('subjects').find({}).toArray());
}));

app.get('/api/plan', auth(), asyncRoute(async (req, res) => {
  res.json(await col('plans').find({ userId: req.user.id }).toArray());
}));

app.post('/api/plan', auth(), asyncRoute(async (req, res) => {
  const { title, minutes, date, subjectId } = req.body || {};
  if (!title || !Number.isFinite(Number(minutes)) || Number(minutes) <= 0) {
    return res.status(400).json({ error: 'Title and positive minutes required' });
  }

  const item = {
    id: makeId(),
    userId: req.user.id,
    title,
    minutes: Number(minutes),
    date: date || new Date().toISOString().slice(0, 10),
    subjectId: subjectId || null,
    done: false
  };

  await col('plans').insertOne(item);
  res.status(201).json(item);
}));

app.patch('/api/plan/:id', auth(), asyncRoute(async (req, res) => {
  const plans = col('plans');
  const item = await plans.findOne({
    id: req.params.id,
    userId: req.user.id
  });

  if (!item) return res.status(404).json({ error: 'Not found' });

  const done = !!req.body?.done;
  await plans.updateOne(
    { id: item.id, userId: req.user.id },
    { $set: { done } }
  );
  res.json({ ...item, done });
}));

app.get('/api/sessions', auth(), asyncRoute(async (req, res) => {
  const sessions = await col('sessions')
    .find({ userId: req.user.id })
    .sort({ startedAt: -1 })
    .toArray();
  res.json(sessions);
}));

app.post('/api/sessions', auth(), asyncRoute(async (req, res) => {
  const { subjectId, minutes, mode, focusScore } = req.body || {};
  const m = Number(minutes);

  if (!Number.isFinite(m) || m <= 0 || m > 1440) {
    return res.status(400).json({ error: 'Minutes must be 1-1440' });
  }

  const item = {
    id: makeId(),
    userId: req.user.id,
    subjectId: subjectId || null,
    minutes: m,
    mode: mode || 'Pomodoro',
    focusScore: Math.min(100, Math.max(0, Number(focusScore) || 90)),
    startedAt: new Date().toISOString()
  };

  await col('sessions').insertOne(item);
  res.status(201).json(item);
}));

app.get('/api/notifications', auth(), asyncRoute(async (req, res) => {
  const items = await col('notifications').find({
    $or: [{ userId: req.user.id }, { userId: 'all' }]
  }).toArray();
  res.json(items);
}));

app.patch('/api/notifications/:id/read', auth(), asyncRoute(async (req, res) => {
  const notifications = col('notifications');
  const item = await notifications.findOne({
    id: req.params.id,
    $or: [{ userId: req.user.id }, { userId: 'all' }]
  });

  if (!item) return res.status(404).json({ error: 'Not found' });

  const readBy = Array.isArray(item.readBy) ? item.readBy : [];
  if (!readBy.includes(req.user.id)) readBy.push(req.user.id);

  await notifications.updateOne(
    { id: item.id },
    { $set: { readBy } }
  );
  res.json({ ...item, readBy });
}));

app.get('/api/analytics', auth(), asyncRoute(async (req, res) => {
  const [sessions, subjects] = await Promise.all([
    col('sessions').find({ userId: req.user.id }).toArray(),
    col('subjects').find({}).toArray()
  ]);

  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (Number(s.minutes) || 0), 0
  );
  const averageFocus = sessions.length
    ? Math.round(sessions.reduce(
        (sum, s) => sum + (Number(s.focusScore) || 0), 0
      ) / sessions.length)
    : 0;

  const today = new Date();
  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - 29 + i
    ));
    return { date: d.toISOString().slice(0, 10), minutes: 0 };
  });

  const dailyMap = new Map(dates.map(d => [d.date, d]));
  const recent = sessions.filter(
    s => s.startedAt && dailyMap.has(s.startedAt.slice(0, 10))
  );

  recent.forEach(s => {
    dailyMap.get(s.startedAt.slice(0, 10)).minutes += Number(s.minutes) || 0;
  });

  const subjectNames = new Map(subjects.map(s => [s.id, s.name]));
  const subjectMap = new Map();

  recent.forEach(s => {
    const id = s.subjectId || 'unassigned';
    const item = subjectMap.get(id) || {
      subjectId: id,
      name: subjectNames.get(id) || 'Unassigned',
      minutes: 0,
      sessions: 0
    };
    item.minutes += Number(s.minutes) || 0;
    item.sessions++;
    subjectMap.set(id, item);
  });

  res.json({
    sessionCount: sessions.length,
    totalMinutes,
    averageFocus,
    averageSessionMinutes: sessions.length
      ? Math.round(totalMinutes / sessions.length) : 0,
    weekly: dates.slice(-7),
    daily: dates,
    subjectBreakdown: [...subjectMap.values()].sort((a, b) => b.minutes - a.minutes),
    recentSessions: sessions
      .slice()
      .sort((a, b) => String(b.startedAt || '').localeCompare(String(a.startedAt || '')))
      .slice(0, 10)
  });
}));

app.get('/api/admin/analytics', auth('admin'), asyncRoute(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const from = String(req.query.from || defaultFrom);
  const to = String(req.query.to || today);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
      from > to || from > today || to < '2000-01-01') {
    return res.status(400).json({ error: 'Invalid date range' });
  }

  const [users, subjects, allSessions] = await Promise.all([
    col('users').find({}).toArray(),
    col('subjects').find({}).toArray(),
    col('sessions').find({}).toArray()
  ]);

  const subjectNames = new Map(subjects.map(s => [String(s.id), s.name]));
  const sessions = allSessions.filter(s => {
    const date = String(s.startedAt || '').slice(0, 10);
    return date >= from && date <= to;
  }).map(s => ({
    id: s.id,
    subjectId: s.subjectId || null,
    subject: subjectNames.get(String(s.subjectId)) || 'Unassigned',
    minutes: Number(s.minutes) || 0,
    mode: s.mode || 'Pomodoro',
    focusScore: Number(s.focusScore) || 0,
    startedAt: s.startedAt
  })).sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));

  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const dailyMap = new Map();
  const subjectMap = new Map();

  sessions.forEach(s => {
    const day = String(s.startedAt || '').slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + s.minutes);
    const item = subjectMap.get(s.subject) || {
      subject: s.subject, sessions: 0, minutes: 0
    };
    item.sessions++;
    item.minutes += s.minutes;
    subjectMap.set(s.subject, item);
  });

  const daily = [];
  for (let d = new Date(from + 'T12:00:00Z'),
       end = new Date(to + 'T12:00:00Z'); d <= end;
       d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    const minutes = dailyMap.get(date) || 0;
    daily.push({ date, minutes, hours: Number((minutes / 60).toFixed(2)) });
  }

  res.json({
    range: { from, to },
    summary: {
      totalStudents: users.filter(u => u.role !== 'admin').length,
      totalSessions: sessions.length,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
      averageFocus: sessions.length
        ? Math.round(sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length)
        : 0,
      averageSessionMinutes: sessions.length
        ? Math.round(totalMinutes / sessions.length) : 0
    },
    daily,
    subjectBreakdown: [...subjectMap.values()].sort((a, b) => b.minutes - a.minutes),
    sessions: sessions.slice(0, 100)
  });
}));

app.get('/api/admin/overview', auth('admin'), asyncRoute(async (req, res) => {
  const [users, subjects, sessions] = await Promise.all([
    col('users').countDocuments(),
    col('subjects').countDocuments(),
    col('sessions').find({}).toArray()
  ]);
  res.json({
    users, subjects, sessions: sessions.length,
    minutes: sessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)
  });
}));

app.get('/api/admin/users', auth('admin'), asyncRoute(async (req, res) => {
  res.json((await col('users').find({}).toArray()).map(publicUser));
}));

app.get('/api/admin/subjects', auth('admin'), asyncRoute(async (req, res) => {
  res.json(await col('subjects').find({}).toArray());
}));

app.post('/api/admin/subjects', auth('admin'), asyncRoute(async (req, res) => {
  const { name, paper, topics } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name required' });

  const item = {
    id: makeId(), name, paper: paper || 'GS Paper II',
    topics: Number(topics) || 0, completed: 0
  };
  await col('subjects').insertOne(item);
  res.status(201).json(item);
}));

app.delete('/api/admin/subjects/:id', auth('admin'), asyncRoute(async (req, res) => {
  await col('subjects').deleteOne({ id: req.params.id });
  res.json({ ok: true });
}));

app.post('/api/admin/notifications', auth('admin'), asyncRoute(async (req, res) => {
  const { title, message } = req.body || {};
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message required' });
  }

  const item = {
    id: makeId(), userId: 'all', title, message,
    readBy: [], createdAt: new Date().toISOString()
  };
  await col('notifications').insertOne(item);
  res.status(201).json(item);
}));

app.use((err, req, res, next) => {
  console.error('API error:', err.message);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Server error' });
});

async function start() {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is missing from the environment.');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from the environment.');

  client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });
  await client.connect();
  db = client.db(DB_NAME);
  await db.command({ ping: 1 });

  await col('users').createIndex({ email: 1 }, { unique: true, name: 'email_1' });
  await col('users').createIndex({ id: 1 }, { unique: true, name: 'id_1' });
  for (const name of ['subjects', 'plans', 'sessions', 'notifications']) {
    await col(name).createIndex({ id: 1 }, { unique: true, name: 'id_1' });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Abhyas API connected to MongoDB and listening on port ${PORT}`);
  });
}

start().catch(async error => {
  console.error('Failed to start Abhyas API:', error.message);
  if (client) await client.close().catch(() => {});
  process.exit(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    if (client) await client.close().catch(() => {});
    process.exit(0);
  });
}
