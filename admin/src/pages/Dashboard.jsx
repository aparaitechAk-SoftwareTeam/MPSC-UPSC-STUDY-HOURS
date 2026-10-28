import { Link } from "@/components/router-link";
import { useMemo, useState } from "react";
import { 
  Users, 
  BookOpen, 
  Timer, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Target, 
  RotateCw, 
  UserPlus, 
  Plus, 
  Megaphone,
  GraduationCap
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, DemoBadge, Panel, ProgressBar, useToday } from "@/components/app-shell";
import { getLast7Days, getWeeklyGoal, stats, subjects as fallbackSubjects } from "@/data/mock";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function KpiCard({ icon: Icon, label, value, trend, tone, subtext }) {
  return (
    <div className="card-surface flex items-start justify-between gap-4 p-5 hover:border-primary/40 transition-colors border">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-500">
          <TrendingUp className="h-3.5 w-3.5" /> {trend}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{subtext || 'Live from database'}</p>
      </div>
      <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", tone)}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}

function computeLast7DaysFromSessions(sessions = [], today = new Date()) {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setDate(d.getDate() + 1);

    const daySessions = sessions.filter((s) => {
      if (!s.startedAt) return false;
      const sDate = new Date(s.startedAt);
      return sDate >= d && sDate < nextD;
    });

    const totalMinutes = daySessions.reduce((acc, s) => acc + (Number(s.minutes) || 0), 0);
    const hours = parseFloat((totalMinutes / 60).toFixed(1));

    result.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      hours,
    });
  }
  return result;
}

function computeWeeklyGoal(days, targetHours = 50) {
  const completed = parseFloat(days.reduce((acc, d) => acc + (Number(d.hours) || 0), 0).toFixed(1));
  const remaining = Math.max(0, parseFloat((targetHours - completed).toFixed(1)));
  const percent = Math.min(100, Math.round((completed / targetHours) * 100));
  return { goal: targetHours, completed, remaining, percent };
}

export function Dashboard({
  overview,
  subjects: externalSubjects,
  sessions: externalSessions,
  notifications: externalNotifications,
  onRefresh,
  isRefreshing,
  onSignOut,
} = {}) {
  const sessions = externalSessions || [];
  const notificationsList = externalNotifications || [];
  const isDemo = !overview && sessions.length === 0;
  const today = useToday();

  const days = useMemo(() => {
    if (!today) return [];
    if (sessions.length > 0) {
      return computeLast7DaysFromSessions(sessions, today);
    }
    return isDemo ? getLast7Days(today) : computeLast7DaysFromSessions([], today);
  }, [today, sessions, isDemo]);

  const goal = useMemo(() => {
    if (sessions.length > 0) {
      return computeWeeklyGoal(days, 50);
    }
    return isDemo ? getWeeklyGoal() : computeWeeklyGoal(days, 50);
  }, [days, sessions, isDemo]);

  const activeSubjects = externalSubjects?.length ? externalSubjects : fallbackSubjects;

  const totalStudents = overview?.users ?? stats.totalStudents;
  const subjectsCount = overview?.subjects ?? activeSubjects.length;
  const focusSessions = overview?.sessions ?? stats.focusSessions;
  const studyHours = overview?.minutes != null ? (overview.minutes / 60).toFixed(1) : stats.studyHours;

  return (
    <AppShell title="Dashboard" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Quick Action & Refresh Bar */}
        <div className="card-surface p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Abhyas API Server (Port 4000)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              to="/students"
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted inline-flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" /> Manage Students
            </Link>
            <Link
              to="/syllabus"
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Subject
            </Link>
            <Link
              to="/notifications"
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted inline-flex items-center gap-1.5 transition-colors"
            >
              <Megaphone className="h-3.5 w-3.5" /> Broadcast
            </Link>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                title="Refresh Live Data"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={Users}
            label="Total Aspirants"
            value={String(totalStudents)}
            trend="+100% active"
            tone="bg-blue-500/10 text-blue-500"
            subtext="Registered accounts"
          />
          <KpiCard
            icon={BookOpen}
            label="Syllabus Modules"
            value={String(subjectsCount)}
            trend="Active papers"
            tone="bg-amber-500/10 text-amber-500"
            subtext="Curriculum subjects"
          />
          <KpiCard
            icon={Timer}
            label="Focus Sessions"
            value={String(focusSessions)}
            trend="Pomodoro & Custom"
            tone="bg-emerald-500/10 text-emerald-500"
            subtext="Total logged sessions"
          />
          <KpiCard
            icon={Clock}
            label="Logged Study Hours"
            value={`${studyHours}h`}
            trend="All students"
            tone="bg-purple-500/10 text-purple-500"
            subtext={`${overview?.minutes || 0} total minutes`}
          />
        </div>

        {/* Charts & Subject Breakdown Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          {/* Activity Chart & Goal */}
          <div className="flex flex-col gap-6 xl:col-span-3">
            <Panel title="Study Activity · Last 7 days" action={isDemo ? <DemoBadge /> : null}>
              <div className="h-64">
                {days.length === 0 ? (
                  <div className="h-full animate-pulse rounded-lg bg-muted" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                        unit="h"
                      />
                      <Tooltip
                        cursor={{ fill: "var(--accent)" }}
                        contentStyle={{
                          background: "var(--popover)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        labelFormatter={(_, p) =>
                          p?.[0]?.payload ? `${p[0].payload.day}, ${p[0].payload.date}` : ""
                        }
                        formatter={(v) => [`${v} hours`, "Studied"]}
                      />
                      <Bar dataKey="hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={44} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>

            <Panel title="Weekly Target Completion" action={isDemo ? <DemoBadge /> : null}>
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div
                  className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--primary) ${goal.percent * 3.6}deg, var(--muted) 0)`,
                  }}
                >
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-card">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">{goal.percent}%</p>
                      <p className="text-[11px] text-muted-foreground">of weekly goal</p>
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-3 gap-3">
                  {[
                    { l: "Goal", v: `${goal.goal}h`, i: Target },
                    { l: "Completed", v: `${goal.completed}h`, i: CheckCircle2 },
                    { l: "Remaining", v: `${goal.remaining}h`, i: Clock },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border bg-muted/40 p-3">
                      <x.i className="h-4 w-4 text-primary" />
                      <p className="mt-2 text-xl font-bold">{x.v}</p>
                      <p className="text-xs text-muted-foreground">{x.l}</p>
                    </div>
                  ))}
                  <div className="col-span-3">
                    <ProgressBar value={goal.percent} />
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          {/* Subject Progress & Recent Sessions */}
          <div className="flex flex-col gap-6 xl:col-span-2">
            <Panel
              title="Syllabus Modules Progress"
              action={
                <Link to="/syllabus" className="text-xs font-semibold text-primary hover:underline">
                  Manage
                </Link>
              }
            >
              <ul className="flex flex-col gap-4">
                {activeSubjects.map((s, idx) => {
                  const topics = Number(s.topics) || 1;
                  const completed = Number(s.completed) || 0;
                  const progress = Math.min(100, Math.round((completed / topics) * 100));

                  return (
                    <li key={s.id || s.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex min-w-0 items-center gap-2 font-semibold">
                          <span className="truncate">{s.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {s.paper}
                          </span>
                        </span>
                        <span className="shrink-0 font-bold text-xs">{progress}%</span>
                      </div>
                      <ProgressBar value={progress} />
                      <p className="text-[11px] text-muted-foreground">
                        {completed} of {topics} topics mastered
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel title="Recent Student Sessions" className="flex-1">
              {sessions.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No sessions recorded yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {sessions.slice(0, 5).map((s) => {
                    const dateStr = s.startedAt ? new Date(s.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent';
                    const durationStr = s.minutes ? `${s.minutes}m` : '0m';

                    return (
                      <li key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">
                            {s.subjectName || 'Study Session'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {s.userName || 'Student'} • {s.mode || 'Pomodoro'} • Focus: {s.focusScore || 90}%
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                            {durationStr}
                          </span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{dateStr}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default Dashboard;
