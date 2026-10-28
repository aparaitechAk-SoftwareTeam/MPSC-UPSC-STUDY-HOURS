/**
 * Comprehensive API Compatibility & Integrity Test Suite
 * Tests all migrated endpoints against live MongoDB-backed backend server.
 * Uses disposable test records to ensure zero corruption of the 23 migrated records.
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { connectDB } = require('../src/db');
const { User, Subject, Plan, Session, Notification, Ticket } = require('../src/models');

const BASE_URL = 'http://localhost:4000/api';
const SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret';

async function req(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('='.repeat(70));
  console.log('   MPSC-UPSC Tracker: API Route Compatibility & Integrity Tests');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  function record(testName, success, details = '') {
    if (success) {
      passed++;
      console.log(`  [PASS] ${testName}`);
    } else {
      failed++;
      console.error(`  [FAIL] ${testName} - ${details}`);
    }
  }

  // 1. Health check
  console.log('\n--- Test Group 1: System & Auth Routes ---');
  {
    const r = await req('/health');
    record('GET /api/health', r.status === 200 && r.data?.ok === true && r.data?.service === 'Abhyas Tracker API');
  }

  // 2. Register a disposable user to test real password hashing + real login flow
  const dispEmail = `test_aspirant_${Date.now()}@abhyas.local`;
  const dispPass = 'SafePass1234!';
  let dispUser = null;
  let dispToken = null;
  {
    const r = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Disposable Aspirant',
        email: dispEmail,
        password: dispPass
      })
    });
    const success = r.status === 201 && !!r.data?.token && r.data?.user?.email === dispEmail.toLowerCase() && !r.data?.user?.passwordHash;
    dispUser = r.data?.user;
    dispToken = r.data?.token;
    record('POST /api/auth/register (Create disposable user)', success, `Status: ${r.status}, body: ${JSON.stringify(r.data)}`);
  }

  // 3. Login with the created disposable user (Verifies live bcrypt compare against MongoDB)
  {
    const r = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: dispEmail, password: dispPass })
    });
    const success = r.status === 200 && !!r.data?.token && r.data?.user?.id === dispUser?.id && !r.data?.user?.passwordHash;
    record('POST /api/auth/login (Live bcrypt authentication against Atlas)', success, `Status: ${r.status}`);
  }

  // 4. Invalid Login test (Wrong password)
  {
    const r = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: dispEmail, password: 'WrongPassword999!' })
    });
    record('POST /api/auth/login (Invalid credentials rejected with 401)', r.status === 401);
  }

  // Generate tokens for existing migrated student1 and admin1
  const studentToken = jwt.sign({ id: 'student1', role: 'student' }, SECRET, { expiresIn: '1d' });
  const adminToken = jwt.sign({ id: 'admin1', role: 'admin' }, SECRET, { expiresIn: '1d' });

  // 5. GET /api/me for student1
  {
    const r = await req('/me', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    record('GET /api/me (Profile of migrated student1)', r.status === 200 && r.data?.user?.id === 'student1' && !r.data?.user?.passwordHash);
  }

  console.log('\n--- Test Group 2: Student Endpoints ---');
  // 6. GET /api/subjects
  {
    const r = await req('/subjects', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const valid = r.status === 200 && Array.isArray(r.data) && r.data.length >= 5 && !!r.data[0].id && !r.data[0]._id;
    record('GET /api/subjects (All subjects with string IDs)', valid, `Count: ${r.data?.length}`);
  }

  // 7. GET /api/plan
  {
    const r = await req('/plan', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const valid = r.status === 200 && Array.isArray(r.data) && r.data.length >= 1 && r.data[0].userId === 'student1';
    record('GET /api/plan (Plans filtered by student1)', valid);
  }

  // 8. POST & PATCH disposable /api/plan
  let tempPlanId = null;
  {
    const r = await req('/plan', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        title: 'Disposable Test Plan',
        minutes: 30,
        subjectId: 'polity'
      })
    });
    tempPlanId = r.data?.id;
    record('POST /api/plan (Create disposable plan in MongoDB)', r.status === 201 && r.data?.title === 'Disposable Test Plan');

    if (tempPlanId) {
      const patchRes = await req(`/plan/${tempPlanId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: JSON.stringify({ done: true })
      });
      record('PATCH /api/plan/:id (Update plan status in MongoDB)', patchRes.status === 200 && patchRes.data?.done === true);
    }
  }

  // 9. GET /api/sessions & POST disposable /api/sessions
  let tempSessionId = null;
  {
    const r = await req('/sessions', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const valid = r.status === 200 && Array.isArray(r.data) && r.data.length >= 6 && r.data[0].userId === 'student1';
    record('GET /api/sessions (Sorted by startedAt desc)', valid, `Count: ${r.data?.length}`);

    const postRes = await req('/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        subjectId: 'polity',
        minutes: 25,
        mode: 'Pomodoro',
        focusScore: 95
      })
    });
    tempSessionId = postRes.data?.id;
    record('POST /api/sessions (Create focus session in MongoDB)', postRes.status === 201 && postRes.data?.minutes === 25);
  }

  // 10. GET /api/notifications & PATCH /api/notifications/:id/read
  {
    const r = await req('/notifications', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    record('GET /api/notifications (Broadcast & user notifications)', r.status === 200 && Array.isArray(r.data) && r.data.length >= 5);

    if (r.data?.length > 0) {
      const readRes = await req(`/notifications/${r.data[0].id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      record('PATCH /api/notifications/:id/read (Mark notification read)', readRes.status === 200 && readRes.data?.readBy?.includes('student1'));
    }
  }

  // 11. Tickets CRUD
  let tempTicketId = null;
  {
    const r = await req('/tickets', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    record('GET /api/tickets (Student support tickets)', r.status === 200 && Array.isArray(r.data) && r.data.length >= 3);

    const createRes = await req('/tickets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        type: 'General Support',
        subject: 'Disposable Test Ticket',
        message: 'This is a test message.'
      })
    });
    tempTicketId = createRes.data?.id;
    record('POST /api/tickets (Create support ticket in MongoDB)', createRes.status === 201 && createRes.data?.status === 'Open');

    if (tempTicketId) {
      const getSingle = await req(`/tickets/${tempTicketId}`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      record('GET /api/tickets/:id (Fetch single ticket)', getSingle.status === 200 && getSingle.data?.id === tempTicketId);

      const patchTicket = await req(`/tickets/${tempTicketId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: JSON.stringify({ message: 'Updated message via MongoDB' })
      });
      record('PATCH /api/tickets/:id (Update ticket)', patchTicket.status === 200 && patchTicket.data?.message === 'Updated message via MongoDB');

      const delTicket = await req(`/tickets/${tempTicketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      record('DELETE /api/tickets/:id (Delete support ticket)', delTicket.status === 200 && delTicket.data?.ok === true);
    }
  }

  // 12. GET /api/analytics
  {
    const r = await req('/analytics', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    record('GET /api/analytics (Aggregated stats)', r.status === 200 && typeof r.data?.sessionCount === 'number' && typeof r.data?.totalMinutes === 'number');
  }

  console.log('\n--- Test Group 3: Admin Endpoints ---');
  // 13. Admin overview
  {
    const r = await req('/admin/overview', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    record('GET /api/admin/overview (Dashboard KPI counts)', r.status === 200 && typeof r.data?.users === 'number' && typeof r.data?.subjects === 'number');
  }

  // 14. Admin users list (no password hashes)
  {
    const r = await req('/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const hasNoHashes = Array.isArray(r.data) && r.data.every(u => !u.passwordHash);
    record('GET /api/admin/users (Zero password hashes exposed)', r.status === 200 && hasNoHashes);
  }

  // 15. Admin subjects CRUD
  let tempSubjectId = null;
  {
    const r = await req('/admin/subjects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Disposable Test Subject',
        paper: 'GS Paper IV',
        topics: 10
      })
    });
    tempSubjectId = r.data?.id;
    record('POST /api/admin/subjects (Create subject in MongoDB)', r.status === 201 && r.data?.name === 'Disposable Test Subject');

    if (tempSubjectId) {
      const delSubj = await req(`/admin/subjects/${tempSubjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      record('DELETE /api/admin/subjects/:id (Delete subject from MongoDB)', delSubj.status === 200 && delSubj.data?.ok === true);
    }
  }

  // 16. Admin tickets list & reply
  {
    const r = await req('/admin/tickets', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const valid = r.status === 200 && Array.isArray(r.data) && !!r.data[0]?.studentName;
    record('GET /api/admin/tickets (Includes populated studentName/Email)', valid);

    // Patch status of first ticket
    if (r.data?.length > 0) {
      const targetTicket = r.data[0];
      const patchRes = await req(`/admin/tickets/${targetTicket.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: targetTicket.status })
      });
      record('PATCH /api/admin/tickets/:id (Admin update ticket)', patchRes.status === 200 && patchRes.data?.id === targetTicket.id);
    }
  }

  console.log('\n--- Test Group 4: Newly Implemented Endpoints ---');
  // 17. Newly implemented: DELETE /api/admin/notifications/:id
  {
    // First create a disposable notification
    const createRes = await req('/admin/notifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'Disposable Notification For Delete Test',
        message: 'This announcement will be deleted.'
      })
    });
    const tempNotifId = createRes.data?.id;
    record('POST /api/admin/notifications (Create disposable announcement)', createRes.status === 201 && !!tempNotifId);

    if (tempNotifId) {
      const delRes = await req(`/admin/notifications/${tempNotifId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      record('DELETE /api/admin/notifications/:id (Newly implemented endpoint)', delRes.status === 200 && delRes.data?.ok === true && delRes.data?.id === tempNotifId);

      // Verify not found on second delete
      const delRes2 = await req(`/admin/notifications/${tempNotifId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      record('DELETE /api/admin/notifications/:id (Returns 404 for non-existent notice)', delRes2.status === 404);
    }
  }

  // 18. Newly implemented: DELETE /api/users/me
  {
    if (dispToken) {
      const delUserRes = await req('/users/me', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${dispToken}` }
      });
      record('DELETE /api/users/me (Newly implemented self-account deletion)', delUserRes.status === 200 && delUserRes.data?.ok === true);

      // Verify token is now invalid / user not found
      const meRes = await req('/me', {
        headers: { Authorization: `Bearer ${dispToken}` }
      });
      record('GET /api/me after DELETE /api/users/me (Returns 404)', meRes.status === 404);
    }
  }

  // Clean up disposable plan and session created in tests to restore 23 original records
  await connectDB();
  if (tempPlanId) {
    await Plan.deleteOne({ id: tempPlanId });
  }
  if (tempSessionId) {
    await Session.deleteOne({ id: tempSessionId });
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log('─'.repeat(70));

  await mongoose.disconnect();
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
