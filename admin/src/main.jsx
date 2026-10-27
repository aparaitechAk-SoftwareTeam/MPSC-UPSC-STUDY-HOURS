import React, { useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

import '@/styles.css';
import Login from '@/components/Login';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Syllabus from '@/pages/Syllabus';
import Notifications from '@/pages/Notifications';
import Profile from '@/pages/Profile';
import { initProfileFromUser } from '@/lib/profile-store';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('abhyas_admin_token') || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Management Data Store
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Authenticated API Helper
  const request = useCallback(
    async (url, method = 'GET', body = null, currentToken = token) => {
      const headers = { 'Content-Type': 'application/json' };
      if (currentToken) {
        headers['Authorization'] = 'Bearer ' + currentToken;
      }
      const res = await fetch(API + url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      let json = {};
      try {
        json = await res.json();
      } catch (err) {
        throw new Error(`Server returned status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(json.error || `Request failed (${res.status})`);
      }
      return json;
    },
    [token]
  );

  // Load all platform admin data
  const loadData = useCallback(
    async (currentToken = token, isManualRefresh = false) => {
      if (!currentToken) return;
      if (isManualRefresh) setIsRefreshing(true);
      setError('');

      try {
        const [ov, us, subs, sess, notifs] = await Promise.all([
          request('/admin/overview', 'GET', null, currentToken).catch(() => null),
          request('/admin/users', 'GET', null, currentToken).catch(() => []),
          request('/admin/subjects', 'GET', null, currentToken).catch(() => []),
          request('/admin/sessions', 'GET', null, currentToken).catch(() => []),
          request('/admin/notifications', 'GET', null, currentToken).catch(() => []),
        ]);

        if (ov) setOverview(ov);
        if (us) setUsers(us);
        if (subs) setSubjects(subs);
        if (sess) setSessions(sess);
        if (notifs) setNotifications(notifs);

        if (isManualRefresh) {
          toast.success('Data refreshed from server');
        }
      } catch (e) {
        setError(e.message);
        if (
          e.message.toLowerCase().includes('auth') ||
          e.message.toLowerCase().includes('forbidden') ||
          e.message.toLowerCase().includes('401')
        ) {
          handleSignOut();
        }
      } finally {
        if (isManualRefresh) setIsRefreshing(false);
      }
    },
    [token, request]
  );

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token, loadData]);

  // Auth: Login
  async function handleLogin(email, password) {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let d = {};
      try {
        d = await res.json();
      } catch {
        throw new Error(`Cannot reach server at ${API}. Ensure backend is running.`);
      }

      if (!res.ok) throw new Error(d.error || 'Invalid credentials');
      if (d.user?.role !== 'admin') throw new Error('Administrator privileges required');

      localStorage.setItem('abhyas_admin_token', d.token);
      initProfileFromUser(d.user);
      setToken(d.token);
      toast.success('Signed in successfully as Administrator');
      await loadData(d.token);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Auth: Sign Out
  function handleSignOut() {
    localStorage.removeItem('abhyas_admin_token');
    localStorage.removeItem('abhyas_admin_profile');
    setToken('');
    setOverview(null);
    setUsers([]);
    setSubjects([]);
    setSessions([]);
    setNotifications([]);
    setError('');
    toast.success('Signed out');
  }

  // Listen for global signout events from AppShell
  useEffect(() => {
    const onSignOutEvent = () => handleSignOut();
    window.addEventListener('abhyas:signout', onSignOutEvent);
    return () => window.removeEventListener('abhyas:signout', onSignOutEvent);
  }, []);

  // ---------------- STUDENT MANAGEMENT ACTIONS ----------------
  async function handleAddUser(userData) {
    await request('/admin/users', 'POST', userData);
    await loadData(token);
  }

  async function handleDeleteUser(id) {
    await request(`/admin/users/${id}`, 'DELETE');
    await loadData(token);
  }

  // ---------------- SUBJECT MANAGEMENT ACTIONS ----------------
  async function handleAddSubject(subjectData) {
    await request('/admin/subjects', 'POST', subjectData);
    await loadData(token);
  }

  async function handleEditSubject(id, subjectData) {
    await request(`/admin/subjects/${id}`, 'PUT', subjectData);
    await loadData(token);
  }

  async function handleDeleteSubject(id) {
    await request(`/admin/subjects/${id}`, 'DELETE');
    await loadData(token);
  }

  // ---------------- NOTIFICATIONS ACTIONS ----------------
  async function handleSendNotification(notifData) {
    await request('/admin/notifications', 'POST', notifData);
    await loadData(token);
  }

  async function handleDeleteNotification(id) {
    await request(`/admin/notifications/${id}`, 'DELETE');
    await loadData(token);
  }

  // Unauthenticated: Refined Login Page
  if (!token) {
    return (
      <>
        <Login onLogin={handleLogin} isSubmitting={isSubmitting} error={error} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Authenticated: Multi-page Admin App
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              overview={overview}
              subjects={subjects}
              sessions={sessions}
              notifications={notifications}
              onRefresh={() => loadData(token, true)}
              isRefreshing={isRefreshing}
              onSignOut={handleSignOut}
            />
          }
        />

        <Route
          path="/students"
          element={
            <Students
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onSignOut={handleSignOut}
            />
          }
        />

        <Route
          path="/syllabus"
          element={
            <Syllabus
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onEditSubject={handleEditSubject}
              onDeleteSubject={handleDeleteSubject}
              onSignOut={handleSignOut}
            />
          }
        />

        <Route
          path="/notifications"
          element={
            <Notifications
              notifications={notifications}
              onSendNotification={handleSendNotification}
              onDeleteNotification={handleDeleteNotification}
              onSignOut={handleSignOut}
            />
          }
        />

        <Route
          path="/profile"
          element={<Profile onSignOut={handleSignOut} />}
        />

        <Route
          path="/settings"
          element={<Profile onSignOut={handleSignOut} />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
