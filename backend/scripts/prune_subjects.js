const path = require('path');
const fs = require('fs');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function migrateAndPrune() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas successfully.');

  const Session = mongoose.model('Session', new mongoose.Schema({}, { strict: false }));
  const Plan = mongoose.model('Plan', new mongoose.Schema({}, { strict: false }));
  const Subject = mongoose.model('Subject', new mongoose.Schema({}, { strict: false }));

  // 1. Subject mapping dictionary
  const sMap = {
    'polity': 'upsc-polity',
    'history': 'upsc-history-culture',
    'economy': 'upsc-economy',
    'geography': 'upsc-geography',
    '1792732224087': 'mpsc-english',
    '1793130162436': 'upsc-csat'
  };

  for (const [from, to] of Object.entries(sMap)) {
    const resS = await Session.updateMany({ subjectId: from }, { $set: { subjectId: to } });
    const resP = await Plan.updateMany({ subjectId: from }, { $set: { subjectId: to } });
    console.log(`Migrated [${from}] -> [${to}] | Sessions: ${resS.modifiedCount} | Plans: ${resP.modifiedCount}`);
  }

  // 2. Junk subject IDs to remove
  const junkSubjectIds = ['polity', 'history', 'economy', 'geography', '1792732224087', '1793130162436', '1792946844266'];
  const resDel = await Subject.deleteMany({ id: { $in: junkSubjectIds } });
  console.log(`Deleted non-standard subjects from MongoDB: ${resDel.deletedCount}`);

  // 3. Verify Remaining MongoDB Subjects
  const remaining = await Subject.find().lean();
  console.log(`Remaining MongoDB subjects: ${remaining.length}`);
  remaining.forEach(s => console.log(` - [${s.exam}] ${s.id}: ${s.name}`));

  // 4. Update backend/data/db.json
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (fs.existsSync(dbPath)) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    (db.sessions || []).forEach(s => {
      if (sMap[s.subjectId]) s.subjectId = sMap[s.subjectId];
    });

    (db.plans || []).forEach(p => {
      if (sMap[p.subjectId]) p.subjectId = sMap[p.subjectId];
    });

    db.subjects = (db.subjects || []).filter(
      s => !junkSubjectIds.includes(s.id) && (s.id.startsWith('upsc-') || s.id.startsWith('mpsc-'))
    );

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Updated db.json successfully. Subjects count: ${db.subjects.length}`);
  }

  process.exit(0);
}

migrateAndPrune().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
