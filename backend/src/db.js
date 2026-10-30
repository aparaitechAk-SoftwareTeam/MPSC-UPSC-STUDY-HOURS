
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'mpsc_upsc_tracker';

  if (!uri) {
    const error = new Error(
      'MONGODB_URI is not defined in environment variables'
    );
    console.error(
      '[Database] Connection configuration error: MONGODB_URI missing in .env'
    );
    throw error;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `[Database] Connected to host: ${conn.connection.host}, database: ${conn.connection.name}`
    );

    return conn;
  } catch (err) {
    console.error(`[Database] Connection error: ${err.message}`);
    throw err;
  }
}

module.exports = { connectDB };
