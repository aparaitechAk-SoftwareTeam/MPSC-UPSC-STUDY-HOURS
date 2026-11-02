
require('dotenv').config();
const mongoose = require('mongoose');

async function inspect() {
  for (const dbName of ['test', 'mpsc_upsc_tracker']) {
    const conn = await mongoose.createConnection(
      process.env.MONGODB_URI,
      { dbName }
    ).asPromise();

    try {
      console.log('\nDATABASE:', dbName);

      const users = await conn.db.collection('users')
        .find(
          { name: { $regex: 'Disha|Demo Aspirant|Analytics Test', $options: 'i' } },
          { projection: { password: 0, passwordHash: 0, token: 0 } }
        )
        .toArray();

      console.log('Matching users:');
      for (const u of users) {
        console.log({
          _id: String(u._id),
          id: u.id ?? null,
          name: u.name ?? null,
          email: u.email ?? null
        });
      }

      const sessions = await conn.db.collection('sessions')
        .find({ userId: 'student1' })
        .sort({ _id: 1 })
        .limit(3)
        .toArray();

      console.log('Sample student1 sessions:');
      for (const s of sessions) {
        const safe = { ...s };
        for (const key of ['token', 'password', 'passwordHash']) {
          delete safe[key];
        }
        console.log(safe);
      }
    } finally {
      await conn.close();
    }
  }
}

inspect().catch(e => {
  console.error(e.message);
  process.exitCode = 1;
});
