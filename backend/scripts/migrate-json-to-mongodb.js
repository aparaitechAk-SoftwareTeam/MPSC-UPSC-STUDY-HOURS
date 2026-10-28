/**
 * Safe, idempotent migration script: JSON database -> MongoDB Atlas
 *
 * Usage:
 *   Dry-Run Mode (Read-only simulation):
 *     node scripts/migrate-json-to-mongodb.js --dry-run
 *
 *   Live Migration Mode (Safe upsert, requires confirmation):
 *     node scripts/migrate-json-to-mongodb.js --confirm
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectDB } = require('../src/db');
const {
  User,
  Subject,
  Plan,
  Session,
  Notification,
  Ticket
} = require('../src/models');

const SOURCE_PATH = path.join(__dirname, '../data/db.json');
const BACKUP_PATH = path.join(__dirname, '../data/db.backup.json');

const isDryRun = process.argv.includes('--dry-run');
const isConfirmed = process.argv.includes('--confirm');

function sanitizeRecordForComparison(record) {
  if (!record || typeof record !== 'object') return record;
  const copy = JSON.parse(JSON.stringify(record));
  delete copy._id;
  delete copy.__v;
  return copy;
}

function recordsAreEqual(source, target) {
  const cleanTarget = sanitizeRecordForComparison(target);
  const cleanSource = sanitizeRecordForComparison(source);

  // Compare key by key
  const sourceKeys = Object.keys(cleanSource);
  for (const k of sourceKeys) {
    if (JSON.stringify(cleanSource[k]) !== JSON.stringify(cleanTarget[k])) {
      return false;
    }
  }
  return true;
}

async function run() {
  console.log('='.repeat(70));
  console.log('   MPSC-UPSC Tracker: JSON to MongoDB Atlas Migration');
  console.log('='.repeat(70));

  if (!isDryRun && !isConfirmed) {
    console.error('\n[Safety Check] Neither --dry-run nor --confirm flag was specified.');
    console.log('  To simulate without modifying the database, run:');
    console.log('    node scripts/migrate-json-to-mongodb.js --dry-run');
    console.log('  To run the live migration with safety checks, run:');
    console.log('    node scripts/migrate-json-to-mongodb.js --confirm\n');
    process.exit(1);
  }

  console.log(`\nMode: ${isDryRun ? 'DRY-RUN (Simulation, 0 database writes)' : 'LIVE MIGRATION (Safe upsert)'}`);

  // Step 1: Pre-flight checks on source & backup files
  console.log('\n[Step 1/5] Checking source and backup files...');
  if (!fs.existsSync(SOURCE_PATH)) {
    console.error(`[Error] Source JSON file missing: ${SOURCE_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(BACKUP_PATH)) {
    console.error(`[Error] Backup JSON file missing: ${BACKUP_PATH}`);
    process.exit(1);
  }
  console.log('  Source file found:', path.basename(SOURCE_PATH));
  console.log('  Backup file verified:', path.basename(BACKUP_PATH));

  // Step 2: Read and parse source JSON (Read-only)
  console.log('\n[Step 2/5] Reading and parsing source JSON...');
  let sourceData;
  try {
    const raw = fs.readFileSync(SOURCE_PATH, 'utf8');
    sourceData = JSON.parse(raw);
  } catch (err) {
    console.error(`[Error] Failed to read or parse source JSON: ${err.message}`);
    process.exit(1);
  }

  const collections = ['users', 'subjects', 'plans', 'sessions', 'notifications', 'tickets'];
  const counts = {};
  for (const col of collections) {
    if (!Array.isArray(sourceData[col])) {
      console.error(`[Validation Error] Collection '${col}' is missing or not an array.`);
      process.exit(1);
    }
    counts[col] = sourceData[col].length;
  }

  const totalSourceRecords = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`  Source records loaded: ${totalSourceRecords} total`);
  for (const [col, cnt] of Object.entries(counts)) {
    console.log(`    - ${col}: ${cnt}`);
  }

  // Step 3: Validate entity integrity and relationships
  console.log('\n[Step 3/5] Validating data integrity and relationships...');
  const userIds = new Set(sourceData.users.map(u => u.id));
  const userEmails = new Set();
  const validationErrors = [];

  // Validate users
  sourceData.users.forEach((u, i) => {
    if (!u.id || typeof u.id !== 'string') validationErrors.push(`User #${i}: Missing or invalid string ID`);
    if (!u.email || typeof u.email !== 'string') validationErrors.push(`User '${u.id}': Missing email`);
    if (!u.passwordHash) validationErrors.push(`User '${u.id}': Missing passwordHash`);
    if (userEmails.has(u.email.toLowerCase())) validationErrors.push(`User '${u.id}': Duplicate email '${u.email}' in source`);
    userEmails.add(u.email.toLowerCase());
  });

  // Validate subjects
  const subjectIds = new Set(sourceData.subjects.map(s => s.id));
  sourceData.subjects.forEach((s, i) => {
    if (!s.id || typeof s.id !== 'string') validationErrors.push(`Subject #${i}: Missing or invalid string ID`);
    if (!s.name) validationErrors.push(`Subject '${s.id}': Missing name`);
  });

  // Validate plans
  sourceData.plans.forEach((p, i) => {
    if (!p.id || typeof p.id !== 'string') validationErrors.push(`Plan #${i}: Missing or invalid string ID`);
    if (!userIds.has(p.userId)) validationErrors.push(`Plan '${p.id}': References unknown userId '${p.userId}'`);
    if (p.subjectId && !subjectIds.has(p.subjectId)) validationErrors.push(`Plan '${p.id}': References unknown subjectId '${p.subjectId}'`);
  });

  // Validate sessions
  sourceData.sessions.forEach((s, i) => {
    if (!s.id || typeof s.id !== 'string') validationErrors.push(`Session #${i}: Missing or invalid string ID`);
    if (!userIds.has(s.userId)) validationErrors.push(`Session '${s.id}': References unknown userId '${s.userId}'`);
    if (s.subjectId && !subjectIds.has(s.subjectId)) validationErrors.push(`Session '${s.id}': References unknown subjectId '${s.subjectId}'`);
  });

  // Validate notifications
  sourceData.notifications.forEach((n, i) => {
    if (!n.id || typeof n.id !== 'string') validationErrors.push(`Notification #${i}: Missing or invalid string ID`);
    if (n.userId !== 'all' && !userIds.has(n.userId)) validationErrors.push(`Notification '${n.id}': References unknown userId '${n.userId}'`);
  });

  // Validate tickets
  sourceData.tickets.forEach((t, i) => {
    if (!t.id || typeof t.id !== 'string') validationErrors.push(`Ticket #${i}: Missing or invalid string ID`);
    if (!userIds.has(t.userId)) validationErrors.push(`Ticket '${t.id}': References unknown userId '${t.userId}'`);
  });

  if (validationErrors.length > 0) {
    console.error('\n[Validation Failed] Found integrity issues in source JSON:');
    validationErrors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  console.log('  Data integrity check: 100% PASS (All IDs and foreign keys valid)');

  // Step 4: Connect to MongoDB Atlas and inspect destination
  console.log('\n[Step 4/5] Connecting to MongoDB Atlas destination...');
  try {
    await connectDB();
  } catch (err) {
    console.error(`[Error] Database connection failed: ${err.message}`);
    process.exit(1);
  }

  const modelMap = {
    users: User,
    subjects: Subject,
    plans: Plan,
    sessions: Session,
    notifications: Notification,
    tickets: Ticket
  };

  const planResults = {};
  let totalConflicts = 0;

  for (const col of collections) {
    const Model = modelMap[col];
    const sourceRecords = sourceData[col];
    const stats = {
      sourceCount: sourceRecords.length,
      existingInDb: 0,
      toInsert: 0,
      matched: 0,
      conflicts: 0
    };

    const existingCount = await Model.countDocuments();
    stats.existingInDb = existingCount;

    for (const rec of sourceRecords) {
      // Find document by custom string id
      const existingDoc = await Model.findOne({ id: rec.id }).lean();

      if (!existingDoc) {
        // Special check for user email collision under different ID
        if (col === 'users') {
          const emailCollision = await Model.findOne({ email: rec.email.toLowerCase() }).lean();
          if (emailCollision && emailCollision.id !== rec.id) {
            stats.conflicts++;
            totalConflicts++;
            console.error(`  [Conflict] User email '${rec.email}' already exists with ID '${emailCollision.id}' (source ID: '${rec.id}')`);
            continue;
          }
        }
        stats.toInsert++;
      } else {
        // Document exists - verify if contents match
        if (recordsAreEqual(rec, existingDoc)) {
          stats.matched++;
        } else {
          stats.conflicts++;
          totalConflicts++;
          console.error(`  [Conflict] Document '${col}' id '${rec.id}' exists in destination with differing content.`);
        }
      }
    }

    planResults[col] = stats;
  }

  // Step 5: Report plan / execute migration
  console.log('\n[Step 5/5] Migration Summary and Status:');
  console.log('─'.repeat(70));
  console.log(
    'Collection'.padEnd(16) +
    'Source'.padStart(8) +
    'Dest'.padStart(8) +
    'Insert'.padStart(8) +
    'Match'.padStart(8) +
    'Conflict'.padStart(10)
  );
  console.log('─'.repeat(70));

  for (const [col, stats] of Object.entries(planResults)) {
    console.log(
      col.padEnd(16) +
      String(stats.sourceCount).padStart(8) +
      String(stats.existingInDb).padStart(8) +
      String(stats.toInsert).padStart(8) +
      String(stats.matched).padStart(8) +
      String(stats.conflicts).padStart(10)
    );
  }
  console.log('─'.repeat(70));

  if (totalConflicts > 0) {
    console.error(`\n[Halt] Detected ${totalConflicts} destination conflict(s). Migration cannot proceed automatically.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (isDryRun) {
    console.log('\n[Dry-Run Result] Validation and plan generation completed successfully.');
    console.log('  - All source records and references are valid.');
    console.log('  - No destination conflicts detected.');
    console.log('  - 0 writes performed (database untouched).');
    await mongoose.disconnect();
    process.exit(0);
  }

  // Live execution mode
  console.log('\n[Executing Live Migration] Writing records with safe upserts...');
  let totalInsertedOrUpdated = 0;

  for (const col of collections) {
    const Model = modelMap[col];
    const sourceRecords = sourceData[col];

    for (const rec of sourceRecords) {
      await Model.updateOne({ id: rec.id }, { $set: rec }, { upsert: true });
      totalInsertedOrUpdated++;
    }
  }

  console.log(`[Success] Live migration completed! Processed ${totalInsertedOrUpdated} records into MongoDB Atlas.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(`[Fatal Error] Migration script encountered an error: ${err.message}`);
  if (mongoose.connection.readyState !== 0) {
    mongoose.disconnect().catch(() => {});
  }
  process.exit(1);
});
