require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    for (const name of ['users', 'subjects', 'plans', 'sessions', 'notifications']) {
      console.log(`\n--- ${name} indexes ---`);
      const indexes = await db.collection(name).listIndexes().toArray();
      console.log(JSON.stringify(
        indexes.map(i => ({
          name: i.name,
          key: i.key,
          unique: i.unique || false
        })),
        null,
        2
      ));
    }
  } finally {
    await client.close();
  }
})().catch(error => {
  console.error('INDEX INSPECTION FAILED:', error.message);
  process.exitCode = 1;
});
