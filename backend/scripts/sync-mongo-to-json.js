require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../src/db');
const {
  User,
  Subject,
  Plan,
  Session,
  Notification,
  Ticket,
  TopicProgress
} = require('../src/models');

(async () => {
  try {
    await connectDB();
    console.log('Fetching all collections from MongoDB...');
    const [users, subjects, plans, sessions, notifications, tickets, topicProgress] = await Promise.all([
      User.find({}).lean(),
      Subject.find({}).lean(),
      Plan.find({}).lean(),
      Session.find({}).lean(),
      Notification.find({}).lean(),
      Ticket.find({}).lean(),
      TopicProgress.find({}).lean()
    ]);

    const clean = doc => {
      if (!doc) return doc;
      const copy = { ...doc };
      delete copy._id;
      delete copy.__v;
      return copy;
    };

    const fullDb = {
      users: users.map(clean),
      subjects: subjects.map(clean),
      plans: plans.map(clean),
      sessions: sessions.map(clean),
      notifications: notifications.map(clean),
      tickets: tickets.map(clean),
      topicProgress: topicProgress.map(clean)
    };

    const dbPath = path.join(__dirname, '../data/db.json');
    fs.writeFileSync(dbPath, JSON.stringify(fullDb, null, 2), 'utf8');
    console.log(`✅ Successfully mirrored MongoDB to ${dbPath}!`);
    console.log(`Counts: users=${users.length}, subjects=${subjects.length}, plans=${plans.length}, sessions=${sessions.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
})();
