
require('dotenv').config();
const { connectDB } = require('./db');

const {
    User,
    Subject,
    Plan,
    Session,
    Notification,
    Ticket,
    TopicProgress
} = require('./models');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const secret = process.env.JWT_SECRET || 'development-only-change-this-secret';

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
// Authentication & User Account Routes
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({ error: 'Name, email, and password (8+ characters) required' });
        }
        const normalizedEmail = email.toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' });
        }
        const user = await User.create({
            id: Date.now().toString(),
            name,
            email: normalizedEmail,
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
        const { email, password } = req.body;
        const user = await User.findOne({ email: String(email || '').toLowerCase() });
        if (!user || !bcrypt.compareSync(String(password || ''), user.passwordHash)) {
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
app.patch('/api/me', auth(), async (req, res) => {
    try {
        const allowedFields = [
            'name',
            'email',
            'phone',
            'examTarget',
            'preferredSubjects'
        ];

        const suppliedFields = allowedFields.filter(
            (field) => Object.prototype.hasOwnProperty.call(req.body || {}, field)
        );

        if (suppliedFields.length === 0) {
            return res.status(400).json({ error: 'No profile fields supplied' });
        }

        const updates = {};

        for (const field of suppliedFields) {
            const value = req.body[field];

            if (typeof value !== 'string') {
                return res.status(400).json({ error: `Invalid ${field}` });
            }

            const trimmed = value.trim();

            if (field === 'name') {
                if (trimmed.length < 2 || trimmed.length > 100) {
                    return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
                }
                updates.name = trimmed;
            }

            if (field === 'email') {
                const normalizedEmail = trimmed.toLowerCase();
                if (
                    normalizedEmail.length > 254 ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
                ) {
                    return res.status(400).json({ error: 'Enter a valid email address' });
                }

                const existing = await User.findOne({
                    email: normalizedEmail,
                    id: { $ne: req.user.id }
                });

                if (existing) {
                    return res.status(409).json({ error: 'Email already registered' });
                }

                updates.email = normalizedEmail;
            }

            if (field === 'phone') {
                if (trimmed && !/^[+]?[0-9\s()-]{7,20}$/.test(trimmed)) {
                    return res.status(400).json({ error: 'Enter a valid phone number' });
                }
                updates.phone = trimmed;
            }

            if (field === 'examTarget') {
                if (!trimmed || trimmed.length > 100) {
                    return res.status(400).json({ error: 'Exam target is required and must be under 100 characters' });
                }
                updates.examTarget = trimmed;
            }

            if (field === 'preferredSubjects') {
                if (!trimmed || trimmed.length > 500) {
                    return res.status(400).json({ error: 'Preferred subjects are required and must be under 500 characters' });
                }
                updates.preferredSubjects = trimmed;
            }
        }

        const user = await User.findOneAndUpdate(
            { id: req.user.id },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json({ user: publicUser(user) });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        console.error('Profile update failed:', err.message);
        return res.status(500).json({ error: 'Failed to update profile' });
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
        const { title, minutes, date, subjectId } = req.body;
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
        const { subjectId, minutes, mode, focusScore } = req.body;
        const m = Number(minutes);
        if (!Number.isFinite(m) || m <= 0 || m > 1440) {
            return res.status(400).json({ error: 'Minutes must be 1â€“1440' });
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
        const { type, subject, message } = req.body;
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

        const { type, subject, message } = req.body;
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

app.get('/api/topic-progress', auth(), async (req, res) => {
    try {
        const progress = await TopicProgress.find({
            userId: req.user.id
        }).lean();

        res.json(progress.map(cleanDoc));
    } catch (err) {
        console.error('Failed to fetch topic progress:', err);
        res.status(500).json({ error: 'Failed to fetch topic progress' });
    }
});

app.patch('/api/topic-progress/:topicId', auth(), async (req, res) => {
    try {
        const topicId = String(req.params.topicId || '').trim();
        const { status, subjectId } = req.body;

        const allowedStatuses = [
            'Not Started',
            'In Progress',
            'Completed',
            'To Revise'
        ];

        if (!topicId) {
            return res.status(400).json({ error: 'Topic ID is required' });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid topic status' });
        }

        const progress = await TopicProgress.findOneAndUpdate(
            { userId: req.user.id, topicId },
            {
                $set: {
                    status,
                    subjectId: subjectId || null
                },
                $setOnInsert: {
                    userId: req.user.id,
                    topicId
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.json(cleanDoc(progress));
    } catch (err) {
        console.error('Failed to update topic progress:', err);
        res.status(500).json({ error: 'Failed to update topic progress' });
    }
});



app.get('/api/analytics', auth(), async (req, res) => {
    try {
        const sessions = await Session.find({
            userId: req.user.id
        }).sort({ startedAt: 1 }).lean();

        // All-time statistics
        const minutes = sessions.reduce(
            (sum, session) => sum + (Number(session.minutes) || 0),
            0
        );

        const focus = sessions.length
            ? Math.round(
                sessions.reduce(
                    (sum, session) => sum + (Number(session.focusScore) || 0),
                    0
                ) / sessions.length
            )
            : 0;

        // Generate the last 30 UTC calendar days, including zero-study days.
        const now = new Date();
        const today = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate()
        ));

        const daily = Array.from({ length: 30 }, (_, index) => {
            const date = new Date(today);
            date.setUTCDate(today.getUTCDate() - (29 - index));

            return {
                date: date.toISOString().slice(0, 10),
                minutes: 0
            };
        });

        const dailyByDate = new Map(
            daily.map(day => [day.date, day])
        );

        // Add all sessions from each day together.
        for (const session of sessions) {
            const date = (session.startedAt || '').slice(0, 10);
            const day = dailyByDate.get(date);

            if (day) {
                day.minutes += Number(session.minutes) || 0;
            }
        }

        const studiedDates = new Set(
            sessions
                .filter(session => Number(session.minutes) > 0)
                .map(session => (session.startedAt || '').slice(0, 10))
                .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
        );

        // Current streak: count consecutive study days, starting today
        // or yesterday if no session has been recorded today.
        let currentStreak = 0;
        const streakCursor = new Date(today);

        if (!studiedDates.has(streakCursor.toISOString().slice(0, 10))) {
            streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
        }

        while (studiedDates.has(streakCursor.toISOString().slice(0, 10))) {
            currentStreak += 1;
            streakCursor.setUTCDate(streakCursor.getUTCDate() - 1);
        }

        const daysStudiedLast30 = daily.filter(day => day.minutes > 0).length;

        res.json({
            sessionCount: sessions.length,
            totalMinutes: minutes,
            averageFocus: focus,
            currentStreak,
            daysStudiedLast30,
            daily,
            weekly: daily.slice(-7)
        });
    } catch (err) {
        console.error('Failed to calculate analytics:', err);
        res.status(500).json({
            error: 'Failed to calculate analytics'
        });
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
        const { name, paper, topics } = req.body;
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

        const { status, reply } = req.body;
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
        await connectDB();
        const server = app.listen(port, () => console.log(`Abhyas API http://localhost:${port}`));
        return server;
    } catch (err) {
        console.error(`[Server] Failed to connect to database. Server not started: ${err.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };

