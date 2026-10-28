import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Timer,
  Clock,
  CheckCircle2,
  BookOpen,
  Calendar,
  Search,
  Filter,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Flame,
  Award,
  Trophy,
  Activity,
  AlertCircle,
  Mail,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function StudentDetailsPage({ data = {}, loading = false, load, onSignOut }) {
  const { studentId } = useParams();
  const navigate = useNavigate();

  // Local state for independent fetching if refreshed directly
  const [localUsers, setLocalUsers] = useState(data.users || []);
  const [localSessions, setLocalSessions] = useState(data.sessions || []);
  const [localSubjects, setLocalSubjects] = useState(data.subjects || []);
  const [localLoading, setLocalLoading] = useState(!data.users?.length);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Filters for this student's sessions list
  const [sessionSearch, setSessionSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');

  // Fetch data if accessed via direct URL or page refresh
  useEffect(() => {
    let cancelled = false;

    async function fetchStudentData() {
      const token = localStorage.getItem('abhyas_admin_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // If parent data already has users, sync them
      if (data.users?.length) {
        setLocalUsers(data.users);
        setLocalSessions(data.sessions || []);
        setLocalSubjects(data.subjects || []);
        setLocalLoading(false);
        return;
      }

      try {
        setLocalLoading(true);
        setError('');
        const [usersRes, sessionsRes, subjectsRes] = await Promise.all([
          fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/admin/sessions`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/admin/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!usersRes.ok || !sessionsRes.ok || !subjectsRes.ok) {
          throw new Error('Failed to retrieve student records from server');
        }

        const [users, sessions, subjects] = await Promise.all([
          usersRes.json(),
          sessionsRes.json(),
          subjectsRes.json(),
        ]);

        if (!cancelled) {
          setLocalUsers(users);
          setLocalSessions(sessions);
          setLocalSubjects(subjects);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load student information.');
        }
      } finally {
        if (!cancelled) setLocalLoading(false);
      }
    }

    fetchStudentData();

    return () => {
      cancelled = true;
    };
  }, [studentId, data.users, data.sessions, data.subjects]);

  // Locate the student
  const student = useMemo(() => {
    return localUsers.find((u) => String(u.id) === String(studentId));
  }, [localUsers, studentId]);

  // Filter this student's sessions
  const studentSessions = useMemo(() => {
    return (localSessions || []).filter((s) => String(s.userId) === String(studentId));
  }, [localSessions, studentId]);

  // Overall calculations for this student
  const stats = useMemo(() => {
    if (!studentSessions.length) {
      return {
        totalMinutes: 0,
        totalHours: '0.0',
        sessionCount: 0,
        avgFocus: 0,
        topSubject: null,
        subjectBreakdown: [],
        modeBreakdown: { Pomodoro: 0, Custom: 0, Stopwatch: 0 },
        lastActive: null,
      };
    }

    const totalMinutes = studentSessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const avgFocus = Math.round(
      studentSessions.reduce((acc, s) => acc + (s.focusScore || 90), 0) / studentSessions.length
    );

    // Subject breakdown
    const subjectMins = {};
    const modeCounts = { Pomodoro: 0, Custom: 0, Stopwatch: 0 };
    let latestTimestamp = 0;

    studentSessions.forEach((s) => {
      const sid = s.subjectId || 'general';
      subjectMins[sid] = (subjectMins[sid] || 0) + (s.minutes || 0);

      const m = s.mode || 'Pomodoro';
      modeCounts[m] = (modeCounts[m] || 0) + 1;

      const t = new Date(s.startedAt || 0).getTime();
      if (t > latestTimestamp) latestTimestamp = t;
    });

    const breakdown = Object.entries(subjectMins).map(([sid, mins]) => {
      const subj = localSubjects.find((sub) => String(sub.id) === String(sid));
      return {
        subjectId: sid,
        name: subj ? subj.name : 'General Studies',
        paper: subj ? subj.paper : 'General',
        minutes: mins,
        hours: (mins / 60).toFixed(1),
        percentage: totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0,
      };
    });

    breakdown.sort((a, b) => b.minutes - a.minutes);

    return {
      totalMinutes,
      totalHours,
      sessionCount: studentSessions.length,
      avgFocus,
      topSubject: breakdown[0] || null,
      subjectBreakdown: breakdown,
      modeBreakdown: modeCounts,
      lastActive: latestTimestamp ? new Date(latestTimestamp) : null,
    };
  }, [studentSessions, localSubjects]);

  // Filtered session records for table
  const filteredSessions = useMemo(() => {
    return studentSessions.filter((s) => {
      const subj = localSubjects.find((sub) => String(sub.id) === String(s.subjectId));
      const sName = subj ? subj.name.toLowerCase() : '';
      const sPaper = subj ? subj.paper.toLowerCase() : '';
      const q = sessionSearch.trim().toLowerCase();

      const matchSearch = !q || sName.includes(q) || sPaper.includes(q);
      const matchMode =
        modeFilter === 'all' || (s.mode || 'Pomodoro').toLowerCase() === modeFilter.toLowerCase();

      return matchSearch && matchMode;
    });
  }, [studentSessions, localSubjects, sessionSearch, modeFilter]);

  // Copy ID to clipboard
  const handleCopyId = () => {
    if (student?.id) {
      navigator.clipboard.writeText(student.id);
      setCopiedId(true);
      toast.success('Student ID copied to clipboard');
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    if (load) await load();
  };

  return (
    <AppShell title={student ? `${student.name} · Student Details` : 'Student Details'} onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-xs"
            >
              <ArrowLeft size={14} /> Back to Students
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span>Management</span>
              <span>/</span>
              <Link to="/students" className="hover:text-foreground transition-colors">
                Students
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold line-clamp-1">
                {student ? student.name : `Student ${studentId}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading || localLoading}
              className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw size={14} className={loading || localLoading ? 'animate-spin' : ''} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {localLoading && (
          <div className="card-surface p-12 rounded-2xl border text-center space-y-3">
            <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
            <h3 className="text-base font-bold text-foreground">Loading student details...</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Retrieving student profile, verified study logs, and subject performance metrics.
            </p>
          </div>
        )}

        {/* ERROR OR NOT FOUND STATE */}
        {!localLoading && (!student || error) && (
          <div className="card-surface p-10 rounded-2xl border text-center space-y-4 max-w-lg mx-auto">
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive grid place-items-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Student Account Not Found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {error ||
                `No student account matches the ID "${studentId}". The account may have been removed or the link is invalid.`}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Return to Students Directory
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS: STUDENT DETAILS DISPLAY */}
        {!localLoading && student && (
          <>
            {/* Profile Header Card */}
            <div className="card-surface p-6 rounded-2xl border shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-black text-2xl grid place-items-center border border-primary/20 shadow-xs flex-shrink-0">
                    {student.name?.charAt(0).toUpperCase() || 'S'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
                          student.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        )}
                      >
                        {student.role || 'student'}
                      </span>
                      {stats.sessionCount > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                          <Activity size={12} /> Active Aspirant
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border">
                          Registered
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={13} className="text-muted-foreground" />
                        <span className="text-foreground font-medium">{student.email}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Shield size={13} className="text-muted-foreground" />
                        <span className="font-mono text-muted-foreground">ID: {student.id}</span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          className="h-5 w-5 grid place-items-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy student ID"
                        >
                          {copiedId ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        </button>
                      </span>

                      {stats.lastActive && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-muted-foreground" />
                          <span>
                            Last active:{' '}
                            {stats.lastActive.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Button to Sessions Leaderboard */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Link
                    to="/sessions"
                    className="w-full md:w-auto px-3.5 py-2 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Trophy size={14} className="text-amber-500" />
                    <span>View in Leaderboard</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-surface p-5 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Study Time
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{stats.totalHours}h</p>
                <p className="mt-1 text-xs text-muted-foreground">{stats.totalMinutes} total minutes recorded</p>
              </div>

              <div className="card-surface p-5 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Completed Sessions
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center">
                    <Timer className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{stats.sessionCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.sessionCount === 1 ? '1 focus block' : `${stats.sessionCount} focus blocks logged`}
                </p>
              </div>

              <div className="card-surface p-5 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Avg Focus Quality
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 grid place-items-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-3xl font-extrabold text-foreground">
                  {stats.avgFocus ? `${stats.avgFocus}%` : '—'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stats.avgFocus >= 85
                    ? 'Excellent focus quality'
                    : stats.avgFocus >= 70
                    ? 'Consistent preparation'
                    : 'Needs attention'}
                </p>
              </div>

              <div className="card-surface p-5 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Top Subject
                  </span>
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 grid place-items-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-base font-bold text-foreground line-clamp-1">
                  {stats.topSubject ? stats.topSubject.name : 'None yet'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                  {stats.topSubject ? `${stats.topSubject.hours}h · ${stats.topSubject.paper}` : 'No subject recorded'}
                </p>
              </div>
            </div>

            {/* Performance Breakdowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Distribution */}
              <div className="card-surface p-6 rounded-2xl border lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      Subject Time Allocation
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Distribution of study hours across GS papers and syllabus topics
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {stats.subjectBreakdown.length} {stats.subjectBreakdown.length === 1 ? 'subject' : 'subjects'}
                  </span>
                </div>

                {stats.subjectBreakdown.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    No subject study time recorded for this student yet.
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-1">
                    {stats.subjectBreakdown.map((subj) => (
                      <div key={subj.subjectId} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span>{subj.name}</span>
                            <span className="text-[11px] font-normal text-muted-foreground">
                              ({subj.paper})
                            </span>
                          </div>
                          <span className="font-bold text-foreground">
                            {subj.hours}h{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({subj.minutes}m · {subj.percentage}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${subj.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Study Mode Breakdown */}
              <div className="card-surface p-6 rounded-2xl border flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2 mb-1">
                    <Layers size={16} className="text-primary" />
                    Study Method Distribution
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Sessions logged by timer mode
                  </p>

                  <div className="space-y-3">
                    {[
                      { mode: 'Pomodoro', count: stats.modeBreakdown.Pomodoro || 0, color: 'bg-emerald-500' },
                      { mode: 'Custom Timer', count: stats.modeBreakdown.Custom || 0, color: 'bg-blue-500' },
                      { mode: 'Stopwatch', count: stats.modeBreakdown.Stopwatch || 0, color: 'bg-amber-500' },
                    ].map((item) => {
                      const total = stats.sessionCount || 1;
                      const pct = Math.round((item.count / total) * 100);
                      return (
                        <div key={item.mode} className="p-3 rounded-xl border bg-muted/30 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-foreground font-semibold">{item.mode}</span>
                            <span className="text-muted-foreground">
                              {item.count} sessions ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={cn('h-full rounded-full', item.color)} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t text-[11px] text-muted-foreground">
                  Aspirant prepares using focused intervals and structured revisions.
                </div>
              </div>
            </div>

            {/* Study Session Records Table */}
            <section className="card-surface p-6 rounded-2xl border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Timer size={16} className="text-primary" />
                    Study Session Logs for {student.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chronological history of study blocks, duration, and recorded focus scores
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Mode Filter */}
                  <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs font-medium">
                    {['all', 'Pomodoro', 'Custom', 'Stopwatch'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setModeFilter(m)}
                        className={cn(
                          'px-2.5 py-1 rounded-md capitalize transition-colors',
                          modeFilter === m
                            ? 'bg-card text-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {m === 'all' ? 'All' : m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search within student's sessions */}
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  placeholder="Filter sessions by subject name or paper..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {sessionSearch && (
                  <button
                    type="button"
                    onClick={() => setSessionSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
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
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Paper</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Focus Score</th>
                      <th className="py-3 px-4 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-xs text-muted-foreground">
                          {sessionSearch
                            ? `No sessions matching "${sessionSearch}".`
                            : 'No study sessions recorded for this student.'}
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((s) => {
                        const subj = localSubjects.find((sub) => String(sub.id) === String(s.subjectId));
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
                            <td className="py-3.5 px-4 font-semibold text-foreground text-xs">
                              {subj ? subj.name : 'General Studies'}
                            </td>
                            <td className="py-3.5 px-4 text-xs text-muted-foreground">
                              {subj ? subj.paper : 'GS Paper'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                                {s.mode || 'Pomodoro'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-foreground text-xs">
                              {s.minutes} min{' '}
                              <span className="text-xs font-normal text-muted-foreground">
                                ({(s.minutes / 60).toFixed(1)}h)
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={cn(
                                      'h-full rounded-full',
                                      (s.focusScore || 90) >= 85
                                        ? 'bg-emerald-500'
                                        : (s.focusScore || 90) >= 70
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                    )}
                                    style={{ width: `${s.focusScore || 90}%` }}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    'text-xs font-bold',
                                    (s.focusScore || 90) >= 85
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : (s.focusScore || 90) >= 70
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                  )}
                                >
                                  {s.focusScore || 90}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-muted-foreground text-right whitespace-nowrap">
                              {dateFormatted}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}
