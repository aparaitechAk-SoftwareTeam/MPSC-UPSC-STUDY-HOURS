require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

(async () => {
  const local = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'));
  const backupFiles = fs.readdirSync('./data')
    .filter(f => f.startsWith('atlas-backup-') && f.endsWith('.json'));

  if (!backupFiles.length) throw new Error('Atlas backup not found. Aborting.');
  if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    throw new Error('MONGO_URI or DB_NAME is missing. Aborting.');
  }

  const localStudent = local.users.find(
    u => String(u.email).toLowerCase() === 'student@abhyas.local'
  );
  if (!localStudent || !localStudent.passwordHash) {
    throw new Error('Local student account/password hash not found. Aborting.');
  }

  if (!Array.isArray(local.sessions) || local.sessions.length !== 35) {
    throw new Error('Expected 35 local sessions; source differs. Aborting.');
  }

  const c = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await c.connect();
    const db = c.db(process.env.DB_NAME);

    const atlasStudent = await db.collection('users').findOne({
      id: 'student1',
      email: 'student@abhyas.local'
    });
    if (!atlasStudent) {
      throw new Error('Expected Atlas student1 account not found. Aborting.');
    }

    const subject = await db.collection('subjects').findOne({ id: 'polity' });
    if (!subject) throw new Error('Atlas polity subject not found. Aborting.');

    const ids = local.sessions.map(s => s.id);
    if (ids.some(id => id == null) || new Set(ids).size !== ids.length) {
      throw new Error('Local session IDs are missing or duplicated. Aborting.');
    }

    const existing = await db.collection('sessions')
      .find({ id: { $in: ids } }).toArray();

    const conflicts = existing.filter(s => s.userId !== 'student1');
    if (conflicts.length) {
      throw new Error(
        `${conflicts.length} session IDs already belong to other records. Aborting.`
      );
    }

    const pending = local.sessions.filter(
      s => !existing.some(e => e.id === s.id)
    );

    console.log('Backup files found:', backupFiles.length);
    console.log('Atlas student account:', atlasStudent.id);
    console.log('Existing Atlas sessions:', await db.collection('sessions').countDocuments({}));
    console.log('Local sessions to import:', pending.length);
    console.log('Already imported and safely skippable:', existing.length);
    console.log('Subject verified:', subject.name);
    console.log('Mode:', process.env.APPLY_ATLAS_MERGE === 'YES' ? 'APPLY' : 'DRY RUN');

    if (process.env.APPLY_ATLAS_MERGE !== 'YES') {
      console.log('DRY RUN ONLY. No Atlas data was changed.');
      console.log('If this preview is correct, the next command can apply the merge.');
      return;
    }

    await db.collection('users').updateOne(
      { id: 'student1', email: 'student@abhyas.local' },
      { $set: { name: localStudent.name, passwordHash: localStudent.passwordHash } }
    );

    if (pending.length) {
      const operations = pending.map(s => {
        const record = { ...s, userId: 'student1' };
        delete record._id;
        return {
          updateOne: {
            filter: { id: s.id },
            update: { $setOnInsert: record },
            upsert: true
          }
        };
      });

      await db.collection('sessions').bulkWrite(operations, { ordered: true });
    }

    console.log('Merge operation completed.');
    console.log('Final Atlas session count:',
      await db.collection('sessions').countDocuments({}));
    console.log('Sessions owned by student1:',
      await db.collection('sessions').countDocuments({ userId: 'student1' }));
    console.log('Student account ID preserved: student1');
  } finally {
    await c.close();
  }
})().catch(e => {
  console.error('MERGE STOPPED:', e.message);
  process.exitCode = 1;
});
