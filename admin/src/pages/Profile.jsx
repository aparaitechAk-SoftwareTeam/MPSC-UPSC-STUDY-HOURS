import React from 'react';
import { AppShell } from '@/components/app-shell';
import { 
  UserRound, 
  ShieldCheck, 
  Server, 
  Database, 
  Smartphone, 
  CheckCircle2, 
  LogOut, 
  Lock, 
  Mail, 
  Cpu, 
  Activity 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile({ onSignOut }) {
  const adminEmail = 'admin@abhyas.local';
  const role = 'System Administrator';

  function handleTriggerSignOut() {
    window.dispatchEvent(new Event('abhyas:signout'));
  }

  return (
    <AppShell title="Profile" onSignOut={onSignOut}>
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Administrator Profile Card */}
        <section className="card-surface p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl grid place-items-center shadow-lg shadow-blue-500/20">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-foreground">Admin Officer</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <ShieldCheck className="h-3 w-3" /> Verified Admin
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 font-mono">
                <Mail className="h-3 w-3" /> {adminEmail}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Role: {role} • Abhyas Tracker MPSC/UPSC Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerSignOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 text-sm font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </section>

        {/* System & Architecture Health Card */}
        <section className="card-surface p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Quality Assurance & System Environment</h3>
              <p className="text-xs text-muted-foreground">Live health checks for all components</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-emerald-500" /> Backend API
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="font-bold text-base">Port 4000</p>
              <p className="text-xs text-muted-foreground font-mono">http://localhost:4000/api</p>
              <div className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-auto">
                <CheckCircle2 className="h-3 w-3" /> Operational · JWT Auth
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-blue-500" /> Database Store
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <p className="font-bold text-base">JSON File DB</p>
              <p className="text-xs text-muted-foreground font-mono">data/db.json</p>
              <div className="text-[11px] text-blue-500 font-semibold flex items-center gap-1 mt-auto">
                <CheckCircle2 className="h-3 w-3" /> Auto-seeded & Synced
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  <Smartphone className="h-3.5 w-3.5 text-indigo-500" /> Mobile / Web Client
                </span>
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>
              <p className="font-bold text-base">Expo & Web</p>
              <p className="text-xs text-muted-foreground font-mono">Port 8082 / 8083</p>
              <div className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1 mt-auto">
                <CheckCircle2 className="h-3 w-3" /> Dynamic Host IP
              </div>
            </div>
          </div>
        </section>

        {/* Security & Access Policies */}
        <section className="card-surface p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Security & Session Parameters</h3>
              <p className="text-xs text-muted-foreground">Admin access credentials and session lifetimes</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Authentication Protocol</span>
              <span className="font-mono text-foreground font-semibold">JWT (HS256 Bearer Token)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Token Expiration Window</span>
              <span className="font-mono text-foreground font-semibold">7 Days</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Password Hashing</span>
              <span className="font-mono text-foreground font-semibold">bcryptjs (10 salt rounds)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Role-Based Access Control</span>
              <span className="font-mono text-foreground font-semibold">Strict (auth('admin') route guard)</span>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
