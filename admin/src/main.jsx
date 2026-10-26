import React, { useEffect, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Plus, Trash2, Bell, Megaphone, Search, Filter, Timer, Clock, UserCheck, Eye, RefreshCw, X, BookOpen, Users, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import '@/styles.css';
import { AppShell } from '@/components/app-shell';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Announcements from '@/pages/Announcements';
import Sessions from '@/pages/Sessions';
import Students from '@/pages/Students';
import StudentDetails from '@/pages/StudentDetails';
import { initProfileFromUser, signOutProfile } from '@/lib/profile-store';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function App() {
  // The token starts empty: nothing protected renders until the stored token is verified below.
  const [token, setToken] = useState('');
  const [checking, setChecking] = useState(() => !!localStorage.getItem('abhyas_admin_token'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ overview: null, users: [], subjects: [], sessions: [] });
  const [form, setForm] = useState({ name: '', paper: 'GS Paper II', topics: 40, title: '', message: '' });
  const [email, setEmail] = useState('admin@abhyas.local');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destination screen filters and student inspector
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('student'); // 'student' | 'all'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionModeFilter, setSessionModeFilter] = useState('all');

  async function request(url, method = 'GET', body) {
    const res = await fetch(API + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json;
  }

  async function load(currentToken = token) {
    if (!currentToken) return;
    try {
      setLoading(true);
      setError('');
      const [overview, users, subjects, sessions, me] = await Promise.all(
        ['/admin/overview', '/admin/users', '/admin/subjects', '/admin/sessions', '/me'].map((p) =>
          fetch(API + p, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + currentToken,
            },
          }).then(async (r) => {
            const j = await r.json();
            if (!r.ok) throw new Error(j.error || 'Failed to load data');
            return j;
          })
        )
      );
      setData({ overview, users, subjects, sessions });
      if (me?.user) initProfileFromUser(me.user);
    } catch (e) {
      setError(e.message);
      if (e.message.toLowerCase().includes('auth') || e.message.toLowerCase().includes('forbidden')) {
        handleSignOut();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      load(token);
    }
  }, [token]);

  // Session check on every page load/refresh: a stored token is only trusted if the
  // existing backend (GET /api/me) accepts it AND the user is an admin. Otherwise it is
  // discarded and the Sign In page is shown (fail closed, including when the API is down).
  useEffect(() => {
    let cancelled = false;
    async function verifySession() {
      const stored = localStorage.getItem('abhyas_admin_token');
      if (!stored) {
        setChecking(false);
        return;
      }
      try {
        const r = await fetch(API + '/me', { headers: { Authorization: 'Bearer ' + stored } });
        const j = await r.json();
        if (!r.ok || j.user?.role !== 'admin') throw new Error('Invalid session');
        if (!cancelled) {
          initProfileFromUser(j.user);
          setToken(stored);
        }
      } catch {
        localStorage.removeItem('abhyas_admin_token');
        signOutProfile();
        if (!cancelled) setToken('');
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    verifySession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Invalid credentials');
      if (d.user?.role !== 'admin') throw new Error('Admin privileges required');

      localStorage.setItem('abhyas_admin_token', d.token);
      initProfileFromUser(d.user);
      setToken(d.token);
      setPassword('');
      toast.success('Signed in successfully');
      load(d.token);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    localStorage.removeItem('abhyas_admin_token');
    signOutProfile();
    setToken('');
    setData({ overview: null, users: [], subjects: [], sessions: [] });
    setError('');
    toast.success('Signed out');
  }

  // Listen for sign-out triggered from AppShell / Dialog
  useEffect(() => {
    const onSignOutEvent = () => {
      handleSignOut();
    };
    window.addEventListener('abhyas:signout', onSignOutEvent);
    return () => {
      window.removeEventListener('abhyas:signout', onSignOutEvent);
    };
  }, []);

  // Management Action: Add Subject
  async function addSubject(e) {
    e.preventDefault();
    try {
      setError('');
      await request('/admin/subjects', 'POST', {
        name: form.name,
        paper: form.paper,
        topics: Number(form.topics),
      });
      setForm({ ...form, name: '' });
      toast.success('Subject added successfully');
      await load();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  }

  // Management Action: Delete Subject
  async function delSubject(id) {
    if (!window.confirm('Delete this subject?')) return;
    try {
      setError('');
      await request('/admin/subjects/' + id, 'DELETE');
      toast.success('Subject deleted');
      await load();
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  }

  // Management Action: Broadcast Announcement
  async function sendNotification(e) {
    e.preventDefault();
    try {
      setError('');
      await request('/admin/notifications', 'POST', {
        title: form.title,
        message: form.message,
      });
      setForm({ ...form, title: '', message: '' });
      toast.success('Announcement broadcast to all students');
      window.dispatchEvent(new Event('abhyas:notifications_updated'));
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
  }

  // While a stored token is being verified, render nothing protected (and no login flash).
  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }

  // Unauthenticated: Existing Login Flow with clean styling
  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d1527] p-4 font-sans text-slate-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#131d35] border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col gap-5"
        >
          <div className="text-center space-y-1">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold text-2xl mb-2">
              📘
            </div>
            <h1 className="text-2xl font-extrabold text-white">Abhyas Tracker</h1>
            <p className="text-sm text-slate-400">Admin Control Panel</p>
          </div>

          {error && (
            <div className="p-3 text-xs font-semibold rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
            <input
              type="email"
              value={email}
              placeholder="admin@abhyas.local"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1527] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              placeholder="••••••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1527] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <Toaster />
      </div>
    );
  }

  // Authenticated: Dashboard (Scope) + Existing Management Screens
  return (
    <BrowserRouter>
      <Routes>
        {/* ASSIGNED SCOPE: Dashboard with real backend API metrics */}
        <Route
          path="/"
          element={
            <Dashboard
              overview={data.overview}
              users={data.users}
              subjects={data.subjects}
              sessions={data.sessions}
              loading={loading}
              error={error}
              onSignOut={handleSignOut}
            />
          }
        />

        {/* Destination for Card 1: Students Directory */}
        <Route
          path="/students"
          element={
            <Students
              data={data}
              loading={loading}
              load={load}
              onSignOut={handleSignOut}
            />
          }
        />
        {/* Dedicated Student Inspection / Details Page */}
        <Route
          path="/students/:studentId"
          element={
            <StudentDetails
              data={data}
              loading={loading}
              load={load}
              onSignOut={handleSignOut}
            />
          }
        />

        {/* Destination for Card 3 (Focus Sessions) and Card 4 (Total Study Hours) & Rankings */}
        <Route
          path="/sessions"
          element={
            <Sessions
              data={data}
              loading={loading}
              load={load}
              onSignOut={handleSignOut}
            />
          }
        />

        {/* Existing Management Screen: Syllabus with Add & Delete */}
        <Route
          path="/syllabus"
          element={
            <AppShell title="Syllabus" onSignOut={handleSignOut}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="card-surface p-6 lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Subjects & Syllabus</h2>
                    <span className="text-xs text-muted-foreground">{data.subjects?.length || 0} subjects</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {data.subjects?.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-base">{s.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {s.paper} • {s.completed}/{s.topics} topics mastered
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => delSubject(s.id)}
                          className="h-8 w-8 grid place-items-center rounded-lg border text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card-surface p-6 h-fit">
                  <h2 className="text-lg font-bold mb-4">Add New Subject</h2>
                  <form onSubmit={addSubject} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Subject Name
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. Indian Polity"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Paper
                      </label>
                      <input
                        value={form.paper}
                        onChange={(e) => setForm({ ...form, paper: e.target.value })}
                        className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g. GS Paper II"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Total Topics
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={form.topics}
                        onChange={(e) => setForm({ ...form, topics: e.target.value })}
                        className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      <Plus size={16} /> Add Subject
                    </button>
                  </form>
                </section>
              </div>
            </AppShell>
          }
        />

        {/* Management Screen: Announcements & Broadcast */}
        <Route
          path="/announcements"
          element={<Announcements onSignOut={handleSignOut} />}
        />
        {/* Backward-compatibility redirect from /notifications to /announcements */}
        <Route path="/notifications" element={<Navigate to="/announcements" replace />} />

        {/* Profile: identity from GET /api/me; edits & preferences are localStorage-only */}
        <Route path="/profile" element={<Profile onSignOut={handleSignOut} />} />

        {/* Settings: appearance, share, support, rate, privacy, and account management */}
        <Route path="/settings" element={<Settings onSignOut={handleSignOut} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
