// ==============================================================
// ABHYAS TRACKER - MULTILINGUAL TRANSLATION SYSTEM
// Supported Languages: English (en), हिन्दी (hi), मराठी (mr)
// ==============================================================

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '' }
];

export const DEFAULT_SYLLABUS_SUBJECTS = [
  // UPSC Civil Services (9 Subjects)
  { id: 'upsc-history-culture', name: 'History and Culture', exam: 'UPSC', paper: 'GS Paper I' },
  { id: 'upsc-geography', name: 'Geography', exam: 'UPSC', paper: 'GS Paper I' },
  { id: 'upsc-polity', name: 'Indian Polity and Governance', exam: 'UPSC', paper: 'GS Paper II' },
  { id: 'upsc-economy', name: 'Indian Economy', exam: 'UPSC', paper: 'GS Paper III' },
  { id: 'upsc-environment', name: 'Environment and Ecology', exam: 'UPSC', paper: 'GS Paper III' },
  { id: 'upsc-science-tech', name: 'Science and Technology', exam: 'UPSC', paper: 'GS Paper III' },
  { id: 'upsc-current-affairs', name: 'Current Affairs', exam: 'UPSC', paper: 'GS Paper I-IV' },
  { id: 'upsc-csat', name: 'CSAT (Prelims Paper II)', exam: 'UPSC', paper: 'Prelims Paper II' },
  { id: 'upsc-ethics', name: 'Ethics, Integrity and Aptitude (Mains)', exam: 'UPSC', paper: 'GS Paper IV' },

  // MPSC Maharashtra State Services (9 Subjects)
  { id: 'mpsc-history', name: 'Maharashtra and Indian History', exam: 'MPSC', paper: 'GS Paper I' },
  { id: 'mpsc-geography', name: 'Maharashtra and Indian Geography', exam: 'MPSC', paper: 'GS Paper I' },
  { id: 'mpsc-polity', name: 'Constitution & Administration', exam: 'MPSC', paper: 'GS Paper II' },
  { id: 'mpsc-economy', name: 'Indian and Maharashtra Economy', exam: 'MPSC', paper: 'GS Paper IV' },
  { id: 'mpsc-marathi', name: 'Marathi Language', exam: 'MPSC', paper: 'Language Paper I' },
  { id: 'mpsc-english', name: 'English Language', exam: 'MPSC', paper: 'Language Paper II' },
  { id: 'mpsc-aptitude', name: 'Aptitude and Reasoning', exam: 'MPSC', paper: 'CSAT Paper II' },
  { id: 'mpsc-environment-science', name: 'Environment and Science', exam: 'MPSC', paper: 'GS Paper IV' },
  { id: 'mpsc-current-affairs', name: 'Current Affairs', exam: 'MPSC', paper: 'GS Paper I-IV' }
];

export const translations = {
  // ==================== ENGLISH ====================
  en: {
    // Navigation & Tabs
    dashboard: 'Dashboard',
    timer: 'Timer',
    syllabus: 'Syllabus',
    planner: 'Planner',
    analytics: 'Analytics',
    ticketSupport: 'Ticket Support',
    pro: "Pro",
    premium: "Premium",
    upgradeToPremium: "Upgrade to Abhyas Premium",
    premiumSubtitle: "Study Smarter. Track Better. Achieve More.",
    premiumBenefits: "Premium benefits",
    freePlan: "Free Plan",
    freePlanPrice: "$0",
    freePlanDesc: "Essential study tracking for every aspirant",
    premiumMonthly: "Premium Monthly",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/month",
    premiumYearly: "Premium Yearly",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/year",
    bestValueSave: "BEST VALUE – SAVE 33%",
    upgradeToPremiumBtn: "Upgrade to Premium",
    restorePurchases: "Restore Purchases",
    manageSubscription: "Manage Subscription",
    cancelSubscription: "Cancel Subscription",
    changePlan: "Change Plan",
    subscriptionActiveUntil: "Active until {date}",
    termsAndPrivacy: "Terms & Conditions • Privacy Policy",
    renewalInfo: "Auto-renews until cancelled. Cancel anytime in Google Play Store or account settings.",
    subscriptionExpiryWarning: "Your Premium subscription is expiring soon. Renew now to keep your unlimited benefits.",
    renewNow: "Renew Subscription",
    activePlanLabel: "Current Active Plan",
    freePlanActive: "Free Plan Active",
    premiumOfficerActive: "PREMIUM OFFICER ACTIVE",
    paymentConfirmation: "Payment Confirmation",
    orderSummary: "Order Summary",
    selectedPlan: "Selected Plan",
    billingCycle: "Billing Cycle",
    totalAmount: "Total Amount",
    paySecurely: "Pay Securely & Activate",
    welcomeToPremium: "🎉 Welcome to Abhyas Premium!",
    activationSuccessDesc: "Your subscription is now active. All premium features, AI mentorship, and advanced analytics have been unlocked.",
    startStudyingBtn: "Start Studying with Premium",
    cancelConfirmTitle: "Cancel Subscription?",
    cancelConfirmDesc: "You will continue to have Premium access until the end of your current billing period ({date}).",
    keepSubscription: "Keep My Subscription",
    confirmCancel: "Confirm Cancellation",
    purchasesRestored: "Purchases restored successfully. Your subscription is up to date.",
    featureUnlimitedHistory: "Unlimited study history",
    featureAdvancedAnalytics: "Advanced study analytics",
    featurePerformanceReports: "Weekly and monthly performance reports",
    featureCustomGoals: "Custom study goals",
    featureAdvancedPlanner: "Advanced planner and routines",
    featureAIAbhyasMitra: "AI Abhyas Mitra assistance",
    featureCloudSync: "Cloud backup and synchronization",
    featureAnnualReports: "Annual performance reports",
    featureProgressComparison: "Long-term progress comparison",
    featurePrioritySupport: "Priority support",
    featureExclusiveThemes: "Exclusive premium themes",
    premium: "Premium",
    upgradeToPremium: "Upgrade to Abhyas Premium",
    premiumSubtitle: "Study Smarter. Track Better. Achieve More.",
    premiumBenefits: "Premium benefits",
    freePlan: "Free Plan",
    freePlanPrice: "$0",
    freePlanDesc: "Essential study tracking for every aspirant",
    premiumMonthly: "Premium Monthly",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/month",
    premiumYearly: "Premium Yearly",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/year",
    bestValueSave: "BEST VALUE – SAVE 33%",
    upgradeToPremiumBtn: "Upgrade to Premium",
    restorePurchases: "Restore Purchases",
    manageSubscription: "Manage Subscription",
    cancelSubscription: "Cancel Subscription",
    changePlan: "Change Plan",
    subscriptionActiveUntil: "Active until {date}",
    termsAndPrivacy: "Terms & Conditions • Privacy Policy",
    renewalInfo: "Auto-renews until cancelled. Cancel anytime in Google Play Store or account settings.",
    subscriptionExpiryWarning: "Your Premium subscription is expiring soon. Renew now to keep your unlimited benefits.",
    renewNow: "Renew Subscription",
    activePlanLabel: "Current Active Plan",
    freePlanActive: "Free Plan Active",
    premiumOfficerActive: "PREMIUM OFFICER ACTIVE",
    paymentConfirmation: "Payment Confirmation",
    orderSummary: "Order Summary",
    selectedPlan: "Selected Plan",
    billingCycle: "Billing Cycle",
    totalAmount: "Total Amount",
    paySecurely: "Pay Securely & Activate",
    welcomeToPremium: "🎉 Welcome to Abhyas Premium!",
    activationSuccessDesc: "Your subscription is now active. All premium features, AI mentorship, and advanced analytics have been unlocked.",
    startStudyingBtn: "Start Studying with Premium",
    cancelConfirmTitle: "Cancel Subscription?",
    cancelConfirmDesc: "You will continue to have Premium access until the end of your current billing period ({date}).",
    keepSubscription: "Keep My Subscription",
    confirmCancel: "Confirm Cancellation",
    purchasesRestored: "Purchases restored successfully. Your subscription is up to date.",
    featureUnlimitedHistory: "Unlimited study history",
    featureAdvancedAnalytics: "Advanced study analytics",
    featurePerformanceReports: "Weekly and monthly performance reports",
    featureCustomGoals: "Custom study goals",
    featureAdvancedPlanner: "Advanced planner and routines",
    featureAIAbhyasMitra: "AI Abhyas Mitra assistance",
    featureCloudSync: "Cloud backup and synchronization",
    featureAnnualReports: "Annual performance reports",
    featureProgressComparison: "Long-term progress comparison",
    featurePrioritySupport: "Priority support",
    featureExclusiveThemes: "Exclusive premium themes",
    proSubtitle: "Subscription passes, festive discounts & officer perks",
    proTitle: "Abhyas Pro",
    proBadge: "PRO",
    festiveOfferBadge: "FESTIVE SALE",
    festiveOfferTitle: "🎉 Festive Mega Sale! Up to 60% OFF",
    festiveOfferSubtitle: "Special Civil Services festive discount on 6-Month & Annual Passes",
    festiveCountdown: "⏳ Limited time festive offer ends in 48 hours",
    couponTitle: "Have a Festive Coupon Code?",
    couponPlaceholder: "Enter promo code (e.g. FESTIVE60)",
    applyCoupon: "Apply Code",
    couponSuccess: "Coupon applied successfully! Enjoy your discount.",
    couponInvalid: "Invalid coupon code. Try FESTIVE60 or OFFICER50.",
    couponRemove: "Remove",
    choosePlan: "Choose Your Civil Services Pass",
    choosePlanSub: "Structured guidance, unlimited AI mentorship & Mains evaluation",
    planStarterTitle: "Starter Booster",
    planStarterDuration: "1 Month Pass",
    planStarterDesc: "Targeted revision sprint, 50 AI mentor queries/day & topic checklist",
    planSixMonthTitle: "6-Month Mains & Prelims Pass",
    planSixMonthDuration: "6 Months Pass",
    planSixMonthDesc: "Comprehensive preparation, unlimited AI Abhyas Mitra & 30 mock tests",
    planAnnualTitle: "1-Year Ultimate Officer Pass",
    planAnnualDuration: "12 Months All-Access",
    planAnnualDesc: "Complete UPSC & MPSC coverage, unlimited Mains answers checked & VIP mentor support",
    popularBadge: "MOST POPULAR",
    bestValueBadge: "BEST VALUE",
    savePercent: "Save {percent}%",
    perMonth: "/mo",
    activePlan: "Current Status",
    proOfficerActive: "🌟 PRO OFFICER ACTIVE",
    freeAspirantTier: "Free Aspirant Tier",
    validUntil: "Valid until {date}",
    upgradeNow: "Upgrade to Officer Pass",
    subscribeTo: "Subscribe to {plan}",
    proPerksTitle: "Why Civil Services Aspirants Choose Pro",
    proPerksSub: "Supercharge your preparation with unfair advantages",
    featureComparisonTitle: "Free vs Pro Comparison",
    featureName: "Feature",
    featureFree: "Free Plan",
    featurePro: "Abhyas Pro",
    featureAIQueries: "AI Abhyas Mitra Mentor",
    featureAIQueriesFree: "5 queries / day",
    featureAIQueriesPro: "Unlimited 24/7 access",
    featureSyllabus: "UPSC & MPSC Syllabus Tracking",
    featureSyllabusFree: "Standard checklist",
    featureSyllabusPro: "Micro-topic heatmaps & smart revision",
    featureMainsEval: "GS Mains Answer Evaluation",
    featureMainsEvalFree: "Not included",
    featureMainsEvalPro: "Instant AI rubric & feedback",
    featurePYQBank: "Prelims PYQ Bank",
    featurePYQBankFree: "Past 3 years",
    featurePYQBankPro: "25+ Years solved with model answers",
    featureZenMode: "Zen Audio & Binaural Study Beats",
    featureZenModeFree: "Basic timer",
    featureZenModePro: "Full deep work library & offline audio",
    featureMentorHelp: "Mentor Helpdesk Priority",
    featureMentorHelpFree: "Standard 48h response",
    featureMentorHelpPro: "Priority VIP under 2 hours",
    featureOfflinePDF: "Offline Mindmaps & Revision PDFs",
    featureOfflinePDFFree: "Watermarked sample",
    featureOfflinePDFPro: "Full HD offline downloads",
    confirmCheckoutTitle: "Confirm Subscription",
    orderSummary: "Order Summary",
    originalPrice: "Original Price",
    festiveDiscount: "Festive Discount",
    couponDiscount: "Coupon Discount",
    totalPayable: "Total Payable",
    securePaymentNotice: "🔒 256-bit encrypted checkout. Instant activation.",
    confirmPay: "Pay & Activate Pro",
    paymentSimulatedSuccess: "🎉 Congratulations! You are now an Abhyas Pro Officer!",
    paymentSimulatedSub: "All Pro features, unlimited AI mentorship and Mains evaluation are now unlocked for your account.",
    startLearningPro: "Start Learning with Pro",
    cancel: "Cancel",
    paymentMethods: "Supported Payment Modes",
    paymentUpi: "Instant UPI (Google Pay, PhonePe, Paytm, BHIM)",
    paymentCards: "Debit / Credit Cards & Net Banking",
    activeUntil: "Expires on",
    festiveOffersHeading: "Festive Offers & Deals",
    faqHeading: "Frequently Asked Questions",
    faq1Q: "Does Pro cover both UPSC and MPSC?",
    faq1A: "Yes! Pro unlocks full syllabus tracking, question banks, and AI mentorship for both UPSC Civil Services and MPSC Rajyaseva / Combine examinations.",
    faq2Q: "How does AI Mains Answer Evaluation work?",
    faq2A: "Abhyas Mitra evaluates your handwritten or typed answers based on official UPSC/MPSC evaluation rubrics: intro-body-conclusion structure, constitutional articles, keywords, and practical recommendations.",
    faq3Q: "Can I study offline without an active internet connection?",
    faq3A: "Yes! All syllabus checklists, offline study timer logs, and downloaded PDF revision notes work 100% offline and sync seamlessly when you reconnect.",
    faq4Q: "What happens if I already have an active pass?",
    faq4A: "If you upgrade or extend your pass, your remaining validity is automatically added to the new subscription period.",
    settings: 'Settings',

    // Subtitles
    dashboardSubtitle: 'Daily progress, focus milestones and target breakdown',
    timerSubtitle: 'Deep focus study stopwatch & interval tracker',
    syllabusSubtitle: 'Interactive curriculum checklist, mastery tracking & offline hour logger',
    plannerSubtitle: 'Target scheduling, task execution & daily workload balance',
    analyticsSubtitle: 'Performance insights, subject breakdown & consistency charts',

    // General & Common Actions
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    done: 'Done',
    edit: 'Edit',
    delete: 'Delete',
    focus: 'Focus',
    viewAll: 'View All',
    all: 'All',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    day: 'Day',
    night: 'Night',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    status: 'Status',
    priority: 'Priority',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    completed: 'Completed',
    pending: 'Pending',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    toRevise: 'To Revise',
    mastered: 'Mastered',
    remaining: 'Remaining',
    mins: 'mins',
    minPlanned: 'mins planned',
    hours: 'hours',
    hoursPlanned: 'hours planned',
    tasks: 'tasks',
    task: 'task',
    signOut: 'Sign Out',
    confirmSignOut: 'Are you sure you want to sign out?',
    signedInAs: 'Signed in as',
    start: 'Start',
    active: 'Active',
    new: 'new',
    on: 'ON',
    off: 'OFF',
    set: 'Set',
    ok: 'OK',

    // Greetings & Header
    goodMorning: 'Good morning',
    goodEvening: 'Good evening',
    aspirant: 'Aspirant',

    // Settings Modal
    settingsTitle: 'Settings & Preferences',
    appLanguage: 'App Language',
    chooseLanguage: 'Select your preferred language for the whole app',
    appearance: 'Appearance & Theme',
    themeDescription: 'Choose light or dark mode for visual comfort',
    notificationsTitle: 'Notifications & Daily Alerts',
    notificationDesc: 'Manage daily study reminders and alerts',
    openNotificationsView: 'Open Routines & Alerts',
    enableBrowserAlerts: 'Enable Desktop Notifications',
    notificationsEnabled: 'Daily alerts are active',
    studyTargetGoal: 'Daily Study Goal',
    studyTargetDesc: 'Set your target daily study hours',
    primaryExam: 'Primary Exam Focus',
    primaryExamDesc: 'Select default syllabus view',
    allExams: 'All Exams (UPSC + MPSC)',
    upscOnly: 'UPSC Civil Services',
    mpscOnly: 'MPSC Maharashtra',
    soundAlerts: 'Timer Sound Alerts',
    soundAlertsDesc: 'Play sound tone on session completion',
    appInfo: 'About Abhyas Tracker',
    appVersion: 'Abhyas Tracker v1.2.0 • UPSC & MPSC Study Suite',

    // Dashboard
    dailyQuote: 'Consistency turns average effort into excellence.',
    todayStudyTime: "Today's Study Time",
    weeklyGoal: 'Weekly Goal (40h)',
    dailyStreak: 'Daily Streak',
    days: 'days',
    curriculumProgress: 'Curriculum Progress',
    overallCurriculum: 'Overall Curriculum Completion',
    upscMastery: 'UPSC Mastered',
    mpscMastery: 'MPSC Mastered',
    todayTasks: "Today's Scheduled Tasks",
    noTasksToday: 'No tasks scheduled for today.',
    noTasksTodayDesc: 'Starting your day with a defined target increases study efficiency.',
    addScheduledTask: '+ Add Scheduled Task',
    openTomorrowPlanner: "Open Tomorrow's Planner",
    autoPlanTomorrowBtn: "Auto-Plan Tomorrow's Blueprint",
    quickTimerStart: 'Start Focus Timer Now',
    recentStudySessions: 'Recent Study Sessions',
    noSessionsLogged: 'No sessions logged today yet. Hit the timer to start!',
    noSessionsLoggedYet: 'No sessions logged today yet. Ready to start your preparation?',
    openSyllabusBtn: 'Open Syllabus & Checklist →',
    startTimer: 'Start Timer',
    pauseTimer: 'Pause Timer',
    resumeTimer: 'Resume Timer',
    subjectBalanceAlert: 'Subject Balance Alert: Neglected Module',
    neglectedAlertIntro: "You haven't logged any study hours for",
    inTheLastDays: 'in the last {days}+ days.',
    highWeightageWarning: 'High-weightage qualifying / scoring module — regular hours prevent last-minute panic!',
    backlogWarning: 'Don’t let syllabus backlog accumulate before the exam!',
    otherLowHourSubjects: 'OTHER LOW-HOUR SUBJECTS:',
    focusOn: 'Focus on {subject}',
    addToPlanner: 'Add to Planner',
    quickActions: 'Quick Actions',
    focusTimer: 'Focus Timer',
    activeSession: 'Active Session',
    startSession: 'Start Session',
    studyPlan: 'Study Plan',
    schedule: 'Schedule',
    reports: 'Reports',
    attendance: 'Attendance',
    presentToday: 'Present today',
    dayStreak: '{streak}-Day streak',
    quiz: 'Quiz',
    comingSoon: 'Coming Soon',
    session: 'session',
    sessions: 'sessions',
    logged: 'logged',
    loggedToday: 'Logged Today',
    dailyGoal: 'Daily Goal',
    goalMet: 'Goal Met!',
    scheduleDailySyllabusDesc: "Schedule daily syllabus topics, plan tomorrow's revision in advance, and balance your weekly study hours.",
    expandAll: 'Expand All',
    collapse: 'Collapse',

    // Timer Screen
    studyTimer: 'Study Timer',
    studyStopwatch: 'Deep focus study stopwatch & interval tracker',
    trackStudySessions: 'Track your study sessions and stay consistent.',
    exitFocusMode: 'Exit Focus Mode',
    enterFocusMode: 'Enter Focus Mode',
    focusStyle: 'FOCUS STYLE',
    lightZen: 'Light Zen',
    deepZen: 'Deep Zen',
    stopwatchLightZenOnly: 'Stopwatch supports Light Zen only.',
    deepZenDesc: 'Deep Zen locks pause, reset, finish, and exit during an active countdown. It unlocks when the countdown finishes.',
    lightZenDesc: 'Light Zen lets you leave Focus Mode whenever you need.',
    pomodoro: 'Pomodoro',
    stopwatch: 'Stopwatch',
    custom: 'Custom',
    studySubject: 'STUDY SUBJECT',
    customDuration: 'CUSTOM DURATION',
    enterOwnTime: 'OR ENTER YOUR OWN TIME (MINUTES)',
    enterMinutesPlaceholder: 'Enter minutes (1 - 720)',
    currentTarget: 'Current Target',
    saveSession: 'Save Session',
    reset: 'Reset',
    saving: 'Saving...',
    finish: 'Finish',
    allSubjects: 'All Subjects',
    upsc: 'UPSC',
    mpsc: 'MPSC',
    runningFocus: 'Deep focus study session is running',
    pausedFocus: 'Session is paused',
    readyToFocus: 'Ready to focus',
    sessionFocusTopic: 'Session Focus Topic',
    whatAreYouStudying: 'What chapter or topic are you studying?',
    selectSubjectToTrack: 'Select Subject to Track',
    pomodoroIntervals: 'Pomodoro Interval Options',

    // Offline / Manual Study Logging
    manualOfflineLogging: 'Manual & Offline Study Logging',
    manualOfflineDesc: 'Log textbook readings, library sessions, and past study hours.',
    logOfflineBookStudy: 'Log Offline Book Study',
    logOfflineBookDesc: 'Includes past hours entry, textbooks, and library study',
    pastHoursEntry: 'Past Hours Entry',
    pastHoursDesc: 'Manual entry for past study sessions',
    targetExamSection: 'TARGET EXAM SECTION',
    selectSubject: 'SELECT SUBJECT',
    studyDate: 'STUDY DATE (DD/MM/YYYY)',
    specificDate: 'Specific Date',
    studyActivity: 'STUDY ACTIVITY',
    durationStudied: 'DURATION STUDIED (HOURS & MINUTES)',
    hoursHrs: 'Hours (Hrs)',
    minutesMins: 'Minutes (Mins)',
    theoryReading: 'Theory & Reading',
    pyqsMcqs: 'PYQs & MCQs',
    mainsWriting: 'Mains Answer Writing',
    currentAffairsActivity: 'Current Affairs',
    revision: 'Revision',
    saveStudyHours: 'Save Study Hours',

    // Syllabus Screen
    subjectsAndSyllabus: 'Subjects & Syllabus',
    curriculumChecklist: 'Interactive curriculum checklist, mastery tracking & offline log',
    logOfflineHours: '+ Log Hours',
    closeLogger: 'Close Logger',
    offlineLoggerTitle: 'Log Offline / Book Study Hours',
    offlineLoggerDesc: 'Read standard books (Laxmikanth, Spectrum, NCERT) or studied at library? Add hours directly.',
    examSection: 'Exam Syllabus Section',
    topicsChecklistTap: 'Topic Checklist (Tap status pill to update)',
    viewTopicInSyllabus: 'View in Syllabus →',
    redirectedFromTask: 'Redirected from Planner Task',
    jumpToTopic: 'Jump to Topic ↓',
    topicsMastered: 'topics mastered',
    spacedRepetitionQueue: 'Spaced Repetition Queue',
    neglectedModuleNotice: 'Curriculum Balance: Neglected Module',
    dueOn: 'Due',
    spent: 'Spent',
    revs: 'Revs',
    donePct: 'Done',
    plusOneRevise: '+1 Revise',
    logHours: 'Log Hours',
    revise: 'Revise',
    viewTopic: 'View Topic',

    // Planner Screen
    studyPlannerTitle: 'Study Planner',
    plannerTimeframe: 'Planning Timeframe',
    todaysPlan: "Today's Plan",
    tomorrowsPlan: "Tomorrow's Plan",
    weeklyView: 'Weekly View',
    workloadRoutine: 'Workload & Routine',
    examFilter: 'Exam Filter',
    allExamTasks: 'All Exam Tasks',
    upscPlans: 'UPSC Plans',
    mpscPlans: 'MPSC Plans',
    selectDay7: 'Select Day (Next 7 Days)',
    addStudyBlock: '+ Add Study Block',
    addStudyBlockDesc: 'Schedule dedicated focus intervals according to your MPSC or UPSC syllabus breakdown.',
    selectTargetSubject: 'Select Subject',
    quickPickUnfinished: 'Quick Pick Unfinished Syllabus Topic',
    topicOrChapterTitle: 'Topic or Chapter Title',
    topicTitlePlaceholder: 'e.g. Fundamental Rights (Article 14-18)',
    targetDurationMins: 'Target Duration (minutes)',
    scheduleStudyBlockBtn: '+ Schedule Study Block',
    advancePlanningRoutine: 'Advance Planning Routine',
    advancePlanningDesc: "Planning tomorrow's tasks tonight eliminates morning friction and provides strategic focus.",
    noTasksTomorrow: 'No tasks scheduled for tomorrow yet.',
    autoGenerateBlueprint: "Auto-Schedule Tomorrow's Core Topics",
    browseSyllabusToSchedule: 'Browse Syllabus Topics to Schedule',
    tomorrowsWorkloadTarget: "Tomorrow's Workload vs 8h Target",
    capacity: 'Capacity',
    weeklyGoalVs40h: 'Weekly 40h Goal',
    tasksForDay: 'Scheduled Tasks for',
    noTasksScheduledDate: 'No tasks scheduled for this date. Tap "+ Add Study Block" below to schedule.',
    workloadGauges: 'Workload Capacity Gauges',
    todaysStudyLoad: "Today's Study Load",

    // Analytics Screen
    studyAnalytics: 'Study Analytics',
    analyticsSubtitleMain: 'Understand your habits, track progress and build consistency',
    yourStudyOverview: 'Your study overview',
    sevenDays: '7 Days',
    thirtyDays: '30 Days',
    overview: 'Overview',
    activity: 'Activity',
    subjects: 'Subjects',
    sessionsTab: 'Sessions',
    todaysStudyGoal: "Today's Study Goal",
    buildHabitDesc: 'Build a daily habit, one focused session at a time.',
    studiedToday: 'studied today',
    dailyGoalReached: 'Daily goal reached!',
    remainingOf: 'remaining of',
    studyTime: 'Study Time',
    totalRecorded: 'Total recorded',
    completedRecords: 'Completed records',
    averageFocus: 'Average Focus',
    recordedFocusScore: 'Recorded focus score',
    avgSession: 'Avg. Session',
    perRecordedSession: 'Per recorded session',
    focusQuality: 'Focus Quality',
    avgFocusScoreDesc: 'Average focus score from recorded sessions.',
    dailyStudyActivity: 'Daily Study Activity',
    minutesStudiedWeek: 'Minutes studied each day this week',
    minutesStudiedMonth: 'Minutes studied across the selected month',
    activeDays: 'Active days',
    studyConsistency: 'Study Consistency',
    heatmapDesc: 'Each square represents one day. Stronger color means more study time.',
    daysWithoutStudy: 'days without study',
    subjectBreakdown: 'Subject Breakdown',
    subjectBreakdownDesc: 'See how your study time is distributed across subjects.',
    noSubjectStudyTime: 'No subject study time recorded for this period.',
    analyticsTitle: 'Study Analytics & Performance',
    totalStudyTime: 'Total Study Time',
    weeklyAvg: 'Weekly Average',
    completionRate: 'Completion Rate',
    subjectDistribution: 'Subject Distribution',
    last7DaysTrend: 'Daily Study Trend (Last 7 Days)',
    hoursPerDay: 'hours / day',
    noAnalyticsData: 'Log study sessions to unlock personal preparation analytics.',
    topicNoteOptional: 'CHAPTER / TOPIC NOTE (OPTIONAL)',
    topicNotePlaceholder: 'e.g. Fundamental Rights Article 19-22 notes & questions',
    resetSessionPrompt: 'Reset study session?',
    resetSessionDesc: 'Your current unsaved study time will be discarded.',
    exitFocusModePrompt: 'Exit Focus Mode?',
    exitFocusModeDesc: 'Are you sure you want to leave Focus Mode and return to normal navigation?',
    stayFocused: 'Stay Focused',
    exitFocusMode: 'Exit Focus Mode',
    studyStreak: 'Study Streak',
    currentStreak: 'Current Streak',
    streakDescription: 'Consistency is the foundation of civil services success. Complete a study session every day to keep your streak burning!',
    days: 'Days',
    autoPlanFullWeek: 'Auto-Plan Full Week',
    entireWeek: 'Entire Week (All 7 Days)',
    singleDayFocus: 'Single Day Focus',
    weeklyScheduleView: 'WEEKLY SCHEDULE VIEW',
    noTasksForDay: 'No tasks scheduled for this day',
    addTask: '+ Add Task',
    autoPlanThisDay: 'Auto-Plan This Day',
    workloadCapacityGauges: 'Workload Capacity Gauges',
    todaysStudyLoad: "Today's Study Load",
    weeklyCumulativeLoad: 'Weekly Cumulative Load',
    plannedAcross7Days: 'planned across 7 days',
    examSyllabusAllocation: 'Exam Syllabus Allocation',
    subjectWiseAllocation: 'Subject-Wise Time Allocation',
    noSubjectHoursPlanned: 'No subject hours planned yet. Add study tasks to see subject distribution.',
    targetExam: 'TARGET EXAM',
    selectExamSubject: 'SELECT {exam} SUBJECT',
    saveHoursPrefix: 'Save',
    hoursShort: 'h',
    minsShort: 'm',
    subtopics: 'subtopics',
    recentStudySessions: 'Recent Study Sessions This Week (Past Days)',
    startLiveTimer: 'Start Live Timer',
    logPastHours: 'Log Past Hours',
    myProfile: 'My Profile',
    studentAccount: 'Student Account',
    aspirantSubtitle: 'MPSC / UPSC Aspirant',
    studyOverview: 'Study Overview',
    dailyStudyGoal: 'Daily Study Goal',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    mobileNumber: 'Mobile Number',
    examTarget: 'Exam Target',
    preferredSubjects: 'Preferred Subjects',
    preferences: 'Preferences',
    studyReminders: 'Study Reminders',
    setDailyReminderDesc: 'Set your daily study reminder',
    privacyAndAccount: 'Privacy & Account',
    manageAccountSettings: 'Manage your account settings',
    saveChanges: 'Save Changes',
    savingChanges: 'Saving...',
    editProfile: 'Edit Profile',
    signOutPrompt: 'Sign Out?',
    signOutConfirmDesc: 'Are you sure you want to sign out of Abhyas?',
    yesSignOut: 'Yes, Sign Out',
    yourPrepYourProgress: 'Your preparation, your progress.',
    buildConsistentRoutine: 'Build a consistent routine',
    reminderHeroDesc: 'Choose a daily reminder time to help you stay on track with your study goals.',
    dailyStudyReminder: 'Daily study reminder',
    reminderEnabled: 'Reminder preference is enabled',
    reminderDisabled: 'Reminder preference is disabled',
    reminderTime: 'Reminder time',
    selectPreferredTime: 'Select your preferred time.',
    reminderDeviceNote: 'These preferences are saved on this device.',
    announcements: 'Announcements',
    allAnnouncements: '← All announcements',
    backToApp: '← Back to app',
    announcementDetails: 'Announcement Details',
    completeAnnouncementInfo: 'Complete announcement information',
    announcementsAndStatus: 'Announcements and read status',
    readStatus: 'READ',
    unreadStatus: 'UNREAD',
    noAnnouncementsYet: 'No announcements yet',
    announcementCol: 'ANNOUNCEMENT',
    dateCol: 'DATE',
    statusCol: 'STATUS',
    actionCol: 'ACTION',
    viewAction: 'View',
    studentHelpDesk: 'Student Help Desk',
    helpDeskSubtitle: 'Dedicated student assistance, bug reports & feature requests',
    createTicket: 'Create Ticket',
    viewMyTickets: 'View My Tickets',
    appName: 'Abhyas Tracker',
    examFocusTag: 'UPSC & MPSC',
    examYearBadge: 'UPSC / MPSC {year}',
    selectDayNext7: 'SELECT DAY (NEXT 7 DAYS)',
    ofHours: 'of {h}h',
    capacityPercentOf: '{pct}% of {hours}',
    studyBlock: 'Block',
    recentSessions: 'Recent Sessions',
    recentSessionsDesc: 'Your latest recorded study sessions in this period.',
    noSessionsRecorded: 'No sessions recorded during this period.',
    studySession: 'Study Session',
    dateUnavailable: 'Date unavailable',
    latestCount: 'Latest {count}',
    totalStudied: 'Total studied',
    totalSessions: 'Total sessions',
    leadingSubject: 'Leading subject',
    subjectDetails: 'Subject details',
    basedOnSessions: 'Based on {count} recorded {sessions} in this period.',
    completeSessionToTrack: 'Complete a study session to begin tracking focus quality.'
  },

  // ==================== HINDI (हिन्दी) ====================
  hi: {
    // Navigation & Tabs
    dashboard: 'डैशबोर्ड',
    timer: 'टाइमर',
    syllabus: 'पाठ्यक्रम',
    planner: 'योजना',
    analytics: 'विश्लेषण',
    ticketSupport: 'सहायता टिकट',
    pro: "प्रो",
    premium: "प्रीमियम",
    upgradeToPremium: "अभ्यास प्रीमियम मध्ये अपग्रेड करा",
    premiumSubtitle: "स्मार्ट अभ्यास करा. उत्तम ट्रॅक करा. ध्येय साध्य करा.",
    premiumBenefits: "प्रीमियम विशेष फायदे",
    freePlan: "मोफत प्लॅन",
    freePlanPrice: "$0",
    freePlanDesc: "प्रत्येक विद्यार्थ्यासाठी मूलभूत अभ्यास ट्रॅकिंग",
    premiumMonthly: "प्रीमियम मासिक",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/महिना",
    premiumYearly: "प्रीमियम वार्षिक",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/वर्ष",
    bestValueSave: "सर्वोत्कृष्ट मूल्य – ३३% बचत",
    upgradeToPremiumBtn: "प्रीमियम मध्ये अपग्रेड करा",
    restorePurchases: "खरेदी पूर्ववत करा (Restore)",
    manageSubscription: "सबस्क्रिप्शन व्यवस्थापन",
    cancelSubscription: "सबस्क्रिप्शन रद्द करा",
    changePlan: "प्लॅन बदला",
    subscriptionActiveUntil: "{date} पर्यंत सक्रिय",
    termsAndPrivacy: "नियम व अटी • गोपनीयता धोरण",
    renewalInfo: "स्वयंचलित नूतनीकरण. तुम्ही कधीही गुगल प्ले स्टोअर किंवा सेटिंग्जमधून रद्द करू शकता.",
    subscriptionExpiryWarning: "तुमचे प्रीमियम सबस्क्रिप्शन लवकरच संपत आहे. अखंडित फायद्यांसाठी आत्ताच नूतनीकरण करा.",
    renewNow: "सबस्क्रिप्शन नूतनीकरण करा",
    activePlanLabel: "सध्याचा सक्रिय प्लॅन",
    freePlanActive: "मोफत प्लॅन सक्रिय",
    premiumOfficerActive: "प्रीमियम अधिकारी सक्रिय",
    paymentConfirmation: "पेमेंट पुष्टीकरण",
    orderSummary: "ऑर्डर सारांश",
    selectedPlan: "निवडलेला प्लॅन",
    billingCycle: "बिलिंग कालावधी",
    totalAmount: "एकूण देय रक्कम",
    paySecurely: "सुरक्षित पेमेंट करा व सक्रिय करा",
    welcomeToPremium: "🎉 अभ्यास प्रीमियम मध्ये आपले स्वागत आहे!",
    activationSuccessDesc: "आपले सबस्क्रिप्शन आता सक्रिय झाले आहे. सर्व प्रीमियम सुविधा, AI मार्गदर्शन आणि प्रगत विश्लेषण आपल्यासाठी खुले झाले आहे.",
    startStudyingBtn: "प्रीमियम सह अभ्यास सुरू करा",
    cancelConfirmTitle: "सबस्क्रिप्शन रद्द करायचे आहे का?",
    cancelConfirmDesc: "आपल्या चालू बिलिंग कालावधीच्या समाप्तीपर्यंत ({date}) आपल्याकडे प्रीमियम सुविधा चालू राहतील.",
    keepSubscription: "सबस्क्रिप्शन सुरू ठेवा",
    confirmCancel: "रद्द करण्याची पुष्टी करा",
    purchasesRestored: "खरेदी यशस्वीरित्या पूर्ववत केली गेली. आपले सबस्क्रिप्शन अद्ययावत आहे.",
    featureUnlimitedHistory: "अमर्याद अभ्यास इतिहास",
    featureAdvancedAnalytics: "प्रगत अभ्यास विश्लेषण",
    featurePerformanceReports: "साप्ताहिक आणि मासिक कामगिरी अहवाल",
    featureCustomGoals: "स्वतःचे अभ्यास ध्येय निश्चिती",
    featureAdvancedPlanner: "प्रगत नियोजक व वेळापत्रक",
    featureAIAbhyasMitra: "AI अभ्यास मित्र मार्गदर्शन",
    featureCloudSync: "क्लाउड बॅकअप व सिंक्रोनायझेशन",
    featureAnnualReports: "वार्षिक कामगिरी अहवाल",
    featureProgressComparison: "दीर्घकालीन प्रगती तुलना",
    featurePrioritySupport: "प्राधान्य मदत व मार्गदर्शन",
    featureExclusiveThemes: "विशेष प्रीमियम थीम्स",
    premium: "प्रीमियम",
    upgradeToPremium: "अभ्यास प्रीमियम में अपग्रेड करें",
    premiumSubtitle: "स्मार्ट अध्ययन करें। बेहतर ट्रैक करें। लक्ष्य प्राप्त करें।",
    premiumBenefits: "प्रीमियम के लाभ",
    freePlan: "फ्री प्लान",
    freePlanPrice: "$0",
    freePlanDesc: "हर अभ्यर्थी के लिए आवश्यक अध्ययन ट्रैकिंग",
    premiumMonthly: "प्रीमियम मासिक",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/माह",
    premiumYearly: "प्रीमियम वार्षिक",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/वर्ष",
    bestValueSave: "सर्वोत्तम मूल्य – 33% बचत",
    upgradeToPremiumBtn: "प्रीमियम में अपग्रेड करें",
    restorePurchases: "खरीदारी पुनर्स्थापित करें (Restore)",
    manageSubscription: "सबस्क्रिप्शन प्रबंधित करें",
    cancelSubscription: "सबस्क्रिप्शन रद्द करें",
    changePlan: "प्लान बदलें",
    subscriptionActiveUntil: "{date} तक सक्रिय",
    termsAndPrivacy: "नियम और शर्तें • गोपनीयता नीति",
    renewalInfo: "स्वतः नवीनीकरण। आप कभी भी Google Play Store या सेटिंग्स से रद्द कर सकते हैं।",
    subscriptionExpiryWarning: "आपका प्रीमियम सबस्क्रिप्शन जल्द ही समाप्त हो रहा है। लाभ जारी रखने के लिए अभी नवीनीकरण करें।",
    renewNow: "सबस्क्रिप्शन नवीनीकृत करें",
    activePlanLabel: "वर्तमान सक्रिय प्लान",
    freePlanActive: "फ्री प्लान सक्रिय",
    premiumOfficerActive: "प्रीमियम ऑफिसर सक्रिय",
    paymentConfirmation: "भुगतान की पुष्टि",
    orderSummary: "ऑर्डर सारांश",
    selectedPlan: "चयनित प्लान",
    billingCycle: "बिलिंग चक्र",
    totalAmount: "कुल देय राशि",
    paySecurely: "सुरक्षित भुगतान करें और सक्रिय करें",
    welcomeToPremium: "🎉 अभ्यास प्रीमियम में आपका स्वागत है!",
    activationSuccessDesc: "आपका सबस्क्रिप्शन अब सक्रिय है। सभी प्रीमियम सुविधाएं, AI मार्गदर्शन और उन्नत विश्लेषण अनलॉक हो गए हैं।",
    startStudyingBtn: "प्रीमियम के साथ अध्ययन शुरू करें",
    cancelConfirmTitle: "सबस्क्रिप्शन रद्द करें?",
    cancelConfirmDesc: "आपकी वर्तमान बिलिंग अवधि ({date}) समाप्त होने तक आपकी प्रीमियम पहुंच जारी रहेगी।",
    keepSubscription: "सबस्क्रिप्शन जारी रखें",
    confirmCancel: "रद्द करने की पुष्टि करें",
    purchasesRestored: "खरीदारी सफलतापूर्वक पुनर्स्थापित की गई। आपका सबस्क्रिप्शन अद्यतित है।",
    featureUnlimitedHistory: "असीमित अध्ययन इतिहास",
    featureAdvancedAnalytics: "उन्नत अध्ययन विश्लेषण",
    featurePerformanceReports: "साप्ताहिक और मासिक प्रगति रिपोर्ट",
    featureCustomGoals: "कस्टम अध्ययन लक्ष्य",
    featureAdvancedPlanner: "उन्नत प्लानर और दिनचर्या",
    featureAIAbhyasMitra: "AI अभ्यास मित्र सहायता",
    featureCloudSync: "क्लाउड बैकअप और सिंक",
    featureAnnualReports: "वार्षिक प्रगति रिपोर्ट",
    featureProgressComparison: "दीर्घकालिक प्रगति तुलना",
    featurePrioritySupport: "प्राथमिकता सहायता",
    featureExclusiveThemes: "विशेष प्रीमियम थीम्स",
    premium: "प्रीमियम",
    upgradeToPremium: "अभ्यास प्रीमियम मध्ये अपग्रेड करा",
    premiumSubtitle: "स्मार्ट अभ्यास करा. उत्तम ट्रॅक करा. ध्येय साध्य करा.",
    premiumBenefits: "प्रीमियम विशेष फायदे",
    freePlan: "मोफत प्लॅन",
    freePlanPrice: "$0",
    freePlanDesc: "प्रत्येक विद्यार्थ्यासाठी मूलभूत अभ्यास ट्रॅकिंग",
    premiumMonthly: "प्रीमियम मासिक",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/महिना",
    premiumYearly: "प्रीमियम वार्षिक",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/वर्ष",
    bestValueSave: "सर्वोत्कृष्ट मूल्य – ३३% बचत",
    upgradeToPremiumBtn: "प्रीमियम मध्ये अपग्रेड करा",
    restorePurchases: "खरेदी पूर्ववत करा (Restore)",
    manageSubscription: "सबस्क्रिप्शन व्यवस्थापन",
    cancelSubscription: "सबस्क्रिप्शन रद्द करा",
    changePlan: "प्लॅन बदला",
    subscriptionActiveUntil: "{date} पर्यंत सक्रिय",
    termsAndPrivacy: "नियम व अटी • गोपनीयता धोरण",
    renewalInfo: "स्वयंचलित नूतनीकरण. तुम्ही कधीही गुगल प्ले स्टोअर किंवा सेटिंग्जमधून रद्द करू शकता.",
    subscriptionExpiryWarning: "तुमचे प्रीमियम सबस्क्रिप्शन लवकरच संपत आहे. अखंडित फायद्यांसाठी आत्ताच नूतनीकरण करा.",
    renewNow: "सबस्क्रिप्शन नूतनीकरण करा",
    activePlanLabel: "सध्याचा सक्रिय प्लॅन",
    freePlanActive: "मोफत प्लॅन सक्रिय",
    premiumOfficerActive: "प्रीमियम अधिकारी सक्रिय",
    paymentConfirmation: "पेमेंट पुष्टीकरण",
    orderSummary: "ऑर्डर सारांश",
    selectedPlan: "निवडलेला प्लॅन",
    billingCycle: "बिलिंग कालावधी",
    totalAmount: "एकूण देय रक्कम",
    paySecurely: "सुरक्षित पेमेंट करा व सक्रिय करा",
    welcomeToPremium: "🎉 अभ्यास प्रीमियम मध्ये आपले स्वागत आहे!",
    activationSuccessDesc: "आपले सबस्क्रिप्शन आता सक्रिय झाले आहे. सर्व प्रीमियम सुविधा, AI मार्गदर्शन आणि प्रगत विश्लेषण आपल्यासाठी खुले झाले आहे.",
    startStudyingBtn: "प्रीमियम सह अभ्यास सुरू करा",
    cancelConfirmTitle: "सबस्क्रिप्शन रद्द करायचे आहे का?",
    cancelConfirmDesc: "आपल्या चालू बिलिंग कालावधीच्या समाप्तीपर्यंत ({date}) आपल्याकडे प्रीमियम सुविधा चालू राहतील.",
    keepSubscription: "सबस्क्रिप्शन सुरू ठेवा",
    confirmCancel: "रद्द करण्याची पुष्टी करा",
    purchasesRestored: "खरेदी यशस्वीरित्या पूर्ववत केली गेली. आपले सबस्क्रिप्शन अद्ययावत आहे.",
    featureUnlimitedHistory: "अमर्याद अभ्यास इतिहास",
    featureAdvancedAnalytics: "प्रगत अभ्यास विश्लेषण",
    featurePerformanceReports: "साप्ताहिक आणि मासिक कामगिरी अहवाल",
    featureCustomGoals: "स्वतःचे अभ्यास ध्येय निश्चिती",
    featureAdvancedPlanner: "प्रगत नियोजक व वेळापत्रक",
    featureAIAbhyasMitra: "AI अभ्यास मित्र मार्गदर्शन",
    featureCloudSync: "क्लाउड बॅकअप व सिंक्रोनायझेशन",
    featureAnnualReports: "वार्षिक कामगिरी अहवाल",
    featureProgressComparison: "दीर्घकालीन प्रगती तुलना",
    featurePrioritySupport: "प्राधान्य मदत व मार्गदर्शन",
    featureExclusiveThemes: "विशेष प्रीमियम थीम्स",
    premium: "प्रीमियम",
    upgradeToPremium: "अभ्यास प्रीमियम में अपग्रेड करें",
    premiumSubtitle: "स्मार्ट अध्ययन करें। बेहतर ट्रैक करें। लक्ष्य प्राप्त करें।",
    premiumBenefits: "प्रीमियम के लाभ",
    freePlan: "फ्री प्लान",
    freePlanPrice: "$0",
    freePlanDesc: "हर अभ्यर्थी के लिए आवश्यक अध्ययन ट्रैकिंग",
    premiumMonthly: "प्रीमियम मासिक",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/माह",
    premiumYearly: "प्रीमियम वार्षिक",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/वर्ष",
    bestValueSave: "सर्वोत्तम मूल्य – 33% बचत",
    upgradeToPremiumBtn: "प्रीमियम में अपग्रेड करें",
    restorePurchases: "खरीदारी पुनर्स्थापित करें (Restore)",
    manageSubscription: "सबस्क्रिप्शन प्रबंधित करें",
    cancelSubscription: "सबस्क्रिप्शन रद्द करें",
    changePlan: "प्लान बदलें",
    subscriptionActiveUntil: "{date} तक सक्रिय",
    termsAndPrivacy: "नियम और शर्तें • गोपनीयता नीति",
    renewalInfo: "स्वतः नवीनीकरण। आप कभी भी Google Play Store या सेटिंग्स से रद्द कर सकते हैं।",
    subscriptionExpiryWarning: "आपका प्रीमियम सबस्क्रिप्शन जल्द ही समाप्त हो रहा है। लाभ जारी रखने के लिए अभी नवीनीकरण करें।",
    renewNow: "सबस्क्रिप्शन नवीनीकृत करें",
    activePlanLabel: "वर्तमान सक्रिय प्लान",
    freePlanActive: "फ्री प्लान सक्रिय",
    premiumOfficerActive: "प्रीमियम ऑफिसर सक्रिय",
    paymentConfirmation: "भुगतान की पुष्टि",
    orderSummary: "ऑर्डर सारांश",
    selectedPlan: "चयनित प्लान",
    billingCycle: "बिलिंग चक्र",
    totalAmount: "कुल देय राशि",
    paySecurely: "सुरक्षित भुगतान करें और सक्रिय करें",
    welcomeToPremium: "🎉 अभ्यास प्रीमियम में आपका स्वागत है!",
    activationSuccessDesc: "आपका सबस्क्रिप्शन अब सक्रिय है। सभी प्रीमियम सुविधाएं, AI मार्गदर्शन और उन्नत विश्लेषण अनलॉक हो गए हैं।",
    startStudyingBtn: "प्रीमियम के साथ अध्ययन शुरू करें",
    cancelConfirmTitle: "सबस्क्रिप्शन रद्द करें?",
    cancelConfirmDesc: "आपकी वर्तमान बिलिंग अवधि ({date}) समाप्त होने तक आपकी प्रीमियम पहुंच जारी रहेगी।",
    keepSubscription: "सबस्क्रिप्शन जारी रखें",
    confirmCancel: "रद्द करने की पुष्टि करें",
    purchasesRestored: "खरीदारी सफलतापूर्वक पुनर्स्थापित की गई। आपका सबस्क्रिप्शन अद्यतित है।",
    featureUnlimitedHistory: "असीमित अध्ययन इतिहास",
    featureAdvancedAnalytics: "उन्नत अध्ययन विश्लेषण",
    featurePerformanceReports: "साप्ताहिक और मासिक प्रगति रिपोर्ट",
    featureCustomGoals: "कस्टम अध्ययन लक्ष्य",
    featureAdvancedPlanner: "उन्नत प्लानर और दिनचर्या",
    featureAIAbhyasMitra: "AI अभ्यास मित्र सहायता",
    featureCloudSync: "क्लाउड बैकअप और सिंक",
    featureAnnualReports: "वार्षिक प्रगति रिपोर्ट",
    featureProgressComparison: "दीर्घकालिक प्रगति तुलना",
    featurePrioritySupport: "प्राथमिकता सहायता",
    featureExclusiveThemes: "विशेष प्रीमियम थीम्स",
    proSubtitle: "सबस्क्रिप्शन पास, फेस्टिव ऑफर्स और ऑफिसर सुविधाएं",
    proTitle: "अभ्यास प्रो",
    proBadge: "प्रो",
    festiveOfferBadge: "फेस्टिव सेल",
    festiveOfferTitle: "🎉 महा फेस्टिव सेल! 60% तक की भारी छूट",
    festiveOfferSubtitle: "यूपीएससी व एमपीएससी 6-महीने और वार्षिक पास पर विशेष छूट",
    festiveCountdown: "⏳ सीमित समय ऑफर - अगले 48 घंटों में समाप्त होगा",
    couponTitle: "क्या आपके पास फेस्टिव कूपन कोड है?",
    couponPlaceholder: "प्रोमो कोड दर्ज करें (उदा. FESTIVE60)",
    applyCoupon: "कूपन लागू करें",
    couponSuccess: "कूपन सफलतापूर्वक लागू हुआ! छूट का लाभ उठाएं।",
    couponInvalid: "अमान्य कूपन कोड। FESTIVE60 या OFFICER50 आज़माएँ।",
    couponRemove: "हटाएं",
    choosePlan: "अपना सिविल सेवा पास चुनें",
    choosePlanSub: "व्यवस्थित अध्ययन, असीमित AI मार्गदर्शन और मुख्य उत्तर मूल्यांकन",
    planStarterTitle: "स्टार्टर बूस्टर",
    planStarterDuration: "1 महीना पास",
    planStarterDesc: "सटीक रिवीजन स्प्रिंट, 50 AI मेंटर प्रश्न/दिन और विषय ट्रैकर",
    planSixMonthTitle: "6-महीने मेन्स और प्रीलिम्स पास",
    planSixMonthDuration: "6 महीने पास",
    planSixMonthDesc: "विस्तृत तैयारी, असीमित AI अभ्यास मित्र और 30 मॉक टेस्ट",
    planAnnualTitle: "1-वर्ष अल्टीमेट ऑफिसर पास",
    planAnnualDuration: "12 महीने ऑल-एक्सेस",
    planAnnualDesc: "संपूर्ण यूपीएससी व एमपीएससी तैयारी, असीमित मुख्य उत्तर जांच और वीआईपी सहायता",
    popularBadge: "सर्वाधिक लोकप्रिय",
    bestValueBadge: "सर्वोत्तम मूल्य",
    savePercent: "{percent}% बचत",
    perMonth: "/माह",
    activePlan: "वर्तमान स्थिति",
    proOfficerActive: "🌟 प्रो ऑफिसर सक्रिय",
    freeAspirantTier: "निःशुल्क एस्पिरेंट",
    validUntil: "{date} तक वैध",
    upgradeNow: "ऑफिसर पास में अपग्रेड करें",
    subscribeTo: "{plan} सब्सक्राइब करें",
    proPerksTitle: "सिविल सेवा अभ्यर्थी प्रो क्यों चुनते हैं?",
    proPerksSub: "अपनी तैयारी को दें सशक्त और सटीक दिशा",
    featureComparisonTitle: "निःशुल्क बनाम प्रो तुलना",
    featureName: "सुविधा",
    featureFree: "निःशुल्क",
    featurePro: "अभ्यास प्रो",
    featureAIQueries: "AI अभ्यास मित्र मेंटर",
    featureAIQueriesFree: "5 प्रश्न / दिन",
    featureAIQueriesPro: "असीमित 24/7 पहुंच",
    featureSyllabus: "यूपीएससी व एमपीएससी पाठ्यक्रम ट्रैकिंग",
    featureSyllabusFree: "मानक चेकलिस्ट",
    featureSyllabusPro: "माइक्रो-टॉपिक हीटमैप और स्मार्ट रिवीजन",
    featureMainsEval: "जीएस मुख्य परीक्षा उत्तर मूल्यांकन",
    featureMainsEvalFree: "शामिल नहीं",
    featureMainsEvalPro: "त्वरित AI रूब्रिक और सुधार सुझाव",
    featurePYQBank: "प्रीलिम्स PYQ बैंक",
    featurePYQBankFree: "पिछले 3 वर्ष",
    featurePYQBankPro: "25+ वर्ष हल किए गए मॉडल उत्तर",
    featureZenMode: "ज़ेन ऑडियो और बाइनॉरल स्टडी बीट्स",
    featureZenModeFree: "मूल टाइमर",
    featureZenModePro: "पूरी डीप वर्क लाइब्रेरी और ऑफलाइन ऑडियो",
    featureMentorHelp: "मेंटर हेल्पडेस्क प्राथमिकता",
    featureMentorHelpFree: "मानक 48 घंटे",
    featureMentorHelpPro: "प्राथमिकता वीआईपी 2 घंटे के भीतर",
    featureOfflinePDF: "ऑफलाइन माइंडमैप और रिवीजन पीडीएफ",
    featureOfflinePDFFree: "वाटरमार्क नमूना",
    featureOfflinePDFPro: "पूर्ण एचडी ऑफलाइन डाउनलोड",
    confirmCheckoutTitle: "सबस्क्रिप्शन पुष्टि करें",
    orderSummary: "ऑर्डर सारांश",
    originalPrice: "मूल मूल्य",
    festiveDiscount: "फेस्टिव छूट",
    couponDiscount: "कूपन छूट",
    totalPayable: "कुल देय राशि",
    securePaymentNotice: "🔒 256-बिट सुरक्षित भुगतान। तत्काल सक्रियण।",
    confirmPay: "भुगतान करें और प्रो सक्रिय करें",
    paymentSimulatedSuccess: "🎉 बधाई हो! आप अब एक अभ्यास प्रो ऑफिसर हैं!",
    paymentSimulatedSub: "सभी प्रो सुविधाएं, असीमित AI मार्गदर्शन और मुख्य उत्तर मूल्यांकन आपके खाते में सक्रिय हो गए हैं।",
    startLearningPro: "अभ्यास प्रो के साथ शुरू करें",
    cancel: "रद्द करें",
    paymentMethods: "समर्थित भुगतान माध्यम",
    paymentUpi: "तत्काल यूपीआई (Google Pay, PhonePe, Paytm, BHIM)",
    paymentCards: "डेबिट/क्रेडिट कार्ड व नेट बैंकिंग",
    activeUntil: "समाप्ति तिथि",
    festiveOffersHeading: "फेस्टिव ऑफर्स और डील्स",
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    faq1Q: "क्या प्रो यूपीएससी और एमपीएससी दोनों को कवर करता है?",
    faq1A: "हाँ! प्रो यूपीएससी सिविल सेवा और एमपीएससी राज्यसेवा/कंबाइन दोनों के लिए संपूर्ण पाठ्यक्रम ट्रैकिंग, प्रश्न बैंक और AI मेंटरशिप प्रदान करता है।",
    faq2Q: "AI मेन्स उत्तर मूल्यांकन कैसे काम करता है?",
    faq2A: "अभ्यास मित्र आपके उत्तरों का आधिकारिक यूपीएससी/एमपीएससी मानकों के आधार पर मूल्यांकन करता है।",
    faq3Q: "क्या मैं बिना इंटरनेट के ऑफलाइन पढ़ सकता हूँ?",
    faq3A: "हाँ! सभी चेकलिस्ट, ऑफलाइन टाइमर लॉग और डाउनलोड किए गए रिवीजन पीडीएफ 100% ऑफलाइन काम करते हैं।",
    faq4Q: "यदि मेरे पास पहले से ही कोई पास है तो क्या होगा?",
    faq4A: "यदि आप अपग्रेड या रिन्यू करते हैं, तो आपकी शेष वैधता नए पास में स्वतः जोड़ दी जाती है।",
    settings: 'सेटिंग्स',

    // Subtitles
    dashboardSubtitle: 'दैनिक प्रगति, लक्ष्य निर्धारण और अध्ययन संतुलन',
    timerSubtitle: 'गहन अध्ययन स्टॉपवॉच और फोकस ट्रैकर',
    syllabusSubtitle: 'इंटरएक्टिव पाठ्यक्रम चेकलिस्ट, महारत ट्रैकिंग और ऑफलाइन घंटे लॉग',
    plannerSubtitle: 'अध्ययन समय सारणी, कार्य निष्पादन और दैनिक कार्यभार',
    analyticsSubtitle: 'प्रगति मेट्रिक्स, विषयवार विश्लेषण और निरंतरता ग्राफ',

    // General & Common Actions
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    done: 'संपन्न',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    focus: 'फोकस',
    viewAll: 'सभी देखें',
    all: 'सभी',
    today: 'आज',
    tomorrow: 'कल',
    yesterday: 'बीता कल',
    day: 'दिन',
    night: 'रात',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    status: 'स्थिति',
    priority: 'प्राथमिकता',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'निम्न',
    completed: 'पूर्ण',
    pending: 'लंबित',
    inProgress: 'प्रगति पर',
    notStarted: 'शुरू नहीं हुआ',
    toRevise: 'पुनरावृत्ति बाकी',
    mastered: 'कंठस्थ / पूर्ण',
    remaining: 'शेष',
    mins: 'मिनट',
    minPlanned: 'मिनट नियोजित',
    hours: 'घंटे',
    hoursPlanned: 'घंटे नियोजित',
    tasks: 'कार्य',
    task: 'कार्य',
    signOut: 'साइन आउट',
    confirmSignOut: 'क्या आप निश्चित रूप से साइन आउट करना चाहते हैं?',
    signedInAs: 'लॉगिन नाम',
    start: 'शुरू करें',
    active: 'सक्रिय',
    new: 'नई',
    on: 'चालू',
    off: 'बंद',
    set: 'सेट करें',
    ok: 'ठीक है',

    // Greetings & Header
    goodMorning: 'सुप्रभात',
    goodEvening: 'शुभ संध्या',
    aspirant: 'अभ्यर्थी',

    // Settings Modal
    settingsTitle: 'सेटिंग्स और प्राथमिकताएं',
    appLanguage: 'ऐप की भाषा',
    chooseLanguage: 'पूरे ऐप के लिए अपनी पसंदीदा भाषा चुनें',
    appearance: 'दिखावट और थीम',
    themeDescription: 'आंखों के आराम के लिए लाइट या डार्क मोड चुनें',
    notificationsTitle: 'सूचनाएं और दैनिक अलर्ट',
    notificationDesc: 'दैनिक अध्ययन दिनचर्या और अलर्ट प्रबंधित करें',
    openNotificationsView: 'दिनचर्या और अलर्ट खोलें',
    enableBrowserAlerts: 'डेस्कटॉप सूचनाएं सक्षम करें',
    notificationsEnabled: 'दैनिक अलर्ट सक्रिय हैं',
    studyTargetGoal: 'दैनिक अध्ययन लक्ष्य',
    studyTargetDesc: 'अपना दैनिक अध्ययन लक्ष्य निर्धारित करें',
    primaryExam: 'प्राथमिक परीक्षा फोकस',
    primaryExamDesc: 'डिफ़ॉल्ट पाठ्यक्रम दृश्य चुनें',
    allExams: 'सभी परीक्षाएं (यूपीएससी + एमपीएससी)',
    upscOnly: 'यूपीएससी सिविल सेवा',
    mpscOnly: 'एमपीएससी महाराष्ट्र',
    soundAlerts: 'टाइमर ध्वनि अलर्ट',
    soundAlertsDesc: 'टाइमर पूरा होने पर बीप बजाएं',
    appInfo: 'अभ्यास ट्रैकर के बारे में',
    appVersion: 'अभ्यास ट्रैकर v1.2.0 • यूपीएससी और एमपीएससी अध्ययन सूट',

    // Dashboard
    dailyQuote: 'निरंतरता ही सामान्य को उत्कृष्टता में बदलती है।',
    todayStudyTime: 'आज का अध्ययन समय',
    weeklyGoal: 'साप्ताहिक लक्ष्य (40 घंटे)',
    dailyStreak: 'दैनिक निरंतरता',
    days: 'दिन',
    curriculumProgress: 'पाठ्यक्रम प्रगति',
    overallCurriculum: 'कुल पाठ्यक्रम पूर्णता',
    upscMastery: 'यूपीएससी पूर्ण विषय',
    mpscMastery: 'एमपीएससी पूर्ण विषय',
    todayTasks: 'आज के निर्धारित कार्य',
    noTasksToday: 'आज के लिए कोई कार्य निर्धारित नहीं है।',
    noTasksTodayDesc: 'अपने दिन की शुरुआत एक निर्धारित लक्ष्य के साथ करने से अध्ययन दक्षता बढ़ती है।',
    addScheduledTask: '+ निर्धारित कार्य जोड़ें',
    openTomorrowPlanner: 'कल का प्लानर खोलें',
    autoPlanTomorrowBtn: 'कल का प्लान स्वतः बनाएं',
    quickTimerStart: 'फोकस टाइमर तुरंत शुरू करें',
    recentStudySessions: 'हाल के अध्ययन सत्र',
    noSessionsLogged: 'आज कोई सत्र दर्ज नहीं है। शुरू करने के लिए टाइमर दबाएं!',
    noSessionsLoggedYet: 'आज अभी तक कोई सत्र दर्ज नहीं हुआ है। क्या आप अध्ययन शुरू करने के लिए तैयार हैं?',
    openSyllabusBtn: 'पाठ्यक्रम और चेकलिस्ट खोलें →',
    startTimer: 'टाइमर शुरू करें',
    pauseTimer: 'रोकें',
    resumeTimer: 'पुनः शुरू करें',
    subjectBalanceAlert: 'विषय संतुलन चेतावनी: उपेक्षित विषय',
    neglectedAlertIntro: 'आपने पिछले {days}+ दिनों में',
    inTheLastDays: 'के लिए कोई अध्ययन समय दर्ज नहीं किया है।',
    highWeightageWarning: 'अधिक अंकभार वाला महत्वपूर्ण विषय — नियमित अध्ययन से अंतिम समय की हड़बड़ी से बचाव होता है!',
    backlogWarning: 'परीक्षा से पहले पाठ्यक्रम का बैकलॉग जमा न होने दें!',
    otherLowHourSubjects: 'अन्य कम अध्ययन वाले विषय:',
    focusOn: '{subject} पर ध्यान दें',
    addToPlanner: 'प्लानर में जोड़ें',
    quickActions: 'त्वरित क्रियाएं',
    focusTimer: 'फोकस टाइमर',
    activeSession: 'सक्रिय सत्र',
    startSession: 'सत्र शुरू करें',
    studyPlan: 'अध्ययन योजना',
    schedule: 'शेड्यूल',
    reports: 'रिपोर्ट्स',
    attendance: 'उपस्थिति',
    presentToday: 'आज उपस्थित',
    dayStreak: '{streak}-दिन निरंतरता',
    quiz: 'प्रश्नोत्तरी',
    comingSoon: 'जल्द आ रहा है',
    session: 'सत्र',
    sessions: 'सत्र',
    logged: 'दर्ज',
    loggedToday: 'आज दर्ज समय',
    dailyGoal: 'दैनिक लक्ष्य',
    goalMet: 'लक्ष्य पूरा हुआ!',
    scheduleDailySyllabusDesc: 'दैनिक पाठ्यक्रम के विषयों को निर्धारित करें, कल की पुनरावृत्ति की अग्रिम योजना बनाएं और अपने अध्ययन घंटों को संतुलित करें।',
    expandAll: 'सभी विस्तृत करें',
    collapse: 'संक्षिप्त करें',

    // Timer Screen
    studyTimer: 'अध्ययन टाइमर',
    studyStopwatch: 'गहन अध्ययन स्टॉपवॉच और फोकस ट्रैकर',
    trackStudySessions: 'अपने अध्ययन सत्रों को ट्रैक करें और निरंतरता बनाए रखें।',
    exitFocusMode: 'फोकस मोड से बाहर निकलें',
    enterFocusMode: 'फोकस मोड शुरू करें',
    focusStyle: 'फोकस शैली',
    lightZen: 'लाइट ज़ेन (लचीला)',
    deepZen: 'डीप ज़ेन (सख्त लॉक)',
    stopwatchLightZenOnly: 'स्टॉपवॉच केवल लाइट ज़ेन का समर्थन करता है।',
    deepZenDesc: 'डीप ज़ेन उलटी गिनती के दौरान रोकने, रीसेट करने, समाप्त करने और बाहर निकलने को लॉक करता है। यह समय पूरा होने पर अनलॉक होता है।',
    lightZenDesc: 'लाइट ज़ेन आपको जब चाहें फोकस मोड छोड़ने की अनुमति देता है।',
    pomodoro: 'पोमोडोरो',
    stopwatch: 'स्टॉपवॉच',
    custom: 'कस्टम',
    studySubject: 'अध्ययन विषय',
    customDuration: 'कस्टम अवधि',
    enterOwnTime: 'या अपना समय दर्ज करें (मिनट में)',
    enterMinutesPlaceholder: 'मिनट दर्ज करें (1 - 720)',
    currentTarget: 'वर्तमान लक्ष्य',
    saveSession: 'सत्र सहेजें',
    reset: 'रीसेट करें',
    saving: 'सहेजा जा रहा है...',
    finish: 'समाप्त करें',
    allSubjects: 'सभी विषय',
    upsc: 'यूपीएससी',
    mpsc: 'एमपीएससी',
    runningFocus: 'गहन अध्ययन सत्र चालू है',
    pausedFocus: 'सत्र रुका हुआ है',
    readyToFocus: 'फोकस करने के लिए तैयार',
    sessionFocusTopic: 'सत्र फोकस विषय',
    whatAreYouStudying: 'आप किस अध्याय या विषय का अध्ययन कर रहे हैं?',
    selectSubjectToTrack: 'ट्रैक करने के लिए विषय चुनें',
    pomodoroIntervals: 'पोमोडोरो अंतराल विकल्प',

    // Offline / Manual Study Logging
    manualOfflineLogging: 'मैन्युअल और ऑफलाइन अध्ययन लॉगिंग',
    manualOfflineDesc: 'पाठ्यपुस्तक वाचन, लाइब्रेरी सत्र और पिछले अध्ययन घंटे दर्ज करें।',
    logOfflineBookStudy: 'ऑफलाइन पुस्तक अध्ययन दर्ज करें',
    logOfflineBookDesc: 'पिछले घंटों की प्रविष्टि, पाठ्यपुस्तकें और लाइब्रेरी अध्ययन शामिल',
    pastHoursEntry: 'पिछले घंटों की प्रविष्टि',
    pastHoursDesc: 'पिछले अध्ययन सत्रों के लिए मैन्युअल प्रविष्टि',
    targetExamSection: 'लक्षित परीक्षा अनुभाग',
    selectSubject: 'विषय चुनें',
    studyDate: 'अध्ययन तिथि (दिन/माह/वर्ष)',
    specificDate: 'विशिष्ट तिथि',
    studyActivity: 'अध्ययन गतिविधि',
    durationStudied: 'अध्ययन अवधि (घंटे और मिनट)',
    hoursHrs: 'घंटे (घं)',
    minutesMins: 'मिनट (मि)',
    theoryReading: 'सिद्धांत और वाचन',
    pyqsMcqs: 'पीवाईक्यू और बहुविकल्पीय प्रश्न',
    mainsWriting: 'मुख्य परीक्षा उत्तर लेखन',
    currentAffairsActivity: 'करंट अफेयर्स',
    revision: 'पुनरावृत्ति',
    saveStudyHours: 'अध्ययन समय सहेजें',

    // Syllabus Screen
    subjectsAndSyllabus: 'विषय और पाठ्यक्रम',
    curriculumChecklist: 'इंटरएक्टिव पाठ्यक्रम चेकलिस्ट, महारत ट्रैकिंग और ऑफलाइन लॉग',
    logOfflineHours: '+ घंटे दर्ज करें',
    closeLogger: 'लॉगर बंद करें',
    offlineLoggerTitle: 'ऑफलाइन / पुस्तक अध्ययन घंटे दर्ज करें',
    offlineLoggerDesc: 'मानक पुस्तकों (लक्ष्मीकांत, स्पेक्ट्रम, एनसीईआरटी) या लाइब्रेरी में पढ़ा? घंटे तुरंत जोड़ें।',
    examSection: 'परीक्षा पाठ्यक्रम अनुभाग',
    topicsChecklistTap: 'विषय चेकलिस्ट (स्थिति बदलने के लिए टैप करें)',
    viewTopicInSyllabus: 'पाठ्यक्रम में देखें →',
    redirectedFromTask: 'प्लानर कार्य से पुनर्निर्देशित',
    jumpToTopic: 'विषय देखें ↓',
    topicsMastered: 'विषय पूर्ण',
    spacedRepetitionQueue: 'पुनरावृत्ति कतार',
    neglectedModuleNotice: 'पाठ्यक्रम संतुलन: छूटा हुआ विषय',
    dueOn: 'नियत',
    spent: 'व्यतीत',
    revs: 'पुनरावृत्ति',
    donePct: 'पूर्ण',
    plusOneRevise: '+१ पुनरावृत्ति',
    logHours: 'समय दर्ज करें',
    revise: 'पुनरावृत्ति',
    viewTopic: 'विषय देखें',

    // Planner Screen
    studyPlannerTitle: 'अध्ययन योजनाकार',
    plannerTimeframe: 'योजना समय-सीमा',
    todaysPlan: 'आज की योजना',
    tomorrowsPlan: 'कल की योजना',
    weeklyView: 'साप्ताहिक दृश्य',
    workloadRoutine: 'कार्यभार और दिनचर्या',
    examFilter: 'परीक्षा फ़िल्टर',
    allExamTasks: 'सभी परीक्षा कार्य',
    upscPlans: 'यूपीएससी योजनाएं',
    mpscPlans: 'एमपीएससी योजनाएं',
    selectDay7: 'दिन चुनें (अगले 7 दिन)',
    addStudyBlock: '+ नया अध्ययन ब्लॉक जोड़ें',
    addStudyBlockDesc: 'अपने एमपीएससी या यूपीएससी पाठ्यक्रम के अनुसार फोकस अंतराल निर्धारित करें।',
    selectTargetSubject: 'विषय चुनें',
    quickPickUnfinished: 'अपूर्ण पाठ्यक्रम से तुरंत चुनें',
    topicOrChapterTitle: 'विषय या अध्याय शीर्षक',
    topicTitlePlaceholder: 'उदा. मौलिक अधिकार (अनुच्छेद 14-18)',
    targetDurationMins: 'लक्षित अवधि (मिनट)',
    scheduleStudyBlockBtn: '+ अध्ययन ब्लॉक शेड्यूल करें',
    advancePlanningRoutine: 'अग्रिम योजना दिनचर्या',
    advancePlanningDesc: 'कल के कार्यों की आज रात योजना बनाने से सुबह का समय बचता है और स्पष्टता रहती है।',
    noTasksTomorrow: 'कल के लिए अभी कोई कार्य निर्धारित नहीं है।',
    autoGenerateBlueprint: 'कल के मुख्य विषय स्वतः शेड्यूल करें',
    browseSyllabusToSchedule: 'पाठ्यक्रम विषय ब्राउज़ करें',
    tomorrowsWorkloadTarget: 'कल का कार्यभार बनाम 8 घंटे का लक्ष्य',
    capacity: 'क्षमता',
    weeklyGoalVs40h: 'साप्ताहिक 40 घंटे का लक्ष्य',
    tasksForDay: 'के लिए निर्धारित कार्य',
    noTasksScheduledDate: 'इस तारीख के लिए कोई कार्य निर्धारित नहीं है। नीचे "+ नया ब्लॉक जोड़ें" से शेड्यूल करें।',
    workloadGauges: 'कार्यभार क्षमता गेज',
    todaysStudyLoad: 'आज का अध्ययन भार',

    // Analytics Screen
    studyAnalytics: 'अध्ययन विश्लेषण',
    analyticsSubtitleMain: 'अपनी आदतों को समझें, प्रगति ट्रैक करें और निरंतरता बनाएं',
    yourStudyOverview: 'आपका अध्ययन अवलोकन',
    sevenDays: '७ दिन',
    thirtyDays: '३० दिन',
    overview: 'अवलोकन',
    activity: 'गतिविधि',
    subjects: 'विषय',
    sessionsTab: 'सत्र',
    todaysStudyGoal: 'आज का अध्ययन लक्ष्य',
    buildHabitDesc: 'प्रतिदिन एक केंद्रित सत्र के साथ अपनी अध्ययन आदत विकसित करें।',
    studiedToday: 'आज अध्ययन किया',
    dailyGoalReached: 'दैनिक लक्ष्य पूरा हुआ!',
    remainingOf: 'शेष (कुल',
    studyTime: 'अध्ययन समय',
    totalRecorded: 'कुल दर्ज',
    completedRecords: 'पूर्ण सत्र',
    averageFocus: 'औसत एकाग्रता',
    recordedFocusScore: 'दर्ज एकाग्रता स्कोर',
    avgSession: 'औसत सत्र अवधि',
    perRecordedSession: 'प्रति दर्ज सत्र',
    focusQuality: 'एकाग्रता गुणवत्ता',
    avgFocusScoreDesc: 'दर्ज किए गए सत्रों से औसत एकाग्रता स्कोर।',
    dailyStudyActivity: 'दैनिक अध्ययन गतिविधि',
    minutesStudiedWeek: 'इस सप्ताह प्रत्येक दिन अध्ययन किए गए मिनट',
    minutesStudiedMonth: 'चयनित महीने में अध्ययन किए गए मिनट',
    activeDays: 'सक्रिय दिन',
    studyConsistency: 'अध्ययन निरंतरता',
    heatmapDesc: 'प्रत्येक वर्ग एक दिन दर्शाता है। गहरा रंग अधिक अध्ययन समय का प्रतीक है।',
    daysWithoutStudy: 'बिना अध्ययन के दिन',
    subjectBreakdown: 'विषयवार विभाजन',
    subjectBreakdownDesc: 'देखें कि आपका अध्ययन समय विभिन्न विषयों में कैसे वितरित है।',
    noSubjectStudyTime: 'इस अवधि के लिए कोई विषय अध्ययन समय दर्ज नहीं है।',
    analyticsTitle: 'अध्ययन विश्लेषण और अंतर्दृष्टि',
    totalStudyTime: 'कुल अध्ययन समय',
    weeklyAvg: 'साप्ताहिक औसत',
    completionRate: 'कार्य पूर्णता दर',
    subjectDistribution: 'विषयवार समय आवंटन',
    last7DaysTrend: 'दैनिक अध्ययन रुझान (पिछले 7 दिन)',
    hoursPerDay: 'घंटे / दिन',
    noAnalyticsData: 'व्यक्तिगत तैयारी अंतर्दृष्टि देखने के लिए अध्ययन सत्र दर्ज करें।',
    topicNoteOptional: 'अध्याय / विषय टिप्पणी (वैकल्पिक)',
    topicNotePlaceholder: 'उदा. मौलिक अधिकार अनुच्छेद 19-22 नोट्स और प्रश्न',
    resetSessionPrompt: 'अध्ययन सत्र रीसेट करें?',
    resetSessionDesc: 'आपका वर्तमान असहेजा हुआ अध्ययन समय खारिज कर दिया जाएगा।',
    exitFocusModePrompt: 'फोकस मोड से बाहर निकलें?',
    exitFocusModeDesc: 'क्या आप वाकई फोकस मोड छोड़कर सामान्य नेविगेशन पर लौटना चाहते हैं?',
    stayFocused: 'फोकस बनाए रखें',
    exitFocusMode: 'फोकस मोड से बाहर निकलें',
    studyStreak: 'अध्ययन निरंतरता',
    currentStreak: 'वर्तमान निरंतरता',
    streakDescription: 'निरंतरता सिविल सेवा सफलता की नींव है। अपनी निरंतरता बनाए रखने के लिए हर दिन अध्ययन सत्र पूरा करें!',
    days: 'दिन',
    autoPlanFullWeek: 'पूरे सप्ताह की योजना बनाएं',
    entireWeek: 'संपूर्ण सप्ताह (सभी 7 दिन)',
    singleDayFocus: 'एकल दिवस फोकस',
    weeklyScheduleView: 'साप्ताहिक समय-सारणी दृश्य',
    noTasksForDay: 'इस दिन के लिए कोई कार्य निर्धारित नहीं है',
    addTask: '+ कार्य जोड़ें',
    autoPlanThisDay: 'इस दिन की स्वचालित योजना बनाएं',
    workloadCapacityGauges: 'कार्यभार क्षमता मापक',
    todaysStudyLoad: 'आज का अध्ययन भार',
    weeklyCumulativeLoad: 'साप्ताहिक संचयी भार',
    plannedAcross7Days: '7 दिनों में नियोजित',
    examSyllabusAllocation: 'परीक्षा पाठ्यक्रम आवंटन',
    subjectWiseAllocation: 'विषयवार समय आवंटन',
    noSubjectHoursPlanned: 'अभी तक कोई विषय घंटे नियोजित नहीं हैं। विषय वितरण देखने के लिए अध्ययन कार्य जोड़ें।',
    targetExam: 'लक्षित परीक्षा',
    selectExamSubject: '{exam} विषय चुनें',
    saveHoursPrefix: 'सहेजें',
    hoursShort: 'घं',
    minsShort: 'मि',
    subtopics: 'उप-विषय',
    recentStudySessions: 'इस सप्ताह के हालिया अध्ययन सत्र (बीते दिन)',
    startLiveTimer: 'लाइव टाइमर शुरू करें',
    logPastHours: 'बीते घंटे दर्ज करें',
    myProfile: 'मेरी प्रोफाइल',
    studentAccount: 'छात्र खाता',
    aspirantSubtitle: 'एमपीएससी / यूपीएससी अभ्यर्थी',
    studyOverview: 'अध्ययन विवरण',
    dailyStudyGoal: 'दैनिक अध्ययन लक्ष्य',
    personalInfo: 'व्यक्तिगत जानकारी',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    mobileNumber: 'मोबाइल नंबर',
    examTarget: 'लक्षित परीक्षा',
    preferredSubjects: 'पसंदीदा विषय',
    preferences: 'प्राथमिकताएं',
    studyReminders: 'अध्ययन अनुस्मारक',
    setDailyReminderDesc: 'अपना दैनिक अध्ययन अनुस्मारक सेट करें',
    privacyAndAccount: 'गोपनीयता और खाता',
    manageAccountSettings: 'अपनी खाता सेटिंग्स प्रबंधित करें',
    saveChanges: 'परिवर्तन सहेजें',
    savingChanges: 'सहेजा जा रहा है...',
    editProfile: 'प्रोफाइल संपादित करें',
    signOutPrompt: 'साइन आउट करें?',
    signOutConfirmDesc: 'क्या आप वाकई अभ्यास ट्रैकर से साइन आउट करना चाहते हैं?',
    yesSignOut: 'हाँ, साइन आउट करें',
    yourPrepYourProgress: 'आपकी तैयारी, आपकी प्रगति।',
    buildConsistentRoutine: 'एक सुसंगत दिनचर्या बनाएं',
    reminderHeroDesc: 'अपने अध्ययन लक्ष्यों को प्राप्त करने के लिए दैनिक अनुस्मारक समय चुनें।',
    dailyStudyReminder: 'दैनिक अध्ययन अनुस्मारक',
    reminderEnabled: 'अनुस्मारक प्राथमिकता सक्षम है',
    reminderDisabled: 'अनुस्मारक प्राथमिकता अक्षम है',
    reminderTime: 'अनुस्मारक समय',
    selectPreferredTime: 'अपना पसंदीदा समय चुनें।',
    reminderDeviceNote: 'ये प्राथमिकताएं इस डिवाइस पर सहेजी गई हैं।',
    announcements: 'सूचनाएं',
    allAnnouncements: '← सभी घोषणाएं',
    backToApp: '← ऐप पर वापस जाएं',
    announcementDetails: 'घोषणा विवरण',
    completeAnnouncementInfo: 'घोषणा की पूरी जानकारी',
    announcementsAndStatus: 'घोषणाएं और पठन स्थिति',
    readStatus: 'पढ़ा गया',
    unreadStatus: 'अपठित',
    noAnnouncementsYet: 'अभी तक कोई घोषणा नहीं है',
    announcementCol: 'घोषणा',
    dateCol: 'दिनांक',
    statusCol: 'स्थिति',
    actionCol: 'कार्रवाई',
    viewAction: 'देखें',
    studentHelpDesk: 'छात्र सहायता केंद्र',
    helpDeskSubtitle: 'समर्पित छात्र सहायता, बग रिपोर्ट और नई सुविधा के अनुरोध',
    createTicket: 'नया टिकट बनाएं',
    viewMyTickets: 'मेरे टिकट देखें',
    appName: 'अभ्यास ट्रैकर',
    examFocusTag: 'यूपीएससी व एमपीएससी',
    examYearBadge: 'यूपीएससी / एमपीएससी {year}',
    selectDayNext7: 'दिन चुनें (अगले 7 दिन)',
    ofHours: '{h}घं का',
    capacityPercentOf: '{hours} का {pct}%',
    studyBlock: 'ब्लॉक',
    recentSessions: 'हालिया सत्र',
    recentSessionsDesc: 'इस अवधि के दौरान आपके नवीनतम दर्ज अध्ययन सत्र।',
    noSessionsRecorded: 'इस अवधि के दौरान कोई सत्र दर्ज नहीं किया गया।',
    studySession: 'अध्ययन सत्र',
    dateUnavailable: 'तारीख अनुपलब्ध',
    latestCount: 'नवीनतम {count}',
    totalStudied: 'कुल अध्ययन',
    totalSessions: 'कुल सत्र',
    leadingSubject: 'शीर्ष विषय',
    subjectDetails: 'विषय विवरण',
    basedOnSessions: 'इस अवधि में दर्ज {count} {sessions} पर आधारित।',
    completeSessionToTrack: 'फोकस गुणवत्ता ट्रैक करने के लिए एक अध्ययन सत्र पूरा करें।'
  },

  // ==================== MARATHI (मराठी) ====================
  mr: {
    // Navigation & Tabs
    dashboard: 'डॅशबोर्ड',
    timer: 'टायमर',
    syllabus: 'अभ्यासक्रम',
    planner: 'नियोजक',
    analytics: 'विश्लेषण',
    ticketSupport: 'मदत व तक्रार',
    pro: "प्रो",
    premium: "प्रीमियम",
    upgradeToPremium: "अभ्यास प्रीमियम मध्ये अपग्रेड करा",
    premiumSubtitle: "स्मार्ट अभ्यास करा. उत्तम ट्रॅक करा. ध्येय साध्य करा.",
    premiumBenefits: "प्रीमियम विशेष फायदे",
    freePlan: "मोफत प्लॅन",
    freePlanPrice: "$0",
    freePlanDesc: "प्रत्येक विद्यार्थ्यासाठी मूलभूत अभ्यास ट्रॅकिंग",
    premiumMonthly: "प्रीमियम मासिक",
    premiumMonthlyPrice: "$9.99",
    premiumMonthlyDuration: "/महिना",
    premiumYearly: "प्रीमियम वार्षिक",
    premiumYearlyPrice: "$29.99",
    premiumYearlyDuration: "/वर्ष",
    bestValueSave: "सर्वोत्कृष्ट मूल्य – ३३% बचत",
    upgradeToPremiumBtn: "प्रीमियम मध्ये अपग्रेड करा",
    restorePurchases: "खरेदी पूर्ववत करा (Restore)",
    manageSubscription: "सबस्क्रिप्शन व्यवस्थापन",
    cancelSubscription: "सबस्क्रिप्शन रद्द करा",
    changePlan: "प्लॅन बदला",
    subscriptionActiveUntil: "{date} पर्यंत सक्रिय",
    termsAndPrivacy: "नियम व अटी • गोपनीयता धोरण",
    renewalInfo: "स्वयंचलित नूतनीकरण. तुम्ही कधीही गुगल प्ले स्टोअर किंवा सेटिंग्जमधून रद्द करू शकता.",
    subscriptionExpiryWarning: "तुमचे प्रीमियम सबस्क्रिप्शन लवकरच संपत आहे. अखंडित फायद्यांसाठी आत्ताच नूतनीकरण करा.",
    renewNow: "सबस्क्रिप्शन नूतनीकरण करा",
    activePlanLabel: "सध्याचा सक्रिय प्लॅन",
    freePlanActive: "मोफत प्लॅन सक्रिय",
    premiumOfficerActive: "प्रीमियम अधिकारी सक्रिय",
    paymentConfirmation: "पेमेंट पुष्टीकरण",
    orderSummary: "ऑर्डर सारांश",
    selectedPlan: "निवडलेला प्लॅन",
    billingCycle: "बिलिंग कालावधी",
    totalAmount: "एकूण देय रक्कम",
    paySecurely: "सुरक्षित पेमेंट करा व सक्रिय करा",
    welcomeToPremium: "🎉 अभ्यास प्रीमियम मध्ये आपले स्वागत आहे!",
    activationSuccessDesc: "आपले सबस्क्रिप्शन आता सक्रिय झाले आहे. सर्व प्रीमियम सुविधा, AI मार्गदर्शन आणि प्रगत विश्लेषण आपल्यासाठी खुले झाले आहे.",
    startStudyingBtn: "प्रीमियम सह अभ्यास सुरू करा",
    cancelConfirmTitle: "सबस्क्रिप्शन रद्द करायचे आहे का?",
    cancelConfirmDesc: "आपल्या चालू बिलिंग कालावधीच्या समाप्तीपर्यंत ({date}) आपल्याकडे प्रीमियम सुविधा चालू राहतील.",
    keepSubscription: "सबस्क्रिप्शन सुरू ठेवा",
    confirmCancel: "रद्द करण्याची पुष्टी करा",
    purchasesRestored: "खरेदी यशस्वीरित्या पूर्ववत केली गेली. आपले सबस्क्रिप्शन अद्ययावत आहे.",
    featureUnlimitedHistory: "अमर्याद अभ्यास इतिहास",
    featureAdvancedAnalytics: "प्रगत अभ्यास विश्लेषण",
    featurePerformanceReports: "साप्ताहिक आणि मासिक कामगिरी अहवाल",
    featureCustomGoals: "स्वतःचे अभ्यास ध्येय निश्चिती",
    featureAdvancedPlanner: "प्रगत नियोजक व वेळापत्रक",
    featureAIAbhyasMitra: "AI अभ्यास मित्र मार्गदर्शन",
    featureCloudSync: "क्लाउड बॅकअप व सिंक्रोनायझेशन",
    featureAnnualReports: "वार्षिक कामगिरी अहवाल",
    featureProgressComparison: "दीर्घकालीन प्रगती तुलना",
    featurePrioritySupport: "प्राधान्य मदत व मार्गदर्शन",
    featureExclusiveThemes: "विशेष प्रीमियम थीम्स",
    proSubtitle: "सबस्क्रिप्शन, सण विशेष सवलत व विशेष सुविधा",
    proTitle: "अभ्यास प्रो",
    proBadge: "प्रो",
    festiveOfferBadge: "सण सवलत",
    festiveOfferTitle: "🎉 सण विशेष महा-सवलत! ६०% पर्यंत थेट सूट",
    festiveOfferSubtitle: "युपीएससी व एमपीएससी ६-महिने व वार्षिक पासवर विशेष सवलत",
    festiveCountdown: "⏳ मर्यादित कालावधी सवलत - पुढील ४८ तासांत संपेल",
    couponTitle: "तुमच्याकडे कूपन कोड आहे का?",
    couponPlaceholder: "कूपन कोड टाका (उदा. FESTIVE60)",
    applyCoupon: "कूपन लावा",
    couponSuccess: "कूपन यशस्वीरित्या लागू झाले! सवलत प्राप्त झाली.",
    couponInvalid: "अवैध कूपन कोड. FESTIVE60 किंवा OFFICER50 वापरून पहा.",
    couponRemove: "काढून टाका",
    choosePlan: "तुमचा अभ्यासक्रम पास निवडा",
    choosePlanSub: "नियोजित अभ्यास, अमर्याद AI मार्गदर्शन व मुख्य परीक्षा उत्तर तपासणी",
    planStarterTitle: "स्टार्टर बूस्टर",
    planStarterDuration: "१ महिना पास",
    planStarterDesc: "सखोल रिव्हिजन, दैनिक ५० AI शंका निवारण व अभ्यासक्रम ट्रॅकर",
    planSixMonthTitle: "पूर्व व मुख्य ६-महिने अधिकारी पास",
    planSixMonthDuration: "६ महिने पास",
    planSixMonthDesc: "सर्वसमावेशक तयारी, अमर्याद AI अभ्यास मित्र व ३० सराव टेस्ट सिरीज",
    planAnnualTitle: "१ वर्ष संपूर्ण अधिकारी पास",
    planAnnualDuration: "१२ महिने ऑल-एक्सेस",
    planAnnualDesc: "संपूर्ण युपीएससी व एमपीएससी तयारी, अमर्याद मुख्य परीक्षा उत्तर तपासणी व व्हीआयपी सपोर्ट",
    popularBadge: "सर्वात लोकप्रिय",
    bestValueBadge: "सर्वोत्कृष्ट मूल्य",
    savePercent: "{percent}% बचत",
    perMonth: "/महिना",
    activePlan: "सध्याची स्थिती",
    proOfficerActive: "🌟 प्रो अधिकारी सक्रिय",
    freeAspirantTier: "मोफत विद्यार्थी खाते",
    validUntil: "{date} पर्यंत वैध",
    upgradeNow: "अधिकारी पास सक्रिय करा",
    subscribeTo: "{plan} सबस्क्राइब करा",
    proPerksTitle: "स्पर्धा परीक्षा विद्यार्थी प्रो का निवडतात?",
    proPerksSub: "तुमच्या अभ्यासाला द्या खात्रीशीर यशाची दिशा",
    featureComparisonTitle: "मोफत खाते वि. प्रो खाते तुलना",
    featureName: "वैशिष्ट्य / सुविधा",
    featureFree: "मोफत खाते",
    featurePro: "अभ्यास प्रो",
    featureAIQueries: "AI अभ्यास मित्र मार्गदर्शक",
    featureAIQueriesFree: "५ शंका / दिवस",
    featureAIQueriesPro: "अमर्याद २४/७ शंका निवारण",
    featureSyllabus: "युपीएससी व एमपीएससी अभ्यासक्रम ट्रॅकिंग",
    featureSyllabusFree: "साधारण चेकलिस्ट",
    featureSyllabusPro: "मायक्रो-टॉपिक हीटमॅप व रिव्हिजन ट्रॅकर",
    featureMainsEval: "जीएस मुख्य परीक्षा उत्तर तपासणी",
    featureMainsEvalFree: "समाविष्ट नाही",
    featureMainsEvalPro: "त्वरित AI गुणदान व सुधारणा सूचना",
    featurePYQBank: "मागील वर्षांचे प्रश्नसंच (PYQ)",
    featurePYQBankFree: "मागील ३ वर्षे",
    featurePYQBankPro: "२५+ वर्षे सविस्तर मराठी व इंग्रजी उत्तरांसह",
    featureZenMode: "सखोल एकाग्रता झेन ऑडिओ व बीट्स",
    featureZenModeFree: "मूलभूत टायमर",
    featureZenModePro: "संपूर्ण झेन लायब्ररी व ऑफलाइन संगीत",
    featureMentorHelp: "मार्गदर्शक मदत व शंका निवारण",
    featureMentorHelpFree: "४८ तासांत उत्तर",
    featureMentorHelpPro: "२ तासांच्या आत प्राधान्य उत्तर",
    featureOfflinePDF: "ऑफलाइन माइंडमॅप्स व नोट्स",
    featureOfflinePDFFree: "मर्यादित नमुना",
    featureOfflinePDFPro: "संपूर्ण एचडी ऑफलाइन डाऊनलोड",
    confirmCheckoutTitle: "सबस्क्रिप्शन निश्चित करा",
    orderSummary: "ऑर्डर सारांश",
    originalPrice: "मूळ शुल्क",
    festiveDiscount: "सण विशेष सवलत",
    couponDiscount: "कूपन सवलत",
    totalPayable: "एकूण देय रक्कम",
    securePaymentNotice: "🔒 सुरक्षित २५६-बिट व्यवहार. त्वरित सेवा सक्रिय.",
    confirmPay: "पेमेंट करा व प्रो सुरू करा",
    paymentSimulatedSuccess: "🎉 अभिनंदन! तुमचे प्रो खाते सक्रिय झाले!",
    paymentSimulatedSub: "सर्व प्रो सुविधा, अमर्याद AI मार्गदर्शन व मुख्य परीक्षा उत्तर तपासणी आता तुमच्यासाठी खुली आहे.",
    startLearningPro: "अभ्यास प्रो सह सुरुवात करा",
    cancel: "रद्द करा",
    paymentMethods: "समर्थित पेमेंट पर्याय",
    paymentUpi: "त्वरित UPI (Google Pay, PhonePe, Paytm, BHIM)",
    paymentCards: "डेबिट / क्रेडिट कार्ड आणि नेट बँकिंग",
    activeUntil: "समाप्ती दिनांक",
    festiveOffersHeading: "सण विशेष ऑफर्स व सवलती",
    faqHeading: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
    faq1Q: "प्रो युपीएससी व एमपीएससी दोन्हीसाठी लागू आहे का?",
    faq1A: "होय! प्रो मध्ये युपीएससी नागरी सेवा आणि एमपीएससी राज्यसेवा/संयुक्त परीक्षा या दोन्हीचा संपूर्ण अभ्यासक्रम, प्रश्नसंच आणि AI मार्गदर्शन उपलब्ध आहे.",
    faq2Q: "AI मुख्य परीक्षा उत्तर तपासणी कशी कार्य करते?",
    faq2A: "अभ्यास मित्र तुमच्या उत्तरांचे अधिकृत निकषांनुसार विश्लेषण करून गुणदान व सूचना देतो.",
    faq3Q: "मी इंटरनेट नसताना ऑफलाइन अभ्यास करू शकतो का?",
    faq3A: "होय! सर्व अभ्यासक्रम चेकलिस्ट, ऑफलाइन टाइमर व डाऊनलोड केलेले रिव्हिजन पीडीएफ इंटरनेटशिवाय १००% कार्य करतात.",
    faq4Q: "माझ्याकडे आधीच सक्रिय पास असल्यास काय होईल?",
    faq4A: "तुम्ही नवीन पास घेतल्यास तुमची उर्वरित मुदत नवीन कालावधीत आपोआप समाविष्ट केली जाते.",
    settings: 'सेटिंग्ज',

    // Subtitles
    dashboardSubtitle: 'दैनंदिन प्रगती, ध्येय नियोजन आणि अभ्यास समतोल',
    timerSubtitle: 'सखोल अभ्यास स्टॉपवॉच आणि फोकस ट्रॅकर',
    syllabusSubtitle: 'संवादी अभ्यासक्रम चेकलिस्ट आणि ऑफलाइन तास नोंदणी',
    plannerSubtitle: 'अभ्यास वेळापत्रक, उद्दिष्टपूर्ती आणि दैनंदिन नियोजन',
    analyticsSubtitle: 'अभ्यास आकडेवारी, विषयानुसार विभागणी आणि सातत्य आलेख',

    // General & Common Actions
    save: 'जतन करा',
    cancel: 'रद्द करा',
    close: 'बंद करा',
    done: 'पूर्ण झाले',
    edit: 'संपादित करा',
    delete: 'हटवा',
    focus: 'लक्ष्य',
    viewAll: 'सर्व पहा',
    all: 'सर्व',
    today: 'आज',
    tomorrow: 'उद्या',
    yesterday: 'काल',
    day: 'दिवस',
    night: 'रात्र',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    status: 'स्थिती',
    priority: 'प्राधान्य',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कमी',
    completed: 'पूर्ण',
    pending: 'प्रलंबित',
    inProgress: 'प्रगतीपथावर',
    notStarted: 'सुरू नाही केले',
    toRevise: 'उजळणी बाकी',
    mastered: 'पारंगत / पूर्ण',
    remaining: 'उर्वरित',
    mins: 'मिनिटे',
    minPlanned: 'मिनिटे नियोजित',
    hours: 'तास',
    hoursPlanned: 'तास नियोजित',
    tasks: 'कामे',
    task: 'काम',
    signOut: 'बाहेर पडा',
    confirmSignOut: 'तुम्हाला नक्की बाहेर पडायचे आहे का?',
    signedInAs: 'लॉगिन नाव',
    start: 'सुरू करा',
    active: 'सक्रिय',
    new: 'नवीन',
    on: 'सुरू',
    off: 'बंद',
    set: 'सेट करा',
    ok: 'ठीक आहे',

    // Greetings & Header
    goodMorning: 'शुभ सकाळ',
    goodEvening: 'शुभ संध्याकाळ',
    aspirant: 'अभ्यासक',

    // Settings Modal
    settingsTitle: 'सेटिंग्ज आणि प्राधान्ये',
    appLanguage: 'अ‍ॅपची भाषा',
    chooseLanguage: 'संपूर्ण अ‍ॅपसाठी तुमची पसंतीची भाषा निवडा',
    appearance: 'दिसणे आणि थीम',
    themeDescription: 'डोळ्यांच्या आरामासाठी लाइट किंवा डार्क मोड निवडा',
    notificationsTitle: 'सूचना आणि दैनंदिन स्मरणपत्रे',
    notificationDesc: 'दैनंदिन अभ्यास दिनक्रम आणि सूचना व्यवस्थापित करा',
    openNotificationsView: 'दिनक्रम आणि सूचना उघडा',
    enableBrowserAlerts: 'डेस्कटॉप सूचना सुरू करा',
    notificationsEnabled: 'दैनंदिन सूचना सक्रिय आहेत',
    studyTargetGoal: 'दैनंदिन अभ्यास ध्येय',
    studyTargetDesc: 'तुमचे दैनंदिन अभ्यास उद्दिष्ट ठरवा',
    primaryExam: 'प्राथमिक परीक्षा लक्ष्य',
    primaryExamDesc: 'डिफॉल्ट अभ्यासक्रम दृश्य निवडा',
    allExams: 'सर्व परीक्षा (यूपीएससी + एमपीएससी)',
    upscOnly: 'यूपीएससी नागरी सेवा',
    mpscOnly: 'एमपीएससी महाराष्ट्र लोकसेवा',
    soundAlerts: 'टायमर ध्वनी अलर्ट',
    soundAlertsDesc: 'टायमर पूर्ण झाल्यावर ध्वनी वाजवा',
    appInfo: 'अभ्यास ट्रॅकर बद्दल',
    appVersion: 'अभ्यास ट्रॅकर v1.2.0 • यूपीएससी आणि एमपीएससी तयारी सूट',

    // Dashboard
    dailyQuote: 'सातत्यच सामान्य प्रयत्नांना यशात बदलते.',
    todayStudyTime: 'आजचा अभ्यास वेळ',
    weeklyGoal: 'साप्ताहिक ध्येय (४० तास)',
    dailyStreak: 'दैनंदिन सातत्य',
    days: 'दिवस',
    curriculumProgress: 'अभ्यासक्रम प्रगती',
    overallCurriculum: 'एकूण अभ्यासक्रम पूर्णता',
    upscMastery: 'यूपीएससी पूर्ण घटक',
    mpscMastery: 'एमपीएससी पूर्ण घटक',
    todayTasks: 'आजची नियोजित कामे',
    noTasksToday: 'आजसाठी कोणतेही काम नियोजित नाही.',
    noTasksTodayDesc: 'निश्चित ध्येयाने दिवसाची सुरुवात केल्याने अभ्यासाची कार्यक्षमता वाढते.',
    addScheduledTask: '+ नियोजित काम जोडा',
    openTomorrowPlanner: 'उद्याचे नियोजन उघडा',
    autoPlanTomorrowBtn: 'उद्याचे नियोजन ऑटो-प्लॅन करा',
    quickTimerStart: 'झटपट टायमर सुरू करा',
    recentStudySessions: 'अलीकडील अभ्यास सत्रे',
    noSessionsLogged: 'आज कोणतेही सत्र नोंदवले नाही. अभ्यास सुरू करण्यासाठी टायमर दाबा!',
    noSessionsLoggedYet: 'आज अजून कोणतेही सत्र नोंदवलेले नाही. अभ्यास सुरू करण्यास तयार आहात का?',
    openSyllabusBtn: 'अभ्यासक्रम व चेकलिस्ट उघडा →',
    startTimer: 'टायमर सुरू करा',
    pauseTimer: 'थांबवा',
    resumeTimer: 'पुन्हा सुरू करा',
    subjectBalanceAlert: 'विषय समतोल इशारा: दुर्लक्षित घटक',
    neglectedAlertIntro: 'तुम्ही गेल्या {days}+ दिवसांत',
    inTheLastDays: 'साठी कोणताही अभ्यास वेळ नोंदवलेला नाही.',
    highWeightageWarning: 'जास्त गुणांचा महत्त्वाचा घटक — नियमित अभ्यासामुळे शेवटच्या क्षणी होणारा गोंधळ टळतो!',
    backlogWarning: 'परीक्षेपूर्वी अभ्यासक्रमाचा अनुशेष साचू देऊ नका!',
    otherLowHourSubjects: 'इतर कमी तास झालेले विषय:',
    focusOn: '{subject} वर लक्ष द्या',
    addToPlanner: 'नियोजनामध्ये जोडा',
    quickActions: 'झटपट कृती',
    focusTimer: 'फोकस टायमर',
    activeSession: 'सक्रिय सत्र',
    startSession: 'सत्र सुरू करा',
    studyPlan: 'अभ्यास योजना',
    schedule: 'नियोजन',
    reports: 'अहवाल',
    attendance: 'हजेरी',
    presentToday: 'आज उपस्थित',
    dayStreak: '{streak}-दिवस सातत्य',
    quiz: 'प्रश्नमंजुषा',
    comingSoon: 'लवकरच येत आहे',
    session: 'सत्र',
    sessions: 'सत्रे',
    logged: 'नोंदवले',
    loggedToday: 'आज नोंदवलेला वेळ',
    dailyGoal: 'दैनंदिन ध्येय',
    goalMet: 'ध्येय पूर्ण झाले!',
    scheduleDailySyllabusDesc: 'दैनंदिन अभ्यासक्रमाचे नियोजन करा, उद्याच्या उजळणीची आधीच तयारी करा आणि अभ्यासाचा समतोल साधा.',
    expandAll: 'सर्व उघडा',
    collapse: 'संक्षिप्त करा',

    // Timer Screen
    studyTimer: 'अभ्यास टायमर',
    studyStopwatch: 'सखोल अभ्यास स्टॉपवॉच आणि फोकस ट्रॅकर',
    trackStudySessions: 'तुमच्या अभ्यास सत्रांची नोंद ठेवा आणि सातत्य राखा.',
    exitFocusMode: 'फोकस मोडमधून बाहेर पडा',
    enterFocusMode: 'फोकस मोड सुरू करा',
    focusStyle: 'फोकस प्रकार',
    lightZen: 'लाइट झेन (लवचिक)',
    deepZen: 'डीप झेन (कडक लॉक)',
    stopwatchLightZenOnly: 'स्टॉपवॉच फक्त लाइट झेनला सपोर्ट करतो.',
    deepZenDesc: 'डीप झेन काउंटडाउन दरम्यान थांबवणे, रीसेट करणे, समाप्त करणे व बाहेर पडणे लॉक करते. वेळ संपल्यावर ते अनलॉक होते.',
    lightZenDesc: 'लाइट झेन तुम्हाला हवे तेव्हा फोकस मोड सोडण्याची मुभा देते.',
    pomodoro: 'पोमोडोरो',
    stopwatch: 'स्टॉपवॉच',
    custom: 'कस्टम',
    studySubject: 'अभ्यास विषय',
    customDuration: 'कस्टम वेळ',
    enterOwnTime: 'किंवा तुमची स्वतःची वेळ टाका (मिनिटे)',
    enterMinutesPlaceholder: 'मिनिटे प्रविष्ट करा (१ - ७२०)',
    currentTarget: 'सध्याचे ध्येय',
    saveSession: 'सत्र जतन करा',
    reset: 'रीसेट करा',
    saving: 'जतन करत आहे...',
    finish: 'समाप्त करा',
    allSubjects: 'सर्व विषय',
    upsc: 'यूपीएससी',
    mpsc: 'एमपीएससी',
    runningFocus: 'सखोल अभ्यास सत्र सुरू आहे',
    pausedFocus: 'सत्र थांबवले आहे',
    readyToFocus: 'अभ्यासासाठी सज्ज',
    sessionFocusTopic: 'सत्र अभ्यास विषय',
    whatAreYouStudying: 'तुम्ही कोणता धडा किंवा विषय शिकत आहात?',
    selectSubjectToTrack: 'ट्रॅक करण्यासाठी विषय निवडा',
    pomodoroIntervals: 'पोमोडोरो पर्याय',

    // Offline / Manual Study Logging
    manualOfflineLogging: 'मॅन्युअल आणि ऑफलाइन अभ्यास नोंदणी',
    manualOfflineDesc: 'पाठ्यपुस्तक वाचन, लायब्ररी सत्र आणि मागील अभ्यास तास नोंदवा.',
    logOfflineBookStudy: 'ऑफलाइन पुस्तक अभ्यास नोंदवा',
    logOfflineBookDesc: 'मागील तासांची नोंद, पाठ्यपुस्तके आणि लायब्ररी अभ्यास समाविष्ट',
    pastHoursEntry: 'मागील तासांची नोंद',
    pastHoursDesc: 'मागील अभ्यास सत्रांसाठी मॅन्युअल नोंद',
    targetExamSection: 'लक्ष्यित परीक्षा विभाग',
    selectSubject: 'विषय निवडा',
    studyDate: 'अभ्यास तारीख (दिवस/महिना/वर्ष)',
    specificDate: 'विशिष्ट तारीख',
    studyActivity: 'अभ्यास कृती',
    durationStudied: 'अभ्यास वेळ (तास आणि मिनिटे)',
    hoursHrs: 'तास (तास)',
    minutesMins: 'मिनिटे (मि)',
    theoryReading: 'सिद्धांत आणि वाचन',
    pyqsMcqs: 'मागील प्रश्न व सराव प्रश्न',
    mainsWriting: 'मुख्य परीक्षा उत्तर लेखन',
    currentAffairsActivity: 'चालू घडामोडी',
    revision: 'उजळणी',
    saveStudyHours: 'अभ्यास वेळ जतन करा',

    // Syllabus Screen
    subjectsAndSyllabus: 'विषय आणि अभ्यासक्रम',
    curriculumChecklist: 'संवादी अभ्यासक्रम चेकलिस्ट आणि ऑफलाइन तास नोंदणी',
    logOfflineHours: '+ तास नोंदवा',
    closeLogger: 'लॉगर बंद करा',
    offlineLoggerTitle: 'ऑफलाइन / पुस्तक अभ्यास तास नोंदवा',
    offlineLoggerDesc: 'मानक पुस्तके (लक्ष्मीकांत, स्पेक्ट्रम, एनसीईआरटी) किंवा लायब्ररीमध्ये अभ्यास केला? थेट तास जोडा.',
    examSection: 'परीक्षा अभ्यासक्रम विभाग',
    topicsChecklistTap: 'घटक चेकलिस्ट (स्थिती बदलण्यासाठी टॅप करा)',
    viewTopicInSyllabus: 'अभ्यासक्रमात पहा →',
    redirectedFromTask: 'नियोजक कामावरून पुनर्निर्देशित',
    jumpToTopic: 'घटक पहा ↓',
    topicsMastered: 'घटक पूर्ण',
    spacedRepetitionQueue: 'उजळणी रांग',
    neglectedModuleNotice: 'अभ्यासक्रम समतोल: दुर्लक्षित घटक',
    dueOn: 'नियत',
    spent: 'व्यतीत',
    revs: 'उजळणी',
    donePct: 'पूर्ण',
    plusOneRevise: '+१ उजळणी',
    logHours: 'तास नोंदवा',
    revise: 'उजळणी',
    viewTopic: 'विषय पहा',

    // Planner Screen
    studyPlannerTitle: 'अभ्यास नियोजक',
    plannerTimeframe: 'नियोजन कालमर्यादा',
    todaysPlan: 'आजचे नियोजन',
    tomorrowsPlan: 'उद्याचे नियोजन',
    weeklyView: 'साप्ताहिक दृश्य',
    workloadRoutine: 'अभ्यास भार व दिनक्रम',
    examFilter: 'परीक्षा फिल्टर',
    allExamTasks: 'सर्व परीक्षा कामे',
    upscPlans: 'यूपीएससी नियोजन',
    mpscPlans: 'एमपीएससी नियोजन',
    selectDay7: 'दिवस निवडा (पुढील ७ दिवस)',
    addStudyBlock: '+ नवीन अभ्यास स्लॉट जोडा',
    addStudyBlockDesc: 'तुमच्या एमपीएससी किंवा यूपीएससी अभ्यासक्रमानुसार सखोल अभ्यास वेळ ठरवा.',
    selectTargetSubject: 'विषय निवडा',
    quickPickUnfinished: 'अपूर्ण अभ्यासक्रम घटकांमधून झटपट निवडा',
    topicOrChapterTitle: 'घटक किंवा धड्याचे नाव',
    topicTitlePlaceholder: 'उदा. मूलभूत हक्क (कलम १४-१८)',
    targetDurationMins: 'लक्ष्यित वेळ (मिनिटे)',
    scheduleStudyBlockBtn: '+ अभ्यास स्लॉट नियोजित करा',
    advancePlanningRoutine: 'आगाऊ नियोजन दिनक्रम',
    advancePlanningDesc: 'उद्याच्या अभ्यासाचे आज रात्री नियोजन केल्यास सकाळचा वेळ वाचतो आणि स्पष्टता मिळते.',
    noTasksTomorrow: 'उद्यासाठी अजून कोणतेही काम नियोजित नाही.',
    autoGenerateBlueprint: 'उद्याचे मुख्य विषय ऑटो-शेड्यूल करा',
    browseSyllabusToSchedule: 'अभ्यासक्रम घटक तपासून नियोजन करा',
    tomorrowsWorkloadTarget: 'उद्याचा अभ्यास भार विरुद्ध ८ तास ध्येय',
    capacity: 'क्षमता',
    weeklyGoalVs40h: 'साप्ताहिक ४० तास ध्येय',
    tasksForDay: 'साठी नियोजित कामे',
    noTasksScheduledDate: 'या तारखेसाठी कोणतेही काम नियोजित नाही. खालील "+ नवीन अभ्यास स्लॉट जोडा" वर टॅप करा.',
    workloadGauges: 'अभ्यास भार क्षमता दर्शक',
    todaysStudyLoad: 'आजचा अभ्यास भार',

    // Analytics Screen
    studyAnalytics: 'अभ्यास विश्लेषण',
    analyticsSubtitleMain: 'तुमच्या सवयी समजून घ्या, प्रगती ट्रॅक करा आणि सातत्य राखा',
    yourStudyOverview: 'तुमचा अभ्यास आढावा',
    sevenDays: '७ दिवस',
    thirtyDays: '३० दिवस',
    overview: 'आढावा',
    activity: 'कृती',
    subjects: 'विषय',
    sessionsTab: 'सत्रे',
    todaysStudyGoal: 'आजचे अभ्यास ध्येय',
    buildHabitDesc: 'एकाग्रतेने अभ्यास करून दैनंदिन सवय विकसित करा.',
    studiedToday: 'आज अभ्यास केला',
    dailyGoalReached: 'दैनंदिन ध्येय गाठले!',
    remainingOf: 'उर्वरित (एकूण',
    studyTime: 'अभ्यास वेळ',
    totalRecorded: 'एकूण नोंदवलेले',
    completedRecords: 'पूर्ण सत्रे',
    averageFocus: 'सरासरी एकाग्रता',
    recordedFocusScore: 'नोंदवलेला एकाग्रता स्कोअर',
    avgSession: 'सरासरी सत्र वेळ',
    perRecordedSession: 'प्रत्येक सत्रामागे',
    focusQuality: 'एकाग्रता गुणवत्ता',
    avgFocusScoreDesc: 'नोंदवलेल्या सत्रांमधून सरासरी एकाग्रता स्कोअर.',
    dailyStudyActivity: 'दैनंदिन अभ्यास कृती',
    minutesStudiedWeek: 'या आठवड्यात दररोज अभ्यास केलेली मिनिटे',
    minutesStudiedMonth: 'निवडलेल्या महिन्यात अभ्यास केलेली मिनिटे',
    activeDays: 'सक्रिय दिवस',
    studyConsistency: 'अभ्यास सातत्य',
    heatmapDesc: 'प्रत्येक चौकोन एक दिवस दर्शवतो. गडद रंग जास्त अभ्यास वेळ दर्शवतो.',
    daysWithoutStudy: 'अभ्यासाशिवायचे दिवस',
    subjectBreakdown: 'विषयानुसार विभागणी',
    subjectBreakdownDesc: 'तुमचा अभ्यास वेळ विषयांमध्ये कसा विभागला गेला आहे ते पहा.',
    noSubjectStudyTime: 'या कालावधीसाठी कोणताही विषय अभ्यास वेळ नोंदवलेला नाही.',
    analyticsTitle: 'अभ्यास आकडेवारी आणि अंतर्दृष्टी',
    totalStudyTime: 'एकूण अभ्यास वेळ',
    weeklyAvg: 'साप्ताहिक सरासरी',
    completionRate: 'काम पूर्णता प्रमाण',
    subjectDistribution: 'विषयानुसार वेळ वाटप',
    last7DaysTrend: 'दैनंदिन अभ्यास कल (मागील ७ दिवस)',
    hoursPerDay: 'तास / दिवस',
    noAnalyticsData: 'वैयक्तिक तयारी अंतर्दृष्टी पाहण्यासाठी अभ्यास सत्रे नोंदवा.',
    topicNoteOptional: 'धडा / घटक नोंद (पर्यायी)',
    topicNotePlaceholder: 'उदा. मूलभूत हक्क कलम १९-२२ नोट्स व प्रश्न',
    resetSessionPrompt: 'अभ्यास सत्र रीसेट करायचे?',
    resetSessionDesc: 'आपला सध्याचा जतन न केलेला अभ्यास वेळ काढून टाकण्यात येईल.',
    exitFocusModePrompt: 'फोकस मोडमधून बाहेर पडायचे?',
    exitFocusModeDesc: 'तुम्हाला नक्की फोकस मोड सोडून सामान्य नेव्हिगेशनवर परत यायचे आहे का?',
    stayFocused: 'फोकस कायम ठेवा',
    exitFocusMode: 'फोकस मोडमधून बाहेर पडा',
    studyStreak: 'अभ्यास सातत्य',
    currentStreak: 'सध्याचे सातत्य',
    streakDescription: 'सातत्य हा नागरी सेवा यशाचा पाया आहे. आपले सातत्य टिकवून ठेवण्यासाठी दररोज अभ्यास सत्र पूर्ण करा!',
    days: 'दिवस',
    autoPlanFullWeek: 'पूर्ण आठवड्याचे नियोजन करा',
    entireWeek: 'संपूर्ण आठवडा (सर्व ७ दिवस)',
    singleDayFocus: 'एका दिवसावर लक्ष केंद्रित',
    weeklyScheduleView: 'साप्ताहिक वेळापत्रक दृश्य',
    noTasksForDay: 'या दिवसासाठी कोणतेही कार्य नियोजित नाही',
    addTask: '+ कार्य जोडा',
    autoPlanThisDay: 'या दिवसाचे स्वयंचलित नियोजन करा',
    workloadCapacityGauges: 'कामाचा ताण क्षमता मापक',
    todaysStudyLoad: 'आजचा अभ्यास भार',
    weeklyCumulativeLoad: 'साप्ताहिक संचयी भार',
    plannedAcross7Days: '७ दिवसांमध्ये नियोजित',
    examSyllabusAllocation: 'परीक्षा अभ्यासक्रम वाटप',
    subjectWiseAllocation: 'विषयानुसार वेळ वाटप',
    noSubjectHoursPlanned: 'अद्याप कोणतेही विषय तास नियोजित नाहीत. विषय वितरण पाहण्यासाठी अभ्यास कार्य जोडा.',
    targetExam: 'लक्षित परीक्षा',
    selectExamSubject: '{exam} विषय निवडा',
    saveHoursPrefix: 'जतन करा',
    hoursShort: 'तास',
    minsShort: 'मि',
    subtopics: 'उप-घटक',
    recentStudySessions: 'या आठवड्यातील मागील अभ्यास सत्रे (मागील दिवस)',
    startLiveTimer: 'थेट टायमर सुरू करा',
    logPastHours: 'मागील तास नोंदवा',
    myProfile: 'माझे प्रोफाईल',
    studentAccount: 'विद्यार्थी खाते',
    aspirantSubtitle: 'एमपीएससी / यूपीएससी विद्यार्थी',
    studyOverview: 'अभ्यास विहंगावलोकन',
    dailyStudyGoal: 'दैनंदिन अभ्यास ध्येय',
    personalInfo: 'वैयक्तिक माहिती',
    fullName: 'पूर्ण नाव',
    emailAddress: 'ईमेल पत्ता',
    mobileNumber: 'मोबाइल नंबर',
    examTarget: 'लक्षित परीक्षा',
    preferredSubjects: 'प्राधान्य दिलेले विषय',
    preferences: 'प्राधान्ये',
    studyReminders: 'अभ्यास स्मरणपत्रे',
    setDailyReminderDesc: 'आपले दैनंदिन अभ्यास स्मरणपत्र सेट करा',
    privacyAndAccount: 'गोपनीयता आणि खाते',
    manageAccountSettings: 'आपल्या खात्याच्या सेटिंग्ज व्यवस्थापित करा',
    saveChanges: 'बदल जतन करा',
    savingChanges: 'जतन करत आहे...',
    editProfile: 'प्रोफाईल संपादित करा',
    signOutPrompt: 'साइन आउट करायचे?',
    signOutConfirmDesc: 'तुम्हाला नक्की अभ्यास ट्रॅकरमधून साइन आउट करायचे आहे का?',
    yesSignOut: 'होय, साइन आउट करा',
    yourPrepYourProgress: 'तुमची तयारी, तुमची प्रगती.',
    buildConsistentRoutine: 'एक नियमित दिनचर्या तयार करा',
    reminderHeroDesc: 'आपल्या अभ्यास ध्येयांवर राहण्यासाठी दैनंदिन स्मरणपत्र वेळ निवडा.',
    dailyStudyReminder: 'दैनंदिन अभ्यास स्मरणपत्र',
    reminderEnabled: 'स्मरणपत्र प्राधान्य सक्षम आहे',
    reminderDisabled: 'स्मरणपत्र प्राधान्य अक्षम आहे',
    reminderTime: 'स्मरणपत्र वेळ',
    selectPreferredTime: 'आपली पसंतीची वेळ निवडा.',
    reminderDeviceNote: 'ही प्राधान्ये या डिव्हाइसवर जतन केली आहेत.',
    announcements: 'सूचना',
    allAnnouncements: '← सर्व घोषणा',
    backToApp: '← ॲपवर परत जा',
    announcementDetails: 'घोषणा तपशील',
    completeAnnouncementInfo: 'संपूर्ण घोषणा माहिती',
    announcementsAndStatus: 'घोषणा आणि वाचन स्थिती',
    readStatus: 'वाचलेले',
    unreadStatus: 'न वाचलेले',
    noAnnouncementsYet: 'अद्याप कोणत्याही घोषणा नाहीत',
    announcementCol: 'घोषणा',
    dateCol: 'दिनांक',
    statusCol: 'स्थिती',
    actionCol: 'कृती',
    viewAction: 'पहा',
    studentHelpDesk: 'विद्यार्थी मदत केंद्र',
    helpDeskSubtitle: 'विद्यार्थी मदत, त्रुटी अहवाल आणि नवीन वैशिष्ट्यांची मागणी',
    createTicket: 'नवीन तक्रार नोंदवा',
    viewMyTickets: 'माझ्या तक्रारी पहा',
    appName: 'अभ्यास ट्रॅकर',
    examFocusTag: 'यूपीएससी व एमपीएससी',
    examYearBadge: 'यूपीएससी / एमपीएससी {year}',
    selectDayNext7: 'दिवस निवडा (पुढील ७ दिवस)',
    ofHours: '{h} तासांचे',
    capacityPercentOf: '{hours} चे {pct}%',
    studyBlock: 'ब्लॉक',
    recentSessions: 'मागील सत्रे',
    recentSessionsDesc: 'या कालावधीतील तुमची नोंदवलेली नवीनतम अभ्यास सत्रे.',
    noSessionsRecorded: 'या कालावधीत कोणतेही सत्र नोंदवले गेलेले नाही.',
    studySession: 'अभ्यास सत्र',
    dateUnavailable: 'दिनांक अनुपलब्ध',
    latestCount: 'नवीनतम {count}',
    totalStudied: 'एकूण अभ्यास',
    totalSessions: 'एकूण सत्रे',
    leadingSubject: 'अग्रणी विषय',
    subjectDetails: 'विषय तपशील',
    basedOnSessions: 'या कालावधीत नोंदवलेल्या {count} {sessions}वर आधारित.',
    completeSessionToTrack: 'फोकस गुणवत्ता ट्रॅक करण्यासाठी अभ्यास सत्र पूर्ण करा.',
    // Newly added keys for full Marathi UI coverage
    confirm: 'निश्चित करा',
    topicChecklistHeader: 'विषय सूची व अभ्यासक्रम',
    planForToday: 'आजचे नियोजन',
    autoPlanTomorrow: 'उद्याचे स्वयंचलित नियोजन',
    blueprintIdealRoutine: 'आदर्श दिनचर्या आराखडा',
    blueprintRoutineDesc: 'नागरी सेवा यशासाठी संतुलित दैनिक अभ्यास वेळापत्रक',
    slot1DeepWork: 'सत्र १: सखोल अभ्यास',
    slot1Desc: 'मुख्य विषय, संकल्पना व विश्लेषण',
    tapToViewTopic: 'विषय पाहण्यासाठी टॅप करा',
    slot2Practice: 'सत्र २: सराव व प्रश्नपत्रिका',
    slot2Desc: 'मागील वर्षांचे प्रश्न व सराव प्रश्नमंजुषा',
    slot3CurrentAffairs: 'सत्र ३: चालू घडामोडी व वृत्तपत्र',
    slot3Desc: 'दैनिक वृत्तपत्र, संपादकीय व मासिक घडामोडी',
    blueprintForToday: 'आजचा अभ्यास आराखडा',
    blueprintForTomorrow: 'उद्याचा अभ्यास आराखडा',
    subject: 'विषय',
    offlineStudySubtitle: 'ऑफलाइन पुस्तक किंवा नोट्स अभ्यासाची नोंद करा',
    pastHoursSubtitle: 'मागील अभ्यास सत्रांचे तास जोडा',
    studyDateFormat: 'तारीख',
    savingSession: 'सत्र सेव्ह होत आहे...',
    keepBurning: 'अभ्यास सातत्य उत्तम सुरू आहे!',
    startStreakToday: 'सातत्य सुरू ठेवण्यासाठी आज अभ्यास करा',
    navigation: 'मार्गदर्शन व टॅब',
    accountAndTools: 'साधने आणि खाते',
    studentProfile: 'माझे प्रोफाईल',
    reminders: 'स्मरणपत्रे व अलार्म',
    girlAspirant: 'विद्यार्थिनी (Girl Aspirant)',
    boyAspirant: 'विद्यार्थी (Boy Aspirant)',
    selectAvatar: 'अवतार निवडा',
    notificationsTitle: 'सूचना व संदेश',
    viewNotifications: 'सूचना पहा',
    viewSettings: 'सेटिंग्ज उघडा',
    quickAccessPlanner: 'अभ्यास नियोजक उघडा',
    quickAccessAnalytics: 'अभ्यास अहवाल व विश्लेषण उघडा',
    examMPSC_UPSC: 'एमपीएससी / यूपीएससी',
    allExams: 'सर्व परीक्षा',
    targetExam: 'लक्षित परीक्षा',
    preferredSubjectsList: 'प्राधान्य दिलेले विषय',
    politySubject: 'भारतीय राज्यव्यवस्था आणि प्रशासन',
    historySubject: 'इतिहास आणि संस्कृती',
    geographySubject: 'भूगोल',
    economySubject: 'भारतीय अर्थव्यवस्था',
    csatSubject: 'सीसॅट (CSAT)',
    ethicsSubject: 'नीतीशास्त्र (Ethics)',
  }
};

/**
 * Helper to fetch translation with fallback to English then key itself
 */
export const getTranslation = (lang, key, fallback = '') => {
  return (
    translations[lang]?.[key] ||
    translations.en?.[key] ||
    fallback ||
    key
  );
};

// ==================== TRILINGUAL SUBJECT TRANSLATIONS ====================
export const SUBJECT_TRANSLATIONS = {
  // UPSC Civil Services
  'upsc-history-culture': {
    id: 'upsc-history-culture',
    exam: 'UPSC',
    en: 'History and Culture',
    hi: 'इतिहास और संस्कृति',
    mr: 'इतिहास आणि संस्कृती'
  },
  'upsc-geography': {
    id: 'upsc-geography',
    exam: 'UPSC',
    en: 'Geography',
    hi: 'भूगोल',
    mr: 'भूगोल'
  },
  'upsc-polity': {
    id: 'upsc-polity',
    exam: 'UPSC',
    en: 'Indian Polity and Governance',
    hi: 'भारतीय राजव्यवस्था और शासन',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'upsc-economy': {
    id: 'upsc-economy',
    exam: 'UPSC',
    en: 'Indian Economy',
    hi: 'भारतीय अर्थव्यवस्था',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'upsc-environment': {
    id: 'upsc-environment',
    exam: 'UPSC',
    en: 'Environment and Ecology',
    hi: 'पर्यावरण और पारिस्थितिकी',
    mr: 'पर्यावरण आणि परिसंस्था'
  },
  'upsc-science-tech': {
    id: 'upsc-science-tech',
    exam: 'UPSC',
    en: 'Science and Technology',
    hi: 'विज्ञान और प्रौद्योगिकी',
    mr: 'विज्ञान आणि तंत्रज्ञान'
  },
  'upsc-current-affairs': {
    id: 'upsc-current-affairs',
    exam: 'UPSC',
    en: 'Current Affairs',
    hi: 'समसामयिक घटनाएं (करंट अफेयर्स)',
    mr: 'चालू घडामोडी'
  },
  'upsc-csat': {
    id: 'upsc-csat',
    exam: 'UPSC',
    en: 'CSAT (Prelims Paper II)',
    hi: 'सीसैट (प्रारंभिक परीक्षा पेपर II)',
    mr: 'सीसॅट (पूर्व परीक्षा पेपर II)'
  },
  'upsc-ethics': {
    id: 'upsc-ethics',
    exam: 'UPSC',
    en: 'Ethics, Integrity and Aptitude (Mains)',
    hi: 'नीतिशास्त्र, सत्यनिष्ठा और अभिरुचि (मुख्य)',
    mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता (मुख्य)'
  },

  // MPSC Maharashtra State Services
  'mpsc-history': {
    id: 'mpsc-history',
    exam: 'MPSC',
    en: 'Maharashtra and Indian History',
    hi: 'महाराष्ट्र और भारत का इतिहास',
    mr: 'महाराष्ट्र आणि भारताचा इतिहास'
  },
  'mpsc-geography': {
    id: 'mpsc-geography',
    exam: 'MPSC',
    en: 'Maharashtra and Indian Geography',
    hi: 'महाराष्ट्र और भारत का भूगोल',
    mr: 'महाराष्ट्र आणि भारताचा भूगोल'
  },
  'mpsc-polity': {
    id: 'mpsc-polity',
    exam: 'MPSC',
    en: 'Constitution & Administration',
    hi: 'संविधान और प्रशासन',
    mr: 'संविधान आणि प्रशासन'
  },
  'mpsc-economy': {
    id: 'mpsc-economy',
    exam: 'MPSC',
    en: 'Indian and Maharashtra Economy',
    hi: 'भारतीय और महाराष्ट्र अर्थव्यवस्था',
    mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था'
  },
  'mpsc-marathi': {
    id: 'mpsc-marathi',
    exam: 'MPSC',
    en: 'Marathi Language',
    hi: 'मराठी भाषा',
    mr: 'मराठी भाषा'
  },
  'mpsc-english': {
    id: 'mpsc-english',
    exam: 'MPSC',
    en: 'English Language',
    hi: 'अंग्रेजी भाषा',
    mr: 'इंग्रजी भाषा'
  },
  'mpsc-aptitude': {
    id: 'mpsc-aptitude',
    exam: 'MPSC',
    en: 'Aptitude and Reasoning',
    hi: 'अभिक्षमता और तार्किक क्षमता',
    mr: 'अंकगणित आणि बुद्धिमत्ता चाचणी'
  },
  'mpsc-environment-science': {
    id: 'mpsc-environment-science',
    exam: 'MPSC',
    en: 'Environment and Science',
    hi: 'पर्यावरण और सामान्य विज्ञान',
    mr: 'पर्यावरण आणि सामान्य विज्ञान'
  },
  'mpsc-current-affairs': {
    id: 'mpsc-current-affairs',
    exam: 'MPSC',
    en: 'Current Affairs',
    hi: 'समसामयिक घटनाएं (करंट अफेयर्स)',
    mr: 'चालू घडामोडी'
  },

  // Legacy & Alias IDs
  'polity': {
    en: 'Indian Polity and Governance',
    hi: 'भारतीय राजव्यवस्था और शासन',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'history': {
    en: 'History of Modern India',
    hi: 'आधुनिक भारत का इतिहास',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'economy': {
    en: 'Indian Economy',
    hi: 'भारतीय अर्थव्यवस्था',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'geography': {
    en: 'Geography',
    hi: 'भूगोल',
    mr: 'भूगोल'
  },
  'Indian Polity and Governance': {
    en: 'Indian Polity and Governance',
    hi: 'भारतीय राजव्यवस्था और शासन',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'History and Culture': {
    en: 'History and Culture',
    hi: 'इतिहास और संस्कृति',
    mr: 'इतिहास आणि संस्कृती'
  },
  'History of Modern India': {
    en: 'History of Modern India',
    hi: 'आधुनिक भारत का इतिहास',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'Maharashtra and Indian History': {
    en: 'Maharashtra and Indian History',
    hi: 'महाराष्ट्र और भारत का इतिहास',
    mr: 'महाराष्ट्र आणि भारताचा इतिहास'
  },
  'Maharashtra and Indian Geography': {
    en: 'Maharashtra and Indian Geography',
    hi: 'महाराष्ट्र और भारत का भूगोल',
    mr: 'महाराष्ट्र आणि भारताचा भूगोल'
  },
  'Indian Economy': {
    en: 'Indian Economy',
    hi: 'भारतीय अर्थव्यवस्था',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'Indian and Maharashtra Economy': {
    en: 'Indian and Maharashtra Economy',
    hi: 'भारतीय और महाराष्ट्र अर्थव्यवस्था',
    mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था'
  },
  'Environment and Ecology': {
    en: 'Environment and Ecology',
    hi: 'पर्यावरण और पारिस्थितिकी',
    mr: 'पर्यावरण आणि परिसंस्था'
  },
  'Science and Technology': {
    en: 'Science and Technology',
    hi: 'विज्ञान और प्रौद्योगिकी',
    mr: 'विज्ञान आणि तंत्रज्ञान'
  },
  'Current Affairs': {
    en: 'Current Affairs',
    hi: 'समसामयिक घटनाएं (करंट अफेयर्स)',
    mr: 'चालू घडामोडी'
  },
  'Constitution & Administration': {
    en: 'Constitution & Administration',
    hi: 'संविधान और प्रशासन',
    mr: 'संविधान आणि प्रशासन'
  },
  'Indian Constitution and Maharashtra Administration': {
    en: 'Constitution & Administration',
    hi: 'संविधान और प्रशासन',
    mr: 'संविधान आणि प्रशासन'
  },
  'CSAT (Prelims Paper II)': {
    en: 'CSAT (Prelims Paper II)',
    hi: 'सीसैट (प्रारंभिक परीक्षा पेपर II)',
    mr: 'सीसॅट (पूर्व परीक्षा पेपर II)'
  },
  'Ethics, Integrity and Aptitude': {
    en: 'Ethics, Integrity and Aptitude',
    hi: 'नीतिशास्त्र, सत्यनिष्ठा और अभिरुचि',
    mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता'
  },
  'Ethics, Integrity and Aptitude (Mains)': {
    en: 'Ethics, Integrity and Aptitude (Mains)',
    hi: 'नीतिशास्त्र, सत्यनिष्ठा और अभिरुचि (मुख्य)',
    mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता (मुख्य)'
  },
  'Marathi Language': {
    en: 'Marathi Language',
    hi: 'मराठी भाषा',
    mr: 'मराठी भाषा'
  },
  'English Language': {
    en: 'English Language',
    hi: 'अंग्रेजी भाषा',
    mr: 'इंग्रजी भाषा'
  },
  'Aptitude and Reasoning': {
    en: 'Aptitude and Reasoning',
    hi: 'अभिक्षमता और तार्किक क्षमता',
    mr: 'अंकगणित आणि बुद्धिमत्ता चाचणी'
  },
  'Environment and Science': {
    en: 'Environment and Science',
    hi: 'पर्यावरण और सामान्य विज्ञान',
    mr: 'पर्यावरण आणि सामान्य विज्ञान'
  }
};

// ==================== TRILINGUAL TOPIC TRANSLATIONS ====================
export const TOPIC_TRANSLATIONS = {
  // Polity & Administration
  'Constitution of India': {
    en: 'Constitution of India',
    hi: 'भारत का संविधान',
    mr: 'भारताचे संविधान'
  },
  'Fundamental Rights and Duties': {
    en: 'Fundamental Rights and Duties',
    hi: 'मौलिक अधिकार और कर्तव्य',
    mr: 'मूलभूत हक्क आणि कर्तव्ये'
  },
  'Fundamental Rights': {
    en: 'Fundamental Rights',
    hi: 'मौलिक अधिकार',
    mr: 'मूलभूत हक्क'
  },
  'Directive Principles of State Policy': {
    en: 'Directive Principles of State Policy',
    hi: 'राज्य के नीति निर्देशक तत्व',
    mr: 'राज्याच्या धोरणाची मार्गदर्शक तत्त्वे'
  },
  'Parliament and state legislatures': {
    en: 'Parliament and state legislatures',
    hi: 'संसद और राज्य विधानमंडल',
    mr: 'संसद आणि राज्य विधीमंडळ'
  },
  'Parliament and state legislature': {
    en: 'Parliament and state legislature',
    hi: 'संसद और राज्य विधानमंडल',
    mr: 'संसद आणि राज्य विधीमंडळ'
  },
  'President, Prime Minister and judiciary': {
    en: 'President, Prime Minister and judiciary',
    hi: 'राष्ट्रपति, प्रधानमंत्री और न्यायपालिका',
    mr: 'राष्ट्रपती, पंतप्रधान आणि न्यायव्यवस्था'
  },
  'President, Prime Minister and Judiciary': {
    en: 'President, Prime Minister and Judiciary',
    hi: 'राष्ट्रपति, प्रधानमंत्री और न्यायपालिका',
    mr: 'राष्ट्रपती, पंतप्रधान आणि न्यायव्यवस्था'
  },
  'Panchayati Raj and local government': {
    en: 'Panchayati Raj and local government',
    hi: 'पंचायती राज और स्थानीय शासन',
    mr: 'पंचायती राज आणि स्थानिक स्वराज्य'
  },
  'Constitutional and statutory bodies': {
    en: 'Constitutional and statutory bodies',
    hi: 'संवैधानिक और वैधानिक निकाय',
    mr: 'संवैधानिक आणि वैधानिक संस्था'
  },
  'Indian Constitution and fundamental rights': {
    en: 'Indian Constitution and fundamental rights',
    hi: 'भारतीय संविधान और मौलिक अधिकार',
    mr: 'भारतीय संविधान आणि मूलभूत हक्क'
  },
  'Governor and Chief Minister': {
    en: 'Governor and Chief Minister',
    hi: 'राज्यपाल और मुख्यमंत्री',
    mr: 'राज्यपाल आणि मुख्यमंत्री'
  },
  'Maharashtra government structure': {
    en: 'Maharashtra government structure',
    hi: 'महाराष्ट्र शासन संरचना',
    mr: 'महाराष्ट्र शासन संरचना'
  },
  'Local self-government': {
    en: 'Local self-government',
    hi: 'स्थानीय स्वशासन',
    mr: 'स्थानिक स्वराज्य संस्था'
  },
  'Panchayati Raj and urban administration': {
    en: 'Panchayati Raj and urban administration',
    hi: 'पंचायती राज और शहरी प्रशासन',
    mr: 'पंचायती राज आणि नागरी प्रशासन'
  },

  // History & Culture
  'Ancient Indian history': {
    en: 'Ancient Indian history',
    hi: 'प्राचीन भारत का इतिहास',
    mr: 'प्राचीन भारताचा इतिहास'
  },
  'Medieval Indian history': {
    en: 'Medieval Indian history',
    hi: 'मध्यकालीन भारत का इतिहास',
    mr: 'मध्ययुगीन भारताचा इतिहास'
  },
  'Modern Indian history': {
    en: 'Modern Indian history',
    hi: 'आधुनिक भारत का इतिहास',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'History of Modern India': {
    en: 'History of Modern India',
    hi: 'आधुनिक भारत का इतिहास',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'Indian freedom struggle': {
    en: 'Indian freedom struggle',
    hi: 'भारतीय स्वतंत्रता संग्राम',
    mr: 'भारतीय स्वातंत्र्य लढा'
  },
  'Indian freedom struggle & Gandhian Movements': {
    en: 'Indian freedom struggle & Gandhian Movements',
    hi: 'भारतीय स्वतंत्रता संग्राम और गांधीवादी आंदोलन',
    mr: 'भारतीय स्वातंत्र्य लढा आणि गांधीवादी चळवळी'
  },
  'Art, architecture and culture': {
    en: 'Art, architecture and culture',
    hi: 'कला, स्थापत्य और संस्कृति',
    mr: 'कला, स्थापत्य आणि संस्कृती'
  },
  'World history (Mains)': {
    en: 'World history (Mains)',
    hi: 'विश्व इतिहास (मुख्य)',
    mr: 'जागतिक इतिहास (मुख्य)'
  },
  'Ancient and medieval Indian history': {
    en: 'Ancient and medieval Indian history',
    hi: 'प्राचीन और मध्यकालीन भारत का इतिहास',
    mr: 'प्राचीन आणि मध्ययुगीन भारताचा इतिहास'
  },
  'Modern India and freedom struggle': {
    en: 'Modern India and freedom struggle',
    hi: 'आधुनिक भारत और स्वतंत्रता संग्राम',
    mr: 'आधुनिक भारत आणि स्वातंत्र्य लढा'
  },
  'Chhatrapati Shivaji Maharaj': {
    en: 'Chhatrapati Shivaji Maharaj',
    hi: 'छत्रपति शिवाजी महाराज',
    mr: 'छत्रपती शिवाजी महाराज'
  },
  'Maratha Empire and Peshwa period': {
    en: 'Maratha Empire and Peshwa period',
    hi: 'मराठा साम्राज्य और पेशवा काल',
    mr: 'मराठा साम्राज्य आणि पेशवे काळ'
  },
  'Social reformers of Maharashtra': {
    en: 'Social reformers of Maharashtra',
    hi: 'महाराष्ट्र के समाज सुधारक',
    mr: 'महाराष्ट्रातील समाजसुधारक'
  },
  "Maharashtra's formation in 1960": {
    en: "Maharashtra's formation in 1960",
    hi: 'संयुक्त महाराष्ट्र आंदोलन और गठन (1960)',
    mr: 'संयुक्त महाराष्ट्र चळवळ व निर्मिती (१९६०)'
  },

  // Geography
  'Physical geography': {
    en: 'Physical geography',
    hi: 'भौतिक भूगोल',
    mr: 'प्राकृतिक भूगोल'
  },
  'Indian geography': {
    en: 'Indian geography',
    hi: 'भारत का भूगोल',
    mr: 'भारताचा भूगोल'
  },
  'World geography': {
    en: 'World geography',
    hi: 'विश्व भूगोल',
    mr: 'जगाचा भूगोल'
  },
  'Climate, rivers and monsoons': {
    en: 'Climate, rivers and monsoons',
    hi: 'जलवायु, नदियां और मानसून',
    mr: 'हवामान, नद्या आणि मान्सून'
  },
  'Agriculture and natural resources': {
    en: 'Agriculture and natural resources',
    hi: 'कृषि और प्राकृतिक संसाधन',
    mr: 'शेती आणि नैसर्गिक संसाधने'
  },
  'Human and economic geography': {
    en: 'Human and economic geography',
    hi: 'मानव और आर्थिक भूगोल',
    mr: 'मानवी आणि आर्थिक भूगोल'
  },
  'Sahyadri and Western Ghats': {
    en: 'Sahyadri and Western Ghats',
    hi: 'सह्याद्री और पश्चिमी घाट',
    mr: 'सह्याद्री आणि पश्चिम घाट'
  },
  "Maharashtra's districts and divisions": {
    en: "Maharashtra's districts and divisions",
    hi: 'महाराष्ट्र के जिले और संभाग',
    mr: 'महाराष्ट्राचे जिल्हे आणि प्रशासकीय विभाग'
  },
  'Godavari, Krishna and other river systems': {
    en: 'Godavari, Krishna and other river systems',
    hi: 'गोदावरी, कृष्णा और अन्य नदी प्रणालियां',
    mr: 'गोदावरी, कृष्णा व इतर नद्यांची खोरी'
  },
  'Climate, rainfall and soils': {
    en: 'Climate, rainfall and soils',
    hi: 'जलवायु, वर्षा और मिट्टी',
    mr: 'हवामान, पर्जन्य आणि मृदा'
  },
  'Agriculture and irrigation': {
    en: 'Agriculture and irrigation',
    hi: 'कृषि और सिंचाई',
    mr: 'शेती आणि जलसिंचन'
  },
  'Minerals, industries and population': {
    en: 'Minerals, industries and population',
    hi: 'खनिज, उद्योग और जनसंख्या',
    mr: 'खनिजे, उद्योग आणि लोकसंख्या'
  },

  // Economy
  'GDP, inflation and national income': {
    en: 'GDP, inflation and national income',
    hi: 'जीडीपी, मुद्रास्फीति और राष्ट्रीय आय',
    mr: 'जीडीपी, महागाई आणि राष्ट्रीय उत्पन्न'
  },
  'Banking and monetary policy': {
    en: 'Banking and monetary policy',
    hi: 'बैंकिंग और मौद्रिक नीति',
    mr: 'बँकिंग आणि चलनविषयक धोरण'
  },
  'Budget and taxation': {
    en: 'Budget and taxation',
    hi: 'बजट और कराधान',
    mr: 'अर्थसंकल्प आणि करप्रणाली'
  },
  'Poverty, unemployment and development': {
    en: 'Poverty, unemployment and development',
    hi: 'गरीबी, बेरोजगारी और विकास',
    mr: 'दारिद्र्य, बेरोजगारी आणि विकास'
  },
  'Agriculture and industry': {
    en: 'Agriculture and industry',
    hi: 'कृषि और उद्योग',
    mr: 'शेती आणि उद्योग'
  },
  'Government economic schemes': {
    en: 'Government economic schemes',
    hi: 'सरकारी आर्थिक योजनाएं',
    mr: 'सरकारी आर्थिक योजना'
  },
  'Basic economic concepts': {
    en: 'Basic economic concepts',
    hi: 'बुनियादी आर्थिक अवधारणाएं',
    mr: 'मूलभूत आर्थिक संकल्पना'
  },
  'State budget and economic survey': {
    en: 'State budget and economic survey',
    hi: 'राज्य बजट और आर्थिक सर्वेक्षण',
    mr: 'राज्य अर्थसंकल्प आणि आर्थिक पाहणी'
  },
  'Maharashtra agriculture and industries': {
    en: 'Maharashtra agriculture and industries',
    hi: 'महाराष्ट्र में कृषि और उद्योग',
    mr: 'महाराष्ट्रातील शेती आणि उद्योग'
  },
  'Banking, inflation and taxation': {
    en: 'Banking, inflation and taxation',
    hi: 'बैंकिंग, मुद्रास्फीति और कराधान',
    mr: 'बँकिंग, महागाई आणि करप्रणाली'
  },
  'Poverty and unemployment': {
    en: 'Poverty and unemployment',
    hi: 'गरीबी और बेरोजगारी',
    mr: 'दारिद्र्य आणि बेरोजगारी'
  },
  'State and central government schemes': {
    en: 'State and central government schemes',
    hi: 'राज्य और केंद्र सरकार की योजनाएं',
    mr: 'राज्य व केंद्र सरकारच्या योजना'
  },

  // Environment & Science
  'Ecosystems and food chains': {
    en: 'Ecosystems and food chains',
    hi: 'पारिस्थितिकी तंत्र और खाद्य श्रृंखला',
    mr: 'परिसंस्था आणि अन्नसाखळी'
  },
  'Biodiversity and conservation': {
    en: 'Biodiversity and conservation',
    hi: 'जैव विविधता और संरक्षण',
    mr: 'जैवविविधता आणि संवर्धन'
  },
  'National parks and wildlife sanctuaries': {
    en: 'National parks and wildlife sanctuaries',
    hi: 'राष्ट्रीय उद्यान और वन्यजीव अभयारण्य',
    mr: 'राष्ट्रीय उद्याने आणि वन्यजीव अभयारण्ये'
  },
  'Climate change and global warming': {
    en: 'Climate change and global warming',
    hi: 'जलवायु परिवर्तन और ग्लोबल वार्मिंग',
    mr: 'हवामान बदल आणि ग्लोबल वॉर्मिंग'
  },
  'Pollution and environmental laws': {
    en: 'Pollution and environmental laws',
    hi: 'प्रदूषण और पर्यावरण कानून',
    mr: 'प्रदूषण आणि पर्यावरण कायदे'
  },
  'Ecology and biodiversity': {
    en: 'Ecology and biodiversity',
    hi: 'पारिस्थितिकी और जैव विविधता',
    mr: 'पर्यावरण आणि जैवविविधता'
  },
  'Pollution and climate change': {
    en: 'Pollution and climate change',
    hi: 'प्रदूषण और जलवायु परिवर्तन',
    mr: 'प्रदूषण आणि हवामान बदल'
  },
  'General science': {
    en: 'General science',
    hi: 'सामान्य विज्ञान',
    mr: 'सामान्य विज्ञान'
  },
  'Health and technology': {
    en: 'Health and technology',
    hi: 'स्वास्थ्य और प्रौद्योगिकी',
    mr: 'आरोग्य आणि तंत्रज्ञान'
  },
  'Maharashtra forests and wildlife': {
    en: 'Maharashtra forests and wildlife',
    hi: 'महाराष्ट्र के वन और वन्यजीव',
    mr: 'महाराष्ट्रातील वने आणि वन्यजीव'
  },
  'Physics, chemistry and biology basics': {
    en: 'Physics, chemistry and biology basics',
    hi: 'भौतिकी, रसायन और जीव विज्ञान की मूल बातें',
    mr: 'भौतिक, रसायन आणि जीवशास्त्र मूलभूत संकल्पना'
  },
  'Space technology and satellites': {
    en: 'Space technology and satellites',
    hi: 'अंतरिक्ष प्रौद्योगिकी और उपग्रह',
    mr: 'अंतराळ तंत्रज्ञान आणि उपग्रह'
  },
  'Biotechnology': {
    en: 'Biotechnology',
    hi: 'जैव प्रौद्योगिकी',
    mr: 'जैवतंत्रज्ञान'
  },
  'Artificial intelligence and emerging technologies': {
    en: 'Artificial intelligence and emerging technologies',
    hi: 'कृत्रिम बुद्धिमत्ता और उभरती प्रौद्योगिकियां',
    mr: 'कृत्रिम बुद्धिमत्ता आणि उदयोन्मुख तंत्रज्ञान'
  },
  'Health and scientific developments': {
    en: 'Health and scientific developments',
    hi: 'स्वास्थ्य और वैज्ञानिक विकास',
    mr: 'आरोग्य आणि वैज्ञानिक घडामोडी'
  },

  // CSAT & Languages
  'Reading comprehension': {
    en: 'Reading comprehension',
    hi: 'गद्यांश और बोधगम्यता',
    mr: 'उतारे व आकलन'
  },
  'Logical reasoning': {
    en: 'Logical reasoning',
    hi: 'तार्किक तर्कशक्ति',
    mr: 'तर्कशुद्ध विचारक्षमता'
  },
  'Analytical ability': {
    en: 'Analytical ability',
    hi: 'विश्लेषणात्मक क्षमता',
    mr: 'विश्लेषण क्षमता'
  },
  'Basic mathematics': {
    en: 'Basic mathematics',
    hi: 'बुनियादी गणित और अंकगणित',
    mr: 'मूलभूत गणित'
  },
  'Data interpretation': {
    en: 'Data interpretation',
    hi: 'डेटा व्याख्या (डीआई)',
    mr: 'माहितीचे विश्लेषण'
  },
  'Decision-making and problem-solving': {
    en: 'Decision-making and problem-solving',
    hi: 'निर्णय लेना और समस्या समाधान',
    mr: 'निर्णय प्रक्रिया व समस्या निवारण'
  },
  'Grammar and sentence structure': {
    en: 'Grammar and sentence structure',
    hi: 'व्याकरण और वाक्य रचना',
    mr: 'व्याकरण आणि वाक्यरचना'
  },
  'Vocabulary and synonyms': {
    en: 'Vocabulary and synonyms',
    hi: 'शब्दसंग्रह और पर्यायवाची',
    mr: 'शब्दसंग्रह आणि समानार्थी शब्द'
  },
  'Antonyms and idioms': {
    en: 'Antonyms and idioms',
    hi: 'विलोम शब्द और मुहावरे',
    mr: 'विरुद्धार्थी शब्द आणि वाक्प्रचार'
  },
  'Sentence correction and usage': {
    en: 'Sentence correction and usage',
    hi: 'वाक्य शुद्धि और प्रयोग',
    mr: 'वाक्य दुरुस्ती व उपयोग'
  },
  'Grammar and vocabulary': {
    en: 'Grammar and vocabulary',
    hi: 'व्याकरण और शब्दावली',
    mr: 'व्याकरण आणि शब्दसंग्रह'
  },
  'Synonyms and antonyms': {
    en: 'Synonyms and antonyms',
    hi: 'समानार्थी और विलोम शब्द',
    mr: 'समानार्थी आणि विरुद्धार्थी शब्द'
  },
  'Sentence correction': {
    en: 'Sentence correction',
    hi: 'वाक्य सुधार',
    mr: 'वाक्य दुरुस्ती'
  },
  'Comprehension': {
    en: 'Comprehension',
    hi: 'बोधगम्यता और समझ',
    mr: 'आकलन'
  },
  'Basic usage and writing skills': {
    en: 'Basic usage and writing skills',
    hi: 'बुनियादी प्रयोग और लेखन कौशल',
    mr: 'मूलभूत उपयोग आणि लेखन कौशल्य'
  },
  'Number systems and percentages': {
    en: 'Number systems and percentages',
    hi: 'संख्या प्रणाली और प्रतिशत',
    mr: 'संख्या पद्धती आणि टक्केवारी'
  },
  'Ratio and proportion': {
    en: 'Ratio and proportion',
    hi: 'अनुपात और समानुपात',
    mr: 'गुणोत्तर आणि प्रमाण'
  },
  'Time, speed and distance': {
    en: 'Time, speed and distance',
    hi: 'समय, गति और दूरी',
    mr: 'वेळ, वेग आणि अंतर'
  },
  'Mental ability': {
    en: 'Mental ability',
    hi: 'मानसिक योग्यता',
    mr: 'मानसिक क्षमता चाचणी'
  },

  // Ethics & Current Affairs
  'Ethics and human values': {
    en: 'Ethics and human values',
    hi: 'नीतिशास्त्र और मानवीय मूल्य',
    mr: 'नीतिशास्त्र आणि मानवी मूल्ये'
  },
  'Integrity and impartiality': {
    en: 'Integrity and impartiality',
    hi: 'सत्यनिष्ठा और निष्पक्षता',
    mr: 'सत्यनिष्ठा आणि निष्पक्षता'
  },
  'Emotional intelligence': {
    en: 'Emotional intelligence',
    hi: 'भावनात्मक बुद्धिमत्ता',
    mr: 'भावनिक बुद्धिमत्ता'
  },
  'Public service values': {
    en: 'Public service values',
    hi: 'लोक सेवा मूल्य',
    mr: 'लोकसेवा मूल्ये'
  },
  'Case studies and ethical dilemmas': {
    en: 'Case studies and ethical dilemmas',
    hi: 'केस स्टडीज और नैतिक दुविधाएं',
    mr: 'प्रकरण अभ्यास आणि नैतिक पेच'
  },
  'National and international news': {
    en: 'National and international news',
    hi: 'राष्ट्रीय और अंतर्राष्ट्रीय समाचार',
    mr: 'राष्ट्रीय आणि आंतरराष्ट्रीय घडामोडी'
  },
  'Government policies and schemes': {
    en: 'Government policies and schemes',
    hi: 'सरकारी नीतियां और योजनाएं',
    mr: 'सरकारी धोरणे आणि योजना'
  },
  'Important reports and indices': {
    en: 'Important reports and indices',
    hi: 'महत्वपूर्ण रिपोर्ट और सूचकांक',
    mr: 'महत्त्वाचे अहवाल आणि निर्देशांक'
  },
  'International organisations': {
    en: 'International organisations',
    hi: 'अंतर्राष्ट्रीय संगठन',
    mr: 'आंतरराष्ट्रीय संघटना'
  },
  'Awards, appointments and major events': {
    en: 'Awards, appointments and major events',
    hi: 'पुरस्कार, नियुक्तियां और प्रमुख घटनाएं',
    mr: 'पुरस्कार, नियुक्त्या आणि महत्त्वाच्या घटना'
  },
  'Maharashtra government decisions': {
    en: 'Maharashtra government decisions',
    hi: 'महाराष्ट्र सरकार के निर्णय',
    mr: 'महाराष्ट्र शासनाचे निर्णय'
  },
  'State and national schemes': {
    en: 'State and national schemes',
    hi: 'राज्य और राष्ट्रीय योजनाएं',
    mr: 'राज्य व राष्ट्रीय योजना'
  },
  'National and international events': {
    en: 'National and international events',
    hi: 'राष्ट्रीय और अंतर्राष्ट्रीय घटनाएं',
    mr: 'राष्ट्रीय आणि आंतरराष्ट्रीय घडामोडी'
  },
  'Important appointments and awards': {
    en: 'Important appointments and awards',
    hi: 'महत्वपूर्ण नियुक्तियां और पुरस्कार',
    mr: 'महत्त्वाच्या नियुक्त्या आणि पुरस्कार'
  },
  'Maharashtra economic and social developments': {
    en: 'Maharashtra economic and social developments',
    hi: 'महाराष्ट्र का आर्थिक और सामाजिक विकास',
    mr: 'महाराष्ट्रातील आर्थिक व सामाजिक घडामोडी'
  }
};

// ==================== TRILINGUAL CHAPTER TRANSLATIONS ====================
export const CHAPTER_TRANSLATIONS = {
  'History and Culture': { en: 'History and Culture', hi: 'इतिहास और संस्कृति', mr: 'इतिहास आणि संस्कृती' },
  'Geography': { en: 'Geography', hi: 'भूगोल', mr: 'भूगोल' },
  'Indian Polity and Governance': { en: 'Indian Polity and Governance', hi: 'भारतीय राजव्यवस्था और शासन', mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन' },
  'Indian Economy': { en: 'Indian Economy', hi: 'भारतीय अर्थव्यवस्था', mr: 'भारतीय अर्थव्यवस्था' },
  'Environment and Ecology': { en: 'Environment and Ecology', hi: 'पर्यावरण और पारिस्थितिकी', mr: 'पर्यावरण आणि परिसंस्था' },
  'Science and Technology': { en: 'Science and Technology', hi: 'विज्ञान और प्रौद्योगिकी', mr: 'विज्ञान आणि तंत्रज्ञान' },
  'Current Affairs': { en: 'Current Affairs', hi: 'समसामयिक घटनाएं (करंट अफेयर्स)', mr: 'चालू घडामोडी' },
  'CSAT (Prelims Paper II)': { en: 'CSAT (Prelims Paper II)', hi: 'सीसैट (प्रारंभिक परीक्षा पेपर II)', mr: 'सीसॅट (पूर्व परीक्षा पेपर II)' },
  'Ethics, Integrity and Aptitude': { en: 'Ethics, Integrity and Aptitude', hi: 'नीतिशास्त्र, सत्यनिष्ठा और अभिरुचि', mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता' },
  'Maharashtra and Indian History': { en: 'Maharashtra and Indian History', hi: 'महाराष्ट्र और भारत का इतिहास', mr: 'महाराष्ट्र आणि भारताचा इतिहास' },
  'Maharashtra and Indian Geography': { en: 'Maharashtra and Indian Geography', hi: 'महाराष्ट्र और भारत का भूगोल', mr: 'महाराष्ट्र आणि भारताचा भूगोल' },
  'Constitution & Administration': { en: 'Constitution & Administration', hi: 'संविधान और प्रशासन', mr: 'संविधान आणि प्रशासन' },
  'Indian and Maharashtra Economy': { en: 'Indian and Maharashtra Economy', hi: 'भारतीय और महाराष्ट्र अर्थव्यवस्था', mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था' },
  'Marathi Language': { en: 'Marathi Language', hi: 'मराठी भाषा', mr: 'मराठी भाषा' },
  'English Language': { en: 'English Language', hi: 'अंग्रेजी भाषा', mr: 'इंग्रजी भाषा' },
  'Aptitude and Reasoning': { en: 'Aptitude and Reasoning', hi: 'अभिक्षमता और तार्किक क्षमता', mr: 'अंकगणित आणि बुद्धिमत्ता' },
  'Environment and Science': { en: 'Environment and Science', hi: 'पर्यावरण और सामान्य विज्ञान', mr: 'पर्यावरण आणि सामान्य विज्ञान' }
};

// ==================== TRILINGUAL MOTIVATIONAL QUOTES ====================
export const DAILY_MOTIVATIONAL_QUOTES = [
  {
    quote: {
      en: "Energy and persistence conquer all things.",
      hi: "ऊर्जा और दृढ़ता से सब कुछ जीता जा सकता है।",
      mr: "ऊर्जा आणि चिकाटीने सर्व काही साध्य करता येते."
    },
    author: {
      en: "Benjamin Franklin",
      hi: "बेंजामिन फ्रैंकलिन",
      mr: "बेंजामिन फ्रँकलिन"
    }
  },
  {
    quote: {
      en: "The secret of getting ahead is getting started. Break your syllabus into small manageable daily blocks.",
      hi: "आगे बढ़ने का रहस्य शुरुआत करना है। अपने पाठ्यक्रम को छोटे, प्रबंधनीय दैनिक हिस्सों में बांटें।",
      mr: "पुढे जाण्याचे रहस्य म्हणजे सुरुवात करणे. तुमचा अभ्यासक्रम लहान दैनंदिन घटकांमध्ये विभागा."
    },
    author: {
      en: "Mark Twain",
      hi: "मार्क ट्वेन",
      mr: "मार्क ट्वेन"
    }
  },
  {
    quote: {
      en: "It does not matter how slowly you go as long as you do not stop.",
      hi: "यह मायने नहीं रखता कि आप कितनी धीमी गति से चलते हैं, जब तक कि आप रुकते नहीं हैं।",
      mr: "तुम्ही किती हळू चालता याने फरक पडत नाही, जोपर्यंत तुम्ही थांबत नाही."
    },
    author: {
      en: "Confucius",
      hi: "कन्फ्यूशियस",
      mr: "कन्फ्यूशियस"
    }
  },
  {
    quote: {
      en: "The difference between ordinary and extraordinary is that little extra effort each day.",
      hi: "साधारण और असाधारण के बीच का अंतर हर दिन का थोड़ा सा अतिरिक्त प्रयास है।",
      mr: "सामान्य आणि असामान्य यांच्यातील फरक म्हणजे दररोजचा थोडासा अतिरिक्त प्रयत्न."
    },
    author: {
      en: "Jimmy Johnson",
      hi: "जिमी जॉनसन",
      mr: "जिमी जॉन्सन"
    }
  },
  {
    quote: {
      en: "Doubt kills more dreams than failure ever will. Trust your preparation and revision cycle.",
      hi: "संदेह असफलता से अधिक सपनों को मार देता है। अपनी तैयारी और पुनरावृत्ति चक्र पर विश्वास रखें।",
      mr: "अपयशापेक्षा शंका जास्त स्वप्ने नष्ट करते. तुमच्या तयारीवर आणि उजळणीवर विश्वास ठेवा."
    },
    author: {
      en: "Suzy Kassem",
      hi: "सुजी कासेम",
      mr: "सुझी कासेम"
    }
  },
  {
    quote: {
      en: "When you feel like quitting, remember why you started this civil services dream.",
      hi: "जब आपका मन हार मानने का करे, तो याद करें कि आपने सिविल सेवा का यह सपना क्यों शुरू किया था।",
      mr: "जेव्हा अभ्यास सोडावासा वाटेल, तेव्हा आठवा की तुम्ही हे नागरी सेवेचे स्वप्न का सुरू केले होते."
    },
    author: {
      en: "MPSC & UPSC Aspirants",
      hi: "यूपीएससी और एमपीएससी अभ्यर्थी",
      mr: "यूपीएससी आणि एमपीएससी अभ्यासक"
    }
  },
  {
    quote: {
      en: "Action is the foundational key to all success. Complete today's targets with sincerity.",
      hi: "कर्म ही सभी सफलताओं की आधारशिला है। आज के लक्ष्यों को ईमानदारी से पूरा करें।",
      mr: "कृती ही सर्व यशाची मूळ गुरुकिल्ली आहे. आजची उद्दिष्टे प्रामाणिकपणे पूर्ण करा."
    },
    author: {
      en: "Pablo Picasso",
      hi: "पाब्लो पिकासो",
      mr: "पाब्लो पिकासो"
    }
  },
  {
    quote: {
      en: "Self-discipline is the magic power that makes you virtually unstoppable.",
      hi: "आत्म-अनुशासन वह जादुई शक्ति है जो आपको व्यावहारिक रूप से अजेय बनाती है।",
      mr: "आत्मशिस्त ही ती जादूची शक्ती आहे जी तुम्हाला रोखणे अशक्य करते."
    },
    author: {
      en: "Dan Kennedy",
      hi: "डैन केनेडी",
      mr: "डॅन केनेडी"
    }
  },
  {
    quote: {
      en: "Great works are performed not by strength, but by perseverance.",
      hi: "महान कार्य शक्ति से नहीं, बल्कि दृढ़ता और लगन से किए जाते हैं।",
      mr: "महान कार्ये शक्तीने नाही, तर चिकाटीने पूर्ण होतात."
    },
    author: {
      en: "Samuel Johnson",
      hi: "सैमुअल जॉनसन",
      mr: "सॅम्युअल जॉन्सन"
    }
  },
  {
    quote: {
      en: "The man who moves a mountain begins by carrying away small stones.",
      hi: "जो व्यक्ति पहाड़ को हिलाता है, वह छोटे पत्थरों को उठाने से शुरुआत करता है।",
      mr: "जो मनुष्य पर्वत हलवतो, तो लहान दगड उचलण्यापासून सुरुवात करतो."
    },
    author: {
      en: "Confucius",
      hi: "कन्फ्यूशियस",
      mr: "कन्फ्यूशियस"
    }
  }
];

export const getDailyQuote = (lang = 'en') => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const item = DAILY_MOTIVATIONAL_QUOTES[dayOfYear % DAILY_MOTIVATIONAL_QUOTES.length];
  return {
    quote: item.quote[lang] || item.quote.en,
    author: item.author[lang] || item.author.en
  };
};

const DAY_TRANSLATIONS = {
  Mon: { hi: 'सोम', mr: 'सोम' },
  Tue: { hi: 'मंगल', mr: 'मंगळ' },
  Wed: { hi: 'बुध', mr: 'बुध' },
  Thu: { hi: 'गुरु', mr: 'गुरु' },
  Fri: { hi: 'शुक्र', mr: 'शुक्र' },
  Sat: { hi: 'शनि', mr: 'शनि' },
  Sun: { hi: 'रवि', mr: 'रवि' },
  Monday: { hi: 'सोमवार', mr: 'सोमवार' },
  Tuesday: { hi: 'मंगलवार', mr: 'मंगळवार' },
  Wednesday: { hi: 'बुधवार', mr: 'बुधवार' },
  Thursday: { hi: 'गुरुवार', mr: 'गुरुवार' },
  Friday: { hi: 'शुक्रवार', mr: 'शुक्रवार' },
  Saturday: { hi: 'शनिवार', mr: 'शनिवार' },
  Sunday: { hi: 'रविवार', mr: 'रविवार' }
};

const translateDay = (day, lang) => {
  if (!day || lang === 'en') return day;
  const trimmed = day.trim();
  return DAY_TRANSLATIONS[trimmed]?.[lang] || trimmed;
};

// ==================== HELPER METHODS ====================
export const getSubjectName = (subjectOrId, lang = 'en') => {
  if (!subjectOrId) return '';
  const rawStr = typeof subjectOrId === 'string' ? subjectOrId : (subjectOrId.id || subjectOrId.name);
  if (!rawStr) return '';

  // Handle comma-separated lists like "Polity, History"
  if (rawStr.includes(',')) {
    return rawStr
      .split(',')
      .map(part => getSubjectName(part.trim(), lang))
      .filter(Boolean)
      .join(', ');
  }

  const clean = rawStr.trim().toLowerCase();

  // Shorthands mapping
  const shorthands = {
    polity: 'upsc-polity',
    history: 'upsc-history-culture',
    geography: 'upsc-geography',
    economy: 'upsc-economy',
    economics: 'upsc-economy',
    csat: 'upsc-csat',
    ethics: 'upsc-ethics',
    environment: 'upsc-environment',
    science: 'upsc-science-tech',
    society: 'upsc-indian-society',
    security: 'upsc-internal-security',
    governance: 'upsc-polity',
    'mpsc-gs1': 'mpsc-history-geography',
    'mpsc-gs2': 'mpsc-polity-law',
    'mpsc-gs3': 'mpsc-hrd-human-rights',
    'mpsc-gs4': 'mpsc-economy-sci-tech'
  };

  const id = shorthands[clean] || (typeof subjectOrId === 'object' ? (subjectOrId.id || subjectOrId.name) : rawStr);
  const rawName = typeof subjectOrId === 'object' ? subjectOrId.name : rawStr;

  const entry = SUBJECT_TRANSLATIONS[id] || Object.values(SUBJECT_TRANSLATIONS).find(s =>
    (s.en && s.en.toLowerCase() === clean) || (s.id && s.id.toLowerCase() === clean)
  );

  if (entry && entry[lang]) return entry[lang];

  // Specific Marathi fallbacks for common subjects
  if (lang === 'mr') {
    if (clean === 'polity' || clean.includes('polity')) return 'भारतीय राज्यव्यवस्था';
    if (clean === 'history' || clean.includes('history')) return 'इतिहास';
    if (clean === 'geography' || clean.includes('geography')) return 'भूगोल';
    if (clean === 'economy' || clean.includes('economy')) return 'अर्थव्यवस्था';
    if (clean === 'csat' || clean.includes('csat')) return 'सीसॅट (CSAT)';
    if (clean === 'ethics' || clean.includes('ethics')) return 'नीतीशास्त्र';
    if (clean.includes('mpsc') && clean.includes('upsc')) return 'एमपीएससी / यूपीएससी';
    if (clean === 'mpsc') return 'एमपीएससी';
    if (clean === 'upsc') return 'यूपीएससी';
  }

  return rawName || id;
};

export const getTopicName = (topicOrName, lang = 'en') => {
  if (!topicOrName) return '';
  const rawName = typeof topicOrName === 'object' ? (topicOrName.name || topicOrName.id) : topicOrName;
  if (lang === 'en') return rawName;

  const entry = TOPIC_TRANSLATIONS[rawName] || Object.values(TOPIC_TRANSLATIONS).find(t => t.en === rawName || t.id === rawName);
  return entry?.[lang] || entry?.en || rawName;
};

export const getChapterName = (chapter, lang = 'en') => {
  if (!chapter) return '';
  if (lang === 'en') return chapter;
  return CHAPTER_TRANSLATIONS[chapter]?.[lang] || CHAPTER_TRANSLATIONS[chapter]?.en || chapter;
};

export const getTaskTitle = (title, lang = 'en') => {
  if (!title || typeof title !== 'string' || lang === 'en') return title || '';

  // 1. Direct topic translation match
  const topicMatch = TOPIC_TRANSLATIONS[title] || Object.values(TOPIC_TRANSLATIONS).find(t => t.en === title);
  if (topicMatch?.[lang]) return topicMatch[lang];

  // 2. Preset: "GS Core & Standard Theory (Tue)" or "GS Core & Standard Theory"
  const gsCoreMatch = title.match(/^(?:(UPSC|MPSC)\s+)?GS Core\s*(?:&|and)\s*Standard Theory(?:\s*\(([^)]+)\))?/i);
  if (gsCoreMatch) {
    const examPrefix = gsCoreMatch[1] ? (lang === 'hi' || lang === 'mr' ? (gsCoreMatch[1].toUpperCase() === 'MPSC' ? 'एमपीएससी ' : 'यूपीएससी ') : `${gsCoreMatch[1]} `) : '';
    const day = gsCoreMatch[2] ? ` (${translateDay(gsCoreMatch[2], lang)})` : '';
    return lang === 'hi'
      ? `${examPrefix}जीएस कोर और मानक सिद्धांत${day}`
      : `${examPrefix}जीएस मुख्य व मानक सिद्धांत${day}`;
  }

  // 3. Preset: "PYQ Practice & CSAT (Tue)" or "PYQ Practice & CSAT"
  const pyqMatch = title.match(/^(?:(UPSC|MPSC)\s+)?PYQ Practice\s*(?:&|and)\s*CSAT(?:\s*\(([^)]+)\))?/i);
  if (pyqMatch) {
    const examPrefix = pyqMatch[1] ? (lang === 'hi' || lang === 'mr' ? (pyqMatch[1].toUpperCase() === 'MPSC' ? 'एमपीएससी ' : 'यूपीएससी ') : `${pyqMatch[1]} `) : '';
    const day = pyqMatch[2] ? ` (${translateDay(pyqMatch[2], lang)})` : '';
    return lang === 'hi'
      ? `${examPrefix}पीवाईक्यू अभ्यास और सीसैट${day}`
      : `${examPrefix}मागील प्रश्न सराव व सीसॅट${day}`;
  }

  // 4. Preset: "Daily Current Affairs & Editorial (Tue)" or "Daily Current Affairs & Editorial"
  const caMatch = title.match(/^(?:(UPSC|MPSC)\s+)?Daily Current Affairs\s*(?:&|and)\s*Editorial(?:\s*\(([^)]+)\))?/i);
  if (caMatch) {
    const examPrefix = caMatch[1] ? (lang === 'hi' || lang === 'mr' ? (caMatch[1].toUpperCase() === 'MPSC' ? 'एमपीएससी ' : 'यूपीएससी ') : `${caMatch[1]} `) : '';
    const day = caMatch[2] ? ` (${translateDay(caMatch[2], lang)})` : '';
    return lang === 'hi'
      ? `${examPrefix}दैनिक समसामयिकी और संपादकीय${day}`
      : `${examPrefix}दैनिक चालू घडामोडी व संपादकीय${day}`;
  }

  // 5. Preset: "GS Core & Theory (Deep Work)" or "UPSC GS Core & Theory (Deep Work)"
  const deepWorkMatch = title.match(/^(?:(UPSC|MPSC)\s+)?GS Core\s*(?:&|and)\s*Theory\s*\(Deep Work\)/i);
  if (deepWorkMatch) {
    const examPrefix = deepWorkMatch[1] ? (lang === 'hi' || lang === 'mr' ? (deepWorkMatch[1].toUpperCase() === 'MPSC' ? 'एमपीएससी ' : 'यूपीएससी ') : `${deepWorkMatch[1]} `) : '';
    return lang === 'hi'
      ? `${examPrefix}जीएस कोर और सिद्धांत (गहन अध्ययन)`
      : `${examPrefix}जीएस मुख्य व सिद्धांत (सखोल अभ्यास)`;
  }

  // 6. Composite format: "<Subject>: <Topic>"
  if (title.includes(':')) {
    const parts = title.split(':');
    const sPart = parts[0].trim();
    const tPart = parts.slice(1).join(':').trim();
    const translatedSub = getSubjectName(sPart, lang);
    const translatedTop = getTopicName(tPart, lang);
    return `${translatedSub}: ${translatedTop}`;
  }

  // 7. Suffix checks
  if (title.endsWith(' Core Revision')) {
    const base = title.replace(' Core Revision', '').trim();
    return lang === 'hi'
      ? `${getSubjectName(base, lang)} सखोल पुनरावृत्ति`
      : `${getSubjectName(base, lang)} सखोल उजळणी`;
  }
  if (title.endsWith(' Priority Session')) {
    const base = title.replace(' Priority Session', '').trim();
    return lang === 'hi'
      ? `${getSubjectName(base, lang)} प्राथमिकता सत्र`
      : `${getSubjectName(base, lang)} प्राधान्य सत्र`;
  }
  if (title.endsWith(' Study Session')) {
    const base = title.replace(' Study Session', '').trim();
    return lang === 'hi'
      ? `${getSubjectName(base, lang)} अध्ययन सत्र`
      : `${getSubjectName(base, lang)} अभ्यास सत्र`;
  }
  if (title.endsWith(' 45m Block')) {
    const base = title.replace(' 45m Block', '').trim();
    return lang === 'hi'
      ? `${getSubjectName(base, lang)} ४५ मिनट ब्लॉक`
      : `${getSubjectName(base, lang)} ४५ मि. स्लॉट`;
  }

  return getTopicName(title, lang);
};

export const getStatusLabel = (status, lang = 'en') => {
  if (!status || lang === 'en') return status || '';
  const s = String(status).toLowerCase().replace(/[-_\s]/g, '');
  const map = {
    hi: {
      completed: 'पूर्ण',
      mastered: 'कंठस्थ / पूर्ण',
      pending: 'लंबित',
      inprogress: 'प्रगति पर',
      torevise: 'पुनरावृत्ति बाकी',
      notstarted: 'शुरू नहीं हुआ'
    },
    mr: {
      completed: 'पूर्ण',
      mastered: 'पारंगत / पूर्ण',
      pending: 'प्रलंबित',
      inprogress: 'प्रगतीपथावर',
      torevise: 'उजळणी बाकी',
      notstarted: 'सुरू नाही केले'
    }
  };
  return map[lang]?.[s] || status;
};

export const getPaperName = (paper, lang = 'en') => {
  if (!paper || lang === 'en') return paper || '';
  const PAPERS = {
    'GS Paper I': { hi: 'जीएस पेपर I', mr: 'जीएस पेपर I' },
    'GS Paper II': { hi: 'जीएस पेपर II', mr: 'जीएस पेपर II' },
    'GS Paper III': { hi: 'जीएस पेपर III', mr: 'जीएस पेपर III' },
    'GS Paper IV': { hi: 'जीएस पेपर IV', mr: 'जीएस पेपर IV' },
    'GS Paper I-IV': { hi: 'जीएस पेपर I-IV', mr: 'जीएस पेपर I-IV' },
    'Prelims Paper I': { hi: 'प्रारंभिक परीक्षा पेपर I', mr: 'पूर्व परीक्षा पेपर I' },
    'Prelims Paper II': { hi: 'प्रारंभिक परीक्षा पेपर II (सीसैट)', mr: 'पूर्व परीक्षा पेपर II (सीसॅट)' },
    'CSAT Paper II': { hi: 'सीसैट पेपर II', mr: 'सीसॅट पेपर II' },
    'Language Paper I': { hi: 'भाषा पेपर I (मराठी)', mr: 'भाषा पेपर I (मराठी)' },
    'Language Paper II': { hi: 'भाषा पेपर II (अंग्रेजी)', mr: 'भाषा पेपर II (इंग्रजी)' }
  };
  return PAPERS[paper]?.[lang] || paper;
};

export default {
  AVAILABLE_LANGUAGES,
  DEFAULT_SYLLABUS_SUBJECTS,
  translations,
  getTranslation,
  SUBJECT_TRANSLATIONS,
  TOPIC_TRANSLATIONS,
  CHAPTER_TRANSLATIONS,
  DAILY_MOTIVATIONAL_QUOTES,
  getDailyQuote,
  getSubjectName,
  getTopicName,
  getChapterName,
  getTaskTitle,
  getStatusLabel,
  getPaperName
};
