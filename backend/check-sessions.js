
require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  for (const dbName of ['test', 'mpsc_upsc_tracker']) {
    const conn = await mongoose.createConnection(
      process.env.MONGODB_URI,
      { dbName }
    ).asPromise();

    try {
      console.log('\nDATABASE:', dbName);

      const sessions = await conn.db
        .collection('sessions')
        .find({}, { projection: { userId: 1 } })
        .toArray();

      const users = await conn.db
        .collection('users')
        .find({}, { projection: { _id: 1, id: 1, name: 1 } })
        .toArray();

      const counts = {};
      for (const session of sessions) {
        const id = String(session.userId ?? '(missing userId)');
        counts[id] = (counts[id] || 0) + 1;
      }

      for (const [userId, count] of Object.entries(counts)) {
        const user = users.find(
          u => String(u.id) === userId || String(u._id) === userId
        );
        console.log({
          userId,
          sessionCount: count,
          userFound: Boolean(user),
          userName: user?.name ?? null
        });
      }

      for (const collectionName of ['topicprogresses', 'topicProgress']) {
        const exists = await conn.db
          .listCollections({ name: collectionName }, { nameOnly: true })
          .hasNext();

        if (exists) {
          const count = await conn.db
            .collection(collectionName)
            .countDocuments();
          console.log(`${collectionName}: ${count} records`);
        }
      }
    } finally {
      await conn.close();
    }
  }
}

check().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
