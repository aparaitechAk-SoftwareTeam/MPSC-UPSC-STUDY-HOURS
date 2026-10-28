import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Profile store
//
// STORAGE NOTE: everything in this store lives in the browser's localStorage
// (key: abhyas_admin_profile). The backend has no profile-update endpoint, so
// edits here are NOT sent to the server. Identity fields (name, email, role)
// are initially populated from the authenticated user via GET /api/me.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "abhyas_admin_profile";

const defaultState = {
    userId: null,
    fullName: "",
    email: "",
    phone: "",
    role: "Admin",
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: false,
    theme: "light",
};

function loadInitialState() {
    if (typeof window === "undefined") return defaultState;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return { ...defaultState, ...parsed };
        }
    } catch {
        // Fall back to default state if localStorage is unavailable/corrupt
    }
    return defaultState;
}

let state = loadInitialState();

function applyTheme() {
    if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", state.theme === "dark");
    }
}

// Sync theme immediately on load (also applies to the login screen)
applyTheme();

const listeners = new Set();

function persistState() {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Ignore quota or permission errors
        }
    }
}

export function setProfile(next) {
    state = { ...state, ...next };
    applyTheme();
    persistState();
    listeners.forEach((l) => l());
}

// Populate identity from the authenticated user (GET /api/me or login response).
// - A different user than last time: identity fields are replaced, local-only
//   fields (phone) are cleared so one admin never sees another's local edits.
// - Same user: local edits to name/email are kept; only blanks are filled.
// - Role always comes from the server; it is not editable.
export function initProfileFromUser(user) {
    if (!user) return;
    const serverRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : state.role;
    if (state.userId !== user.id) {
        setProfile({
            userId: user.id ?? null,
            fullName: user.name || user.fullName || "",
            email: user.email || "",
            phone: "",
            role: serverRole,
        });
    } else {
        setProfile({
            fullName: state.fullName || user.name || "",
            email: state.email || user.email || "",
            role: serverRole,
        });
    }
}

// Called on sign-out: drop personal data from memory and localStorage, but keep
// the theme choice so the login screen / next session looks as the user left it.
export function signOutProfile() {
    state = { ...defaultState, theme: state.theme };
    persistState();
    listeners.forEach((l) => l());
}

export function resetProfile() {
    state = { ...defaultState };
    applyTheme();
    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}
    }
    listeners.forEach((l) => l());
}

function subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
}

export function useProfile() {
    return useSyncExternalStore(subscribe, () => state, () => state);
}
export function initials(name) {
    return (name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
}
export function validateProfile(p) {
    const errors = {};
    if (p.fullName.trim().length < 2)
        errors.fullName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
        errors.email = "Enter a valid email address";
    // Phone is optional (the backend has no phone field); validate only if provided.
    if (p.phone.trim() && !/^\+?[\d\s-]{10,15}$/.test(p.phone.trim()))
        errors.phone = "Enter a valid phone number";
    return errors;
}
