// ==============================================================
// ABHYAS TRACKER - MULTILINGUAL TRANSLATION SYSTEM
// Supported Languages: English (en), हिन्दी (hi), मराठी (mr)
// ==============================================================

export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
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
    settings: 'Settings',

    // Subtitles
    dashboardSubtitle: 'Target scheduling, task execution & daily workload balance',
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
    minPlanned: 'min planned',
    hours: 'hours',
    hoursPlanned: 'h planned',
    tasks: 'tasks',
    task: 'task',
    signOut: 'Sign Out',
    confirmSignOut: 'Are you sure you want to sign out?',
    signedInAs: 'Signed in as',

    // Settings Modal
    settingsTitle: 'Settings & Preferences',
    appLanguage: 'App Language',
    chooseLanguage: 'Choose your preferred interface language',
    appearance: 'Appearance & Theme',
    themeDescription: 'Switch between light and dark themes for comfortable reading',
    notificationsTitle: 'Notifications & Alerts',
    notificationDesc: 'Manage daily routine briefings and study alerts',
    openNotificationsView: 'Open Routine Briefings & Alerts',
    enableBrowserAlerts: 'Enable Browser Desktop Notifications',
    notificationsEnabled: 'Daily routine notifications active',
    studyTargetGoal: 'Daily Target Hours',
    studyTargetDesc: 'Set your target daily deep focus duration',
    primaryExam: 'Primary Exam Focus',
    primaryExamDesc: 'Filter your default study curriculum view',
    allExams: 'All Exams (UPSC + MPSC)',
    upscOnly: '🏛️ UPSC Civil Services',
    mpscOnly: '🚩 MPSC Maharashtra',
    soundAlerts: 'Timer Completion Sound',
    soundAlertsDesc: 'Play audio chime when focus timer completes',
    on: 'ON',
    off: 'OFF',
    appInfo: 'About Abhyas Tracker',
    appVersion: 'Abhyas Tracker v1.2.0 • UPSC & MPSC Preparation Suite',

    // Dashboard
    dailyQuote: 'Consistency is what transforms average into excellence.',
    todayStudyTime: "Today's Study Time",
    weeklyGoal: '7-Day Goal vs. 40h',
    dailyStreak: 'Daily Streak',
    days: 'days',
    curriculumProgress: 'Curriculum Progress',
    overallCurriculum: 'Overall Completion',
    upscMastery: 'UPSC Mastered',
    mpscMastery: 'MPSC Mastered',
    todayTasks: "Today's Scheduled Tasks",
    noTasksToday: 'No tasks scheduled for today yet. Plan a study block now!',
    openTomorrowPlanner: "Open Tomorrow's Planner",
    autoPlanTomorrowBtn: '⚡ Auto-Plan Tomorrow',
    quickTimerStart: '⚡ Quick Start Focus Timer',
    recentStudySessions: 'Recent Study Sessions',
    noSessionsLogged: 'No sessions logged yet today. Hit Start Timer to begin!',
    openSyllabusBtn: 'Open Syllabus & Checklist →',

    // Timer Screen
    studyStopwatch: 'Study Stopwatch & Focus Timer',
    runningFocus: 'Deep Focus Session in Progress',
    pausedFocus: 'Session Paused',
    readyToFocus: 'Ready to Focus',
    sessionFocusTopic: 'SESSION FOCUS TOPIC',
    whatAreYouStudying: 'What topic or chapter are you studying?',
    startTimer: 'Start Study Timer',
    pauseTimer: 'Pause',
    resumeTimer: 'Resume',
    saveSessionBtn: 'Save Session',
    resetTimer: 'Reset',
    selectSubjectToTrack: 'SELECT SUBJECT TO TRACK',
    pomodoroIntervals: 'Focus Interval Presets',

    // Syllabus Screen
    subjectsAndSyllabus: 'Subjects & Syllabus',
    curriculumChecklist: 'Interactive curriculum checklist, mastery tracking & offline hour logger',
    logOfflineHours: '📝 + Log Hours',
    closeLogger: 'Close Logger',
    offlineLoggerTitle: 'Log Offline / Book Study Hours',
    offlineLoggerDesc: 'Studied from standard books (Laxmikanth, Spectrum, NCERT) or in library? Record hours directly.',
    examSection: 'EXAM CURRICULUM SECTION',
    topicsChecklistTap: 'TOPIC CHECKLIST (TAP TO UPDATE STATUS)',
    viewTopicInSyllabus: 'Topic in Syllabus →',
    redirectedFromTask: '🎯 Redirected from Planner Task',
    topicsMastered: 'topics mastered',
    spacedRepetitionQueue: 'Spaced Repetition Queue',
    neglectedModuleNotice: 'Curriculum Balance: Neglected Module',
    dueOn: 'Due',
    spent: 'spent',
    revs: 'revs',
    donePct: 'done',

    // Planner Screen
    studyPlannerTitle: 'Study Planner',
    plannerTimeframe: 'PLANNER TIMEFRAME',
    todaysPlan: "Today's Plan",
    tomorrowsPlan: "Tomorrow's Plan",
    weeklyView: 'Weekly View',
    workloadRoutine: 'Workload & Routine',
    examFilter: 'EXAM FILTER',
    allExamTasks: 'All Exam Tasks',
    upscPlans: '🏛️ UPSC Plans',
    mpscPlans: '🚩 MPSC Plans',
    selectDay7: 'SELECT DAY (NEXT 7 DAYS)',
    addStudyBlock: '+ Add Study Block',
    addStudyBlockDesc: 'Schedule focus intervals aligned with your MPSC or UPSC syllabus.',
    targetExamSection: 'TARGET EXAM SECTION',
    selectTargetSubject: 'SELECT SUBJECT',
    quickPickUnfinished: '⚡ QUICK PICK FROM UNFINISHED SYLLABUS',
    topicOrChapterTitle: 'TOPIC OR CHAPTER TITLE',
    topicTitlePlaceholder: 'e.g. Fundamental Rights (Art 14–18)',
    targetDurationMins: 'TARGET DURATION (MINUTES)',
    scheduleStudyBlockBtn: '+ Schedule Study Block',
    advancePlanningRoutine: 'Advance Planning Routine',
    advancePlanningDesc: 'Planning tasks for tomorrow tonight eliminates morning decision fatigue. Wake up knowing exactly what chapters and MCQs to tackle first.',
    noTasksTomorrow: 'No tasks scheduled for Tomorrow yet.',
    autoGenerateBlueprint: "⚡ Auto-Plan Tomorrow's Core Topics",
    browseSyllabusToSchedule: '📖 Browse Syllabus Topics',
    tomorrowsWorkloadTarget: "Tomorrow's Workload vs. 8h Target",
    capacity: 'Capacity',
    weeklyGoalVs40h: '7-Day Weekly Goal vs. 40h',
    tasksForDay: 'Tasks for',
    noTasksScheduledDate: 'No tasks scheduled for this date. Use "+ Add Study Block" below to schedule a session.',
    workloadGauges: 'Workload Capacity Gauges',
    todaysStudyLoad: "Today's Study Load",

    // Analytics Screen
    analyticsTitle: 'Study Analytics & Insights',
    totalStudyTime: 'Total Study Time',
    weeklyAvg: 'Weekly Average',
    completionRate: 'Task Completion Rate',
    subjectDistribution: 'Subject Distribution & Time Allocation',
    last7DaysTrend: 'Daily Study Trend (Last 7 Days)',
    hoursPerDay: 'hours / day',
    noAnalyticsData: 'Log study sessions to unlock personalized preparation analytics.',

    // Extra Navigation, Routine & Blueprint keys
    jumpToTopic: 'View Topic ↓',
    morningBriefing: 'MORNING STUDY BRIEFING',
    eveningPlanning: 'EVENING PLANNING ROUTINE',
    blueprintIdealRoutine: '3-Slot Ideal Daily Routine Blueprint',
    blueprintRoutineDesc: 'Standard competitive examination schedule recommended for working aspirants & full-time students.',
    slot1DeepWork: 'Slot 1: Early Morning Deep Work (06:00 - 09:00 • 3h)',
    slot1Desc: 'Theory, core concept mastering & static syllabus reading when mind is freshest.',
    slot2Practice: 'Slot 2: Afternoon Practice & Problem Solving (14:00 - 17:00 • 3h)',
    slot2Desc: 'Previous Year Questions (PYQs), mock tests, CSAT & active recall exercises.',
    slot3CurrentAffairs: 'Slot 3: Evening Current Affairs & Synthesis (20:00 - 22:00 • 2h)',
    slot3Desc: 'Daily newspaper editorials, monthly magazines, notes summarization & answer writing.',
    blueprintForToday: '⚡ Blueprint for Today',
    blueprintForTomorrow: '⚡ Blueprint for Tomorrow',
    tapToViewTopic: '👉 Tap to view topic in Syllabus →',
    tapToViewTasks: 'Tap to view tasks',
    autoPlanTomorrow: '⚡ Auto-Plan Tomorrow',
    curriculumBalanceNeglected: 'Curriculum Balance: Neglected Module',
    offlineStudyLogger: 'Log Offline / Book Study Hours',
    offlineStudyLoggerDesc: 'Studied from standard books (Laxmikanth, Spectrum, NCERT) or in a library? Record completed hours directly into your study progress.',
    startLiveTimer: '▶ Start Live Timer',
    logPastHours: '📝 Log Past Hours',
    topicChecklistHeader: 'TOPIC CHECKLIST (TAP TO UPDATE STATUS)',
    viewTopic: '📖 View Topic',
    planForToday: 'Plan for Today',
    plusOneRevise: '+1 Revise',
    logHours: 'Log Hours',
    revise: 'Revise',
    mastered: 'Mastered',
    remaining: 'Remaining',
    confirmSignOut: 'Are you sure you want to sign out?',
    signOut: 'Sign Out',
    confirm: 'Confirm',
    cancel: 'Cancel',
    scheduled: 'Scheduled!',
    scheduledMsg: "Added to today's study planner.",
    studyHoursLogged: 'Study Hours Logged! 📚',
    tenHourSchedule: '10-Hour Schedule',
    tenHourScheduleTitle: '10-Hour Study Schedule for UPSC/MPSC Aspirants',
    tenHourScheduleDesc: 'Disciplined 4-slot daily routine with scheduled breaks for maximum retention and deep focus.',
    apply10hToday: '⚡ Apply 10h Schedule to Today',
    apply10hTomorrow: '⚡ Apply 10h Schedule to Tomorrow',
    currentSlotActive: 'Currently Active Slot',
    honestStudyQuote: "Don't sit just to count number of hours, try to study with honesty.",
    seeDetails: 'See Details',
    hideDetails: 'Hide Details',
    progressTrackerTitle: 'Progress Tracker',
    timeSpent: 'Time Spent',
    startFocus: 'Start Focus'
  },

  // ==================== HINDI (हिन्दी) ====================
  hi: {
    // Navigation & Tabs
    dashboard: 'डैशबोर्ड',
    timer: 'टाइमर',
    syllabus: 'पाठ्यक्रम',
    planner: 'योजना',
    analytics: 'विश्लेषण',
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
    tomorrow: 'कल (आगामी)',
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

    // Settings Modal
    settingsTitle: 'सेटिंग्स और प्राथमिकताएं',
    appLanguage: 'ऐप की भाषा',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें',
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
    allExams: 'सभी परीक्षाएं (UPSC + MPSC)',
    upscOnly: '🏛️ UPSC सिविल सेवा',
    mpscOnly: '🚩 MPSC महाराष्ट्र',
    soundAlerts: 'टाइमर ध्वनि अलर्ट',
    soundAlertsDesc: 'टाइमर पूरा होने पर बीप बजाएं',
    on: 'चालू',
    off: 'बंद',
    appInfo: 'अभ्यास ट्रैकर के बारे में',
    appVersion: 'अभ्यास ट्रैकर v1.2.0 • UPSC और MPSC अध्ययन सूट',

    // Dashboard
    dailyQuote: 'निरंतरता ही सामान्य को उत्कृष्टता में बदलती है।',
    todayStudyTime: 'आज का अध्ययन समय',
    weeklyGoal: 'साप्ताहिक लक्ष्य (40 घंटे)',
    dailyStreak: 'दैनिक निरंतरता',
    days: 'दिन',
    curriculumProgress: 'पाठ्यक्रम प्रगति',
    overallCurriculum: 'कुल पाठ्यक्रम पूर्णता',
    upscMastery: 'UPSC पूर्ण विषय',
    mpscMastery: 'MPSC पूर्ण विषय',
    todayTasks: 'आज के निर्धारित कार्य',
    noTasksToday: 'आज के लिए कोई कार्य निर्धारित नहीं है। अभी अध्ययन ब्लॉक बनाएं!',
    openTomorrowPlanner: 'कल का प्लानर खोलें',
    autoPlanTomorrowBtn: '⚡ कल का प्लान स्वतः बनाएं',
    quickTimerStart: '⚡ फोकस टाइमर तुरंत शुरू करें',
    recentStudySessions: 'हाल के अध्ययन सत्र',
    noSessionsLogged: 'आज कोई सत्र दर्ज नहीं है। शुरू करने के लिए टाइमर दबाएं!',
    openSyllabusBtn: 'पाठ्यक्रम और चेकलिस्ट खोलें →',

    // Timer Screen
    studyStopwatch: 'अध्ययन स्टॉपवॉच और फोकस टाइमर',
    runningFocus: 'गहन अध्ययन सत्र चालू है',
    pausedFocus: 'सत्र रुका हुआ है',
    readyToFocus: 'फोकस करने के लिए तैयार',
    sessionFocusTopic: 'सत्र फोकस विषय',
    whatAreYouStudying: 'आप किस अध्याय या विषय का अध्ययन कर रहे हैं?',
    startTimer: 'टाइमर शुरू करें',
    pauseTimer: 'रोकें',
    resumeTimer: 'पुनः शुरू करें',
    saveSessionBtn: 'सत्र सहेजें',
    resetTimer: 'रीसेट करें',
    selectSubjectToTrack: 'ट्रैक करने के लिए विषय चुनें',
    pomodoroIntervals: 'पोमोडोरो अंतराल विकल्प',

    // Syllabus Screen
    subjectsAndSyllabus: 'विषय और पाठ्यक्रम',
    curriculumChecklist: 'इंटरएक्टिव पाठ्यक्रम चेकलिस्ट, महारत ट्रैकिंग और ऑफलाइन लॉग',
    logOfflineHours: '📝 + घंटे दर्ज करें',
    closeLogger: 'लॉगर बंद करें',
    offlineLoggerTitle: 'ऑफलाइन / पुस्तक अध्ययन घंटे दर्ज करें',
    offlineLoggerDesc: 'मानक पुस्तकों (लक्ष्मीकांत, स्पेक्ट्रम, NCERT) या लाइब्रेरी में पढ़ा? घंटे तुरंत जोड़ें।',
    examSection: 'परीक्षा पाठ्यक्रम अनुभाग',
    topicsChecklistTap: 'विषय चेकलिस्ट (स्थिति बदलने के लिए टैप करें)',
    viewTopicInSyllabus: 'पाठ्यक्रम में देखें →',
    redirectedFromTask: '🎯 प्लानर कार्य से पुनर्निर्देशित',
    topicsMastered: 'विषय पूर्ण',
    spacedRepetitionQueue: 'पुनरावृत्ति कतार (Spaced Repetition)',
    neglectedModuleNotice: 'पाठ्यक्रम संतुलन: छूटा हुआ विषय',
    dueOn: 'नियत',
    spent: 'व्यतीत',
    revs: 'पुनरावृत्ति',
    donePct: 'पूर्ण',

    // Planner Screen
    studyPlannerTitle: 'अध्ययन योजनाकार (Planner)',
    plannerTimeframe: 'योजना समय-सीमा',
    todaysPlan: 'आज की योजना',
    tomorrowsPlan: 'कल की योजना',
    weeklyView: 'साप्ताहिक दृश्य',
    workloadRoutine: 'कार्यभार और दिनचर्या',
    examFilter: 'परीक्षा फ़िल्टर',
    allExamTasks: 'सभी परीक्षा कार्य',
    upscPlans: '🏛️ UPSC योजनाएं',
    mpscPlans: '🚩 MPSC योजनाएं',
    selectDay7: 'दिन चुनें (अगले 7 दिन)',
    addStudyBlock: '+ नया अध्ययन ब्लॉक जोड़ें',
    addStudyBlockDesc: 'अपने MPSC या UPSC पाठ्यक्रम के अनुसार फोकस अंतराल निर्धारित करें।',
    targetExamSection: 'लक्षित परीक्षा अनुभाग',
    selectTargetSubject: 'विषय चुनें',
    quickPickUnfinished: '⚡ अपूर्ण पाठ्यक्रम से तुरंत चुनें',
    topicOrChapterTitle: 'विषय या अध्याय शीर्षक',
    topicTitlePlaceholder: 'उदा. मौलिक अधिकार (अनुच्छेद 14-18)',
    targetDurationMins: 'लक्षित अवधि (मिनट)',
    scheduleStudyBlockBtn: '+ अध्ययन ब्लॉक शेड्यूल करें',
    advancePlanningRoutine: 'अग्रिम योजना दिनचर्या',
    advancePlanningDesc: 'कल के कार्यों की आज रात योजना बनाने से सुबह का समय बचता है और स्पष्टता रहती है।',
    noTasksTomorrow: 'कल के लिए अभी कोई कार्य निर्धारित नहीं है।',
    autoGenerateBlueprint: '⚡ कल के मुख्य विषय स्वतः शेड्यूल करें',
    browseSyllabusToSchedule: '📖 पाठ्यक्रम विषय ब्राउज़ करें',
    tomorrowsWorkloadTarget: 'कल का कार्यभार बनाम 8 घंटे का लक्ष्य',
    capacity: 'क्षमता',
    weeklyGoalVs40h: 'साप्ताहिक 40 घंटे का लक्ष्य',
    tasksForDay: 'के लिए निर्धारित कार्य',
    noTasksScheduledDate: 'इस तारीख के लिए कोई कार्य निर्धारित नहीं है। नीचे "+ नया ब्लॉक जोड़ें" से शेड्यूल करें।',
    workloadGauges: 'कार्यभार क्षमता गेज',
    todaysStudyLoad: 'आज का अध्ययन भार',

    // Analytics Screen
    analyticsTitle: 'अध्ययन विश्लेषण और अंतर्दृष्टि',
    totalStudyTime: 'कुल अध्ययन समय',
    weeklyAvg: 'साप्ताहिक औसत',
    completionRate: 'कार्य पूर्णता दर',
    subjectDistribution: 'विषयवार समय आवंटन',
    last7DaysTrend: 'दैनिक अध्ययन रुझान (पिछले 7 दिन)',
    hoursPerDay: 'घंटे / दिन',
    noAnalyticsData: 'व्यक्तिगत तैयारी अंतर्दृष्टि देखने के लिए अध्ययन सत्र दर्ज करें।',

    // Extra Navigation, Routine & Blueprint keys
    jumpToTopic: 'विषय देखें ↓',
    morningBriefing: 'प्रातःकालीन अध्ययन ब्रीफिंग',
    eveningPlanning: 'सायंकालीन योजना दिनचर्या',
    blueprintIdealRoutine: '3-स्लॉट आदर्श दैनिक अध्ययन दिनचर्या',
    blueprintRoutineDesc: 'UPSC और MPSC अभ्यर्थियों के लिए अनुशंसित मानक दैनिक समय सारणी।',
    slot1DeepWork: 'स्लॉट 1: सुबह का गहन अध्ययन (06:00 - 09:00 • 3 घंटे)',
    slot1Desc: 'सिद्धांत, मुख्य अवधारणाएं और स्थिर पाठ्यक्रम पढ़ना जब दिमाग सबसे तरोताजा हो।',
    slot2Practice: 'स्लॉट 2: दोपहर का अभ्यास और प्रश्न हल (14:00 - 17:00 • 3 घंटे)',
    slot2Desc: 'पिछले वर्षों के प्रश्न (PYQs), मॉक टेस्ट, CSAT और सक्रिय अभ्यास।',
    slot3CurrentAffairs: 'स्लॉट 3: शाम का करंट अफेयर्स और संश्लेषण (20:00 - 22:00 • 2 घंटे)',
    slot3Desc: 'दैनिक समाचार पत्र संपादकीय, मासिक पत्रिकाएं, नोट्स और उत्तर लेखन।',
    blueprintForToday: '⚡ आज का ब्लूप्रिंट',
    blueprintForTomorrow: '⚡ कल का ब्लूप्रिंट',
    tapToViewTopic: '👉 पाठ्यक्रम में विषय देखने के लिए टैप करें →',
    tapToViewTasks: 'कार्य देखने के लिए टैप करें',
    autoPlanTomorrow: '⚡ कल की योजना स्वतः बनाएं',
    curriculumBalanceNeglected: 'पाठ्यक्रम संतुलन: छूटा हुआ विषय',
    offlineStudyLogger: 'ऑफलाइन / पुस्तक अध्ययन घंटे दर्ज करें',
    offlineStudyLoggerDesc: 'मानक पुस्तकों (लक्ष्मीकांत, स्पेक्ट्रम, NCERT) या लाइब्रेरी से पढ़ा? सीधे दर्ज करें।',
    startLiveTimer: '▶ लाइव टाइमर शुरू करें',
    logPastHours: '📝 पिछले घंटे दर्ज करें',
    topicChecklistHeader: 'विषय चेकलिस्ट (स्थिति बदलने के लिए टैप करें)',
    viewTopic: '📖 विषय देखें',
    planForToday: 'आज की योजना',
    plusOneRevise: '+१ पुनरावृत्ती',
    logHours: 'समय दर्ज करें',
    revise: 'पुनरावृत्ती',
    mastered: 'पारंगत',
    remaining: 'शेष',
    confirmSignOut: 'क्या आप वाकई साइन आउट करना चाहते हैं?',
    signOut: 'साइन आउट',
    confirm: 'पुष्टि करें',
    cancel: 'रद्द करें',
    scheduled: 'निर्धारित किया गया!',
    scheduledMsg: 'आज के अध्ययन योजना में जोड़ा गया।',
    studyHoursLogged: 'अध्ययन समय दर्ज किया गया! 📚',
    tenHourSchedule: '१० घंटे की समय सारणी',
    tenHourScheduleTitle: 'यूपीएससी / एमपीएससी अभ्यर्थियों के लिए १० घंटे की अध्ययन समय सारणी',
    tenHourScheduleDesc: 'गहरे ध्यान और अधिकतम अवधारण के लिए ४ स्लॉट की अनुशासित दैनिक दिनचर्या।',
    apply10hToday: '⚡ आज की योजना में लागू करें',
    apply10hTomorrow: '⚡ कल की योजना में लागू करें',
    currentSlotActive: 'वर्तमान सक्रिय स्लॉट',
    honestStudyQuote: 'केवल घंटे गिनने के लिए न बैठें, पूरी ईमानदारी से अध्ययन करने का प्रयास करें।',
    seeDetails: 'विवरण देखें',
    hideDetails: 'विवरण छिपाएं',
    progressTrackerTitle: 'प्रगति ट्रैकर',
    timeSpent: 'बिताया गया समय',
    startFocus: 'अध्ययन शुरू करें'
  },

  // ==================== MARATHI (मराठी) ====================
  mr: {
    // Navigation & Tabs
    dashboard: 'डॅशबोर्ड',
    timer: 'टायमर',
    syllabus: 'अभ्यासक्रम',
    planner: 'नियोजक',
    analytics: 'विश्लेषण',
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

    // Settings Modal
    settingsTitle: 'सेटिंग्ज आणि प्राधान्ये',
    appLanguage: 'अ‍ॅपची भाषा',
    chooseLanguage: 'तुमची पसंतीची भाषा निवडा',
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
    allExams: 'सर्व परीक्षा (UPSC + MPSC)',
    upscOnly: '🏛️ UPSC नागरी सेवा',
    mpscOnly: '🚩 MPSC महाराष्ट्र लोकसेवा',
    soundAlerts: 'टायमर ध्वनी अलर्ट',
    soundAlertsDesc: 'टायमर पूर्ण झाल्यावर ध्वनी वाजवा',
    on: 'सुरू',
    off: 'बंद',
    appInfo: 'अभ्यास ट्रॅकर बद्दल',
    appVersion: 'अभ्यास ट्रॅकर v1.2.0 • UPSC आणि MPSC तयारी सूट',

    // Dashboard
    dailyQuote: 'सातत्यच सामान्य प्रयत्नांना यशात बदलते.',
    todayStudyTime: 'आजचा अभ्यास वेळ',
    weeklyGoal: 'साप्ताहिक ध्येय (४० तास)',
    dailyStreak: 'दैनंदिन सातत्य',
    days: 'दिवस',
    curriculumProgress: 'अभ्यासक्रम प्रगती',
    overallCurriculum: 'एकूण अभ्यासक्रम पूर्णता',
    upscMastery: 'UPSC पूर्ण घटक',
    mpscMastery: 'MPSC पूर्ण घटक',
    todayTasks: 'आजची नियोजित कामे',
    noTasksToday: 'आजसाठी कोणतेही काम नियोजित नाही. आताच अभ्यास सुरू करा!',
    openTomorrowPlanner: 'उद्याचे नियोजन उघडा',
    autoPlanTomorrowBtn: '⚡ उद्याचे नियोजन ऑटो-प्लॅन करा',
    quickTimerStart: '⚡ झटपट टायमर सुरू करा',
    recentStudySessions: 'अलीकडील अभ्यास सत्रे',
    noSessionsLogged: 'आज कोणतेही सत्र नोंदवले नाही. अभ्यास सुरू करण्यासाठी टायमर दाबा!',
    openSyllabusBtn: 'अभ्यासक्रम व चेकलिस्ट उघडा →',

    // Timer Screen
    studyStopwatch: 'अभ्यास स्टॉपवॉच आणि फोकस टायमर',
    runningFocus: 'सखोल अभ्यास सत्र सुरू आहे',
    pausedFocus: 'सत्र थांबवले आहे',
    readyToFocus: 'अभ्यासासाठी सज्ज',
    sessionFocusTopic: 'सत्र अभ्यास विषय',
    whatAreYouStudying: 'तुम्ही कोणता धडा किंवा विषय शिकत आहात?',
    startTimer: 'टायमर सुरू करा',
    pauseTimer: 'थांबवा',
    resumeTimer: 'पुन्हा सुरू करा',
    saveSessionBtn: 'सत्र जतन करा',
    resetTimer: 'रीसेट करा',
    selectSubjectToTrack: 'अभ्यासाचा विषय निवडा',
    pomodoroIntervals: 'पोमोडोरो कालावधी पर्याय',

    // Syllabus Screen
    subjectsAndSyllabus: 'विषय आणि अभ्यासक्रम',
    curriculumChecklist: 'संवादी अभ्यासक्रम चेकलिस्ट आणि ऑफलाइन तास नोंदणी',
    logOfflineHours: '📝 + तास नोंदवा',
    closeLogger: 'लॉगर बंद करा',
    offlineLoggerTitle: 'पुस्तकी / ऑफलाइन अभ्यास तास नोंदवा',
    offlineLoggerDesc: 'संदर्भ पुस्तके (लक्ष्मीकांत, स्पेक्ट्रम, NCERT) किंवा वाचनालयात अभ्यास केला? तास नोंदवा.',
    examSection: 'परीक्षा अभ्यासक्रम विभाग',
    topicsChecklistTap: 'विषय चेकलिस्ट (स्थिती बदलण्यासाठी टॅप करा)',
    viewTopicInSyllabus: 'अभ्यासक्रमात पहा →',
    redirectedFromTask: '🎯 प्लॅनर कामावरून पुनर्निर्देशित',
    topicsMastered: 'घटक पूर्ण',
    spacedRepetitionQueue: 'उजळणी यादी (Spaced Repetition)',
    neglectedModuleNotice: 'अभ्यासक्रम समतोल: दुर्लक्षित विषय',
    dueOn: 'नियत तारीख',
    spent: 'झालेला वेळ',
    revs: 'उजळणी',
    donePct: 'पूर्ण',

    // Planner Screen
    studyPlannerTitle: 'अभ्यास नियोजक (Planner)',
    plannerTimeframe: 'नियोजनाची वेळ-मर्यादा',
    todaysPlan: 'आजचे नियोजन',
    tomorrowsPlan: 'उद्याचे नियोजन',
    weeklyView: 'साप्ताहिक दृश्य',
    workloadRoutine: 'कामाचा भार आणि दिनक्रम',
    examFilter: 'परीक्षा फिल्टर',
    allExamTasks: 'सर्व परीक्षा कामे',
    upscPlans: '🏛️ UPSC नियोजन',
    mpscPlans: '🚩 MPSC नियोजन',
    selectDay7: 'दिवस निवडा (पुढील ७ दिवस)',
    addStudyBlock: '+ नवीन अभ्यास ब्लॉक जोडा',
    addStudyBlockDesc: 'तुमच्या MPSC किंवा UPSC अभ्यासक्रमानुसार अभ्यासाचे नियोजन करा.',
    targetExamSection: 'लक्ष्य परीक्षा विभाग',
    selectTargetSubject: 'विषय निवडा',
    quickPickUnfinished: '⚡ अपूर्ण अभ्यासक्रमातून झटपट निवडा',
    topicOrChapterTitle: 'विषय किंवा धड्याचे नाव',
    topicTitlePlaceholder: 'उदा. मूलभूत हक्क (कलम १४-१८)',
    targetDurationMins: 'लक्ष्य कालावधी (मिनिटे)',
    scheduleStudyBlockBtn: '+ अभ्यास ब्लॉक शेड्यूल करा',
    advancePlanningRoutine: 'आगाऊ नियोजन दिनक्रम',
    advancePlanningDesc: 'उद्याच्या अभ्यासाचे आज रात्री नियोजन केल्याने सकाळी वेळ वाचतो आणि ताण येत नाही.',
    noTasksTomorrow: 'उद्यासाठी अद्याप कोणतेही काम नियोजित नाही.',
    autoGenerateBlueprint: '⚡ उद्याचे मुख्य विषय ऑटो-प्लॅन करा',
    browseSyllabusToSchedule: '📖 अभ्यासक्रम विषय पहा',
    tomorrowsWorkloadTarget: 'उद्याचा भार विरुद्ध ८ तास ध्येय',
    capacity: 'क्षमता',
    weeklyGoalVs40h: 'साप्ताहिक ४० तास उद्दिष्ट',
    tasksForDay: 'चे नियोजित कामे',
    noTasksScheduledDate: 'या तारखेसाठी कोणतेही काम नियोजित नाही. खालील "+ नवीन ब्लॉक जोडा" वापरा.',
    workloadGauges: 'कार्यक्षमता मापक',
    todaysStudyLoad: 'आजचा अभ्यास भार',

    // Analytics Screen
    analyticsTitle: 'अभ्यास विश्लेषण आणि माहिती',
    totalStudyTime: 'एकूण अभ्यास वेळ',
    weeklyAvg: 'साप्ताहिक सरासरी',
    completionRate: 'काम पूर्ण होण्याचा दर',
    subjectDistribution: 'विषयानुसार वेळेचे वाटप',
    last7DaysTrend: 'दैनंदिन अभ्यास कल (मागील ७ दिवस)',
    hoursPerDay: 'तास / दिवस',
    noAnalyticsData: 'वैयक्तिकृत तयारी माहिती पाहण्यासाठी अभ्यास सत्रे नोंदवा.',

    // Extra Navigation, Routine & Blueprint keys
    jumpToTopic: 'विषय पहा ↓',
    morningBriefing: 'सकाळची अभ्यास माहिती',
    eveningPlanning: 'संध्याकाळचे नियोजन दिनक्रम',
    blueprintIdealRoutine: '३-स्लॉट आदर्श दैनंदिन अभ्यास दिनक्रम',
    blueprintRoutineDesc: 'UPSC आणि MPSC विद्यार्थ्यांसाठी शिफारस केलेले प्रमाणित वेळापत्रक.',
    slot1DeepWork: 'स्लॉट १: सकाळचा सखोल अभ्यास (०६:०० - ०९:०० • ३ तास)',
    slot1Desc: 'थिअरी, संकल्पना आणि मुख्य अभ्यासक्रम वाचन जेव्हा मन सर्वात ताजे असते.',
    slot2Practice: 'स्लॉट २: दुपारचा सराव आणि प्रश्न सोडवणे (१४:०० - १७:०० • ३ तास)',
    slot2Desc: 'मागील वर्षांचे प्रश्न (PYQs), सराव चाचण्या, CSAT आणि रिव्हिजन.',
    slot3CurrentAffairs: 'स्लॉट ३: संध्याकाळचे चालू घडामोडी व विश्लेषण (२०:०० - २२:०० • २ तास)',
    slot3Desc: 'वृत्तपत्र संपादकीय, मासिके, नोट्स सारांश आणि उत्तर लेखन सराव.',
    blueprintForToday: '⚡ आजचा ब्लूप्रिंट',
    blueprintForTomorrow: '⚡ उद्याचा ब्लूप्रिंट',
    tapToViewTopic: '👉 अभ्यासक्रमात विषय पाहण्यासाठी टॅप करा →',
    tapToViewTasks: 'कामे पाहण्यासाठी टॅप करा',
    autoPlanTomorrow: '⚡ उद्याचे नियोजन ऑटो-प्लॅन करा',
    curriculumBalanceNeglected: 'अभ्यासक्रम समतोल: राहिलेला विषय',
    offlineStudyLogger: 'ऑफलाइन / पुस्तक अभ्यास तास नोंदवा',
    offlineStudyLoggerDesc: 'प्रमाणित पुस्तके (लक्ष्मीकांत, स्पेक्ट्रम, NCERT) किंवा लायब्ररीमध्ये अभ्यास केला? थेट नोंदवा.',
    startLiveTimer: '▶ थेट टायमर सुरू करा',
    logPastHours: '📝 मागील तास नोंदवा',
    topicChecklistHeader: 'विषय चेकलिस्ट (स्थिती बदलण्यासाठी टॅप करा)',
    viewTopic: '📖 विषय पहा',
    planForToday: 'आजचे नियोजन',
    plusOneRevise: '+१ उजळणी',
    logHours: 'वेळ नोंदवा',
    revise: 'उजळणी',
    mastered: 'पारंगत',
    remaining: 'शिल्लक',
    confirmSignOut: 'तुम्हाला खात्री आहे की तुम्ही साइन आउट करू इच्छिता?',
    signOut: 'साइन आउट',
    confirm: 'निश्चित करा',
    cancel: 'रद्द करा',
    scheduled: 'नियोजित केले!',
    scheduledMsg: 'आजच्या अभ्यास नियोजकात जोडले गेले.',
    studyHoursLogged: 'अभ्यास वेळ नोंदवली गेली! 📚',
    tenHourSchedule: '१० तासांचे वेळापत्रक',
    tenHourScheduleTitle: 'यूपीएससी / एमपीएससी उमेदवारांसाठी १० तासांचे अभ्यास वेळापत्रक',
    tenHourScheduleDesc: 'सखोल एकाग्रता आणि जास्तीत जास्त स्मरणशक्तीसाठी ४ सत्रांचे शिस्तबद्ध वेळापत्रक.',
    apply10hToday: '⚡ आजच्या नियोजनात लागू करा',
    apply10hTomorrow: '⚡ उद्याच्या नियोजनात लागू करा',
    currentSlotActive: 'सध्याचे चालू सत्र',
    honestStudyQuote: 'केवळ तासांची मोजणी करण्यासाठी बसू नका, मनापासून आणि प्रामाणिकपणे अभ्यास करा.',
    seeDetails: 'तपशील पहा',
    hideDetails: 'तपशील लपवा',
    progressTrackerTitle: 'प्रगती ट्रॅकर',
    timeSpent: 'अभ्यास वेळ',
    startFocus: 'अभ्यास सुरू करा'
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

// ==================== BILINGUAL SUBJECT TRANSLATIONS ====================
export const SUBJECT_TRANSLATIONS = {
  // UPSC Civil Services
  'upsc-history-culture': {
    en: 'History and Culture',
    mr: 'इतिहास आणि संस्कृती'
  },
  'upsc-geography': {
    en: 'Geography',
    mr: 'भूगोल'
  },
  'upsc-polity': {
    en: 'Indian Polity and Governance',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'upsc-economy': {
    en: 'Indian Economy',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'upsc-environment': {
    en: 'Environment and Ecology',
    mr: 'पर्यावरण आणि परिसंस्था'
  },
  'upsc-science-tech': {
    en: 'Science and Technology',
    mr: 'विज्ञान आणि तंत्रज्ञान'
  },
  'upsc-current-affairs': {
    en: 'Current Affairs',
    mr: 'चालू घडामोडी'
  },
  'upsc-csat': {
    en: 'CSAT (Prelims Paper II)',
    mr: 'CSAT (पूर्व परीक्षा पेपर II)'
  },
  'upsc-ethics': {
    en: 'Ethics, Integrity and Aptitude (Mains)',
    mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता (मुख्य)'
  },

  // MPSC Maharashtra State Services
  'mpsc-history': {
    en: 'Maharashtra and Indian History',
    mr: 'महाराष्ट्र आणि भारताचा इतिहास'
  },
  'mpsc-geography': {
    en: 'Maharashtra and Indian Geography',
    mr: 'महाराष्ट्र आणि भारताचा भूगोल'
  },
  'mpsc-polity': {
    en: 'Constitution & Administration',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'mpsc-economy': {
    en: 'Indian and Maharashtra Economy',
    mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था'
  },
  'mpsc-marathi': {
    en: 'Marathi Language',
    mr: 'मराठी भाषा'
  },
  'mpsc-english': {
    en: 'English Language',
    mr: 'इंग्रजी भाषा'
  },
  'mpsc-aptitude': {
    en: 'Aptitude and Reasoning',
    mr: 'अंकगणित आणि बुद्धिमत्ता चाचणी'
  },
  'mpsc-environment-science': {
    en: 'Environment and Science',
    mr: 'पर्यावरण आणि सामान्य विज्ञान'
  },
  'mpsc-current-affairs': {
    en: 'Current Affairs',
    mr: 'चालू घडामोडी'
  },

  // Legacy & Alias IDs
  'polity': {
    en: 'Indian Polity and Governance',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'history': {
    en: 'History of Modern India',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'economy': {
    en: 'Indian Economy',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'geography': {
    en: 'Geography',
    mr: 'भूगोल'
  },
  'Indian Polity and Governance': {
    en: 'Indian Polity and Governance',
    mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन'
  },
  'History and Culture': {
    en: 'History and Culture',
    mr: 'इतिहास आणि संस्कृती'
  },
  'History of Modern India': {
    en: 'History of Modern India',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'Maharashtra and Indian History': {
    en: 'Maharashtra and Indian History',
    mr: 'महाराष्ट्र आणि भारताचा इतिहास'
  },
  'Maharashtra and Indian Geography': {
    en: 'Maharashtra and Indian Geography',
    mr: 'महाराष्ट्र आणि भारताचा भूगोल'
  },
  'Indian Economy': {
    en: 'Indian Economy',
    mr: 'भारतीय अर्थव्यवस्था'
  },
  'Indian and Maharashtra Economy': {
    en: 'Indian and Maharashtra Economy',
    mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था'
  },
  'Environment and Ecology': {
    en: 'Environment and Ecology',
    mr: 'पर्यावरण आणि परिसंस्था'
  },
  'Science and Technology': {
    en: 'Science and Technology',
    mr: 'विज्ञान आणि तंत्रज्ञान'
  },
  'Current Affairs': {
    en: 'Current Affairs',
    mr: 'चालू घडामोडी'
  }
};

// ==================== BILINGUAL TOPIC TRANSLATIONS ====================
export const TOPIC_TRANSLATIONS = {
  // Polity & Administration
  'Fundamental Rights': {
    en: 'Fundamental Rights',
    mr: 'मूलभूत हक्क'
  },
  'Fundamental Rights and Duties': {
    en: 'Fundamental Rights and Duties',
    mr: 'मूलभूत हक्क आणि कर्तव्ये'
  },
  'Directive Principles of State Policy': {
    en: 'Directive Principles of State Policy',
    mr: 'राज्याच्या धोरणाची मार्गदर्शक तत्त्वे'
  },
  'Constitution of India': {
    en: 'Constitution of India',
    mr: 'भारताचे संविधान'
  },
  'Parliament and state legislatures': {
    en: 'Parliament and state legislatures',
    mr: 'संसद आणि राज्य विधीमंडळ'
  },
  'Parliament and state legislature': {
    en: 'Parliament and state legislature',
    mr: 'संसद आणि राज्य विधीमंडळ'
  },
  'President, Prime Minister and judiciary': {
    en: 'President, Prime Minister and judiciary',
    mr: 'राष्ट्रपती, पंतप्रधान आणि न्यायव्यवस्था'
  },
  'President, Prime Minister and Judiciary': {
    en: 'President, Prime Minister and Judiciary',
    mr: 'राष्ट्रपती, पंतप्रधान आणि न्यायव्यवस्था'
  },
  'Panchayati Raj and local government': {
    en: 'Panchayati Raj and local government',
    mr: 'पंचायती राज आणि स्थानिक स्वराज्य'
  },
  'Constitutional and statutory bodies': {
    en: 'Constitutional and statutory bodies',
    mr: 'संवैधानिक आणि वैधानिक संस्था'
  },
  'Governor and Chief Minister': {
    en: 'Governor and Chief Minister',
    mr: 'राज्यपाल आणि मुख्यमंत्री'
  },
  'Maharashtra government structure': {
    en: 'Maharashtra government structure',
    mr: 'महाराष्ट्र शासन संरचना'
  },
  'Local self-government': {
    en: 'Local self-government',
    mr: 'स्थानिक स्वराज्य संस्था'
  },
  'Panchayati Raj and urban administration': {
    en: 'Panchayati Raj and urban administration',
    mr: 'पंचायती राज आणि नागरी प्रशासन'
  },
  'Panchayati Raj and urban administration in Maharashtra': {
    en: 'Panchayati Raj and urban administration in Maharashtra',
    mr: 'महाराष्ट्रातील पंचायती राज आणि नागरी प्रशासन'
  },

  // History & Culture
  'History of Modern India': {
    en: 'History of Modern India',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'Ancient Indian history': {
    en: 'Ancient Indian history',
    mr: 'प्राचीन भारताचा इतिहास'
  },
  'Medieval Indian history': {
    en: 'Medieval Indian history',
    mr: 'मध्ययुगीन भारताचा इतिहास'
  },
  'Modern Indian history': {
    en: 'Modern Indian history',
    mr: 'आधुनिक भारताचा इतिहास'
  },
  'Indian freedom struggle': {
    en: 'Indian freedom struggle',
    mr: 'भारतीय स्वातंत्र्य लढा'
  },
  'Indian freedom struggle & Gandhian Movements': {
    en: 'Indian freedom struggle & Gandhian Movements',
    mr: 'भारतीय स्वातंत्र्य लढा आणि गांधीवादी चळवळी'
  },
  'Art, architecture and culture': {
    en: 'Art, architecture and culture',
    mr: 'कला, स्थापत्य आणि संस्कृती'
  },
  'World history (Mains)': {
    en: 'World history (Mains)',
    mr: 'जागतिक इतिहास (मुख्य)'
  },
  'Ancient and medieval Indian history': {
    en: 'Ancient and medieval Indian history',
    mr: 'प्राचीन आणि मध्ययुगीन भारताचा इतिहास'
  },
  'Modern India and freedom struggle': {
    en: 'Modern India and freedom struggle',
    mr: 'आधुनिक भारत आणि स्वातंत्र्य लढा'
  },
  'Chhatrapati Shivaji Maharaj': {
    en: 'Chhatrapati Shivaji Maharaj',
    mr: 'छत्रपती शिवाजी महाराज'
  },
  'Maratha Empire and Peshwa period': {
    en: 'Maratha Empire and Peshwa period',
    mr: 'मराठा साम्राज्य आणि पेशवे काळ'
  },
  'Social reformers of Maharashtra': {
    en: 'Social reformers of Maharashtra',
    mr: 'महाराष्ट्रातील समाजसुधारक'
  },
  "Maharashtra's formation in 1960": {
    en: "Maharashtra's formation in 1960",
    mr: 'संयुक्त महाराष्ट्र चळवळ व निर्मिती (१९६०)'
  },

  // Geography
  'Physical geography': {
    en: 'Physical geography',
    mr: 'प्राकृतिक भूगोल'
  },
  'Indian geography': {
    en: 'Indian geography',
    mr: 'भारताचा भूगोल'
  },
  'World geography': {
    en: 'World geography',
    mr: 'जगाचा भूगोल'
  },
  'Climate, rivers and monsoons': {
    en: 'Climate, rivers and monsoons',
    mr: 'हवामान, नद्या आणि मान्सून'
  },
  'Agriculture and natural resources': {
    en: 'Agriculture and natural resources',
    mr: 'शेती आणि नैसर्गिक संसाधने'
  },
  'Human and economic geography': {
    en: 'Human and economic geography',
    mr: 'मानवी आणि आर्थिक भूगोल'
  },
  'Sahyadri and Western Ghats': {
    en: 'Sahyadri and Western Ghats',
    mr: 'सह्याद्री आणि पश्चिम घाट'
  },
  "Maharashtra's districts and divisions": {
    en: "Maharashtra's districts and divisions",
    mr: 'महाराष्ट्राचे जिल्हे आणि प्रशासकीय विभाग'
  },
  'Godavari, Krishna and other river systems': {
    en: 'Godavari, Krishna and other river systems',
    mr: 'गोदावरी, कृष्णा व इतर नद्यांची खोरी'
  },
  'Climate, rainfall and soils': {
    en: 'Climate, rainfall and soils',
    mr: 'हवामान, पर्जन्य आणि मृदा'
  },
  'Agriculture and irrigation': {
    en: 'Agriculture and irrigation',
    mr: 'शेती आणि जलसिंचन'
  },
  'Minerals, industries and population': {
    en: 'Minerals, industries and population',
    mr: 'खनिजे, उद्योग आणि लोकसंख्या'
  },

  // Economy
  'GDP, inflation and national income': {
    en: 'GDP, inflation and national income',
    mr: 'जीडीपी, महागाई आणि राष्ट्रीय उत्पन्न'
  },
  'Banking and monetary policy': {
    en: 'Banking and monetary policy',
    mr: 'बँकिंग आणि चलनविषयक धोरण'
  },
  'Budget and taxation': {
    en: 'Budget and taxation',
    mr: 'अर्थसंकल्प आणि करप्रणाली'
  },
  'Poverty, unemployment and development': {
    en: 'Poverty, unemployment and development',
    mr: 'दारिद्र्य, बेरोजगारी आणि विकास'
  },
  'Agriculture and industry': {
    en: 'Agriculture and industry',
    mr: 'शेती आणि उद्योग'
  },
  'Government economic schemes': {
    en: 'Government economic schemes',
    mr: 'सरकारी आर्थिक योजना'
  },
  'Basic economic concepts': {
    en: 'Basic economic concepts',
    mr: 'मूलभूत आर्थिक संकल्पना'
  },
  'State budget and economic survey': {
    en: 'State budget and economic survey',
    mr: 'राज्य अर्थसंकल्प आणि आर्थिक पाहणी'
  },
  'Maharashtra agriculture and industries': {
    en: 'Maharashtra agriculture and industries',
    mr: 'महाराष्ट्रातील कृषी आणि उद्योग'
  },
  'Banking, inflation and taxation': {
    en: 'Banking, inflation and taxation',
    mr: 'बँकिंग, महागाई आणि कररचना'
  },
  'Poverty and unemployment': {
    en: 'Poverty and unemployment',
    mr: 'दारिद्र्य आणि बेरोजगारी'
  },
  'State and central government schemes': {
    en: 'State and central government schemes',
    mr: 'राज्य व केंद्र सरकारच्या योजना'
  },

  // Environment & Science
  'Ecosystems and food chains': {
    en: 'Ecosystems and food chains',
    mr: 'परिसंस्था आणि अन्नसाखळी'
  },
  'Biodiversity and conservation': {
    en: 'Biodiversity and conservation',
    mr: 'जैवविविधता आणि संवर्धन'
  },
  'National parks and wildlife sanctuaries': {
    en: 'National parks and wildlife sanctuaries',
    mr: 'राष्ट्रीय उद्याने आणि वन्यजीव अभयारण्ये'
  },
  'Climate change and global warming': {
    en: 'Climate change and global warming',
    mr: 'हवामान बदल आणि जागतिक तापमानवाढ'
  },
  'Pollution and environmental laws': {
    en: 'Pollution and environmental laws',
    mr: 'प्रदूषण आणि पर्यावरण कायदे'
  },
  'Ecology and biodiversity': {
    en: 'Ecology and biodiversity',
    mr: 'पर्यावरण आणि जैवविविधता'
  },
  'Pollution and climate change': {
    en: 'Pollution and climate change',
    mr: 'प्रदूषण आणि हवामान बदल'
  },
  'General science': {
    en: 'General science',
    mr: 'सामान्य विज्ञान'
  },
  'Health and technology': {
    en: 'Health and technology',
    mr: 'आरोग्य आणि तंत्रज्ञान'
  },
  'Maharashtra forests and wildlife': {
    en: 'Maharashtra forests and wildlife',
    mr: 'महाराष्ट्रातील वने आणि वन्यजीव'
  },
  'Physics, chemistry and biology basics': {
    en: 'Physics, chemistry and biology basics',
    mr: 'भौतिक, रसायन आणि जीवशास्त्र मूलभूत संकल्पना'
  },
  'Space technology and satellites': {
    en: 'Space technology and satellites',
    mr: 'अंतराळ तंत्रज्ञान आणि उपग्रह'
  },
  'Biotechnology': {
    en: 'Biotechnology',
    mr: 'जैवतंत्रज्ञान'
  },
  'Artificial intelligence and emerging technologies': {
    en: 'Artificial intelligence and emerging technologies',
    mr: 'कृत्रिम बुद्धिमत्ता आणि उदयोन्मुख तंत्रज्ञान'
  },
  'Health and scientific developments': {
    en: 'Health and scientific developments',
    mr: 'आरोग्य आणि वैज्ञानिक घडामोडी'
  },

  // CSAT & Languages
  'Reading comprehension': {
    en: 'Reading comprehension',
    mr: 'उतारे व आकलन'
  },
  'Logical reasoning': {
    en: 'Logical reasoning',
    mr: 'तर्कशुद्ध विचारक्षमता'
  },
  'Analytical ability': {
    en: 'Analytical ability',
    mr: 'विश्लेषण क्षमता'
  },
  'Basic mathematics': {
    en: 'Basic mathematics',
    mr: 'मूलभूत गणित'
  },
  'Data interpretation': {
    en: 'Data interpretation',
    mr: 'माहितीचे विश्लेषण (DI)'
  },
  'Decision-making and problem-solving': {
    en: 'Decision-making and problem-solving',
    mr: 'निर्णय क्षमता आणि समस्या निवारण'
  },
  'Grammar and sentence structure': {
    en: 'Grammar and sentence structure',
    mr: 'व्याकरण आणि वाक्यरचना'
  },
  'Vocabulary and synonyms': {
    en: 'Vocabulary and synonyms',
    mr: 'शब्दसंग्रह आणि समानार्थी शब्द'
  },
  'Antonyms and idioms': {
    en: 'Antonyms and idioms',
    mr: 'विरुद्धार्थी शब्द आणि वाक्प्रचार'
  },
  'Sentence correction and usage': {
    en: 'Sentence correction and usage',
    mr: 'वाक्य दुरुस्ती आणि शब्दप्रयोग'
  },
  'Grammar and vocabulary': {
    en: 'Grammar and vocabulary',
    mr: 'व्याकरण आणि शब्दसंग्रह'
  },
  'Synonyms and antonyms': {
    en: 'Synonyms and antonyms',
    mr: 'समानार्थी आणि विरुद्धार्थी शब्द'
  },
  'Sentence correction': {
    en: 'Sentence correction',
    mr: 'वाक्य शुद्धीकरण'
  },
  'Comprehension': {
    en: 'Comprehension',
    mr: 'उतारा आकलन'
  },
  'Basic usage and writing skills': {
    en: 'Basic usage and writing skills',
    mr: 'मूलभूत वापर आणि लेखन कौशल्य'
  },
  'Number systems and percentages': {
    en: 'Number systems and percentages',
    mr: 'संख्या पद्धती आणि टक्केवारी'
  },
  'Ratio and proportion': {
    en: 'Ratio and proportion',
    mr: 'गुणोत्तर आणि प्रमाण'
  },
  'Time, speed and distance': {
    en: 'Time, speed and distance',
    mr: 'वेळ, वेग आणि अंतर'
  },
  'Mental ability': {
    en: 'Mental ability',
    mr: 'मानसिक क्षमता चाचणी'
  },

  // Ethics & Current Affairs
  'Ethics and human values': {
    en: 'Ethics and human values',
    mr: 'नीतिशास्त्र आणि मानवी मूल्ये'
  },
  'Integrity and impartiality': {
    en: 'Integrity and impartiality',
    mr: 'सत्यनिष्ठा आणि निष्पक्षता'
  },
  'Emotional intelligence': {
    en: 'Emotional intelligence',
    mr: 'भावनिक बुद्धिमत्ता'
  },
  'Public service values': {
    en: 'Public service values',
    mr: 'लोकसेवा मूल्ये'
  },
  'Case studies and ethical dilemmas': {
    en: 'Case studies and ethical dilemmas',
    mr: 'प्रकरण अभ्यास आणि नैतिक पेच'
  },
  'National and international news': {
    en: 'National and international news',
    mr: 'राष्ट्रीय आणि आंतरराष्ट्रीय घडामोडी'
  },
  'Government policies and schemes': {
    en: 'Government policies and schemes',
    mr: 'सरकारी धोरणे आणि योजना'
  },
  'Important reports and indices': {
    en: 'Important reports and indices',
    mr: 'महत्त्वाचे अहवाल आणि निर्देशांक'
  },
  'International organisations': {
    en: 'International organisations',
    mr: 'आंतरराष्ट्रीय संघटना'
  },
  'Awards, appointments and major events': {
    en: 'Awards, appointments and major events',
    mr: 'पुरस्कार, नियुक्त्या आणि महत्त्वाच्या घटना'
  },
  'Maharashtra government decisions': {
    en: 'Maharashtra government decisions',
    mr: 'महाराष्ट्र शासनाचे निर्णय'
  },
  'State and national schemes': {
    en: 'State and national schemes',
    mr: 'राज्य व राष्ट्रीय योजना'
  },
  'National and international events': {
    en: 'National and international events',
    mr: 'राष्ट्रीय आणि आंतरराष्ट्रीय घडामोडी'
  },
  'Important appointments and awards': {
    en: 'Important appointments and awards',
    mr: 'महत्त्वाच्या नियुक्त्या आणि पुरस्कार'
  },
  'Maharashtra economic and social developments': {
    en: 'Maharashtra economic and social developments',
    mr: 'महाराष्ट्रातील आर्थिक व सामाजिक घडामोडी'
  }
};

// ==================== BILINGUAL CHAPTER TRANSLATIONS ====================
export const CHAPTER_TRANSLATIONS = {
  'History and Culture': { en: 'History and Culture', mr: 'इतिहास आणि संस्कृती' },
  'Geography': { en: 'Geography', mr: 'भूगोल' },
  'Indian Polity and Governance': { en: 'Indian Polity and Governance', mr: 'भारतीय राज्यव्यवस्था आणि प्रशासन' },
  'Indian Economy': { en: 'Indian Economy', mr: 'भारतीय अर्थव्यवस्था' },
  'Environment and Ecology': { en: 'Environment and Ecology', mr: 'पर्यावरण आणि परिसंस्था' },
  'Science and Technology': { en: 'Science and Technology', mr: 'विज्ञान आणि तंत्रज्ञान' },
  'Current Affairs': { en: 'Current Affairs', mr: 'चालू घडामोडी' },
  'CSAT (Prelims Paper II)': { en: 'CSAT (Prelims Paper II)', mr: 'CSAT (पूर्व परीक्षा पेपर II)' },
  'Ethics, Integrity and Aptitude': { en: 'Ethics, Integrity and Aptitude', mr: 'नीतिशास्त्र, सत्यनिष्ठा आणि अभियोग्यता' },
  'Maharashtra and Indian History': { en: 'Maharashtra and Indian History', mr: 'महाराष्ट्र आणि भारताचा इतिहास' },
  'Maharashtra and Indian Geography': { en: 'Maharashtra and Indian Geography', mr: 'महाराष्ट्र आणि भारताचा भूगोल' },
  'Constitution & Administration': { en: 'Constitution & Administration', mr: 'संविधान आणि प्रशासन' },
  'Indian and Maharashtra Economy': { en: 'Indian and Maharashtra Economy', mr: 'भारतीय आणि महाराष्ट्राची अर्थव्यवस्था' },
  'Marathi Language': { en: 'Marathi Language', mr: 'मराठी भाषा' },
  'English Language': { en: 'English Language', mr: 'इंग्रजी भाषा' },
  'Aptitude and Reasoning': { en: 'Aptitude and Reasoning', mr: 'अंकगणित आणि बुद्धिमत्ता' },
  'Environment and Science': { en: 'Environment and Science', mr: 'पर्यावरण आणि विज्ञान' }
};

// Helper methods:
export const getSubjectName = (subjectOrId, lang = 'en') => {
  if (!subjectOrId) return '';
  const id = typeof subjectOrId === 'string' ? subjectOrId : (subjectOrId.id || subjectOrId.name);
  const rawName = typeof subjectOrId === 'object' ? subjectOrId.name : subjectOrId;
  if (lang !== 'mr') return rawName || id;

  const entry = SUBJECT_TRANSLATIONS[id] || Object.values(SUBJECT_TRANSLATIONS).find(s => s.en === rawName);
  return entry?.mr || rawName || id;
};

export const getTopicName = (topicOrName, lang = 'en') => {
  if (!topicOrName) return '';
  const rawName = typeof topicOrName === 'object' ? (topicOrName.name || topicOrName.id) : topicOrName;
  if (lang !== 'mr') return rawName;

  const entry = TOPIC_TRANSLATIONS[rawName] || Object.values(TOPIC_TRANSLATIONS).find(t => t.en === rawName);
  return entry?.mr || rawName;
};

export const getChapterName = (chapter, lang = 'en') => {
  if (!chapter) return '';
  if (lang !== 'mr') return chapter;
  return CHAPTER_TRANSLATIONS[chapter]?.mr || chapter;
};

export const getTaskTitle = (title, lang = 'en') => {
  if (!title || lang !== 'mr') return title;

  // Direct match
  if (TOPIC_TRANSLATIONS[title]?.mr) return TOPIC_TRANSLATIONS[title].mr;

  // Composite check: "<Subject>: <Topic>"
  if (title.includes(':')) {
    const parts = title.split(':');
    const sPart = parts[0].trim();
    const tPart = parts.slice(1).join(':').trim();
    const translatedSub = getSubjectName(sPart, 'mr');
    const translatedTop = getTopicName(tPart, 'mr');
    return `${translatedSub}: ${translatedTop}`;
  }

  // Suffix checks (e.g. "Core Revision", "Priority Session", "Study Session", "45m Block")
  if (title.endsWith(' Core Revision')) {
    const base = title.replace(' Core Revision', '').trim();
    return `${getSubjectName(base, 'mr')} सखोल उजळणी`;
  }
  if (title.endsWith(' Priority Session')) {
    const base = title.replace(' Priority Session', '').trim();
    return `${getSubjectName(base, 'mr')} प्राधान्य सत्र`;
  }
  if (title.endsWith(' Study Session')) {
    const base = title.replace(' Study Session', '').trim();
    return `${getSubjectName(base, 'mr')} अभ्यास सत्र`;
  }
  if (title.endsWith(' 45m Block')) {
    const base = title.replace(' 45m Block', '').trim();
    return `${getSubjectName(base, 'mr')} ४५ मि. स्लॉट`;
  }

  return getTopicName(title, 'mr');
};

export const getStatusLabel = (status, lang = 'en') => {
  if (lang !== 'mr') return status;
  const map = {
    'completed': 'पूर्ण',
    'pending': 'प्रलंबित',
    'in-progress': 'प्रगतीपथावर',
    'inProgress': 'प्रगतीपथावर',
    'mastered': 'पारंगत / पूर्ण',
    'toRevise': 'उजळणी बाकी',
    'notStarted': 'सुरू नाही केले'
  };
  return map[status] || status;
};

export default {
  AVAILABLE_LANGUAGES,
  translations,
  getTranslation
};
