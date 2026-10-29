const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const error = new Error('MONGODB_URI is not defined in environment variables');
    console.error('[Database] Connection configuration error: MONGODB_URI missing in .env');
    throw error;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Timeout after 3s to quickly fall back to local storage
    });

    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[Database] Connection error: ${err.message}`);
    throw err;
  }
}

module.exports = { connectDB };
