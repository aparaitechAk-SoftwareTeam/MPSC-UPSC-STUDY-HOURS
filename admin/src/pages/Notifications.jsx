import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { 
  Bell, 
  Send, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Megaphone,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const TEMPLATES = [
  {
    label: 'Daily Revision Alert',
    title: 'Daily Spaced Repetition Due',
    message: 'Remember to complete your daily revision flashcards and test review before 10:00 PM.'
  },
  {
    label: 'Mock Test Announcement',
    title: 'GS Paper I Full Mock Test Scheduled',
    message: 'The MPSC/UPSC GS Paper I Comprehensive Mock Test is now available under the Planner tab. Set aside 2 hours for focused practice.'
  },
  {
    label: 'Syllabus Milestone',
    title: 'Polity & Governance Module Updated',
    message: 'New topic checklists for Constitutional Amendments and Articles 14–32 have been refreshed in your Syllabus tracker.'
  }
];

export default function Notifications({ 
  notifications = [], 
  onSendNotification, 
  onDeleteNotification, 
  onSignOut 
}) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    setSubmitting(true);
    try {
      await onSendNotification({ title: title.trim(), message: message.trim() });
      toast.success('Announcement broadcast to all student accounts');
      setTitle('');
      setMessage('');
    } catch (err) {
      toast.error(err.message || 'Failed to broadcast announcement');
    } finally {
      setSubmitting(false);
    }
  }

  function applyTemplate(tpl) {
    setTitle(tpl.title);
    setMessage(tpl.message);
    toast.info(`Applied template: "${tpl.label}"`);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await onDeleteNotification(deleteTarget.id);
      toast.success('Announcement deleted');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete announcement');
    }
  }

  return (
    <AppShell title="Notifications" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 max-w-5xl">
        {/* Header intro */}
        <div className="card-surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Student Broadcast System</h2>
              <p className="text-xs text-muted-foreground">
                Broadcast announcements, test schedules, and revision reminders directly to all mobile apps.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Broadcast Delivery Live
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Broadcast Composer (3 Cols) */}
          <section className="card-surface p-6 lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-foreground">Compose Announcement</h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> All Registered Aspirants
                </span>
              </div>

              {/* Quick Templates */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Quick Templates
                </p>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => applyTemplate(t)}
                      className="px-2.5 py-1 text-xs rounded-lg border bg-muted/40 hover:bg-muted text-foreground transition-colors"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Weekly Strategy Session at 6 PM"
                    className="px-3.5 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Broadcast Message Content
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter the full message for students. This appears on their notification tray..."
                    className="px-3.5 py-2 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 shadow-sm transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Broadcasting...' : 'Send Broadcast to Students'}</span>
                </button>
              </form>
            </div>
          </section>

          {/* Past Announcements Feed (2 Cols) */}
          <section className="card-surface p-6 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-foreground">Sent Announcements</h3>
              <span className="text-xs font-semibold text-muted-foreground">
                {notifications.length} sent
              </span>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-1">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                  <p className="font-semibold text-foreground text-sm">No announcements yet</p>
                  <p className="text-xs mt-1">Broadcast your first message to student devices.</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const dateStr = n.createdAt
                    ? new Date(n.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recent';

                  return (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl border bg-card/60 hover:bg-muted/30 transition-colors flex flex-col gap-2 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm text-foreground leading-snug">
                          {n.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(n)}
                          className="text-muted-foreground hover:text-destructive opacity-80 group-hover:opacity-100 transition-opacity p-1"
                          title="Delete Announcement"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-1 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> Target: All
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="h-3 w-3" /> {dateStr}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs">
          <div className="card-surface p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Delete Announcement?</h3>
                <p className="text-xs text-muted-foreground">Remove from student feeds.</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteTarget.title}"</span>?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
