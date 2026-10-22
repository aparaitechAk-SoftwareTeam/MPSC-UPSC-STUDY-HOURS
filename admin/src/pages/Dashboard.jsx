import { Link } from "@/components/router-link";
import { useMemo, useState } from "react";
import { Users, BookOpen, Timer, Clock, TrendingUp, CheckCircle2, AlertTriangle, Info, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, DemoBadge, Panel, ProgressBar, useToday } from "@/components/app-shell";
import { getLast7Days, getRecentSessions, getTasks, getWeeklyGoal, notifications, stats, subjects } from "@/data/mock";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

function KpiCard({ icon: Icon, label, value, trend, tone }) {
    return (<div className="card-surface flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success">
          <TrendingUp className="h-3.5 w-3.5"/> {trend}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Illustrative comparison (demo)</p>
      </div>
      <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", tone)}>
        <Icon className="h-6 w-6"/>
      </div>
    </div>);
}
const statusCls = {
    Completed: "bg-success-soft text-success",
    "In progress": "bg-info-soft text-primary",
    Missed: "bg-danger-soft text-destructive",
};
function Dashboard({
    overview,
    subjects: externalSubjects,
    sessions: externalSessions,
    tasks: externalTasks,
    onSignOut,
} = {}) {
    const isDemo = !overview;
    const today = useToday();
    const days = useMemo(() => (today ? getLast7Days(today) : []), [today]);
    const defaultSessions = useMemo(() => (today ? getRecentSessions(today) : []), [today]);
    const sessions = externalSessions ?? defaultSessions;
    const goal = getWeeklyGoal();
    const [tasks, setTasks] = useState(null);
    const taskList = tasks ?? externalTasks ?? (today ? getTasks(today) : []);
    const activeSubjects = externalSubjects ?? subjects;
    const subjectColor = Object.fromEntries(activeSubjects.map((s, idx) => [s.name, s.color || `var(--subject-${(idx % 4) + 1})`]));

    const totalStudents = overview?.users ?? stats.totalStudents;
    const subjectsCount = overview?.subjects ?? activeSubjects.length ?? stats.subjects;
    const focusSessions = overview?.sessions ?? stats.focusSessions;
    const studyHours = overview?.minutes != null ? (overview.minutes / 60).toFixed(1) : stats.studyHours;

    return (<AppShell title="Dashboard" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard icon={Users} label="Total Students" value={String(totalStudents)} trend="+3 this month" tone="bg-info-soft text-primary"/>
          <KpiCard icon={BookOpen} label="Subjects" value={String(subjectsCount)} trend="All active" tone="bg-warning-soft text-warning"/>
          <KpiCard icon={Timer} label="Focus Sessions" value={String(focusSessions)} trend="+12% vs last week" tone="bg-success-soft text-success"/>
          <KpiCard icon={Clock} label="Study Hours" value={String(studyHours)} trend="+5.5h vs last week" tone="bg-danger-soft text-destructive"/>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="flex flex-col gap-6 xl:col-span-3">
            <Panel title="Study Activity · Last 7 days" action={<DemoBadge />}>
              <div className="h-64">
                {days.length === 0 ? (<div className="h-full animate-pulse rounded-lg bg-muted"/>) : (<ResponsiveContainer width="100%" height="100%">
                    <BarChart data={days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4"/>
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}/>
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} unit="h"/>
                      <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} labelFormatter={(_, p) => (p?.[0]?.payload ? `${p[0].payload.day}, ${p[0].payload.date}` : "")} formatter={(v) => [`${v} hours`, "Studied"]}/>
                      <Bar dataKey="hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={44}/>
                    </BarChart>
                  </ResponsiveContainer>)}
              </div>
            </Panel>

            <Panel title="Weekly Study Goal" action={<DemoBadge />}>
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--primary) ${goal.percent * 3.6}deg, var(--muted) 0)` }}>
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-card">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold">{goal.percent}%</p>
                      <p className="text-[11px] text-muted-foreground">of goal</p>
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-3 gap-3">
                  {[
            { l: "Weekly goal", v: `${goal.goal}h`, i: Target },
            { l: "Completed", v: `${goal.completed}h`, i: CheckCircle2 },
            { l: "Remaining", v: `${goal.remaining}h`, i: Clock },
        ].map((x) => (<div key={x.l} className="rounded-lg border bg-muted/50 p-3">
                      <x.i className="h-4 w-4 text-primary"/>
                      <p className="mt-2 text-xl font-bold">{x.v}</p>
                      <p className="text-xs text-muted-foreground">{x.l}</p>
                    </div>))}
                  <div className="col-span-3"><ProgressBar value={goal.percent}/></div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="flex flex-col gap-6 xl:col-span-2">
            <Panel title="Subject-wise Progress" action={isDemo ? <DemoBadge /> : null}>
              <ul className="flex flex-col gap-4">
                {activeSubjects.map((s, idx) => {
                  const color = s.color || `var(--subject-${(idx % 4) + 1})`;
                  const progress = s.progress ?? (s.topics > 0 ? Math.round(((s.completed || 0) / s.topics) * 100) : 0);
                  const topicsLabel = typeof s.topics === "number" ? `${s.completed || 0} / ${s.topics} topics` : (s.topics || "");
                  return (<li key={s.id || s.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-semibold">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }}/>
                        <span className="truncate">{s.name}</span>
                      </span>
                      <span className="shrink-0 font-bold">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} color={color}/>
                    {topicsLabel && <p className="mt-1 text-xs text-muted-foreground">{topicsLabel}</p>}
                  </li>);
                })}
              </ul>
            </Panel>

            <Panel title="Recent Study Sessions" action={isDemo ? <DemoBadge /> : null} className="flex-1">
              {sessions.length === 0 ? (<p className="py-6 text-center text-sm text-muted-foreground">No sessions recorded yet.</p>) : (<ul className="divide-y">
                  {sessions.map((s) => {
                    const color = subjectColor[s.subject] || "var(--primary)";
                    const dateStr = s.date || (s.startedAt ? s.startedAt.slice(0, 10) : "");
                    const durationStr = s.duration || (s.minutes ? `${s.minutes}m` : "");
                    const titleStr = s.title || `Session (${durationStr || 'Focus'})`;
                    const statusStr = s.status || "Completed";
                    return (<li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: color }}/>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{titleStr}</p>
                        <p className="truncate text-xs text-muted-foreground">{[s.subject, dateStr, durationStr].filter(Boolean).join(" · ")}</p>
                      </div>
                      <span className={cn("shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold", statusCls[statusStr] || statusCls.Completed)}>{statusStr}</span>
                    </li>);
                  })}
                </ul>)}
            </Panel>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Upcoming Tasks" action={isDemo ? <DemoBadge /> : null}>
            <ul className="flex flex-col gap-2">
              {taskList.map((t) => (<li key={t.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <Checkbox id={`task-${t.id}`} checked={t.done} aria-label={`Mark "${t.title}" as done`} onCheckedChange={(c) => setTasks(taskList.map((x) => (x.id === t.id ? { ...x, done: !!c } : x)))}/>
                  <label htmlFor={`task-${t.id}`} className="min-w-0 flex-1 cursor-pointer">
                    <p className={cn("truncate text-sm font-semibold", t.done && "text-muted-foreground line-through")}>{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.subject}</p>
                  </label>
                  <span className="shrink-0 rounded-md bg-accent px-2 py-1 text-[11px] font-semibold text-accent-foreground">Due {t.due}</span>
                </li>))}
            </ul>
          </Panel>
          <Panel title="Recent Notifications" action={<Link to="/notifications" className="text-sm font-semibold text-primary hover:underline">View all</Link>}>
            <ul className="flex flex-col gap-3">
              {notifications.slice(0, 3).map((n) => {
            const Icon = n.type === "success" ? CheckCircle2 : n.type === "warning" ? AlertTriangle : Info;
            const tone = n.type === "success" ? "bg-success-soft text-success" : n.type === "warning" ? "bg-warning-soft text-warning" : "bg-info-soft text-primary";
            return (<li key={n.id} className="flex items-center gap-3">
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", tone)}><Icon className="h-4 w-4"/></span>
                    <p className="min-w-0 flex-1 text-sm font-medium">{n.title}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                  </li>);
        })}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>);
}

export default Dashboard;
