import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/app-shell';
import { 
  Users, 
  UserPlus, 
  Search, 
  Trash2, 
  ShieldCheck, 
  GraduationCap, 
  Check, 
  X, 
  Mail, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Students({ users = [], onAddUser, onDeleteUser, onSignOut }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // New Student Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [submitting, setSubmitting] = useState(false);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const studentCount = users.filter((u) => u.role === 'student').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  async function handleCreateUser(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setSubmitting(true);
    try {
      await onAddUser(form);
      toast.success(`Account for ${form.name} created successfully`);
      setForm({ name: '', email: '', password: '', role: 'student' });
      setShowAddModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create student account');
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await onDeleteUser(deleteTarget.id);
      toast.success(`User ${deleteTarget.name} removed`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  }

  return (
    <AppShell title="Students" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Enrolled
              </p>
              <p className="mt-1 text-3xl font-extrabold">{users.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Platform-wide user accounts</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Aspirants
              </p>
              <p className="mt-1 text-3xl font-extrabold text-blue-500">{studentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">MPSC & UPSC Students</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 grid place-items-center">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>

          <div className="card-surface p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administrators
              </p>
              <p className="mt-1 text-3xl font-extrabold text-indigo-500">{adminCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Faculty / Staff roles</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-500 grid place-items-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Action Bar & Controls */}
        <div className="card-surface p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or email..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center rounded-lg border bg-muted/40 p-1 text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  roleFilter === 'all'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  roleFilter === 'student'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Students ({studentCount})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  roleFilter === 'admin'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admins ({adminCount})
              </button>
            </div>
          </div>

          {/* Add Student Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-sm transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Student</span>
          </button>
        </div>

        {/* Student Table */}
        <section className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3.5 px-5">Student / User</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Account ID</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground/60" />
                        <p className="font-semibold text-foreground">No accounts found</p>
                        <p className="text-xs">
                          {search ? 'Try adjusting your search criteria' : 'Add a new student to get started.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initials = (u.name || 'User')
                      .split(' ')
                      .map((p) => p[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs grid place-items-center shrink-0">
                              {initials}
                            </div>
                            <span className="font-semibold text-foreground">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-muted-foreground font-mono text-xs">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                              u.role === 'admin'
                                ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}
                          >
                            {u.role === 'admin' ? (
                              <ShieldCheck className="h-3 w-3" />
                            ) : (
                              <GraduationCap className="h-3 w-3" />
                            )}
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-muted-foreground font-mono">
                          {u.id}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(u)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete user account"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-md shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Add New Student</h3>
                <p className="text-xs text-muted-foreground">Register an aspirant for the platform</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. ramesh@abhyas.local"
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Temporary Password (8+ chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Account Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="student">Student / Aspirant</option>
                  <option value="admin">Administrator / Faculty</option>
                </select>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Delete Account?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget.name}</span> ({deleteTarget.email})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
