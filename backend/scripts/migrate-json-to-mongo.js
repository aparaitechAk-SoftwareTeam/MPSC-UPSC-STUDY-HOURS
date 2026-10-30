require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing from .env');
  }

  const file = path.join(__dirname, '../data/db.json');
  const source = JSON.parse(fs.readFileSync(file, 'utf8'));
  const names = ['users', 'subjects', 'plans', 'sessions', 'notifications'];

  for (const name of names) {
    if (!Array.isArray(source[name])) {
      throw new Error(`Invalid or missing collection in db.json: ${name}`);
    }
    for (const record of source[name]) {
      if (record.id === undefined || record.id === null) {
        throw new Error(`A record in ${name} has no id. Migration stopped.`);
      }
    }
  }

  const emails = source.users.map(u => String(u.email).toLowerCase());
  if (new Set(emails).size !== emails.length) {
    throw new Error('Duplicate user emails found in source. Migration stopped.');
  }

  const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'abhyas_tracker');
    await db.command({ ping: 1 });

    console.log('Connected to MongoDB Atlas.');
    console.log('Importing records using existing IDs...');

    for (const name of names) {
      const collection = db.collection(name);
      const records = source[name];

      if (records.length === 0) {
        console.log(`${name}: 0 source records; nothing to import.`);
        continue;
      }

      const operations = records.map(record => ({
        updateOne: {
          filter: { id: record.id },
          update: { $setOnInsert: record },
          upsert: true
        }
      }));

      const result = await collection.bulkWrite(operations, { ordered: true });
      const total = await collection.countDocuments();

      console.log(
        `${name}: source=${records.length}, newly imported=${result.upsertedCount}, total in MongoDB=${total}`
      );
    }

    console.log('Migration script finished.');
    console.log('Local db.json was not modified.');
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
});
