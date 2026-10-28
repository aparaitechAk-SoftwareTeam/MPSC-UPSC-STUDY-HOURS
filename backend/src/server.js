require('dotenv').config();
const { connectDB } = require('./db');
const {
    User,
    Subject,
    Plan,
    Session,
    Notification,
    Ticket
} = require('./models');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

// Support Private Network Access and instant preflights for Chrome/Edge on ANY Wi-Fi
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With,Access-Control-Request-Private-Network');
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Access-Control-Request-Private-Network']
}));

app.use(express.json({ limit: '2mb' }));

const secret = process.env.JWT_SECRET || 'development-only-change-this-secret';

// In-memory OTP storage with TTL
const otpStore = new Map();

// Configure Nodemailer SMTP Transport
let realTransporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  realTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
  });
}

async function sendRealEmail(to, subject, html) {
  if (!realTransporter) {
    console.log(`[EMAIL DISPATCH - SIMULATED] To: ${to} | Subject: ${subject}`);
    return { sent: true, simulated: true };
  }
  try {
    const info = await realTransporter.sendMail({
      from: process.env.SMTP_FROM || `"Abhyas Tracker" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[EMAIL DISPATCH - SUCCESS] Sent to: ${to} | MsgId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL DISPATCH - ERROR] Failed to send to ${to}:`, err.message);
    return { sent: false, error: err.message };
  }
}

function auth(role) {
    return (req, res, next) => {
        try {
            const t = (req.headers.authorization || '').replace(/^Bearer /, '');
            const u = jwt.verify(t, secret);
            if (role && u.role !== role) return res.status(403).json({ error: 'Forbidden' });
            req.user = u;
            next();
        } catch {
            return res.status(401).json({ error: 'Authentication required' });
        }
    };
}

function publicUser(u) {
    if (!u) return null;
    const obj = typeof u.toPublicJSON === 'function'
        ? u.toPublicJSON()
        : (typeof u.toJSON === 'function' ? u.toJSON() : { ...u });
    delete obj.passwordHash;
    delete obj._id;
    delete obj.__v;
    return obj;
}

function cleanDoc(doc) {
    if (!doc) return doc;
    const obj = typeof doc.toJSON === 'function' ? doc.toJSON() : { ...doc };
    delete obj._id;
    delete obj.__v;
    return obj;
}

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'Abhyas Tracker API' }));

// -------------------------------------------------------------
// OTP Verification & Forgot Password
// -------------------------------------------------------------
app.post('/api/auth/send-otp', async (req, res) => {
  const { target, type = 'forgot', method = 'email' } = req.body || {};
  const cleanTarget = String(target || '').trim().toLowerCase();

  if (!cleanTarget) {
    return res.status(400).json({ error: 'Email address or mobile number is required' });
  }

  // Generate 6-digit cryptographic random OTP
  const code = String(crypto.randomInt(100000, 999999));
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanTarget, {
    code,
    type,
    method,
    expiresAt
  });

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <h2 style="color: #1e3a8a; margin-top: 0; text-align: center;">Abhyas Tracker Security</h2>
      <p style="color: #475569; font-size: 15px;">Your single-use verification code for <strong>${type === 'login' ? 'Instant Sign In' : 'Password Reset'}</strong> is:</p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #2563eb; background: #eff6ff; padding: 12px 24px; border-radius: 8px; border: 1px dashed #bfdbfe; display: inline-block;">
          ${code}
        </span>
      </div>
      <p style="color: #64748b; font-size: 13px;">This code expires in 10 minutes. For your security, never share this code with anyone.</p>
    </div>
  `;

  let recipientEmail = cleanTarget;

  if (method === 'mobile' || !cleanTarget.includes('@')) {
    const cleanMobile = cleanTarget.replace(/\D/g, '');
    let user = null;
    try {
      user = await User.findOne({ phone: cleanMobile });
    } catch {}

    if (user && user.email) {
      recipientEmail = user.email;
      otpStore.set(user.email.toLowerCase(), {
        code,
        type,
        method,
        expiresAt
      });
      sendRealEmail(user.email, `Your Abhyas Verification Code: ${code}`, emailHtml)
        .catch(err => console.error('[EMAIL DISPATCH ERROR]', err.message));
    } else {
      return res.status(404).json({
        error: `No registered student account found for mobile ${cleanMobile}. Please sign up first with your email and mobile number!`
      });
    }
  } else {
    sendRealEmail(cleanTarget, `Your Abhyas Verification Code: ${code}`, emailHtml)
      .catch(err => console.error('[EMAIL DISPATCH ERROR]', err.message));
  }

  res.json({
    success: true,
    delivered: true,
    message: (method === 'mobile' || !cleanTarget.includes('@'))
      ? `Verification code dispatched to your registered email (${recipientEmail}). Check your inbox!`
      : `Verification code sent to ${cleanTarget}. Please check your inbox & spam folder.`
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { target, code } = req.body || {};
  const cleanTarget = String(target || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();

  const record = otpStore.get(cleanTarget);
  if (!record) {
    return res.status(400).json({ error: 'No active code found for this account. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanTarget);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  if (record.code !== cleanCode) {
    return res.status(400).json({ error: 'Incorrect verification code. Please check and try again.' });
  }

  res.json({ success: true, verified: true });
});

app.post('/api/auth/login-otp', async (req, res) => {
  const { target, code } = req.body || {};
  const cleanTarget = String(target || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();

  const record = otpStore.get(cleanTarget);
  if (!record || Date.now() > record.expiresAt || record.code !== cleanCode) {
    return res.status(401).json({ error: 'Invalid or expired OTP code.' });
  }

  otpStore.delete(cleanTarget);

  try {
    const user = await User.findOne({
      $or: [{ email: cleanTarget }, { phone: cleanTarget.replace(/\D/g, '') }]
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found. Please sign up first.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { target, code, newPassword } = req.body || {};
  const cleanTarget = String(target || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();
  const cleanPass = String(newPassword || '').trim();

  if (!cleanPass || cleanPass.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const record = otpStore.get(cleanTarget);
  if (!record || Date.now() > record.expiresAt || record.code !== cleanCode) {
    return res.status(400).json({ error: 'Invalid or expired verification session. Please verify your OTP again.' });
  }

  otpStore.delete(cleanTarget);

  try {
    const user = await User.findOne({
      $or: [{ email: cleanTarget }, { phone: cleanTarget.replace(/\D/g, '') }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    user.passwordHash = bcrypt.hashSync(cleanPass, 10);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully! You can now sign in with your new password.' });
  } catch (err) {
    res.status(500).json({ error: 'Password update failed' });
  }
});

// -------------------------------------------------------------
// Authentication & User Account Routes
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body || {};
        if (!name || !email || !password || password.length < 6) {
            return res.status(400).json({ error: 'Name, email, and password (6+ characters) required' });
        }
        const normalizedEmail = String(email).trim().toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const user = await User.create({
            id: Date.now().toString(),
            name: String(name).trim(),
            email: normalizedEmail,
            phone: String(phone || '').trim(),
            role: 'student',
            passwordHash: bcrypt.hashSync(password, 10)
        });
        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
        res.status(201).json({ token, user: publicUser(user) });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const rawTarget = String(email || '').trim();
        const cleanPassword = String(password || '').trim();
        if (!rawTarget || !cleanPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = await User.findOne({
            $or: [
                { email: rawTarget.toLowerCase() },
                { phone: rawTarget }
            ]
        });

        if (!user || !user.passwordHash || !bcrypt.compareSync(cleanPassword, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({
            token: jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' }),
            user: publicUser(user)
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/me', auth(), async (req, res) => {
    try {
        const u = await User.findOne({ id: req.user.id });
        if (!u) return res.status(404).json({ error: 'User not found' });
        res.json({ user: publicUser(u) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve profile' });
    }
});

// Self account deletion (Preserves historical activity data for analytics)
app.delete('/api/users/me', auth(), async (req, res) => {
    try {
        const u = await User.findOneAndDelete({ id: req.user.id });
        if (!u) return res.status(404).json({ error: 'User not found' });
        res.json({ ok: true, message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// -------------------------------------------------------------
// Subjects Routes
// -------------------------------------------------------------
app.get('/api/subjects', auth(), async (req, res) => {
    try {
        const subjects = await Subject.find().lean();
        res.json(subjects.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

// -------------------------------------------------------------
// Study Plan Routes
// -------------------------------------------------------------
app.get('/api/plan', auth(), async (req, res) => {
    try {
        const plans = await Plan.find({ userId: req.user.id }).lean();
        res.json(plans.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

app.post('/api/plan', auth(), async (req, res) => {
    try {
        const { title, minutes, date, subjectId, exam, priority } = req.body || {};
        if (!title || !Number.isFinite(Number(minutes)) || Number(minutes) <= 0) {
            return res.status(400).json({ error: 'Title and positive minutes required' });
        }
        const obj = await Plan.create({
            id: Date.now().toString(),
            userId: req.user.id,
            title,
            minutes: Number(minutes),
            date: date || new Date().toISOString().slice(0, 10),
            subjectId: subjectId || null,
            done: false
        });
        res.status(201).json(cleanDoc(obj));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

app.patch('/api/plan/:id', auth(), async (req, res) => {
    try {
        const x = await Plan.findOneAndUpdate(
            { id: req.params.id, userId: req.user.id },
            { $set: { done: !!req.body.done } },
            { returnDocument: 'after' }
        );
        if (!x) return res.status(404).json({ error: 'Not found' });
        res.json(cleanDoc(x));
    } catch (err) {
        res.status(500).json({ error: 'Failed to update plan' });
    }
});

app.delete('/api/plan/:id', auth(), async (req, res) => {
    try {
        const removed = await Plan.findOneAndDelete({ id: req.params.id, userId: req.user.id });
        if (!removed) return res.status(404).json({ error: 'Plan not found' });
        res.json({ ok: true, id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete plan' });
    }
});

// -------------------------------------------------------------
// Study Session Routes
// -------------------------------------------------------------
app.get('/api/sessions', auth(), async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort({ startedAt: -1 }).lean();
        res.json(sessions.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

app.post('/api/sessions', auth(), async (req, res) => {
    try {
        const { subjectId, minutes, mode, focusScore } = req.body || {};
        const m = Number(minutes);
        if (!Number.isFinite(m) || m <= 0 || m > 1440) {
            return res.status(400).json({ error: 'Minutes must be 1–1440' });
        }
        const obj = await Session.create({
            id: Date.now().toString(),
            userId: req.user.id,
            subjectId: subjectId || null,
            minutes: m,
            mode: mode || 'Pomodoro',
            focusScore: Math.min(100, Math.max(0, Number(focusScore) || 90)),
            startedAt: new Date().toISOString()
        });
        res.status(201).json(cleanDoc(obj));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create session' });
    }
});

// -------------------------------------------------------------
// Notifications Routes
// -------------------------------------------------------------
app.get('/api/notifications', auth(), async (req, res) => {
    try {
        const notifs = await Notification.find({ userId: { $in: [req.user.id, 'all'] } }).sort({ createdAt: -1 }).lean();
        res.json(notifs.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

app.patch('/api/notifications/:id/read', auth(), async (req, res) => {
    try {
        const n = await Notification.findOneAndUpdate(
            { id: req.params.id, userId: { $in: [req.user.id, 'all'] } },
            { $addToSet: { readBy: req.user.id } },
            { returnDocument: 'after' }
        );
        if (!n) return res.status(404).json({ error: 'Not found' });
        res.json(cleanDoc(n));
    } catch (err) {
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// -------------------------------------------------------------
// Support Tickets Routes (Student)
// -------------------------------------------------------------
app.get('/api/tickets', auth(), async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
        res.json(tickets.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

app.post('/api/tickets', auth(), async (req, res) => {
    try {
        const { type, subject, message } = req.body || {};
        if (!type || !message || !message.trim()) {
            return res.status(400).json({ error: 'Category and message are required' });
        }
        const now = new Date().toISOString();
        const obj = await Ticket.create({
            id: Date.now().toString(),
            userId: req.user.id,
            type,
            subject: (subject && subject.trim()) ? subject.trim() : `${type} Request`,
            message: message.trim(),
            status: 'Open',
            createdAt: now,
            updatedAt: now,
            replies: []
        });
        res.status(201).json(cleanDoc(obj));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

app.get('/api/tickets/:id', auth(), async (req, res) => {
    try {
        const x = await Ticket.findOne({ id: req.params.id, userId: req.user.id }).lean();
        if (!x) return res.status(404).json({ error: 'Ticket not found' });
        res.json(cleanDoc(x));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ticket' });
    }
});

app.patch('/api/tickets/:id', auth(), async (req, res) => {
    try {
        const x = await Ticket.findOne({ id: req.params.id, userId: req.user.id });
        if (!x) return res.status(404).json({ error: 'Ticket not found' });
        if (x.status === 'Resolved') return res.status(400).json({ error: 'Resolved tickets cannot be edited' });

        const { type, subject, message } = req.body || {};
        if (type) x.type = type;
        if (subject !== undefined) x.subject = subject.trim();
        if (message && message.trim()) x.message = message.trim();
        x.updatedAt = new Date().toISOString();
        await x.save();
        res.json(cleanDoc(x));
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.delete('/api/tickets/:id', auth(), async (req, res) => {
    try {
        const removed = await Ticket.findOneAndDelete({ id: req.params.id, userId: req.user.id });
        if (!removed) return res.status(404).json({ error: 'Ticket not found' });
        res.json({ ok: true, id: removed.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

// -------------------------------------------------------------
// Analytics Route
// -------------------------------------------------------------
app.get('/api/analytics', auth(), async (req, res) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort({ startedAt: 1 }).lean();
        const minutes = sessions.reduce((a, x) => a + x.minutes, 0);
        const focus = sessions.length
            ? Math.round(sessions.reduce((a, x) => a + x.focusScore, 0) / sessions.length)
            : 0;
        res.json({
            sessionCount: sessions.length,
            totalMinutes: minutes,
            averageFocus: focus,
            weekly: sessions.slice(-7).map(s => ({
                date: (s.startedAt || '').slice(0, 10),
                minutes: s.minutes
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to calculate analytics' });
    }
});

// -------------------------------------------------------------
// Admin Routes
// -------------------------------------------------------------
app.get('/api/admin/overview', auth('admin'), async (req, res) => {
    try {
        const [totalUsers, students, totalSubjects, sessions] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            Subject.countDocuments(),
            Session.find().lean()
        ]);
        res.json({
            users: students,
            totalAccounts: totalUsers,
            subjects: totalSubjects,
            sessions: sessions.length,
            minutes: sessions.reduce((a, s) => a + s.minutes, 0)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin overview' });
    }
});

app.get('/api/admin/users', auth('admin'), async (req, res) => {
    try {
        const users = await User.find({}, '-passwordHash').lean();
        res.json(users.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/api/admin/subjects', auth('admin'), async (req, res) => {
    try {
        const subjects = await Subject.find().lean();
        res.json(subjects.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

app.post('/api/admin/subjects', auth('admin'), async (req, res) => {
    try {
        const { name, paper, topics } = req.body || {};
        if (!name) return res.status(400).json({ error: 'Name required' });
        const x = await Subject.create({
            id: Date.now().toString(),
            name,
            paper: paper || 'GS Paper II',
            topics: Number(topics) || 0,
            completed: 0
        });
        res.status(201).json(cleanDoc(x));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create subject' });
    }
});

app.delete('/api/admin/subjects/:id', auth('admin'), async (req, res) => {
    try {
        const removed = await Subject.findOneAndDelete({ id: req.params.id });
        if (!removed) return res.status(404).json({ error: 'Subject not found' });
        res.json({ ok: true, id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete subject' });
    }
});

app.get('/api/admin/sessions', auth('admin'), async (req, res) => {
    try {
        const sessions = await Session.find().sort({ startedAt: -1 }).lean();
        res.json(sessions.map(cleanDoc));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

app.get('/api/admin/tickets', auth('admin'), async (req, res) => {
    try {
        const [tickets, users] = await Promise.all([
            Ticket.find().sort({ createdAt: -1 }).lean(),
            User.find({}, 'id name email').lean()
        ]);
        const userMap = new Map(users.map(u => [u.id, u]));
        const result = tickets.map(t => {
            const u = userMap.get(t.userId);
            return {
                ...cleanDoc(t),
                studentName: u?.name || 'Unknown Student',
                studentEmail: u?.email || 'N/A'
            };
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admin tickets' });
    }
});

app.patch('/api/admin/tickets/:id', auth('admin'), async (req, res) => {
    try {
        const x = await Ticket.findOne({ id: req.params.id });
        if (!x) return res.status(404).json({ error: 'Ticket not found' });

        const { status, reply } = req.body || {};
        if (status) x.status = status;
        if (reply && String(reply).trim()) {
            x.replies = x.replies || [];
            const adminUser = await User.findOne({ id: req.user.id });
            x.replies.push({
                id: Date.now().toString(),
                sender: 'admin',
                adminId: req.user.id,
                adminName: adminUser?.name || 'Admin Support',
                message: String(reply).trim(),
                createdAt: new Date().toISOString()
            });
        }
        x.updatedAt = new Date().toISOString();
        await x.save();

        const u = await User.findOne({ id: x.userId });
        res.json({
            ...cleanDoc(x),
            studentName: u?.name || 'Unknown Student',
            studentEmail: u?.email || 'N/A'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.post('/api/admin/notifications', auth('admin'), async (req, res) => {
    try {
        if (!req.body.title || !req.body.message) {
            return res.status(400).json({ error: 'Title and message required' });
        }
        const x = await Notification.create({
            id: Date.now().toString(),
            userId: 'all',
            title: req.body.title,
            message: req.body.message,
            readBy: [],
            createdAt: new Date().toISOString()
        });
        res.status(201).json(cleanDoc(x));
    } catch (err) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
});

app.delete('/api/admin/notifications/:id', auth('admin'), async (req, res) => {
    try {
        const removed = await Notification.findOneAndDelete({ id: req.params.id });
        if (!removed) return res.status(404).json({ error: 'Notification not found' });
        res.json({ ok: true, id: req.params.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

// -------------------------------------------------------------
// Server Initialization
// -------------------------------------------------------------
const port = process.env.PORT || 4000;

async function startServer() {
    try {
        if (process.env.MONGODB_URI) {
            await connectDB();
        } else {
            console.log('[Server] MONGODB_URI not provided; starting server in standalone mode');
        }
    } catch (err) {
        console.error(`[Server] Database connection error: ${err.message}. Starting API in fallback mode.`);
    }

    const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Abhyas API listening on 0.0.0.0:${port} (http://localhost:${port})`);
    });
    return server;
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
