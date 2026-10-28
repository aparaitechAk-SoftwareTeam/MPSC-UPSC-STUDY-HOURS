import { useState } from "react";
import {
  Sun,
  Moon,
  Share2,
  Mail,
  Star,
  ShieldCheck,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Info,
  LogOut,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, Panel, SignOutDialog } from "@/components/app-shell";
import { initials, useProfile, setProfile } from "@/lib/profile-store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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

// Configurable environment endpoints with sensible defaults
const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL || "support@abhyas.local";
const STORE_URL = import.meta.env.VITE_STORE_URL || "";
const PRIVACY_URL = import.meta.env.VITE_PRIVACY_URL || "";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function SettingsPage({ onSignOut }) {
  const profile = useProfile();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const isDarkMode = profile.theme === "dark";

  // Action: Toggle Theme
  const handleToggleTheme = (checked) => {
    const nextTheme = checked ? "dark" : "light";
    setProfile({ theme: nextTheme });
    toast.success(`${nextTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  };

  // Action: Share Platform
  const handleShare = async () => {
    const shareData = {
      title: "Abhyas Tracker — Study Tracker for MPSC & UPSC",
      text: "Abhyas Tracker — Dedicated MPSC & UPSC Study Hours & Revision Tracker for serious aspirants. Manage curriculum progress, spaced revision, and student focus sessions.",
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyShareFallback();
        }
      }
    } else {
      handleCopyShareFallback();
    }
  };

  const handleCopyShareFallback = () => {
    const textToCopy = `Abhyas Tracker — Dedicated MPSC & UPSC Study Hours & Revision Tracker for serious aspirants.\n${window.location.origin}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Abhyas Tracker link copied to clipboard!");
    }).catch(() => {
      toast.info("Study Tracker URL: " + window.location.origin);
    });
  };

  // Action: Support Email
  const handleSupport = () => {
    const subject = encodeURIComponent("Abhyas Tracker Admin Support");
    const body = encodeURIComponent(
      `Hello Abhyas Support Team,\n\nAdmin Name: ${profile.fullName || "Administrator"}\nEmail: ${profile.email || ""}\nRole: ${profile.role || "Admin"}\nPlatform: Web Admin Console\n\nI need assistance with:\n`
    );
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleCopySupportEmail = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(SUPPORT_EMAIL).then(() => {
      setCopiedEmail(true);
      toast.success("Support email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  };

  // Action: Rate App
  const handleRate = () => {
    if (STORE_URL) {
      window.open(STORE_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setRateModalOpen(true);
  };

  // Action: Privacy Policy
  const handlePrivacy = () => {
    if (PRIVACY_URL) {
      window.open(PRIVACY_URL, "_blank", "noopener,noreferrer");
      return;
    }
    setPrivacyModalOpen(true);
  };

  // Action: Confirm Account Deletion
  const handleConfirmDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem("abhyas_admin_token");

    try {
      const res = await fetch(API + "/users/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      setDeleteModalOpen(false);
      setDeleting(false);
      toast.success("Account deleted");
      if (onSignOut) onSignOut();
    } catch {
      setDeleting(false);
      setDeleteModalOpen(false);
      toast.error("Account Deletion Unavailable", {
        description: `The backend server does not currently provide an active account-deletion endpoint. Your account and administrative data have NOT been modified. To remove your account, please contact the system administrator at ${SUPPORT_EMAIL}.`,
        duration: 8000,
      });
    }
  };

  return (
    <AppShell title="Settings" onSignOut={onSignOut}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Admin Profile Card */}
        <div className="flex flex-col gap-6">
          <section className="card-surface overflow-hidden">
            <div className="h-20 bg-sidebar" />
            <div className="-mt-10 flex flex-col items-center px-6 pb-6 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-2xl font-extrabold text-primary-foreground ring-4 ring-card">
                {initials(profile.fullName)}
              </div>
              <h2 className="mt-3 text-lg font-extrabold">
                {profile.fullName || "Administrator"}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {profile.email || "admin@abhyas.local"}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> {profile.role}
              </div>
            </div>
          </section>

          {/* Quick Info Panel */}
          <Panel title="Platform Info">
            <div className="flex flex-col gap-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-foreground">App Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-foreground">Environment</span>
                <span className="capitalize">{import.meta.env.MODE || "production"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-foreground">Active Role</span>
                <span>Administrator</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="font-medium text-foreground">Support Contact</span>
                <span className="font-mono text-[11px]">{SUPPORT_EMAIL}</span>
              </div>
            </div>
          </Panel>

          {/* Sign Out Card */}
          <Panel title="Admin Session">
            <p className="mb-4 text-xs text-muted-foreground">
              End your administrator session on this device.
            </p>
            <Button
              variant="outline"
              className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setSignOutOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </Panel>
        </div>

        {/* Right Column: Settings Sections */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* SECTION A: Appearance */}
          <Panel
            title="Appearance"
            action={
              <span className="text-xs font-semibold text-muted-foreground">
                {isDarkMode ? "Dark Theme" : "Light Theme"}
              </span>
            }
          >
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  {isDarkMode ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {isDarkMode
                      ? "Dark mode is currently enabled across the dashboard."
                      : "Light mode is currently enabled with crisp readability."}
                  </p>
                </div>
              </div>
              <Switch
                aria-label="Toggle Dark Mode"
                checked={isDarkMode}
                onCheckedChange={handleToggleTheme}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Your theme choice is stored in browser local storage and persists across page reloads.
            </p>
          </Panel>

          {/* SECTION B: Community & Support */}
          <Panel title="Community & Support">
            <div className="flex flex-col divide-y divide-border">
              {/* Share Abhyas Tracker */}
              <div
                onClick={handleShare}
                className="group -mx-4 flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/40 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      Share Abhyas Tracker
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Recommend Abhyas Tracker to competitive exam aspirants and mentors
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  Share <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Support & Helpdesk */}
              <div
                onClick={handleSupport}
                className="group -mx-4 flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      Support & Helpdesk
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Email support team at <span className="font-mono">{SUPPORT_EMAIL}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={handleCopySupportEmail}
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedEmail ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                    Email <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Panel>

          {/* SECTION C & D: Rating & Legal */}
          <Panel title="Platform & Legal">
            <div className="flex flex-col divide-y divide-border">
              {/* Rate the Platform */}
              <div
                onClick={handleRate}
                className="group -mx-4 flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/40 first:pt-0"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      Rate Abhyas Tracker
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Leave a review or feedback for upcoming platform updates
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  Review <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Privacy Policy */}
              <div
                onClick={handlePrivacy}
                className="group -mx-4 flex cursor-pointer items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      Privacy Policy
                    </p>
                    <p className="text-xs text-muted-foreground">
                      How student records, study metrics, and credentials are protected
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  View <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Panel>

          {/* SECTION E: Account Management (Destructive Action) */}
          <section className="card-surface p-6 border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive dark:bg-destructive/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-destructive">
                    Delete Administrator Account
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Permanently delete your administrator profile, access permissions, and session records. This action cannot be reversed.
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="shrink-0 font-semibold"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1.5" /> Delete Account
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* DIALOG: Rate App Placeholder */}
      <AlertDialog open={rateModalOpen} onOpenChange={setRateModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" /> Rate Abhyas Tracker
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed pt-2">
              Abhyas Tracker is currently in active development and has not yet been published to the public app stores.
              <br /><br />
              Once released, this option will direct you to the official review listing on Google Play and Apple App Store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setRateModalOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: Privacy Policy Modal */}
      <AlertDialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Platform Privacy Policy
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-3 pt-3 text-xs leading-relaxed text-muted-foreground max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  Abhyas Tracker is designed to provide UPSC & MPSC aspirants and administrators with a secure, isolated study tracking platform.
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">1. Data Ownership & Security</p>
                  <p>
                    All student preparation metrics, subject progress, and timer sessions belong exclusively to the enrolled aspirant. Administrator access is restricted strictly to curriculum and session analytics.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">2. No Commercial Data Sale</p>
                  <p>
                    We do not sell personal data, study logs, or analytics to any commercial advertising networks or third parties.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">3. Credential Protection</p>
                  <p>
                    Passwords are encrypted with industry-standard bcrypt hashing. Sessions use signed JSON Web Tokens (JWT) with strict role authorization.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setPrivacyModalOpen(false)}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: Delete Account Confirmation */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="border-destructive/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Permanently Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs leading-relaxed pt-2">
              This action is permanent and cannot be undone. If confirmed, your administrator credentials, access permissions, and session records will be permanently removed.
              <br /><br />
              Please confirm whether you want to proceed with account deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={handleConfirmDelete}
            >
              {deleting ? "Deleting..." : "Permanently Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: Sign Out */}
      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} onSignOut={onSignOut} />
    </AppShell>
  );
}
