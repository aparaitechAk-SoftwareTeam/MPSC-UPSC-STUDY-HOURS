import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { smartApiFetch } from './api';

// Multilingual labels matching exact user requirements
const UI_TEXT = {
  en: {
    title: 'Abhyas Mitra',
    subtitle: 'Online • Study Companion',
    placeholder: 'Ask a question or tap mic to speak...',
    moodTitle: 'Daily Mood Check-in',
    moodSubtitle: 'How are you feeling today?',
    moods: [
      { id: 'energized', label: 'Energized' },
      { id: 'focused', label: 'Focused' },
      { id: 'tired', label: 'Tired' },
      { id: 'anxious', label: 'Anxious' }
    ],
    greeting: (name) =>
      `Hello, ${name || 'Aspirant'}! 👋\n\nI'm Abhyas Mitra, your friendly UPSC & MPSC preparation companion.\n\nWhat shall we work on today?`,
    features: {
      study: 'Study Help',
      planning: 'Study Planning',
      anxiety: 'Anxiety Support',
      comeback: 'Study Comeback',
      eli10: "Explain Like I'm 10",
      revision: 'Revision Reminder'
    },
    quickActionsLabel: 'Quick Actions (6 Features)',
    collapse: 'Show Less ▴',
    expand: 'View All ▾',
    helplineBtn: '📞 Call Tele-MANAS: 14416 (Free 24/7)',
    openPlannerBtn: 'Open Study Planner',
    startTimerBtn: 'Start Focus Timer',
    privacyNote: '100% Free & Private • Rule-based study companion',
    settings: 'Settings',
    language: 'Language / भाषा',
    languageSub: 'Select conversation language',
    appearance: 'Theme Mode',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    chatHistory: 'Conversation History',
    chatHistorySub: 'Keep conversation on your device',
    savedChats: 'Saved Sessions',
    viewAll: 'View All',
    newChat: '+ New Chat',
    noChatsYet: 'No past chats yet',
    noChatsSub: 'Your study discussions with Abhyas Mitra will appear here.',
    startChatting: 'Start a Conversation',
    activeChat: 'Active',
    messagesCount: 'messages',
    untitledChat: 'Study Session',
    voiceReading: 'Voice Auto-Read',
    voiceReadingSub: 'Read answers aloud automatically',
    clearChat: 'Clear Conversation',
    clearChatSub: 'Reset messages and start fresh',
    clearConfirmTitle: 'Clear conversation?',
    clearConfirmMsg: 'This will reset your messages and start a fresh study session.',
    cancel: 'Cancel',
    listening: 'Listening in English... Speak your question now',
    listen: 'Listen',
    stop: 'Stop',
    thinking: 'Mitra is thinking...',
    readingAloud: 'Reading response aloud...',
    privacyNotice: '🔒 100% Free & Private • Processed locally • No audio saved',
    aiEngine: 'AI Knowledge Engine',
    aiEngineGeminiActive: 'Google Gemini 1.5 Flash Active',
    aiEngineBuiltinActive: 'Zero-Config Universal Engine (Free)',
    aiEngineKeyHelp: 'Enter your free Google Gemini API key (from aistudio.google.com) for deep reasoning. Or leave blank to use the built-in free universal knowledge engine!',
    aiEnginePlaceholder: 'AIzaSy... (optional)',
    aiEngineSave: 'Save',
    aiEngineClear: 'Remove Key'
  },
  mr: {
    title: 'अभ्यास मित्र',
    subtitle: 'सक्रिय • अभ्यास साथीदार',
    placeholder: 'प्रश्न विचारा किंवा बोला...',
    moodTitle: 'दैनिक मूड चेक-इन',
    moodSubtitle: 'आज तुम्हाला कसे वाटते आहे?',
    moods: [
      { id: 'energized', label: 'उत्साही' },
      { id: 'focused', label: 'एकाग्र' },
      { id: 'tired', label: 'थकवा' },
      { id: 'anxious', label: 'ताण' }
    ],
    greeting: (name) =>
      `नमस्ते, ${name || 'मित्रा'}! 👋\n\nमी अभ्यास मित्र, तुमचा मैत्रीपूर्ण यूपीएससी व एमपीएससी अभ्यास साथीदार.\n\nआज आपण कशावर काम करूया?`,
    features: {
      study: 'अभ्यास मदत',
      planning: 'अभ्यास नियोजन',
      anxiety: 'ताण निवारण',
      comeback: 'अभ्यास कमबॅक',
      eli10: 'सोप्या भाषेत',
      revision: 'उजळणी आठवण'
    },
    quickActionsLabel: 'मुख्य वैशिष्ट्ये (६ फीचर्स)',
    collapse: 'कमी करा ▴',
    expand: 'सर्व ६ पहा ▾',
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (मोफत)',
    openPlannerBtn: 'प्लॅनर उघडा',
    startTimerBtn: 'टायमर सुरू करा',
    privacyNote: '१००% मोफत व सुरक्षित • अभ्यास साथीदार',
    settings: 'सेटिंग्ज',
    language: 'भाषा निवडा',
    languageSub: 'संभाषणाची भाषा बदला',
    appearance: 'थीम मोड',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    chatHistory: 'संभाषण इतिहास',
    chatHistorySub: 'डिव्हाइसवर संभाषण सुरक्षित ठेवा',
    savedChats: 'साठवलेली सत्रे',
    viewAll: 'सर्व पहा',
    newChat: '+ नवीन चॅट',
    noChatsYet: 'अद्याप कोणतेही जुने चॅट नाहीत',
    noChatsSub: 'अभ्यास मित्रासोबतचे तुमचे संभाषण येथे सुरक्षित साठवले जाईल.',
    startChatting: 'नवीन चर्चा सुरू करा',
    activeChat: 'सक्रिय',
    messagesCount: 'मेसेज',
    untitledChat: 'अभ्यास सत्र',
    voiceReading: 'व्हॉइस ऑटो-रीड',
    voiceReadingSub: 'उत्तरे आपोआप वाचून दाखवा',
    clearChat: 'चॅट साफ करा',
    clearChatSub: 'नवीन अभ्यास सत्र सुरू करा',
    clearConfirmTitle: 'चॅट साफ करायचे का?',
    clearConfirmMsg: 'यामुळे तुमचे सध्याचे संभाषण साफ होईल व नवीन सत्र सुरू होईल.',
    cancel: 'रद्द करा',
    listening: 'मराठीत ऐकत आहे... तुमचा प्रश्न बोला',
    listen: 'ऐका',
    stop: 'थांबवा',
    thinking: 'मित्र विचार करत आहे...',
    readingAloud: 'उत्तर वाचून दाखवत आहे...',
    privacyNotice: '🔒 १००% मोफत व सुरक्षित • डिव्हाइसवर प्रक्रिया • ऑडिओ साठवला जात नाही',
    aiEngine: 'AI ज्ञान इंजिन',
    aiEngineGeminiActive: 'गुगल जेमिनी १.५ फ्लॅश सक्रिय',
    aiEngineBuiltinActive: 'युनिव्हर्सल नॉलेज इंजिन (मोफत)',
    aiEngineKeyHelp: 'प्रगत ज्ञानासाठी मोफत Google Gemini Key (aistudio.google.com) टाका, किंवा आमचे मोफत अंगभूत इंजिन वापरा!',
    aiEnginePlaceholder: 'AIzaSy... (पर्यायी)',
    aiEngineSave: 'साठवा',
    aiEngineClear: 'की काढून टाका'
  },
  hi: {
    title: 'अभ्यास मित्र',
    subtitle: 'सक्रिय • स्टडी साथी',
    placeholder: 'सवाल पूछें या बोलें...',
    moodTitle: 'दैनिक मूड चेक-इन',
    moodSubtitle: 'आज आप कैसा महसूस कर रहे हैं?',
    moods: [
      { id: 'energized', label: 'ऊर्जान्वित' },
      { id: 'focused', label: 'एकाग्र' },
      { id: 'tired', label: 'थकावट' },
      { id: 'anxious', label: 'तनाव' }
    ],
    greeting: (name) =>
      `नमस्ते, ${name || 'साथी'}! 👋\n\nमैं अभ्यास मित्र, आपका आत्मीय यूपीएससी व एमपीएससी तैयारी साथी।\n\nआज हम किस पर काम करें?`,
    features: {
      study: 'स्टडी हेल्प',
      planning: 'स्टडी प्लानिंग',
      anxiety: 'तनाव मुक्ति',
      comeback: 'स्टडी कमबैक',
      eli10: 'सरल शब्दों में',
      revision: 'रिवीजन रिमाइंडर'
    },
    quickActionsLabel: 'मुख्य सुविधाएं (६ फीचर्स)',
    collapse: 'कम दिखाएं ▴',
    expand: 'सभी ६ देखें ▾',
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (निःशुल्क)',
    openPlannerBtn: 'प्लानर खोलें',
    startTimerBtn: 'टाइमर शुरू करें',
    privacyNote: '100% निःशुल्क और सुरक्षित • सच्चा साथी',
    settings: 'सेटिंग्स',
    language: 'भाषा चुनें',
    languageSub: 'बातचीत की भाषा बदलें',
    appearance: 'थीम मोड',
    darkMode: 'डार्क मोड',
    lightMode: 'लाइट मोड',
    chatHistory: 'बातचीत इतिहास',
    chatHistorySub: 'डिवाइस पर बातचीत सुरक्षित रखें',
    savedChats: 'सहेजे गए सत्र',
    viewAll: 'सभी देखें',
    newChat: '+ नया चैट',
    noChatsYet: 'अभी तक कोई पिछला चैट नहीं है',
    noChatsSub: 'अभ्यास मित्र के साथ आपकी पढ़ाई की बातचीत यहाँ दिखेगी।',
    startChatting: 'बातचीत शुरू करें',
    activeChat: 'सक्रिय',
    messagesCount: 'संदेश',
    untitledChat: 'स्टडी सत्र',
    voiceReading: 'वॉयस ऑटो-रीड',
    voiceReadingSub: 'उत्तर अपने आप बोलकर सुनाएं',
    clearChat: 'चैट साफ करें',
    clearChatSub: 'नया स्टडी सत्र शुरू करें',
    clearConfirmTitle: 'चैट साफ करें?',
    clearConfirmMsg: 'इससे वर्तमान बातचीत साफ हो जाएगी और नया सत्र शुरू होगा।',
    cancel: 'रद्द करें',
    listening: 'हिंदी में सुन रहा हूँ... अपना सवाल बोलिए',
    listen: 'सुनें',
    stop: 'रोकें',
    thinking: 'मित्र विचार कर रहा है...',
    readingAloud: 'उत्तर सुनाया जा रहा है...',
    privacyNotice: '🔒 100% निःशुल्क और सुरक्षित • डिवाइस पर प्रोसेस • कोई ऑडियो सेव नहीं',
    aiEngine: 'AI ज्ञान इंजन',
    aiEngineGeminiActive: 'गूगल जेमिनी 1.5 फ्लैश सक्रिय',
    aiEngineBuiltinActive: 'यूनिवर्सल नॉलेज इंजन (निःशुल्क)',
    aiEngineKeyHelp: 'उन्नत समझ के लिए मुफ्त Google Gemini Key (aistudio.google.com) जोड़ें, या हमारा इन-बिल्ट फ्री इंजन इस्तेमाल करें!',
    aiEnginePlaceholder: 'AIzaSy... (वैकल्पिक)',
    aiEngineSave: 'सहेजें',
    aiEngineClear: 'की हटाएं'
  }
};

// Clean markdown text before speaking aloud
function cleanTextForSpeech(text) {
  return String(text || '')
    .replace(/[#*_~`•▶\-\[\]\(\)]/g, ' ')
    .replace(/http\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function AbhyasMitra({
  isDark = false,
  currentLang = 'en',
  onLangChange,
  token,
  user,
  sessions = [],
  plans = [],
  onNavigateTab,
  onStartTimer
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(currentLang || 'en');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMoodBanner, setShowMoodBanner] = useState(true);
  const [showFeaturesBar, setShowFeaturesBar] = useState(false);
  const [featuresGridModal, setFeaturesGridModal] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => 'sess_' + Date.now());
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [saveChatHistory, setSaveChatHistory] = useState(true);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [chatbotDark, setChatbotDark] = useState(Boolean(isDark));
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [voiceGender, setVoiceGender] = useState('female'); // 'female' | 'male'
  const [isSpeakingId, setIsSpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  const storageKey = `@abhyas_mitra_sessions_${user?.id || user?._id || 'local'}`;
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [tempGeminiKey, setTempGeminiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('@abhyas_mitra_gemini_key').then(val => {
      if (val) {
        setGeminiApiKey(val);
        setTempGeminiKey(val);
      }
    }).catch(() => {});
  }, []);

  const handleSaveGeminiKey = async () => {
    const trimmed = (tempGeminiKey || '').trim();
    setGeminiApiKey(trimmed);
    try {
      if (trimmed) {
        await AsyncStorage.setItem('@abhyas_mitra_gemini_key', trimmed);
      } else {
        await AsyncStorage.removeItem('@abhyas_mitra_gemini_key');
      }
    } catch (e) {}
    setShowApiKeyInput(false);
  };

  const handleClearGeminiKey = async () => {
    setGeminiApiKey('');
    setTempGeminiKey('');
    try {
      await AsyncStorage.removeItem('@abhyas_mitra_gemini_key');
    } catch (e) {}
    setShowApiKeyInput(false);
  };

  // Sync active language and theme with parent if updated
  useEffect(() => {
    if (currentLang && ['en', 'mr', 'hi'].includes(currentLang)) {
      setActiveLang(currentLang);
    }
  }, [currentLang]);

  useEffect(() => {
    setChatbotDark(Boolean(isDark));
  }, [isDark]);

  const t = UI_TEXT[activeLang] || UI_TEXT.en;
  const userName = user?.name ? user.name.split(' ')[0] : 'Bhumika';
  const completedPlansCount = (plans || []).filter(p => p.done).length;

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'mitra',
      text: t.greeting(userName),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Load saved chat history from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadSavedChats = async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw && isMounted) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed);
            const latest = parsed[0];
            if (latest && Array.isArray(latest.messages) && latest.messages.length > 0) {
              setCurrentSessionId(latest.id);
              setMessages(latest.messages);
              setShowMoodBanner(false);
            }
          }
        }
      } catch (err) {
        console.warn('Error loading chat history:', err);
      }
    };
    loadSavedChats();
    return () => { isMounted = false; };
  }, [storageKey]);

  // Auto-sync conversation list and persist to AsyncStorage whenever messages change
  useEffect(() => {
    if (!saveChatHistory || !currentSessionId || messages.length === 0) return;

    const userMsg = messages.find(m => m.sender === 'user');
    const autoTitle = userMsg
      ? (userMsg.text.slice(0, 32) + (userMsg.text.length > 32 ? '...' : ''))
      : (UI_TEXT[activeLang] || UI_TEXT.en).untitledChat;

    setConversations(prev => {
      const existingIdx = prev.findIndex(c => c.id === currentSessionId);
      let updated;
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        if (
          existing.messages.length === messages.length &&
          existing.messages[existing.messages.length - 1]?.id === messages[messages.length - 1]?.id
        ) {
          return prev;
        }
        const updatedItem = {
          ...existing,
          title: existing.title === (UI_TEXT[activeLang] || UI_TEXT.en).untitledChat && userMsg ? autoTitle : existing.title,
          updatedAt: new Date().toISOString(),
          messages
        };
        updated = [updatedItem, ...prev.filter(c => c.id !== currentSessionId)];
      } else {
        const newItem = {
          id: currentSessionId,
          title: autoTitle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages
        };
        updated = [newItem, ...prev];
      }
      AsyncStorage.setItem(storageKey, JSON.stringify(updated.slice(0, 50))).catch(() => {});
      return updated;
    });
  }, [messages, currentSessionId, saveChatHistory, storageKey, activeLang]);

  const handleStartNewChat = () => {
    stopVoice();
    stopListening();
    const newId = 'sess_' + Date.now();
    setCurrentSessionId(newId);
    const welcome = [
      {
        id: 'welcome_' + Date.now(),
        sender: 'mitra',
        text: (UI_TEXT[activeLang] || UI_TEXT.en).greeting(userName),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(welcome);
    setShowMoodBanner(true);
    setHistoryModalOpen(false);
    setSettingsModalOpen(false);
  };

  const handleLoadConversation = (conv) => {
    stopVoice();
    stopListening();
    setCurrentSessionId(conv.id);
    setMessages(conv.messages || []);
    setShowMoodBanner(false);
    setHistoryModalOpen(false);
    setSettingsModalOpen(false);
  };

  const handleDeleteConversation = async (convId) => {
    try {
      const updated = conversations.filter(c => c.id !== convId);
      setConversations(updated);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
      if (convId === currentSessionId) {
        handleStartNewChat();
      }
    } catch (e) {
      console.warn('Failed to delete chat:', e);
    }
  };

  const handleClearChat = () => {
    stopVoice();
    stopListening();
    handleStartNewChat();
    setClearConfirmOpen(false);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isOpen]);

  // Clean speech when closing or changing message
  useEffect(() => {
    if (!isOpen) {
      stopVoice();
      stopListening();
    }
  }, [isOpen]);

  // Text-To-Speech Function (Works on Web & Android)
  const speakText = (text, messageId = null) => {
    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    // If already speaking this message, stop it
    if (isSpeakingId === messageId && messageId !== null) {
      stopVoice();
      return;
    }

    stopVoice();
    setIsSpeakingId(messageId);

    const langCode = activeLang === 'mr' ? 'mr-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-IN';
    const pitch = voiceGender === 'female' ? 1.15 : 0.85;

    // 1. Web Speech Synthesis
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = langCode;
        utterance.pitch = pitch;
        utterance.rate = 0.98;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const match = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)) || v.lang === langCode);
          if (match) utterance.voice = match;
        }

        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);

        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {
        console.warn('Web speech error:', e);
      }
    }

    // 2. Native Expo Speech
    try {
      Speech.stop();
      Speech.speak(clean, {
        language: langCode,
        pitch,
        rate: 0.98,
        onDone: () => setIsSpeakingId(null),
        onError: () => setIsSpeakingId(null)
      });
    } catch (e) {
      console.warn('Expo speech error:', e);
      setIsSpeakingId(null);
    }
  };

  const stopVoice = () => {
    setIsSpeakingId(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    try { Speech.stop(); } catch {}
  };

  // Speech-To-Text Function (Microphone Input)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    // Web Speech Recognition
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          stopVoice();
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = activeLang === 'mr' ? 'mr-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-IN';

          recognition.onstart = () => {
            setIsListening(true);
          };

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (transcript && transcript.trim()) {
              setInputText(transcript.trim());
              sendMessage(transcript.trim());
            }
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
          return;
        } catch (e) {
          console.warn('Speech recognition error:', e);
          setIsListening(false);
        }
      }
    }

    // Notice if microphone recognition is unavailable in current web context
    alert(
      activeLang === 'mr'
        ? 'मायक्रोफोन इनपुटसाठी क्रोम/एज ब्राउझरमध्ये व्हॉइस परवानगी आवश्यक आहे.'
        : activeLang === 'hi'
        ? 'माइक्रोफोन इनपुट के लिए क्रोम/एज ब्राउज़र में अनुमति आवश्यक है.'
        : 'Microphone voice input is supported in Chrome, Edge, and Android speech services.'
    );
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  };

  const handleLanguageSwitch = (newLang) => {
    stopVoice();
    setActiveLang(newLang);
    if (onLangChange) onLangChange(newLang);

    const welcomeText = (UI_TEXT[newLang] || UI_TEXT.en).greeting(userName);
    setMessages(prev => [
      ...prev,
      {
        id: 'lang_' + Date.now(),
        sender: 'mitra',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const sendMessage = async (customText = null) => {
    stopVoice();
    stopListening();
    setShowMoodBanner(false);

    const textToSend = customText || inputText;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      const res = await smartApiFetch('/mitra/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          lang: activeLang,
          geminiKey: geminiApiKey || undefined
        })
      });

      const data = await res.json();
      if (data && data.reply) {
        const newMsgId = 'm_' + Date.now();
        setMessages(prev => [
          ...prev,
          {
            id: newMsgId,
            sender: 'mitra',
            text: data.reply,
            action: data.action,
            suggestedActionLabel: data.suggestedActionLabel,
            quickReplies: data.quickReplies || null,
            helpline: data.helpline,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        // Auto read aloud if enabled
        if (autoReadAloud) {
          setTimeout(() => speakText(data.reply, newMsgId), 250);
        }
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      // Offline fallback: Generates empathetic local response if backend is offline
      const fallbackReply = generateClientFallback(userMsg.text, activeLang, sessions, plans);
      const newMsgId = 'm_fallback_' + Date.now();
      setMessages(prev => [
        ...prev,
        {
          id: newMsgId,
          sender: 'mitra',
          text: fallbackReply.text,
          action: fallbackReply.action,
          suggestedActionLabel: fallbackReply.suggestedActionLabel || null,
          quickReplies: fallbackReply.quickReplies || null,
          helpline: fallbackReply.helpline,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (autoReadAloud) {
        setTimeout(() => speakText(fallbackReply.text, newMsgId), 250);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    stopVoice();
    if (action === 'emergency_support') {
      Linking.openURL('tel:14416').catch(() => {
        Linking.openURL('tel:112');
      });
      return;
    }
    if (action === 'start_pomodoro' && onStartTimer) {
      setIsOpen(false);
      onStartTimer();
      return;
    }
    if (action === 'open_planner' && onNavigateTab) {
      setIsOpen(false);
      onNavigateTab('Planner');
      return;
    }
    if (action === 'view_progress' && onNavigateTab) {
      setIsOpen(false);
      onNavigateTab('Analytics');
      return;
    }
  };

  // Color Palette tailored to Complete Light & Dark Modes
  const colors = {
    screenBg: chatbotDark ? '#111A22' : '#F4F7FA',
    cardBg: chatbotDark ? '#1D2A35' : '#FFFFFF',
    headerBg: chatbotDark ? '#1D2A35' : '#FFFFFF',
    headerBorder: chatbotDark ? '#354956' : '#E1E9ED',
    titleText: chatbotDark ? '#E8F0F3' : '#243746',
    subtitleText: chatbotDark ? '#A2B2BC' : '#718391',
    backBtnColor: chatbotDark ? '#D0DCE2' : '#405563',
    headerBtnBg: chatbotDark ? '#253440' : '#EDF2F5',
    headerBtnBorder: chatbotDark ? '#455966' : '#D5E0E6',
    headerBtnIcon: chatbotDark ? '#A2B2BC' : '#718391',
    singleLangBadgeBg: chatbotDark ? '#20353D' : '#EAF1F3',
    singleLangBadgeBorder: chatbotDark ? '#35545A' : '#C9DEDE',
    singleLangBadgeText: chatbotDark ? '#E8F0F3' : '#243746',
    border: chatbotDark ? '#354956' : '#E1E9ED',
    userBubble: chatbotDark ? '#247C78' : '#247C78',
    userBubbleBorder: chatbotDark ? '#55B8A8' : '#55A69E',
    userText: '#FFFFFF',
    mitraBubble: chatbotDark ? '#253440' : '#FFFFFF',
    mitraBubbleBorder: chatbotDark ? '#354956' : '#E1E9ED',
    mitraText: chatbotDark ? '#E8F0F3' : '#243746',
    muted: chatbotDark ? '#A2B2BC' : '#718391',
    chipBg: chatbotDark ? '#1D2A35' : '#FFFFFF',
    chipBorder: chatbotDark ? '#354956' : '#D5E0E6',
    chipText: chatbotDark ? '#D0DCE2' : '#405563',
    inputBg: chatbotDark ? '#15232D' : '#FFFFFF',
    inputBorder: chatbotDark ? '#354956' : '#D5E0E6',
    inputText: chatbotDark ? '#E8F0F3' : '#243746',
    placeholder: chatbotDark ? '#8499A5' : '#91A0AA',
    sendBg: '#247C78'
  };

  return (
    <>
      {/* ---------------- 1. FLOATING CIRCULAR LAUNCHER (FAB) ---------------- */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          activeOpacity={0.88}
          style={styles.fabButton}
          accessibilityLabel="Abhyas Mitra Study Companion"
        >
          <View style={styles.fabGlowRing} />
          <View style={[styles.fabInnerCircle, { backgroundColor: colors.sendBg, borderColor: colors.userBubbleBorder }]}>
            <Ionicons name="school" size={26} color="#FFFFFF" />
            <View style={styles.fabOnlineDot} />
          </View>
        </TouchableOpacity>
      </View>

      {/* ---------------- 2. FULL CHATBOT MODAL SCREEN ---------------- */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.screenBg }]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Top Navigation Header: Ultra-clean and compact for narrow frames */}
            <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.backBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="chevron-back" size={22} color={colors.backBtnColor} />
                </TouchableOpacity>

                <View style={[styles.avatarWrapper, { backgroundColor: '#1E3A8A', borderColor: '#38BDF8' }]}>
                  <Ionicons name="school" size={19} color="#FFFFFF" />
                  <View style={styles.avatarOnlineDot} />
                </View>

                <View style={styles.titleContainer}>
                  <Text style={[styles.headerTitle, { color: colors.titleText }]} numberOfLines={1}>
                    {t.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
                    <Text style={[styles.headerSubtitle, { color: colors.subtitleText }]} numberOfLines={1}>
                      {t.subtitle}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.headerRight}>
                {/* Single Settings Button: Opens Language, Theme, Chat History & Clear Chat */}
                <TouchableOpacity
                  onPress={() => setSettingsModalOpen(true)}
                  style={[
                    styles.headerVoiceBtn,
                    { backgroundColor: colors.headerBtnBg, borderColor: colors.headerBtnBorder }
                  ]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Settings"
                >
                  <Ionicons name="settings-outline" size={16} color={colors.headerBtnIcon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Active Voice Playback Floating Bar */}
            {Boolean(isSpeakingId) && (
              <View style={[styles.speakingBanner, { backgroundColor: chatbotDark ? '#14203D' : '#EFF6FF', borderBottomColor: chatbotDark ? '#233866' : '#BFDBFE' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Ionicons name="volume-high" size={15} color="#2563EB" />
                  <Text style={[styles.speakingBannerText, { color: chatbotDark ? '#93C5FD' : '#1D4ED8' }]} numberOfLines={1}>
                    {t.readingAloud}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={stopVoice}
                  style={styles.stopSpeakingBtn}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="stop" size={11} color="#FFFFFF" />
                  <Text style={styles.stopSpeakingBtnText}>{t.stop}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Active Speech Recognition Banner */}
            {isListening && (
              <View style={styles.listeningBanner}>
                <View style={styles.pulseDot} />
                <Text style={styles.listeningText}>{t.listening}</Text>
                <TouchableOpacity onPress={stopListening} style={{ padding: 4 }}>
                  <Ionicons name="close-circle" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Conversation Feed */}
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Message Bubbles */}
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
                const isSpeakingThis = isSpeakingId === msg.id;

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }
                    ]}
                  >
                    {!isUser && (
                      <View style={[styles.botAvatarMini, { backgroundColor: chatbotDark ? '#1E293B' : '#EFF6FF', borderColor: chatbotDark ? '#334155' : '#DBEAFE' }]}>
                        <Ionicons name="school" size={13} color={chatbotDark ? '#93C5FD' : '#2563EB'} />
                      </View>
                    )}

                    <View style={{ maxWidth: '84%' }}>
                      <View
                        style={[
                          styles.bubble,
                          isUser
                            ? {
                                backgroundColor: colors.userBubble,
                                borderColor: colors.userBubbleBorder,
                                borderTopRightRadius: 4
                              }
                            : {
                                backgroundColor: colors.mitraBubble,
                                borderColor: colors.mitraBubbleBorder,
                                borderTopLeftRadius: 4
                              }
                        ]}
                      >
                        {isUser ? (
                          <Text style={[styles.messageText, { color: colors.userText }]}>
                            {msg.text}
                          </Text>
                        ) : (
                          msg.text.split('\n\n').map((para, pIdx, arr) => (
                            <Text
                              key={pIdx}
                              style={[
                                styles.messageText,
                                {
                                  color: colors.mitraText,
                                  marginBottom: pIdx < arr.length - 1 ? 6 : 0
                                }
                              ]}
                            >
                              {para}
                            </Text>
                          ))
                        )}
                      </View>

                      {/* Interactive Mood Check-in directly under Mitra's Greeting (Auto-hides once chosen) */}
                      {showMoodBanner && !isUser && (msg.id === 'welcome_1' || String(msg.id).startsWith('welcome')) && (
                        <View style={styles.inlineMoodWrap}>
                          <Text style={[styles.inlineMoodPrompt, { color: colors.muted }]}>
                            {t.moodSubtitle}
                          </Text>
                          <View style={styles.inlineMoodPillsRow}>
                            {t.moods.map(m => (
                              <TouchableOpacity
                                key={m.id}
                                onPress={() => {
                                  setShowMoodBanner(false);
                                  sendMessage(m.label);
                                }}
                                style={[
                                  styles.inlineMoodPill,
                                  {
                                    backgroundColor: chatbotDark ? '#14203D' : '#F1F5F9',
                                    borderColor: chatbotDark ? '#223259' : '#CBD5E1'
                                  }
                                ]}
                              >
                                <Text style={[styles.inlineMoodPillText, { color: colors.titleText }]}>{m.label}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Bot Message Voice Play/Stop Button */}
                      {!isUser && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <TouchableOpacity
                            onPress={() => speakText(msg.text, msg.id)}
                            style={[
                              styles.speechBubbleBtn,
                              isSpeakingThis && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }
                            ]}
                            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                          >
                            <Ionicons
                              name={isSpeakingThis ? 'stop-circle' : 'volume-medium'}
                              size={14}
                              color={isSpeakingThis ? '#DC2626' : '#2563EB'}
                            />
                          </TouchableOpacity>

                          <Text style={[styles.timeText, { color: colors.muted }]}>
                            {msg.timestamp}
                          </Text>
                        </View>
                      )}

                      {/* Interactive Action Buttons */}
                      {msg.action === 'emergency_support' && (
                        <TouchableOpacity
                          onPress={() => handleAction('emergency_support')}
                          style={styles.emergencyBtn}
                        >
                          <Ionicons name="call" size={16} color="#ffffff" />
                          <Text style={styles.emergencyBtnText}>{t.helplineBtn}</Text>
                        </TouchableOpacity>
                      )}

                      {msg.action === 'start_pomodoro' && (
                        <TouchableOpacity
                          onPress={() => handleAction('start_pomodoro')}
                          style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                        >
                          <Ionicons name="play-circle-outline" size={16} color="#ffffff" />
                          <Text style={styles.actionBtnText}>
                            {msg.suggestedActionLabel || t.startTimerBtn}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {msg.action === 'open_planner' && (
                        <TouchableOpacity
                          onPress={() => handleAction('open_planner')}
                          style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                        >
                          <Ionicons name="calendar-outline" size={16} color="#ffffff" />
                          <Text style={styles.actionBtnText}>{msg.suggestedActionLabel || t.openPlannerBtn}</Text>
                        </TouchableOpacity>
                      )}

                      {/* Interactive Quick Replies / Options Chips */}
                      {Array.isArray(msg.quickReplies) && msg.quickReplies.length > 0 && (
                        <View style={styles.quickRepliesContainer}>
                          {msg.quickReplies.map((qr, qrIdx) => {
                            const label = typeof qr === 'string' ? qr : qr.label;
                            const promptToSend = typeof qr === 'string' ? qr : qr.prompt;
                            return (
                              <TouchableOpacity
                                key={qrIdx}
                                onPress={() => sendMessage(promptToSend)}
                                style={[
                                  styles.quickReplyChip,
                                  {
                                    backgroundColor: chatbotDark ? '#1E293B' : '#EFF6FF',
                                    borderColor: chatbotDark ? '#3B82F6' : '#BFDBFE'
                                  }
                                ]}
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.quickReplyText,
                                    { color: chatbotDark ? '#93C5FD' : '#1D4ED8' }
                                  ]}
                                >
                                  {label}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}

                      {isUser && (
                        <Text style={[styles.timeText, { color: colors.muted, textAlign: 'right' }]}>
                          {msg.timestamp}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}

              {loading && (
                <View style={[styles.messageRow, { justifyContent: 'flex-start' }]}>
                  <View style={[styles.botAvatarMini, { backgroundColor: chatbotDark ? '#1E293B' : '#EFF6FF', borderColor: chatbotDark ? '#334155' : '#DBEAFE' }]}>
                    <Ionicons name="school" size={13} color={chatbotDark ? '#93C5FD' : '#2563EB'} />
                  </View>
                  <View style={[styles.bubble, { backgroundColor: colors.mitraBubble, borderColor: colors.mitraBubbleBorder, paddingVertical: 12 }]}>
                    <ActivityIndicator size="small" color="#2563EB" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Actions Strip: Sleek 1-Row Horizontal Slider (Takes ONLY ~30px!) */}
            {showFeaturesBar && (
              <View style={[styles.compactFeaturesStrip, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <TouchableOpacity
                  onPress={() => setFeaturesGridModal(true)}
                  style={[styles.featureGridIconBtn, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="grid-outline" size={11} color="#2563EB" />
                  <Text style={styles.featureGridCountText}>6</Text>
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.compactChipsScroll}
                >
                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'मूलभूत हक्क समजावून सांगा' : activeLang === 'hi' ? 'मौलिक अधिकार क्या हैं?' : 'Explain Fundamental Rights')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="book-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.study}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास वेळापत्रक नियोजन' : activeLang === 'hi' ? 'स्टडी टाइमटेबल प्लानिंग' : 'Study planning routine')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="calendar-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.planning}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'परीक्षेचा खूप ताण आलाय' : activeLang === 'hi' ? 'परीक्षा का बहुत तनाव है' : 'I have exam anxiety')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="heart-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.anxiety}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास कमबॅक कसा करू?' : activeLang === 'hi' ? 'स्टडी कमबैक कैसे करूँ?' : 'How to do a study comeback?')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="refresh-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.comeback}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'सोप्या भाषेत समजावून सांगा' : activeLang === 'hi' ? 'सरल शब्दों में समझाइए' : "Explain Like I'm 10")}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="bulb-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.eli10}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'रिव्हिजन कशी करू?' : activeLang === 'hi' ? 'रिवीजन कैसे करूँ?' : 'Revision reminders and spaced repetition')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Ionicons name="repeat-outline" size={12} color={chatbotDark ? '#93C5FD' : '#2563EB'} style={{ marginRight: 4 }} />
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.revision}</Text>
                  </TouchableOpacity>
                </ScrollView>

                <TouchableOpacity
                  onPress={() => setShowFeaturesBar(false)}
                  style={styles.closeStripBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={13} color={colors.muted} />
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Input Area: Compact & Space-Efficient */}
            <View style={[styles.inputBar, { backgroundColor: colors.screenBg, borderTopColor: colors.border }]}>
              <View style={[styles.inputPill, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                {/* Feature Launcher Button */}
                <TouchableOpacity
                  onPress={() => setShowFeaturesBar(!showFeaturesBar)}
                  style={[
                    styles.actionToggleBtn,
                    showFeaturesBar && { backgroundColor: chatbotDark ? '#1E3A8A' : '#EFF6FF' }
                  ]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={showFeaturesBar ? 'sparkles' : 'sparkles-outline'}
                    size={16}
                    color={showFeaturesBar ? '#2563EB' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Microphone Voice Input Button (Larger 34px with Pulsing Indicator) */}
                <TouchableOpacity
                  onPress={toggleListening}
                  style={[
                    styles.micButton,
                    isListening && { backgroundColor: '#DC2626' }
                  ]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={isListening ? 'mic' : 'mic-outline'}
                    size={18}
                    color={isListening ? '#FFFFFF' : '#2563EB'}
                  />
                </TouchableOpacity>

                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={t.placeholder}
                  placeholderTextColor={chatbotDark ? '#64748B' : '#94A3B8'}
                  style={[styles.textInput, { color: colors.inputText }]}
                  multiline={true}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                />

                {/* Send Button */}
                <TouchableOpacity
                  onPress={() => sendMessage()}
                  disabled={!inputText.trim() || loading}
                  style={[
                    styles.sendIconButton,
                    {
                      backgroundColor: inputText.trim() && !loading ? '#2563EB' : (chatbotDark ? '#1E293B' : '#CBD5E1'),
                      opacity: inputText.trim() && !loading ? 1 : 0.5
                    }
                  ]}
                >
                  <Ionicons name="paper-plane" size={15} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Bottom Privacy & Safety Indicator */}
              <Text style={[styles.bottomPrivacyNotice, { color: colors.muted }]}>
                {t.privacyNotice}
              </Text>
            </View>
          </KeyboardAvoidingView>

          {/* Full 7-Features Clean Modal Sheet (Floating Overlay - Zero Screen Squashing) */}
          <Modal
            visible={featuresGridModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setFeaturesGridModal(false)}
          >
            <View style={styles.sheetOverlay}>
              <TouchableOpacity
                style={styles.sheetBackdrop}
                activeOpacity={1}
                onPress={() => setFeaturesGridModal(false)}
              />
              <View style={[styles.sheetContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={styles.sheetHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="sparkles" size={17} color="#2563EB" />
                    <Text style={[styles.sheetTitle, { color: chatbotDark ? '#F8FAFC' : '#0F172A' }]}>
                      {t.quickActionsLabel}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setFeaturesGridModal(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.gridContainer}>
                  {[
                    { key: 'study', title: t.features.study, prompt: activeLang === 'mr' ? 'मूलभूत हक्क समजावून सांगा' : activeLang === 'hi' ? 'मौलिक अधिकार क्या हैं?' : 'Explain Fundamental Rights', icon: 'book-outline' },
                    { key: 'planning', title: t.features.planning, prompt: activeLang === 'mr' ? 'अभ्यास वेळापत्रक नियोजन' : activeLang === 'hi' ? 'स्टडी टाइमटेबल प्लानिंग' : 'Study planning routine', icon: 'calendar-outline' },
                    { key: 'anxiety', title: t.features.anxiety, prompt: activeLang === 'mr' ? 'परीक्षेचा खूप ताण आलाय' : activeLang === 'hi' ? 'परीक्षा का बहुत तनाव है' : 'I have exam anxiety', icon: 'heart-outline' },
                    { key: 'comeback', title: t.features.comeback, prompt: activeLang === 'mr' ? 'अभ्यास कमबॅक कसा करू?' : activeLang === 'hi' ? 'स्टडी कमबैक कैसे करूँ?' : 'How to do a study comeback?', icon: 'refresh-outline' },
                    { key: 'eli10', title: t.features.eli10, prompt: activeLang === 'mr' ? 'सोप्या भाषेत समजावून सांगा' : activeLang === 'hi' ? 'सरल शब्दों में समझाइए' : "Explain Like I'm 10", icon: 'bulb-outline' },
                    { key: 'revision', title: t.features.revision, prompt: activeLang === 'mr' ? 'रिव्हिजन कशी करू?' : activeLang === 'hi' ? 'रिवीजन कैसे करूँ?' : 'Revision reminders and spaced repetition', icon: 'repeat-outline' }
                  ].map(item => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => {
                        setFeaturesGridModal(false);
                        sendMessage(item.prompt);
                      }}
                      style={[
                        styles.gridCard,
                        {
                          backgroundColor: chatbotDark ? '#1E293B' : '#F8FAFC',
                          borderColor: chatbotDark ? '#334155' : '#E2E8F0'
                        }
                      ]}
                    >
                      <Ionicons name={item.icon} size={18} color="#2563EB" />
                      <Text style={[styles.gridCardTitle, { color: colors.titleText }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>

          {/* Single Settings Modal Sheet: Language, Theme Mode, Conversation History, Voice & Clear Chat */}
          <Modal
            visible={settingsModalOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSettingsModalOpen(false)}
          >
            <View style={styles.sheetOverlay}>
              <TouchableOpacity
                style={styles.sheetBackdrop}
                activeOpacity={1}
                onPress={() => setSettingsModalOpen(false)}
              />
              <View style={[styles.settingsSheetContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={[styles.settingsSheetHeader, { borderBottomColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                    <Ionicons name="settings-sharp" size={17} color="#2563EB" />
                    <Text style={[styles.settingsSheetTitle, { color: colors.titleText }]}>
                      {t.settings}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSettingsModalOpen(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={20} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                {/* 1. Language Translation Selection (English, मराठी, हिंदी) */}
                <View style={[styles.settingsRow, { borderBottomColor: colors.border, flexDirection: 'column', alignItems: 'stretch', gap: 8 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#1E293B' : '#F1F5F9' }]}>
                        <Ionicons name="globe-outline" size={17} color="#2563EB" />
                      </View>
                      <View>
                        <Text style={[styles.settingsItemTitle, { color: colors.titleText }]}>{t.language}</Text>
                        <Text style={[styles.settingsItemSub, { color: colors.muted }]}>
                          {activeLang === 'mr' ? 'मराठी (Marathi)' : activeLang === 'hi' ? 'हिंदी (Hindi)' : 'English'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.langSegmentedWrap, { backgroundColor: chatbotDark ? '#0F172A' : '#F1F5F9', borderColor: colors.border }]}>
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'mr', label: 'मराठी' },
                      { code: 'hi', label: 'हिंदी' }
                    ].map(langItem => {
                      const isCurrent = activeLang === langItem.code;
                      return (
                        <TouchableOpacity
                          key={langItem.code}
                          onPress={() => handleLanguageSwitch(langItem.code)}
                          style={[
                            styles.langSegmentBtn,
                            isCurrent && {
                              backgroundColor: '#2563EB',
                              elevation: 2,
                              shadowColor: '#000',
                              shadowOpacity: 0.15,
                              shadowRadius: 3
                            }
                          ]}
                        >
                          <Text
                            style={[
                              styles.langSegmentText,
                              { color: isCurrent ? '#FFFFFF' : colors.muted, fontWeight: isCurrent ? '700' : '500' }
                            ]}
                          >
                            {langItem.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 2. Theme Mode (Light / Dark) */}
                <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#1E293B' : '#F1F5F9' }]}>
                      <Ionicons name={chatbotDark ? 'moon' : 'sunny'} size={17} color={chatbotDark ? '#F59E0B' : '#2563EB'} />
                    </View>
                    <View>
                      <Text style={[styles.settingsItemTitle, { color: colors.titleText }]}>{t.appearance}</Text>
                      <Text style={[styles.settingsItemSub, { color: colors.muted }]}>{chatbotDark ? t.darkMode : t.lightMode}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setChatbotDark(!chatbotDark)}
                    style={[
                      styles.aestheticSwitch,
                      { backgroundColor: chatbotDark ? '#2563EB' : '#E2E8F0', borderColor: chatbotDark ? '#3B82F6' : '#CBD5E1' }
                    ]}
                  >
                    <View style={[styles.aestheticSwitchThumb, chatbotDark ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                  </TouchableOpacity>
                </View>

                {/* 3. Conversation History (ChatGPT Style Full History) */}
                <TouchableOpacity
                  onPress={() => {
                    setSettingsModalOpen(false);
                    setTimeout(() => setHistoryModalOpen(true), 120);
                  }}
                  style={[styles.settingsRow, { borderBottomColor: colors.border }]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#1E293B' : '#F1F5F9' }]}>
                      <Ionicons name="time-outline" size={17} color="#2563EB" />
                    </View>
                    <View>
                      <Text style={[styles.settingsItemTitle, { color: colors.titleText }]}>{t.chatHistory}</Text>
                      <Text style={[styles.settingsItemSub, { color: colors.muted }]}>
                        {conversations.length > 0 ? `${conversations.length} ${t.savedChats}` : t.chatHistorySub}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={[styles.historyCountBadge, { backgroundColor: chatbotDark ? '#1E293B' : '#EFF6FF' }]}>
                      <Text style={[styles.historyCountBadgeText, { color: '#2563EB' }]}>
                        {t.viewAll}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                  </View>
                </TouchableOpacity>

                {/* 4. Voice Auto-Read */}
                <View style={[styles.settingsRow, { borderBottomColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#1E293B' : '#F1F5F9' }]}>
                      <Ionicons name="volume-high-outline" size={17} color="#2563EB" />
                    </View>
                    <View>
                      <Text style={[styles.settingsItemTitle, { color: colors.titleText }]}>{t.voiceReading}</Text>
                      <Text style={[styles.settingsItemSub, { color: colors.muted }]}>{autoReadAloud ? 'Active' : 'Off'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => setAutoReadAloud(!autoReadAloud)}
                    style={[
                      styles.aestheticSwitch,
                      { backgroundColor: autoReadAloud ? '#2563EB' : '#E2E8F0', borderColor: autoReadAloud ? '#3B82F6' : '#CBD5E1' }
                    ]}
                  >
                    <View style={[styles.aestheticSwitchThumb, autoReadAloud ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                  </TouchableOpacity>
                </View>

                {/* 5. AI Knowledge Engine */}
                <View style={[styles.settingsRow, { borderBottomColor: colors.border, flexDirection: 'column', alignItems: 'stretch' }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowApiKeyInput(!showApiKeyInput)}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                      <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#1E293B' : '#EEF2FF' }]}>
                        <Ionicons name="sparkles" size={17} color="#4F46E5" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.settingsItemTitle, { color: colors.titleText }]}>{t.aiEngine}</Text>
                        <Text style={[styles.settingsItemSub, { color: geminiApiKey ? '#10B981' : colors.muted }]}>
                          {geminiApiKey ? `🟢 ${t.aiEngineGeminiActive}` : `⚡ ${t.aiEngineBuiltinActive}`}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name={showApiKeyInput ? "chevron-up" : "chevron-down"} size={16} color={colors.muted} />
                  </TouchableOpacity>

                  {showApiKeyInput && (
                    <View style={{ marginTop: 10, padding: 10, borderRadius: 8, backgroundColor: chatbotDark ? '#0F172A' : '#F8FAFC', borderWidth: 1, borderColor: colors.border }}>
                      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 8, lineHeight: 15 }}>
                        {t.aiEngineKeyHelp}
                      </Text>
                      <TextInput
                        value={tempGeminiKey}
                        onChangeText={setTempGeminiKey}
                        placeholder={t.aiEnginePlaceholder || "AIzaSy... (optional)"}
                        placeholderTextColor={chatbotDark ? '#64748B' : '#94A3B8'}
                        secureTextEntry
                        style={{
                          fontSize: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: chatbotDark ? '#1E293B' : '#FFFFFF',
                          color: colors.titleText,
                          marginBottom: 8
                        }}
                      />
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                        {Boolean(geminiApiKey) && (
                          <TouchableOpacity
                            onPress={handleClearGeminiKey}
                            style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: '#EF4444' }}
                          >
                            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600' }}>{t.aiEngineClear}</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={handleSaveGeminiKey}
                          style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6, backgroundColor: '#2563EB' }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600' }}>{t.aiEngineSave}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* 6. Clear Chat Option */}
                <TouchableOpacity
                  onPress={() => {
                    setSettingsModalOpen(false);
                    setTimeout(() => setClearConfirmOpen(true), 150);
                  }}
                  style={[styles.settingsRow, { borderBottomWidth: 0, paddingBottom: 6 }]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    <View style={[styles.settingsIconBox, { backgroundColor: chatbotDark ? '#2D1515' : '#FEF2F2' }]}>
                      <Ionicons name="trash-outline" size={17} color="#DC2626" />
                    </View>
                    <View>
                      <Text style={[styles.settingsItemTitle, { color: '#DC2626' }]}>{t.clearChat}</Text>
                      <Text style={[styles.settingsItemSub, { color: colors.muted }]}>{t.clearChatSub}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* ChatGPT-Style Full Conversation History Modal */}
          <Modal
            visible={historyModalOpen}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setHistoryModalOpen(false)}
          >
            <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.screenBg }]}>
              {/* History Top Navigation */}
              <View style={[styles.historyHeader, { backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() => setHistoryModalOpen(false)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={styles.backBtn}
                  >
                    <Ionicons name="chevron-back" size={22} color={colors.backBtnColor} />
                  </TouchableOpacity>
                  <View>
                    <Text style={[styles.historyHeaderTitle, { color: colors.titleText }]}>
                      {t.chatHistory}
                    </Text>
                    <Text style={[styles.historyHeaderSub, { color: colors.subtitleText }]}>
                      {conversations.length} {t.savedChats}
                    </Text>
                  </View>
                </View>

                {/* ChatGPT-Style + New Chat Button */}
                <TouchableOpacity
                  onPress={handleStartNewChat}
                  style={styles.historyNewChatBtn}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.historyNewChatBtnText}>{t.newChat}</Text>
                </TouchableOpacity>
              </View>

              {/* Conversation History List */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 14, paddingBottom: 40 }}
              >
                {conversations.length === 0 ? (
                  <View style={styles.emptyHistoryBox}>
                    <View style={[styles.emptyHistoryIconWrap, { backgroundColor: chatbotDark ? '#1E293B' : '#EFF6FF' }]}>
                      <Ionicons name="chatbubbles-outline" size={32} color="#2563EB" />
                    </View>
                    <Text style={[styles.emptyHistoryTitle, { color: colors.titleText }]}>
                      {t.noChatsYet}
                    </Text>
                    <Text style={[styles.emptyHistoryMsg, { color: colors.muted }]}>
                      {t.noChatsSub}
                    </Text>
                    <TouchableOpacity
                      onPress={handleStartNewChat}
                      style={styles.emptyStartChatBtn}
                    >
                      <Ionicons name="chatbubble-ellipses" size={16} color="#FFFFFF" />
                      <Text style={styles.emptyStartChatBtnText}>{t.startChatting}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  conversations.map(conv => {
                    const isActive = conv.id === currentSessionId;
                    const dateFormatted = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <View
                        key={conv.id}
                        style={[
                          styles.historyCard,
                          {
                            backgroundColor: isActive
                              ? (chatbotDark ? '#1E293B' : '#EFF6FF')
                              : colors.cardBg,
                            borderColor: isActive
                              ? '#2563EB'
                              : colors.border
                          }
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => handleLoadConversation(conv)}
                          style={{ flex: 1, paddingVertical: 12, paddingLeft: 12 }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Ionicons
                              name="chatbubble-outline"
                              size={15}
                              color={isActive ? '#2563EB' : colors.muted}
                            />
                            <Text
                              style={[
                                styles.historyCardTitle,
                                { color: colors.titleText, fontWeight: isActive ? '700' : '600' }
                              ]}
                              numberOfLines={1}
                            >
                              {conv.title || t.untitledChat}
                            </Text>
                            {isActive && (
                              <View style={styles.activeChatBadge}>
                                <Text style={styles.activeChatBadgeText}>{t.activeChat}</Text>
                              </View>
                            )}
                          </View>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.historyCardMeta, { color: colors.muted }]}>
                              {dateFormatted}
                            </Text>
                            <Text style={[styles.historyCardMetaDot, { color: colors.muted }]}>•</Text>
                            <Text style={[styles.historyCardMeta, { color: colors.muted }]}>
                              {(conv.messages || []).length} {t.messagesCount}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => handleDeleteConversation(conv.id)}
                          style={styles.historyDeleteBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel="Delete Conversation"
                        >
                          <Ionicons name="trash-outline" size={16} color={colors.muted} />
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </SafeAreaView>
          </Modal>

          {/* Clear Chat Confirmation Modal */}
          <Modal
            visible={clearConfirmOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setClearConfirmOpen(false)}
          >
            <TouchableOpacity
              style={styles.confirmModalOverlay}
              activeOpacity={1}
              onPress={() => setClearConfirmOpen(false)}
            >
              <View style={[styles.confirmModalBox, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={styles.confirmModalIconWrap}>
                  <Ionicons name="trash-outline" size={22} color="#DC2626" />
                </View>
                <Text style={[styles.confirmModalTitle, { color: colors.titleText }]}>
                  {t.clearConfirmTitle}
                </Text>
                <Text style={[styles.confirmModalMsg, { color: colors.subtitleText }]}>
                  {t.clearConfirmMsg}
                </Text>
                <View style={styles.confirmModalActions}>
                  <TouchableOpacity
                    onPress={() => setClearConfirmOpen(false)}
                    style={[
                      styles.confirmModalBtn,
                      { backgroundColor: chatbotDark ? '#1E293B' : '#F1F5F9', borderColor: colors.border }
                    ]}
                  >
                    <Text style={[styles.confirmModalBtnText, { color: colors.titleText }]}>
                      {t.cancel}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleClearChat}
                    style={[styles.confirmModalBtn, { backgroundColor: '#DC2626', borderColor: '#DC2626' }]}
                  >
                    <Text style={[styles.confirmModalBtnText, { color: '#FFFFFF' }]}>
                      {t.clearChat}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </SafeAreaView>
      </Modal>
    </>
  );
}

// -------------------------------------------------------------
// Client-side offline fallback (Zero-API guarantee)
// -------------------------------------------------------------
function generateClientFallback(msg, lang, sessions, plans) {
  const lower = String(msg || '').toLowerCase();
  const todayStr = new Date().toISOString().slice(0, 10);

  if (lower.includes('suicide') || lower.includes('kill') || lower.includes('मरावं') || lower.includes('मरना')) {
    return {
      text: lang === 'mr'
        ? 'मी तुमच्या सोबत आहे. तुम्ही एकटे नाही आहात! ❤️\n\nकृपया लगेच मोफत व २४ तास उपलब्ध हेल्पलाइनवर संपर्क साधा:\n📞 Tele-MANAS: 14416\n🚨 आपत्कालीन मदत: 112'
        : 'You are deeply valued and you are not alone! ❤️\n\nPlease reach out right now to compassionate counselors:\n📞 Tele-MANAS: 14416 (Toll-Free)\n🚨 National Emergency: 112',
      action: 'emergency_support',
      helpline: '14416'
    };
  }

  if (lower.includes('wasted') || lower.includes('guilt') || lower.includes('वाया') || lower.includes('बर्बाद')) {
    return {
      text: lang === 'mr'
        ? "काही हरकत नाही! एक दिवस वाया गेला म्हणजे तयारी संपली असे नाही. ❤️\n\nस्वतःला दोष देऊ नका. चला आत्ता फक्त २० मिनिटांचा एक छोटा फोकस सुरू करूया!"
        : "That's completely okay! One difficult day does not define your preparation. ❤️\n\nDon't worry about the whole syllabus right now. How about starting with just 20 small minutes?",
      action: 'start_pomodoro'
    };
  }

  // Feeling Unwell / Sick / Low Energy
  const isUnwell = /(?:not\s+feeling\s+well|feeling\s+unwell|feeling\s+sick|not\s+well|unwell|sick|headache|fever|body\s*ache|stomach\s*ache|ill|don'?t\s+feel\s+like\s+study|dont\s+feel\s+like\s+study|not\s+feeling\s+like\s+study|not\s+in\s+(?:the\s+)?mood|no\s+mood|can'?t\s+study\s+today|cant\s+study\s+today|cannot\s+study\s+today|तबीयत|तब्येत|बरा\s+वाटत\s+नाही|बरी\s+नाही|मन\s+लागत\s+नाही|मन\s+नहीं\s+कर\s+रहा|बीमार|डोके\s*दुखी|सिर\s*दर्द)/i.test(lower);

  if (isUnwell) {
    if (lang === 'mr') {
      return {
        text: `🩺 **आरोग्य प्रथम! कृपया स्वतःवर जबरदस्ती करू नका.** ❤️\n\nमी समजू शकतो. स्पर्धा परीक्षेचा प्रवास मोठा आहे आणि तब्येत बरी नसताना जबरदस्तीने वाचल्यास काहीही लक्षात राहत नाही.\n\n• 🛌 **पुस्तके बाजूला ठेवा:** विश्रांती घ्या, गरम पाणी प्या आणि डोळे मिटून शांत झोपा.\n• 🎧 **हलका अभ्यास (फक्त इच्छा असल्यास):** १०-१५ मिनिटे झोपून ऑडिओ चालू घडामोडी ऐका.\n• 🌿 **दोष मनात आणू नका:** सर्व टॉपर्स आजारी असताना विश्रांती घेतात.\n\nकाळजी घ्या, मित्रा! 💙`,
        action: 'relax_exercise',
        suggestedActionLabel: '🛌 विश्रांती घ्या'
      };
    }
    if (lang === 'hi') {
      return {
        text: `🩺 **सेहत सबसे पहले! कृपया खुद पर ज्यादा दबाव न डालें।** ❤️\n\nतबीयत ठीक न होना बिल्कुल स्वाभाविक है। अस्वस्थ शरीर या मन से पढ़ने पर पढ़ा हुआ याद नहीं रहता.\n\n• 🛌 **किताबें बंद करके आराम करें:** गुनगुना पानी पिएं और पूरी नींद लें.\n• 🎧 **हल्का-फुल्का रिवीजन (यदि मन करे):** 10-15 मिनट सिर्फ ऑडियो या पॉडकास्ट सुनें.\n• 🌿 **अपराधबोध न रखें:** सेहत ठीक रहेगी तो पढ़ाई कल दोगुनी ऊर्जा से होगी!\n\nअपना ध्यान रखें! 💙`,
        action: 'relax_exercise',
        suggestedActionLabel: '🛌 आराम करें'
      };
    }
    return {
      text: `🩺 **Health Always Comes First! Please Don't Force Yourself.** ❤️\n\nI hear you, and it's completely okay. Preparing for competitive exams is a marathon, not a sprint. Pushing yourself through sickness, headache, or exhaustion will only drain you further.\n\n• 🛌 **Step Away from Heavy Books:** Close the thick books. Lie down, hydrate with warm water/tea, and let your body rest.\n• 🎧 **Zero-Pressure "Study-Lite" (Only if you feel like it):** Listen to a 10–15 min audio editorial lying down with eyes closed, or just sleep.\n• 🌿 **Release the Guilt:** Every topper takes rest days when unwell. Recovery is productive!\n\nTake care of yourself first! Your well-being matters most. 💙`,
      action: 'relax_exercise',
      suggestedActionLabel: '🛌 Take Rest Break'
    };
  }

  // Casual Acknowledgements & Courtesy ("ok", "okay", "sure", "thanks", "got it", etc.)
  const isAck = /^(?:ok|okay|okk|k|cool|sure|alright|fine|yes|yeah|yep|got it|understood|done|thx|thanks|thank you|great|awesome|समजले|ठीक आहे|चालेल|हो|धन्यवाद|समझा|ठीक है|जी|शुक्रिया|अच्छा)(?:[.! ]*)$/i.test(lower) ||
    (/^\b(?:ok|okay|okk|k|cool|sure|alright|fine|yes|yeah|yep|got it|understood|done|thx|thanks|thank you|great|awesome)\b/i.test(lower) && lower.split(/\s+/).length <= 3);

  if (isAck) {
    if (lang === 'mr') {
      return {
        text: `👍 **उत्तम! मी तुमच्या सोबत आहे.**\n\nजेव्हा तुम्ही तयार असाल, तेव्हा आपण पुढे काय करायचे? खालील पर्यायावर टॅप करा किंवा कोणताही प्रश्न विचारा:`,
        action: null,
        quickReplies: [
          '🔁 विषयांची उजळणी',
          '📅 आजचे नियोजन',
          '⏱️ २५ मिनिटे फोकस टायमर',
          '💡 संकल्पना स्पष्ट करा',
          '🧠 सराव प्रश्न'
        ]
      };
    }
    if (lang === 'hi') {
      return {
        text: `👍 **बढ़िया! मैं आपके साथ हूँ।**\n\nजब भी आप तैयार हों, बताइए आगे क्या करना है? नीचे दिए गए विकल्प चुनें या कोई भी सवाल पूछें:`,
        action: null,
        quickReplies: [
          '🔁 विषय रिवीजन',
          '📅 आज का स्टडी प्लान',
          '⏱️ 25 मिनट फोकस टाइमर',
          '💡 कॉन्सेप्ट समझें',
          '🧠 क्विक क्विज'
        ]
      };
    }
    return {
      text: `👍 **Great! I'm right here with you.**\n\nWhenever you're ready, what would you like to do next? Choose an option below or ask me any question:`,
      action: null,
      quickReplies: [
        '🔁 Subject Revision',
        '📅 Plan Today\'s Study',
        '⏱️ 25m Focus Timer',
        '💡 Explain a Concept',
        '🧠 Quick Quiz'
      ]
    };
  }

  // Revision Reminder & 3-Tier Topic Selector
  const isRevision = ['revision', 'रिव्हिजन', 'उजळणी', 'रिवीजन', 'revise', 'spaced repetition', 'switch subject', 'दुसरा विषय', 'दूसरा विषय'].some(k => lower.includes(k));
  const isPolity = lower.includes('polity') || lower.includes('राज्यघटना') || lower.includes('राजव्यवस्था') || lower.includes('संविधान');
  const isHistory = lower.includes('history') || lower.includes('इतिहास') || lower.includes('स्वातंत्र्य');

  // Check if topic clicked
  if (lower.includes('fundamental right') || lower.includes('मूलभूत हक्क') || lower.includes('मौलिक अधिकार') || lower.includes('art 12') || lower.includes('कलम १२')) {
    return {
      text: lang === 'mr'
        ? `🏛️ **अॅक्टिव्ह रिकॉल: मूलभूत हक्क (कलम १२-३५)**\n\n• **समानतेचा हक्क (कलम १४-१८):** अस्पृश्यता निवारण (कलम १७ - पूर्ण हक्क).\n• **स्वातंत्र्याचा हक्क (कलम १९-२२):** भाषण व संचार स्वातंत्र्य; कलम २१ (व्यक्तिगत स्वातंत्र्य).\n• **घटनात्मक उपायांचा हक्क (कलम ३२):** ५ प्राधिलेख (Writs) काढण्याचा सर्वोच्च न्यायालयाचा अधिकार.\n\n🧠 **रिकॉल आव्हान:** कलम २० व २१ राष्ट्रीय आणीबाणीतही कधीही निलंबित होत नाहीत!`
        : `🏛️ **Active Recall: Fundamental Rights (Articles 12–35)**\n\n• **Right to Equality (Art 14–18):** Untouchability abolished (Art 17 - absolute).\n• **Right to Freedom (Art 19–22):** 6 freedoms under Art 19; Life & Liberty (Art 21).\n• **Constitutional Remedies (Art 32):** 5 Writs (Habeas Corpus, Mandamus, etc.) - Heart & Soul of Constitution.\n\n🧠 **Recall Challenge:** Articles 20 & 21 can NEVER be suspended, even during a National Emergency!`,
      action: 'study_concept',
      suggestedActionLabel: '▶ 25m Revision Timer',
      quickReplies: ['🧠 Quick Quiz', '📚 More Polity Topics', '🔁 Switch Subject', '⏱️ 25m Focus Timer']
    };
  }

  // Check if subject clicked
  if (isPolity) {
    return {
      text: lang === 'mr'
        ? `📖 **भारतीय राज्यघटना उजळणी:** खालीलपैकी कोणत्या घटकाची उजळणी करायची आहे?`
        : `📖 **Indian Polity Revision:** Select a core topic to revise active recall notes and key Articles:`,
      action: null,
      quickReplies: [
        lang === 'mr' ? '🏛️ मूलभूत हक्क (कलम १२-३५)' : '🏛️ Fundamental Rights (Art 12–35)',
        lang === 'mr' ? '📜 मार्गदर्शक तत्त्वे व कर्तव्ये' : '📜 Directive Principles & Duties (Part IV & IVA)',
        lang === 'mr' ? '🏛️ संसद व कायदे प्रक्रिया' : '🏛️ Parliament & Legislative Process',
        lang === 'mr' ? '⚖️ सर्वोच्च न्यायालय व पुनर्विलोकन' : '⚖️ Supreme Court & Judicial Review',
        lang === 'mr' ? '⚡ आणीबाणी तरतुदी' : '⚡ Emergency Provisions (Art 352–360)',
        '🔁 Switch Subject'
      ]
    };
  }

  if (isHistory) {
    return {
      text: lang === 'mr'
        ? `🏛️ **आधुनिक भारताचा इतिहास उजळणी:** खालीलपैकी कोणत्या चळवळीची किंवा घटकाची उजळणी करायची आहे?`
        : `🏛️ **Modern Indian History Revision:** Select a milestone or era to review key events and chronology:`,
      action: null,
      quickReplies: [
        lang === 'mr' ? '🔥 १८५७ चा उठाव व ब्रिटिश धोरणे' : '🔥 1857 Revolt & British Policies',
        lang === 'mr' ? '✊ असहकार व सविनय कायदेभंग' : '✊ Non-Cooperation & Civil Disobedience',
        lang === 'mr' ? '🇮🇳 चले जाव चळवळ (१९४२)' : '🇮🇳 Quit India Movement (1942)',
        lang === 'mr' ? '🌱 समाजसुधारक (फुले, आंबेडकर, शाहू)' : '🌱 Socio-Religious Reformers & Thinkers',
        '🔁 Switch Subject'
      ]
    };
  }

  if (isRevision) {
    return {
      text: lang === 'mr'
        ? `🔁 **स्मरणशक्ती वाढवणारे रिव्हिजन तंत्र (Spaced Repetition Protocol)**\n\n• **डे १:** आज वाचलेले उद्या सकाळी १० मिनिटांत जलद नजरेखालून घाला.\n• **डे ७:** आठवड्याभरात वाचलेल्या मुख्य नोट्सची उजळणी.\n• **अॅक्टिव्ह रिकॉल:** पुस्तक बंद करून स्वतःला विचारा—*"या घटकातील ५ महत्त्वाचे मुद्दे कोणते?"*\n\n💡 **तुम्हाला आज कोणत्या विषयाची उजळणी करायची आहे?** खालील विषयावर टॅप करा:`
        : `🔁 **Spaced Repetition Revision Protocol**\n\n• **Day 1 Recap:** Spend the first 10 mins of each morning reviewing yesterday's notes.\n• **Day 7 Review:** Weekly sweep of key summaries and diagrams.\n• **Active Recall:** Close the book and test yourself: *"Can I explain this topic in 3 minutes without looking?"*\n\n💡 **What subject would you like to revise today?** Choose a subject below to see key topics:`,
      action: 'open_planner',
      suggestedActionLabel: '📅 Open Planner',
      quickReplies: [
        '📖 Indian Polity',
        '🏛️ Modern History',
        '🌍 Geography',
        '📈 Indian Economy',
        '📐 CSAT & Aptitude',
        '🌿 Environment & Ecology'
      ]
    };
  }

  if (lower.includes('how much') || lower.includes('progress') || lower.includes('प्रगती') || lower.includes('किती अभ्यास')) {
    const todaySessions = (sessions || []).filter(s => s.startedAt && s.startedAt.slice(0, 10) === todayStr);
    const todayMins = todaySessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    return {
      text: lang === 'mr'
        ? `📊 आज तुम्ही ${Math.floor(todayMins / 60)} तास ${todayMins % 60} मिनिटे अभ्यास केला आहे.`
        : `📊 Today you have logged ${Math.floor(todayMins / 60)}h ${todayMins % 60}m across ${todaySessions.length} session(s).`,
      action: 'view_progress'
    };
  }

  // Study Planning & Study Help (Meta AI Style)
  const hasHoursOrTime = /\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|तास|घंटे|घंटा)\b/i.test(lower) ||
    ['10 hours', '8 hours', '6 hours', '4 hours', '3 hours', '2 hours', '१० तास', '८ तास', '६ तास', '४ तास', '10 घंटे', '8 घंटे', '6 घंटे', '4 घंटे', 'working aspirant', 'job + study', 'नोकरी + अभ्यास', 'जॉब + पढ़ाई', 'adjust', 'बदला'].some(k => lower.includes(k));

  const isPlan = ['plan', 'planning', 'study plan', 'study planning', 'study help', 'help me study', 'timetable', 'time table', 'schedule', 'routine', 'what to study', 'how to start', 'how to study', 'what study help', 'what study help should i do', 'नियोजन', 'वेळापत्रक', 'अभ्यास नियोजन', 'अभ्यास प्लॅन', 'अभ्यास वेळापत्रक', 'अभ्यास मदत', 'योजना', 'टाइमटेबल', 'स्टडी प्लान', 'स्टडी प्लानिंग', 'स्टडी हेल्प'].some(k => lower.includes(k)) ||
    (hasHoursOrTime && (lower.includes('mpsc') || lower.includes('upsc') || lower.includes('polity') || lower.includes('history') || lower.includes('geography') || lower.includes('csat') || lower.includes('economy') || lower.includes('अभ्यास') || lower.includes('पढ़ाई') || lower.includes('working') || lower.includes('job')));

  if (isPlan) {
    const hasSpecificParams = /\b(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|तास|घंटे|घंटा)\b/i.test(lower) ||
      ['10 hours', '8 hours', '6 hours', '4 hours', 'working', 'job', 'office', 'नोकरी', 'जॉब', 'कामकाजी', 'polity', 'history', 'geography', 'csat', 'economy', 'राज्यघटना', 'इतिहास', 'भूगोल', 'समतोल', 'संतुलन', 'sprint', 'बदला'].some(w => lower.includes(w));

    if (!hasSpecificParams) {
      if (lang === 'mr') {
        return {
          text: `🤖 **वैयक्तिक अभ्यास नियोजन (मेटा एआय प्रमाणे)**\n\nकोणताही रेडीमेड किंवा ऑटो-जनरेट केलेला साचा देण्याऐवजी, आपण तुमच्या प्रत्यक्ष गरजेनुसार आणि वेळेनुसार अचूक अभ्यास नियोजन तयार करूया! 🎯\n\n**मी तुम्हाला अभ्यासात कोणती मदत करू?** कृपया खालील माहिती सांगा:\n\n१. 📚 **लक्षित परीक्षा:** UPSC, MPSC राज्यसेवा की MPSC संयुक्त (गट ब/क)?\n२. ⏳ **अभ्यासासाठी उपलब्ध वेळ:** आज तुम्ही किती तास देऊ शकता? (उदा. नोकरी असल्यास ३-४ तास, किंवा पूर्णवेळ ६ ते ८ तास?)\n३. 📖 **विषय व घटक:** आज कोणते विषय अभ्यासायचे आहेत? (उदा. राज्यघटना, इतिहास, भूगोल, CSAT की चालू घडामोडी?)\n४. 🎯 **विशिष्ट उद्दिष्ट:** आजचे तासनिहाय वेळापत्रक हवे आहे, GS + CSAT समतोल हवा आहे, की उजळणी व PYQ सराव?\n\n💬 *तुम्ही थेट लिहून पाठवू शकता (उदा. **"MPSC, ६ तास, राज्यघटना आणि CSAT"**), किंवा खालील पर्यायांवर टॅप करा:*`,
          action: 'open_planner',
          suggestedActionLabel: '📅 प्लॅनर उघडा',
          quickReplies: [
            '📚 MPSC नियोजन (६ तास)',
            '🏛️ UPSC नियोजन (८ तास)',
            '💼 नोकरी + अभ्यास (४ तास)',
            '🎯 GS + CSAT समतोल',
            '🔄 उजळणी व PYQ सराव'
          ]
        };
      }
      if (lang === 'hi') {
        return {
          text: `🤖 **व्यक्तिगत स्टडी प्लान (मेटा AI की तरह)**\n\nकिसी ऑटो-जनरेटेड या तयशुदा टाइमटेबल के बजाय, आइए आपकी दिनचर्या, उपलब्ध समय और प्राथमिकताओं के आधार पर एक कस्टमाइज्ड स्टडी प्लान बनाएं! 🎯\n\n**मैं आपकी पढ़ाई में किस प्रकार सहायता करूँ?** कृपया बताइए:\n\n1. 📚 **लक्षित परीक्षा:** UPSC, MPSC राज्यसेवा या MPSC कम्बाइंड (ग्रुप B/C)?\n2. ⏳ **उपलब्ध अध्ययन समय:** आज आप कितने घंटे पढ़ सकते हैं? (जैसे जॉब के साथ 3-4 घंटे, या फुल-टाइम 6 से 8 घंटे?)\n3. 📖 **विषय और फोकस:** आज किन विषयों पर ध्यान देना है? (जैसे राजव्यवस्था, इतिहास, भूगोल, CSAT या करेंट अफेयर्स?)\n4. 🎯 **विशिष्ट सहायता:** पूरे दिन का टाइमटेबल चाहिए, GS + CSAT संतुलन, या रिवीजन व PYQs का शेड्यूल?\n\n💬 *आप सीधे लिखकर बता सकते हैं (जैसे **"UPSC, 6 घंटे, पॉलिटी और CSAT"**), या नीचे दिए गए त्वरित विकल्पों पर टैप करें:*`,
          action: 'open_planner',
          suggestedActionLabel: '📅 प्लानर खोलें',
          quickReplies: [
            '📚 MPSC प्लान (6 घंटे)',
            '🏛️ UPSC प्लान (8 घंटे)',
            '💼 जॉब + पढ़ाई (4 घंटे)',
            '🎯 GS + CSAT संतुलन',
            '🔄 रिवीजन व PYQ प्लान'
          ]
        };
      }
      return {
        text: `🤖 **Personalized Study Planner (Meta AI Style)**\n\nInstead of giving you a generic, auto-generated timetable, let's create a custom study plan tailored specifically to you. 🎯\n\n**What study help should I do for you today?** Please let me know:\n\n1. 📚 **Target Exam:** UPSC Civil Services, MPSC Rajyaseva, or MPSC Combine (Group B/C)?\n2. ⏳ **Available Time:** How many hours can you commit today? (e.g., 3–4 hrs for working/college, 6 hrs, or 8–10 hrs full-time?)\n3. 📖 **Subjects & Focus:** Which subjects do you want to cover? (e.g., Polity, CSAT, Modern History, Geography, Economy, or Current Affairs?)\n4. 🎯 **Specific Goal:** Need a daily hourly timetable, a balanced GS+CSAT routine, a backlog recovery plan, or a revision & PYQ sprint?\n\n💬 *Simply reply with your preferences (for example: **"MPSC, 6 hours, Polity and CSAT"**), or choose one of the quick options below:*`,
        action: 'open_planner',
        suggestedActionLabel: '📅 Open Planner',
        quickReplies: [
          '📚 MPSC Plan (6 Hours)',
          '🏛️ UPSC Plan (8 Hours)',
          '💼 Working Aspirant (4 Hours)',
          '🎯 GS + CSAT Balance',
          '🔄 Revision & PYQ Sprint'
        ]
      };
    }

    // Student specific custom plan
    const targetHours = lower.includes('4') || lower.includes('४') || lower.includes('working') || lower.includes('job') || lower.includes('नोकरी') ? 4 : lower.includes('8') || lower.includes('८') ? 8 : 6;
    const exam = lower.includes('mpsc') || lower.includes('राज्यसेवा') || lang === 'mr' ? 'MPSC' : 'UPSC';
    const sub1 = lower.includes('history') || lower.includes('इतिहास') ? (lang === 'mr' ? 'आधुनिक भारताचा इतिहास' : 'Modern History') : lower.includes('geography') || lower.includes('भूगोल') ? (lang === 'mr' ? 'भूगोल व नकाशे' : 'Geography') : (lang === 'mr' ? 'भारतीय राज्यघटना (लक्ष्मीकांत)' : 'Indian Polity & Constitution');
    const sub2 = lower.includes('csat') || lower.includes('maths') || lower.includes('अंकगणित') ? (lang === 'mr' ? 'CSAT बुद्धिमत्ता व गणित' : 'CSAT Reasoning & Aptitude') : (lang === 'mr' ? 'सामान्य अध्ययन व सराव' : 'General Studies & Practice');

    if (lang === 'mr') {
      return {
        text: `🎯 **तुमच्या गरजेनुसार सानुकूल अभ्यास नियोजन (${targetHours} तास • ${exam})**\n\n• 🌅 **सत्र १ (सकाळी ०८:०० ते १०:३० | २.५ तास):** ${sub1} - सखोल वाचन व नोट्स.\n• ☕ *१५ मिनिटांचा पोमोडोरो ब्रेक*\n• ☀️ **सत्र २ (सकाळी ११:०० ते दुपारी ०१:०० | २.० तास):** ${sub2} - सक्रिय प्रश्न सराव.\n• 🍽️ *दुपारचे जेवण व विश्रांती*\n• 🌆 **सत्र ३ (संध्याकाळी ०४:३० ते ०५:३० | १.० तास):** दैनिक चालू घडामोडी व शासकीय योजना.\n• 🌙 **सत्र ४ (रात्री ०९:०० ते ०९:३० | ३० मिनिटे):** अॅक्टिव्ह रिकॉल व मागील वर्षांचे १० प्रश्न.\n\n---\n💡 *मेटा एआय टीप: घड्याळाच्या वेळेचे बंधन नसून तुमच्या सोयीनुसार व ऊर्जेनुसार स्लॉट्स बदलू शकता!*\n\n❓ **हा अभ्यास प्लॅन तुमच्या वेळापत्रकास योग्य वाटतो का?**\nतुम्हाला यात वेळ वाढवायची/कमी करायची आहे की विषय बदलायचे आहेत?`,
        action: 'open_planner',
        suggestedActionLabel: '📅 प्लॅनरमध्ये नोंदवा',
        quickReplies: [
          '📅 प्लॅनर उघडा',
          '▶ टायमर सुरू करा',
          '🔄 ४ तास करा',
          '📚 विषय बदला'
        ]
      };
    }

    if (lang === 'hi') {
      return {
        text: `🎯 **आपकी जरूरत अनुसार कस्टम स्टडी प्लान (${targetHours} घंटे • ${exam})**\n\n• 🌅 **स्लॉट 1 (सुबह 08:00 से 10:30 | 2.5 घंटे):** ${sub1} - मुख्य कॉन्सेप्ट्स का गहरा अध्ययन.\n• ☕ *15 मिनट का पोमोडोरो ब्रेक*\n• ☀️ **स्लॉट 2 (सुबह 11:00 से 01:00 | 2.0 घंटे):** ${sub2} - प्रॉब्लम सॉल्विंग व प्रैक्टिस.\n• 🍽️ *दोपहर का भोजन व विश्राम*\n• 🌆 **स्लॉट 3 (शाम 04:30 से 05:30 | 1.0 घंटा):** दैनिक करेंट अफेयर्स एवं संपादकीय नोट्स.\n• 🌙 **स्लॉट 4 (रात 09:00 से 09:30 | 30 मिनट):** एक्टिव रिकॉल और 10 PYQs हल करें.\n\n---\n💡 *मेटा AI टिप: यह समय पूरी तरह लचीला है—अपनी व्यक्तिगत ऊर्जा के अनुसार स्लॉट्स बदल सकते हैं!*\n\n❓ **क्या यह प्लान आपकी दिनचर्या के अनुकूल लग रहा है?**`,
        action: 'open_planner',
        suggestedActionLabel: '📅 प्लानर में जोड़ें',
        quickReplies: [
          '📅 प्लानर खोलें',
          '▶ टाइमर शुरू करें',
          '🔄 4 घंटे करें',
          '📚 विषय बदलें'
        ]
      };
    }

    return {
      text: `🎯 **Customized Study Plan for You (${targetHours} Hours • ${exam})**\n\n• 🌅 **Slot 1 (08:00 AM – 10:30 AM | 2.5 Hours):** ${sub1} - Core concept reading with zero phone distractions.\n• ☕ *15-minute Pomodoro Break*\n• ☀️ **Slot 2 (11:00 AM – 01:00 PM | 2.0 Hours):** ${sub2} - Active problem-solving and mock MCQs.\n• 🍽️ *Midday Lunch & Relaxation*\n• 🌆 **Slot 3 (04:30 PM – 05:30 PM | 1.0 Hour):** Daily Editorial & Current Affairs compilation.\n• 🌙 **Slot 4 (09:00 PM – 09:30 PM | 30 Mins):** Spaced active recall recap + 10 Previous Year Questions.\n\n---\n💡 *Meta AI Tip: You don't have to follow rigid clock times—shift these blocks to align with your personal energy peaks!*\n\n❓ **How does this study plan feel for your schedule?**\nWould you like me to adjust the hours, change any subjects, or schedule extra break intervals?`,
      action: 'open_planner',
      suggestedActionLabel: '📅 Save to Study Planner',
      quickReplies: [
        '📅 Open Study Planner',
        '▶ Start Focus Timer',
        '🔄 Adjust to 4 Hours',
        '📚 Switch Subjects'
      ]
    };
  }

  // Offline Math calculation
  const mathMatch = lower.match(/(?:what is|calculate|solve|find|किती|मान|मूल्य)\s+([\d\s\+\-\*\/\(\)\.\%xX]+)/i);
  const isPureMath = /^[\d\s\+\-\*\/\(\)\.\%\^\=xX]+$/.test(lower);
  if (isPureMath || mathMatch) {
    try {
      const rawExpr = (mathMatch ? mathMatch[1] : lower).replace(/%/g, '*0.01').replace(/x/gi, '*');
      if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(rawExpr)) {
        const result = Function(`'use strict'; return (${rawExpr})`)();
        if (typeof result === 'number' && !isNaN(result)) {
          return {
            text: lang === 'mr'
              ? `🔢 **गणितीय उत्तर:**\n\n\`${msg}\` = **${result}**\n\n💡 *अजून काही हिशोब किंवा सूत्र सोडवायचे असल्यास विचारा!*`
              : lang === 'hi'
              ? `🔢 **गणितीय उत्तर:**\n\n\`${msg}\` = **${result}**\n\n💡 *किसी अन्य गणना या प्रश्न के लिए बेझिझक पूछें!*`
              : `🔢 **Mathematical Calculation:**\n\n\`${msg}\` = **${result}**\n\n💡 *Need help breaking down another equation or math problem? Just ask!*`,
            action: null
          };
        }
      }
    } catch {}
  }

  // Offline Jokes & Casual
  if (lower.includes('joke') || lower.includes('विनोद') || lower.includes('चुटकुला')) {
    return {
      text: lang === 'mr'
        ? `😄 **हा घ्या एक विनोदी किस्सा:**\n\nविद्यार्थी: "सर, परीक्षा म्हणजे काय असते?"\nशिक्षक: "जेव्हा दोन तास विचार करूनही आठवत नाही की हे आपण कधी वाचलं होतं, त्याला परीक्षा म्हणतात!" 😂\n\nहसल्याने मन हलके होते. आता पुन्हा उत्साहाने अभ्यासाला लागा!`
        : lang === 'hi'
        ? `😄 **एक मजेदार चुटकुला आपके लिए:**\n\nछात्र: "सर, परीक्षा और प्यार में क्या समानता है?"\nशिक्षक: "दोनों में परिणाम चाहे जो हो, नींद पहले ही उड़ जाती है!" 😂\n\nथोड़ा मुस्कुराइए और फिर नई ऊर्जा के साथ शुरुआत कीजिए!`
        : `😄 **Here's a quick study joke for you:**\n\nStudent: "Why did the textbook look so sad?"\nTeacher: "Because it had too many problems!" 😂\n\nA little smile keeps the brain relaxed. Ready to tackle our next topic?`,
      action: null
    };
  }

  // Offline Universal Knowledge Synthesizer (never rejects the student)
  if (lang === 'mr') {
    return {
      text: `✨ **'${msg}' बद्दल उत्तर:**\n\nतुमच्या या प्रश्नाचा संदर्भ लक्षात घेऊन:\n\n• **मुख्य संकल्पना:** या विषयाचा अभ्यास करताना मूलभूत व्याख्या, ऐतिहासिक किंवा वैज्ञानिक पार्श्वभूमी आणि व्यवहारातील उपयोग समजून घेणे महत्त्वाचे ठरते.\n• **अभ्यास दृष्टिकोन:** संकल्पना स्पष्ट ठेवल्यास यावर विचारल्या जाणाऱ्या कोणत्याही प्रश्नाचे अचूक उत्तर देता येते.\n\n💡 *तुम्हाला याविषयी सोप्या भाषेत (ELI10) स्पष्टीकरण हवे आहे की महत्त्वाचे मुद्दे? कृपया सांगा!*`,
      action: null
    };
  }

  if (lang === 'hi') {
    return {
      text: `✨ **'${msg}' के बारे में उत्तर:**\n\nआपके इस प्रश्न के संदर्भ में मुख्य बातें:\n\n• **मूल अवधारणा:** इस विषय को समझने के लिए इसके बुनियादी सिद्धांत, कारण और व्यावहारिक महत्व को देखना उपयोगी है.\n• **अध्ययन दृष्टिकोण:** मुख्य तथ्यों और तर्कों पर ध्यान केंद्रित करने से पूरी बात आसानी से समझ आ जाती है.\n\n💡 *क्या आप इसके बारे में सरल शब्दों में (ELI10) समझना चाहते हैं या मुख्य बिंदु देखना चाहते हैं? बताइए!*`,
      action: null
    };
  }

  return {
    text: `💡 **Abhyas Mitra Guidance:**\n\nRegarding your question on **"${msg}"**:\n\n• **Core Perspective:** Every concept or situation is best approached by understanding its key principles and practical context.\n• **Next Step:** Would you like a simpler breakdown (ELI10), key exam highlights, or specific practice tips on this? Just let me know!`,
    action: null
  };
}

// -------------------------------------------------------------
// Component Styles: Responsive & Frame-Safe for ALL Screen Sizes
// -------------------------------------------------------------
const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 84,
    right: 18,
    zIndex: 9999
  },
  fabButton: {
    width: 62,
    height: 62,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fabGlowRing: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12
  },
  fabInnerCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0B1736',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  fabMascotImage: {
    width: 54,
    height: 54,
    borderRadius: 27
  },
  fabOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  modalSafe: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 6
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  backBtn: {
    padding: 2
  },
  avatarWrapper: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#38BDF8'
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#0B1736'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  headerSubtitle: {
    fontSize: 9.5,
    fontWeight: '500'
  },
  headerVoiceBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  singleLangBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0F1D3D',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    minWidth: 54
  },
  singleLangBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  voiceSettingsPanel: {
    marginHorizontal: 12,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6
  },
  voicePanelTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  voiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  voiceLabel: {
    fontSize: 12,
    fontWeight: '500'
  },
  toggleSwitch: {
    width: 42,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center'
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 2
  },
  genderChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1'
  },
  genderChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },
  genderChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  speakingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1
  },
  speakingBannerText: {
    fontSize: 11.5,
    fontWeight: '600'
  },
  stopSpeakingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  stopSpeakingBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  listeningBanner: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 6
  },
  listeningText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  messagesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8
  },
  starterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 4
  },
  starterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1
  },
  starterChipText: {
    fontSize: 11,
    fontWeight: '600'
  },
  // Inline Mood Check-in directly under Mitra Greeting
  inlineMoodWrap: {
    marginTop: 6,
    marginBottom: 2
  },
  inlineMoodPrompt: {
    fontSize: 10.5,
    marginBottom: 4,
    fontWeight: '600'
  },
  inlineMoodPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  inlineMoodPill: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1
  },
  inlineMoodPillText: {
    fontSize: 10,
    fontWeight: '700'
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 2
  },
  botAvatarMini: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#38BDF8',
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1
  },
  messageText: {
    fontSize: 12.5,
    lineHeight: 19
  },
  speechBubbleBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF'
  },
  timeText: {
    fontSize: 9,
    paddingHorizontal: 2
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700'
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  emergencyBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700'
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 4
  },
  quickReplyChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  quickReplyText: {
    fontSize: 11,
    fontWeight: '600'
  },
  // Sleek 1-Row Horizontal Features Strip (ONLY 30px high)
  compactFeaturesStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    gap: 6
  },
  featureGridIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  featureGridCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB'
  },
  compactChipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 6
  },
  slimPill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1
  },
  slimPillText: {
    fontSize: 10.5,
    fontWeight: '600'
  },
  closeStripBtn: {
    padding: 3
  },
  // Input Bar
  inputBar: {
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
    paddingTop: 4,
    borderTopWidth: 1
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    maxHeight: 84,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4
  },
  actionToggleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  micButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 4,
    maxHeight: 76
  },
  sendIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomPrivacyNotice: {
    fontSize: 9.5,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500'
  },
  // Full 7-Features Floating Modal Sheet
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  sheetBackdrop: {
    flex: 1
  },
  sheetContent: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    padding: 14,
    maxHeight: '65%'
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between'
  },
  gridCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1
  },
  gridCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1
  },
  // Language Modal
  langModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  langModalBox: {
    width: '100%',
    maxWidth: 290,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10
  },
  langModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  langModalHeading: {
    fontSize: 13,
    fontWeight: '700'
  },
  langModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4
  },
  langModalOptionText: {
    fontSize: 13,
    fontWeight: '700'
  },
  // Clear Chat Confirmation Modal
  confirmModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  confirmModalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  confirmModalTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center'
  },
  confirmModalMsg: {
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  confirmModalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  confirmModalBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmModalBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  // Settings Modal Sheet Styling
  settingsSheetContent: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    padding: 16
  },
  settingsSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 4
  },
  settingsSheetTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  settingsIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsItemTitle: {
    fontSize: 12.5,
    fontWeight: '600'
  },
  settingsItemSub: {
    fontSize: 10,
    marginTop: 1
  },
  aestheticSwitch: {
    width: 38,
    height: 22,
    borderRadius: 11,
    padding: 2,
    justifyContent: 'center',
    borderWidth: 1
  },
  aestheticSwitchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2
  },
  // Settings Language Segmented Selector
  langSegmentedWrap: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginTop: 4
  },
  langSegmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7
  },
  langSegmentText: {
    fontSize: 12
  },
  historyCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  historyCountBadgeText: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  // ChatGPT-Style Full History Screen
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  historyHeaderTitle: {
    fontSize: 15.5,
    fontWeight: '700'
  },
  historyHeaderSub: {
    fontSize: 11,
    marginTop: 1
  },
  historyNewChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16
  },
  historyNewChatBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden'
  },
  historyCardTitle: {
    fontSize: 13,
    flexShrink: 1
  },
  historyCardMeta: {
    fontSize: 10.5
  },
  historyCardMetaDot: {
    fontSize: 10
  },
  activeChatBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    marginLeft: 4
  },
  activeChatBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  historyDeleteBtn: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyHistoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20
  },
  emptyHistoryIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  emptyHistoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center'
  },
  emptyHistoryMsg: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  emptyStartChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20
  },
  emptyStartChatBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
