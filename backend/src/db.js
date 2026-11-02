const dns = require('dns');
const mongoose = require('mongoose');

// Configure resilient public DNS resolvers (Google & Cloudflare)
// to guarantee MongoDB Atlas SRV records resolve seamlessly on any Wi-Fi network, mobile hotspot, or ISP
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('[Database] Custom DNS config notice:', dnsErr.message);
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'mpsc_upsc_tracker';

  if (!uri) {
    throw new Error('MONGODB_URI is missing from the environment');
  }

  // If already connected or currently connecting, do not initiate duplicate attempts
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) return null;

  const opts = {
    dbName,
    serverSelectionTimeoutMS: 2500,
    connectTimeoutMS: 2500,
    socketTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(uri, opts);
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    // Halt internal mongoose retries so DNS is not flooded
    try {
      await mongoose.disconnect();
    } catch {}
    throw err;
  }
}

module.exports = { connectDB };
