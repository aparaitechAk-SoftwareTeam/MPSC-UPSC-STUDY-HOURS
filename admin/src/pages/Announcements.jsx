import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Copy,
  X,
  AlertTriangle,
  FileText,
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, Panel } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function AnnouncementsPage({ onSignOut }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);

  // Modals for actions
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch announcements from the real backend (GET /api/notifications)
  const fetchAnnouncements = useCallback(async (isRefresh = false) => {
    const token = localStorage.getItem("abhyas_admin_token");
    if (!token) return;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(API + "/notifications", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        throw new Error(`Failed to load announcements (HTTP ${res.status})`);
      }

      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
      if (isRefresh) {
        toast.success("Announcements refreshed");
      }
    } catch (err) {
      toast.error(err.message || "Could not load announcements");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    const handleUpdate = () => fetchAnnouncements();
    window.addEventListener("abhyas:notifications_updated", handleUpdate);
    return () => window.removeEventListener("abhyas:notifications_updated", handleUpdate);
  }, [fetchAnnouncements]);

  // Handle form submission
  const handleSubmitPrompt = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Announcement title is required");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Announcement message is required");
      return;
    }
    setConfirmSendOpen(true);
  };

  const handleSendAnnouncement = async () => {
    const token = localStorage.getItem("abhyas_admin_token");
    if (!token) {
      toast.error("Admin authentication required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(API + "/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to broadcast announcement");
      }

      toast.success("Announcement broadcast successfully to all students!");
      setForm({ title: "", message: "", audience: "all" });
      setConfirmSendOpen(false);
      setShowCreateForm(false);

      // Trigger bell update and reload history
      window.dispatchEvent(new Event("abhyas:notifications_updated"));
      await fetchAnnouncements(false);
    } catch (err) {
      toast.error(err.message || "Failed to send announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action: Resend / Duplicate announcement
  const handleResend = (item) => {
    setForm({
      title: item.title,
      message: item.message,
      audience: "all",
    });
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Announcement copied to composer. Review and send when ready.");
  };

  // Action: Attempt Delete (checks backend support)
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    const token = localStorage.getItem("abhyas_admin_token");

    try {
      // Backend inspection: DELETE /api/admin/notifications/:id does not exist
      const res = await fetch(`${API}/admin/notifications/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error(`Endpoint not supported (HTTP ${res.status})`);
      }

      toast.success("Announcement deleted successfully");
      setDeleteItem(null);
      await fetchAnnouncements(false);
    } catch {
      setDeleteItem(null);
      toast.error("Announcement Deletion Unavailable", {
        description:
          "The backend server does not provide an endpoint to delete broadcast announcements. The announcement record was NOT modified.",
        duration: 7000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    });
  }, [announcements, searchQuery]);

  // Derived real metrics
  const totalCount = announcements.length;
  const broadcastCount = announcements.filter((a) => a.userId === "all").length;
  const totalReads = announcements.reduce((acc, curr) => acc + (curr.readBy?.length || 0), 0);
  const latestDate = announcements[0]?.createdAt
    ? new Date(announcements[0].createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "None yet";

  return (
    <AppShell title="Announcements" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Page Header & Breadcrumb */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <span>Management</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">Announcements</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Announcements</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Create, broadcast, and inspect study reminders and platform messages sent to aspirants.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAnnouncements(true)}
              disabled={refreshing || loading}
              className="h-9 gap-1.5 text-xs"
              title="Refresh Announcements"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
              Refresh
            </Button>

            <Button
              size="sm"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="h-9 gap-1.5 text-xs font-semibold shadow-sm"
            >
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showCreateForm ? "Close Composer" : "Create Announcement"}
            </Button>
          </div>
        </div>

        {/* B. Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Announcements</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <Megaphone className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black">{totalCount}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Persisted in database</p>
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Broadcast to All</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black">{broadcastCount}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Sent to student accounts</p>
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Reads</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-black">{totalReads}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Student read confirmations</p>
          </div>

          <div className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Latest Broadcast</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-sm font-black truncate">{latestDate}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Drafts: 0 (unsupported)</p>
          </div>
        </div>

        {/* C. Create Announcement Form */}
        {showCreateForm && (
          <section className="card-surface p-6 border-primary/20 shadow-sm animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Broadcast Announcement</h2>
                  <p className="text-xs text-muted-foreground">
                    Compose a platform-wide message to deliver directly into student inboxes.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="h-8 w-8 p-0"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitPrompt} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold">
                    Announcement Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="e.g. UPSC Prelims Mock Exam Schedule"
                    className="text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="audience" className="text-xs font-semibold">
                    Target Audience
                  </Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 text-xs font-medium text-foreground">
                    <Users className="h-3.5 w-3.5 mr-2 text-primary" /> All Registered Students
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message" className="text-xs font-semibold">
                  Announcement Message <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="Write clear instructions, test guidelines, or revision reminders for aspirants..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Delivered in real time to the student mobile app revision queue.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm({ title: "", message: "", audience: "all" });
                      setShowCreateForm(false);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    title="Draft capability is not supported by the current backend"
                    className="opacity-50 cursor-not-allowed"
                  >
                    Save Draft
                  </Button>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !form.title.trim() || !form.message.trim()}
                    className="gap-1.5 font-semibold"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Sending..." : "Send Announcement"}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* D. Announcement History Section */}
        <section className="card-surface p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold">Announcement History</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review previously broadcast announcements, read receipts, and timestamps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title or text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading announcement history…</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="py-12 text-center rounded-xl border border-dashed p-8">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-muted/60 text-muted-foreground">
                <Megaphone className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold">
                {searchQuery ? "No matching announcements" : "No announcements broadcast yet"}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                {searchQuery
                  ? `No announcements matched "${searchQuery}". Try a different keyword.`
                  : "Send your first platform broadcast to notify aspirants about schedules, syllabus milestones, and reminders."}
              </p>
              {!showCreateForm && (
                <Button
                  size="sm"
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 gap-1.5 text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5" /> Create Announcement
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/30">
                    <th className="py-3 px-4">Title & Message</th>
                    <th className="py-3 px-4">Audience</th>
                    <th className="py-3 px-4">Sent At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Read By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {filteredAnnouncements.map((item) => {
                    const formattedDate = item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Date unavailable";

                    const readCount = item.readBy?.length || 0;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                          <p className="font-bold text-sm text-foreground line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.message}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            <Users className="h-3 w-3" /> All Students
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-muted-foreground">
                          {formattedDate}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Published
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium">
                          <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-mono">
                            {readCount} {readCount === 1 ? "student" : "students"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Action */}
                            <button
                              type="button"
                              onClick={() => setViewItem(item)}
                              className="h-8 w-8 grid place-items-center rounded-lg border bg-card hover:bg-muted text-foreground transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>

                            {/* Resend / Duplicate Action */}
                            <button
                              type="button"
                              onClick={() => handleResend(item)}
                              className="h-8 w-8 grid place-items-center rounded-lg border bg-card hover:bg-muted text-foreground transition-colors"
                              title="Duplicate / Resend"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>

                            {/* Edit Action (Reports backend limitation cleanly) */}
                            <button
                              type="button"
                              onClick={() => setEditItem(item)}
                              className="h-8 w-8 grid place-items-center rounded-lg border bg-card hover:bg-muted text-foreground transition-colors"
                              title="Edit Announcement"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => setDeleteItem(item)}
                              className="h-8 w-8 grid place-items-center rounded-lg border bg-card hover:bg-destructive/10 text-destructive transition-colors"
                              title="Delete Announcement"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* DIALOG: Confirm Broadcast */}
      <AlertDialog open={confirmSendOpen} onOpenChange={setConfirmSendOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" /> Confirm Announcement Broadcast
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-2 pt-2 text-xs leading-relaxed text-muted-foreground">
                <p>
                  You are about to broadcast this announcement to <strong className="text-foreground">all registered students</strong>:
                </p>
                <div className="p-3 rounded-lg bg-muted/60 border text-foreground">
                  <p className="font-bold text-sm mb-1">{form.title}</p>
                  <p className="text-xs line-clamp-3 text-muted-foreground">{form.message}</p>
                </div>
                <p className="mt-1">
                  Once sent, this message will immediately appear in the student mobile app notifications queue.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendAnnouncement}
              disabled={isSubmitting}
              className="font-semibold"
            >
              {isSubmitting ? "Broadcasting..." : "Confirm & Send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: View Announcement Details */}
      <AlertDialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Megaphone className="h-4 w-4" />
              </div>
              <AlertDialogTitle className="text-base font-bold">
                Announcement Details
              </AlertDialogTitle>
            </div>
            {viewItem && (
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-4 pt-3 text-xs text-foreground">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Title
                    </span>
                    <h3 className="text-base font-extrabold text-foreground mt-0.5">
                      {viewItem.title}
                    </h3>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Message Content
                    </span>
                    <div className="mt-1.5 p-3.5 rounded-xl border bg-muted/30 whitespace-pre-wrap text-sm leading-relaxed text-foreground max-h-60 overflow-y-auto">
                      {viewItem.message}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
                    <div>
                      <span className="text-muted-foreground">Target Audience:</span>
                      <p className="font-semibold text-foreground">All Registered Students</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-semibold text-emerald-600">Published / Active</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timestamp:</span>
                      <p className="font-mono text-muted-foreground">
                        {viewItem.createdAt
                          ? new Date(viewItem.createdAt).toLocaleString("en-GB")
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Student Reads:</span>
                      <p className="font-semibold text-foreground">
                        {viewItem.readBy?.length || 0} student(s) confirmed read
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewItem) handleResend(viewItem);
                setViewItem(null);
              }}
              className="gap-1.5 text-xs mr-auto"
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate / Resend
            </Button>
            <AlertDialogAction onClick={() => setViewItem(null)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: Edit Announcement (Explains Backend Lifecycle Limitation) */}
      <AlertDialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <AlertDialogTitle className="text-base font-bold">
                Edit Announcement
              </AlertDialogTitle>
            </div>
            {editItem && (
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-3 pt-2 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    The backend server does not currently provide an update endpoint (<code className="font-mono text-foreground">PATCH /api/admin/notifications/:id</code>) for published messages.
                  </p>
                  <p>
                    Additionally, because this announcement has already been delivered to student inboxes and notification bells, retroactively modifying it on the client would misrepresent the record students received.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/60 border text-foreground">
                    <p className="font-bold text-xs text-foreground mb-0.5">Recommended Action:</p>
                    <p className="text-xs text-muted-foreground">
                      Use the <strong>Duplicate / Resend</strong> feature to broadcast a new announcement with your updated guidelines or correction.
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditItem(null)}>Dismiss</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (editItem) handleResend(editItem);
                setEditItem(null);
              }}
              className="gap-1 text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy to Composer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: Delete Announcement Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && !isDeleting && setDeleteItem(null)}>
        <AlertDialogContent className="border-destructive/40">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </div>
              <AlertDialogTitle className="text-base font-bold">
                Delete Announcement?
              </AlertDialogTitle>
            </div>
            {deleteItem && (
              <AlertDialogDescription asChild>
                <div className="flex flex-col gap-2 pt-2 text-xs leading-relaxed text-muted-foreground">
                  <p>
                    Are you sure you want to delete this announcement record?
                  </p>
                  <div className="p-3 rounded-lg bg-muted/60 border text-foreground">
                    <p className="font-bold text-sm text-foreground">{deleteItem.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {deleteItem.message}
                    </p>
                  </div>
                  <p className="text-xs text-destructive">
                    This will test the backend server endpoint for announcement deletion. If unsupported by the server, your data will remain unchanged.
                  </p>
                </div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? "Checking..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
