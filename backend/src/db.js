const dns = require('dns');
const mongoose = require('mongoose');

// Preserve system default DNS servers provided by active Wi-Fi DHCP
const defaultDnsServers = typeof dns.getServers === 'function' ? dns.getServers() : [];

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
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 10000,
  };

  // Attempt 1: Try using active Wi-Fi network's default DNS
  try {
    const conn = await mongoose.connect(uri, opts);
    console.log(`[Database] MongoDB connected successfully via Wi-Fi network: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (wifiDnsErr) {
    // Attempt 2: If Wi-Fi DNS failed to resolve SRV record, try Google & Cloudflare public DNS
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
      await mongoose.disconnect().catch(() => {});
      const conn = await mongoose.connect(uri, opts);
      console.log(`[Database] MongoDB connected successfully via public DNS fallback: ${conn.connection.host}`);
      return conn;
    } catch (fallbackErr) {
      // Restore system DNS servers so local queries continue working
      if (defaultDnsServers.length > 0) {
        try { dns.setServers(defaultDnsServers); } catch (_) {}
      }
      try {
        await mongoose.disconnect();
      } catch {}
      throw fallbackErr;
    }
  }
}

module.exports = { connectDB };
