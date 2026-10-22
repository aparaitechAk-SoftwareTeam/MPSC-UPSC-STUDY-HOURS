// Single source of DEMO data. Replace with backend calls later.
// None of these values are real recorded sessions.
export const DEMO_LABEL = "Demo data";
export const stats = {
    totalStudents: 24,
    subjects: 4,
    focusSessions: 18,
    studyHours: 42.5,
};
export const subjects = [
    { id: "polity", name: "Indian Polity", progress: 72, topics: "18 / 25 topics", color: "var(--subject-1)" },
    { id: "history", name: "Modern Indian History", progress: 58, topics: "14 / 24 topics", color: "var(--subject-2)" },
    { id: "economy", name: "Economy", progress: 45, topics: "9 / 20 topics", color: "var(--subject-3)" },
    { id: "geography", name: "Geography", progress: 63, topics: "15 / 24 topics", color: "var(--subject-4)" },
];
// Fixed demo hours for the last 7 days, oldest first. Sums to stats-consistent weekly figure.
const demoHours = [4.5, 6, 5.5, 7, 3.5, 8, 7.5];
export function getLast7Days(today = new Date()) {
    return demoHours.map((hours, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return {
            day: d.toLocaleDateString("en-IN", { weekday: "short" }),
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            hours,
        };
    });
}
export const weeklyGoalHours = 50;
export function getWeeklyGoal() {
    const completed = demoHours.reduce((a, b) => a + b, 0);
    const remaining = Math.max(0, weeklyGoalHours - completed);
    const percent = Math.min(100, Math.round((completed / weeklyGoalHours) * 100));
    return { goal: weeklyGoalHours, completed, remaining, percent };
}
function daysAgo(n, today = new Date()) {
    const d = new Date(today);
    d.setDate(today.getDate() - n);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
export function getRecentSessions(today = new Date()) {
    return [
        { id: 1, title: "Fundamental Rights – Articles 12–35", subject: "Indian Polity", date: daysAgo(0, today), duration: "1h 45m", status: "In progress" },
        { id: 2, title: "Revolt of 1857 & its aftermath", subject: "Modern Indian History", date: daysAgo(1, today), duration: "2h 10m", status: "Completed" },
        { id: 3, title: "Monetary Policy & RBI tools", subject: "Economy", date: daysAgo(2, today), duration: "1h 30m", status: "Completed" },
        { id: 4, title: "Monsoon mechanism in India", subject: "Geography", date: daysAgo(3, today), duration: "0h 50m", status: "Missed" },
        { id: 5, title: "Preamble & Basic Structure", subject: "Indian Polity", date: daysAgo(4, today), duration: "1h 20m", status: "Completed" },
    ];
}
export function getTasks(today = new Date()) {
    const due = (n) => {
        const d = new Date(today);
        d.setDate(today.getDate() + n);
        return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    };
    return [
        { id: 1, title: "Revise Directive Principles (DPSP)", subject: "Indian Polity", due: due(1), done: false },
        { id: 2, title: "Solve 50 MCQs on Gandhian era", subject: "Modern Indian History", due: due(2), done: false },
        { id: 3, title: "Make notes: Union Budget basics", subject: "Economy", due: due(4), done: false },
    ];
}
export const notifications = [
    { id: 1, title: "3 students completed today's Polity target", time: "10 min ago", type: "success" },
    { id: 2, title: "Weekly mock test scheduled for Sunday", time: "2 hours ago", type: "info" },
    { id: 3, title: "Geography session missed by 2 students", time: "Yesterday", type: "warning" },
    { id: 4, title: "New syllabus topic added: Climate of India", time: "2 days ago", type: "info" },
];
export const students = [
    { name: "Sneha Patil", target: "MPSC Rajyaseva", hours: 6.5, streak: 12 },
    { name: "Rohan Deshmukh", target: "UPSC CSE", hours: 5.2, streak: 8 },
    { name: "Pooja Kulkarni", target: "MPSC Rajyaseva", hours: 4.8, streak: 5 },
    { name: "Amit Jadhav", target: "UPSC CSE", hours: 3.9, streak: 3 },
    { name: "Kavya Shinde", target: "MPSC Group B", hours: 3.1, streak: 2 },
];
