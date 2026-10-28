import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Timer,
  Search,
  Eye,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { cn } from '@/lib/utils';

export default function StudentsPage({ data = {}, loading = false, load = () => {}, onSignOut }) {
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('student'); // 'student' | 'all'

  const registeredStudentsCount = (data.users || []).filter((u) => u.role === 'student').length;
  const totalAccountsCount = data.users?.length || 0;
  const totalSessionsCount = data.sessions?.length || 0;

  const filteredUsers = (data.users || []).filter((u) => {
    const matchRole = studentFilter === 'all' ? true : u.role === 'student';
    const q = studentSearch.trim().toLowerCase();
    const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <AppShell title="Students" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
              <span>Management</span>
              <span>/</span>
              <span className="text-foreground font-semibold">Students</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Registered Students Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Inspect student profiles, monitor exam preparation, and analyze individual study logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 shadow-xs"
              title="Refresh directory"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Top Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registered Students
              </span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{registeredStudentsCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Active learner accounts</p>
          </div>

          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Accounts
              </span>
              <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground grid place-items-center">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{totalAccountsCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Students & administrators</p>
          </div>

          <div className="card-surface p-5 rounded-2xl border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Recorded Sessions
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 grid place-items-center">
                <Timer className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-foreground">{totalSessionsCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Completed study records</p>
          </div>
        </div>

        {/* Main Student Directory */}
        <section className="card-surface p-6 rounded-2xl border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold">Student Directory</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect registered students, their study time, and account credentials
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Role Filter Tabs */}
              <div className="inline-flex rounded-lg border bg-muted/40 p-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setStudentFilter('student')}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-colors',
                    studentFilter === 'student'
                      ? 'bg-card text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Students ({registeredStudentsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStudentFilter('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-md transition-colors',
                    studentFilter === 'all'
                      ? 'bg-card text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  All Accounts ({totalAccountsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search students by name or email address..."
              className="w-full pl-10 pr-14 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {studentSearch && (
              <button
                type="button"
                onClick={() => setStudentSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Sessions</th>
                  <th className="py-3 px-4">Study Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No accounts found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const userSessions = (data.sessions || []).filter((s) => s.userId === u.id);
                    const totalMins = userSessions.reduce((acc, s) => acc + (s.minutes || 0), 0);
                    const hoursStr = (totalMins / 60).toFixed(1);

                    return (
                      <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs grid place-items-center flex-shrink-0">
                              {u.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <Link
                                to={`/students/${u.id}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors hover:underline block"
                              >
                                {u.name}
                              </Link>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
                              u.role === 'admin'
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            )}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          {userSessions.length} {userSessions.length === 1 ? 'session' : 'sessions'}
                        </td>
                        <td className="py-3.5 px-4 text-foreground font-semibold">
                          {totalMins}m <span className="text-xs font-normal text-muted-foreground">({hoursStr}h)</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/students/${u.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-card hover:bg-muted text-xs font-semibold text-foreground hover:text-primary transition-colors shadow-xs"
                            title={`Inspect ${u.name}'s study profile`}
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                            <ChevronRight size={12} className="text-muted-foreground" />
                          </button>
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
    </AppShell>
  );
}
