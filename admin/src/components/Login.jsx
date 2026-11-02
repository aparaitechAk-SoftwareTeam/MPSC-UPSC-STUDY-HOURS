import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ onLogin, isSubmitting, error }) {
  const [email, setEmail] = useState('admin@abhyas.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password');
      return;
    }
    onLogin(email.trim(), password.trim());
  }

  function fillDemo() {
    setEmail('admin@abhyas.local');
    setPassword('ChangeMe123!');
    toast.info('Filled demo admin credentials');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a101d] p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-4">
        {/* Main Card */}
        <div className="w-full bg-[#11192e] border border-slate-800 rounded-2xl p-7 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20 mb-1">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Abhyas Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              MPSC & UPSC Study Hours & Syllabus Management
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-2.5">
              <span className="text-base leading-none">⚠️</span>
              <div className="flex-1 leading-relaxed">
                {error}
                {error.toLowerCase().includes('connect') && (
                  <p className="mt-1 text-[11px] text-red-400 font-normal">
                    Tip: Make sure the backend API is running on port 4000.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@abhyas.local"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0a101d] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0a101d] border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sign In as Administrator</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={fillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Autofill Demo Admin Credentials
            </button>
            <p className="text-[11px] text-slate-500 text-center">
              Default: <code className="text-slate-400">admin@abhyas.local</code> / <code className="text-slate-400">ChangeMe123!</code>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          Abhyas Tracker v1.0 • Quality Assurance & Management Dashboard
        </div>
      </div>
    </div>
  );
}
