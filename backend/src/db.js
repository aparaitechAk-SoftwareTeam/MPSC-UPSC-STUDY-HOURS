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

  if (!uri) {
    const error = new Error('MONGODB_URI is not defined in environment variables');
    console.error('[Database] Connection configuration error: MONGODB_URI missing in .env');
    throw error;
  }

  // If already connected or currently connecting, do not initiate duplicate attempts
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) return null;

  const opts = {
    serverSelectionTimeoutMS: 2500,
    connectTimeoutMS: 2500,
    socketTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(uri, opts);
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host}`);
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
