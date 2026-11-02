
require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
  const uri = process.env.MONGODB_URI;
  const sourceName = 'test';
  const targetName = process.env.DB_NAME || 'mpsc_upsc_tracker';

  if (!uri) throw new Error('MONGODB_URI is missing');
  if (sourceName === targetName) {
    throw new Error('Source and target databases must differ');
  }

  const source = await mongoose
    .createConnection(uri, { dbName: sourceName })
    .asPromise();

  const target = await mongoose
    .createConnection(uri, { dbName: targetName })
    .asPromise();

  try {
    const sourceCollections = await source.db
      .listCollections({}, { nameOnly: true })
      .toArray();

    const targetCollections = await target.db
      .listCollections({}, { nameOnly: true })
      .toArray();

    // Safety check: never merge into a target containing data.
    for (const item of targetCollections) {
      if (item.name.startsWith('system.')) continue;

      const count = await target.db
        .collection(item.name)
        .countDocuments();

      if (count > 0) {
        throw new Error(
          `Target collection "${item.name}" already contains ${count} documents. Migration stopped without copying data.`
        );
      }
    }

    let totalCopied = 0;

    for (const item of sourceCollections) {
      if (item.name.startsWith('system.')) continue;

      const sourceCollection = source.db.collection(item.name);
      const documents = await sourceCollection.find({}).toArray();

      if (documents.length === 0) continue;

      await target.db.collection(item.name).insertMany(documents);
      totalCopied += documents.length;

      console.log(`Copied ${documents.length} documents: ${item.name}`);
    }

    console.log(`Migration complete. Total documents copied: ${totalCopied}`);
    console.log(`Source: ${sourceName}`);
    console.log(`Target: ${targetName}`);
  } finally {
    await source.close();
    await target.close();
  }
}

migrate().catch((error) => {
  console.error('Migration stopped:', error.message);
  process.exitCode = 1;
});
