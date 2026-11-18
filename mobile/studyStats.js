/**
 * studyStats.js
 * Centralized, deterministic study statistics and jungle forest growth calculations.
 *
 * Architecture:
 * 1. Single source of truth for Dashboard, Timer, and Analytics.
 * 2. 8-Hour Daily Study Goal (28,800 seconds).
 * 3. Daily progress calculation: (todaySeconds / 28,800) * 100.
 * 4. Remaining time calculation: max(0, 28,800 - todaySeconds).
 * 5. Local calendar date grouping (immune to UTC midnight shifts).
 * 6. ONE PERMANENT, CONTINUOUS JUNGLE built through DAILY STUDY CONTRIBUTIONS:
 *    - All previously grown trees from prior days remain permanently in the forest.
 *    - Today's completed study sessions progressively add new trees to the existing jungle.
 *    - When a new day begins, today's contribution counter resets, but all past trees remain.
 *    - Continuous progression without monthly limits or a 20-tree hard cap.
 */

export const DAILY_GOAL_HOURS = 8;
export const DAILY_GOAL_MINUTES = 480; // 8 * 60
export const DAILY_GOAL_SECONDS = 28800; // 8 * 3600

/**
 * Returns YYYY-MM-DD string in local student timezone.
 */
export function getLocalDateString(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    return String(dateInput).slice(0, 10);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format minutes into clean human-readable "Xh Ym" or "Ym".
 */
export function formatMinutesClean(minutesVal) {
  const m = Math.max(0, Math.round(Number(minutesVal) || 0));
  const hrs = Math.floor(m / 60);
  const rem = m % 60;
  if (hrs > 0) {
    return `${hrs}h ${rem < 10 ? '0' : ''}${rem}m`;
  }
  return `${rem}m`;
}

/**
 * Format seconds into clean human-readable "Xh Ym".
 */
export function formatSecondsToHM(secondsVal) {
  const s = Math.max(0, Math.floor(Number(secondsVal) || 0));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  return `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;
}

/**
 * Calculates Today's Study Stats synchronized with 8-Hour Daily Goal (28,800s).
 *
 * Formula:
 * Daily progress = (Today's completed study seconds / 28,800) * 100
 * Remaining time = 28,800 seconds - today's completed study seconds
 */
export function calculateTodayStudyStats(sessions = [], targetGoalSeconds = DAILY_GOAL_SECONDS) {
  const todayDateStr = getLocalDateString(new Date());

  const todaySessions = (sessions || []).filter(s => {
    if (!s || !s.startedAt) return false;
    const sessionDate = getLocalDateString(s.startedAt);
    const duration = s.durationSeconds ? Number(s.durationSeconds) : (Number(s.minutes) || 0) * 60;
    return sessionDate === todayDateStr && duration > 0;
  });

  const todayStudySeconds = todaySessions.reduce((sum, s) => {
    const sec = s.durationSeconds
      ? Number(s.durationSeconds)
      : (Number(s.minutes) || 0) * 60;
    return sum + (Number.isFinite(sec) && sec > 0 ? sec : 0);
  }, 0);

  const todayStudyMinutes = Math.floor(todayStudySeconds / 60);
  const todayHours = Math.floor(todayStudySeconds / 3600);
  const todayMinsRemainder = Math.floor((todayStudySeconds % 3600) / 60);

  const remainingSeconds = Math.max(0, targetGoalSeconds - todayStudySeconds);
  const remainingHours = Math.floor(remainingSeconds / 3600);
  const remainingMinsRemainder = Math.floor((remainingSeconds % 3600) / 60);

  const rawPercent = targetGoalSeconds > 0
    ? (todayStudySeconds / targetGoalSeconds) * 100
    : 0;
  const progressPercent = Math.min(100, Math.round(rawPercent * 10) / 10); // 1 decimal place, max 100%

  const isGoalMet = todayStudySeconds >= targetGoalSeconds;

  return {
    todayDateStr,
    todaySessions,
    todaySessionCount: todaySessions.length,
    todayStudySeconds,
    todayStudyMinutes,
    todayHours,
    todayMinsRemainder,
    remainingSeconds,
    remainingHours,
    remainingMinsRemainder,
    dailyGoalSeconds: targetGoalSeconds,
    dailyGoalHours: Math.round(targetGoalSeconds / 3600),
    progressPercent,
    progressFormatted: `${progressPercent.toFixed(1)}%`,
    completedFormatted: `${todayHours}h ${todayMinsRemainder < 10 ? '0' : ''}${todayMinsRemainder}m`,
    remainingFormatted: isGoalMet ? 'Goal Met! 🎉' : `${remainingHours}h ${remainingMinsRemainder < 10 ? '0' : ''}${remainingMinsRemainder}m`,
    goalFormatted: `${Math.round(targetGoalSeconds / 3600)}h 00m`,
    isGoalMet
  };
}

/**
 * Continuous, progressive Jungle Growth Levels based on cumulative lifetime study:
 * Level 1: Sprouting Clearing (0–2h) 🌱
 * Level 2: Young Forest Grove (2–5h) 🌿
 * Level 3: Flourishing Woodland (5–10h) 🪴
 * Level 4: Thriving Evergreen Forest (10–20h) 🌲
 * Level 5: Dense Canopy Wilderness (20–40h) 🌳
 * Level 6: Ancient Jungle Sanctuary (40–75h) 🌲🌳
 * Level 7: Majestic Master Rainforest (75–120h) 🌴🌲🌳
 * Level 8+: Eternal Knowledge Biosphere (120+h) 🏆🌴🌲
 */
export const JUNGLE_GROWTH_LEVELS = [
  {
    level: 1,
    titleEn: 'Sprouting Clearing',
    titleMr: 'अंकुरित माळरान',
    titleHi: 'अंकुरित मैदान',
    emoji: '🌱',
    minMinutes: 0,
    maxMinutes: 119,
    minHours: 0,
    maxHours: 2,
    badgeText: '0–2h',
    descriptionEn: 'Your focus journey begins. Tender saplings take root across the clearing.',
    descriptionMr: 'तुमचा अभ्यास प्रवास सुरू झाला आहे. मोकळ्या जागेत कोवळी रोपे रुजत आहेत.',
    descriptionHi: 'आपकी एकाग्रता यात्रा शुरू होती है। मैदान में नन्हे पौधे जड़ पकड़ रहे हैं।'
  },
  {
    level: 2,
    titleEn: 'Young Forest Grove',
    titleMr: 'तरुण वृक्षराई',
    titleHi: 'नया वन उपवन',
    emoji: '🌿',
    minMinutes: 120,
    maxMinutes: 299,
    minHours: 2,
    maxHours: 5,
    badgeText: '2–5h',
    descriptionEn: 'Daily dedication produces healthy green plants and young trees.',
    descriptionMr: 'दैनंदिन अभ्यासाने निरोगी हिरवी रोपे आणि पहिली झाडे वाढत आहेत.',
    descriptionHi: 'दैनिक अध्ययन से स्वस्थ पौधे और नए पेड़ पनप रहे हैं।'
  },
  {
    level: 3,
    titleEn: 'Flourishing Woodland',
    titleMr: 'बहरणारे अरण्य',
    titleHi: 'लहलहाता वन',
    emoji: '🪴',
    minMinutes: 300,
    maxMinutes: 599,
    minHours: 5,
    maxHours: 10,
    badgeText: '5–10h',
    descriptionEn: 'Consistent study hours are forming a flourishing botanical grove.',
    descriptionMr: 'सातत्यपूर्ण अभ्यासाने बहरणारे सुंदर अरण्य आकारास येत आहे.',
    descriptionHi: 'लगातार अध्ययन से एक सुंदर लहलहाता वन बन रहा है।'
  },
  {
    level: 4,
    titleEn: 'Thriving Evergreen Forest',
    titleMr: 'सदाहरित समृद्ध जंगल',
    titleHi: 'सदाबहार समृद्ध जंगल',
    emoji: '🌲',
    minMinutes: 600,
    maxMinutes: 1199,
    minHours: 10,
    maxHours: 20,
    badgeText: '10–20h',
    descriptionEn: 'Solid discipline creates towering pines and broadleaf evergreens.',
    descriptionMr: 'मजबूत शिस्तीने उंच देवदार व सदाहरित वृक्षांची मालिका तयार झाली आहे.',
    descriptionHi: 'मजबूत अनुशासन से ऊंचे चीड़ और सदाबहार पेड़ों की श्रृंखला बन रही है।'
  },
  {
    level: 5,
    titleEn: 'Dense Canopy Wilderness',
    titleMr: 'घनदाट छत्र अरण्य',
    titleHi: 'घना छत्र जंगल',
    emoji: '🌳',
    minMinutes: 1200,
    maxMinutes: 2399,
    minHours: 20,
    maxHours: 40,
    badgeText: '20–40h',
    descriptionEn: 'Multi-layered canopies shield the forest floor with rich foliage.',
    descriptionMr: 'अनेक स्तरांची हिरवी छत्रे अरण्याला समृद्ध सावली देत आहेत.',
    descriptionHi: 'बहुस्तरीय छत्र वन भूमि को हरी-भरी पत्तियों से ढंक रहे हैं।'
  },
  {
    level: 6,
    titleEn: 'Ancient Jungle Sanctuary',
    titleMr: 'प्राचीन अरण्य अभयारण्य',
    titleHi: 'प्राचीन जंगल अभयारण्य',
    emoji: '🌲🌳',
    minMinutes: 2400,
    maxMinutes: 4499,
    minHours: 40,
    maxHours: 75,
    badgeText: '40–75h',
    descriptionEn: 'Grand trunks and ancient roots stand as monuments to deep focus.',
    descriptionMr: 'भव्य खोडे व प्राचीन मुळे तुमच्या सखोल अभ्यासाचे प्रतीक आहेत.',
    descriptionHi: 'विशाल तने और गहरी जड़ें आपकी एकाग्रता का प्रतीक बन चुकी हैं।'
  },
  {
    level: 7,
    titleEn: 'Majestic Master Rainforest',
    titleMr: 'भव्य महा अरण्य (रेनफॉरेस्ट)',
    titleHi: 'भव्य महा-वर्षावन',
    emoji: '🌴🌲🌳',
    minMinutes: 4500,
    maxMinutes: 7199,
    minHours: 75,
    maxHours: 120,
    badgeText: '75–120h',
    descriptionEn: 'A breathtaking tropical biosphere teeming with academic excellence.',
    descriptionMr: 'ज्ञानाच्या शिखरावर पोहोचलेले निसर्गरम्य भव्य महा अरण्य बहरले आहे.',
    descriptionHi: 'ज्ञान के शिखर पर पहुंचा एक भव्य और समृद्ध वर्षावन खिल उठा है।'
  },
  {
    level: 8,
    titleEn: 'Eternal Knowledge Biosphere',
    titleMr: 'अमर ज्ञान बायोस्फीअर',
    titleHi: 'शाश्वत ज्ञान बायोस्फीयर',
    emoji: '🏆🌴🌲',
    minMinutes: 7200,
    maxMinutes: Infinity,
    minHours: 120,
    maxHours: Infinity,
    badgeText: '120+h',
    descriptionEn: 'Infinite wisdom achieved! An immortal, ever-expanding living forest.',
    descriptionMr: 'असीम ज्ञान संपादन! कायमस्वरूपी विस्तारणारे चैतन्यमय अरण्य.',
    descriptionHi: 'अनंत ज्ञान की प्राप्ति! निरंतर विस्तार लेता अमर जीवंत जंगल।'
  }
];

// Alias for backwards compatibility
export const FOREST_MILESTONES = JUNGLE_GROWTH_LEVELS.map(l => ({
  ...l,
  id: `level_${l.level}`,
  stageNumber: l.level
}));

/**
 * Deterministic layout slot generator for unbounded forest growth.
 * Distributes trees organically across 3 depth layers:
 * Layer 1 (Ridge, smaller scale 0.55-0.65)
 * Layer 2 (Midground hill, scale 0.75-0.88)
 * Layer 3 (Foreground terrain, scale 0.95-1.25)
 */
export function getTreeSlot(index) {
  // 36 Base organic slots
  const baseSlots = [
    // 0: Center clearing sprout
    { x: 190, y: 150, scale: 1.1, type: 'sapling', layer: 3 },
    // 1-2: First plants
    { x: 135, y: 152, scale: 0.95, type: 'plant', layer: 3 },
    { x: 245, y: 148, scale: 1.0, type: 'plant', layer: 3 },
    // 3-5: Sturdy trees
    { x: 80, y: 142, scale: 0.85, type: 'oak_young', layer: 3 },
    { x: 300, y: 144, scale: 0.9, type: 'pine', layer: 3 },
    { x: 160, y: 136, scale: 0.8, type: 'pine', layer: 2 },
    // 6-8: Woodland spread
    { x: 220, y: 138, scale: 0.85, type: 'oak', layer: 2 },
    { x: 340, y: 146, scale: 0.95, type: 'broadleaf', layer: 3 },
    { x: 110, y: 126, scale: 0.65, type: 'pine_ridge', layer: 1 },
    // 9-12: Mid-hill depth
    { x: 270, y: 128, scale: 0.7, type: 'oak_ridge', layer: 1 },
    { x: 45, y: 148, scale: 1.05, type: 'palm', layer: 3 },
    { x: 180, y: 138, scale: 0.9, type: 'broadleaf', layer: 2 },
    { x: 60, y: 124, scale: 0.6, type: 'pine_ridge', layer: 1 },
    // 13-16: Forest sanctuary
    { x: 145, y: 144, scale: 1.0, type: 'oak', layer: 3 },
    { x: 235, y: 132, scale: 0.8, type: 'pine', layer: 2 },
    { x: 320, y: 126, scale: 0.65, type: 'broadleaf_ridge', layer: 1 },
    { x: 195, y: 128, scale: 1.25, type: 'ancient_banyan', layer: 2 },
    { x: 365, y: 145, scale: 1.1, type: 'palm', layer: 3 },
    // 17-20: Biosphere expansion
    { x: 15, y: 130, scale: 0.7, type: 'pine_ridge', layer: 1 },
    { x: 275, y: 138, scale: 1.15, type: 'sacred_canopy', layer: 3 },
    { x: 95, y: 146, scale: 0.95, type: 'oak', layer: 3 },
    { x: 205, y: 146, scale: 1.0, type: 'broadleaf', layer: 3 },
    { x: 330, y: 134, scale: 0.85, type: 'pine', layer: 2 },
    // 21-25: Canopy density
    { x: 125, y: 130, scale: 0.75, type: 'oak_ridge', layer: 2 },
    { x: 255, y: 126, scale: 0.7, type: 'pine_ridge', layer: 1 },
    { x: 70, y: 150, scale: 1.1, type: 'palm', layer: 3 },
    { x: 290, y: 150, scale: 1.05, type: 'ancient_banyan', layer: 3 },
    { x: 170, y: 148, scale: 1.0, type: 'oak_young', layer: 3 },
    // 26-30: Dense Rainforest Grove
    { x: 35, y: 126, scale: 0.6, type: 'broadleaf_ridge', layer: 1 },
    { x: 150, y: 124, scale: 0.62, type: 'pine_ridge', layer: 1 },
    { x: 215, y: 124, scale: 0.65, type: 'oak_ridge', layer: 1 },
    { x: 350, y: 128, scale: 0.6, type: 'pine_ridge', layer: 1 },
    { x: 115, y: 144, scale: 0.95, type: 'plant', layer: 3 },
    { x: 265, y: 144, scale: 0.95, type: 'plant', layer: 3 },
    { x: 230, y: 150, scale: 1.15, type: 'sacred_canopy', layer: 3 },
    { x: 185, y: 142, scale: 1.05, type: 'oak', layer: 3 }
  ];

  if (index < baseSlots.length) {
    return { id: index + 1, ...baseSlots[index] };
  }

  // Wrap around with subtle organic jitter for unlimited expansion (50, 100+ trees)
  const cycle = Math.floor(index / baseSlots.length);
  const base = baseSlots[index % baseSlots.length];
  const jitterX = ((index * 37) % 23) - 11;
  const jitterY = ((index * 19) % 7) - 3;
  const clampedX = Math.max(12, Math.min(368, base.x + jitterX));
  const clampedY = Math.max(120, Math.min(156, base.y + jitterY));

  return {
    id: index + 1,
    x: clampedX,
    y: clampedY,
    scale: Math.max(0.6, Math.min(1.3, base.scale * (1 + ((cycle % 3) * 0.05)))),
    type: base.type,
    layer: base.layer
  };
}

/**
 * Calculates ONE PERMANENT, CONTINUOUS JUNGLE built through DAILY STUDY CONTRIBUTIONS.
 *
 * Rules:
 * 1. Growth is cumulative across all dates.
 * 2. Every successfully saved study session contributes to the permanent jungle.
 * 3. Daily study sessions add new growth on top of existing trees.
 * 4. When a new day begins, today's contribution counter resets, but all past trees remain.
 * 5. No monthly resets. No artificial cap at 20 trees.
 */
export function calculateForestGrowth(sessions = []) {
  const todayStr = getLocalDateString(new Date());

  // Valid saved sessions with positive duration, sorted by startedAt ascending
  const validSessions = (sessions || [])
    .filter(s => s && (Number(s.minutes) > 0 || Number(s.durationSeconds) > 0) && s.startedAt)
    .slice()
    .sort((a, b) => (a.startedAt || '').localeCompare(b.startedAt || ''));

  // Separate past sessions vs today's sessions
  const pastSessions = [];
  const todaySessions = [];

  let totalMinutes = 0;
  let todayMinutes = 0;
  let pastMinutes = 0;

  for (const s of validSessions) {
    const sDate = getLocalDateString(s.startedAt);
    const m = Number(s.minutes) || Math.max(1, Math.round((Number(s.durationSeconds) || 0) / 60));
    totalMinutes += m;
    if (sDate === todayStr) {
      todaySessions.push(s);
      todayMinutes += m;
    } else {
      pastSessions.push(s);
      pastMinutes += m;
    }
  }

  // Each session contributes trees based on its duration (1 tree per ~25-30m of focus):
  // 1-35m -> 1 tree
  // 36-65m -> 2 trees
  // 66-95m -> 3 trees
  // 96m+ -> Math.max(1, Math.round(m / 30))
  const getTreesFromSession = (session) => {
    const m = Number(session.minutes) || Math.max(1, Math.round((Number(session.durationSeconds) || 0) / 60));
    return Math.max(1, Math.round(m / 30));
  };

  const pastTreesCount = pastSessions.reduce((sum, s) => sum + getTreesFromSession(s), 0);
  const todayTreesCount = todaySessions.reduce((sum, s) => sum + getTreesFromSession(s), 0);
  const totalTreesCount = pastTreesCount + todayTreesCount;

  // Active Jungle Growth Level
  let currentLevelIndex = 0;
  for (let i = 0; i < JUNGLE_GROWTH_LEVELS.length; i++) {
    if (totalMinutes >= JUNGLE_GROWTH_LEVELS[i].minMinutes) {
      currentLevelIndex = i;
    }
  }

  const currentLevel = JUNGLE_GROWTH_LEVELS[currentLevelIndex];
  const nextLevel = currentLevelIndex < JUNGLE_GROWTH_LEVELS.length - 1
    ? JUNGLE_GROWTH_LEVELS[currentLevelIndex + 1]
    : null;

  let levelProgressPercent = 100;
  let minutesNeededForNext = 0;

  if (nextLevel) {
    const levelSpan = nextLevel.minMinutes - currentLevel.minMinutes;
    const progressInLevel = totalMinutes - currentLevel.minMinutes;
    levelProgressPercent = Math.min(100, Math.max(0, Math.round((progressInLevel / levelSpan) * 100)));
    minutesNeededForNext = Math.max(0, nextLevel.minMinutes - totalMinutes);
  }

  // Construct deterministic tree objects for the landscape
  // If student has 0 trees, show 1 initial tender sapling
  const displayTreeCount = Math.max(1, totalTreesCount);
  const visibleTrees = [];

  for (let i = 0; i < displayTreeCount; i++) {
    const slot = getTreeSlot(i);
    const isToday = totalTreesCount > 0 ? i >= pastTreesCount : false;
    const isPast = totalTreesCount > 0 ? i < pastTreesCount : false;

    visibleTrees.push({
      ...slot,
      isToday,
      isPast,
      isInitialSeed: totalTreesCount === 0 && i === 0
    });
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  const todayHours = Math.floor(todayMinutes / 60);
  const todayMins = todayMinutes % 60;

  // Level badges with unlock status
  const levelsWithStatus = JUNGLE_GROWTH_LEVELS.map((lvl, idx) => ({
    ...lvl,
    id: `level_${lvl.level}`,
    stageNumber: lvl.level,
    isUnlocked: totalMinutes >= lvl.minMinutes,
    isCurrent: idx === currentLevelIndex,
    isUpcoming: totalMinutes < lvl.minMinutes
  }));

  return {
    // Total Permanent Jungle stats
    totalMinutes,
    totalHours,
    remainingMins,
    totalFormatted: `${totalHours}h ${remainingMins < 10 ? '0' : ''}${remainingMins}m`,
    totalTreesCount,
    treeCount: totalTreesCount, // Backwards compatibility

    // Today's Daily Contributions
    todayMinutes,
    todayHours,
    todayMins,
    todayFormatted: `${todayHours}h ${todayMins < 10 ? '0' : ''}${todayMins}m`,
    todayTreesCount,
    pastTreesCount,
    hasTodayContribution: todayTreesCount > 0,

    // Current Level & Progression
    currentLevel,
    currentLevelIndex,
    currentStage: { ...currentLevel, stageNumber: currentLevel.level }, // Compatibility
    nextLevel,
    nextStage: nextLevel ? { ...nextLevel, stageNumber: nextLevel.level } : null,
    levelProgressPercent,
    stageProgressPercent: levelProgressPercent,
    minutesNeededForNext,

    // Living Forest Trees for SVG Canvas
    visibleTrees,
    levels: levelsWithStatus,
    milestones: levelsWithStatus // Compatibility
  };
}

/**
 * Calculates study statistics and daily activity for a specified range (e.g. 7 or 30 days)
 * based strictly on the student's actual study sessions in local calendar dates.
 *
 * Guaranteed properties:
 * 1. rangeDays local calendar date buckets ending on today's local date.
 * 2. Does NOT modify, reset, or alter the permanent lifetime jungle.
 * 3. Dynamically updates when range filter ('7' vs '30') changes.
 * 4. Deduplicates sessions by session ID (_id or id).
 */
export function calculateRangeStudyStats(sessions = [], rangeDays = 7) {
  const numDays = Math.max(1, Number(rangeDays) || 7);
  const today = new Date();

  // Generate date buckets in chronological order (earliest to today)
  const dateBuckets = [];
  const dateMap = new Map();

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const dateStr = getLocalDateString(d);
    const bucket = {
      date: dateStr,
      minutes: 0,
      durationSeconds: 0,
      count: 0
    };
    dateBuckets.push(bucket);
    dateMap.set(dateStr, bucket);
  }

  // Deduplicate and filter sessions
  const seenIds = new Set();
  const rangeSessions = [];
  let rangeMinutes = 0;
  let rangeSeconds = 0;
  const focusScores = [];

  for (const s of (sessions || [])) {
    if (!s || !s.startedAt) continue;
    const sId = s._id || s.id;
    if (sId) {
      if (seenIds.has(sId)) continue;
      seenIds.add(sId);
    }

    const durationSec = s.durationSeconds
      ? Number(s.durationSeconds)
      : (Number(s.minutes) || 0) * 60;
    const minutes = Number(s.minutes) || Math.max(1, Math.round(durationSec / 60));

    if (durationSec <= 0 && minutes <= 0) continue;

    const sDate = getLocalDateString(s.startedAt);
    if (dateMap.has(sDate)) {
      const bucket = dateMap.get(sDate);
      bucket.minutes += minutes;
      bucket.durationSeconds += durationSec;
      bucket.count += 1;

      rangeSessions.push(s);
      rangeMinutes += minutes;
      rangeSeconds += durationSec;

      if (Number.isFinite(Number(s.focusScore)) && Number(s.focusScore) > 0) {
        focusScores.push(Number(s.focusScore));
      }
    }
  }

  const activeDays = dateBuckets.filter(b => b.minutes > 0).length;
  const maxMinutes = Math.max(1, ...dateBuckets.map(b => b.minutes));
  const averageDailyMinutes = Math.round(rangeMinutes / numDays);
  const consistencyPercent = Math.min(100, Math.round((activeDays / numDays) * 100));
  const averageFocus = focusScores.length > 0
    ? Math.round(focusScores.reduce((sum, score) => sum + score, 0) / focusScores.length)
    : (rangeSessions.length > 0 ? 100 : 0);

  const averageSessionMinutes = rangeSessions.length > 0
    ? Math.round(rangeMinutes / rangeSessions.length)
    : 0;

  return {
    rangeDays: numDays,
    chartDays: dateBuckets.map(b => ({
      date: b.date,
      minutes: b.minutes,
      durationSeconds: b.durationSeconds,
      count: b.count
    })),
    rangeSessions,
    rangeSessionCount: rangeSessions.length,
    rangeMinutes,
    rangeSeconds,
    rangeFormatted: formatMinutesClean(rangeMinutes),
    activeDays,
    totalDays: numDays,
    maxMinutes,
    averageDailyMinutes,
    averageDailyFormatted: formatMinutesClean(averageDailyMinutes),
    consistencyPercent,
    averageFocus,
    averageSessionMinutes,
    averageSessionFormatted: formatMinutesClean(averageSessionMinutes)
  };
}
