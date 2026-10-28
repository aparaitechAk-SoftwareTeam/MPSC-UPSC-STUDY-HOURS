import React, { useState, useMemo } from 'react';
import {
  Timer,
  Clock,
  Users,
  CheckCircle2,
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  Filter,
  RefreshCw,
  Flame,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Eye,
  X,
  Sparkles
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { cn } from '@/lib/utils';

export default function SessionsPage({ data = {}, loading = false, load = () => {}, onSignOut }) {
  // Tabs: 'ranking' | 'logs'
  const [activeTab, setActiveTab] = useState('ranking');

  // Ranking filters
  const [rankingTimeframe, setRankingTimeframe] = useState('all'); // 'all' | '30d' | '7d' | '24h'
  const [rankingMetric, setRankingMetric] = useState('hours'); // 'hours' | 'sessions' | 'focus'
  const [rankingSearch, setRankingSearch] = useState('');

  // Session logs filters
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionModeFilter, setSessionModeFilter] = useState('all');
  const [filteredStudentId, setFilteredStudentId] = useState(null);

  // Inspector modal for a selected ranked student
  const [selectedRankedStudent, setSelectedRankedStudent] = useState(null);

  // Helper date filtering
  const now = Date.now();
  const getCutoff = (tf) => {
    if (tf === '24h') return now - 24 * 60 * 60 * 1000;
    if (tf === '7d') return now - 7 * 24 * 60 * 60 * 1000;
    if (tf === '30d') return now - 30 * 24 * 60 * 60 * 1000;
    return 0; // all
  };

  // Compute student rankings from data.sessions and data.users
  const { rankedList, topSummary } = useMemo(() => {
    const sessions = data.sessions || [];
    const users = data.users || [];
    const subjects = data.subjects || [];

    const cutoff = getCutoff(rankingTimeframe);
    const validSessions = sessions.filter((s) => {
      if (!cutoff) return true;
      const ts = new Date(s.startedAt || s.createdAt || 0).getTime();
      return ts >= cutoff;
    });

    // Group by userId
    const userMap = {};
    validSessions.forEach((s) => {
      const uid = s.userId;
      if (!userMap[uid]) {
        userMap[uid] = {
          userId: uid,
          totalMinutes: 0,
          sessionCount: 0,
          focusScoreSum: 0,
          subjectMinutes: {},
          lastStartedAt: s.startedAt || '',
          sessions: [],
        };
      }
      userMap[uid].totalMinutes += s.minutes || 0;
      userMap[uid].sessionCount += 1;
      userMap[uid].focusScoreSum += s.focusScore || 90;
      userMap[uid].sessions.push(s);

      const subjId = s.subjectId || 'general';
      userMap[uid].subjectMinutes[subjId] =
        (userMap[uid].subjectMinutes[subjId] || 0) + (s.minutes || 0);

      if (
        s.startedAt &&
        (!userMap[uid].lastStartedAt ||
          new Date(s.startedAt) > new Date(userMap[uid].lastStartedAt))
      ) {
        userMap[uid].lastStartedAt = s.startedAt;
      }
    });

    // Build array with student metadata
    const list = Object.values(userMap).map((item) => {
      const user = users.find((u) => u.id === item.userId);
      const avgFocus = item.sessionCount
        ? Math.round(item.focusScoreSum / item.sessionCount)
        : 0;

      // Find top subject
      let topSubjId = null;
      let maxSubjMin = -1;
      Object.entries(item.subjectMinutes).forEach(([sId, m]) => {
        if (m > maxSubjMin) {
          maxSubjMin = m;
          topSubjId = sId;
        }
      });
      const topSubjectObj = subjects.find((sub) => sub.id === topSubjId);

      return {
        ...item,
        name: user?.name || 'Aspirant ' + item.userId.slice(-4),
        email: user?.email || 'N/A',
        role: user?.role || 'student',
        avgFocus,
        topSubject: topSubjectObj ? topSubjectObj.name : 'General Studies',
        topSubjectPaper: topSubjectObj ? topSubjectObj.paper : 'GS',
        hoursDecimal: Number((item.totalMinutes / 60).toFixed(1)),
      };
    });

    // Sort according to metric
    if (rankingMetric === 'sessions') {
      list.sort((a, b) => b.sessionCount - a.sessionCount || b.totalMinutes - a.totalMinutes);
    } else if (rankingMetric === 'focus') {
      list.sort((a, b) => b.avgFocus - a.avgFocus || b.totalMinutes - a.totalMinutes);
    } else {
      // 'hours' default
      list.sort((a, b) => b.totalMinutes - a.totalMinutes || b.sessionCount - a.sessionCount);
    }

    // Assign rank positions (1-indexed)
    const rankedWithPositions = list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    // Calculate highlights
    const topPerformer = rankedWithPositions[0] || null;
    const totalActive = rankedWithPositions.length;
    const avgMinutes = totalActive
      ? Math.round(
          rankedWithPositions.reduce((acc, cur) => acc + cur.totalMinutes, 0) / totalActive
        )
      : 0;

    return {
      rankedList: rankedWithPositions,
      topSummary: {
        topPerformer,
        totalActive,
        avgHours: (avgMinutes / 60).toFixed(1),
      },
    };
  }, [data.sessions, data.users, data.subjects, rankingTimeframe, rankingMetric]);

  // Overall rank map (across all time) to show badges inside session logs
  const overallRankMap = useMemo(() => {
    const sessions = data.sessions || [];
    const userMinutes = {};
    sessions.forEach((s) => {
      userMinutes[s.userId] = (userMinutes[s.userId] || 0) + (s.minutes || 0);
    });
    const sorted = Object.entries(userMinutes).sort((a, b) => b[1] - a[1]);
    const map = {};
    sorted.forEach(([uId], idx) => {
      map[uId] = idx + 1;
    });
    return map;
  }, [data.sessions]);

  // Filtered leaderboard for search
  const filteredLeaderboard = useMemo(() => {
    if (!rankingSearch.trim()) return rankedList;
    const q = rankingSearch.trim().toLowerCase();
    return rankedList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.topSubject.toLowerCase().includes(q)
    );
  }, [rankedList, rankingSearch]);

  // Top 3 for Podium
  const topThree = useMemo(() => {
    return rankedList.slice(0, 3);
  }, [rankedList]);

  // Switch to logs tab and filter to a specific student
  const handleInspectStudentLogs = (studentId) => {
    setFilteredStudentId(studentId);
    const user = (data.users || []).find((u) => u.id === studentId);
    if (user) {
      setSessionSearch(user.name);
    }
    setActiveTab('logs');
  };

  return (
    <AppShell title="Study Sessions & Rankings" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
              <span>Management</span>
              <span>/</span>
              <span className="text-foreground font-semibold">Sessions & Rankings</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Study Sessions & Rankings
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Trophy size={13} /> Leaderboard
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Track real-time student study hours, focus intensity, and competitive aspirant rankings.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border bg-muted/40 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('ranking')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all',
                  activeTab === 'ranking'
                    ? 'bg-card text-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Trophy size={15} className={activeTab === 'ranking' ? 'text-amber-500' : ''} />
                Student Rankings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all',
                  activeTab === 'logs'
                    ? 'bg-card text-foreground shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Timer size={15} className={activeTab === 'logs' ? 'text-primary' : ''} />
                Session Activity Logs
              </button>
            </div>

            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="h-9 w-9 grid place-items-center rounded-xl border bg-card hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Refresh data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Global Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Focus Sessions
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center">
                <Timer className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{data.sessions?.length || 0}</p>
            <p className="mt-1 text-xs text-muted-foreground">All completed study sessions</p>
          </div>

          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Study Hours
              </span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              {((data.sessions?.reduce((sum, s) => sum + (s.minutes || 0), 0) || 0) / 60).toFixed(1)}h
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.sessions?.reduce((sum, s) => sum + (s.minutes || 0), 0) || 0} total study minutes
            </p>
          </div>

          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Focus Score
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 grid place-items-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              {data.sessions?.length
                ? Math.round(
                    data.sessions.reduce((a, s) => a + (s.focusScore || 0), 0) / data.sessions.length
                  )
                : 0}
              %
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Across all recorded study blocks</p>
          </div>

          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ranked Aspirants
              </span>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 grid place-items-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              {new Set((data.sessions || []).map((s) => s.userId)).size}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active students with logged study time</p>
          </div>
        </div>

        {/* TAB 1: STUDENT RANKINGS & LEADERBOARD */}
        {activeTab === 'ranking' && (
          <div className="flex flex-col gap-6">
            {/* Filter and Criteria Toolbar */}
            <div className="card-surface p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Timeframe Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Calendar size={13} /> Period:
                  </span>
                  <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs font-medium">
                    {[
                      { id: 'all', label: 'All Time' },
                      { id: '30d', label: 'Last 30 Days' },
                      { id: '7d', label: 'Last 7 Days' },
                      { id: '24h', label: 'Today (24h)' },
                    ].map((tf) => (
                      <button
                        key={tf.id}
                        type="button"
                        onClick={() => setRankingTimeframe(tf.id)}
                        className={cn(
                          'px-2.5 py-1 rounded-md transition-colors',
                          rankingTimeframe === tf.id
                            ? 'bg-card text-foreground font-semibold shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metric Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <TrendingUp size={13} /> Rank By:
                  </span>
                  <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs font-medium">
                    {[
                      { id: 'hours', label: 'Study Hours', icon: Clock },
                      { id: 'sessions', label: 'Sessions Logged', icon: Timer },
                      { id: 'focus', label: 'Focus Score', icon: CheckCircle2 },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setRankingMetric(m.id)}
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors',
                            rankingMetric === m.id
                              ? 'bg-card text-foreground font-semibold shadow-sm'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <Icon size={12} />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Search in Leaderboard */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={rankingSearch}
                  onChange={(e) => setRankingSearch(e.target.value)}
                  placeholder="Find student in ranking..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {rankingSearch && (
                  <button
                    type="button"
                    onClick={() => setRankingSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* TOP 3 PODIUM CARDS (If we have at least 1 ranked student) */}
            {topThree.length > 0 && !rankingSearch && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 2nd Place (Silver) */}
                <div
                  className={cn(
                    'card-surface rounded-2xl border p-5 relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-md order-2 md:order-1',
                    topThree[1]
                      ? 'border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/30'
                      : 'opacity-60 border-dashed'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      🥈 Rank #2 · Silver
                    </span>
                    <Medal className="h-6 w-6 text-slate-400" />
                  </div>

                  {topThree[1] ? (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold grid place-items-center text-sm shadow-inner">
                          {topThree[1].name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm line-clamp-1">
                            {topThree[1].name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {topThree[1].email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/60 text-center mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Study Time</div>
                          <div className="text-sm font-bold text-foreground">
                            {topThree[1].hoursDecimal}h
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sessions</div>
                          <div className="text-sm font-bold text-foreground">
                            {topThree[1].sessionCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Focus</div>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {topThree[1].avgFocus}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Top: {topThree[1].topSubject}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedRankedStudent(topThree[1])}
                          className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          View Stats <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      No 2nd place runner-up in this period yet.
                    </div>
                  )}
                </div>

                {/* 1st Place (Gold Champion) - Raised & Highlighted */}
                <div
                  className={cn(
                    'card-surface rounded-2xl border-2 border-amber-400 dark:border-amber-500/80 p-6 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-amber-500/5 bg-gradient-to-b from-amber-50/70 to-card dark:from-amber-950/20 order-1 md:order-2 md:-mt-2',
                    topThree[0] ? '' : 'opacity-60'
                  )}
                >
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <div className="h-16 w-16 bg-amber-400/10 rounded-full blur-xl" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm">
                      <Crown size={14} className="animate-pulse" /> Rank #1 · Gold Champion
                    </span>
                    <Trophy className="h-7 w-7 text-amber-500" />
                  </div>

                  {topThree[0] ? (
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-extrabold grid place-items-center text-lg shadow-md ring-4 ring-amber-400/20">
                          {topThree[0].name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-black text-foreground text-base">
                              {topThree[0].name}
                            </h3>
                            <Sparkles size={14} className="text-amber-500" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {topThree[0].email}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            ★ Leading Aspirant
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2.5 bg-background/80 rounded-xl border border-amber-400/20 text-center mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Study Hours</div>
                          <div className="text-base font-black text-foreground">
                            {topThree[0].hoursDecimal}h
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {topThree[0].totalMinutes} mins
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Sessions</div>
                          <div className="text-base font-black text-foreground">
                            {topThree[0].sessionCount}
                          </div>
                          <div className="text-[10px] text-muted-foreground">Completed</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground font-medium">Avg Focus</div>
                          <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                            {topThree[0].avgFocus}%
                          </div>
                          <div className="text-[10px] text-muted-foreground">High Score</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <span className="font-medium text-foreground">
                          Top: {topThree[0].topSubject}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleInspectStudentLogs(topThree[0].userId)}
                            className="font-semibold text-primary hover:underline text-xs"
                          >
                            Sessions Log
                          </button>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => setSelectedRankedStudent(topThree[0])}
                            className="font-semibold text-amber-600 dark:text-amber-400 hover:underline text-xs"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No study sessions logged yet.
                    </div>
                  )}
                </div>

                {/* 3rd Place (Bronze) */}
                <div
                  className={cn(
                    'card-surface rounded-2xl border p-5 relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-md order-3',
                    topThree[2]
                      ? 'border-amber-700/30 dark:border-amber-800/40 bg-gradient-to-b from-amber-900/5 to-transparent'
                      : 'opacity-60 border-dashed'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-900/10 text-amber-800 dark:text-amber-400">
                      🥉 Rank #3 · Bronze
                    </span>
                    <Award className="h-6 w-6 text-amber-700/60" />
                  </div>

                  {topThree[2] ? (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-11 w-11 rounded-full bg-amber-900/10 text-amber-800 dark:text-amber-400 font-bold grid place-items-center text-sm shadow-inner">
                          {topThree[2].name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-sm line-clamp-1">
                            {topThree[2].name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {topThree[2].email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/60 text-center mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Study Time</div>
                          <div className="text-sm font-bold text-foreground">
                            {topThree[2].hoursDecimal}h
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Sessions</div>
                          <div className="text-sm font-bold text-foreground">
                            {topThree[2].sessionCount}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Focus</div>
                          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {topThree[2].avgFocus}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Top: {topThree[2].topSubject}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedRankedStudent(topThree[2])}
                          className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          View Stats <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      No 3rd place aspirant in this period yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FULL LEADERBOARD TABLE */}
            <section className="card-surface p-6 rounded-2xl border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Student Study Leaderboard
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ranking based on {rankingMetric === 'hours' ? 'total study hours' : rankingMetric === 'sessions' ? 'sessions logged' : 'average focus score'} (
                    {rankingTimeframe === 'all'
                      ? 'All Time'
                      : rankingTimeframe === '30d'
                      ? 'Last 30 Days'
                      : rankingTimeframe === '7d'
                      ? 'Last 7 Days'
                      : 'Last 24 Hours'}
                    )
                  </p>
                </div>

                <div className="text-xs text-muted-foreground font-medium">
                  Showing {filteredLeaderboard.length} of {rankedList.length} active aspirants
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4 w-16 text-center">Rank</th>
                      <th className="py-3 px-4">Student Aspirant</th>
                      <th className="py-3 px-4">Study Time</th>
                      <th className="py-3 px-4 text-center">Sessions</th>
                      <th className="py-3 px-4">Focus Quality</th>
                      <th className="py-3 px-4">Top Subject</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-muted-foreground text-sm">
                          {rankingSearch
                            ? `No students found matching "${rankingSearch}".`
                            : 'No student study records recorded for this timeframe yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.map((student) => {
                        const isTop1 = student.rank === 1;
                        const isTop2 = student.rank === 2;
                        const isTop3 = student.rank === 3;

                        const dateFormatted = student.lastStartedAt
                          ? new Date(student.lastStartedAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Recent';

                        return (
                          <tr
                            key={student.userId}
                            className={cn(
                              'hover:bg-muted/40 transition-colors',
                              isTop1
                                ? 'bg-amber-50/30 dark:bg-amber-950/10'
                                : isTop2
                                ? 'bg-slate-50/20 dark:bg-slate-900/10'
                                : isTop3
                                ? 'bg-amber-900/5'
                                : ''
                            )}
                          >
                            {/* Rank Number & Medal */}
                            <td className="py-3.5 px-4 text-center">
                              {isTop1 ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-white font-black text-xs shadow-sm ring-2 ring-amber-300">
                                  🥇 1
                                </span>
                              ) : isTop2 ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs ring-2 ring-slate-200">
                                  🥈 2
                                </span>
                              ) : isTop3 ? (
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-800/80 text-amber-100 font-bold text-xs ring-2 ring-amber-700/30">
                                  🥉 3
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-foreground font-semibold text-xs">
                                  #{student.rank}
                                </span>
                              )}
                            </td>

                            {/* Student Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold grid place-items-center text-xs flex-shrink-0">
                                  {student.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                                    {student.name}
                                    {isTop1 && (
                                      <Crown size={12} className="text-amber-500 fill-amber-500" />
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{student.email}</div>
                                </div>
                              </div>
                            </td>

                            {/* Study Time */}
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-foreground text-sm">
                                {student.hoursDecimal} hrs
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {student.totalMinutes} minutes
                              </div>
                            </td>

                            {/* Sessions Count */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {student.sessionCount} sessions
                              </span>
                            </td>

                            {/* Focus Quality */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={cn(
                                      'h-full rounded-full',
                                      student.avgFocus >= 85
                                        ? 'bg-emerald-500'
                                        : student.avgFocus >= 70
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                    )}
                                    style={{ width: `${student.avgFocus}%` }}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    'text-xs font-bold',
                                    student.avgFocus >= 85
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : student.avgFocus >= 70
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                  )}
                                >
                                  {student.avgFocus}%
                                </span>
                              </div>
                            </td>

                            {/* Top Subject */}
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-foreground text-xs">
                                {student.topSubject}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {student.topSubjectPaper}
                              </div>
                            </td>

                            {/* Last Active */}
                            <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                              {dateFormatted}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRankedStudent(student)}
                                  className="px-2.5 py-1 rounded-lg border text-xs font-medium hover:bg-muted transition-colors text-foreground inline-flex items-center gap-1"
                                  title="View student study breakdown"
                                >
                                  <Eye size={12} /> Inspect
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInspectStudentLogs(student.userId)}
                                  className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium transition-colors inline-flex items-center gap-1"
                                  title="View all session logs for this student"
                                >
                                  Logs <ChevronRight size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: SESSION ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <section className="card-surface p-6 rounded-2xl border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Recorded Study Activity Logs
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed inspection of individual study sessions, duration, mode, and student focus score
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mode Filter */}
                <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs font-medium">
                  {['all', 'Pomodoro', 'Custom', 'Stopwatch'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSessionModeFilter(m)}
                      className={cn(
                        'px-3 py-1.5 rounded-md capitalize transition-colors',
                        sessionModeFilter === m
                          ? 'bg-card text-foreground font-semibold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {m === 'all' ? 'All Modes' : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Student Filter Notice */}
            {filteredStudentId && (
              <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-primary font-medium">
                <span className="flex items-center gap-1.5">
                  <Eye size={14} /> Filtered to student: <strong>{sessionSearch}</strong> (Overall Rank #{overallRankMap[filteredStudentId] || '—'})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFilteredStudentId(null);
                    setSessionSearch('');
                  }}
                  className="hover:underline font-bold text-xs"
                >
                  Clear Filter ×
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={sessionSearch}
                onChange={(e) => {
                  setSessionSearch(e.target.value);
                  if (!e.target.value) setFilteredStudentId(null);
                }}
                placeholder="Search by student name, email, or subject..."
                className="w-full pl-10 pr-16 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {sessionSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setSessionSearch('');
                    setFilteredStudentId(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sessions Table */}
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Student & Rank</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Focus Quality</th>
                    <th className="py-3 px-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(() => {
                    const list = (data.sessions || []).filter((s) => {
                      if (filteredStudentId && s.userId !== filteredStudentId) return false;

                      const user = (data.users || []).find((u) => u.id === s.userId);
                      const subj = (data.subjects || []).find((sub) => sub.id === s.subjectId);
                      const uName = user ? user.name.toLowerCase() : '';
                      const uEmail = user ? user.email.toLowerCase() : '';
                      const sName = subj ? subj.name.toLowerCase() : '';
                      const q = sessionSearch.trim().toLowerCase();

                      const matchSearch =
                        !q || uName.includes(q) || uEmail.includes(q) || sName.includes(q);
                      const matchMode =
                        sessionModeFilter === 'all' ||
                        (s.mode || 'Pomodoro').toLowerCase() === sessionModeFilter.toLowerCase();

                      return matchSearch && matchMode;
                    });

                    if (list.length === 0) {
                      return (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                            No session records found matching your filter criteria.
                          </td>
                        </tr>
                      );
                    }

                    return list.map((s) => {
                      const user = (data.users || []).find((u) => u.id === s.userId);
                      const subj = (data.subjects || []).find((sub) => sub.id === s.subjectId);
                      const rank = overallRankMap[s.userId];
                      const dateFormatted = s.startedAt
                        ? new Date(s.startedAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent';

                      return (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-semibold text-foreground flex items-center gap-1.5">
                                  {user ? user.name : 'Learner'}
                                  {rank && (
                                    <span
                                      className={cn(
                                        'text-[10px] px-1.5 py-0.5 rounded font-bold',
                                        rank === 1
                                          ? 'bg-amber-400 text-white'
                                          : rank === 2
                                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                                          : rank === 3
                                          ? 'bg-amber-800 text-amber-100'
                                          : 'bg-muted text-muted-foreground'
                                      )}
                                    >
                                      #{rank}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user ? user.email : s.userId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-foreground">
                              {subj ? subj.name : 'Study Session'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {subj ? subj.paper : 'GS'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              {s.mode || 'Pomodoro'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-foreground">
                            {s.minutes} min{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({(s.minutes / 60).toFixed(1)}h)
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${s.focusScore || 90}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {s.focusScore || 90}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                            {dateFormatted}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* STUDENT DETAIL BREAKDOWN MODAL */}
      {selectedRankedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-lg grid place-items-center">
                  {selectedRankedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedRankedStudent.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-white">
                      Rank #{selectedRankedStudent.rank}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedRankedStudent.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRankedStudent(null)}
                className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="p-3.5 rounded-xl border bg-muted/30 text-center">
                <div className="text-xs text-muted-foreground font-medium">Study Hours</div>
                <div className="text-xl font-black text-foreground mt-0.5">
                  {selectedRankedStudent.hoursDecimal}h
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {selectedRankedStudent.totalMinutes} min
                </div>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/30 text-center">
                <div className="text-xs text-muted-foreground font-medium">Total Sessions</div>
                <div className="text-xl font-black text-foreground mt-0.5">
                  {selectedRankedStudent.sessionCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Completed</div>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/30 text-center">
                <div className="text-xs text-muted-foreground font-medium">Average Focus</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedRankedStudent.avgFocus}%
                </div>
                <div className="text-[10px] text-muted-foreground">Quality Score</div>
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                Subject Study Distribution
              </h4>
              <div className="space-y-2">
                {Object.entries(selectedRankedStudent.subjectMinutes || {}).map(([sId, mins]) => {
                  const subj = (data.subjects || []).find((s) => s.id === sId);
                  const sName = subj ? subj.name : 'General Studies';
                  const pct = Math.round((mins / (selectedRankedStudent.totalMinutes || 1)) * 100);

                  return (
                    <div key={sId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{sName}</span>
                        <span className="text-muted-foreground">
                          {mins} mins ({(mins / 60).toFixed(1)}h) · {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Top Focus Subject: <strong>{selectedRankedStudent.topSubject}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  const uId = selectedRankedStudent.userId;
                  setSelectedRankedStudent(null);
                  handleInspectStudentLogs(uId);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              >
                Inspect All Sessions Logs <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
