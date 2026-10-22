import { useSyncExternalStore } from "react";

const STORAGE_KEY = "abhyas_admin_profile";

const defaultState = {
    fullName: "Aditya Pol",
    email: "poladitya88@gmail.com",
    phone: "+91 98765 43210",
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

// Sync theme immediately on load
if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
}

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
    if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", state.theme === "dark");
    }
    persistState();
    listeners.forEach((l) => l());
}

export function initProfileFromUser(user) {
    if (!user) return;
    setProfile({
        fullName: user.name || user.fullName || state.fullName,
        email: user.email || state.email,
        role: user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : state.role,
    });
}

export function resetProfile() {
    state = { ...defaultState };
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
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
}
export function validateProfile(p) {
    const errors = {};
    if (p.fullName.trim().length < 2)
        errors.fullName = "Enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
        errors.email = "Enter a valid email address";
    if (!/^\+?[\d\s-]{10,15}$/.test(p.phone.trim()))
        errors.phone = "Enter a valid phone number";
    if (!p.role.trim())
        errors.role = "Select a role";
    return errors;
}
