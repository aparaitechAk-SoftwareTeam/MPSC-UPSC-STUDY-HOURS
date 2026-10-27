import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function SignIn({ onLoginSuccess }) {
  const [email, setEmail] = useState("admin@abhyas.local");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Invalid administrator credentials");
      }

      if (data.user?.role !== "admin") {
        throw new Error("Access restricted: Administrator privileges required.");
      }

      if (!data.token) {
        throw new Error("Authentication response was missing security token.");
      }

      toast.success("Signed in successfully");
      setPassword("");
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      const message =
        err.name === "TypeError" && err.message.includes("fetch")
          ? "Unable to reach server. Please ensure the backend is running."
          : err.message || "Failed to sign in. Please verify your credentials.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-background p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary/20">
      {/* Top Branding Bar */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-foreground block">
              Abhyas Tracker
            </span>
            <span className="text-xs text-muted-foreground block -mt-0.5">
              MPSC · UPSC Preparation
            </span>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-card text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Admin Portal</span>
        </div>
      </header>

      {/* Main Sign-In Card Container */}
      <main className="w-full flex-1 flex items-center justify-center my-6">
        <div className="w-full max-w-md">
          {/* Card Surface */}
          <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-elevated">
            {/* Header Text */}
            <div className="text-center space-y-1.5 mb-6">
              <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
                <Lock className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Administrator Sign In
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
                Sign in with your verified credentials to access student analytics and portal controls.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive animate-in fade-in duration-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Sign-In Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: null }));
                      }
                    }}
                    placeholder="admin@abhyas.local"
                    disabled={isSubmitting}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
                    className={cn(
                      "w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-60",
                      fieldErrors.email && "border-destructive focus:ring-destructive"
                    )}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="admin-email-error" className="text-[11px] font-medium text-destructive mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: null }));
                      }
                    }}
                    placeholder="••••••••••••"
                    disabled={isSubmitting}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
                    className={cn(
                      "w-full pl-10 pr-10 py-2.5 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-60",
                      fieldErrors.password && "border-destructive focus:ring-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={0}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="admin-password-error" className="text-[11px] font-medium text-destructive mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Notice Footer */}
          <div className="mt-5 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>Authorized personnel only. Protected by JWT verification.</span>
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full max-w-6xl mx-auto py-3 text-center border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          Abhyas Tracker · MPSC & UPSC Aspirant Learning & Management System
        </p>
      </footer>

      <Toaster />
    </div>
  );
}
