import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Ticket,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  RefreshCw,
  X,
  User,
  Mail,
  Calendar,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Bug,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
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

function formatDateTime(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function getCategoryIcon(type) {
  switch (type) {
    case "Bug Report":
      return <Bug className="h-3.5 w-3.5 text-rose-500" />;
    case "Feature Request":
      return <Lightbulb className="h-3.5 w-3.5 text-amber-500" />;
    default:
      return <HelpCircle className="h-3.5 w-3.5 text-blue-500" />;
  }
}

function getCategoryBadge(type) {
  switch (type) {
    case "Bug Report":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    case "Feature Request":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    default:
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }
}

function getStatusBadge(status) {
  switch (status) {
    case "Resolved":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "In Progress":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    case "Open":
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
}

export default function TicketsPage({ onSignOut }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'Open' | 'In Progress' | 'Resolved'
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Ticket for Details / Reply
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Confirmation dialog for Resolve
  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false);

  const fetchTickets = useCallback(async (isManualRefresh = false) => {
    const token = localStorage.getItem("abhyas_admin_token");
    if (!token) return;

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const res = await fetch(`${API}/admin/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `HTTP ${res.status}: Failed to fetch tickets`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTickets(list);

      // If a ticket is currently open in detail modal, update it with fresh backend data
      setSelectedTicket((prev) => {
        if (!prev) return null;
        return list.find((t) => t.id === prev.id) || prev;
      });

      if (isManualRefresh) {
        toast.success("Support tickets refreshed");
      }
    } catch (err) {
      setError(err.message || "Failed to load support tickets");
      toast.error(err.message || "Could not load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProgress = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    return { total, open, inProgress, resolved };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (categoryFilter !== "all" && ticket.type !== categoryFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = String(ticket.id || "").toLowerCase().includes(q);
        const nameMatch = String(ticket.studentName || "").toLowerCase().includes(q);
        const emailMatch = String(ticket.studentEmail || "").toLowerCase().includes(q);
        const subjectMatch = String(ticket.subject || "").toLowerCase().includes(q);
        const messageMatch = String(ticket.message || "").toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !emailMatch && !subjectMatch && !messageMatch) {
          return false;
        }
      }
      return true;
    });
  }, [tickets, statusFilter, categoryFilter, searchQuery]);

  // Handle Status Update
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket || isUpdatingStatus) return;
    const token = localStorage.getItem("abhyas_admin_token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`${API}/admin/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to update ticket status");
      }

      const updated = await res.json();
      toast.success(`Ticket marked as ${newStatus}`);

      // Update in state
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTicket(updated);
    } catch (err) {
      toast.error(err.message || "Failed to update ticket status");
    } finally {
      setIsUpdatingStatus(false);
      setResolveConfirmOpen(false);
    }
  };

  // Handle Send Reply
  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!selectedTicket || !replyText.trim() || isSendingReply) return;

    const token = localStorage.getItem("abhyas_admin_token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setIsSendingReply(true);
    const content = replyText.trim();

    try {
      const res = await fetch(`${API}/admin/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: content,
          status: selectedTicket.status === "Open" ? "In Progress" : selectedTicket.status,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to send response");
      }

      const updated = await res.json();
      toast.success("Reply successfully sent to student");
      setReplyText("");

      // Update in local state
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setSelectedTicket(updated);
    } catch (err) {
      toast.error(err.message || "Failed to send reply. Your draft has been preserved.");
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <AppShell title="Ticket Management" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
              <span>Management</span>
              <span>/</span>
              <span className="text-foreground font-semibold">Ticket Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Student Ticket Management
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                <Ticket size={13} /> Support Hub
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review student issues, answer support queries, and manage ticket resolution in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchTickets(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-sm disabled:opacity-60"
              title="Refresh tickets"
            >
              <RefreshCw size={14} className={cn(refreshing && "animate-spin")} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Tickets
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Ticket size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{stats.total}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">All logged complaints</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Open Tickets
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500">
                {stats.open}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">Awaiting review</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                In Progress
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500/10 text-sky-500">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-sky-500">
                {stats.inProgress}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">Under investigation</p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resolved
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-500">
                {stats.resolved}
              </span>
              <p className="mt-0.5 text-xs text-muted-foreground">Successfully closed</p>
            </div>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Filter Tabs */}
            <div className="inline-flex flex-wrap rounded-xl border bg-muted/40 p-1 text-xs font-semibold">
              {[
                { id: "all", label: "All Tickets", count: stats.total },
                { id: "Open", label: "Open", count: stats.open },
                { id: "In Progress", label: "In Progress", count: stats.inProgress },
                { id: "Resolved", label: "Resolved", count: stats.resolved },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all",
                    statusFilter === tab.id
                      ? "bg-card text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      statusFilter === tab.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Category Dropdown/Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="General Support">General Support</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, subject, ticket ID, or complaint text..."
              className="w-full pl-9 pr-9 py-2 rounded-xl border bg-background text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tickets List / Table */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <RefreshCw className="h-6 w-6 text-primary animate-spin" />
              <p className="text-sm font-semibold text-foreground">Loading support tickets...</p>
              <p className="text-xs text-muted-foreground">Connecting to Abhyas server</p>
            </div>
          ) : error ? (
            <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-foreground">Failed to load tickets</p>
              <p className="text-xs text-muted-foreground max-w-md">{error}</p>
              <button
                type="button"
                onClick={() => fetchTickets()}
                className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <Ticket className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-foreground">No support tickets found</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "No tickets match your active filter criteria. Try clearing search or resetting filters."
                  : "Students have not submitted any support tickets yet. New complaints will show up here."}
              </p>
              {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-muted/40 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Subject & Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      {/* Ticket ID & Category */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs font-bold text-foreground">
                            #{String(t.id).slice(-6)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 w-fit text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                              getCategoryBadge(t.type)
                            )}
                          >
                            {getCategoryIcon(t.type)}
                            {t.type}
                          </span>
                        </div>
                      </td>

                      {/* Student */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{t.studentName || "Aspirant"}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail size={12} />
                            {t.studentEmail || "No email"}
                          </span>
                        </div>
                      </td>

                      {/* Subject & Complaint Snippet */}
                      <td className="py-3 px-4 align-top max-w-xs sm:max-w-md">
                        <p className="font-semibold text-foreground line-clamp-1">{t.subject || "No Subject"}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                          {t.message}
                        </p>
                        {Array.isArray(t.replies) && t.replies.length > 0 && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary">
                            <MessageSquare size={12} />
                            <span>{t.replies.length} admin {t.replies.length === 1 ? "reply" : "replies"}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                            getStatusBadge(t.status)
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              t.status === "Resolved"
                                ? "bg-emerald-500"
                                : t.status === "In Progress"
                                ? "bg-sky-500"
                                : "bg-amber-500"
                            )}
                          />
                          {t.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 align-top whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(t.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-all group-hover:border-primary/40"
                        >
                          <span>Manage</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details & Reply Modal / Drawer */}
      {selectedTicket && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      Ticket #{String(selectedTicket.id).slice(-6)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        getCategoryBadge(selectedTicket.type)
                      )}
                    >
                      {getCategoryIcon(selectedTicket.type)}
                      {selectedTicket.type}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-foreground leading-snug">
                    {selectedTicket.subject || "Student Inquiry"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTicket(null);
                    setReplyText("");
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-border/60">
              {/* Student Metadata Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {selectedTicket.studentName
                      ? selectedTicket.studentName.slice(0, 2).toUpperCase()
                      : "ST"}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {selectedTicket.studentName || "Registered Aspirant"}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} />
                      {selectedTicket.studentEmail || "student@abhyas.local"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> Submitted: {formatDateTime(selectedTicket.createdAt)}
                  </span>
                  <span className="text-[11px] mt-0.5">
                    Last updated: {formatDateTime(selectedTicket.updatedAt || selectedTicket.createdAt)}
                  </span>
                </div>
              </div>

              {/* Status Management Quick Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Status:
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border",
                      getStatusBadge(selectedTicket.status)
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        selectedTicket.status === "Resolved"
                          ? "bg-emerald-500"
                          : selectedTicket.status === "In Progress"
                          ? "bg-sky-500"
                          : "bg-amber-500"
                      )}
                    />
                    {selectedTicket.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== "In Progress" && (
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("In Progress")}
                      className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {selectedTicket.status !== "Resolved" ? (
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => setResolveConfirmOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 size={13} />
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus("Open")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-600 hover:bg-amber-500/10 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <RotateCcw size={13} />
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Original Complaint Content */}
              <div className="pt-4 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageSquare size={13} /> Student Complaint
                </span>
                <div className="rounded-xl border bg-muted/30 p-4 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              {/* Conversation History / Replies Thread */}
              <div className="pt-4 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Conversation History</span>
                  <span className="text-[11px] font-normal">
                    {Array.isArray(selectedTicket.replies) ? selectedTicket.replies.length : 0} responses
                  </span>
                </span>

                {Array.isArray(selectedTicket.replies) && selectedTicket.replies.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTicket.replies.map((reply, idx) => (
                      <div
                        key={reply.id || idx}
                        className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-foreground">
                              {reply.adminName || "Administrator"}
                            </span>
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                              Admin Staff
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDateTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground bg-muted/10">
                    No replies sent to this student yet. Enter an official response below to assist the aspirant.
                  </div>
                )}
              </div>

              {/* Admin Reply Form */}
              <div className="pt-4 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Send size={13} className="text-primary" /> Reply to Student
                </span>
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a clear and constructive resolution or inquiry for this student..."
                    disabled={isSendingReply}
                    className="w-full rounded-xl border bg-background p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {replyText.length} characters • Response will appear in student's mobile app
                    </span>
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSendingReply}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Send size={14} className={cn(isSendingReply && "animate-spin")} />
                      <span>{isSendingReply ? "Sending..." : "Send Reply"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t bg-muted/20 px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                MPSC · UPSC Aspirant Support Ticket System
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedTicket(null);
                  setReplyText("");
                }}
                className="px-4 py-1.5 rounded-lg border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Resolving Ticket */}
      <AlertDialog open={resolveConfirmOpen} onOpenChange={setResolveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Ticket as Resolved?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark Ticket #{String(selectedTicket?.id).slice(-6)} as Resolved?
              The student will see that their complaint has been settled. You can still reopen it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingStatus}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus("Resolved")}
              disabled={isUpdatingStatus}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isUpdatingStatus ? "Updating..." : "Confirm Resolution"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
