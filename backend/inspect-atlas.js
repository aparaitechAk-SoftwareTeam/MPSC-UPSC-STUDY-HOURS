require('dotenv').config();
const local = require('./data/db.json');
const { MongoClient } = require('mongodb');

(async () => {
  const c = new MongoClient(process.env.MONGO_URI);
  try {
    await c.connect();
    const db = c.db(process.env.DB_NAME);

    console.log('Local session subject references:');
    console.log([...new Set(local.sessions.map(s => String(s.subjectId ?? '(none)')))]);

    console.log('\nAtlas subjects:');
    console.log(JSON.stringify(
      await db.collection('subjects')
        .find({}, { projection: { _id: 0, id: 1, name: 1, title: 1 } })
        .toArray(),
      null, 2
    ));

    console.log('\nAtlas session counts by user:');
    const counts = await db.collection('sessions').aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } }
    ]).toArray();
    console.log(JSON.stringify(counts, null, 2));
  } finally {
    await c.close();
  }
})().catch(e => {
  console.error('Inspection failed:', e.message);
  process.exitCode = 1;
});
