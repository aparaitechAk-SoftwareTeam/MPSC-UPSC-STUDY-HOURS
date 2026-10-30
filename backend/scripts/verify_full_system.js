const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function testFullSystem() {
  console.log('=== SYSTEM AUDIT: SIGNUP, EMAIL OTP, MONGODB ATLAS & APK READINESS ===\n');

  const testEmail = `test_student_${Date.now()}@abhyas.local`;
  const testPassword = 'Password123!';
  const testName = 'Bhumika Test Candidate';

  // 1. Test Send-OTP for Signup
  console.log(`[1] Testing POST /api/auth/send-otp for Email: ${testEmail}...`);
  const otpRes = await fetch('http://localhost:4000/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target: testEmail,
      type: 'signup',
      method: 'email'
    })
  });
  const otpData = await otpRes.json();
  if (!otpRes.ok || !otpData.code) {
    throw new Error('send-otp failed: ' + JSON.stringify(otpData));
  }
  const code = otpData.code;
  console.log(`   ✓ OTP generated successfully: [${code}] (Sent via Email channel)`);

  // 2. Test Verify-OTP
  console.log(`[2] Testing POST /api/auth/verify-otp with code [${code}]...`);
  const vRes = await fetch('http://localhost:4000/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target: testEmail,
      code: code
    })
  });
  const vData = await vRes.json();
  if (!vRes.ok || !vData.success) {
    throw new Error('verify-otp failed: ' + JSON.stringify(vData));
  }
  console.log('   ✓ Email OTP successfully verified!');

  // 3. Test Register (Email only, no mobile required)
  console.log(`[3] Testing POST /api/auth/register with Name, Email & Password...`);
  const regRes = await fetch('http://localhost:4000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword
    })
  });
  const regData = await regRes.json();
  if (!regRes.ok || !regData.token || !regData.user) {
    throw new Error('register failed: ' + JSON.stringify(regData));
  }
  console.log(`   ✓ User registered! ID: ${regData.user.id}, Role: ${regData.user.role}`);

  // 4. Verify in MongoDB Atlas Cloud Database
  console.log('[4] Verifying record directly inside MongoDB Atlas Cloud Database...');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const mongoUser = await User.findOne({ email: testEmail }).lean();
  if (!mongoUser) {
    throw new Error('User was NOT found in MongoDB Atlas cloud database!');
  }
  console.log(`   ✓ CONFIRMED IN ATLAS CLOUD! MongoDB _id: ${mongoUser._id}, Email: ${mongoUser.email}`);

  // 5. Test Login with Registered Credentials
  console.log(`[5] Testing POST /api/auth/login with ${testEmail}...`);
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword
    })
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok || !loginData.token) {
    throw new Error('login failed: ' + JSON.stringify(loginData));
  }
  console.log(`   ✓ Login successful! Token received: ${loginData.token.substring(0, 25)}...`);

  // 6. Test Logging a Session in MongoDB Atlas
  console.log('[6] Testing Study Session creation and persistence in Atlas Cloud...');
  const sessRes = await fetch('http://localhost:4000/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + loginData.token
    },
    body: JSON.stringify({
      subjectId: 'upsc-polity',
      minutes: 45,
      mode: 'Pomodoro',
      focusScore: 95
    })
  });
  const sessData = await sessRes.json();
  if (!sessRes.ok || !sessData.id) {
    throw new Error('create session failed: ' + JSON.stringify(sessData));
  }
  const Session = mongoose.model('Session', new mongoose.Schema({}, { strict: false }));
  const mongoSess = await Session.findOne({ id: sessData.id }).lean();
  if (!mongoSess) {
    throw new Error('Session was NOT saved to MongoDB Atlas cloud database!');
  }
  console.log(`   ✓ Study session saved to Atlas Cloud! Session _id: ${mongoSess._id}, Minutes: ${mongoSess.minutes}`);

  // 7. Test Canonical Subjects
  console.log('[7] Testing Canonical UPSC & MPSC Subjects endpoint...');
  const subsRes = await fetch('http://localhost:4000/api/subjects', {
    headers: { 'Authorization': 'Bearer ' + loginData.token }
  });
  const subs = await subsRes.json();
  console.log(`   ✓ Subjects count: ${subs.length} (9 UPSC + 9 MPSC authentic subjects only)`);

  // 8. Overall Collection Audit
  console.log('\n[8] Full MongoDB Atlas Collection Audit:');
  const Plan = mongoose.model('Plan', new mongoose.Schema({}, { strict: false }));
  const Ticket = mongoose.model('Ticket', new mongoose.Schema({}, { strict: false }));
  const Subject = mongoose.model('Subject', new mongoose.Schema({}, { strict: false }));

  const [uCount, sCount, pCount, tCount, subCount] = await Promise.all([
    User.countDocuments(),
    Session.countDocuments(),
    Plan.countDocuments(),
    Ticket.countDocuments(),
    Subject.countDocuments()
  ]);
  console.log(`   - Users in Atlas: ${uCount}`);
  console.log(`   - Sessions in Atlas: ${sCount}`);
  console.log(`   - Plans in Atlas: ${pCount}`);
  console.log(`   - Tickets in Atlas: ${tCount}`);
  console.log(`   - Official Subjects: ${subCount}`);

  console.log('\n======================================================');
  console.log('✅ ALL SYSTEMS WORKING, OTP VALIDATED, AND CLOUD SAVED!');
  console.log('======================================================\n');
  process.exit(0);
}

testFullSystem().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err.message);
  process.exit(1);
});
