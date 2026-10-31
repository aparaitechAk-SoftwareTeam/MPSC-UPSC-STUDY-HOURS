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
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { smartApiFetch } from './api';

// 3D Robot Mascot Image
const MASCOT_IMG = require('./assets/mitra_mascot.jpg');

// Multilingual labels matching exact user requirements
const UI_TEXT = {
  en: {
    title: 'Abhyas Mitra',
    subtitle: 'Always with you',
    placeholder: 'Talk or tap mic to speak...',
    moodTitle: 'Daily Mood Check-in',
    moodSubtitle: 'How are you feeling today?',
    moods: [
      { id: 'energized', label: '⚡ Energized', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
      { id: 'focused', label: '😊 Focused', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
      { id: 'tired', label: '😴 Tired', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
      { id: 'anxious', label: '😰 Anxious', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }
    ],
    greeting: (name, completed, total) =>
      `Welcome ${name || 'Aspirant'}! You have completed ${completed} of ${total || 5} topics. How can I help your preparation today? ❤️`,
    features: {
      study: '📚 Study Buddy',
      quiz: '📝 Daily Quiz',
      anxiety: '❤️ Anxiety Support',
      comeback: '🔄 Study Comeback',
      eli10: "👶 Explain Like I'm 10",
      revision: '🔁 Revision Reminder',
      planning: '📅 Study Planner'
    },
    quickActionsLabel: 'Quick Actions (7 Features)',
    collapse: 'Show Less ▴',
    expand: 'View All ▾',
    helplineBtn: '📞 Call Tele-MANAS: 14416 (Free 24/7)',
    openPlannerBtn: '📅 Open Study Planner',
    startTimerBtn: '▶ Start Focus Timer',
    privacyNote: '100% Free & Private • Rule-based study companion',
    voiceSettings: 'Voice Settings',
    voiceAutoRead: 'Read answers aloud',
    voiceGender: 'Voice Pitch',
    female: 'Female',
    male: 'Male',
    listening: '🎙️ Listening... Speak your question now',
    listen: '🔊 Listen',
    stop: '⏹️ Stop'
  },
  mr: {
    title: 'अभ्यास मित्र',
    subtitle: 'सदैव तुमच्यासोबत',
    placeholder: 'टाईप करा किंवा बोला...',
    moodTitle: 'दैनिक मूड चेक-इन',
    moodSubtitle: 'आज तुम्हाला कसे वाटते आहे?',
    moods: [
      { id: 'energized', label: '⚡ उत्साही', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
      { id: 'focused', label: '😊 एकाग्र', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
      { id: 'tired', label: '😴 थकवा', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
      { id: 'anxious', label: '😰 ताण', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }
    ],
    greeting: (name, completed, total) =>
      `स्वागत आहे ${name || 'मित्रा'}! तुम्ही ${completed} पैकी ५ विषय पूर्ण केले आहेत. आज अभ्यासात मी काय मदत करू? ❤️`,
    features: {
      study: '📚 अभ्यास मित्र',
      quiz: '📝 दैनिक प्रश्नमंजुषा',
      anxiety: '❤️ ताण निवारण',
      comeback: '🔄 अभ्यास कमबॅक',
      eli10: '👶 सोप्या भाषेत (ELI10)',
      revision: '🔁 उजळणी आठवण',
      planning: '📅 अभ्यास नियोजन'
    },
    quickActionsLabel: 'मुख्य वैशिष्ट्ये (७ फीचर्स)',
    collapse: 'कमी करा ▴',
    expand: 'सर्व ७ पहा ▾',
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (मोफत)',
    openPlannerBtn: '📅 प्लॅनर उघडा',
    startTimerBtn: '▶ टायमर सुरू करा',
    privacyNote: '१००% मोफत व सुरक्षित • अभ्यास साथीदार',
    voiceSettings: 'आवाज सेटिंग्ज',
    voiceAutoRead: 'उत्तरे मोठ्याने वाचा',
    voiceGender: 'आवाज प्रकार',
    female: 'स्त्री आवाज',
    male: 'पुरुष आवाज',
    listening: '🎙️ ऐकत आहे... तुमचा प्रश्न बोला',
    listen: '🔊 ऐका',
    stop: '⏹️ थांबवा'
  },
  hi: {
    title: 'अभ्यास मित्र',
    subtitle: 'सदैव आपके साथ',
    placeholder: 'टाइप करें या बोलें...',
    moodTitle: 'दैनिक मूड चेक-इन',
    moodSubtitle: 'आज आप कैसा महसूस कर रहे हैं?',
    moods: [
      { id: 'energized', label: '⚡ ऊर्जान्वित', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
      { id: 'focused', label: '😊 एकाग्र', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
      { id: 'tired', label: '😴 थकावट', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
      { id: 'anxious', label: '😰 तनाव', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' }
    ],
    greeting: (name, completed, total) =>
      `नमस्ते ${name || 'साथी'}! आपने ${completed} में से ५ टॉपिक पूरे कर लिए हैं। आज आपकी तैयारी में मैं क्या मदद करूँ? ❤️`,
    features: {
      study: '📚 स्टडी बडी',
      quiz: '📝 दैनिक क्विज़',
      anxiety: '❤️ तनाव मुक्ति',
      comeback: '🔄 स्टडी कमबैक',
      eli10: '👶 सरल शब्दों में (ELI10)',
      revision: '🔁 रिवीजन रिमाइंडर',
      planning: '📅 स्टडी प्लानर'
    },
    quickActionsLabel: 'मुख्य सुविधाएं (७ फीचर्स)',
    collapse: 'कम दिखाएं ▴',
    expand: 'सभी ७ देखें ▾',
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (निःशुल्क)',
    openPlannerBtn: '📅 प्लानर खोलें',
    startTimerBtn: '▶ टाइमर शुरू करें',
    privacyNote: '100% निःशुल्क और सुरक्षित • सच्चा साथी',
    voiceSettings: 'ध्वनि सेटिंग्स',
    voiceAutoRead: 'उत्तर बोलकर सुनाएं',
    voiceGender: 'आवाज का प्रकार',
    female: 'महिला आवाज',
    male: 'पुरुष आवाज',
    listening: '🎙️ सुन रहा हूँ... अपना सवाल बोलिए',
    listen: '🔊 सुनें',
    stop: '⏹️ रोकें'
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
  const [showFeaturesBar, setShowFeaturesBar] = useState(true);
  const [featuresGridModal, setFeaturesGridModal] = useState(false);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [voiceGender, setVoiceGender] = useState('female'); // 'female' | 'male'
  const [isSpeakingId, setIsSpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  // Sync active language with parent if updated
  useEffect(() => {
    if (currentLang && ['en', 'mr', 'hi'].includes(currentLang)) {
      setActiveLang(currentLang);
    }
  }, [currentLang]);

  const t = UI_TEXT[activeLang] || UI_TEXT.en;
  const userName = user?.name ? user.name.split(' ')[0] : 'Bhumika';
  const completedPlansCount = (plans || []).filter(p => p.done).length;

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'mitra',
      text: t.greeting(userName, completedPlansCount, (plans || []).length || 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

    const welcomeText = (UI_TEXT[newLang] || UI_TEXT.en).greeting(
      userName,
      completedPlansCount,
      (plans || []).length || 5
    );
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
          lang: activeLang
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

  // Color Palette tailored to clean frame
  const colors = {
    screenBg: isDark ? '#080E1E' : '#F8FAFC',
    cardBg: isDark ? '#111B33' : '#FFFFFF',
    headerBg: '#0B1736',
    border: isDark ? '#1C2744' : '#E2E8F0',
    titleText: '#FFFFFF',
    subtitleText: '#94A3B8',
    userBubble: '#2457C5',
    userBubbleBorder: '#3B82F6',
    userText: '#FFFFFF',
    mitraBubble: isDark ? '#141D35' : '#F1F5F9',
    mitraBubbleBorder: isDark ? '#223259' : '#E2E8F0',
    mitraText: isDark ? '#F1F5F9' : '#1E293B',
    muted: isDark ? '#8A99B5' : '#64748B',
    chipBg: isDark ? '#121A30' : '#FFFFFF',
    chipBorder: isDark ? '#223055' : '#CBD5E1',
    chipText: isDark ? '#D8E2F5' : '#1E293B',
    inputBg: isDark ? '#0D152A' : '#FFFFFF',
    inputBorder: isDark ? '#223259' : '#CBD5E1',
    inputText: isDark ? '#FFFFFF' : '#0F172A',
    sendBg: '#38BDF8'
  };

  return (
    <>
      {/* ---------------- 1. FLOATING CIRCULAR LAUNCHER (FAB) ---------------- */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          activeOpacity={0.88}
          style={styles.fabButton}
        >
          <View style={styles.fabGlowRing} />
          <View style={styles.fabInnerCircle}>
            <Image
              source={MASCOT_IMG}
              style={styles.fabMascotImage}
              resizeMode="cover"
            />
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
            <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.backBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="chevron-back" size={22} color="#CBD5E1" />
                </TouchableOpacity>

                <View style={styles.avatarWrapper}>
                  <Image
                    source={MASCOT_IMG}
                    style={styles.avatarMascotImage}
                    resizeMode="cover"
                  />
                  <View style={styles.avatarOnlineDot} />
                </View>

                <View style={{ flexShrink: 1 }}>
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
                {/* Daily Mood Check-In Toggle */}
                <TouchableOpacity
                  onPress={() => setShowMoodBanner(!showMoodBanner)}
                  style={[styles.headerVoiceBtn, showMoodBanner && { backgroundColor: '#1E3A8A' }]}
                >
                  <Ionicons
                    name={showMoodBanner ? 'happy' : 'happy-outline'}
                    size={16}
                    color={showMoodBanner ? '#38BDF8' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Voice Settings Toggle Icon */}
                <TouchableOpacity
                  onPress={() => setVoiceSettingsOpen(!voiceSettingsOpen)}
                  style={[styles.headerVoiceBtn, autoReadAloud && { backgroundColor: '#1E3A8A' }]}
                >
                  <Ionicons
                    name={autoReadAloud ? 'volume-high' : 'volume-medium-outline'}
                    size={16}
                    color={autoReadAloud ? '#38BDF8' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Compact Language Selector Pills [ EN | म | हि ] */}
                <View style={styles.langContainer}>
                  {[
                    ['en', 'EN'],
                    ['mr', 'म'],
                    ['hi', 'हि']
                  ].map(([code, label], idx) => {
                    const isActive = activeLang === code;
                    return (
                      <React.Fragment key={code}>
                        <TouchableOpacity
                          onPress={() => handleLanguageSwitch(code)}
                          style={[
                            styles.langPill,
                            isActive && styles.langPillActive
                          ]}
                        >
                          <Text
                            style={[
                              styles.langPillText,
                              { color: isActive ? '#0B1736' : '#94A3B8' }
                            ]}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                        {idx < 2 && <Text style={{ color: '#334155', fontSize: 10 }}>|</Text>}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Voice Assistant Settings Dropdown Panel */}
            {voiceSettingsOpen && (
              <View style={[styles.voiceSettingsPanel, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="mic-circle-outline" size={18} color="#38BDF8" />
                    <Text style={[styles.voicePanelTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                      {t.voiceSettings}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setVoiceSettingsOpen(false)}>
                    <Ionicons name="close" size={16} color={colors.muted} />
                  </TouchableOpacity>
                </View>

                {/* Auto read aloud switch */}
                <View style={styles.voiceRow}>
                  <Text style={[styles.voiceLabel, { color: colors.mitraText }]}>{t.voiceAutoRead}</Text>
                  <TouchableOpacity
                    onPress={() => setAutoReadAloud(!autoReadAloud)}
                    style={[styles.toggleSwitch, autoReadAloud ? { backgroundColor: '#2563EB' } : { backgroundColor: '#CBD5E1' }]}
                  >
                    <View style={[styles.toggleThumb, autoReadAloud ? { transform: [{ translateX: 18 }] } : { transform: [{ translateX: 0 }] }]} />
                  </TouchableOpacity>
                </View>

                {/* Voice Gender Selection */}
                <View style={[styles.voiceRow, { marginTop: 8 }]}>
                  <Text style={[styles.voiceLabel, { color: colors.mitraText }]}>{t.voiceGender}</Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    <TouchableOpacity
                      onPress={() => setVoiceGender('female')}
                      style={[styles.genderChip, voiceGender === 'female' && styles.genderChipActive]}
                    >
                      <Text style={[styles.genderChipText, voiceGender === 'female' && { color: '#FFFFFF' }]}>
                        {t.female}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVoiceGender('male')}
                      style={[styles.genderChip, voiceGender === 'male' && styles.genderChipActive]}
                    >
                      <Text style={[styles.genderChipText, voiceGender === 'male' && { color: '#FFFFFF' }]}>
                        {t.male}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
              {/* Daily Mood Check-In Widget: Ultra-Compact & Dismissible Banner */}
              {showMoodBanner && (
                <View style={[styles.compactMoodBanner, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                  <View style={styles.compactMoodHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Text style={{ fontSize: 12 }}>💡</Text>
                      <Text style={[styles.compactMoodTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                        {t.moodTitle}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowMoodBanner(false)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="close" size={13} color={colors.muted} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.compactMoodList}
                  >
                    {t.moods.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => {
                          setShowMoodBanner(false);
                          sendMessage(m.label);
                        }}
                        style={[
                          styles.compactMoodButton,
                          { backgroundColor: m.bg, borderColor: m.border }
                        ]}
                      >
                        <Text style={[styles.compactMoodButtonText, { color: m.color }]}>{m.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

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
                      <View style={styles.botAvatarMini}>
                        <Image
                          source={MASCOT_IMG}
                          style={styles.botAvatarMiniImg}
                          resizeMode="cover"
                        />
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
                        <Text
                          style={[
                            styles.messageText,
                            { color: isUser ? colors.userText : colors.mitraText }
                          ]}
                        >
                          {msg.text}
                        </Text>
                      </View>

                      {/* Bot Message Voice Play/Stop Button */}
                      {!isUser && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <TouchableOpacity
                            onPress={() => speakText(msg.text, msg.id)}
                            style={[styles.speechBubbleBtn, isSpeakingThis && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}
                          >
                            <Ionicons
                              name={isSpeakingThis ? 'stop-circle' : 'volume-medium'}
                              size={13}
                              color={isSpeakingThis ? '#DC2626' : '#2563EB'}
                            />
                            <Text style={[styles.speechBubbleText, { color: isSpeakingThis ? '#DC2626' : '#2563EB' }]}>
                              {isSpeakingThis ? t.stop : t.listen}
                            </Text>
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
                          <Text style={styles.actionBtnText}>{t.openPlannerBtn}</Text>
                        </TouchableOpacity>
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
                  <View style={styles.botAvatarMini}>
                    <Image source={MASCOT_IMG} style={styles.botAvatarMiniImg} />
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
                  <Text style={styles.featureGridCountText}>7</Text>
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
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.study}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'एक झटपट प्रश्न विचारा' : activeLang === 'hi' ? 'एक त्वरित क्विज़ प्रश्न पूछें' : 'Give me a quick quiz')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.quiz}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'परीक्षेचा खूप ताण आलाय' : activeLang === 'hi' ? 'परीक्षा का बहुत तनाव है' : 'I have exam anxiety')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.anxiety}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास कमबॅक कसा करू?' : activeLang === 'hi' ? 'स्टडी कमबैक कैसे करूँ?' : 'How to do a study comeback?')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.comeback}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'सोप्या भाषेत समजावून सांगा' : activeLang === 'hi' ? 'सरल शब्दों में समझाइए' : "Explain Like I'm 10")}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.eli10}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'रिव्हिजन कशी करू?' : activeLang === 'hi' ? 'रिवीजन कैसे करूँ?' : 'Revision reminders and spaced repetition')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.revision}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास वेळापत्रक नियोजन' : activeLang === 'hi' ? 'स्टडी टाइमटेबल प्लानिंग' : 'Study planner routine')}
                    style={[styles.slimPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                  >
                    <Text style={[styles.slimPillText, { color: colors.chipText }]}>{t.features.planning}</Text>
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
            <View style={[styles.inputBar, { backgroundColor: colors.screenBg, borderColor: colors.border }]}>
              <View style={[styles.inputPill, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                {/* Feature Launcher Button */}
                <TouchableOpacity
                  onPress={() => setShowFeaturesBar(!showFeaturesBar)}
                  style={[
                    styles.actionToggleBtn,
                    showFeaturesBar && { backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF' }
                  ]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={showFeaturesBar ? 'sparkles' : 'sparkles-outline'}
                    size={16}
                    color={showFeaturesBar ? '#2563EB' : '#94A3B8'}
                  />
                </TouchableOpacity>

                {/* Microphone Voice Input Button */}
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
                    size={16}
                    color={isListening ? '#FFFFFF' : '#2563EB'}
                  />
                </TouchableOpacity>

                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={t.placeholder}
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[styles.textInput, { color: colors.inputText }]}
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
                      backgroundColor: inputText.trim() && !loading ? '#2563EB' : '#CBD5E1',
                      opacity: inputText.trim() && !loading ? 1 : 0.6
                    }
                  ]}
                >
                  <Ionicons name="paper-plane" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
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
                    <Text style={[styles.sheetTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
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
                    { key: 'study', title: t.features.study, prompt: activeLang === 'mr' ? 'मूलभूत हक्क समजावून सांगा' : activeLang === 'hi' ? 'मौलिक अधिकार क्या हैं?' : 'Explain Fundamental Rights', icon: 'book-outline', color: '#2563EB', bg: '#EFF6FF' },
                    { key: 'quiz', title: t.features.quiz, prompt: activeLang === 'mr' ? 'एक झटपट प्रश्न विचारा' : activeLang === 'hi' ? 'एक त्वरित क्विज़ प्रश्न पूछें' : 'Give me a quick quiz', icon: 'help-circle-outline', color: '#059669', bg: '#ECFDF5' },
                    { key: 'anxiety', title: t.features.anxiety, prompt: activeLang === 'mr' ? 'परीक्षेचा खूप ताण आलाय' : activeLang === 'hi' ? 'परीक्षा का बहुत तनाव है' : 'I have exam anxiety', icon: 'heart-outline', color: '#DC2626', bg: '#FEF2F2' },
                    { key: 'comeback', title: t.features.comeback, prompt: activeLang === 'mr' ? 'अभ्यास कमबॅक कसा करू?' : activeLang === 'hi' ? 'स्टडी कमबैक कैसे करूँ?' : 'How to do a study comeback?', icon: 'refresh-outline', color: '#7C3AED', bg: '#F5F3FF' },
                    { key: 'eli10', title: t.features.eli10, prompt: activeLang === 'mr' ? 'सोप्या भाषेत समजावून सांगा' : activeLang === 'hi' ? 'सरल शब्दों में समझाइए' : "Explain Like I'm 10", icon: 'bulb-outline', color: '#D97706', bg: '#FFFBEB' },
                    { key: 'revision', title: t.features.revision, prompt: activeLang === 'mr' ? 'रिव्हिजन कशी करू?' : activeLang === 'hi' ? 'रिवीजन कैसे करूँ?' : 'Revision reminders and spaced repetition', icon: 'repeat-outline', color: '#0891B2', bg: '#ECFEFF' },
                    { key: 'planning', title: t.features.planning, prompt: activeLang === 'mr' ? 'अभ्यास वेळापत्रक नियोजन' : activeLang === 'hi' ? 'स्टडी टाइमटेबल प्लानिंग' : 'Study planner routine', icon: 'calendar-outline', color: '#4F46E5', bg: '#EEF2FF' }
                  ].map(item => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => {
                        setFeaturesGridModal(false);
                        sendMessage(item.prompt);
                      }}
                      style={[styles.gridCard, { backgroundColor: isDark ? '#1E293B' : item.bg, borderColor: isDark ? '#334155' : '#E2E8F0' }]}
                    >
                      <Ionicons name={item.icon} size={18} color={item.color} />
                      <Text style={[styles.gridCardTitle, { color: isDark ? '#F1F5F9' : '#1E293B' }]} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
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

  return {
    text: lang === 'mr'
      ? "मी तुमचा अभ्यास मित्र आहे. मी मूलभूत संकल्पना, नियोजन, एकाग्रता आणि मानसिक आधारासाठी सदैव तयार आहे! 💙"
      : "I am your Abhyas Mitra study companion. I'm here for concept breakdowns, planning, Pomodoro focus, and friendly motivation! 💙",
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
    position: 'relative'
  },
  avatarMascotImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#38BDF8'
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#0B1736'
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  headerSubtitle: {
    fontSize: 10,
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
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#080E1E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4
  },
  langPill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6
  },
  langPillActive: {
    backgroundColor: '#F8FAFC'
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '700'
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
  // Compact Mood Banner
  compactMoodBanner: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4
  },
  compactMoodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  compactMoodTitle: {
    fontSize: 11,
    fontWeight: '700'
  },
  compactMoodList: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 6
  },
  compactMoodButton: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 14,
    borderWidth: 1
  },
  compactMoodButtonText: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 2
  },
  botAvatarMini: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#38BDF8',
    marginTop: 2
  },
  botAvatarMiniImg: {
    width: '100%',
    height: '100%'
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1
  },
  messageText: {
    fontSize: 12.5,
    lineHeight: 18.5
  },
  speechBubbleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF'
  },
  speechBubbleText: {
    fontSize: 9.5,
    fontWeight: '700'
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
    paddingTop: 3
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 6,
    gap: 4
  },
  actionToggleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  micButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 0
  },
  sendIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
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
  }
});
