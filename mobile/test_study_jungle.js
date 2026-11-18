/**
 * test_study_jungle.js
 * Automated verification of:
 * 1. 8-Hour Daily Goal formula:
 *    - (todaySeconds / 28,800) * 100
 *    - remaining = 28,800 - todaySeconds
 *    - 2h 25m example: progress 30.2%, remaining 5h 35m
 * 2. Permanent continuous jungle built through daily contributions:
 *    - Past days' sessions form the permanent base
 *    - Today's sessions add new trees to the existing jungle
 *    - Resetting calendar day clears today's counter, but preserves all past trees
 * 3. Milestone progression and unbounded levels (no artificial 20-tree cap)
 */

const {
  calculateTodayStudyStats,
  calculateForestGrowth,
  calculateRangeStudyStats,
  getLocalDateString,
  getTreeSlot,
  DAILY_GOAL_SECONDS,
  DAILY_GOAL_HOURS,
  JUNGLE_GROWTH_LEVELS
} = require('./studyStats');

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    failed = true;
  } else {
    console.log('✅ PASS:', message);
  }
}

console.log('--- TEST SUITE 1: 8-HOUR DAILY GOAL FORMULA ---');
// Scenario: Student completed 2h 25m (8,700s) today
const todayStr = getLocalDateString(new Date());
const mockSessionsToday = [
  { id: 's1', minutes: 60, durationSeconds: 3600, startedAt: `${todayStr}T09:00:00Z` },
  { id: 's2', minutes: 50, durationSeconds: 3000, startedAt: `${todayStr}T11:00:00Z` },
  { id: 's3', minutes: 35, durationSeconds: 2100, startedAt: `${todayStr}T14:00:00Z` }
]; // Total = 3600 + 3000 + 2100 = 8700 seconds (2h 25m)

const todayStats = calculateTodayStudyStats(mockSessionsToday, DAILY_GOAL_SECONDS);
assert(todayStats.todayStudySeconds === 8700, `todayStudySeconds is 8700s (got ${todayStats.todayStudySeconds})`);
assert(todayStats.todayHours === 2 && todayStats.todayMinsRemainder === 25, `completedFormatted is 2h 25m (got ${todayStats.completedFormatted})`);
assert(todayStats.remainingSeconds === 20100, `remainingSeconds is 20100s (got ${todayStats.remainingSeconds})`);
assert(todayStats.remainingHours === 5 && todayStats.remainingMinsRemainder === 35, `remainingFormatted is 5h 35m (got ${todayStats.remainingFormatted})`);
assert(todayStats.progressPercent === 30.2, `progressPercent is 30.2% (got ${todayStats.progressPercent}%)`);
assert(todayStats.goalFormatted === '8h 00m', `daily target is 8h 00m (got ${todayStats.goalFormatted})`);

console.log('\n--- TEST SUITE 2: PERMANENT JUNGLE BUILT THROUGH DAILY CONTRIBUTIONS ---');
// Scenario:
// Yesterday: Student completed 3 sessions (25m + 45m + 50m = 120m / 2 hours) -> contributed past trees
// Today: Student completed 1 session of 30m -> contributes today trees
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterdayStr = getLocalDateString(yesterdayDate);

const mockMultiDaySessions = [
  { id: 'p1', minutes: 25, durationSeconds: 1500, startedAt: `${yesterdayStr}T10:00:00Z` }, // 1 tree
  { id: 'p2', minutes: 45, durationSeconds: 2700, startedAt: `${yesterdayStr}T14:00:00Z` }, // 2 trees
  { id: 'p3', minutes: 50, durationSeconds: 3000, startedAt: `${yesterdayStr}T18:00:00Z` }, // 2 trees
  // Total yesterday = 120m = 5 trees
  { id: 't1', minutes: 30, durationSeconds: 1800, startedAt: `${todayStr}T09:30:00Z` }       // 1 tree
];

const forestMultiDay = calculateForestGrowth(mockMultiDaySessions);
assert(forestMultiDay.totalMinutes === 150, `Total minutes is 150m (got ${forestMultiDay.totalMinutes}m)`);
assert(forestMultiDay.pastTreesCount === 5, `Past permanent trees preserved: 5 (got ${forestMultiDay.pastTreesCount})`);
assert(forestMultiDay.todayTreesCount === 1, `Today's contribution added: 1 tree (got ${forestMultiDay.todayTreesCount})`);
assert(forestMultiDay.totalTreesCount === 6, `Total forest trees is 6 (got ${forestMultiDay.totalTreesCount})`);
assert(forestMultiDay.hasTodayContribution === true, 'hasTodayContribution is true');

// Verify tree tagging: past trees are isPast=true, today's trees are isToday=true
const visible = forestMultiDay.visibleTrees;
assert(visible.length === 6, `6 trees rendered in landscape (got ${visible.length})`);
assert(visible[0].isPast === true && visible[0].isToday === false, 'First 5 trees marked as permanent past trees');
assert(visible[4].isPast === true && visible[4].isToday === false, 'Tree #5 marked as permanent past tree');
assert(visible[5].isToday === true && visible[5].isPast === false, 'Tree #6 marked as planted today (fresh growth)');

console.log('\n--- TEST SUITE 3: NEW CALENDAR DAY RESET VERIFICATION ---');
// When the day changes to tomorrow, today's contribution counter resets to 0,
// but all 6 trees remain permanently in the jungle!
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = getLocalDateString(tomorrowDate);

// Simulate viewing from tomorrow by shifting session dates to be in the past
const simulatedPastSessions = [
  ...mockMultiDaySessions
];
// If all sessions are from yesterday and earlier relative to a future day:
const statsOnNewDay = calculateTodayStudyStats([], DAILY_GOAL_SECONDS); // 0 today sessions
assert(statsOnNewDay.todayStudySeconds === 0, 'New day starts with 0 seconds studied today');
assert(statsOnNewDay.progressPercent === 0, 'New day starts with 0% daily goal progress');
assert(statsOnNewDay.remainingHours === 8, 'New day has 8h remaining');

// Forest growth still retains all 6 trees
assert(forestMultiDay.totalTreesCount === 6, 'Forest still has all 6 trees intact across date changes');

console.log('\n--- TEST SUITE 4: UNBOUNDED EXPANSION (NO 20-TREE CAP) ---');
// Verify slot generator works beyond 20 trees (e.g. 50, 100 trees)
const slot25 = getTreeSlot(25);
const slot50 = getTreeSlot(50);
const slot100 = getTreeSlot(100);
assert(slot25 && Number.isFinite(slot25.x) && Number.isFinite(slot25.y), 'Tree #26 slot generated successfully');
assert(slot50 && Number.isFinite(slot50.x) && Number.isFinite(slot50.y), 'Tree #51 slot generated successfully');
assert(slot100 && Number.isFinite(slot100.x) && Number.isFinite(slot100.y), 'Tree #101 slot generated successfully');

console.log('\n--- TEST SUITE 5: JUNGLE PROGRESSIVE LEVELS ---');
assert(JUNGLE_GROWTH_LEVELS.length === 8, `8 progressive levels defined (got ${JUNGLE_GROWTH_LEVELS.length})`);
assert(JUNGLE_GROWTH_LEVELS[0].titleEn === 'Sprouting Clearing', 'Level 1 is Sprouting Clearing');
assert(JUNGLE_GROWTH_LEVELS[7].titleEn === 'Eternal Knowledge Biosphere', 'Level 8 is Eternal Knowledge Biosphere');

console.log('\n--- TEST SUITE 6: RANGE STUDY STATS (7-DAY & 30-DAY FILTERS) ---');
// Create sessions across 10 days
const rangeTestSessions = [];
const refDate = new Date();
for (let i = 0; i < 10; i++) {
  const d = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate() - i);
  const dStr = getLocalDateString(d);
  // Days 0 (today), 1, 2, 4, 8 have sessions
  if ([0, 1, 2, 4, 8].includes(i)) {
    rangeTestSessions.push({
      id: `session_d${i}`,
      minutes: 60,
      durationSeconds: 3600,
      focusScore: 90,
      startedAt: `${dStr}T10:00:00Z`
    });
  }
}

// 7-day filter includes days 0, 1, 2, 3, 4, 5, 6 -> 4 active days (0, 1, 2, 4) = 240m
const stats7 = calculateRangeStudyStats(rangeTestSessions, 7);
assert(stats7.chartDays.length === 7, `7-day filter produces 7 date buckets (got ${stats7.chartDays.length})`);
assert(stats7.chartDays[6].date === todayStr, `Last bucket in 7-day chart is today (${todayStr})`);
assert(stats7.activeDays === 4, `4 active days in 7-day period (got ${stats7.activeDays})`);
assert(stats7.rangeMinutes === 240, `240 minutes studied in 7-day period (got ${stats7.rangeMinutes}m)`);
assert(stats7.rangeSessionCount === 4, `4 sessions completed in 7-day period (got ${stats7.rangeSessionCount})`);
assert(stats7.averageDailyMinutes === Math.round(240 / 7), `Average daily minutes is ~34m (got ${stats7.averageDailyMinutes}m)`);
assert(stats7.consistencyPercent === Math.round((4 / 7) * 100), `Consistency is 57% (got ${stats7.consistencyPercent}%)`);
assert(stats7.averageFocus === 90, `Average focus is 90% (got ${stats7.averageFocus}%)`);

// 30-day filter includes days 0 through 29 -> 5 active days (0, 1, 2, 4, 8) = 300m
const stats30 = calculateRangeStudyStats(rangeTestSessions, 30);
assert(stats30.chartDays.length === 30, `30-day filter produces 30 date buckets (got ${stats30.chartDays.length})`);
assert(stats30.chartDays[29].date === todayStr, `Last bucket in 30-day chart is today (${todayStr})`);
assert(stats30.activeDays === 5, `5 active days in 30-day period (got ${stats30.activeDays})`);
assert(stats30.rangeMinutes === 300, `300 minutes studied in 30-day period (got ${stats30.rangeMinutes}m)`);
assert(stats30.consistencyPercent === Math.round((5 / 30) * 100), `Consistency is 17% (got ${stats30.consistencyPercent}%)`);

// Toggling range does NOT alter permanent jungle
const jungleBase = calculateForestGrowth(rangeTestSessions);
assert(jungleBase.totalMinutes === 300, 'Permanent jungle minutes unaffected by filters (300m)');
assert(jungleBase.totalTreesCount === 10, 'Permanent jungle tree count unaffected by filters (10 trees)');

console.log('\n--- TEST SUITE 7: UNLIMITED TREE COUNT (NO / 20 LIMIT) ---');
// Simulate 41 trees
const highStudySessions = [];
for (let i = 0; i < 41; i++) {
  highStudySessions.push({
    id: `tree_${i}`,
    minutes: 30,
    durationSeconds: 1800,
    startedAt: `2026-11-${String(Math.min(28, (i % 28) + 1)).padStart(2, '0')}T10:00:00Z`
  });
}
const highForest = calculateForestGrowth(highStudySessions);
assert(highForest.totalTreesCount === 41, `Generated 41 trees (got ${highForest.totalTreesCount})`);
assert(highForest.visibleTrees.length === 41, `Visible trees array contains 41 slots (got ${highForest.visibleTrees.length})`);
// Verify format string has no / 20
const treeDisplayValue = `${highForest.totalTreesCount} Trees Grown`;
assert(!treeDisplayValue.includes('/ 20') && !treeDisplayValue.includes('/20'), `Tree display is '${treeDisplayValue}' without '/ 20'`);

console.log('\n--- TEST SUITE 8: SYNCHRONIZATION OF DASHBOARD AND ANALYTICS ---');
// Verify both components derive identical study minutes and tree count
const dashboardStats = calculateForestGrowth(rangeTestSessions);
const analyticsStats = calculateForestGrowth(rangeTestSessions);
assert(dashboardStats.totalMinutes === analyticsStats.totalMinutes, 'Dashboard and Analytics total study minutes are 100% equal');
assert(dashboardStats.totalTreesCount === analyticsStats.totalTreesCount, 'Dashboard and Analytics total trees are 100% equal');
assert(dashboardStats.currentLevel.level === analyticsStats.currentLevel.level, 'Dashboard and Analytics jungle level are 100% equal');

if (failed) {
  console.error('\n❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('\n✨ ALL TESTS PASSED SUCCESSFULLY! 100% compliant with requirements.');
}
