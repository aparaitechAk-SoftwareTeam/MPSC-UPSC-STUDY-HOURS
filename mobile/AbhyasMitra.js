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
import { Ionicons } from '@expo/vector-icons';
import { smartApiFetch } from './api';

// Multilingual labels for Mitra UI matching user requirements
const UI_TEXT = {
  en: {
    title: 'Abhyas Mitra',
    subtitle: 'Online • Always with you',
    placeholder: 'Talk to your study companion...',
    greeting: "Hi there! I'm your Abhyas Mitra study buddy. How can I support your UPSC/MPSC journey today? ❤️",
    features: {
      study: '📖 Study Buddy',
      emotion: '❤️ Emotional Support',
      planning: '📅 Study Planning',
      focus: '⏱️ Focus Friend',
      progress: '📊 My Progress',
      quiz: '🎯 Quick Quiz',
      help: '💡 App Help'
    },
    helplineBtn: '📞 Call Tele-MANAS: 14416',
    openPlannerBtn: '📅 Open Study Planner',
    startTimerBtn: '▶ Start Focus Timer',
    privacyNote: '100% Free & Private • Predefined UPSC/MPSC knowledge'
  },
  mr: {
    title: 'अभ्यास मित्र',
    subtitle: 'ऑनलाइन • सदैव तुमच्यासोबत',
    placeholder: 'तुमच्या अभ्यास मित्राशी बोला...',
    greeting: 'नमस्कार! मी तुमचा अभ्यास मित्र आहे. आज तुमच्या UPSC/MPSC अभ्यासात मी काय मदत करू? ❤️',
    features: {
      study: '📖 अभ्यास मित्र',
      emotion: '❤️ भावनिक आधार',
      planning: '📅 अभ्यास नियोजन',
      focus: '⏱️ एकाग्रता साथी',
      progress: '📊 माझी प्रगती',
      quiz: '🎯 झटपट प्रश्नमंजुषा',
      help: '💡 अॅप मदत'
    },
    helplineBtn: '📞 टेली-मानस संपर्क: 14416',
    openPlannerBtn: '📅 प्लॅनर उघडा',
    startTimerBtn: '▶ टायमर सुरू करा',
    privacyNote: '१००% मोफत व सुरक्षित • मार्गदर्शक'
  },
  hi: {
    title: 'अभ्यास मित्र',
    subtitle: 'ऑनलाइन • सदैव आपके साथ',
    placeholder: 'अपने अभ्यास मित्र से बात करें...',
    greeting: 'नमस्ते! मैं आपका अभ्यास मित्र हूँ। आज आपकी UPSC/MPSC तैयारी में मैं क्या सहायता कर सकता हूँ? ❤️',
    features: {
      study: '📖 स्टडी बडी',
      emotion: '❤️ भावनात्मक संबल',
      planning: '📅 स्टडी प्लानिंग',
      focus: '⏱️ फोकस फ्रेंड',
      progress: '📊 मेरी प्रगति',
      quiz: '🎯 त्वरित क्विज़',
      help: '💡 ऐप गाइड'
    },
    helplineBtn: '📞 टेली-मानस हेल्पलाइन: 14416',
    openPlannerBtn: '📅 प्लानर खोलें',
    startTimerBtn: '▶ टाइमर शुरू करें',
    privacyNote: '100% निःशुल्क और सुरक्षित • सच्चा साथी'
  }
};

export default function AbhyasMitra({
  isDark = true,
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

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'mitra',
      text: t.greeting,
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

    const welcomeText = (UI_TEXT[newLang] || UI_TEXT.en).greeting;
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

  // Color Palette specifically tailored to match the mockup image
  const colors = {
    screenBg: isDark ? '#080E1E' : '#F4F7FC',
    headerBg: isDark ? '#0D152A' : '#FFFFFF',
    border: isDark ? '#1C2744' : '#E2E8F0',
    titleText: isDark ? '#FFFFFF' : '#0F172A',
    subtitleText: isDark ? '#22C55E' : '#16A34A',
    userBubble: '#2457C5',
    userBubbleBorder: '#3B82F6',
    userText: '#FFFFFF',
    mitraBubble: isDark ? '#141D35' : '#FFFFFF',
    mitraBubbleBorder: isDark ? '#223259' : '#E2E8F0',
    mitraText: isDark ? '#F1F5F9' : '#1E293B',
    muted: isDark ? '#8A99B5' : '#64748B',
    chipBg: isDark ? '#121A30' : '#FFFFFF',
    chipBorder: isDark ? '#223055' : '#CBD5E1',
    chipText: isDark ? '#D8E2F5' : '#1E293B',
    inputBg: isDark ? '#0D152A' : '#FFFFFF',
    inputBorder: isDark ? '#223259' : '#CBD5E1',
    inputText: isDark ? '#FFFFFF' : '#0F172A',
    sendBg: '#2563EB'
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
            <Text style={{ fontSize: 26 }}>🤖</Text>
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
            {/* Top Navigation Header matching Mockup */}
            <View style={[styles.header, { backgroundColor: colors.headerBg, borderColor: colors.border }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {/* Back Arrow button */}
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.backBtn}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="chevron-back" size={24} color={isDark ? '#CBD5E1' : '#334155'} />
                </TouchableOpacity>

                {/* Mascot Avatar with Online Dot */}
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    <Text style={{ fontSize: 20 }}>🤖</Text>
                  </View>
                  <View style={styles.avatarOnlineDot} />
                </View>

                {/* Bot Title & Status */}
                <View>
                  <Text style={[styles.headerTitle, { color: colors.titleText }]}>{t.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' }} />
                    <Text style={[styles.headerSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>{t.subtitle}</Text>
                  </View>
                </View>
              </View>

              {/* Language Selector Pills [ EN | म | हि ] */}
              <View style={[styles.langContainer, { borderColor: colors.border, backgroundColor: isDark ? '#080E1E' : '#F1F5F9' }]}>
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
                            { color: isActive ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') }
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                      {idx < 2 && <Text style={{ color: isDark ? '#2E3D63' : '#CBD5E1', fontSize: 11 }}>|</Text>}
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
                        <Text style={{ fontSize: 14 }}>🤖</Text>
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
                    <Text style={{ fontSize: 14 }}>🤖</Text>
                  </View>
                  <View style={[styles.bubble, { backgroundColor: colors.mitraBubble, borderColor: colors.mitraBubbleBorder, paddingVertical: 12 }]}>
                    <ActivityIndicator size="small" color="#3B82F6" />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Feature Action Chips: Styled neatly matching the mockup image */}
            <View style={[styles.chipsContainer, { backgroundColor: colors.screenBg, borderColor: colors.border }]}>
              <View style={styles.chipsGrid}>
                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'मूलभूत हक्क समजावून सांगा' : activeLang === 'hi' ? 'मौलिक अधिकार क्या हैं?' : 'Explain Fundamental Rights')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.study}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'माझा दिवस वाया गेला. खूप ताण आलाय.' : activeLang === 'hi' ? 'मेरा पूरा दिन बर्बाद हो गया। बहुत तनाव है।' : 'I wasted my whole day. I feel so guilty.')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.emotion}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'अभ्यास वेळापत्रक कसे बनवू?' : activeLang === 'hi' ? 'स्टडी टाइमटेबल कैसे बनाऊं?' : 'How should I plan my study routine?')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.planning}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'एकाग्रता कशी वाढवू? पोमोडोरो तंत्र' : activeLang === 'hi' ? 'फोकस कैसे करें? पोमोडोरो तकनीक' : 'How to use Pomodoro focus?')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.focus}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => sendMessage(activeLang === 'mr' ? 'आज माझा किती अभ्यास झाला?' : activeLang === 'hi' ? 'आज मेरी कितनी पढ़ाई हुई?' : 'How much did I study today?')}
                  style={[styles.chipPill, { backgroundColor: colors.chipBg, borderColor: colors.chipBorder }]}
                >
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{t.features.progress}</Text>
                </TouchableOpacity>
              </View>
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
                      backgroundColor: inputText.trim() && !loading ? '#2563EB' : 'transparent',
                      opacity: inputText.trim() && !loading ? 1 : 0.4
                    }
                  ]}
                >
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60A5FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
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
    borderBottomWidth: 1
  },
  backBtn: {
    padding: 4,
    marginRight: 2
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3B82F6'
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
    borderColor: '#0D152A'
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 4
  },
  langPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  langPillActive: {
    backgroundColor: '#2563EB'
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  messagesContainer: {
    padding: 16,
    gap: 14
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4
  },
  botAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginTop: 2
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    paddingHorizontal: 16
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
