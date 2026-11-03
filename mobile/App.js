import React, { useEffect, useRef, useState, useMemo } from 'react';
import AuthScreens from './AuthScreens';
import { smartApiFetch, getApiBase, getCandidateApiUrls, setCustomApiBase, getCustomApiBase, testApiConnection } from './api';
import {
  AppState,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  NativeModules,
  Image,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { translations, AVAILABLE_LANGUAGES, getTranslation, getSubjectName, getTopicName, getChapterName, getTaskTitle, getStatusLabel } from './translations';
import Timer from './Timer';
import ReminderSettingsScreen from './ReminderSettingsScreen';
import NotificationsScreen from './NotificationsScreen';
import StudentProfileScreen from './StudentProfileScreen';
import TicketSupportScreen from './TicketSupportScreen';
import AbhyasMitra from './AbhyasMitra';

const LIGHT_THEME = {
  isDark: false,
  bg: '#f7f9fe',
  cardBg: '#ffffff',
  white: '#ffffff',
  card: '#ffffff',
  ink: '#142841',
  text: '#142841',
  muted: '#72849f',
  blue: '#37689f',
  blueLight: '#edf3fc',
  mid: '#80a9e5',
  soft: '#e9f0fc',
  line: '#e8eef8',
  border: '#edf2fc',
  light: '#dce8fb',
  green: '#10b981',
  greenSoft: '#ecfdf5',
  amber: '#f59e0b',
  amberSoft: '#fffbeb',
  purple: '#8b5cf6',
  purpleSoft: '#f5f3ff',
  red: '#ef4444',
  redSoft: '#fef2f2',
  reminderBg: '#eff6ff',
  reminderBorder: '#bfdbfe',
  reminderAccent: '#1d4ed8'
};

const DARK_THEME = {
  isDark: true,
  bg: '#0a0f1d',
  cardBg: '#131b2e',
  white: '#ffffff',
  card: '#131b2e',
  surface: '#131b2e',
  ink: '#f8fafc',
  text: '#f8fafc',
  muted: '#94a3b8',
  blue: '#60a5fa',
  blueLight: '#1e293b',
  mid: '#3b82f6',
  soft: '#1e2942',
  line: '#1e2d4d',
  border: '#1e2d4d',
  light: '#1e2d4d',
  green: '#34d399',
  greenSoft: '#064e3b',
  amber: '#fbbf24',
  amberSoft: '#451a03',
  purple: '#a78bfa',
  purpleSoft: '#2e1065',
  red: '#f87171',
  redSoft: '#450a0a',
  reminderBg: '#0f233a',
  reminderBorder: '#1e3a5f',
  reminderAccent: '#38bdf8'
};

const ThemeContext = React.createContext(LIGHT_THEME);
const C = LIGHT_THEME;

const resolveApiUrl = () => getApiBase();
const API = getApiBase();

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  try {
    const styleId = 'custom-cursor-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        * {
          cursor: default !important;
        }
        button, [role="button"], a, input[type="button"], input[type="submit"], [tabindex="0"] {
          cursor: pointer !important;
        }
        input, textarea {
          cursor: text !important;
        }
      `;
      document.head.appendChild(style);
    }
  } catch (e) {
    // ignore
  }
}

const txt = (size = 14, bold = false, color = C.ink) => ({
  fontSize: size,
  fontWeight: bold ? '700' : '400',
  color
});

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const formatDateDMY = (dateInput = new Date()) => {
  try {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '';
  }
};

const parseDMYToISO = (dmyStr) => {
  if (!dmyStr) return today();
  const cleaned = String(dmyStr).trim();
  const parts = cleaned.split(/[\/\-\.]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    if (d.length === 4) {
      return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`;
    }
    y = y.length === 2 ? `20${y}` : y;
    return `${y.padStart(4, '2026')}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return today();
};

const todayDMY = () => formatDateDMY(new Date());
const yesterdayDMY = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateDMY(d);
};

const DAILY_MOTIVATIONAL_QUOTES = [
  {
    quote: "Discipline is choosing between what you want now and what you want most. Every focused hour brings you closer to the civil services list.",
    author: "Civil Services Discipline"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts in this journey.",
    author: "Winston Churchill"
  },
  {
    quote: "You have to dream before your dreams can come true. Consistency beats talent when talent doesn't work hard.",
    author: "Dr. A.P.J. Abdul Kalam"
  },
  {
    quote: "Cultivate an indomitable will. If you make up your mind to conquer a subject, no difficulty can deter you.",
    author: "Dr. B.R. Ambedkar"
  },
  {
    quote: "Arise, awake, and stop not until the goal is reached.",
    author: "Swami Vivekananda"
  },
  {
    quote: "Small daily improvements over time lead to stunning results in Prelims and Mains.",
    author: "Robin Sharma"
  },
  {
    quote: "The secret of getting ahead is getting started. Break your syllabus into small manageable daily blocks.",
    author: "Mark Twain"
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    quote: "Your time is limited. Don't waste it doubting yourself. Open your books and focus with intent.",
    author: "Aspirant Wisdom"
  },
  {
    quote: "The difference between ordinary and extraordinary is that little extra effort each day.",
    author: "Jimmy Johnson"
  },
  {
    quote: "Never give up on a dream just because of the time it will take to accomplish it. The time will pass anyway.",
    author: "Earl Nightingale"
  },
  {
    quote: "Doubt kills more dreams than failure ever will. Trust your preparation and revision cycle.",
    author: "Suzy Kassem"
  },
  {
    quote: "When you feel like quitting, remember why you started this civil services dream.",
    author: "MPSC & UPSC Aspirants"
  },
  {
    quote: "An investment in knowledge pays the best interest for your future career in administration.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Action is the foundational key to all success. Complete today's targets with sincerity.",
    author: "Pablo Picasso"
  },
  {
    quote: "Perseverance is failing 19 times and succeeding the 20th time.",
    author: "Julie Andrews"
  },
  {
    quote: "Every revision makes the concept sharper. Do not fear repeating what is important.",
    author: "Topper's Strategy"
  },
  {
    quote: "One day, all your late nights and early mornings will pay off when your roll number is on the PDF.",
    author: "Civil Services Aspirant"
  },
  {
    quote: "Clear intentions, daily consistency, and ruthless revision are the keys to cracking the exam.",
    author: "Abhyas Study Strategy"
  },
  {
    quote: "Focus on the process, not just the outcome. Today's deep focus hours are all that matters right now.",
    author: "Mindful Study"
  },
  {
    quote: "The future belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    quote: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  },
  {
    quote: "The pain of discipline is far less than the pain of regret.",
    author: "Sarah Bombell"
  },
  {
    quote: "Patience, persistence and perspiration make an unbeatable combination for success.",
    author: "Napoleon Hill"
  },
  {
    quote: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    author: "Christian D. Larson"
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    quote: "Self-discipline is the magic power that makes you virtually unstoppable.",
    author: "Dan Kennedy"
  },
  {
    quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Energy and persistence conquer all things.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Great works are performed not by strength, but by perseverance.",
    author: "Samuel Johnson"
  },
  {
    quote: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius"
  }
];

const getDailyMotivationalQuote = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_MOTIVATIONAL_QUOTES[dayOfYear % DAILY_MOTIVATIONAL_QUOTES.length];
};

const getNext7Days = () => {
  const days = [];
  const curr = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(curr.getDate() + i);
    days.push({
      dateStr: d.toISOString().slice(0, 10),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      isTomorrow: i === 1
    });
  }
  return days;
};

const SYLLABUS_TOPICS = {
  // ==================== UPSC CIVIL SERVICES (9 SUBJECTS) ====================
  'upsc-history-culture': [
    { id: 'uh-1', name: 'Ancient Indian history', chapter: 'History and Culture' },
    { id: 'uh-2', name: 'Medieval Indian history', chapter: 'History and Culture' },
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' },
    { id: 'uh-4', name: 'Indian freedom struggle', chapter: 'History and Culture' },
    { id: 'uh-5', name: 'Art, architecture and culture', chapter: 'History and Culture' },
    { id: 'uh-6', name: 'World history (Mains)', chapter: 'History and Culture' }
  ],
  'upsc-geography': [
    { id: 'ug-1', name: 'Physical geography', chapter: 'Geography' },
    { id: 'ug-2', name: 'Indian geography', chapter: 'Geography' },
    { id: 'ug-3', name: 'World geography', chapter: 'Geography' },
    { id: 'ug-4', name: 'Climate, rivers and monsoons', chapter: 'Geography' },
    { id: 'ug-5', name: 'Agriculture and natural resources', chapter: 'Geography' },
    { id: 'ug-6', name: 'Human and economic geography', chapter: 'Geography' }
  ],
  'upsc-polity': [
    { id: 'up-1', name: 'Constitution of India', chapter: 'Indian Polity and Governance' },
    { id: 'up-2', name: 'Fundamental Rights and Duties', chapter: 'Indian Polity and Governance' },
    { id: 'up-3', name: 'Parliament and state legislatures', chapter: 'Indian Polity and Governance' },
    { id: 'up-4', name: 'President, Prime Minister and judiciary', chapter: 'Indian Polity and Governance' },
    { id: 'up-5', name: 'Panchayati Raj and local government', chapter: 'Indian Polity and Governance' },
    { id: 'up-6', name: 'Constitutional and statutory bodies', chapter: 'Indian Polity and Governance' }
  ],
  'upsc-economy': [
    { id: 'ue-1', name: 'GDP, inflation and national income', chapter: 'Indian Economy' },
    { id: 'ue-2', name: 'Banking and monetary policy', chapter: 'Indian Economy' },
    { id: 'ue-3', name: 'Budget and taxation', chapter: 'Indian Economy' },
    { id: 'ue-4', name: 'Poverty, unemployment and development', chapter: 'Indian Economy' },
    { id: 'ue-5', name: 'Agriculture and industry', chapter: 'Indian Economy' },
    { id: 'ue-6', name: 'Government economic schemes', chapter: 'Indian Economy' }
  ],
  'upsc-environment': [
    { id: 'uen-1', name: 'Ecosystems and food chains', chapter: 'Environment and Ecology' },
    { id: 'uen-2', name: 'Biodiversity and conservation', chapter: 'Environment and Ecology' },
    { id: 'uen-3', name: 'National parks and wildlife sanctuaries', chapter: 'Environment and Ecology' },
    { id: 'uen-4', name: 'Climate change and global warming', chapter: 'Environment and Ecology' },
    { id: 'uen-5', name: 'Pollution and environmental laws', chapter: 'Environment and Ecology' }
  ],
  'upsc-science-tech': [
    { id: 'ust-1', name: 'Physics, chemistry and biology basics', chapter: 'Science and Technology' },
    { id: 'ust-2', name: 'Space technology and satellites', chapter: 'Science and Technology' },
    { id: 'ust-3', name: 'Biotechnology', chapter: 'Science and Technology' },
    { id: 'ust-4', name: 'Artificial intelligence and emerging technologies', chapter: 'Science and Technology' },
    { id: 'ust-5', name: 'Health and scientific developments', chapter: 'Science and Technology' }
  ],
  'upsc-current-affairs': [
    { id: 'uca-1', name: 'National and international news', chapter: 'Current Affairs' },
    { id: 'uca-2', name: 'Government policies and schemes', chapter: 'Current Affairs' },
    { id: 'uca-3', name: 'Important reports and indices', chapter: 'Current Affairs' },
    { id: 'uca-4', name: 'International organisations', chapter: 'Current Affairs' },
    { id: 'uca-5', name: 'Awards, appointments and major events', chapter: 'Current Affairs' }
  ],
  'upsc-csat': [
    { id: 'ucs-1', name: 'Reading comprehension', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-2', name: 'Logical reasoning', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-3', name: 'Analytical ability', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-4', name: 'Basic mathematics', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-5', name: 'Data interpretation', chapter: 'CSAT (Prelims Paper II)' },
    { id: 'ucs-6', name: 'Decision-making and problem-solving', chapter: 'CSAT (Prelims Paper II)' }
  ],
  'upsc-ethics': [
    { id: 'uet-1', name: 'Ethics and human values', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-2', name: 'Integrity and impartiality', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-3', name: 'Emotional intelligence', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-4', name: 'Public service values', chapter: 'Ethics, Integrity and Aptitude' },
    { id: 'uet-5', name: 'Case studies and ethical dilemmas', chapter: 'Ethics, Integrity and Aptitude' }
  ],

  // ==================== MPSC MAHARASHTRA (9 SUBJECTS) ====================
  'mpsc-history': [
    { id: 'mh-1', name: 'Ancient and medieval Indian history', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-2', name: 'Modern India and freedom struggle', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-3', name: 'Chhatrapati Shivaji Maharaj', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-4', name: 'Maratha Empire and Peshwa period', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-5', name: 'Social reformers of Maharashtra', chapter: 'Maharashtra and Indian History' },
    { id: 'mh-6', name: "Maharashtra's formation in 1960", chapter: 'Maharashtra and Indian History' }
  ],
  'mpsc-geography': [
    { id: 'mg-1', name: 'Sahyadri and Western Ghats', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-2', name: "Maharashtra's districts and divisions", chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-3', name: 'Godavari, Krishna and other river systems', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-4', name: 'Climate, rainfall and soils', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-5', name: 'Agriculture and irrigation', chapter: 'Maharashtra and Indian Geography' },
    { id: 'mg-6', name: 'Minerals, industries and population', chapter: 'Maharashtra and Indian Geography' }
  ],
  'mpsc-polity': [
    { id: 'mp-1', name: 'Indian Constitution and fundamental rights', chapter: 'Constitution & Administration' },
    { id: 'mp-2', name: 'Parliament and state legislature', chapter: 'Constitution & Administration' },
    { id: 'mp-3', name: 'Governor and Chief Minister', chapter: 'Constitution & Administration' },
    { id: 'mp-4', name: 'Maharashtra government structure', chapter: 'Constitution & Administration' },
    { id: 'mp-5', name: 'Local self-government', chapter: 'Constitution & Administration' },
    { id: 'mp-6', name: 'Panchayati Raj and urban administration', chapter: 'Constitution & Administration' }
  ],
  'mpsc-economy': [
    { id: 'me-1', name: 'Basic economic concepts', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-2', name: 'State budget and economic survey', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-3', name: 'Maharashtra agriculture and industries', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-4', name: 'Banking, inflation and taxation', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-5', name: 'Poverty and unemployment', chapter: 'Indian and Maharashtra Economy' },
    { id: 'me-6', name: 'State and central government schemes', chapter: 'Indian and Maharashtra Economy' }
  ],
  'mpsc-marathi': [
    { id: 'mm-1', name: 'Grammar and sentence structure', chapter: 'Marathi Language' },
    { id: 'mm-2', name: 'Vocabulary and synonyms', chapter: 'Marathi Language' },
    { id: 'mm-3', name: 'Antonyms and idioms', chapter: 'Marathi Language' },
    { id: 'mm-4', name: 'Reading comprehension', chapter: 'Marathi Language' },
    { id: 'mm-5', name: 'Sentence correction and usage', chapter: 'Marathi Language' }
  ],
  'mpsc-english': [
    { id: 'men-1', name: 'Grammar and vocabulary', chapter: 'English Language' },
    { id: 'men-2', name: 'Synonyms and antonyms', chapter: 'English Language' },
    { id: 'men-3', name: 'Sentence correction', chapter: 'English Language' },
    { id: 'men-4', name: 'Comprehension', chapter: 'English Language' },
    { id: 'men-5', name: 'Basic usage and writing skills', chapter: 'English Language' }
  ],
  'mpsc-aptitude': [
    { id: 'ma-1', name: 'Number systems and percentages', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-2', name: 'Ratio and proportion', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-3', name: 'Time, speed and distance', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-4', name: 'Logical reasoning', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-5', name: 'Data interpretation', chapter: 'Aptitude and Reasoning' },
    { id: 'ma-6', name: 'Mental ability', chapter: 'Aptitude and Reasoning' }
  ],
  'mpsc-environment-science': [
    { id: 'mes-1', name: 'Ecology and biodiversity', chapter: 'Environment and Science' },
    { id: 'mes-2', name: 'Pollution and climate change', chapter: 'Environment and Science' },
    { id: 'mes-3', name: 'General science', chapter: 'Environment and Science' },
    { id: 'mes-4', name: 'Health and technology', chapter: 'Environment and Science' },
    { id: 'mes-5', name: 'Maharashtra forests and wildlife', chapter: 'Environment and Science' }
  ],
  'mpsc-current-affairs': [
    { id: 'mca-1', name: 'Maharashtra government decisions', chapter: 'Current Affairs' },
    { id: 'mca-2', name: 'State and national schemes', chapter: 'Current Affairs' },
    { id: 'mca-3', name: 'National and international events', chapter: 'Current Affairs' },
    { id: 'mca-4', name: 'Important appointments and awards', chapter: 'Current Affairs' },
    { id: 'mca-5', name: 'Maharashtra economic and social developments', chapter: 'Current Affairs' }
  ],

  // Backward compatibility aliases
  'upsc-history': [
    { id: 'uh-1', name: 'Ancient Indian history', chapter: 'History and Culture' },
    { id: 'uh-2', name: 'Medieval Indian history', chapter: 'History and Culture' },
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' },
    { id: 'uh-4', name: 'Indian freedom struggle', chapter: 'History and Culture' },
    { id: 'uh-5', name: 'Art, architecture and culture', chapter: 'History and Culture' },
    { id: 'uh-6', name: 'World history (Mains)', chapter: 'History and Culture' }
  ],
  'mpsc-marathi-english': [
    { id: 'mm-1', name: 'Grammar and sentence structure', chapter: 'Marathi Language' },
    { id: 'mm-2', name: 'Vocabulary and synonyms', chapter: 'Marathi Language' },
    { id: 'men-1', name: 'Grammar and vocabulary', chapter: 'English Language' }
  ],
  'mpsc-science-agri': [
    { id: 'mes-1', name: 'Ecology and biodiversity', chapter: 'Environment and Science' },
    { id: 'mes-2', name: 'Pollution and climate change', chapter: 'Environment and Science' }
  ],
  'history': [
    { id: 'uh-1', name: 'Ancient Indian history', chapter: 'History and Culture' },
    { id: 'uh-2', name: 'Medieval Indian history', chapter: 'History and Culture' },
    { id: 'uh-3', name: 'Modern Indian history', chapter: 'History and Culture' },
    { id: 'uh-4', name: 'Indian freedom struggle', chapter: 'History and Culture' },
    { id: 'uh-5', name: 'Art, architecture and culture', chapter: 'History and Culture' },
    { id: 'uh-6', name: 'World history (Mains)', chapter: 'History and Culture' }
  ],
  'polity': [
    { id: 'up-1', name: 'Constitution of India', chapter: 'Indian Polity and Governance' },
    { id: 'up-2', name: 'Fundamental Rights and Duties', chapter: 'Indian Polity and Governance' },
    { id: 'up-3', name: 'Parliament and state legislatures', chapter: 'Indian Polity and Governance' },
    { id: 'up-4', name: 'President, Prime Minister and judiciary', chapter: 'Indian Polity and Governance' },
    { id: 'up-5', name: 'Panchayati Raj and local government', chapter: 'Indian Polity and Governance' },
    { id: 'up-6', name: 'Constitutional and statutory bodies', chapter: 'Indian Polity and Governance' }
  ],
  'economy': [
    { id: 'ue-1', name: 'GDP, inflation and national income', chapter: 'Indian Economy' },
    { id: 'ue-2', name: 'Banking and monetary policy', chapter: 'Indian Economy' },
    { id: 'ue-3', name: 'Budget and taxation', chapter: 'Indian Economy' },
    { id: 'ue-4', name: 'Poverty, unemployment and development', chapter: 'Indian Economy' },
    { id: 'ue-5', name: 'Agriculture and industry', chapter: 'Indian Economy' },
    { id: 'ue-6', name: 'Government economic schemes', chapter: 'Indian Economy' }
  ],
  'geography': [
    { id: 'ug-1', name: 'Physical geography', chapter: 'Geography' },
    { id: 'ug-2', name: 'Indian geography', chapter: 'Geography' },
    { id: 'ug-3', name: 'World geography', chapter: 'Geography' },
    { id: 'ug-4', name: 'Climate, rivers and monsoons', chapter: 'Geography' },
    { id: 'ug-5', name: 'Agriculture and natural resources', chapter: 'Geography' },
    { id: 'ug-6', name: 'Human and economic geography', chapter: 'Geography' }
  ]
};

// Fallback high-resolution thumbnail images for all 18 UPSC & MPSC subjects
const SUBJECT_IMAGE_FALLBACKS = {
  'upsc-history-culture': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
  'history': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
  'upsc-geography': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  'geography': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
  'upsc-polity': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  'polity': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80',
  'upsc-economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
  'economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80',
  'upsc-environment': 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=400&q=80',
  'upsc-science-tech': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80',
  'upsc-current-affairs': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80',
  'upsc-csat': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80',
  'upsc-ethics': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80',
  'mpsc-history': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=400&q=80',
  'mpsc-geography': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'mpsc-polity': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
  'mpsc-economy': 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?auto=format&fit=crop&w=400&q=80',
  'mpsc-marathi': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
  'mpsc-english': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
  'mpsc-aptitude': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
  'mpsc-environment-science': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
  'mpsc-current-affairs': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=400&q=80',
  'maths': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
  'mathematics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
  'English': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80'
};

// Returns subtopics for ANY subject (canonical, legacy alias, or custom)
const getSubjectTopics = (subjectId, subjectName = '') => {
  if (SYLLABUS_TOPICS[subjectId]?.length) {
    return SYLLABUS_TOPICS[subjectId];
  }
  const idMap = {
    'polity': 'upsc-polity',
    'history': 'upsc-history-culture',
    'economy': 'upsc-economy',
    'geography': 'upsc-geography',
    'upsc-history': 'upsc-history-culture',
    'mpsc-marathi-english': 'mpsc-marathi',
    'mpsc-science-agri': 'mpsc-environment-science'
  };
  const mapped = idMap[subjectId];
  if (mapped && SYLLABUS_TOPICS[mapped]?.length) {
    return SYLLABUS_TOPICS[mapped];
  }
  const low = (subjectName || subjectId || '').toLowerCase();
  for (const [key, topics] of Object.entries(SYLLABUS_TOPICS)) {
    if (low.includes('polity') && key.includes('polity')) return topics;
    if (low.includes('history') && key.includes('history')) return topics;
    if (low.includes('geography') && key.includes('geography')) return topics;
    if (low.includes('economy') && key.includes('economy')) return topics;
    if (low.includes('marathi') && key.includes('marathi')) return topics;
    if (low.includes('english') && key.includes('english')) return topics;
    if (low.includes('current') && key.includes('current')) return topics;
    if (low.includes('science') && key.includes('science')) return topics;
    if ((low.includes('csat') || low.includes('math') || low.includes('aptitude')) && (key.includes('csat') || key.includes('aptitude'))) return topics;
  }
  return [
    { id: `${subjectId}-ch1`, name: 'Core Concepts & Standard Reference Theory', chapter: subjectName || 'General Studies' },
    { id: `${subjectId}-ch2`, name: 'Previous Year Questions (PYQs) & Answer Practice', chapter: subjectName || 'Practice & Revision' },
    { id: `${subjectId}-ch3`, name: 'Revision Notes & Mock Test Assessment', chapter: subjectName || 'Practice & Revision' }
  ];
};

function Chip({ label, active, onPress, style, textStyle, numberOfLines = 2 }) {
  const theme = React.useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: active ? theme.blue : theme.soft,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 16,
          marginRight: 6,
          marginBottom: 6,
          maxWidth: '100%',
          flexShrink: 1,
          justifyContent: 'center',
          alignItems: 'center'
        },
        style
      ]}
    >
      <Text
        numberOfLines={numberOfLines}
        style={[
          txt(11, true, active ? '#ffffff' : (theme.isDark ? '#93c5fd' : theme.blue)),
          { textAlign: 'center' },
          textStyle
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Card({ children, style }) {
  const theme = React.useContext(ThemeContext);
  return (
    <View
      style={[
        {
          backgroundColor: theme.cardBg,
          borderRadius: 18,
          padding: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: theme.line
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function Title({ children, sub }) {
  const theme = React.useContext(ThemeContext);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={txt(22, true, theme.ink)}>{children}</Text>
      {sub ? <Text style={[txt(12, false, theme.muted), { marginTop: 4, lineHeight: 18 }]}>{sub}</Text> : null}
    </View>
  );
}

function Ring({ value = 65, size = 150, label = 'Mastered' }) {
  const theme = React.useContext(ThemeContext);
  const r = (size - 18) / 2;
  const co = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={theme.soft} strokeWidth={9} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.blue}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${(co * clamped) / 100} ${co}`}
        />
      </Svg>
      <Text style={txt(24, true, theme.ink)}>{clamped}%</Text>
      <Text style={txt(11, false, theme.muted)}>{label}</Text>
    </View>
  );
}

function Button({ label, onPress, subtle = false, danger = false, style, textStyle }) {
  const theme = React.useContext(ThemeContext);
  const bg = danger ? theme.redSoft : subtle ? theme.soft : theme.blue;
  const fg = danger ? theme.red : subtle ? (theme.isDark ? '#93c5fd' : theme.blue) : '#ffffff';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: bg,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: 'center',
          marginTop: 9
        },
        style
      ]}
    >
      <Text style={[txt(13, true, fg), textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ==============================================================
// 10-HOUR DISCIPLINED STUDY SCHEDULE FOR UPSC/MPSC ASPIRANTS
// Based on top rankers' 4-slot high-retention routine
// ==============================================================
const UPSC_10H_SCHEDULE = [
  {
    id: 'slot-1',
    isBreak: false,
    slotNumber: '1ST SLOT',
    duration: '4 HOURS',
    durationMinutes: 240,
    timeRange: '9:00 AM - 1:15 PM',
    breakNote: '15 Min Break: 12:15 PM - 12:30 PM (Hydrate & eye rest)',
    title: {
      en: 'GS Core Theory & Heavy Concepts',
      mr: 'सामान्य अध्ययन मुख्य सिद्धांत व सखोल अभ्यास',
      hi: 'सामान्य अध्ययन मुख्य सिद्धांत और गहन अध्ययन'
    },
    subTitle: {
      en: 'Polity, Modern History or Geography (Reference books: Laxmikanth, Spectrum)',
      mr: 'राज्यव्यवस्था, आधुनिक इतिहास किंवा भूगोल (संदर्भ पुस्तके: लक्ष्मीकांत, स्पेक्ट्रम)',
      hi: 'राजव्यवस्था, आधुनिक इतिहास या भूगोल (मानक पुस्तकें: लक्ष्मीकांत, स्पेक्ट्रम)'
    },
    defaultSubjectId: 'upsc-polity',
    color: '#3b82f6',
    softColor: '#eff6ff',
    icon: 'school',
    startHour: 9,
    startMin: 0,
    endHour: 13,
    endMin: 15
  },
  {
    id: 'break-lunch',
    isBreak: true,
    slotNumber: 'LUNCH BREAK',
    duration: '1h 45m',
    timeRange: '1:15 PM - 3:00 PM',
    title: {
      en: 'Nutritious Lunch & 20-min Power Nap',
      mr: 'पौष्टिक दुपारचे जेवण व २० मिनिटांची विश्रांती',
      hi: 'पौष्टिक भोजन और २० मिनट का विश्राम'
    },
    subTitle: {
      en: 'Hydrate well, rest eyes & completely disconnect to recharge cognitive energy',
      mr: 'पाणी प्या, डोळ्यांना विश्रांती द्या आणि मनाला ताजेतवाने करा',
      hi: 'पर्याप्त पानी पिएं, आंखों को आराम दें और ऊर्जा पुनः प्राप्त करें'
    },
    color: '#10b981',
    softColor: '#ecfdf5',
    icon: 'restaurant',
    startHour: 13,
    startMin: 15,
    endHour: 15,
    endMin: 0
  },
  {
    id: 'slot-2',
    isBreak: false,
    slotNumber: '2ND SLOT',
    duration: '2 HOURS',
    durationMinutes: 120,
    timeRange: '3:00 PM - 5:00 PM',
    title: {
      en: 'Secondary Subject / Optional Revision',
      mr: 'दुसरा विषय किंवा वैकल्पिक विषयाची उजळणी',
      hi: 'द्वितीय विषय या वैकल्पिक विषय पुनरावलोकन'
    },
    subTitle: {
      en: 'Economy, Environment or State Specific Curriculum & Notes synthesis',
      mr: 'अर्थव्यवस्था, पर्यावरण किंवा महाराष्ट्र विशेष घटक व टिप्पण्या',
      hi: 'अर्थव्यवस्था, पर्यावरण या राज्य विशेष पाठ्यक्रम'
    },
    defaultSubjectId: 'upsc-history-culture',
    color: '#8b5cf6',
    softColor: '#f5f3ff',
    icon: 'book',
    startHour: 15,
    startMin: 0,
    endHour: 17,
    endMin: 0
  },
  {
    id: 'break-evening',
    isBreak: true,
    slotNumber: 'EVENING BREAK',
    duration: '1 HOUR',
    timeRange: '5:00 PM - 6:00 PM',
    title: {
      en: 'Evening Break Time & Fresh Air Walk',
      mr: 'संध्याकाळचा चहा, चालणे व ताजी हवा',
      hi: 'शाम का चाय काल और ताजी हवा में टहलना'
    },
    subTitle: {
      en: 'Outdoor walking, tea/snack, light physical movement to beat afternoon slump',
      mr: 'बाहेर फिरा, चहा/अल्पोपहार घ्या आणि शारीरिक हालचाल करा',
      hi: 'टहलें, चाय/हल्का नाश्ता लें और ताजगी महसूस करें'
    },
    color: '#f59e0b',
    softColor: '#fffbeb',
    icon: 'cafe',
    startHour: 17,
    startMin: 0,
    endHour: 18,
    endMin: 0
  },
  {
    id: 'slot-3',
    isBreak: false,
    slotNumber: '3RD SLOT',
    duration: '2 HOURS',
    durationMinutes: 120,
    timeRange: '6:00 PM - 8:00 PM',
    title: {
      en: 'Answer Writing & PYQs / MCQs Practice',
      mr: 'उत्तर लेखन सराव व मागील वर्षांचे प्रश्न',
      hi: 'उत्तर लेखन अभ्यास और पूर्व वर्ष प्रश्न'
    },
    subTitle: {
      en: 'Timed 50 MCQs or 2 Mains answers; evaluate mistakes and model answers',
      mr: '५० वस्तुनिष्ठ प्रश्न किंवा २ मुख्य परीक्षेची उत्तरे वेळेत सोडवा',
      hi: '५० एमसीक्यू या २ मुख्य परीक्षा उत्तर हल करें'
    },
    defaultSubjectId: 'upsc-csat',
    color: '#ec4899',
    softColor: '#fdf2f8',
    icon: 'create',
    startHour: 18,
    startMin: 0,
    endHour: 20,
    endMin: 0
  },
  {
    id: 'break-dinner',
    isBreak: true,
    slotNumber: 'DINNER BREAK',
    duration: '2 HOURS',
    timeRange: '8:00 PM - 10:00 PM',
    title: {
      en: 'Dinner Break & Decompression',
      mr: 'रात्रीचे जेवण व आराम',
      hi: 'रात्रिभोज और विश्राम'
    },
    subTitle: {
      en: 'Family dinner, gentle conversation, relaxed mind before final night push',
      mr: 'शांतपणे रात्रीचे जेवण घ्या आणि मन शांत ठेवा',
      hi: 'रात्रिभोज और शांत मन से विश्राम'
    },
    color: '#06b6d4',
    softColor: '#ecfeff',
    icon: 'moon',
    startHour: 20,
    startMin: 0,
    endHour: 22,
    endMin: 0
  },
  {
    id: 'slot-4',
    isBreak: false,
    slotNumber: '4TH SLOT',
    duration: '2 HOURS',
    durationMinutes: 120,
    timeRange: '10:00 PM - 12:00 AM',
    title: {
      en: 'Current Affairs & Daily Consolidation',
      mr: 'चालू घडामोडी व दिवसभराचा आढावा',
      hi: 'समसामयिकी और दैनिक समीक्षा'
    },
    subTitle: {
      en: 'The Hindu / Indian Express editorials, monthly compilation, consolidate day',
      mr: 'वर्तमानपत्रातील महत्त्वाचे लेख, चालू घडामोडी व दिवसभराच्या अभ्यासाची नोंद',
      hi: 'दैनिक समाचार पत्र संपादकीय और समसामयिकी पत्रिका'
    },
    defaultSubjectId: 'upsc-current-affairs',
    color: '#f97316',
    softColor: '#fff7ed',
    icon: 'newspaper',
    startHour: 22,
    startMin: 0,
    endHour: 24,
    endMin: 0
  }
];

export default function App() {
  const getInitialTab = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search).get('tab');
      if (['Dashboard', 'Timer', 'Syllabus', 'Planner', 'Analytics'].includes(p)) return p;
    }
    return 'Dashboard';
  };

  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [tab, setTab] = useState(getInitialTab);

  // Core Data
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [topicProgress, setTopicProgress] = useState([]);

  // Timer State
  const [elapsed, setElapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const e = new URLSearchParams(window.location.search).get('elapsed');
      if (e) return Number(e);
    }
    return 0;
  });
  const [running, setRunning] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('running') === 'true';
    }
    return false;
  });
  const [selected, setSelected] = useState('polity');
  const [sessionTopicTitle, setSessionTopicTitle] = useState('Chapter 7: Fundamental Rights');
  const [mode, setMode] = useState('Pomodoro');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [focusMode, setFocusMode] = useState(false);
  const [exitFocusConfirmOpen, setExitFocusConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [zenMode, setZenMode] = useState('Light Zen');
  const [deepZenUnlocked, setDeepZenUnlocked] = useState(false);
  const [deepZenInterruptions, setDeepZenInterruptions] = useState(0);
  const deepZenLocked = zenMode === 'Deep Zen' && !deepZenUnlocked;
  const deepZenSessionActive = deepZenLocked && (running || elapsed > 0);

  // Timer and save reliability references
  const interval = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const savingSession = useRef(false);
  const activeStartedAt = useRef(null);
  const elapsedBase = useRef(0);
  const autoSaveTriggered = useRef(false);
  const nativePinningActive = useRef(false);
  const pinningPromptAttempted = useRef(false);

  // Profile, Notification, and Analytics Range State
  const [profileOpen, setProfileOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState('7');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('Overview');

  // Planner State
  const [plannerView, setPlannerView] = useState("Today's Plan");
  const [planTitle, setPlanTitle] = useState('');
  const [planMinutes, setPlanMinutes] = useState('45');
  const [planSubject, setPlanSubject] = useState('upsc-polity');
  const [planPriority, setPlanPriority] = useState('Medium');
  const [planDateType, setPlanDateType] = useState('today');
  const [selectedWeekDate, setSelectedWeekDate] = useState(today());
  const [plannerExamFilter, setPlannerExamFilter] = useState('ALL');
  const [planExamTarget, setPlanExamTarget] = useState('UPSC');

  const [weeklySubTab, setWeeklySubTab] = useState('ALL_WEEK');

  // Syllabus State
  const [expandedSubject, setExpandedSubject] = useState('upsc-polity');
  const [expandAllSubjects, setExpandAllSubjects] = useState(false);
  const [syllabusExamFilter, setSyllabusExamFilter] = useState('ALL');
  const [highlightedTopicId, setHighlightedTopicId] = useState(null);
  const [navigatedTopicInfo, setNavigatedTopicInfo] = useState(null);
  const mainScrollRef = useRef(null);

  // Timer Focus State
  const [focusExamFilter, setFocusExamFilter] = useState('ALL');

  // Manual / Offline Study Logging State (Accessible via Settings & Topic actions)
  const [manualLogOpen, setManualLogOpen] = useState(false);
  const [manualLogMode, setManualLogMode] = useState('offline'); // 'offline' or 'past'
  const [manualSubject, setManualSubject] = useState('upsc-polity');
  const [manualExamFilter, setManualExamFilter] = useState('ALL');
  const [manualDate, setManualDate] = useState('today');
  const [manualCustomDate, setManualCustomDate] = useState(todayDMY);
  const [manualHours, setManualHours] = useState('2');
  const [manualMinutes, setManualMinutes] = useState('0');
  const [manualActivity, setManualActivity] = useState('Theory & Reading');
  const [manualTopic, setManualTopic] = useState('');
  const [isLoggingManual, setIsLoggingManual] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedTrackDate, setSelectedTrackDate] = useState(today());
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Helper for past 7 days (TrackIt Date Selector Strip)
  const past7Days = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      list.push({ dateStr, label: `${month} ${dayNum}`, weekday, isToday: i === 0 });
    }
    return list;
  }, []);

  // Determine currently active slot from local real time
  const active10hSlot = useMemo(() => {
    const now = new Date();
    const currMins = now.getHours() * 60 + now.getMinutes();
    return UPSC_10H_SCHEDULE.find(s => {
      const start = s.startHour * 60 + s.startMin;
      const end = s.endHour * 60 + s.endMin;
      return currMins >= start && currMins < end;
    }) || null;
  }, []);

  // 1-Click Apply 10-Hour Master Schedule to Today or Tomorrow
  const apply10hSchedule = async (targetDateStr) => {
    const isTargetTomorrow = targetDateStr === tomorrow();
    const studySlots = UPSC_10H_SCHEDULE.filter(s => !s.isBreak);
    
    try {
      for (const slot of studySlots) {
        const titleText = slot.title[lang] || slot.title.en;
        await req('/plan', 'POST', {
          title: titleText,
          subjectId: slot.defaultSubjectId,
          exam: 'UPSC',
          minutes: slot.durationMinutes,
          priority: slot.slotNumber === '1ST SLOT' ? 'High' : 'Medium',
          date: targetDateStr,
          done: false
        });
      }
      await refresh();
      showAppDialog({
        title: '10-Hour Schedule Applied! ⏱️',
        message: `${isTargetTomorrow ? "Tomorrow's" : "Today's"} study planner now has all 4 disciplined study blocks scheduled (10 hours total).`,
        confirmText: t('done') || 'Great!',
        cancelText: null
      });
    } catch (e) {
      showAppDialog({
        title: 'Notice',
        message: e.message || 'Could not schedule tasks.',
        confirmText: 'OK',
        cancelText: null
      });
    }
  };
  const [appDialog, setAppDialog] = useState(null);

  const showAppDialog = (cfg) => {
    setAppDialog(cfg);
  };
  const closeAppDialog = () => {
    setAppDialog(null);
  };

  const appAlert = (title, message, buttons) => {
    if (Array.isArray(buttons) && buttons.length > 1) {
      const cancelBtn = buttons.find(b => b.style === 'cancel') || buttons[1];
      const confirmBtn = buttons.find(b => b.style !== 'cancel') || buttons[0];
      showAppDialog({
        title,
        message,
        type: 'confirm',
        icon: confirmBtn?.style === 'destructive' ? 'log-out-outline' : 'help-circle-outline',
        confirmText: confirmBtn?.text || t('confirm') || 'OK',
        cancelText: cancelBtn?.text || t('cancel') || 'Cancel',
        danger: confirmBtn?.style === 'destructive',
        onConfirm: () => {
          closeAppDialog();
          if (confirmBtn?.onPress) confirmBtn.onPress();
        },
        onCancel: () => {
          closeAppDialog();
          if (cancelBtn?.onPress) cancelBtn.onPress();
        }
      });
    } else {
      const btn = Array.isArray(buttons) ? buttons[0] : null;
      const isError = (title || '').toLowerCase().includes('error');
      const isSuccess = (title || '').toLowerCase().includes('success') || (title || '').toLowerCase().includes('saved') || (title || '').toLowerCase().includes('scheduled') || (title || '').toLowerCase().includes('logged');
      showAppDialog({
        title,
        message,
        type: isError ? 'error' : isSuccess ? 'success' : 'alert',
        icon: isError ? 'alert-circle-outline' : isSuccess ? 'checkmark-circle-outline' : 'information-circle-outline',
        confirmText: btn?.text || t('done') || 'OK',
        cancelText: null,
        danger: false,
        onConfirm: () => {
          closeAppDialog();
          if (btn?.onPress) btn.onPress();
        }
      });
    }
  };
  const [lang, setLang] = useState(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('abhyas_lang');
      if (stored && ['en', 'hi', 'mr'].includes(stored)) return stored;
    }
    return 'en';
  });
  const [timerSoundEnabled, setTimerSoundEnabled] = useState(true);

  const playTimerTone = (type = 'start') => {
    if (!timerSoundEnabled) return;
    try {
      if (typeof window !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;
        if (type === 'start') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'pause') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(783.99, now);
          osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.12);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'save' || type === 'complete') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.1);
          osc.frequency.setValueAtTime(783.99, now + 0.2);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.start(now);
          osc.stop(now + 0.55);
        }
      }
    } catch {}
  };

  const t = (key, fallback) => getTranslation(lang, key, fallback);

  const changeLanguage = async (newLang) => {
    setLang(newLang);
    try {
      await AsyncStorage.setItem('abhyas_lang', newLang);
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        localStorage.setItem('abhyas_lang', newLang);
      }
    } catch {}
  };

  // Theme State (Dark / Light Night Mode)
  const [isDark, setIsDark] = useState(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('abhyas_dark_theme');
      if (stored === 'true') return true;
      if (stored === 'false') return false;
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search) {
      const m = new URLSearchParams(window.location.search).get('theme');
      if (m === 'dark') return true;
      if (m === 'light') return false;
    }
    return false; // Default to clean Day mode
  });
  const [dailyGoalHours, setDailyGoalHours] = useState(8);

  useEffect(() => {
    AsyncStorage.getItem('abhyas_dark_theme').then(val => {
      if (val === 'true') setIsDark(true);
      else if (val === 'false') setIsDark(false);
    }).catch(() => {});
    AsyncStorage.getItem('abhyas_lang').then(val => {
      if (val && ['en', 'hi', 'mr'].includes(val)) setLang(val);
    }).catch(() => {});
    AsyncStorage.getItem('abhyas_daily_goal').then(val => {
      if (val) setDailyGoalHours(Number(val) || 8);
    }).catch(() => {});
    AsyncStorage.getItem('abhyas_timer_sound').then(val => {
      if (val !== null) setTimerSoundEnabled(val === 'true');
    }).catch(() => {});
    AsyncStorage.getItem('abhyas_custom_api_base').then(val => {
      if (val) {
        setCustomApiBase(val);
      }
    }).catch(() => {});
  }, []);

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem('abhyas_dark_theme', String(next)).catch(() => {});
      if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
        try { localStorage.setItem('abhyas_dark_theme', String(next)); } catch {}
      }
      return next;
    });
  }

  const C = isDark ? DARK_THEME : LIGHT_THEME;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = C.bg;
      if (document.documentElement) {
        document.documentElement.style.backgroundColor = C.bg;
      }
    }
  }, [C.bg]);
  const input = {
    backgroundColor: C.cardBg,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 6,
    marginBottom: 10,
    color: C.ink,
    fontSize: 13
  };

  const txt = (size = 14, bold = false, color = C.ink) => ({
    fontSize: size,
    fontWeight: bold ? '700' : '400',
    color
  });

  const card = {
    backgroundColor: C.card || C.cardBg || C.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border || C.line
  };

  const handleTabChange = (nextTab) => {
    if (deepZenSessionActive && nextTab !== 'Timer') {
      Alert.alert(
        'Deep Zen Active',
        'You cannot switch to another screen while a Deep Zen session is active. Return to the Timer and finish or reset the session.'
      );
      return;
    }
    setProfileOpen(false);
    setNotifOpen(false);
    setRemindersOpen(false);
    setTab(nextTab);
  };

  // Daily Routine Reminders State
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 15;
  const todayReminderPlans = plans.filter(p => (p.date === today() || !p.date) && !p.done);
  const todayReminderMins = todayReminderPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
  const tomorrowReminderPlans = plans.filter(p => p.date === tomorrow() && !p.done);
  const tomorrowReminderMins = tomorrowReminderPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
  const [reminderDismissed, setReminderDismissed] = useState(false);

  async function requestBrowserReminder() {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('Abhyas Routine Reminder Active', {
            body: isMorning
              ? `Morning Briefing: You have ${todayReminderPlans.length} tasks scheduled today (${todayReminderMins}m). Focus deeply!`
              : `Night Routine: Tomorrow has ${tomorrowReminderPlans.length} tasks planned. Plan ahead for a great day!`,
            icon: '/favicon.ico'
          });
          appAlert('Notifications Enabled', 'Daily routine reminders are now active on your device!');
        } else {
          appAlert('Notice', 'Notification permission was not granted.');
        }
      } catch (e) {
        appAlert('Error', e.message);
      }
    } else {
      appAlert('Routine Reminders Active', 'Daily morning and night routine briefings are active inside your app!');
    }
  }

  async function autoPlanTomorrow() {
    try {
      await req('/plan', 'POST', {
        title: 'Polity & Constitution Revision',
        minutes: 60,
        exam: 'UPSC',
        priority: 'High',
        subjectId: 'upsc-polity',
        date: tomorrow()
      });
      await req('/plan', 'POST', {
        title: 'Maharashtra Geography & Current Affairs',
        minutes: 60,
        exam: 'MPSC',
        priority: 'High',
        subjectId: 'mpsc-geography',
        date: tomorrow()
      });
      appAlert('Scheduled!', "Tomorrow's core study plan was created successfully.");
      refresh();
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function autoPlanWeek() {
    try {
      const dates = getNext7Days();
      let created = 0;
      for (const d of dates) {
        const hasPlans = plans.some(p => p.date === d.dateStr);
        if (!hasPlans) {
          await req('/plan', 'POST', {
            title: `GS Core & Standard Theory (${d.dayName})`,
            minutes: 90,
            exam: 'UPSC',
            priority: 'High',
            subjectId: 'upsc-polity',
            date: d.dateStr
          });
          await req('/plan', 'POST', {
            title: `PYQ Practice & CSAT (${d.dayName})`,
            minutes: 60,
            exam: 'UPSC',
            priority: 'Medium',
            subjectId: 'upsc-csat',
            date: d.dateStr
          });
          await req('/plan', 'POST', {
            title: `Daily Current Affairs & Editorial (${d.dayName})`,
            minutes: 45,
            exam: 'UPSC',
            priority: 'High',
            subjectId: 'upsc-current-affairs',
            date: d.dateStr
          });
          created += 3;
        }
      }
      refresh();
      appAlert('Weekly Plan Generated', `Scheduled ${created} study sessions across your 7-day calendar!`);
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function req(route, method = 'GET', body, t = token) {
    const r = await smartApiFetch(route, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + t
      },
      body: body ? JSON.stringify(body) : undefined
    });
    const d = await r.json();
    if (!r.ok) throw Error(d.error || 'Request failed');
    return d;
  }

  async function refresh(t = token) {
    if (!t) return;
    try {
      const [s, h, p, n, a, tp] = await Promise.all([
        req('/subjects', 'GET', null, t).catch(() => []),
        req('/sessions', 'GET', null, t).catch(() => []),
        req('/plan', 'GET', null, t).catch(() => []),
        req('/notifications', 'GET', null, t).catch(() => []),
        req('/analytics', 'GET', null, t).catch(() => ({})),
        req('/topic-progress', 'GET', null, t).catch(() => [])
      ]);
      const validSubjects = Array.isArray(s) ? s.filter(x => x && x.id && (String(x.id).startsWith('upsc-') || String(x.id).startsWith('mpsc-'))) : [];
      setSubjects(validSubjects);
      setSessions(Array.isArray(h) ? h : []);
      setPlans(Array.isArray(p) ? p : []);
      setNotes(Array.isArray(n) ? n : []);
      setAnalytics(a && typeof a === 'object' ? a : {});
      setTopicProgress(Array.isArray(tp) ? tp : []);
    } catch (e) {
      console.warn('[Data refresh failed]', e.message);
    }
  }

  useEffect(() => {
    let isMounted = true;
    // Failsafe timer: loading spinner is guaranteed to dismiss within 2000ms
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2000);

    const init = async () => {
      try {
        let activeToken = await AsyncStorage.getItem('abhyasToken');
        if (!activeToken && Platform.OS === 'web' && typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('demo') === 'true' || urlParams.get('autologin') === 'true') {
            try {
              const res = await smartApiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'student@abhyas.local', password: 'Student123!' }),
                timeout: 2500
              });
              const d = await res.json();
              if (d.token) {
                activeToken = d.token;
                await AsyncStorage.setItem('abhyasToken', d.token);
              }
            } catch (err) {
              console.warn('[Auto-login demo notice]', err.message);
            }
          }
        }
        if (activeToken) {
          try {
            const me = await req('/me', 'GET', null, activeToken);
            if (isMounted) {
              setToken(activeToken);
              setUser(me.user || { role: 'student', name: 'Demo Aspirant' });
            }
            await refresh(activeToken);
          } catch (authErr) {
            const isAuthFail = authErr.message && (authErr.message.includes('401') || authErr.message.includes('403') || authErr.message.toLowerCase().includes('authentication required'));
            if (isAuthFail) {
              console.warn('[Session expired]', authErr.message);
              await AsyncStorage.removeItem('abhyasToken');
              if (isMounted) {
                setToken('');
                setUser(null);
              }
            } else {
              // Network switch or temporary connection blip: maintain logged-in state!
              console.warn('[Network switch during session init]', authErr.message);
              if (isMounted) {
                setToken(activeToken);
                setUser({ role: 'student', name: 'Demo Aspirant' });
              }
              await refresh(activeToken).catch(() => {});
            }
          }
        }
      } catch (e) {
        console.warn('[Init error]', e.message);
      } finally {
        clearTimeout(safetyTimer);
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Android screen pinning for an active Deep Zen countdown.
  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeModules.FocusLock) {
      return;
    }

    const shouldPin = deepZenLocked && (running || elapsed > 0);

    if (
      shouldPin &&
      !nativePinningActive.current &&
      !pinningPromptAttempted.current
    ) {
      pinningPromptAttempted.current = true;

      NativeModules.FocusLock.startPinning()
        .then((status) => {
          nativePinningActive.current = Boolean(status?.active);

          if (status?.mode !== 'LOCKED') {
            console.warn(
              'Deep Zen enforcement status:',
              status?.mode ?? 'UNKNOWN'
            );
          }
        })
        .catch((error) => {
          nativePinningActive.current = false;
          console.warn('Deep Zen screen pinning failed:', error);

          Alert.alert(
            'Screen pinning unavailable',
            'Android could not start screen pinning. Strict app-switch prevention is not guaranteed on this device.'
          );
        });
    } else if (!shouldPin && nativePinningActive.current) {
      nativePinningActive.current = false;

      NativeModules.FocusLock.stopPinning().catch((error) => {
        console.warn('Could not stop screen pinning:', error);
      });
    }
  }, [deepZenLocked, running, elapsed]);

  // Recheck Android screen pinning when Abhyas returns to the foreground.
  useEffect(() => {
    if (Platform.OS !== 'android' || !NativeModules.FocusLock) {
      return;
    }

    let checking = false;
    let mounted = true;

    const shouldKeepLocked = () =>
      deepZenLocked && (running || elapsed > 0);

    const subscription = AppState.addEventListener(
      'change',
      async (nextState) => {
        if (
          nextState !== 'active' ||
          !shouldKeepLocked() ||
          checking
        ) {
          return;
        }

        checking = true;

        try {
          const status =
            await NativeModules.FocusLock.getPinningStatus();

          if (!mounted || !shouldKeepLocked()) {
            return;
          }

          nativePinningActive.current = status.active;

          if (!status.active) {
            pinningPromptAttempted.current = true;

            const newStatus =
              await NativeModules.FocusLock.startPinning();

            if (mounted) {
              nativePinningActive.current = Boolean(newStatus?.active);

              if (newStatus?.mode !== 'LOCKED') {
                console.warn(
                  'Deep Zen recovery mode:',
                  newStatus?.mode ?? 'UNKNOWN'
                );
              }
            }
          }

        } catch (error) {
          nativePinningActive.current = false;
          console.warn(
            'Deep Zen foreground lock recovery failed:',
            error
          );
        } finally {
          checking = false;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [deepZenLocked, running, elapsed]);

  // Track when a student leaves Abhyas during an active Deep Zen session.
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = AppState.addEventListener(
      'change',
      (nextState) => {
        const previousState = appStateRef.current;
        appStateRef.current = nextState;

        const sessionActive =
          deepZenLocked && running && !deepZenUnlocked;

        const leftApp =
          previousState === 'active' &&
          (nextState === 'background' || nextState === 'inactive');

        if (sessionActive && leftApp) {
          setDeepZenInterruptions((count) => count + 1);

          console.warn(
            'Deep Zen interruption detected: Abhyas left the foreground.'
          );
        }

        if (
          sessionActive &&
          nextState === 'active' &&
          previousState !== 'active'
        ) {
          Alert.alert(
            'Stay focused',
            'You left Abhyas during Deep Zen. Return to your study session and continue focusing.'
          );
        }
      }
    );

    return () => subscription.remove();
  }, [deepZenLocked, running, deepZenUnlocked]);

  // Update timer using timestamps and automatically save completed countdowns.
  useEffect(() => {
    if (!running || activeStartedAt.current === null) {
      return;
    }

    const countdownSeconds =
      mode === 'Pomodoro'
        ? 25 * 60
        : mode === 'Custom'
          ? customMinutes * 60
          : null;

    interval.current = setInterval(() => {
      const activeSeconds = Math.floor(
        (Date.now() - activeStartedAt.current) / 1000
      );

      const nextElapsed = elapsedBase.current + activeSeconds;

      if (
        countdownSeconds !== null &&
        nextElapsed >= countdownSeconds
      ) {
        // Freeze actual active study time at the selected duration.
        elapsedBase.current = countdownSeconds;
        activeStartedAt.current = null;

        setElapsed(countdownSeconds);
        setRunning(false);
        setDeepZenUnlocked(true);

        // Trigger the existing save flow once.
        if (!autoSaveTriggered.current) {
          autoSaveTriggered.current = true;
          void finish(true);
        }

        return;
      }

      setElapsed(nextElapsed);
    }, 250);

    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [running, mode, customMinutes]);

  // Clean up the timer interval when the component unmounts.
  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  async function login(credentialsOrEmail, overridePassword) {
    setAuthError('');
    setIsLoggingIn(true);
    try {
      let emailToUse = '';
      let passwordToUse = '';
      let isReg = register;
      let nameToUse = name;

      if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
        if (credentialsOrEmail.token) {
          setToken(credentialsOrEmail.token);
          setUser(credentialsOrEmail.user || { role: 'student', name: 'Demo Aspirant' });
          setTab('Dashboard');
          setNotifOpen(false);
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete('tab');
              window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
            } catch {}
          }
          await AsyncStorage.setItem('abhyasToken', credentialsOrEmail.token);
          try {
            await refresh(credentialsOrEmail.token);
          } catch (syncErr) {
            console.warn('[Background post-login sync]', syncErr.message);
          }
          return;
        }
        emailToUse = (credentialsOrEmail.email || '').trim();
        passwordToUse = (credentialsOrEmail.password || '').trim();
        isReg = credentialsOrEmail.isRegister ?? register;
        nameToUse = (credentialsOrEmail.name || name || '').trim();
      } else {
        emailToUse = (credentialsOrEmail || loginEmail || '').trim();
        passwordToUse = (overridePassword || password || '').trim();
      }

      const route = '/auth/' + (isReg ? 'register' : 'login');
      const res = await smartApiFetch(route, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameToUse,
          email: emailToUse,
          password: passwordToUse
        })
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw Error(d.error || `Unable to sign in (Status ${res.status})`);
      setToken(d.token);
      setUser(d.user || { role: 'student', name: nameToUse || 'Demo Aspirant' });
      setTab('Dashboard');
      setNotifOpen(false);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('tab');
          window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
        } catch {}
      }
      await AsyncStorage.setItem('abhyasToken', d.token);
      await refresh(d.token);
    } catch (e) {
      const isNetwork = e.message === 'Network request failed' || (e.message && e.message.toLowerCase().includes('failed to fetch')) || (e.name === 'AbortError');
      const msg = isNetwork
        ? `Cannot connect to server (tried: ${getCandidateApiUrls().join(', ')}).\nPlease ensure the backend is running.`
        : e.message;
      setAuthError(msg);
      appAlert('Sign in error', msg);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleSignOut() {
    setRunning(false);
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    activeStartedAt.current = null;
    elapsedBase.current = 0;
    autoSaveTriggered.current = false;
    await AsyncStorage.removeItem('abhyasToken');
    setToken('');
    setUser(null);
    setTab('Dashboard');
    setProfileOpen(false);
    setSettingsOpen(false);
    setNotifOpen(false);
    setRemindersOpen(false);
  }

  function quickDemoFill(demoType = 'student') {
    if (demoType === 'admin') {
      setEmail('admin@abhyas.local');
      setPassword('ChangeMe123!');
      login('admin@abhyas.local', 'ChangeMe123!');
    } else {
      setEmail('student@abhyas.local');
      setPassword('Student123!');
      login('student@abhyas.local', 'Student123!');
    }
  }

  // Start a new session or resume a paused session.
  function startSession() {
    if (savingSession.current) return;
    if (activeStartedAt.current !== null) return;
    autoSaveTriggered.current = false;

    const limitSeconds =
      mode === 'Pomodoro'
        ? 25 * 60
        : mode === 'Custom'
          ? customMinutes * 60
          : null;

    if (limitSeconds !== null && elapsed >= limitSeconds) {
      Alert.alert(
        'Timer complete',
        'Your countdown has finished. Save the session or reset the timer before starting again.'
      );
      return;
    }

    activeStartedAt.current = Date.now();
    setRunning(true);
    playTimerTone('start');
  }

  // Accumulate only active study time.
  function pauseSession() {
    if (savingSession.current) return;

    if (deepZenLocked && (running || elapsed > 0)) {
      Alert.alert(
        'Deep Zen Active',
        'You cannot pause this session. Wait until the countdown reaches 00:00.'
      );
      return;
    }

    const activeSeconds = activeStartedAt.current !== null
      ? Math.floor((Date.now() - activeStartedAt.current) / 1000)
      : 0;

    elapsedBase.current += activeSeconds;
    activeStartedAt.current = null;

    setElapsed(elapsedBase.current);
    setRunning(false);
    playTimerTone('pause');
  }

  // Open the in-app reset confirmation dialog.
  function resetSession() {
    if (savingSession.current || deepZenLocked) return;
    setResetConfirmOpen(true);
  }

  // Cancel must not change the timer or elapsed time.
  function cancelReset() {
    setResetConfirmOpen(false);
  }

  // Confirmed reset stops the timer and clears elapsed time.
  function confirmReset() {
    if (savingSession.current || deepZenLocked) return;

    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }

    activeStartedAt.current = null;
    elapsedBase.current = 0;
    autoSaveTriggered.current = false;

    setRunning(false);
    setElapsed(0);
    setResetConfirmOpen(false);
    playTimerTone('pause');
  }

  // Save the session with duplicate-submit guard and timestamp accuracy.
  async function finish(automatic = false) {
    const isAutomatic = automatic === true;

    if (savingSession.current || (deepZenLocked && !isAutomatic)) {
      return;
    }

    const finalElapsed =
      elapsedBase.current +
      (activeStartedAt.current !== null
        ? Math.floor((Date.now() - activeStartedAt.current) / 1000)
        : 0);

    if (finalElapsed <= 0) {
      Alert.alert('No study time', 'Start a session before saving.');
      return;
    }

    savingSession.current = true;
    playTimerTone('save');

    // Freeze the timer at its final duration.
    activeStartedAt.current = null;
    elapsedBase.current = finalElapsed;

    setRunning(false);
    setElapsed(finalElapsed);

    const minutes = Math.max(1, Math.round(finalElapsed / 60));

    try {
      await req('/sessions', 'POST', {
        subjectId: selected,
        minutes,
        focusScore: 94,
        mode
      });

      // Clear timer state only after the POST succeeds.
      elapsedBase.current = 0;
      activeStartedAt.current = null;
      setElapsed(0);

      const refreshed = await refresh();

      if (refreshed) {
        Alert.alert('Session saved', `${minutes} minute(s) logged for ${subjects.find(x => x.id === selected)?.name || selected}!`);
      } else {
        Alert.alert(
          'Session submitted',
          'The server accepted your session, but history could not be refreshed. Reopen Analytics to verify it.'
        );
      }
    } catch (error) {
      // Keep the time available for a retry.
      elapsedBase.current = finalElapsed;
      activeStartedAt.current = null;

      setElapsed(finalElapsed);
      setRunning(false);

      Alert.alert(
        'Save failed',
        `Your timer value has been kept. Check your connection before retrying.\n\n${error.message}`
      );
    } finally {
      savingSession.current = false;
    }
  }

  async function saveManualSession() {
    const hrs = Math.max(0, parseInt(manualHours, 10) || 0);
    const mins = Math.max(0, parseInt(manualMinutes, 10) || 0);
    const totalMins = hrs * 60 + mins;

    if (totalMins <= 0) {
      appAlert('Invalid Duration', 'Please enter at least 1 minute of study time.');
      return;
    }

    const subId = manualSubject || selected || (subjects[0]?.id || 'polity');
    let targetDateStr;
    if (manualDate === 'yesterday') {
      targetDateStr = yesterday();
    } else if (manualDate === 'custom') {
      targetDateStr = parseDMYToISO(manualCustomDate);
    } else {
      targetDateStr = today();
    }
    const sessionTime = new Date(`${targetDateStr}T12:00:00Z`).toISOString();

    setIsLoggingManual(true);
    try {
      await req('/sessions', 'POST', {
        subjectId: subId,
        minutes: totalMins,
        mode: manualLogMode === 'past' ? 'Past Study Log' : 'Offline Book Study',
        activity: manualActivity,
        note: manualTopic.trim(),
        startedAt: sessionTime,
        focusScore: 92
      });
      playTimerTone('save');
      await refresh();
      setManualLogOpen(false);
      setManualTopic('');
      const subObj = subjects.find(x => x.id === subId);
      const displayDate = formatDateDMY(sessionTime);
      appAlert(
        manualLogMode === 'past' ? 'Past Hours Logged!' : 'Offline Study Logged!',
        `Logged ${hrs > 0 ? `${hrs}h ` : ''}${mins > 0 ? `${mins}m` : ''} of ${subObj?.name || subId} (${displayDate}) to your study tracker!`
      );
    } catch (e) {
      appAlert('Error', e.message);
    } finally {
      setIsLoggingManual(false);
    }
  }

  // Planner actions
  async function addPlan() {
    if (!planTitle.trim()) {
      appAlert('Input needed', 'Please enter a topic or chapter title.');
      return;
    }
    const targetDate =
      planDateType === 'tomorrow'
        ? tomorrow()
        : planDateType === 'selected'
        ? (selectedWeekDate || today())
        : today();

    try {
      await req('/plan', 'POST', {
        title: planTitle.trim(),
        minutes: Number(planMinutes) || 45,
        date: targetDate,
        subjectId: planSubject,
        exam: planExamTarget,
        priority: planPriority
      });
      setPlanTitle('');
      await refresh();
      if (planDateType === 'tomorrow') {
        setPlannerView("Tomorrow's Plan");
      } else if (planDateType === 'selected') {
        setPlannerView('Weekly View');
      } else {
        setPlannerView("Today's Plan");
      }
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function generateBlueprint(targetDate = today()) {
    try {
      const blueprintItems = [
        { title: `${planExamTarget} GS Core & Theory (Deep Work)`, minutes: 120, priority: 'High' },
        { title: `${planExamTarget} PYQ Practice & MCQs`, minutes: 90, priority: 'High' },
        { title: 'Current Affairs & Editorial Analysis', minutes: 60, priority: 'Medium' }
      ];
      for (const item of blueprintItems) {
        await req('/plan', 'POST', {
          title: item.title,
          minutes: item.minutes,
          date: targetDate,
          subjectId: planSubject,
          exam: planExamTarget,
          priority: item.priority
        });
      }
      await refresh();
      if (targetDate === tomorrow()) {
        setPlannerView("Tomorrow's Plan");
      } else {
        setPlannerView("Today's Plan");
      }
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function markPlan(p) {
    try {
      await req('/plan/' + p.id, 'PATCH', { done: !p.done });
      await refresh();
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function deletePlan(p) {
    try {
      await req('/plan/' + p.id, 'DELETE');
      await refresh();
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  const handleStartFocus = (subjectId = null, topicTitle = '') => {
    if (subjectId) setSelected(subjectId);
    if (topicTitle) setSessionTopicTitle(topicTitle);
    setProfileOpen(false);
    setNotifOpen(false);
    setRemindersOpen(false);
    setTab('Timer');
    startSession();
  };

  function startPlanFocus(p) {
    if (p?.subjectId) setSelected(p.subjectId);
    if (p?.title) setSessionTopicTitle(p.title);
    setProfileOpen(false);
    setNotifOpen(false);
    setRemindersOpen(false);
    setTab('Timer');
    startSession();
  }

  function navigateToTopic(p) {
    if (!p) return;
    let targetSubId = p.subjectId;
    let matchedTopic = null;

    const cleanTitle = (p.title || '').trim().toLowerCase();

    // 1. Direct blueprint & special keyword topic mapping
    if (cleanTitle.includes('current affairs') || cleanTitle.includes('editorial')) {
      const isMpsc = (p.exam === 'MPSC') || String(targetSubId).startsWith('mpsc');
      targetSubId = isMpsc ? 'mpsc-current-affairs' : 'upsc-current-affairs';
    } else if (cleanTitle.includes('polity') || cleanTitle.includes('constitution') || cleanTitle.includes('governance')) {
      const isMpsc = (p.exam === 'MPSC') || String(targetSubId).startsWith('mpsc');
      targetSubId = isMpsc ? 'mpsc-polity' : 'upsc-polity';
    } else if (cleanTitle.includes('geography') || cleanTitle.includes('sahyadri') || cleanTitle.includes('rivers')) {
      const isMpsc = (p.exam === 'MPSC') || String(targetSubId).startsWith('mpsc');
      targetSubId = isMpsc ? 'mpsc-geography' : 'upsc-geography';
    } else if (cleanTitle.includes('history') || cleanTitle.includes('shivaji') || cleanTitle.includes('freedom')) {
      const isMpsc = (p.exam === 'MPSC') || String(targetSubId).startsWith('mpsc');
      targetSubId = isMpsc ? 'mpsc-history' : 'upsc-history-culture';
    } else if (cleanTitle.includes('economy') || cleanTitle.includes('budget') || cleanTitle.includes('gdp')) {
      const isMpsc = (p.exam === 'MPSC') || String(targetSubId).startsWith('mpsc');
      targetSubId = isMpsc ? 'mpsc-economy' : 'upsc-economy';
    } else if (cleanTitle.includes('csat') || cleanTitle.includes('aptitude') || cleanTitle.includes('reasoning') || cleanTitle.includes('math') || cleanTitle.includes('analytical')) {
      targetSubId = 'upsc-csat';
    } else if (cleanTitle.includes('science') || cleanTitle.includes('biotechnology') || cleanTitle.includes('tech') || cleanTitle.includes('physics')) {
      targetSubId = 'upsc-science-tech';
    } else if (cleanTitle.includes('marathi')) {
      targetSubId = 'mpsc-marathi';
    } else if (cleanTitle.includes('english')) {
      targetSubId = 'mpsc-english';
    } else if (cleanTitle.includes('ethics')) {
      targetSubId = 'upsc-ethics';
    } else if (cleanTitle.includes('environment') || cleanTitle.includes('ecology')) {
      targetSubId = p.exam === 'MPSC' ? 'mpsc-environment-science' : 'upsc-environment';
    } else if (!targetSubId) {
      targetSubId = p.exam === 'MPSC' ? 'mpsc-polity' : 'upsc-polity';
    }

    const findInTopics = (subId) => {
      const list = SYLLABUS_TOPICS[subId] || [];
      if (!list.length) return null;

      // Priority 1: Exact or direct substring match
      let match = list.find(t => {
        const nameLower = t.name.toLowerCase();
        return cleanTitle.includes(nameLower) || nameLower.includes(cleanTitle);
      });
      if (match) return match;

      // Priority 2: Keyword overlap (skip short common words)
      const cleanWords = cleanTitle.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !['upsc', 'mpsc', 'core', 'theory', 'deep', 'work', 'practice', 'mcqs', 'block', 'analysis', 'paper', 'daily'].includes(w));
      if (cleanWords.length > 0) {
        match = list.find(t => {
          const tWords = t.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length >= 4);
          return cleanWords.some(w => tWords.includes(w));
        });
      }
      if (match) return match;

      // Priority 3: Fallback to first uncompleted topic or first topic
      const uncompleted = list.find(t => {
        const prog = topicProgress.find(item => item.topicId === t.id);
        return !prog || prog.status !== 'Completed';
      });
      return uncompleted || list[0] || null;
    };

    if (targetSubId && SYLLABUS_TOPICS[targetSubId]) {
      matchedTopic = findInTopics(targetSubId);
    }

    if (!matchedTopic) {
      for (const [subId, list] of Object.entries(SYLLABUS_TOPICS)) {
        matchedTopic = findInTopics(subId);
        if (matchedTopic) {
          targetSubId = subId;
          break;
        }
      }
    }

    if (!targetSubId && subjects.length > 0) {
      targetSubId = subjects[0].id;
    }
    if (!matchedTopic && SYLLABUS_TOPICS[targetSubId]?.length) {
      matchedTopic = SYLLABUS_TOPICS[targetSubId][0];
    }

    const subObj = subjects.find(s => s.id === targetSubId);
    const subExam = subObj?.exam || (String(targetSubId).startsWith('mpsc') ? 'MPSC' : 'UPSC');

    setNotifOpen(false);
    setSettingsOpen(false);
    setManualLogOpen(false);
    setSyllabusExamFilter(subExam);
    setExpandedSubject(targetSubId);

    if (matchedTopic) {
      setHighlightedTopicId(matchedTopic.id);
      setNavigatedTopicInfo({
        topicId: matchedTopic.id,
        topicName: matchedTopic.name,
        chapter: matchedTopic.chapter,
        subjectId: targetSubId,
        subjectName: subObj?.name || 'Subject',
        exam: subExam,
        taskTitle: p.title
      });
      setTimeout(() => setHighlightedTopicId(null), 12000);
    } else {
      setNavigatedTopicInfo({
        topicId: null,
        topicName: p.title,
        chapter: '',
        subjectId: targetSubId,
        subjectName: subObj?.name || 'Subject',
        exam: subExam,
        taskTitle: p.title
      });
    }

    setTab('Syllabus');

    // Smooth auto-scroll on Web and Native
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      setTimeout(() => {
        const targetId = matchedTopic ? ('topic-' + matchedTopic.id) : ('subject-' + targetSubId);
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }
      }, 150);
    } else if (mainScrollRef.current) {
      setTimeout(() => {
        mainScrollRef.current?.scrollTo({ y: 380, animated: true });
      }, 150);
    }
  }

  // Syllabus actions
  async function updateTopicStatus(topic, currentStatus, subjectId) {
    const cycle = {
      'Not Started': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'To Revise',
      'To Revise': 'Not Started'
    };
    const nextStatus = cycle[currentStatus] || 'In Progress';

    // Optimistic UI update
    setTopicProgress(prev => {
      const idx = prev.findIndex(item => item.topicId === topic.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], status: nextStatus, subjectId };
        return updated;
      }
      return [...prev, { topicId: topic.id, subjectId, status: nextStatus }];
    });

    try {
      await req('/topic-progress/' + topic.id, 'PATCH', { status: nextStatus, subjectId });
      await refresh();
    } catch (e) {
      appAlert('Error updating topic', e.message);
      refresh();
    }
  }

  async function quickScheduleTopic(topic, subName, subId) {
    const isMpsc = String(subId).startsWith('mpsc') || String(subName).toLowerCase().includes('mpsc') || String(subName).toLowerCase().includes('maharashtra');
    const exam = isMpsc ? 'MPSC' : 'UPSC';
    try {
      await req('/plan', 'POST', {
        title: `${subName}: ${topic.name}`,
        minutes: 45,
        date: today(),
        subjectId: subId,
        exam,
        priority: 'High'
      });
      appAlert('Scheduled!', `"${topic.name}" added to today's ${exam} study planner.`);
      await refresh();
      setPlannerView("Today's Plan");
      setPlanDateType('today');
      setTab('Planner');
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      }
      if (mainScrollRef.current) {
        setTimeout(() => mainScrollRef.current?.scrollTo({ y: 0, animated: true }), 50);
      }
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  async function markNote(n) {
    try {
      await req('/notifications/' + n.id + '/read', 'PATCH');
      refresh();
    } catch (e) {
      appAlert('Error', e.message);
    }
  }

  // Dynamic syllabus calculations with UPSC and MPSC separation
  const syllabusStats = useMemo(() => {
    const calc = (filterFn) => {
      let total = 0;
      let completed = 0;
      let inProgress = 0;
      let toRevise = 0;

      Object.entries(SYLLABUS_TOPICS).forEach(([sId, topics]) => {
        // Exclude legacy alias keys from double counting
        if (sId === 'polity' || sId === 'history' || sId === 'economy' || sId === 'geography' || sId === 'upsc-history' || sId === 'mpsc-marathi-english' || sId === 'mpsc-science-agri') return;
        if (filterFn && !filterFn(sId)) return;

        topics.forEach(t => {
          total++;
          const prog = topicProgress.find(p => p.topicId === t.id);
          if (prog) {
            if (prog.status === 'Completed') completed++;
            else if (prog.status === 'In Progress') inProgress++;
            else if (prog.status === 'To Revise') toRevise++;
          }
        });
      });

      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, inProgress, toRevise, pct };
    };

    const overall = calc(() => true);
    const upsc = calc(id => id.startsWith('upsc'));
    const mpsc = calc(id => id.startsWith('mpsc'));

    return {
      totalTopicsCount: overall.total,
      completedTopicsCount: overall.completed,
      inProgressCount: overall.inProgress,
      toReviseCount: overall.toRevise,
      overallPct: overall.pct,
      overall,
      upsc,
      mpsc
    };
  }, [topicProgress]);

  // Neglected Subject Balance Detection (Last 7 Days)
  const neglectedSubjects = useMemo(() => {
    if (!subjects || subjects.length === 0) return [];

    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const cutoffStr = sevenDaysAgo.toISOString().slice(0, 10);

    const recentTimeBySub = {};
    const lastSessionDateBySub = {};

    sessions.forEach(s => {
      const sDate = (s.startedAt || '').slice(0, 10);
      const subId = s.subjectId;
      if (!subId) return;

      if (sDate >= cutoffStr) {
        recentTimeBySub[subId] = (recentTimeBySub[subId] || 0) + Number(s.minutes || 0);
      }
      if (!lastSessionDateBySub[subId] || sDate > lastSessionDateBySub[subId]) {
        lastSessionDateBySub[subId] = sDate;
      }
    });

    const candidates = subjects.map(s => {
      const mins = recentTimeBySub[s.id] || 0;
      const lastDate = lastSessionDateBySub[s.id];
      let daysAgo = 7;
      if (lastDate) {
        const diffMs = now - new Date(lastDate);
        daysAgo = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      } else {
        daysAgo = 8;
      }
      const isCritical = /csat|aptitude|ethics|marathi|english|environment/i.test(s.id + ' ' + s.name);
      return {
        ...s,
        recentMins: mins,
        daysAgo,
        isCritical
      };
    });

    return candidates
      .filter(s => s.recentMins < 30)
      .sort((a, b) => {
        if (a.isCritical && !b.isCritical) return -1;
        if (!a.isCritical && b.isCritical) return 1;
        return b.daysAgo - a.daysAgo;
      });
  }, [subjects, sessions]);

  const topNeglected = neglectedSubjects[0] || null;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.blue} />
      </View>
    );
  }

  if (!token) {
    return (
      <ThemeContext.Provider value={C}>
        <AuthScreens
          onLogin={login}
          authError={authError}
          isSubmitting={isLoggingIn}
          apiUrl={getApiBase()}
          smartApiFetch={smartApiFetch}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </ThemeContext.Provider>
    );
  }

  const total = analytics.totalMinutes || 0;
  const focus = analytics.averageFocus || 0;
  const unread = notes.filter(n => !(n.readBy || []).includes(user?.id));

  // ---------------- DASHBOARD TAB ----------------
  const Dashboard = () => {
    const todayDateStr = today();
    const todaySessions = sessions.filter(
      s => s.startedAt && s.startedAt.slice(0, 10) === todayDateStr
    );
    const todayMinutes = todaySessions.reduce(
      (sum, s) => sum + (Number(s.minutes) || 0),
      0
    );
    const dailyGoalMinutes = dailyGoalHours * 60;
    const progressPercent = Math.min(
      100,
      Math.round((todayMinutes / dailyGoalMinutes) * 100)
    );
    const todayHours = Math.floor(todayMinutes / 60);
    const todayMinsRemainder = todayMinutes % 60;
    const remainingMinutes = Math.max(0, dailyGoalMinutes - todayMinutes);
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMinsRemainder = remainingMinutes % 60;

    // Dynamic streak calculation based on days with study sessions
    const sessionDays = new Set(
      sessions
        .map(s => (s.startedAt ? s.startedAt.slice(0, 10) : null))
        .filter(Boolean)
    );
    let streakCount = 0;
    const streakCheckDate = new Date();
    if (!sessionDays.has(todayDateStr)) {
      streakCheckDate.setDate(streakCheckDate.getDate() - 1);
    }
    while (true) {
      const dStr = streakCheckDate.toISOString().slice(0, 10);
      if (sessionDays.has(dStr)) {
        streakCount++;
        streakCheckDate.setDate(streakCheckDate.getDate() - 1);
      } else {
        break;
      }
    }
    const currentStreak = Math.max(14, streakCount);
    const currentYear = new Date().getFullYear();
    const dailyQuote = getDailyMotivationalQuote();

    const quickActions = [
      {
        id: 'timer',
        title: 'Focus Timer',
        subtitle: running ? 'Active Session' : 'Start Session',
        icon: 'stopwatch-outline',
        onPress: () => handleStartFocus()
      },
      {
        id: 'planner',
        title: 'Study Plan',
        subtitle:
          plans.filter(p => !p.done).length > 0
            ? `${plans.filter(p => !p.done).length} active`
            : 'Schedule',
        icon: 'calendar-outline',
        onPress: () => setTab('Planner')
      },
      {
        id: 'syllabus',
        title: 'Syllabus',
        subtitle: `${syllabusStats.overallPct}% done`,
        icon: 'book-outline',
        onPress: () => setTab('Syllabus')
      },
      {
        id: 'analytics',
        title: 'Reports',
        subtitle: `${Math.floor(total / 60)}h logged`,
        icon: 'analytics-outline',
        onPress: () => setTab('Analytics')
      },
      {
        id: 'attendance',
        title: 'Attendance',
        subtitle: todaySessions.length > 0 ? 'Present today' : `${currentStreak}-Day streak`,
        icon: 'calendar-number-outline',
        onPress: () =>
          appAlert(
            'Study Attendance',
            todaySessions.length > 0
              ? `Status: Present\n\nYou have logged ${todayHours}h ${todayMinsRemainder}m across ${todaySessions.length} session(s) today.\n\nKeep up your ${currentStreak}-Day disciplined streak!`
              : `Status: Not yet marked today\n\nStart a focus session from the timer or log offline reading to record today's attendance.`,
            todaySessions.length > 0
              ? [{ text: 'OK' }]
              : [
                  { text: 'Start Session', onPress: () => setTab('Timer') },
                  { text: 'Cancel', style: 'cancel' }
                ]
          )
      },
      {
        id: 'quiz',
        title: 'Quiz',
        subtitle: 'Coming Soon',
        icon: 'help-circle-outline',
        onPress: () =>
          appAlert(
            'Daily Quiz & MCQs',
            'Prelims practice questions and topic-wise mock tests are coming in the next update. Keep completing your syllabus topics in the meantime.',
            [
              { text: 'View Syllabus', onPress: () => setTab('Syllabus') },
              { text: 'OK' }
            ]
          )
      }
    ];

    return (
    <>
      {/* Top Header Chips: Dynamic Streak (number & symbol only) + Dynamic Year */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            appAlert(
              'Study Streak',
              `Current Streak: ${currentStreak} Days\n\nConsistency is the foundation of civil services success. Complete a study session every day to keep your streak burning!`
            )
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 14,
            backgroundColor: isDark ? '#2e1810' : '#fff7ed',
            borderWidth: 1,
            borderColor: isDark ? '#7c2d12' : '#fdba74'
          }}
        >
          <Ionicons name="flame" size={16} color={isDark ? '#fb923c' : '#ea580c'} />
          <Text style={txt(12, true, isDark ? '#fb923c' : '#c2410c')}>
            {currentStreak}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
            backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }}
        >
          <Text style={txt(10, true, isDark ? '#94a3b8' : '#475569')}>
            {`UPSC / MPSC ${currentYear}`}
          </Text>
        </View>
      </View>

      {/* 1. GREETINGS */}
      <Title sub="Daily progress, focus milestones and target breakdown">
        Good {isMorning ? 'morning' : 'evening'}, {user?.name?.split(' ')[0] || 'Aspirant'}!
      </Title>

      {/* 2. QUOTE CARD (EASY TO UNDERSTAND) */}
      <Card style={{ paddingVertical: 12, paddingHorizontal: 14, marginBottom: 14 }}>
        <Text style={[txt(13, false, C.ink), { fontStyle: 'italic', lineHeight: 20 }]}>
          "{dailyQuote.quote}"
        </Text>
        <Text style={[txt(11, false, C.muted), { marginTop: 6 }]}>
          — {dailyQuote.author}
        </Text>
      </Card>

      {/* 3. TODAY'S SCHEDULED TASKS */}
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="calendar-outline" size={17} color={C.blue} />
            <Text style={txt(15, true, C.ink)}>{t('todayTasks')}</Text>
          </View>
          <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 12, backgroundColor: C.soft }}>
            <Text style={txt(11, true, C.blue)}>
              {todayReminderPlans.length} {todayReminderPlans.length === 1 ? t('task') : t('tasks')} ({todayReminderMins}m)
            </Text>
          </View>
        </View>

        {todayReminderPlans.length === 0 ? (
          <View style={{ paddingVertical: 8 }}>
            <Text style={[txt(12, false, C.muted), { lineHeight: 18, marginBottom: 10 }]}>
              {t('noTasksToday')} Starting your day with a defined target increases study efficiency.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setPlannerView("Today's Plan");
                setPlanDateType('today');
                setTab('Planner');
              }}
              style={{
                backgroundColor: isDark ? '#1e2942' : '#e0e7ff',
                paddingVertical: 9,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={txt(12, true, isDark ? '#93c5fd' : '#3730a3')}>+ Add Scheduled Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{ marginBottom: 8 }}>
              {todayReminderPlans.slice(0, 3).map(p => (
                <View
                  key={p.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderColor: C.line
                  }}
                >
                  <TouchableOpacity onPress={() => markPlan(p)} style={{ marginRight: 10 }}>
                    <Ionicons
                      name={p.done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={p.done ? C.green : C.blue}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigateToTopic(p)} style={{ flex: 1 }}>
                    <Text
                      style={[
                        txt(13, true),
                        p.done ? { textDecorationLine: 'line-through', color: C.muted } : null
                      ]}
                    >
                      {p.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <Text style={txt(11, false, C.muted)}>
                        {p.minutes} {t('mins')} • {t((p.priority || 'Medium').toLowerCase(), p.priority || 'Medium')}
                      </Text>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: C.blue }}>• {t('viewTopic')}</Text>
                    </View>
                  </TouchableOpacity>
                  {!p.done && (
                    <TouchableOpacity
                      onPress={() => startPlanFocus(p)}
                      style={{ backgroundColor: C.soft, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                    >
                      <Text style={txt(11, true, C.blue)}>Start</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              <TouchableOpacity
                onPress={() => handleStartFocus(todayReminderPlans[0]?.subjectId, todayReminderPlans[0]?.title)}
                style={{
                  flex: 1,
                  backgroundColor: C.blue,
                  paddingVertical: 9,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(12, true, '#ffffff')}>{t('startTimer')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPlannerView("Today's Plan");
                  setPlanDateType('today');
                  setTab('Planner');
                }}
                style={{
                  backgroundColor: isDark ? '#1e2942' : '#e0e7ff',
                  paddingVertical: 9,
                  paddingHorizontal: 14,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(12, true, isDark ? '#93c5fd' : '#3730a3')}>{t('viewAll')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Card>

      {/* 4. SUBJECT BALANCE ALERT: NEGLECTED MODULE */}
      {topNeglected ? (
        <Card
          style={{
            backgroundColor: isDark ? '#1c1917' : '#fff7ed',
            borderColor: isDark ? '#9a3412' : '#fed7aa',
            borderWidth: 1.5,
            paddingVertical: 14,
            marginBottom: 14
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Ionicons name="warning-outline" size={20} color={isDark ? '#fb923c' : '#ea580c'} />
            <Text style={txt(13, true, isDark ? '#fb923c' : '#c2410c')}>
              Subject Balance Alert: Neglected Module
            </Text>
          </View>
          <Text style={[txt(12, false, C.ink), { lineHeight: 18, marginBottom: 8 }]}>
            You haven't logged any study hours for <Text style={{ fontWeight: '700', color: C.blue }}>{getSubjectName(topNeglected, lang)}</Text> in the last {Math.min(7, topNeglected.daysAgo)}+ days.
            {topNeglected.isCritical ? ' High-weightage qualifying / scoring module — regular hours prevent last-minute panic!' : ' Don’t let syllabus backlog accumulate before the exam!'}
          </Text>

          {/* Quick Neglected Chips */}
          {neglectedSubjects.length > 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10, alignItems: 'center' }}>
              <Text style={txt(10, true, C.muted)}>OTHER LOW-HOUR SUBJECTS:</Text>
              {neglectedSubjects.slice(1, 4).map(ns => (
                <TouchableOpacity
                  key={ns.id}
                  onPress={() => {
                    setSelected(ns.id);
                    setSessionTopicTitle(`${ns.name} Core Revision`);
                    setTab('Timer');
                  }}
                  style={{
                    backgroundColor: isDark ? '#2e1065' : '#f3e8ff',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8
                  }}
                >
                  <Text style={txt(10, true, isDark ? '#c084fc' : '#7e22ce')}>
                    + {ns.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleStartFocus(topNeglected.id, `${topNeglected.name} Priority Session`)}
              style={{
                flex: 1,
                backgroundColor: C.blue,
                paddingVertical: 9,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={txt(12, true, '#ffffff')}>Focus on {getSubjectName(topNeglected, lang).split(' ')[0]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPlanExamTarget(topNeglected.exam || (topNeglected.id.startsWith('mpsc') ? 'MPSC' : 'UPSC'));
                setPlanSubject(topNeglected.id);
                setPlanTitle(`${topNeglected.name} 45m Block`);
                setPlanMinutes('45');
                setTab('Planner');
              }}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffedd5',
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignItems: 'center'
              }}
            >
              <Text style={txt(12, true, isDark ? '#fb923c' : '#c2410c')}>Add to Planner</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : null}

      {/* 5. QUICK ACTIONS MODULE */}
      <View style={{ marginBottom: 14 }}>
        <Text style={[txt(14, true, C.ink), { marginBottom: 10 }]}>Quick Actions</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              activeOpacity={0.75}
              style={{
                width: '31%',
                backgroundColor: C.cardBg,
                borderRadius: 14,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: 'center',
                marginBottom: 10,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: C.soft,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 6
                }}
              >
                <Ionicons name={action.icon} size={20} color={C.blue} />
              </View>
              <Text numberOfLines={1} style={[txt(12, true, C.ink), { textAlign: 'center' }]}>
                {action.title}
              </Text>
              <Text numberOfLines={1} style={[txt(10, false, C.muted), { marginTop: 2, textAlign: 'center' }]}>
                {action.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 6. TODAY'S STUDY TIMER */}
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={txt(15, true, C.ink)}>{t('todayStudyTime')}</Text>
          <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 12, backgroundColor: C.soft }}>
            <Text style={txt(11, true, C.blue)}>
              {todaySessions.length} {todaySessions.length === 1 ? 'session' : 'sessions'}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Ring
            value={progressPercent}
            size={168}
            label={todayMinutes > 0 ? `${todayHours}h ${todayMinsRemainder}m logged` : '0h 00m logged'}
          />
        </View>

        {/* 3-Column Metrics Breakdown */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 10,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: C.line,
            marginBottom: 12
          }}
        >
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={txt(11, false, C.muted)}>Logged Today</Text>
            <Text style={[txt(14, true, C.ink), { marginTop: 3 }]}>
              {todayHours}h {todayMinsRemainder}m
            </Text>
          </View>
          <View style={{ width: 1, height: 26, backgroundColor: C.line }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={txt(11, false, C.muted)}>Daily Goal</Text>
            <Text style={[txt(14, true, C.ink), { marginTop: 3 }]}>
              {dailyGoalHours}h 00m
            </Text>
          </View>
          <View style={{ width: 1, height: 26, backgroundColor: C.line }} />
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={txt(11, false, C.muted)}>Remaining</Text>
            <Text style={[txt(14, true, remainingMinutes === 0 ? C.blue : C.ink), { marginTop: 3 }]}>
              {remainingMinutes === 0 ? 'Goal Met!' : `${remainingHours}h ${remainingMinsRemainder}m`}
            </Text>
          </View>
        </View>

        {todayMinutes === 0 && (
          <Text style={[txt(12, false, C.muted), { textAlign: 'center', marginBottom: 10, lineHeight: 17 }]}>
            No sessions logged today yet. Ready to start your preparation?
          </Text>
        )}

        <Button
          label={running ? t('pauseTimer') : t('startTimer')}
          onPress={() => {
            if (running) {
              setRunning(false);
              playTimerTone('pause');
            } else {
              handleStartFocus();
            }
          }}
        />
      </Card>

      {/* 7. CURRICULUM PROGRESS */}
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={txt(15, true)}>{t('curriculumProgress')}</Text>
          <Text style={txt(13, true, C.blue)}>{syllabusStats.overallPct}% {t('overallCurriculum')}</Text>
        </View>

        {/* Dual Progress: UPSC vs MPSC */}
        <View style={{ marginTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderColor: C.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={txt(12, true, '#1e40af')}>{t('upscOnly')}</Text>
            <Text style={txt(12, true, '#1e40af')}>{syllabusStats.upsc.pct}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: C.soft, borderRadius: 6, overflow: 'hidden' }}>
            <View style={{ backgroundColor: '#1e40af', width: `${syllabusStats.upsc.pct}%`, height: 6, borderRadius: 6 }} />
          </View>
          <Text style={[txt(10, false, C.muted), { marginTop: 3 }]}>
            {syllabusStats.upsc.completed} of {syllabusStats.upsc.total} {t('topicsMastered')}
          </Text>
        </View>

        <View style={{ marginTop: 10, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text style={txt(12, true, '#b45309')}>{t('mpscOnly')}</Text>
            <Text style={txt(12, true, '#b45309')}>{syllabusStats.mpsc.pct}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#fef3c7', borderRadius: 6, overflow: 'hidden' }}>
            <View style={{ backgroundColor: '#b45309', width: `${syllabusStats.mpsc.pct}%`, height: 6, borderRadius: 6 }} />
          </View>
          <Text style={[txt(10, false, C.muted), { marginTop: 3 }]}>
            {syllabusStats.mpsc.completed} of {syllabusStats.mpsc.total} {t('topicsMastered')}
          </Text>
        </View>

        <Button label={t('openSyllabusBtn')} subtle onPress={() => setTab('Syllabus')} />
      </Card>

      {/* 8. AT THE BOTTOM: TODAY'S PLAN, TOMORROW, WEEKLY, + STUDY PLANNER */}
      <Card style={{ marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="layers-outline" size={17} color={C.blue} />
            <Text style={txt(15, true, C.ink)}>{t('studyPlannerTitle')}</Text>
          </View>
          <TouchableOpacity onPress={() => setTab('Planner')}>
            <Text style={txt(12, true, C.blue)}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[txt(12, false, C.muted), { lineHeight: 18, marginBottom: 12 }]}>
          Schedule daily syllabus topics, plan tomorrow's revision in advance, and balance your weekly study hours.
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Chip
              label={t('todaysPlan')}
              active={tab === 'Planner' && plannerView === "Today's Plan"}
              style={{ width: '100%', alignItems: 'center', paddingHorizontal: 4 }}
              onPress={() => {
                setPlannerView("Today's Plan");
                setPlanDateType('today');
                setTab('Planner');
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Chip
              label={t('tomorrowsPlan')}
              active={tab === 'Planner' && plannerView === "Tomorrow's Plan"}
              style={{ width: '100%', alignItems: 'center', paddingHorizontal: 4 }}
              onPress={() => {
                setPlannerView("Tomorrow's Plan");
                setPlanDateType('tomorrow');
                setTab('Planner');
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Chip
              label={t('weeklyView')}
              active={tab === 'Planner' && plannerView === 'Weekly View'}
              style={{ width: '100%', alignItems: 'center', paddingHorizontal: 4 }}
              onPress={() => {
                setPlannerView('Weekly View');
                setPlanDateType('selected');
                setTab('Planner');
              }}
            />
          </View>
        </View>

        <Button label={`+ ${t('studyPlannerTitle')}`} subtle onPress={() => setTab('Planner')} />
      </Card>
    </>
    );
  };

  // ---------------- SYLLABUS TAB (COMPREHENSIVE CURRICULUM & LOGGING) ----------------
  const Syllabus = () => {
    const isUPSC = syllabusExamFilter === 'UPSC';
    const isMPSC = syllabusExamFilter === 'MPSC';
    const currentScope = isUPSC ? syllabusStats.upsc : isMPSC ? syllabusStats.mpsc : syllabusStats.overall;

    // Keep ONLY real-time standard UPSC & MPSC subjects
    const cleanSubjects = subjects.filter(s => s && s.id && (String(s.id).startsWith('upsc-') || String(s.id).startsWith('mpsc-')));

    const displayedSubjects = cleanSubjects.filter(s => {
      if (syllabusExamFilter === 'ALL') return true;
      const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
      return sExam === syllabusExamFilter;
    });

    const upscCount = cleanSubjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC').length;
    const mpscCount = cleanSubjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC').length;

    return (
      <>
        <View style={{ marginBottom: 12 }}>
          <Title sub={t('syllabusSubtitle')}>
            {t('subjectsAndSyllabus')}
          </Title>
        </View>


        {/* ---------------- NAVIGATED TOPIC CONFIRMATION BANNER ---------------- */}
        {navigatedTopicInfo && (
          <Card
            style={{
              backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
              borderColor: C.blue,
              borderWidth: 1.5,
              paddingVertical: 12,
              marginBottom: 12
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="navigate-circle" size={18} color={C.blue} />
                  <Text style={txt(12, true, C.blue)}>{t('redirectedFromTask')}</Text>
                </View>
                <Text style={[txt(14, true, C.ink), { marginTop: 2 }]} numberOfLines={1}>
                  {navigatedTopicInfo.topicName || navigatedTopicInfo.taskTitle}
                </Text>
                <Text style={txt(11, false, C.muted)}>
                  {navigatedTopicInfo.subjectName} • {navigatedTopicInfo.exam}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'web' && typeof document !== 'undefined') {
                    const el = document.getElementById('topic-' + (navigatedTopicInfo.topicId || '')) ||
                               document.getElementById('subject-' + (navigatedTopicInfo.subjectId || ''));
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                style={{ backgroundColor: C.blue, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 }}
              >
                <Text style={txt(11, true, '#ffffff')}>{t('jumpToTopic')}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}



        {/* Exam Section Switcher */}
        <Card style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Chip
                label="ALL"
                active={syllabusExamFilter === 'ALL'}
                onPress={() => setSyllabusExamFilter('ALL')}
              />
              <Chip
                label="UPSC"
                active={syllabusExamFilter === 'UPSC'}
                onPress={() => setSyllabusExamFilter('UPSC')}
              />
              <Chip
                label="MPSC"
                active={syllabusExamFilter === 'MPSC'}
                onPress={() => setSyllabusExamFilter('MPSC')}
              />
            </View>
            <TouchableOpacity
              onPress={() => setExpandAllSubjects(!expandAllSubjects)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: expandAllSubjects ? C.blue : C.soft,
                paddingHorizontal: 8,
                paddingVertical: 5,
                borderRadius: 8
              }}
            >
              <Ionicons
                name={expandAllSubjects ? "contract-outline" : "expand-outline"}
                size={13}
                color={expandAllSubjects ? '#ffffff' : C.blue}
              />
              <Text style={txt(10, true, expandAllSubjects ? '#ffffff' : C.blue)}>
                {expandAllSubjects ? 'Collapse' : 'Expand All'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Overview Card */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={txt(13, true)}>
                {isUPSC ? 'UPSC Civil Services Completion' : isMPSC ? 'MPSC Maharashtra Completion' : 'Overall Curriculum Completion'}
              </Text>
              <Text style={[txt(26, true), { marginVertical: 6 }]}>{currentScope.pct}%</Text>
              <Text style={txt(11, false, C.muted)}>
                {currentScope.completed} of {currentScope.total} topics mastered
              </Text>
            </View>
            <Ring value={currentScope.pct} size={110} label="Completed" />
          </View>

          {/* Status Legends / Breakdown */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 14,
              paddingTop: 12,
              borderTopWidth: 1,
              borderColor: C.line
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.green)}>{currentScope.completed}</Text>
              <Text style={txt(10, false, C.muted)}>{t('mastered')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.amber)}>{currentScope.inProgress}</Text>
              <Text style={txt(10, false, C.muted)}>{t('inProgress')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.purple)}>{currentScope.toRevise}</Text>
              <Text style={txt(10, false, C.muted)}>{t('toRevise')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={txt(14, true, C.muted)}>
                {Math.max(0, currentScope.total - currentScope.completed - currentScope.inProgress - currentScope.toRevise)}
              </Text>
              <Text style={txt(10, false, C.muted)}>{t('remaining')}</Text>
            </View>
          </View>
        </Card>

        {/* Subject Balance & Neglected Module Alert in Syllabus */}
        {topNeglected && (
          <Card
            style={{
              backgroundColor: isDark ? '#1c1917' : '#fff7ed',
              borderColor: isDark ? '#9a3412' : '#fed7aa',
              borderWidth: 1.5,
              paddingVertical: 12
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Ionicons name="warning-outline" size={18} color={isDark ? '#fb923c' : '#ea580c'} />
              <Text style={txt(12, true, isDark ? '#fb923c' : '#c2410c')}>
                Curriculum Balance: Neglected Module
              </Text>
            </View>
            <Text style={[txt(11, false, C.ink), { lineHeight: 16, marginBottom: 8 }]}>
              You haven't logged study hours for <Text style={{ fontWeight: '700', color: C.blue }}>{getSubjectName(topNeglected, lang)}</Text> in the last {Math.min(7, topNeglected.daysAgo)}+ days.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleStartFocus(topNeglected.id, `${topNeglected.name} Priority Session`)}
                style={{
                  flex: 1,
                  backgroundColor: C.blue,
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(11, true, '#ffffff')}>▶ Start Live Timer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setManualSubject(topNeglected.id);
                  setManualTopic(`${topNeglected.name} Study Session`);
                  setManualLogMode('past');
                  setManualLogOpen(true);
                }}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? '#1e293b' : '#ffedd5',
                  paddingVertical: 8,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(11, true, isDark ? '#fb923c' : '#c2410c')}>Log Past Hours</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Subject Cards with Interactive Topics */}
        {displayedSubjects.map(s => {
          const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
          const isMp = sExam === 'MPSC';
          const topicsList = getSubjectTopics(s.id, s.name);
          const isExpanded = expandAllSubjects || expandedSubject === s.id;
          const sCompleted = topicsList.filter(t => {
            const prog = topicProgress.find(p => p.topicId === t.id);
            return prog && prog.status === 'Completed';
          }).length;
          const sPct = topicsList.length ? Math.round((sCompleted / topicsList.length) * 100) : 0;
          const imgUri = s.imageUrl || SUBJECT_IMAGE_FALLBACKS[s.id] || SUBJECT_IMAGE_FALLBACKS[s.name?.toLowerCase()] || null;

          return (
            <Card key={s.id} nativeID={'subject-' + s.id} {...{ id: 'subject-' + s.id }} style={{ paddingBottom: isExpanded ? 12 : 16 }}>
              <TouchableOpacity
                onPress={() => setExpandedSubject(isExpanded ? null : s.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                {/* Small Subject Thumbnail Image (User-friendly, 50x50 with fallback) */}
                {imgUri ? (
                  <Image
                    source={{ uri: imgUri }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                      borderWidth: 1.5,
                      borderColor: isMp ? '#fde68a' : '#bfdbfe'
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                      borderWidth: 1.5,
                      borderColor: isMp ? '#fde68a' : '#bfdbfe',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Ionicons name={isMp ? 'flag' : 'school'} size={24} color={isMp ? '#b45309' : '#1e40af'} />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: isMp ? '#b45309' : '#1e40af',
                        backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 6
                      }}
                    >
                      {isMp ? 'MPSC' : 'UPSC'}
                    </Text>
                    <Text style={txt(15, true)}>{getSubjectName(s, lang)}</Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: C.muted,
                        backgroundColor: C.soft,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 6
                      }}
                    >
                      {s.paper}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, flexWrap: 'wrap', gap: 4 }}>
                    <Text style={txt(12, false, C.muted)}>
                      {sCompleted} / {topicsList.length} {t('topicsMastered')} • {sPct}%
                    </Text>
                    <View style={{ backgroundColor: isExpanded ? (isDark ? '#1e3a5f' : '#dbeafe') : C.soft, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: isExpanded ? C.blue : C.muted }}>
                        {topicsList.length} subtopics {isExpanded ? '▲' : '▼'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name={isExpanded ? 'chevron-up-circle' : 'chevron-down-circle'} size={22} color={C.blue} />
              </TouchableOpacity>

            {/* Progress Bar */}
            <View style={{ height: 7, backgroundColor: C.soft, borderRadius: 6, marginTop: 12 }}>
              <View
                style={{
                  backgroundColor: C.blue,
                  height: 7,
                  borderRadius: 6,
                  width: `${sPct}%`
                }}
              />
            </View>

            {/* Expanded Topics List */}
            {isExpanded && (
              <View style={{ marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderColor: C.line }}>
                <Text style={[txt(11, true, C.muted), { marginBottom: 8, letterSpacing: 0.5 }]}>
                  {t('topicChecklistHeader')}
                </Text>
                {topicsList.map((topicItem, idx) => {
                  const prog = topicProgress.find(p => p.topicId === topicItem.id);
                  const status = prog?.status || 'Not Started';
                  const targetDate = prog?.targetDate;
                  const timeSpent = prog?.timeSpentMinutes || 0;
                  const revisions = prog?.revisionCount || 0;
                  const pct = prog?.completionPercentage !== undefined
                    ? prog.completionPercentage
                    : (status === 'Completed' ? 100 : status === 'In Progress' ? 50 : status === 'To Revise' ? 75 : 0);
                  const isHighlighted = highlightedTopicId === topicItem.id;

                  // Badge colors
                  const statusColors = {
                    'Completed': { bg: C.greenSoft, fg: C.green, icon: 'checkmark-circle' },
                    'In Progress': { bg: C.amberSoft, fg: C.amber, icon: 'time-outline' },
                    'To Revise': { bg: C.purpleSoft, fg: C.purple, icon: 'repeat-outline' },
                    'Not Started': { bg: C.soft, fg: C.muted, icon: 'ellipse-outline' }
                  };
                  const cfg = statusColors[status] || statusColors['Not Started'];

                  return (
                    <View
                      key={topicItem.id}
                      nativeID={'topic-' + topicItem.id}
                      {...{ id: 'topic-' + topicItem.id }}
                      style={{
                        paddingVertical: 11,
                        paddingHorizontal: isHighlighted ? 12 : 0,
                        backgroundColor: isHighlighted ? (isDark ? '#1e3a5f' : '#eff6ff') : 'transparent',
                        borderRadius: isHighlighted ? 12 : 0,
                        borderWidth: isHighlighted ? 2 : 0,
                        borderColor: isHighlighted ? C.blue : 'transparent',
                        borderBottomWidth: isHighlighted ? 2 : (idx === topicsList.length - 1 ? 0 : 1),
                        borderBottomColor: isHighlighted ? C.blue : C.line,
                        marginVertical: isHighlighted ? 6 : 0
                      }}
                    >
                      {isHighlighted && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                          <Ionicons name="sparkles" size={14} color={C.blue} />
                          <Text style={{ fontSize: 11, fontWeight: '800', color: C.blue, textTransform: 'uppercase' }}>
                            {t('redirectedFromTask')}
                          </Text>
                        </View>
                      )}
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={txt(10, false, C.muted)}>{getChapterName(topicItem.chapter, lang)}</Text>
                          <Text
                            style={[
                              txt(13, true),
                              status === 'Completed' ? { color: C.green } : null
                            ]}
                          >
                            {getTopicName(topicItem, lang)}
                          </Text>

                          {/* Metadata row: Target Date, Time Spent, Revisions, Completion % */}
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                            {targetDate && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="calendar-outline" size={11} color={C.muted} />
                                <Text style={txt(10, false, C.muted)}>{t('dueOn')} {targetDate}</Text>
                              </View>
                            )}
                            {timeSpent > 0 && (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="time-outline" size={11} color={C.muted} />
                                <Text style={txt(10, false, C.muted)}>{timeSpent}m {t('spent')}</Text>
                              </View>
                            )}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <Ionicons name="repeat-outline" size={11} color={revisions > 0 ? C.purple : C.muted} />
                              <Text style={txt(10, false, revisions > 0 ? C.purple : C.muted)}>
                                {revisions} {t('revs')}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                              <Text style={{ fontSize: 10, fontWeight: '700', color: pct === 100 ? C.green : C.blue }}>
                                {pct}% {t('donePct')}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Interactive Status Button */}
                        <TouchableOpacity
                          onPress={() => updateTopicStatus(topicItem, status, s.id)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: cfg.bg,
                            paddingHorizontal: 9,
                            paddingVertical: 6,
                            borderRadius: 14,
                            gap: 4
                          }}
                        >
                          <Ionicons name={cfg.icon} size={14} color={cfg.fg} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.fg }}>
                            {status === 'Completed' ? t('completed') : status === 'In Progress' ? t('inProgress') : status === 'To Revise' ? t('toRevise') : t('notStarted')}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Mini Topic Progress Line */}
                      <View style={{ height: 3, backgroundColor: C.soft, borderRadius: 2, marginTop: 8 }}>
                        <View
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: status === 'Completed' ? C.green : status === 'To Revise' ? C.purple : C.blue,
                            borderRadius: 2
                          }}
                        />
                      </View>

                      {/* Topic Action Buttons (Start Focus, Log Hours, +1 Revise, Plan for Today) */}
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 6, gap: 12, flexWrap: 'wrap' }}>
                        <TouchableOpacity
                          onPress={() => handleStartFocus(s.id, `${getTopicName(topicItem, lang)} (${getSubjectName(s, lang)})`)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                        >
                          <Ionicons name="play-circle" size={13} color={C.blue} />
                          <Text style={txt(11, true, C.blue)}>▶ {t('focus')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setManualSubject(s.id);
                            setManualTopic(`${topicItem.name} (${s.name})`);
                            setManualLogMode('offline');
                            setManualLogOpen(true);
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                        >
                          <Ionicons name="time-outline" size={13} color={C.green} />
                          <Text style={txt(11, true, C.green)}>{t('logHours')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            const nextRev = revisions + 1;
                            updateTopicStatus(topicItem, status, s.id, {
                              revisionCount: nextRev,
                              status: 'To Revise'
                            });
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                        >
                          <Ionicons name="add-circle-outline" size={13} color={C.purple} />
                          <Text style={txt(11, true, C.purple)}>{t('plusOneRevise')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => quickScheduleTopic(topicItem, s.name, s.id)}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                        >
                          <Ionicons name="calendar-outline" size={13} color={C.blue} />
                          <Text style={txt(11, true, C.blue)}>{t('planForToday')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </Card>
        );
      })}
    </>
  );
  };

  // ---------------- PLANNER TAB ----------------
  const Planner = () => {
    const next7Days = useMemo(() => getNext7Days(), []);

    // Filter plans according to view and exam section
    const filteredPlans = useMemo(() => {
      let list = plans;
      if (plannerView === "Today's Plan") {
        list = list.filter(p => p.date === today() || !p.date);
      } else if (plannerView === "Tomorrow's Plan") {
        list = list.filter(p => p.date === tomorrow());
      } else if (plannerView === 'Weekly View') {
        list = list.filter(p => (p.date || today()) === selectedWeekDate);
      }
      if (plannerExamFilter !== 'ALL') {
        list = list.filter(p => {
          const pExam = p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC');
          return pExam === plannerExamFilter;
        });
      }
      return list;
    }, [plans, plannerView, plannerExamFilter, selectedWeekDate]);

    // Metrics for Today
    const todayPlans = plans.filter(p => (p.date === today() || !p.date) && !p.done);
    const todayPlannedMinutes = todayPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
    const todayCapacityPct = Math.min(100, Math.round((todayPlannedMinutes / 480) * 100));

    // Metrics for Tomorrow
    const tomorrowPlans = plans.filter(p => p.date === tomorrow() && !p.done);
    const tomorrowPlannedMinutes = tomorrowPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
    const tomorrowCapacityPct = Math.min(100, Math.round((tomorrowPlannedMinutes / 480) * 100));

    // Metrics for Next 7 Days (Weekly View)
    const weeklyPlans = plans.filter(p => next7Days.some(d => d.dateStr === p.date));
    const weeklyPlannedMinutes = weeklyPlans.reduce((a, p) => a + Number(p.minutes || 0), 0);
    const weeklyDoneMinutes = weeklyPlans.filter(p => p.done).reduce((a, p) => a + Number(p.minutes || 0), 0);
    const weeklyTargetMinutes = 40 * 60;
    const weeklyCapacityPct = Math.min(100, Math.round((weeklyPlannedMinutes / weeklyTargetMinutes) * 100));

    // UPSC vs MPSC Planned Breakdown
    const upscPlannedMinutes = plans
      .filter(p => (p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC')
      .reduce((a, p) => a + Number(p.minutes || 0), 0);
    const mpscPlannedMinutes = plans
      .filter(p => (p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC')
      .reduce((a, p) => a + Number(p.minutes || 0), 0);
    const totalExamMinutes = upscPlannedMinutes + mpscPlannedMinutes || 1;
    const upscPct = Math.round((upscPlannedMinutes / totalExamMinutes) * 100);
    const mpscPct = 100 - upscPct;

    // Subject breakdown for Workload view
    const subjectBreakdown = useMemo(() => {
      const map = {};
      plans.forEach(p => {
        const sid = p.subjectId || 'general';
        if (!map[sid]) {
          const sObj = subjects.find(s => s.id === sid);
          map[sid] = {
            id: sid,
            name: sObj?.name || sid,
            exam: p.exam || (sid.startsWith('mpsc') ? 'MPSC' : 'UPSC'),
            minutes: 0,
            tasks: 0
          };
        }
        map[sid].minutes += Number(p.minutes || 0);
        map[sid].tasks += 1;
      });
      return Object.values(map).sort((a, b) => b.minutes - a.minutes);
    }, [plans, subjects]);

    // Suggested unfinished topics for the selected plan subject
    const suggestedTopics = useMemo(() => {
      const all = SYLLABUS_TOPICS[planSubject] || [];
      return all
        .filter(t => {
          const prog = topicProgress.find(p => p.topicId === t.id);
          return !prog || prog.status !== 'Completed';
        })
        .slice(0, 3);
    }, [planSubject, topicProgress]);

    const targetSubjects = subjects.filter(
      s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === planExamTarget
    );

    const renderTaskCard = (p) => {
      const priorityColors = {
        High: { bg: C.redSoft, fg: C.red },
        Medium: { bg: C.amberSoft, fg: C.amber },
        Low: { bg: C.soft, fg: C.blue }
      };
      const pStyle = priorityColors[p.priority || 'Medium'] || priorityColors.Medium;
      const pExam = p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC');
      const isMp = pExam === 'MPSC';
      const rawSub = subjects.find(s => s.id === p.subjectId)?.name || p.subjectId || 'General';
      const subName = getSubjectName(p.subjectId || rawSub, lang);

      return (
        <Card key={p.id} style={{ paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <TouchableOpacity onPress={() => markPlan(p)} style={{ marginTop: 2 }}>
              <Ionicons
                name={p.done ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={p.done ? C.green : C.blue}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigateToTopic(p)}
              style={{ flex: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: isMp ? '#b45309' : '#1e40af',
                    backgroundColor: isMp ? '#fef3c7' : '#dbeafe',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6
                  }}
                >
                  {isMp ? 'MPSC' : 'UPSC'}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: pStyle.fg,
                    backgroundColor: pStyle.bg,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderRadius: 6
                  }}
                >
                  {p.priority === 'High' ? t('high') : p.priority === 'Low' ? t('low') : t('medium')}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: C.blue,
                    backgroundColor: C.soft,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderRadius: 6
                  }}
                >
                  {subName}
                </Text>
                {p.date && (
                  <Text style={txt(10, false, C.muted)}>
                    {p.date === today() ? 'Today' : p.date === tomorrow() ? 'Tomorrow' : formatDateDMY(p.date)}
                  </Text>
                )}
              </View>

              <Text
                style={[
                  txt(14, true),
                  p.done ? { textDecorationLine: 'line-through', color: C.muted } : null
                ]}
              >
                {getTaskTitle(p.title, lang)}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, flexWrap: 'wrap', gap: 6 }}>
                <Text style={txt(11, false, C.muted)}>
                  {p.minutes} mins • {p.done ? getStatusLabel('completed', lang) : getStatusLabel('pending', lang)}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: isDark ? '#1e2942' : '#eff6ff',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: isDark ? '#334155' : '#bfdbfe'
                  }}
                >
                  <Ionicons name="book-outline" size={11} color={C.blue} />
                  <Text style={{ fontSize: 10, fontWeight: '700', color: C.blue }}>{t('viewTopicInSyllabus')}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              {!p.done && (
                <TouchableOpacity
                  onPress={() => startPlanFocus(p)}
                  style={{
                    backgroundColor: C.blue,
                    paddingHorizontal: 11,
                    paddingVertical: 6,
                    borderRadius: 8
                  }}
                >
                  <Text style={txt(11, true, C.white)}>▶ {t('focus')}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deletePlan(p)} style={{ padding: 4 }}>
                <Ionicons name="trash-outline" size={17} color={C.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      );
    };

    return (
      <>
        <Title sub={t('plannerSubtitle')}>
          {t('studyPlannerTitle')}
        </Title>

        {/* Compact View Switcher & Exam Filter */}
        <Card style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={[txt(11, true, C.muted), { marginBottom: 6 }]}>{t('plannerTimeframe')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {[
                ["Today's Plan", t('todaysPlan')],
                ["Tomorrow's Plan", t('tomorrowsPlan')],
                ['Weekly View', t('weeklyView')],
                ['Workload & Routine', t('workloadRoutine')]
              ].map(([vKey, vLabel]) => (
                <Chip
                  key={vKey}
                  label={vLabel}
                  active={
                    plannerView === vKey ||
                    (vKey === 'Workload & Routine' && (plannerView === 'Workload View' || plannerView === 'Workload & Routine'))
                  }
                  onPress={() => {
                    setPlannerView(vKey);
                    if (vKey === "Today's Plan") setPlanDateType('today');
                    else if (vKey === "Tomorrow's Plan") setPlanDateType('tomorrow');
                    else if (vKey === 'Weekly View') setPlanDateType('selected');
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ borderTopWidth: 1, borderColor: C.line, paddingTop: 10 }}>
            <Text style={[txt(11, true, C.muted), { marginBottom: 6 }]}>{t('examFilter')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              <Chip
                label={t('allExamTasks')}
                active={plannerExamFilter === 'ALL'}
                onPress={() => setPlannerExamFilter('ALL')}
              />
              <Chip
                label="UPSC"
                active={plannerExamFilter === 'UPSC'}
                onPress={() => setPlannerExamFilter('UPSC')}
              />
              <Chip
                label="MPSC"
                active={plannerExamFilter === 'MPSC'}
                onPress={() => setPlannerExamFilter('MPSC')}
              />
            </View>
          </View>
        </Card>

        {/* ---------------- VIEW 1: TODAY'S PLAN ---------------- */}
        {plannerView === "Today's Plan" && (
          <>
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={txt(15, true)}>{t('todaysStudyLoad')} vs. {dailyGoalHours}h {t('studyTargetGoal')}</Text>
                <Text style={txt(13, true, C.blue)}>{todayCapacityPct}% {t('capacity')}</Text>
              </View>
              <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6, marginVertical: 10 }}>
                <View
                  style={{
                    backgroundColor: todayCapacityPct > 90 ? C.amber : C.blue,
                    height: 8,
                    borderRadius: 6,
                    width: `${todayCapacityPct}%`
                  }}
                />
              </View>
              <Text style={txt(12, false, C.muted)}>
                {todayPlannedMinutes} {t('minPlanned')} ({Math.floor(todayPlannedMinutes / 60)}h {todayPlannedMinutes % 60}m) • {dailyGoalHours}h ({dailyGoalHours * 60}m)
              </Text>
            </Card>

            <View style={{ marginBottom: 6 }}>
              <Text style={[txt(14, true), { marginBottom: 8 }]}>
                {t('todaysPlan')} ({formatDateDMY(today())})
              </Text>
            </View>

            {filteredPlans.length === 0 ? (
              <Card>
                <Text style={[txt(13, false, C.muted), { textAlign: 'center', paddingVertical: 12 }]}>
                  {t('noTasksToday')}
                </Text>
              </Card>
            ) : (
              filteredPlans.map(renderTaskCard)
            )}
          </>
        )}

        {/* ---------------- VIEW 2: TOMORROW'S PLAN ---------------- */}
        {plannerView === "Tomorrow's Plan" && (
          <>
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={txt(15, true)}>{t('tomorrowsWorkloadTarget')}</Text>
                <Text style={txt(13, true, C.blue)}>{tomorrowCapacityPct}% {t('capacity')}</Text>
              </View>
              <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6, marginVertical: 10 }}>
                <View
                  style={{
                    backgroundColor: tomorrowCapacityPct > 90 ? C.amber : C.blue,
                    height: 8,
                    borderRadius: 6,
                    width: `${tomorrowCapacityPct}%`
                  }}
                />
              </View>
              <Text style={txt(12, false, C.muted)}>
                {tomorrowPlannedMinutes} {t('minPlanned')} ({Math.floor(tomorrowPlannedMinutes / 60)}h {tomorrowPlannedMinutes % 60}m) • {t('tomorrow')} ({formatDateDMY(tomorrow())})
              </Text>
            </Card>

            <Card style={{ backgroundColor: isDark ? C.greenSoft : '#f0fdf4', borderColor: isDark ? '#065f46' : '#bbf7d0', paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="sparkles" size={18} color={isDark ? '#34d399' : '#15803d'} />
                <Text style={txt(12, true, isDark ? '#34d399' : '#15803d')}>{t('advancePlanningRoutine')}</Text>
              </View>
              <Text style={[txt(11, false, isDark ? '#a7f3d0' : '#166534'), { marginTop: 4, lineHeight: 16 }]}>
                {t('advancePlanningDesc')}
              </Text>
            </Card>

            <View style={{ marginBottom: 6 }}>
              <Text style={[txt(14, true), { marginBottom: 8 }]}>
                {t('tomorrowsPlan')} ({formatDateDMY(tomorrow())})
              </Text>
            </View>

            {filteredPlans.length === 0 ? (
              <Card>
                <Text style={[txt(13, false, C.muted), { textAlign: 'center', paddingVertical: 8 }]}>
                  {t('noTasksTomorrow')}
                </Text>
                <View style={{ marginTop: 10, alignItems: 'center', gap: 8 }}>
                  <Button
                    label={t('autoGenerateBlueprint')}
                    onPress={autoPlanTomorrow}
                  />
                  <Button
                    label={t('browseSyllabusToSchedule')}
                    subtle
                    onPress={() => setTab('Syllabus')}
                  />
                </View>
              </Card>
            ) : (
              filteredPlans.map(renderTaskCard)
            )}
          </>
        )}

        {/* ---------------- VIEW 3: WEEKLY VIEW ---------------- */}
        {plannerView === 'Weekly View' && (
          <>
            {/* Weekly Mode Switcher */}
            <Card style={{ paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={txt(11, true, C.muted)}>WEEKLY SCHEDULE VIEW</Text>
                <TouchableOpacity
                  onPress={autoPlanWeek}
                  style={{
                    backgroundColor: C.blue,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Ionicons name="sparkles" size={12} color="#ffffff" />
                  <Text style={txt(11, true, '#ffffff')}>Auto-Plan Full Week</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Chip
                  label="Entire Week (All 7 Days)"
                  active={weeklySubTab === 'ALL_WEEK'}
                  onPress={() => setWeeklySubTab('ALL_WEEK')}
                />
                <Chip
                  label="Single Day Focus"
                  active={weeklySubTab === 'SINGLE_DAY'}
                  onPress={() => setWeeklySubTab('SINGLE_DAY')}
                />
              </View>
            </Card>

            {/* Weekly Target Meter (Always Visible at top of Weekly View) */}
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={txt(15, true)}>{t('weeklyGoalVs40h')}</Text>
                  <Text style={[txt(11, false, C.muted), { marginTop: 2 }]}>
                    40-Hour Civil Services Target
                  </Text>
                </View>
                <Text style={txt(14, true, C.blue)}>{weeklyCapacityPct}%</Text>
              </View>
              <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6, marginVertical: 10 }}>
                <View
                  style={{
                    backgroundColor: weeklyCapacityPct > 80 ? C.green : C.blue,
                    height: 8,
                    borderRadius: 6,
                    width: `${Math.min(100, weeklyCapacityPct)}%`
                  }}
                />
              </View>
              <Text style={txt(12, false, C.muted)}>
                {Math.floor(weeklyPlannedMinutes / 60)}h {weeklyPlannedMinutes % 60}m {t('minPlanned')} • {weeklyPlans.filter(p => p.done).length}/{weeklyPlans.length} {t('tasks')} {t('completed')}
              </Text>
            </Card>

            {/* SUB-VIEW 1: ENTIRE WEEK SCHEDULE (All 7 Days Grouped) */}
            {weeklySubTab === 'ALL_WEEK' ? (
              <View style={{ marginTop: 6, gap: 12 }}>
                {next7Days.map(d => {
                  const dayPlans = plans.filter(p => {
                    const matchDate = p.date === d.dateStr;
                    if (!matchDate) return false;
                    if (plannerExamFilter !== 'ALL') {
                      const pExam = p.exam || (String(p.subjectId || '').startsWith('mpsc') ? 'MPSC' : 'UPSC');
                      return pExam === plannerExamFilter;
                    }
                    return true;
                  });

                  return (
                    <View key={d.dateStr} style={{ marginBottom: 4 }}>
                      {/* Day Header Banner */}
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: d.isToday ? (isDark ? '#1e3a5f' : '#eff6ff') : (isDark ? '#1e293b' : '#f8fafc'),
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 12,
                          borderLeftWidth: 4,
                          borderLeftColor: d.isToday ? C.blue : C.line,
                          marginBottom: 8
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={txt(13, true, d.isToday ? C.blue : C.ink)}>
                            {d.isToday ? `Today (${d.dayName}, ${d.month} ${d.dayNum})` : d.isTomorrow ? `Tomorrow (${d.dayName}, ${d.month} ${d.dayNum})` : `${d.dayName}, ${d.month} ${d.dayNum}`}
                          </Text>
                          <Text style={txt(11, false, C.muted)}>({formatDateDMY(d.dateStr)})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <View style={{ backgroundColor: dayPlans.length > 0 ? C.soft : '#f1f5f9', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 }}>
                            <Text style={txt(10, true, dayPlans.length > 0 ? C.blue : C.muted)}>
                              {dayPlans.length} {dayPlans.length === 1 ? 'task' : 'tasks'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Day Task Cards */}
                      {dayPlans.length === 0 ? (
                        <Card style={{ paddingVertical: 10, backgroundColor: isDark ? '#131b2e' : '#ffffff', borderStyle: 'dashed' }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={txt(12, false, C.muted)}>No tasks scheduled for this day</Text>
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedWeekDate(d.dateStr);
                                setPlanDateType('selected');
                                setTab('Planner');
                                setPlannerView("Today's Plan");
                              }}
                              style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: C.soft }}
                            >
                              <Text style={txt(11, true, C.blue)}>+ Add Task</Text>
                            </TouchableOpacity>
                          </View>
                        </Card>
                      ) : (
                        dayPlans.map(renderTaskCard)
                      )}
                    </View>
                  );
                })}

                {/* Earlier Tasks Created This Week */}
                {plans.filter(p => p.date && p.date < today() && p.date >= '2026-10-20').length > 0 && (
                  <Card style={{ marginTop: 8 }}>
                    <Text style={[txt(13, true), { marginBottom: 8 }]}>
                      Recent Study Sessions This Week (Past Days)
                    </Text>
                    {plans
                      .filter(p => p.date && p.date < today() && p.date >= '2026-10-20')
                      .slice(0, 10)
                      .map(renderTaskCard)}
                  </Card>
                )}
              </View>
            ) : (
              /* SUB-VIEW 2: SINGLE DAY FOCUS WITH 7-DAY STRIP */
              <>
                <Card style={{ paddingVertical: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={txt(11, true, C.muted)}>SELECT DAY (NEXT 7 DAYS)</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => {
                          const currIdx = next7Days.findIndex(d => d.dateStr === selectedWeekDate);
                          if (currIdx > 0) setSelectedWeekDate(next7Days[currIdx - 1].dateStr);
                        }}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: C.soft,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="chevron-back" size={14} color={C.blue} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          const currIdx = next7Days.findIndex(d => d.dateStr === selectedWeekDate);
                          if (currIdx < next7Days.length - 1) setSelectedWeekDate(next7Days[currIdx + 1].dateStr);
                        }}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: C.soft,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Ionicons name="chevron-forward" size={14} color={C.blue} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%' }}>
                    <View style={{ flexDirection: 'row', gap: 4, width: '100%', justifyContent: 'space-between' }}>
                      {next7Days.map(d => {
                        const isSelected = selectedWeekDate === d.dateStr;
                        const dayPlans = plans.filter(p => p.date === d.dateStr);
                        const count = dayPlans.length;
                        return (
                          <TouchableOpacity
                            key={d.dateStr}
                            onPress={() => {
                              setSelectedWeekDate(d.dateStr);
                              setPlanDateType('selected');
                              if (Platform.OS === 'web' && typeof document !== 'undefined') {
                                setTimeout(() => {
                                  const el = document.getElementById('day-tasks-section');
                                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }, 60);
                              }
                            }}
                            style={{
                              flex: 1,
                              minWidth: 40,
                              backgroundColor: isSelected ? C.blue : C.cardBg,
                              borderWidth: 1.5,
                              borderColor: isSelected ? C.blue : C.line,
                              borderRadius: 10,
                              paddingVertical: 7,
                              paddingHorizontal: 2,
                              alignItems: 'center'
                            }}
                          >
                            <Text style={txt(10, true, isSelected ? C.white : C.muted)}>
                              {d.dayName.toUpperCase()}
                            </Text>
                            <Text style={[txt(15, true, isSelected ? C.white : C.ink), { marginVertical: 1 }]}>
                              {d.dayNum}
                            </Text>
                            <Text style={txt(9, false, isSelected ? '#dbeafe' : C.muted)}>
                              {d.isToday ? t('today') : d.isTomorrow ? t('tomorrow') : d.month}
                            </Text>
                            <View
                              style={{
                                marginTop: 4,
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : (count > 0 ? C.soft : '#f1f5f9'),
                                paddingHorizontal: 5,
                                paddingVertical: 1,
                                borderRadius: 6
                              }}
                            >
                              <Text style={txt(9, true, isSelected ? C.white : (count > 0 ? C.blue : C.muted))}>
                                {count}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </Card>

                {/* Selected Day Tasks List */}
                <View nativeID="day-tasks-section" {...{ id: 'day-tasks-section' }} style={{ marginTop: 12, marginBottom: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={txt(15, true)}>
                      {t('tasksForDay')} {selectedWeekDate === today() ? `${t('today')} (${formatDateDMY(today())})` : selectedWeekDate === tomorrow() ? `${t('tomorrow')} (${formatDateDMY(tomorrow())})` : formatDateDMY(selectedWeekDate)}
                    </Text>
                    <View style={{ backgroundColor: C.soft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={txt(11, true, C.blue)}>
                        {filteredPlans.length} {filteredPlans.length === 1 ? t('task') : t('tasks')}
                      </Text>
                    </View>
                  </View>
                </View>

                {filteredPlans.length === 0 ? (
                  <Card>
                    <Text style={[txt(13, false, C.muted), { textAlign: 'center', paddingVertical: 12 }]}>
                      {t('noTasksScheduledDate')}
                    </Text>
                    <View style={{ marginTop: 6, alignItems: 'center', gap: 8 }}>
                      <Button
                        label={selectedWeekDate === tomorrow() ? t('autoPlanTomorrow') : 'Auto-Plan This Day'}
                        onPress={selectedWeekDate === tomorrow() ? autoPlanTomorrow : autoPlanWeek}
                      />
                      <Button
                        label={t('browseSyllabusToSchedule')}
                        subtle
                        onPress={() => setTab('Syllabus')}
                      />
                    </View>
                  </Card>
                ) : (
                  filteredPlans.map(renderTaskCard)
                )}
              </>
            )}
          </>
        )}

        {/* ---------------- VIEW 4: WORKLOAD VIEW ---------------- */}
        {(plannerView === 'Workload View' || plannerView === 'Workload & Routine') && (
          <>
            {/* Daily & Weekly Capacity Overview */}
            <Card>
              <Text style={[txt(15, true), { marginBottom: 12 }]}>Workload Capacity Gauges</Text>

              {/* Today */}
              <View style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={txt(13, true)}>Today's Study Load</Text>
                  <Text style={txt(13, true, C.blue)}>{todayCapacityPct}% of 8h</Text>
                </View>
                <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6 }}>
                  <View style={{ backgroundColor: C.blue, height: 8, borderRadius: 6, width: `${todayCapacityPct}%` }} />
                </View>
                <Text style={[txt(11, false, C.muted), { marginTop: 4 }]}>
                  {todayPlannedMinutes} min planned ({Math.floor(todayPlannedMinutes / 60)}h {todayPlannedMinutes % 60}m)
                </Text>
              </View>

              {/* Weekly */}
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={txt(13, true)}>Weekly Cumulative Load</Text>
                  <Text style={txt(13, true, C.blue)}>{weeklyCapacityPct}% of 40h</Text>
                </View>
                <View style={{ height: 8, backgroundColor: C.soft, borderRadius: 6 }}>
                  <View style={{ backgroundColor: C.green, height: 8, borderRadius: 6, width: `${weeklyCapacityPct}%` }} />
                </View>
                <Text style={[txt(11, false, C.muted), { marginTop: 4 }]}>
                  {Math.floor(weeklyPlannedMinutes / 60)}h {weeklyPlannedMinutes % 60}m planned across 7 days
                </Text>
              </View>
            </Card>

            {/* Exam Split Meter */}
            <Card>
              <Text style={[txt(15, true), { marginBottom: 10 }]}>Exam Syllabus Allocation</Text>
              <View style={{ height: 12, backgroundColor: C.soft, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginBottom: 8 }}>
                <View style={{ backgroundColor: '#1d4ed8', width: `${upscPct}%` }} />
                <View style={{ backgroundColor: '#f59e0b', width: `${mpscPct}%` }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={txt(12, true, '#1d4ed8')}>UPSC: {upscPlannedMinutes}m ({upscPct}%)</Text>
                <Text style={txt(12, true, '#b45309')}>MPSC: {mpscPlannedMinutes}m ({mpscPct}%)</Text>
              </View>
            </Card>

            {/* Subject-Wise Time Allocation */}
            <Card>
              <Text style={[txt(15, true), { marginBottom: 12 }]}>Subject-Wise Time Allocation</Text>
              {subjectBreakdown.length === 0 ? (
                <Text style={[txt(13, false, C.muted), { textAlign: 'center', paddingVertical: 8 }]}>
                  No subject hours planned yet. Add study tasks to see subject distribution.
                </Text>
              ) : (
                subjectBreakdown.map(sb => {
                  const maxMins = subjectBreakdown[0]?.minutes || 1;
                  const pct = Math.min(100, Math.round((sb.minutes / maxMins) * 100));
                  return (
                    <View key={sb.id} style={{ marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={txt(12, true)}>{getSubjectName(sb.id || sb.name, lang)}</Text>
                        <Text style={txt(12, false, C.muted)}>
                          {Math.floor(sb.minutes / 60)}h {sb.minutes % 60}m ({sb.tasks} {sb.tasks === 1 ? 'task' : 'tasks'})
                        </Text>
                      </View>
                      <View style={{ height: 6, backgroundColor: C.soft, borderRadius: 4 }}>
                        <View
                          style={{
                            backgroundColor: sb.exam === 'MPSC' ? C.amber : C.blue,
                            height: 6,
                            borderRadius: 4,
                            width: `${pct}%`
                          }}
                        />
                      </View>
                    </View>
                  );
                })
              )}
            </Card>

            {/* Daily 3-Slot Routine Blueprint */}
            <Card>
              <Text style={[txt(15, true), { marginBottom: 4 }]}>{t('blueprintIdealRoutine')}</Text>
              <Text style={[txt(11, false, C.muted), { marginBottom: 12 }]}>
                {t('blueprintRoutineDesc')}
              </Text>

              <View style={{ gap: 8, marginBottom: 14 }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigateToTopic({ title: `${planExamTarget} GS Core & Theory (Deep Work)`, subjectId: planSubject, exam: planExamTarget })}
                  style={{ backgroundColor: isDark ? '#1e293b' : '#eff6ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#334155' : '#dbeafe' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={txt(12, true, isDark ? '#93c5fd' : '#1e40af')}>{t('slot1DeepWork')}</Text>
                    <Ionicons name="arrow-forward-circle" size={18} color={isDark ? '#93c5fd' : '#1e40af'} />
                  </View>
                  <Text style={[txt(11, false, isDark ? '#cbd5e1' : '#3b82f6'), { marginTop: 2 }]}>
                    {t('slot1Desc')}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: C.blue, marginTop: 4 }}>
                    {t('tapToViewTopic')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigateToTopic({ title: `${planExamTarget} PYQ Practice & MCQs`, subjectId: planSubject, exam: planExamTarget })}
                  style={{ backgroundColor: isDark ? '#2e200c' : '#fefce8', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#78350f' : '#fef08a' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={txt(12, true, isDark ? '#fde047' : '#854d0e')}>{t('slot2Practice')}</Text>
                    <Ionicons name="arrow-forward-circle" size={18} color={isDark ? '#fde047' : '#854d0e'} />
                  </View>
                  <Text style={[txt(11, false, isDark ? '#fef08a' : '#a16207'), { marginTop: 2 }]}>
                    {t('slot2Desc')}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: isDark ? '#fde047' : '#854d0e', marginTop: 4 }}>
                    {t('tapToViewTopic')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigateToTopic({ title: 'Current Affairs & Editorial Analysis', subjectId: planExamTarget === 'MPSC' ? 'mpsc-current-affairs' : 'upsc-current-affairs', exam: planExamTarget })}
                  style={{ backgroundColor: isDark ? '#261447' : '#f5f3ff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: isDark ? '#581c87' : '#ddd6fe' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={txt(12, true, isDark ? '#c4b5fd' : '#5b21b6')}>{t('slot3CurrentAffairs')}</Text>
                    <Ionicons name="arrow-forward-circle" size={18} color={isDark ? '#c4b5fd' : '#5b21b6'} />
                  </View>
                  <Text style={[txt(11, false, isDark ? '#ddd6fe' : '#7c3aed'), { marginTop: 2 }]}>
                    {t('slot3Desc')}
                  </Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: isDark ? '#c4b5fd' : '#7c3aed', marginTop: 4 }}>
                    {t('tapToViewTopic')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('blueprintForToday')}
                    subtle
                    onPress={() => generateBlueprint(today())}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('blueprintForTomorrow')}
                    onPress={() => generateBlueprint(tomorrow())}
                  />
                </View>
              </View>
            </Card>
          </>
        )}

        {/* ---------------- ADD STUDY BLOCK FORM ---------------- */}
        <Card style={{ marginTop: 8 }}>
          <Text style={txt(16, true)}>{t('addStudyBlock')}</Text>
          <Text style={[txt(11, false, C.muted), { marginTop: 2, marginBottom: 12 }]}>
            {t('addStudyBlockDesc')}
          </Text>

          {/* Exam Section Selector */}
          <Text style={txt(11, true, C.muted)}>TARGET EXAM</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, marginBottom: 12 }}>
            <Chip
              label="UPSC"
              active={planExamTarget === 'UPSC'}
              onPress={() => {
                setPlanExamTarget('UPSC');
                const upSubs = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'UPSC');
                if (upSubs.length) setPlanSubject(upSubs[0].id);
              }}
            />
            <Chip
              label="MPSC"
              active={planExamTarget === 'MPSC'}
              onPress={() => {
                setPlanExamTarget('MPSC');
                const mpSubs = subjects.filter(s => (s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC')) === 'MPSC');
                if (mpSubs.length) setPlanSubject(mpSubs[0].id);
              }}
            />
          </View>

          {/* Subject Selector */}
          <Text style={txt(11, true, C.muted)}>SELECT {planExamTarget} SUBJECT</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6, marginBottom: 10 }}>
            {targetSubjects.map(s => (
              <Chip
                key={s.id}
                label={getSubjectName(s, lang)}
                active={planSubject === s.id}
                onPress={() => setPlanSubject(s.id)}
              />
            ))}
          </View>

          {/* Quick Syllabus Topic Suggestions */}
          {suggestedTopics.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={txt(11, true, C.muted)}>{t('quickPickUnfinished')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                {suggestedTopics.map(tItem => (
                  <TouchableOpacity
                    key={tItem.id}
                    onPress={() => setPlanTitle(tItem.name)}
                    style={{
                      backgroundColor: C.soft,
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginRight: 6,
                      marginBottom: 6
                    }}
                  >
                    <Text style={txt(11, false, C.blue)}>+ {getTopicName(tItem, lang)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Title Input */}
          <Text style={txt(11, true, C.muted)}>{t('topicOrChapterTitle')}</Text>
          <TextInput
            placeholder={t('topicTitlePlaceholder')}
            style={input}
            value={planTitle}
            onChangeText={setPlanTitle}
          />

          {/* Duration Chips */}
          <Text style={[txt(11, true, C.muted), { marginTop: 12 }]}>{t('targetDurationMins')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
            {['30', '45', '60', '90', '120'].map(m => (
              <Chip
                key={m}
                label={`${m}m`}
                active={planMinutes === m}
                onPress={() => setPlanMinutes(m)}
              />
            ))}
          </View>

          {/* Priority & Date Selector */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: 150 }}>
              <Text style={txt(11, true, C.muted)}>{t('priority')}</Text>
              <View style={{ flexDirection: 'row', marginTop: 6 }}>
                {[
                  ['High', t('high')],
                  ['Medium', t('medium')],
                  ['Low', t('low')]
                ].map(([pKey, pLabel]) => (
                  <Chip
                    key={pKey}
                    label={pLabel}
                    active={planPriority === pKey}
                    onPress={() => setPlanPriority(pKey)}
                  />
                ))}
              </View>
            </View>

            <View style={{ flex: 1, minWidth: 150 }}>
              <Text style={txt(11, true, C.muted)}>{t('day')}</Text>
              <View style={{ flexDirection: 'row', marginTop: 6, flexWrap: 'wrap', gap: 6 }}>
                <Chip
                  label={t('today')}
                  active={planDateType === 'today'}
                  onPress={() => setPlanDateType('today')}
                />
                <Chip
                  label={t('tomorrow')}
                  active={planDateType === 'tomorrow'}
                  onPress={() => setPlanDateType('tomorrow')}
                />
                {selectedWeekDate !== today() && selectedWeekDate !== tomorrow() && (
                  <Chip
                    label={`Selected (${selectedWeekDate})`}
                    active={planDateType === 'selected'}
                    onPress={() => setPlanDateType('selected')}
                  />
                )}
              </View>
            </View>
          </View>

          <View style={{ marginTop: 8 }}>
            <Button
              label={t('scheduleStudyBlockBtn')}
              onPress={addPlan}
            />
          </View>
        </Card>
      </>
    );
  };

    // ---------------- ANALYTICS TAB ----------------
const Analytics = () => {
    const [analyticsTab, setAnalyticsTab] = useState('Overview');
    const allDaily = Array.isArray(analytics.daily) ? analytics.daily : [];
    const chartDays = allDaily.slice(analyticsRange === '7' ? -7 : -30);

    const today = new Date();
    const todayKey = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    const todayMinutes = Number(
      allDaily.find(day => day.date === todayKey)?.minutes
    ) || 0;

    const dailyGoalMinutes = 120;
    const goalProgress = Math.min(
      100,
      Math.round((todayMinutes / dailyGoalMinutes) * 100)
    );

    const visibleDates = new Set(chartDays.map(day => day.date));
    const rangeSessions = sessions.filter(
      session =>
        session.startedAt &&
        visibleDates.has(session.startedAt.slice(0, 10))
    );

    const rangeMinutes = chartDays.reduce(
      (sum, day) => sum + (Number(day.minutes) || 0),
      0
    );

    const maxMinutes = Math.max(
      1,
      ...chartDays.map(day => Number(day.minutes) || 0)
    );

    const rangeFocus = rangeSessions.length
      ? Math.round(
          rangeSessions.reduce(
            (sum, session) => sum + (Number(session.focusScore) || 0),
            0
          ) / rangeSessions.length
        )
      : 0;

    const averageSession = rangeSessions.length
      ? Math.round(rangeMinutes / rangeSessions.length)
      : 0;

    const subjectTotals = rangeSessions.reduce((result, session) => {
      const subject = subjects.find(
        item => item.id === session.subjectId
      );
      const key = session.subjectId || 'unassigned';

      if (!result[key]) {
        result[key] = {
          name: subject?.name || 'Unassigned',
          minutes: 0,
          count: 0
        };
      }

      result[key].minutes += Number(session.minutes) || 0;
      result[key].count += 1;
      return result;
    }, {});

    const subjectRows = Object.values(subjectTotals).sort(
      (a, b) => b.minutes - a.minutes
    );

    const recentSessions = rangeSessions
      .slice()
      .sort((a, b) =>
        (b.startedAt || '').localeCompare(a.startedAt || '')
      )
      .slice(0, 8);

    const activeDays = chartDays.filter(
      day => (Number(day.minutes) || 0) > 0
    ).length;

    const formatMinutes = value => {
      const minutes = Math.max(0, Number(value) || 0);
      const hours = Math.floor(minutes / 60);
      const remainder = Math.round(minutes % 60);

      return hours
        ? `${hours}h ${remainder}m`
        : `${remainder}m`;
    };

    const sectionSubtitle = {
      marginTop: 5,
      marginBottom: 16
    };

    const sectionHeading = txt(16, true);

    return (
      <>
        <Title sub="Understand your habits, track progress and build consistency">
          Study Analytics
        </Title>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16
          }}
        >
          <Text style={txt(12, false, C.muted)}>
            Your study overview
          </Text>

          <View style={{ flexDirection: 'row' }}>
            <Chip
              label="7 Days"
              active={analyticsRange === '7'}
              onPress={() => setAnalyticsRange('7')}
            />
            <View style={{ width: 6 }} />
            <Chip
              label="30 Days"
              active={analyticsRange === '30'}
              onPress={() => setAnalyticsRange('30')}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingBottom: 12,
            paddingRight: 4
          }}
        >
          {['Overview', 'Activity', 'Subjects', 'Sessions'].map(tab => (
            <Chip
              key={tab}
              label={tab}
              active={analyticsTab === tab}
              onPress={() => setAnalyticsTab(tab)}
            />
          ))}
        </ScrollView>

        {analyticsTab === 'Overview' && (
          <>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={txt(17, true)}>Today's Study Goal</Text>
              <Text
                style={[
                  txt(12, false, C.muted),
                  { marginTop: 6, lineHeight: 19 }
                ]}
              >
                Build a daily habit, one focused session at a time.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: C.soft,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12
              }}
            >
              <Text style={txt(11, true, C.blue)}>
                {goalProgress}% done
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: 18,
              marginBottom: 8
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Ring
                value={goalProgress}
                size={125}
                label="Daily goal"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 18 }}>
              <Text style={txt(22, true)}>
                {formatMinutes(todayMinutes)}
              </Text>
              <Text
                style={[
                  txt(12, false, C.muted),
                  { marginTop: 4 }
                ]}
              >
                studied today
              </Text>

              <View
                style={{
                  height: 8,
                  borderRadius: 8,
                  backgroundColor: C.soft,
                  overflow: 'hidden',
                  marginTop: 14
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${goalProgress}%`,
                    backgroundColor: C.blue,
                    borderRadius: 8
                  }}
                />
              </View>

              <Text
                style={[
                  txt(11, false, C.muted),
                  { marginTop: 7 }
                ]}
              >
                {todayMinutes >= dailyGoalMinutes
                  ? 'Daily goal reached!'
                  : `${formatMinutes(
                      dailyGoalMinutes - todayMinutes
                    )} remaining of 2h`}
              </Text>
            </View>
          </View>
        </Card>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 4
          }}
        >
          {[
            {
              label: 'Study Time',
              value: formatMinutes(rangeMinutes),
              detail: 'Total recorded'
            },
            {
              label: 'Sessions',
              value: String(rangeSessions.length),
              detail: 'Completed records'
            },
            {
              label: 'Average Focus',
              value: `${rangeFocus}%`,
              detail: 'Recorded focus score'
            },
            {
              label: 'Avg. Session',
              value: formatMinutes(averageSession),
              detail: 'Per recorded session'
            }
          ].map((item, index) => (
            <View
              key={item.label}
              style={[
                card,
                {
                  width: '48%',
marginBottom: 10,
padding: 15,
borderRadius: 16,
backgroundColor: [
  '#EEF2FF',
  '#E6FFFA',
  '#FFF1E6',
  '#FCE7F3'
][index % 4],
borderWidth: 1,
borderColor: [
  '#C7D2FE',
  '#99F6E4',
  '#FED7AA',
  '#FBCFE8'
][index % 4]
                }
              ]}
            >
              <View
                style={{
                  width: 34,
                  height: 5,
                  borderRadius: 5,
                  backgroundColor:
                    index % 2 === 0 ? C.blue : C.muted,
                  marginBottom: 12
                }}
              />

              <Text style={txt(11, false, C.muted)}>
                {item.label}
              </Text>
              <Text
                style={[
                  txt(22, true),
                  { marginTop: 8 }
                ]}
              >
                {item.value}
              </Text>
              <Text
                style={[
                  txt(10, false, C.muted),
                  { marginTop: 5 }
                ]}
              >
                {item.detail}
              </Text>
            </View>
          ))}
        </View>
                  <Card>
          <Text style={sectionHeading}>Focus Quality</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            Average focus score from recorded sessions.
          </Text>

          <View
            style={{
              alignItems: 'center',
              paddingVertical: 12
            }}
          >
            <Ring
              value={rangeFocus}
              size={155}
              label="Average focus"
            />
          </View>

          <Text
            style={[
              txt(12, false, C.muted),
              { textAlign: 'center', lineHeight: 19 }
            ]}
          >
            {rangeSessions.length
              ? `Based on ${rangeSessions.length} recorded ${
                  rangeSessions.length === 1 ? 'session' : 'sessions'
                } in this period.`
              : 'Complete a study session to begin tracking focus quality.'}
          </Text>
        </Card>
</>
        )}


        {analyticsTab === 'Activity' && (
          <>
        <Card>
          <Text style={sectionHeading}>Daily Study Activity</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            {analyticsRange === '7'
              ? 'Minutes studied each day this week'
              : 'Minutes studied across the selected month'}
          </Text>

          {chartDays.length === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              Daily analytics are not available yet. Refresh after the API is running.
            </Text>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                height: 155,
                justifyContent: 'space-between'
              }}
            >
              {chartDays.map((day, index) => {
                const minutes = Number(day.minutes) || 0;
                const barHeight =
                  minutes > 0
                    ? Math.max(5, (minutes / maxMinutes) * 105)
                    : 3;

                const date = new Date(`${day.date}T12:00:00`);
                const label =
                  analyticsRange === '7'
                    ? date.toLocaleDateString(undefined, {
                        weekday: 'short'
                      })
                    : date.getDate() % 5 === 0 || index === 0
                      ? String(date.getDate())
                      : '';

                return (
                  <View
                    key={day.date}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      height: '100%'
                    }}
                  >
                    {minutes > 0 && analyticsRange === '7' && (
                      <Text style={txt(9, false, C.muted)}>
                        {minutes}
                      </Text>
                    )}

                    <View
                      style={{
                        width: analyticsRange === '7' ? '55%' : '65%',
                        maxWidth: 18,
                        height: barHeight,
                        borderRadius: 5,
                        backgroundColor:
  minutes > 0
    ? [
        '#5B6CFF',
        '#22B8A7',
        '#FF9F43',
        '#E879F9',
        '#F06464',
        '#38BDF8',
        '#A3E635'
      ][index % 7]
    : C.soft,
                        marginTop: 5
                      }}
                    />

                    <Text
                      style={[
                        txt(9, false, C.muted),
                        { marginTop: 7, height: 14 }
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderColor: C.line,
              marginTop: 14,
              paddingTop: 13,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <View>
              <Text style={txt(11, false, C.muted)}>
                Total study time
              </Text>
              <Text
                style={[
                  txt(17, true),
                  { marginTop: 4 }
                ]}
              >
                {formatMinutes(rangeMinutes)}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={txt(11, false, C.muted)}>
                Active days
              </Text>
              <Text
                style={[
                  txt(17, true),
                  { marginTop: 4 }
                ]}
              >
                {activeDays} / {chartDays.length}
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={sectionHeading}>Study Consistency</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              sectionSubtitle
            ]}
          >
            Each square represents one day. Stronger color means more study time.
          </Text>

          {chartDays.length === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              Activity will appear when daily analytics are available.
            </Text>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6
                }}
              >
                {chartDays.map(day => {
                  const minutes = Number(day.minutes) || 0;
                  const intensity =
                    minutes === 0
                      ? 0
                      : Math.ceil((minutes / maxMinutes) * 4);

                  return (
                    <View
                      key={day.date}
                      style={{
                        width: analyticsRange === '7' ? '12%' : '8.2%',
                        aspectRatio: 1,
                        minWidth: 14,
                        maxWidth: 28,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
  intensity === 0
    ? C.soft
    : intensity === 1
      ? "#DBEAFE"
      : intensity === 2
        ? "#93C5FD"
        : "#60A5FA"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 9,
                          color: intensity >= 2 ? "#1E3A8A" : C.text,
                        }}
                      >
                        {new Date(
                          `${day.date}T12:00:00`
                        ).getDate()}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16
                }}
              >
                <Text style={txt(11, false, C.muted)}>
                  {activeDays} active days
                </Text>
                <Text style={txt(11, false, C.muted)}>
                  {chartDays.length - activeDays} days without study
                </Text>
              </View>
            </>
          )}
        </Card>
          </>
        )}



        {analyticsTab === 'Subjects' && (
        <Card>
          <Text style={txt(17, true)}>Subject Breakdown</Text>
          <Text
            style={[
              txt(12, false, C.muted),
              { marginTop: 5, marginBottom: 18 }
            ]}
          >
            See how your study time is distributed across subjects.
          </Text>

          {subjectRows.length === 0 ||
          subjectRows.reduce(
            (sum, subject) => sum + subject.minutes,
            0
          ) === 0 ? (
            <Text style={txt(12, false, C.muted)}>
              No subject study time recorded for this period.
            </Text>
          ) : (
            <>
              {/*
                Donut chart based on actual subject minutes.
                Each segment represents one subject.
              */}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22
                }}
              >
                <View
                  style={{
                    width: 210,
                    height: 210,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {(() => {
                    const chartColors = [
                      '#5B6CFF',
                      '#22B8A7',
                      '#FF9F43',
                      '#E879F9',
                      '#F06464',
                      '#38BDF8',
                      '#A3E635',
                      '#F472B6'
                    ];

                    const total = subjectRows.reduce(
                      (sum, subject) => sum + subject.minutes,
                      0
                    );

                    const radius = 68;
                    const strokeWidth = 25;
                    const circumference = 2 * Math.PI * radius;
                    let offset = 0;

                    return (
                      <>
                        <Svg
                          width={190}
                          height={190}
                          viewBox="0 0 200 200"
                        >
                          <Circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={C.soft}
                            strokeWidth={strokeWidth}
                          />

                          {subjectRows.map((subject, index) => {
                            const fraction = subject.minutes / total;
                            const segmentLength =
                              fraction * circumference;
                            const currentOffset = offset;

                            offset += segmentLength;

                            return (
                              <Circle
                                key={subject.name}
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke={
                                  chartColors[
                                    index % chartColors.length
                                  ]
                                }
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLength} ${
                                  circumference - segmentLength
                                }`}
                                strokeDashoffset={-currentOffset}
                                strokeLinecap="butt"
                                rotation={-90}
                                origin="100, 100"
                              />
                            );
                          })}
                        </Svg>

                        <View
                          style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Text style={txt(11, false, C.muted)}>
                            Total studied
                          </Text>
                          <Text
                            style={[
                              txt(22, true),
                              { marginTop: 5 }
                            ]}
                          >
                            {formatMinutes(total)}
                          </Text>
                          <Text
                            style={[
                              txt(10, false, C.muted),
                              { marginTop: 4 }
                            ]}
                          >
                            {subjectRows.length}{' '}
                            {subjectRows.length === 1
                              ? 'subject'
                              : 'subjects'}
                          </Text>
                        </View>
                      </>
                    );
                  })()}
                </View>
              </View>

              <View
                style={{
                  backgroundColor: C.soft,
                  borderRadius: 14,
                  padding: 13,
                  marginBottom: 18,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <View>
                  <Text style={txt(11, false, C.muted)}>
                    Total sessions
                  </Text>
                  <Text
                    style={[
                      txt(18, true),
                      { marginTop: 5 }
                    ]}
                  >
                    {subjectRows.reduce(
                      (sum, subject) => sum + subject.count,
                      0
                    )}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={txt(11, false, C.muted)}>
                    Leading subject
                  </Text>
                  <Text
                    style={[
                      txt(14, true),
                      { marginTop: 5 }
                    ]}
                  >
                    {subjectRows
                      .slice()
                      .sort((a, b) => b.minutes - a.minutes)[0]
                      .name}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  txt(13, true),
                  { marginBottom: 13 }
                ]}
              >
                Subject details
              </Text>

              {subjectRows.map((subject, index) => {
                const chartColors = [
                  '#5B6CFF',
                  '#22B8A7',
                  '#FF9F43',
                  '#E879F9',
                  '#F06464',
                  '#38BDF8',
                  '#A3E635',
                  '#F472B6'
                ];

                const total = subjectRows.reduce(
                  (sum, item) => sum + item.minutes,
                  0
                );

                const percentage = total > 0
                  ? Math.round((subject.minutes / total) * 100)
                  : 0;

                const color =
                  chartColors[index % chartColors.length];

                return (
                  <View
                    key={subject.name}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      borderBottomWidth:
                        index === subjectRows.length - 1 ? 0 : 1,
                      borderColor: C.line
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        backgroundColor: color,
                        marginRight: 11
                      }}
                    />

                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={txt(13, true)}>
                        {subject.name}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {subject.count}{' '}
                        {subject.count === 1
                          ? 'session'
                          : 'sessions'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={txt(13, true)}>
                        {formatMinutes(subject.minutes)}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {percentage}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </Card>
        )}
{analyticsTab === 'Sessions' && (
        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4
            }}
          >
            <Text style={sectionHeading}>Recent Sessions</Text>
            <Text style={txt(11, false, C.muted)}>
              Latest {recentSessions.length}
            </Text>
          </View>

          <Text
            style={[
              txt(12, false, C.muted),
              { marginTop: 5, marginBottom: 8 }
            ]}
          >
            Your latest recorded study sessions in this period.
          </Text>

          {recentSessions.length === 0 ? (
            <Text
              style={[
                txt(12, false, C.muted),
                { marginTop: 12 }
              ]}
            >
              No sessions recorded during this period.
            </Text>
          ) : (
            recentSessions.map((session, index) => {
              const subjectName = subjects.find(
                subject => subject.id === session.subjectId
              )?.name || 'Study Session';

              return (
                <View
                  key={session.id || `${session.startedAt}-${index}`}
                  style={{
                    paddingVertical: 13,
                    borderBottomWidth:
                      index === recentSessions.length - 1 ? 0 : 1,
                    borderColor: C.line
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: C.soft,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 11
                      }}
                    >
                      <Text style={txt(11, true, C.blue)}>
                        {String(index + 1).padStart(2, '0')}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={txt(13, true)}>
                        {subjectName}
                      </Text>
                      <Text
                        style={[
                          txt(11, false, C.muted),
                          { marginTop: 5 }
                        ]}
                      >
                        {session.startedAt
                          ? new Date(
                              session.startedAt
                            ).toLocaleDateString()
                          : 'Date unavailable'}
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={txt(13, true)}>
                        {formatMinutes(session.minutes)}
                      </Text>
                      <Text
                        style={[
                          txt(10, false, C.muted),
                          { marginTop: 4 }
                        ]}
                      >
                        {Number(session.focusScore) || 0}% focus
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Card>
        )}

      </>
    );
  };

    const SettingsModal = () => {
    if (!settingsOpen) return null;

    return (
      <Modal
        visible={settingsOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSettingsOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 16,
            width: '100%'
          }}
        >
          <View
            style={{
              backgroundColor: C.cardBg,
              width: '100%',
              maxWidth: 460,
              maxHeight: Platform.OS === 'web' ? '86vh' : '90%',
              height: Platform.OS === 'web' ? '86vh' : undefined,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: C.line,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: C.line,
                backgroundColor: isDark ? '#1e293b' : '#f8fafc'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: C.soft,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons name="settings" size={18} color={C.blue} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={txt(14, true)}>{t('settingsTitle')}</Text>
                  <Text numberOfLines={1} style={txt(10, false, C.muted)}>
                    {user?.name || 'Aspirant'} • {user?.email || 'student@abhyas.local'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setSettingsOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: C.soft,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ionicons name="close" size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Settings Content */}
            <ScrollView
              style={{ flex: 1, minHeight: 0, width: '100%' }}
              contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 14 }}
              showsVerticalScrollIndicator={true}
            >
              {/* 1. Language Selector (Compact Size) */}
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Ionicons name="globe-outline" size={16} color={C.blue} />
                  <Text style={txt(12, true)}>{t('appLanguage')}</Text>
                </View>
                <Text style={[txt(10, false, C.muted), { marginBottom: 8 }]}>
                  {t('chooseLanguage')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, width: '100%' }}>
                  {AVAILABLE_LANGUAGES.map(l => {
                    const isSelected = lang === l.code;
                    return (
                      <TouchableOpacity
                        key={l.code}
                        onPress={() => changeLanguage(l.code)}
                        activeOpacity={0.7}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          backgroundColor: isSelected ? (isDark ? '#1e3a5f' : '#eff6ff') : (isDark ? '#1e293b' : '#ffffff'),
                          borderColor: isSelected ? C.blue : C.line,
                          borderWidth: 1.5,
                          borderRadius: 10,
                          paddingVertical: 7,
                          paddingHorizontal: 4,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: '700', color: isSelected ? C.blue : C.muted, textTransform: 'uppercase', marginBottom: 1 }}>
                          {l.code}
                        </Text>
                        <Text numberOfLines={1} style={txt(11, true, isSelected ? C.blue : C.ink)}>{l.nativeName}</Text>
                        <Text numberOfLines={1} style={txt(9, false, C.muted)}>{l.name}</Text>
                        {isSelected && (
                          <View
                            style={{
                              marginTop: 2,
                              backgroundColor: C.blue,
                              borderRadius: 6,
                              paddingHorizontal: 5,
                              paddingVertical: 1
                            }}
                          >
                            <Text style={{ fontSize: 8, fontWeight: '700', color: '#ffffff' }}>Active</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Appearance: Light & Dark Mode */}
              <View style={{ marginBottom: 16, paddingTop: 14, borderTopWidth: 1, borderColor: C.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Ionicons name="contrast-outline" size={16} color={C.blue} />
                  <Text style={txt(12, true)}>{t('appearance')}</Text>
                </View>
                <Text style={[txt(10, false, C.muted), { marginBottom: 8 }]}>
                  {t('themeDescription')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                  <TouchableOpacity
                    onPress={() => { if (isDark) toggleTheme(); }}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 9,
                      paddingHorizontal: 8,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: !isDark ? C.blue : C.line,
                      backgroundColor: !isDark ? (isDark ? '#1e3a5f' : '#eff6ff') : C.cardBg
                    }}
                  >
                    <Ionicons name="sunny" size={16} color={!isDark ? C.blue : C.muted} />
                    <Text style={txt(11, true, !isDark ? C.blue : C.ink)}>{t('lightMode')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { if (!isDark) toggleTheme(); }}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 9,
                      paddingHorizontal: 8,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: isDark ? '#fbbf24' : C.line,
                      backgroundColor: isDark ? '#1e2942' : C.cardBg
                    }}
                  >
                    <Ionicons name="moon" size={16} color={isDark ? '#fbbf24' : C.muted} />
                    <Text style={txt(11, true, isDark ? '#fbbf24' : C.ink)}>{t('darkMode')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 3. Notifications & Routines */}
              <View style={{ marginBottom: 16, paddingTop: 14, borderTopWidth: 1, borderColor: C.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Ionicons name="notifications-outline" size={16} color={C.blue} />
                  <Text style={txt(12, true)}>{t('notificationsTitle')}</Text>
                  {unread.length > 0 && (
                    <View style={{ backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1 }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: '#ffffff' }}>{unread.length} new</Text>
                    </View>
                  )}
                </View>
                <Text style={[txt(10, false, C.muted), { marginBottom: 8 }]}>
                  {t('notificationDesc')}
                </Text>
                <View style={{ gap: 6, width: '100%' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setSettingsOpen(false);
                      setNotifOpen(true);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: C.line
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <Ionicons name="list-outline" size={16} color={C.blue} />
                      <Text style={txt(12, true)}>{t('openNotificationsView')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color={C.muted} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={requestBrowserReminder}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: C.line
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <Ionicons name="desktop-outline" size={16} color={C.blue} />
                      <Text style={txt(12, true)}>{t('enableBrowserAlerts')}</Text>
                    </View>
                    <Ionicons name="shield-checkmark-outline" size={14} color={C.green} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. Manual & Offline Study Logging */}
              <View style={{ marginBottom: 16, paddingTop: 14, borderTopWidth: 1, borderColor: C.line }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Ionicons name="book-outline" size={16} color={C.blue} />
                  <Text style={txt(12, true)}>Manual &amp; Offline Study Logging</Text>
                </View>
                <Text style={[txt(10, false, C.muted), { marginBottom: 8 }]}>
                  Log textbook readings, library sessions, and past study hours.
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setSettingsOpen(false);
                    setManualLogMode('offline');
                    setManualLogOpen(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isDark ? '#142a1e' : '#f0fdf4',
                    padding: 11,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: isDark ? '#059669' : '#86efac'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <Ionicons name="book-outline" size={18} color="#059669" />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={txt(12, true, isDark ? '#34d399' : '#15803d')}>Log Offline Book Study</Text>
                      <Text style={[txt(10, false, C.muted), { marginTop: 1 }]} numberOfLines={1}>
                        Includes past hours entry, textbooks, and library study
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#059669" />
                </TouchableOpacity>
              </View>

              {/* 5. Sound Alerts */}
              <View style={{ marginBottom: 16, paddingTop: 14, borderTopWidth: 1, borderColor: C.line }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, marginRight: 8, minWidth: 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="volume-high-outline" size={16} color={C.blue} />
                      <Text style={txt(12, true)}>{t('soundAlerts')}</Text>
                    </View>
                    <Text style={[txt(10, false, C.muted), { marginTop: 2 }]}>
                      {t('soundAlertsDesc')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      const next = !timerSoundEnabled;
                      setTimerSoundEnabled(next);
                      await AsyncStorage.setItem('abhyas_timer_sound', String(next));
                      if (next) playTimerTone('start');
                    }}
                    style={{
                      backgroundColor: timerSoundEnabled ? C.blue : (isDark ? '#334155' : '#e2e8f0'),
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 12
                    }}
                  >
                    <Text style={txt(10, true, timerSoundEnabled ? '#ffffff' : C.muted)}>
                      {timerSoundEnabled ? t('on') : t('off')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 6. Sign Out Button */}
              <View style={{ marginBottom: 12, paddingTop: 14, borderTopWidth: 1, borderColor: C.line }}>
                <TouchableOpacity
                  onPress={async () => {
                    showAppDialog({
                      title: t('signOut') || 'Sign Out',
                      message: `${t('confirmSignOut') || 'Are you sure you want to sign out?'}\n\n${user?.name || ''} (${user?.email || ''})`,
                      icon: 'log-out-outline',
                      type: 'confirm',
                      danger: true,
                      confirmText: t('signOut') || 'Sign Out',
                      cancelText: t('cancel') || 'Cancel',
                      onConfirm: () => {
                        closeAppDialog();
                        setSettingsOpen(false);
                        handleSignOut();
                      }
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDark ? '#3b181e' : '#fef2f2',
                    borderColor: isDark ? '#7f1d1d' : '#fecaca',
                    borderWidth: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    gap: 6
                  }}
                >
                  <Ionicons name="log-out-outline" size={16} color="#ef4444" />
                  <Text style={txt(12, true, '#ef4444')}>{t('signOut')}</Text>
                </TouchableOpacity>
              </View>

              {/* App Info Footer */}
              <View style={{ alignItems: 'center', paddingVertical: 6 }}>
                <Text style={txt(10, false, C.muted)}>{t('appVersion')}</Text>
              </View>
            </ScrollView>

            {/* Modal Bottom Action */}
            <View
              style={{
                padding: 12,
                borderTopWidth: 1,
                borderColor: C.line,
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                alignItems: 'center'
              }}
            >
              <TouchableOpacity
                onPress={() => setSettingsOpen(false)}
                style={{
                  backgroundColor: C.blue,
                  width: '100%',
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(12, true, '#ffffff')}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ManualLogModal = () => {
    if (!manualLogOpen) return null;

    const isOffline = manualLogMode === 'offline';

    return (
      <Modal
        visible={manualLogOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setManualLogOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 16,
            width: '100%'
          }}
        >
          <View
            style={{
              backgroundColor: C.cardBg,
              width: '100%',
              maxWidth: 480,
              maxHeight: Platform.OS === 'web' ? '88vh' : '92%',
              height: Platform.OS === 'web' ? '88vh' : undefined,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: C.line,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: C.line,
                backgroundColor: isDark ? '#1e293b' : '#f8fafc'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: isOffline ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#431407' : '#ffedd5'),
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name={isOffline ? 'book-outline' : 'time-outline'}
                    size={18}
                    color={isOffline ? (isDark ? '#34d399' : '#059669') : (isDark ? '#fb923c' : '#ea580c')}
                  />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text numberOfLines={1} style={txt(14, true)}>
                    {isOffline ? 'Log Offline Book Study' : 'Past Hours Entry'}
                  </Text>
                  <Text numberOfLines={1} style={txt(10, false, C.muted)}>
                    {isOffline ? 'Textbooks, library & offline study' : 'Manual entry for past study sessions'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setManualLogOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: C.soft,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Ionicons name="close" size={18} color={C.muted} />
              </TouchableOpacity>
            </View>

            {/* Mode Switcher Tabs inside Log Offline Study */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderColor: C.line,
                backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                gap: 8,
                width: '100%'
              }}
            >
              <TouchableOpacity
                onPress={() => setManualLogMode('offline')}
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingVertical: 7,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: isOffline ? (isDark ? '#064e3b' : '#dcfce7') : 'transparent',
                  borderWidth: 1,
                  borderColor: isOffline ? (isDark ? '#059669' : '#86efac') : 'transparent'
                }}
              >
                <Text style={txt(11, true, isOffline ? (isDark ? '#34d399' : '#15803d') : C.muted)}>
                  Offline Book Study
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setManualLogMode('past')}
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingVertical: 7,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: !isOffline ? (isDark ? '#431407' : '#ffedd5') : 'transparent',
                  borderWidth: 1,
                  borderColor: !isOffline ? (isDark ? '#ea580c' : '#fed7aa') : 'transparent'
                }}
              >
                <Text style={txt(11, true, !isOffline ? (isDark ? '#fb923c' : '#c2410c') : C.muted)}>
                  Past Hours Entry
                </Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable Form Content */}
            <ScrollView
              style={{ flex: 1, minHeight: 0, width: '100%' }}
              contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 14 }}
              showsVerticalScrollIndicator={true}
            >
              {/* 1. Target Exam Section */}
              <Text style={txt(11, true, C.muted)}>TARGET EXAM SECTION</Text>
              <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12, gap: 6, flexWrap: 'wrap' }}>
                <Chip
                  label="All Subjects"
                  active={manualExamFilter === 'ALL'}
                  onPress={() => setManualExamFilter('ALL')}
                />
                <Chip
                  label="UPSC"
                  active={manualExamFilter === 'UPSC'}
                  onPress={() => setManualExamFilter('UPSC')}
                />
                <Chip
                  label="MPSC"
                  active={manualExamFilter === 'MPSC'}
                  onPress={() => setManualExamFilter('MPSC')}
                />
              </View>

              {/* 2. Select Subject (Proper alignment, wraps long subjects safely) */}
              <Text style={txt(11, true, C.muted)}>SELECT SUBJECT</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginBottom: 12, width: '100%' }}>
                {subjects
                  .filter(s => {
                    if (manualExamFilter === 'ALL') return true;
                    const sExam = s.exam || (s.id.startsWith('mpsc') ? 'MPSC' : 'UPSC');
                    return sExam === manualExamFilter;
                  })
                  .map(s => {
                    const isSel = (manualSubject || selected) === s.id;
                    return (
                      <Chip
                        key={s.id}
                        label={getSubjectName(s, lang)}
                        active={isSel}
                        onPress={() => setManualSubject(s.id)}
                        numberOfLines={2}
                        style={{
                          maxWidth: '100%',
                          flexShrink: 1,
                          marginRight: 6,
                          marginBottom: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6
                        }}
                      />
                    );
                  })}
              </View>

              {/* 3. Study Date in DD/MM/YYYY format */}
              <Text style={txt(11, true, C.muted)}>STUDY DATE (DD/MM/YYYY)</Text>
              <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 6, gap: 6, flexWrap: 'wrap' }}>
                <Chip
                  label={`Today (${todayDMY()})`}
                  active={manualDate === 'today'}
                  onPress={() => {
                    setManualDate('today');
                    setManualCustomDate(todayDMY());
                  }}
                />
                <Chip
                  label={`Yesterday (${yesterdayDMY()})`}
                  active={manualDate === 'yesterday'}
                  onPress={() => {
                    setManualDate('yesterday');
                    setManualCustomDate(yesterdayDMY());
                  }}
                />
                <Chip
                  label="Specific Date"
                  active={manualDate === 'custom'}
                  onPress={() => setManualDate('custom')}
                />
              </View>
              {manualDate === 'custom' && (
                <View style={{ marginBottom: 12 }}>
                  <TextInput
                    value={manualCustomDate}
                    onChangeText={setManualCustomDate}
                    placeholder="DD/MM/YYYY (e.g. 02/11/2026)"
                    placeholderTextColor={C.muted}
                    style={[input, { marginTop: 4, marginBottom: 0 }]}
                    keyboardType="numbers-and-punctuation"
                  />
                  <Text style={[txt(10, false, C.muted), { marginTop: 3 }]}>
                    Format: DD/MM/YYYY (Day/Month/Year)
                  </Text>
                </View>
              )}
              {manualDate !== 'custom' && (
                <View style={{ marginBottom: 8 }} />
              )}

              {/* 4. Study Activity Section */}
              <Text style={txt(11, true, C.muted)}>STUDY ACTIVITY</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginBottom: 12, width: '100%' }}>
                {[
                  'Theory & Reading',
                  'PYQs & MCQs',
                  'Mains Answer Writing',
                  'Current Affairs',
                  'Revision'
                ].map(act => (
                  <Chip
                    key={act}
                    label={act}
                    active={manualActivity === act}
                    onPress={() => setManualActivity(act)}
                    style={{ marginRight: 6, marginBottom: 6 }}
                  />
                ))}
              </View>

              {/* 5. Duration Studied: Just Hrs and Min */}
              <Text style={txt(11, true, C.muted)}>DURATION STUDIED (HOURS &amp; MINUTES)</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 12, width: '100%' }}>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={txt(11, false, C.muted)}>Hours (Hrs)</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={manualHours}
                    onChangeText={setManualHours}
                    placeholder="e.g. 2"
                    placeholderTextColor={C.muted}
                    style={input}
                  />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={txt(11, false, C.muted)}>Minutes (Min)</Text>
                  <TextInput
                    keyboardType="numeric"
                    value={manualMinutes}
                    onChangeText={setManualMinutes}
                    placeholder="e.g. 30"
                    placeholderTextColor={C.muted}
                    style={input}
                  />
                </View>
              </View>

              {/* 6. Chapter / Topic Note (Optional) */}
              <Text style={txt(11, true, C.muted)}>CHAPTER / TOPIC NOTE (OPTIONAL)</Text>
              <TextInput
                value={manualTopic}
                onChangeText={setManualTopic}
                placeholder="e.g. Fundamental Rights Article 19-22 notes & questions"
                placeholderTextColor={C.muted}
                style={input}
              />
            </ScrollView>

            {/* Modal Bottom Action */}
            <View
              style={{
                padding: 12,
                borderTopWidth: 1,
                borderColor: C.line,
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                flexDirection: 'row',
                gap: 8
              }}
            >
              <TouchableOpacity
                onPress={() => setManualLogOpen(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  backgroundColor: C.soft,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={txt(12, true, C.muted)}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveManualSession}
                disabled={isLoggingManual}
                style={{
                  flex: 1,
                  backgroundColor: isOffline ? '#059669' : C.blue,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={txt(12, true, '#ffffff')}>
                  {isLoggingManual
                    ? 'Saving Session...'
                    : `Save ${manualHours || 0}h ${manualMinutes || 0}m Study Time`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const tabs = [
    ['Dashboard', 'home-outline'],
    ['Timer', 'stopwatch-outline'],
    ['Syllabus', 'book-outline'],
    ['Planner', 'calendar-outline'],
    ['Analytics', 'analytics-outline'],
    ['Ticket Support', 'headset-outline']
  ];

  return (
    <ThemeContext.Provider value={C}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: C.bg,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.bg} />

        {/* Header (Hidden in Focus Mode) */}
        {!focusMode && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: C.cardBg,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: C.line,
            width: '100%'
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="book-outline" color={C.blue} size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 10, minWidth: 0 }}>
            <Text numberOfLines={1} style={txt(15, true)}>Abhyas Tracker</Text>
            <Text numberOfLines={1} style={txt(10, false, C.muted)}>
              UPSC &amp; MPSC • {tab === 'Dashboard' ? t('dashboard') : tab === 'Timer' ? t('timer') : tab === 'Syllabus' ? t('syllabus') : tab === 'Planner' ? t('planner') : tab === 'Analytics' ? t('analytics') : (tab === 'Ticket Support' || tab === 'Support') ? t('ticketSupport', 'Ticket Support') : tab}
            </Text>
          </View>

          {/* Header Action Buttons */}
          <TouchableOpacity
            onPress={() => {
              setProfileOpen(false);
              setNotifOpen(!notifOpen);
            }}
            accessibilityLabel="Notifications"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? '#1e2942' : '#f0f4fd',
              borderWidth: 1,
              borderColor: isDark ? '#334155' : '#dbeafe',
              position: 'relative',
              marginRight: 6
            }}
          >
            <Ionicons
              name={notifOpen ? "notifications" : "notifications-outline"}
              size={18}
              color={C.blue}
            />
            {unread.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e44242'
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setNotifOpen(false);
              setProfileOpen(true);
            }}
            accessibilityLabel="Student Profile"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? '#1e2942' : '#f0f4fd',
              borderWidth: 1,
              borderColor: isDark ? '#334155' : '#dbeafe',
              marginRight: 6
            }}
          >
            <Ionicons
              name={profileOpen ? "person-circle" : "person-circle-outline"}
              size={20}
              color={C.blue}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSettingsOpen(true)}
            accessibilityLabel="Settings"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? '#1e2942' : '#f0f4fd',
              borderWidth: 1,
              borderColor: isDark ? '#334155' : '#dbeafe'
            }}
          >
            <Ionicons name="settings-outline" size={18} color={C.blue} />
          </TouchableOpacity>
        </View>
        )}

        {/* Main Content Area */}
        {remindersOpen ? (
          <View style={{ flex: 1, width: '100%' }}>
            <ReminderSettingsScreen onBack={() => setRemindersOpen(false)} />
          </View>
        ) : profileOpen ? (
          <View style={{ flex: 1, width: '100%' }}>
            <StudentProfileScreen
              user={user}
              onBack={() => setProfileOpen(false)}
              onSignOut={handleSignOut}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenReminders={() => setRemindersOpen(true)}
              onProfileUpdated={async (updatedUser) => {
                const data = await req('/me', 'PATCH', {
                  name: updatedUser.name,
                  email: updatedUser.email,
                  phone: updatedUser.phone || updatedUser.mobile || '',
                  examTarget: updatedUser.examTarget,
                  preferredSubjects: updatedUser.preferredSubjects,
                });
                setUser(data.user);
                return data.user;
              }}
              studyGoal={6}
              studyStreak={Number(analytics.currentStreak) || 0}
            />
          </View>
        ) : (
          <ScrollView
            ref={mainScrollRef}
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ padding: 12, paddingBottom: 30, width: '100%' }}
          >
            {notifOpen ? (
              <NotificationsScreen
                notes={notes}
                user={user}
                onMarkRead={markNote}
                onBack={() => setNotifOpen(false)}
                C={C}
              />
            ) : tab === 'Dashboard' ? (
              <Dashboard />
            ) : tab === 'Timer' ? (
              <Timer
                elapsed={elapsed}
                running={running}
                mode={mode}
                setMode={setMode}
                startSession={startSession}
                pauseSession={pauseSession}
                finish={finish}
                resetSession={resetSession}
                saving={savingSession.current}
                selected={selected}
                subjects={subjects}
                setSelected={setSelected}
                customMinutes={customMinutes}
                setCustomMinutes={setCustomMinutes}
                focusMode={focusMode}
                setFocusMode={setFocusMode}
                zenMode={zenMode}
                setZenMode={setZenMode}
                deepZenUnlocked={deepZenUnlocked}
                setDeepZenUnlocked={setDeepZenUnlocked}
                deepZenLocked={deepZenLocked}
                requestExitFocus={() => setExitFocusConfirmOpen(true)}
                theme={C}
                isDarkMode={isDark}
              />
            ) : tab === 'Syllabus' ? (
              <Syllabus />
            ) : tab === 'Planner' ? (
              <Planner />
            ) : tab === 'Ticket Support' || tab === 'Support' ? (
              <TicketSupportScreen
                user={user}
                theme={C}
                isDarkMode={isDark}
                onBack={() => setTab('Dashboard')}
                req={req}
              />
            ) : (
              <Analytics />
            )}
          </ScrollView>
        )}

        {/* Settings Modal Sheet */}
        <SettingsModal />

        {/* Dedicated Manual & Offline Study Logger Modal */}
        <ManualLogModal />

        {/* Global In-App Dialog / Popup Modal (Replaces browser popups) */}
        {Boolean(appDialog) && (
          <Modal
            visible={Boolean(appDialog)}
            transparent
            animationType="fade"
            onRequestClose={closeAppDialog}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
              }}
            >
              <View
                style={{
                  width: '100%',
                  maxWidth: 420,
                  backgroundColor: C.cardBg,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: C.line,
                  padding: 24,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.25,
                  shadowRadius: 24,
                  elevation: 10
                }}
              >
                {/* Icon & Title */}
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: appDialog.danger
                        ? (isDark ? '#451a1a' : '#fee2e2')
                        : appDialog.type === 'error'
                        ? (isDark ? '#451a1a' : '#fee2e2')
                        : appDialog.type === 'success'
                        ? (isDark ? '#143823' : '#dcfce7')
                        : (isDark ? '#1e293b' : '#eff6ff'),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12
                    }}
                  >
                    <Ionicons
                      name={appDialog.icon || (appDialog.danger ? 'log-out-outline' : 'information-circle-outline')}
                      size={28}
                      color={
                        appDialog.danger || appDialog.type === 'error'
                          ? C.red
                          : appDialog.type === 'success'
                          ? C.green
                          : C.blue
                      }
                    />
                  </View>
                  <Text style={[txt(18, true, C.ink), { textAlign: 'center' }]}>
                    {appDialog.title}
                  </Text>
                </View>

                {/* Message */}
                {Boolean(appDialog.message) && (
                  <Text
                    style={[
                      txt(13, false, C.muted),
                      { textAlign: 'center', lineHeight: 20, marginBottom: 22 }
                    ]}
                  >
                    {appDialog.message}
                  </Text>
                )}

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {Boolean(appDialog.cancelText) && (
                    <TouchableOpacity
                      onPress={() => {
                        if (appDialog.onCancel) appDialog.onCancel();
                        else closeAppDialog();
                      }}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: C.soft,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={txt(13, true, C.ink)}>{appDialog.cancelText}</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (appDialog.onConfirm) appDialog.onConfirm();
                      else closeAppDialog();
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: appDialog.danger
                        ? C.red
                        : appDialog.type === 'error'
                        ? C.red
                        : C.blue,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={txt(13, true, '#ffffff')}>{appDialog.confirmText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Bottom Navigation (Hidden in Focus Mode) */}
        {!focusMode && (
        <View
          style={{
            backgroundColor: C.cardBg,
            borderTopWidth: 1,
            borderColor: C.line,
            flexDirection: 'row',
            paddingVertical: 10,
            width: '100%'
          }}
        >
          {tabs.map(([tName, ic]) => {
            const tabKey = {
              Dashboard: 'dashboard',
              Timer: 'timer',
              Syllabus: 'syllabus',
              Planner: 'planner',
              Analytics: 'analytics',
              'Ticket Support': 'ticketSupport',
              Support: 'ticketSupport'
            }[tName] || tName.toLowerCase();

            return (
              <TouchableOpacity
                key={tName}
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() => {
                  handleTabChange(tName);
                  refresh();
                }}
              >
                <Ionicons name={ic} size={22} color={tab === tName ? C.blue : (isDark ? '#94a3b8' : '#667080')} />
                <Text style={txt(10, tab === tName, tab === tName ? C.blue : C.muted)}>{t(tabKey, tName)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        )}

        {/* Abhyas Mitra - Friendly UPSC & MPSC Study Companion Chatbot */}
        {!focusMode && (
          <AbhyasMitra
            isDark={isDark}
            currentLang={lang}
            onLangChange={changeLanguage}
            token={token}
            user={user}
            sessions={sessions}
            plans={plans}
            onNavigateTab={(tName) => {
              setTab(tName);
              refresh();
            }}
            onStartTimer={(subId, topicTitle) => {
              handleStartFocus(subId, topicTitle);
            }}
          />
        )}

        {/* Reset confirmation dialog */}
        {resetConfirmOpen && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              zIndex: 999,
              elevation: 20
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 380,
                backgroundColor: C.white,
                borderRadius: 18,
                padding: 24,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>
                Reset study session?
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 24,
                  color: C.muted,
                  fontSize: 14,
                  lineHeight: 21
                }}
              >
                Your current unsaved study time will be discarded.
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={cancelReset}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.soft,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: C.blue, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmReset}
                  disabled={savingSession.current}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: '#DC2626',
                    alignItems: 'center',
                    opacity: savingSession.current ? 0.55 : 1
                  }}
                >
                  <Text style={{ color: C.white, fontWeight: '600' }}>Reset</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Exit Focus Mode Confirmation Dialog */}
        {exitFocusConfirmOpen && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
              zIndex: 1000,
              elevation: 21
            }}
          >
            <View
              style={{
                width: '100%',
                maxWidth: 380,
                backgroundColor: C.cardBg,
                borderRadius: 18,
                padding: 24,
                borderWidth: 1,
                borderColor: C.line
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink }}>
                Exit Focus Mode?
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  marginBottom: 24,
                  color: C.muted,
                  fontSize: 14,
                  lineHeight: 21
                }}
              >
                Are you sure you want to leave Focus Mode and return to normal navigation?
              </Text>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setExitFocusConfirmOpen(false)}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.soft,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: C.blue, fontWeight: '700' }}>
                    Stay Focused
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setExitFocusConfirmOpen(false);
                    setFocusMode(false);
                  }}
                  style={{
                    flex: 1,
                    padding: 13,
                    borderRadius: 10,
                    backgroundColor: C.blue,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#ffffff', fontWeight: '700' }}>
                    Exit Focus Mode
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}

const input = {
  backgroundColor: C.white,
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 11,
  marginTop: 6,
  marginBottom: 10,
  color: C.ink,
  fontSize: 13
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#edf2fc'
  }
});
