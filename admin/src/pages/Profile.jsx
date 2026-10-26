import { useState } from "react";
import { Mail, Phone, ShieldCheck, Pencil, LogOut, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Panel, SignOutDialog } from "@/components/app-shell";
import { initials, setProfile, useProfile, validateProfile } from "@/lib/profile-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Edits on this page are stored in this browser's localStorage only.
// The backend has no profile-update endpoint, so nothing here is sent to the server.
function LocalBadge({ children = "Saved on this device" }) {
    return <span className="rounded-md bg-info-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{children}</span>;
}

function ProfilePage({ onSignOut } = {}) {
    const profile = useProfile();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState({ fullName: "", email: "", phone: "" });
    const [errors, setErrors] = useState({});
    const [signOut, setSignOut] = useState(false);

    const startEdit = () => {
        setDraft({ fullName: profile.fullName, email: profile.email, phone: profile.phone });
        setErrors({});
        setEditing(true);
    };
    const cancel = () => {
        setEditing(false);
        setErrors({});
        toast("Changes discarded");
    };
    const save = () => {
        const e = validateProfile(draft);
        setErrors(e);
        if (Object.keys(e).length) {
            toast.error("Please fix the highlighted fields");
            return;
        }
        setProfile({ fullName: draft.fullName.trim(), email: draft.email.trim(), phone: draft.phone.trim() });
        setEditing(false);
        toast.success("Profile saved on this device");
    };
    const field = (key, label, type = "text", placeholder) => (<div className="flex flex-col gap-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} type={type} placeholder={placeholder} disabled={!editing} value={editing ? draft[key] : profile[key]} aria-invalid={!!errors[key]} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} className={cn(errors[key] && "border-destructive")}/>
      {errors[key] && <p className="text-xs font-medium text-destructive">{errors[key]}</p>}
    </div>);

    return (<AppShell title="Profile" onSignOut={onSignOut}>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6">
          <section className="card-surface overflow-hidden">
            <div className="h-24 bg-sidebar"/>
            <div className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-destructive text-3xl font-extrabold text-destructive-foreground ring-4 ring-card">
                {initials(profile.fullName)}
              </div>
              <h2 className="mt-3 text-xl font-extrabold">{profile.fullName || "Administrator"}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="h-4 w-4"/>{profile.email || "—"}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="h-4 w-4"/>{profile.phone || "No phone added"}</p>
              <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                <ShieldCheck className="h-3.5 w-3.5"/> {profile.role}
              </span>
              <Button className="mt-5 w-full" onClick={startEdit} disabled={editing}>
                <Pencil className="h-4 w-4"/> Edit Profile
              </Button>
            </div>
          </section>
          <Panel title="Sign Out">
            <p className="mb-4 text-sm text-muted-foreground">End your admin session on this device.</p>
            <Button variant="outline" className="border-destructive text-destructive hover:bg-danger-soft hover:text-destructive" onClick={() => setSignOut(true)}>
              <LogOut className="h-4 w-4"/> Sign Out
            </Button>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 xl:col-span-2">
          <Panel title="Personal Information" action={editing ? <span className="text-xs font-semibold text-primary">Editing</span> : <LocalBadge />}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field("fullName", "Full name")}
              {field("email", "Email", "email")}
              {field("phone", "Phone number (optional)", "tel", "+91 98765 43210")}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role} disabled readOnly/>
                <p className="text-xs text-muted-foreground">Assigned by the server; cannot be changed here.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Name, email and phone edits are stored in this browser only. They do not change your login email or
              your account on the server.
            </p>
            <div className="mt-4 flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={cancel} disabled={!editing}>Cancel</Button>
              <Button onClick={save} disabled={!editing}>Save Changes</Button>
            </div>
          </Panel>

          <Panel title="Account Preferences" action={<LocalBadge />}>
            <div className="flex flex-col divide-y">
              {[
            ["emailNotifications", "Email notifications", "Get session and task summaries by email"],
            ["pushNotifications", "Push notifications", "Alerts when students miss a session"],
            ["weeklyReport", "Weekly progress report", "Every Monday morning"],
        ].map(([k, l, d]) => (<div key={k} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <div>
                    <p className="text-sm font-semibold">{l}</p>
                    <p className="text-xs text-muted-foreground">{d}</p>
                  </div>
                  <Switch aria-label={l} checked={profile[k]} onCheckedChange={(c) => {
                setProfile({ [k]: c });
                toast.success(`${l} ${c ? "on" : "off"}`);
            }}/>
                </div>))}
              <div className="flex items-center justify-between gap-4 pt-3">
                <div>
                  <p className="text-sm font-semibold">Theme</p>
                  <p className="text-xs text-muted-foreground">Choose how the dashboard looks</p>
                </div>
                <div className="flex rounded-lg border p-1">
                  {[["light", Sun], ["dark", Moon]].map(([t, Icon]) => (<button key={t} type="button" aria-pressed={profile.theme === t} onClick={() => setProfile({ theme: t })} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium capitalize", profile.theme === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
                      <Icon className="h-4 w-4"/>{t}
                    </button>))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Notification switches are preferences saved locally; they are not yet connected to any backend service.
            </p>
          </Panel>
        </div>
      </div>
      <SignOutDialog open={signOut} onOpenChange={setSignOut} onSignOut={onSignOut}/>
    </AppShell>);
}

export default ProfilePage;
