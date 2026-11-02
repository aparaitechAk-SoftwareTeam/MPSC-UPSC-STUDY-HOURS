
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function restore() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  const source = await mongoose.createConnection(
    process.env.MONGODB_URI,
    { dbName: 'test' }
  ).asPromise();

  const target = await mongoose.createConnection(
    process.env.MONGODB_URI,
    { dbName: process.env.DB_NAME || 'mpsc_upsc_tracker' }
  ).asPromise();

  try {
    const sourceSessions = await source.db
      .collection('sessions')
      .find({ userId: 'student1' })
      .toArray();

    const targetCollection = target.db.collection('sessions');
    const targetSessions = await targetCollection.find({}).toArray();

    // Back up both session collections before any write.
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, `session-backup-${stamp}`);
    fs.mkdirSync(backupDir, { recursive: true });

    fs.writeFileSync(
      path.join(backupDir, 'test-sessions.json'),
      JSON.stringify(sourceSessions, null, 2)
    );

    fs.writeFileSync(
      path.join(backupDir, 'mpsc-upsc-tracker-sessions.json'),
      JSON.stringify(targetSessions, null, 2)
    );

    console.log('Session backups saved in:', backupDir);

    const targetIds = new Set(
      targetSessions
        .filter(s => s.id != null)
        .map(s => String(s.id))
    );

    const targetObjectIds = new Set(
      targetSessions.map(s => String(s._id))
    );

    const missing = sourceSessions.filter(
      s => s.id == null || !targetIds.has(String(s.id))
    );

    console.log('Old Disha sessions:', sourceSessions.length);
    console.log('Existing target sessions:', targetSessions.length);
    console.log('Sessions eligible to copy:', missing.length);
    console.log(
      'Existing session IDs already present:',
      sourceSessions.length - missing.length
    );

    if (process.env.APPLY_SESSION_MIGRATION !== 'YES') {
      console.log('PREVIEW ONLY: no database records were changed.');
      console.log(
        'Review the counts before explicitly enabling the migration.'
      );
      return;
    }

    // Protect against duplicate session IDs and MongoDB _id conflicts.
    const insertDocs = [];
    for (const session of missing) {
      const copy = { ...session };

      if (copy.id != null && targetIds.has(String(copy.id))) {
        continue;
      }

      if (targetObjectIds.has(String(copy._id))) {
        delete copy._id;
      }

      // Keep the session attached to the account used to sign in.
      copy.userId = 'student1';

      insertDocs.push(copy);
      if (copy.id != null) targetIds.add(String(copy.id));
    }

    if (insertDocs.length) {
      await targetCollection.insertMany(insertDocs);
    }

    console.log('Migration completed.');
    console.log('New sessions inserted:', insertDocs.length);
    console.log(
      'Target session count now:',
      await targetCollection.countDocuments()
    );
    console.log('Source database test was not modified.');
  } finally {
    await source.close();
    await target.close();
  }
}

restore().catch(error => {
  console.error('Recovery stopped:', error.message);
  process.exitCode = 1;
});