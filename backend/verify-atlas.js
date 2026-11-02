require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    console.log('\n--- ATLAS COLLECTION COUNTS ---');
    for (const name of ['users', 'subjects', 'plans', 'sessions', 'notifications']) {
      console.log(`${name}: ${await db.collection(name).countDocuments()}`);
    }

    console.log('\n--- STUDENT ACCOUNT ---');
    const student = await db.collection('users').findOne(
      { id: 'student1' },
      { projection: { _id: 0, id: 1, name: 1, email: 1, role: 1 } }
    );
    console.log(student);

    console.log('\n--- SESSION OWNERSHIP ---');
    console.log('Sessions for student1:',
      await db.collection('sessions').countDocuments({ userId: 'student1' }));
    console.log('Sessions with missing userId:',
      await db.collection('sessions').countDocuments({
        $or: [{ userId: { $exists: false } }, { userId: null }]
      }));

    console.log('\n--- SUBJECT CHECK ---');
    console.log('Polity subject:',
      await db.collection('subjects').findOne(
        { id: 'polity' },
        { projection: { _id: 0, id: 1, name: 1 } }
      ));
  } finally {
    await client.close();
  }
})().catch(error => {
  console.error('VERIFICATION FAILED:', error.message);
  process.exitCode = 1;
});
