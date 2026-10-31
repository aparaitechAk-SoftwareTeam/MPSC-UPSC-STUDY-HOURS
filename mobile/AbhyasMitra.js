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
import { smartApiFetch } from './api';

// 3D Robot Mascot Image
const MASCOT_IMG = require('./assets/mitra_mascot.jpg');

// Multilingual labels matching exact user requirements
const UI_TEXT = {
  en: {
    title: 'Abhyas Mitra',
    subtitle: 'Online • Always with you',
    placeholder: 'Talk to Abhyas Mitra...',
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
    helplineBtn: '📞 Call Tele-MANAS: 14416 (Free 24/7)',
    openPlannerBtn: '📅 Open Study Planner',
    startTimerBtn: '▶ Start Focus Timer',
    privacyNote: '100% Free & Private • Rule-based study companion'
  },
  mr: {
    title: 'अभ्यास मित्र',
    subtitle: 'ऑनलाइन • सदैव तुमच्यासोबत',
    placeholder: 'अभ्यास मित्राशी बोला...',
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
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (मोफत)',
    openPlannerBtn: '📅 प्लॅनर उघडा',
    startTimerBtn: '▶ टायमर सुरू करा',
    privacyNote: '१००% मोफत व सुरक्षित • अभ्यास साथीदार'
  },
  hi: {
    title: 'अभ्यास मित्र',
    subtitle: 'ऑनलाइन • सदैव आपके साथ',
    placeholder: 'अभ्यास मित्र से बात करें...',
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
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416 (निःशुल्क)',
    openPlannerBtn: '📅 प्लानर खोलें',
    startTimerBtn: '▶ टाइमर शुरू करें',
    privacyNote: '100% निःशुल्क और सुरक्षित • सच्चा साथी'
  }
};

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

  const handleLanguageSwitch = (newLang) => {
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
        setMessages(prev => [
          ...prev,
          {
            id: 'm_' + Date.now(),
            sender: 'mitra',
            text: data.reply,
            action: data.action,
            suggestedActionLabel: data.suggestedActionLabel,
            helpline: data.helpline,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      // Offline fallback: Generates empathetic local response if backend is offline
      const fallbackReply = generateClientFallback(userMsg.text, activeLang, sessions, plans);
      setMessages(prev => [
        ...prev,
        {
          id: 'm_fallback_' + Date.now(),
          sender: 'mitra',
          text: fallbackReply.text,
          action: fallbackReply.action,
          helpline: fallbackReply.helpline,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
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

  // Color Palette specifically tailored to match the mockup image:
  // Clean white card background with navy blue header and gold accents
  const colors = {
    screenBg: isDark ? '#080E1E' : '#F8FAFC',
    cardBg: isDark ? '#111B33' : '#FFFFFF',
    headerBg: '#0B1736', // Deep navy blue header matching mockup
    headerGold: '#F59E0B',
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
          {/* Subtle Outer Glow Halo */}
          <View style={styles.fabGlowRing} />
          <View style={styles.fabInnerCircle}>
            <Image
              source={MASCOT_IMG}
              style={styles.fabMascotImage}
              resizeMode="cover"
            />
            {/* Glowing Green Online Indicator */}
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
            {/* Top Navigation Header matching Mockup: Deep Navy Blue */}
            <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* Back Arrow button */}
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.backBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="chevron-back" size={24} color="#CBD5E1" />
                </TouchableOpacity>

                {/* 3D Robot Mascot Avatar with Online Dot */}
                <View style={styles.avatarWrapper}>
                  <Image
                    source={MASCOT_IMG}
                    style={styles.avatarMascotImage}
                    resizeMode="cover"
                  />
                  <View style={styles.avatarOnlineDot} />
                </View>

                {/* Bot Title & Status */}
                <View>
                  <Text style={[styles.headerTitle, { color: colors.titleText }]}>{t.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
                    <Text style={[styles.headerSubtitle, { color: colors.subtitleText }]}>{t.subtitle}</Text>
                  </View>
                </View>
              </View>

              {/* Language Selector Pills [ EN | म | हि ] */}
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
                      {idx < 2 && <Text style={{ color: '#334155', fontSize: 11 }}>|</Text>}
                    </React.Fragment>
                  );
                })}
              </View>
            </View>

            {/* Conversation Feed */}
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* Feature 1: Interactive Daily Mood Check-In Widget matching UI */}
              <View style={[styles.moodCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
                <Text style={[styles.moodCardTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {t.moodTitle}
                </Text>
                <Text style={[styles.moodCardSubtitle, { color: colors.muted }]}>
                  {t.moodSubtitle}
                </Text>
                <View style={styles.moodButtonsRow}>
                  {t.moods.map(m => (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => sendMessage(m.label)}
                      style={[
                        styles.moodButton,
                        { backgroundColor: m.bg, borderColor: m.border }
                      ]}
                    >
                      <Text style={[styles.moodButtonText, { color: m.color }]}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Message Bubbles */}
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
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

                    <View style={{ maxWidth: '82%' }}>
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

                      <Text
                        style={[
                          styles.timeText,
                          { color: colors.muted, textAlign: isUser ? 'right' : 'left' }
                        ]}
                      >
                        {msg.timestamp}
                      </Text>
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

            {/* Feature Action Chips: Styled neatly matching the mockup image */}
            <View style={[styles.chipsContainer, { backgroundColor: colors.screenBg, borderColor: colors.border }]}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScrollRow}
              >
                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'मूलभूत हक्क समजावून सांगा' : activeLang === 'hi' ? 'मौलिक अधिकार क्या हैं?' : 'Explain Fundamental Rights')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.study}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'एक झटपट प्रश्न विचारा' : activeLang === 'hi' ? 'एक त्वरित क्विज़ प्रश्न पूछें' : 'Give me a quick quiz')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.quiz}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'परीक्षेचा खूप ताण आलाय' : activeLang === 'hi' ? 'परीक्षा का बहुत तनाव है' : 'I have exam anxiety')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.anxiety}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास कमबॅक कसा करू?' : activeLang === 'hi' ? 'स्टडी कमबैक कैसे करूँ?' : 'How to do a study comeback?')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.comeback}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'सोप्या भाषेत समजावून सांगा' : activeLang === 'hi' ? 'सरल शब्दों में समझाइए' : "Explain Like I'm 10")}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.eli10}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'रिव्हिजन कशी करू?' : activeLang === 'hi' ? 'रिवीजन कैसे करूँ?' : 'Revision reminders and spaced repetition')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.revision}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास वेळापत्रक नियोजन' : activeLang === 'hi' ? 'स्टडी टाइमटेबल प्लानिंग' : 'Study planner routine')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.planning}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Bottom Input Area matching Mockup */}
            <View style={[styles.inputBar, { backgroundColor: colors.screenBg, borderColor: colors.border }]}>
              <View style={[styles.inputPill, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={t.placeholder}
                  placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                  style={[styles.textInput, { color: colors.inputText }]}
                  onSubmitEditing={() => sendMessage()}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  onPress={() => sendMessage()}
                  disabled={!inputText.trim() || loading}
                  style={[
                    styles.sendIconButton,
                    {
                      backgroundColor: inputText.trim() && !loading ? '#38BDF8' : '#94A3B8',
                      opacity: inputText.trim() && !loading ? 1 : 0.6
                    }
                  ]}
                >
                  <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
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
// Component Styles matching exact Mockup Image
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  backBtn: {
    padding: 4,
    marginRight: 2
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarMascotImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#38BDF8'
  },
  avatarOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#0B1736'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#080E1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5
  },
  langPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8
  },
  langPillActive: {
    backgroundColor: '#F8FAFC'
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  messagesContainer: {
    padding: 16,
    gap: 14
  },
  moodCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 6
  },
  moodCardTitle: {
    fontSize: 14,
    fontWeight: '700'
  },
  moodCardSubtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10
  },
  moodButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  moodButton: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1
  },
  moodButtonText: {
    fontSize: 12,
    fontWeight: '700'
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4
  },
  botAvatarMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    paddingHorizontal: 4
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  emergencyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  chipsContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1
  },
  chipsScrollRow: {
    flexDirection: 'row',
    gap: 8
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600'
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 10 : 14,
    paddingTop: 4
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0
  },
  sendIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
