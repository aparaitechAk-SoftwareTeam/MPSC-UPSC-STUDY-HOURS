const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function fixAdmin() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const res = await User.updateOne(
    { email: 'admin@abhyas.local' },
    { $set: { passwordHash: '$2a$10$lECBVyBWa.1OGeIVecbW4uE4/.MwTXOIWmPPPYp0F3uHjOYbthnqm' } }
  );
  console.log('Updated admin in MongoDB Atlas:', res);
  process.exit(0);
}

fixAdmin().catch(e => { console.error(e); process.exit(1); });
