import { Link, useNavigate } from "@/components/router-link";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, BookOpen, Bell, UserRound, Settings, LogOut, GraduationCap, CalendarDays, Menu, X, } from "lucide-react";
import { toast } from "sonner";
import { initials, useProfile } from "@/lib/profile-store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";
const nav = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: Users },
    { to: "/syllabus", label: "Syllabus", icon: BookOpen },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/profile", label: "Profile", icon: UserRound },
];
export function useToday() {
    const [now, setNow] = useState(null);
    useEffect(() => {
        setNow(new Date());
        const t = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(t);
    }, []);
    return now;
}
export function formatLongDate(d) {
    return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
export function SignOutDialog({ open, onOpenChange, onSignOut }) {
    const navigate = useNavigate();
    return (<AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of Abhyas Tracker?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end your administrator session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
            try {
                localStorage.removeItem("abhyas_admin_token");
                localStorage.removeItem("abhyas_admin_profile");
            } catch {}
            if (onSignOut) {
                await onSignOut();
            }
            window.dispatchEvent(new Event("abhyas:signout"));
            toast.success("Signed out");
            onOpenChange?.(false);
        }}>
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);
}
function Sidebar({ onNavigate, onSignOut }) {
    const [signOut, setSignOut] = useState(false);
    const itemCls = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground";
    const activeCls = "!bg-sidebar-primary !text-sidebar-primary-foreground shadow-elevated";
    return (<div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary">
          <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground"/>
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight">Abhyas Tracker</p>
          <p className="text-xs text-sidebar-muted">MPSC · UPSC Admin</p>
        </div>
      </div>
      <p className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">Management</p>
      <nav className="flex flex-col gap-1 px-3">
        {nav.map((n) => (<Link key={n.to} to={n.to} onClick={onNavigate} className={itemCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>
            <n.icon className="h-[18px] w-[18px]"/>
            {n.label}
            {n.label === "Notifications" && (<span className="ml-auto rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground">{notifications.length}</span>)}
          </Link>))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 border-t border-sidebar-border px-3 py-4">
        <Link to="/settings" onClick={onNavigate} className={itemCls} activeProps={{ className: activeCls }}>
          <Settings className="h-[18px] w-[18px]"/> Settings
        </Link>
        <button type="button" onClick={() => setSignOut(true)} className={cn(itemCls, "text-left")}>
          <LogOut className="h-[18px] w-[18px]"/> Sign Out
        </button>
      </div>
      <SignOutDialog open={signOut} onOpenChange={setSignOut} onSignOut={onSignOut}/>
    </div>);
}
export function AppShell({ title, children, onSignOut }) {
    const today = useToday();
    const profile = useProfile();
    const [mobileOpen, setMobileOpen] = useState(false);
    return (<div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <Sidebar onSignOut={onSignOut} />
      </aside>
      {mobileOpen && (<div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)}/>
          <div className="relative h-full w-64">
            <Sidebar onNavigate={() => setMobileOpen(false)} onSignOut={onSignOut}/>
            <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute right-3 top-6 text-sidebar-foreground">
              <X className="h-5 w-5"/>
            </button>
          </div>
        </div>)}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button aria-label="Open menu" className="rounded-lg border p-2 lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="h-5 w-5"/>
              </button>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Management <span className="mx-1">/</span> <span className="text-foreground">{title}</span>
                </p>
                <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-[28px]">{title}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-lg border bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground md:flex">
                <CalendarDays className="h-4 w-4"/>
                {today ? formatLongDate(today) : "\u00a0"}
              </div>
              <Link to="/notifications" aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-lg border bg-card hover:bg-muted">
                <Bell className="h-[18px] w-[18px]"/>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"/>
              </Link>
              <Link to="/profile" aria-label="Profile" className="flex items-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-destructive text-sm font-bold text-destructive-foreground ring-2 ring-accent">
                  {initials(profile.fullName)}
                </span>
                <span className="hidden text-left leading-tight xl:block">
                  <span className="block text-sm font-semibold">{profile.fullName}</span>
                  <span className="block text-xs text-muted-foreground">{profile.role}</span>
                </span>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>);
}
export function Panel({ title, action, children, className }) {
    return (<section className={cn("card-surface flex flex-col p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>);
}
export function DemoBadge() {
    return <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[11px] font-semibold text-warning">Demo data</span>;
}
export function ProgressBar({ value, color }) {
    return (<div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%`, background: color }}/>
    </div>);
}
