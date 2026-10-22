import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Plus, Trash2, Bell } from 'lucide-react';
import { Toaster, toast } from 'sonner';

import '@/styles.css';
import { AppShell } from '@/components/app-shell';
import Dashboard from '@/pages/Dashboard';
import { initProfileFromUser } from '@/lib/profile-store';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('abhyas_admin_token') || '');
  const [error, setError] = useState('');
  const [data, setData] = useState({ overview: null, users: [], subjects: [] });
  const [form, setForm] = useState({ name: '', paper: 'GS Paper II', topics: 40, title: '', message: '' });
  const [email, setEmail] = useState('admin@abhyas.local');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError('');
      const [overview, users, subjects] = await Promise.all(
        ['/admin/overview', '/admin/users', '/admin/subjects'].map((p) =>
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
      setData({ overview, users, subjects });
    } catch (e) {
      setError(e.message);
      if (e.message.toLowerCase().includes('auth') || e.message.toLowerCase().includes('forbidden')) {
        handleSignOut();
      }
    }
  }

  useEffect(() => {
    if (token) {
      load(token);
    }
  }, [token]);

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
    localStorage.removeItem('abhyas_admin_profile');
    setToken('');
    setData({ overview: null, users: [], subjects: [] });
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
    } catch (e) {
      setError(e.message);
      toast.error(e.message);
    }
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
              id="login-email"
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
              id="login-password"
              type="password"
              value={password}
              placeholder="••••••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1527] border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            id="login-submit"
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
          element={<Dashboard overview={data.overview} subjects={data.subjects} onSignOut={handleSignOut} />}
        />

        {/* Existing Management Screen: Students */}
        <Route
          path="/students"
          element={
            <AppShell title="Students" onSignOut={handleSignOut}>
              <section className="card-surface p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Registered Accounts</h2>
                  <span className="text-xs text-muted-foreground">{data.users?.length || 0} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.users?.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 px-4 font-semibold">{u.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold bg-accent text-accent-foreground capitalize">
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </AppShell>
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

        {/* Existing Management Screen: Notifications Broadcast */}
        <Route
          path="/notifications"
          element={
            <AppShell title="Notifications" onSignOut={handleSignOut}>
              <section className="card-surface p-6 max-w-xl">
                <h2 className="text-lg font-bold mb-2">Broadcast Announcement</h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Send a platform-wide notification to all registered student accounts.
                </p>
                <form onSubmit={sendNotification} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Announcement Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="e.g. Daily Revision Alert"
                      className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      placeholder="Enter the broadcast message for students..."
                      className="px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <Bell size={16} /> Send to Students
                  </button>
                </form>
              </section>
            </AppShell>
          }
        />

        {/* Profile Placeholder (Deferred until user reviews Dashboard) */}
        <Route
          path="/profile"
          element={
            <AppShell title="Profile" onSignOut={handleSignOut}>
              <section className="card-surface p-8 max-w-lg text-center space-y-4">
                <div className="h-16 w-16 mx-auto grid place-items-center rounded-2xl bg-primary/10 text-primary text-2xl font-bold">
                  👤
                </div>
                <h2 className="text-xl font-bold">Profile Screen</h2>
                <p className="text-sm text-muted-foreground">
                  Dashboard has been integrated successfully. Profile UI is staged and ready to be integrated upon your review.
                </p>
              </section>
            </AppShell>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
