
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'mpsc_upsc_tracker';

  if (!uri) {
    throw new Error('MONGODB_URI is missing from the environment');
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `[Database] Connected to host: ${conn.connection.host}, database: ${conn.connection.name}`
    );

    return conn;
  } catch (err) {
    console.error('[Database] Connection failed:', err.message);
    throw err;
  }
}

module.exports = { connectDB };
