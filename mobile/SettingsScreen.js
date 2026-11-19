import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Share,
  Linking,
  Alert,
  Platform,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Configurable environment endpoints with sensible defaults
const SUPPORT_EMAIL =
  process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'support@abhyas.local';
const STORE_URL = process.env.EXPO_PUBLIC_STORE_URL || '';
const PRIVACY_URL = process.env.EXPO_PUBLIC_PRIVACY_URL || '';

export default function SettingsScreen({
  user,
  isDarkMode = false,
  toggleTheme,
  theme,
  onBack,
  onSignOut,
  onOpenReminders,
  onOpenNotifications,
  onNavigateTab,
  req,
  lang = 'en'
}) {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Emerald green application theme tokens
  const C = theme || {
    bg: isDarkMode ? '#051811' : '#F4FBF7',
    white: isDarkMode ? '#0F291E' : '#FFFFFF',
    card: isDarkMode ? '#0F291E' : '#FFFFFF',
    ink: isDarkMode ? '#F2FDF7' : '#0B291B',
    muted: isDarkMode ? '#75A991' : '#4D7865',
    blue: isDarkMode ? '#10B981' : '#059669', // Primary Emerald Green
    soft: isDarkMode ? '#143829' : '#ECFDF5',
    line: isDarkMode ? '#17382A' : '#D1FAE5',
    danger: '#ef4444',
    dangerSoft: isDarkMode ? '#450a0a' : '#fef2f2'
  };

  const txt = (size = 14, bold = false, color = C.ink) => ({
    fontSize: size,
    fontWeight: bold ? '700' : '400',
    color
  });

  // Action: Share App
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Abhyas Tracker — Dedicated MPSC & UPSC Study Hours & Revision Tracker for serious aspirants. Track focus sessions, syllabus completion, and spaced repetition.\n\nKeep studying with discipline!',
        title: 'Abhyas Tracker — Study Tracker for MPSC & UPSC'
      });
    } catch (error) {
      Alert.alert(
        'Sharing Unavailable',
        error?.message || 'Could not launch native share dialog.'
      );
    }
  };

  // Action: Email Support
  const handleSupport = async () => {
    const subject = encodeURIComponent('Abhyas Tracker Student Support');
    const body = encodeURIComponent(
      `Hello Abhyas Support Team,\n\nStudent Name: ${user?.name || ''}\nEmail: ${user?.email || ''}\nApp Version: 1.0.0\nPlatform: ${Platform.OS}\n\nI need assistance with:\n`
    );
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Email Client Not Found',
          `Could not open default email client.\n\nPlease email support directly at:\n${SUPPORT_EMAIL}`
        );
      }
    } catch {
      Alert.alert(
        'Email Support',
        `Please contact our support team at:\n${SUPPORT_EMAIL}`
      );
    }
  };

  // Action: Rate App
  const handleRate = async () => {
    if (STORE_URL) {
      try {
        const canOpen = await Linking.canOpenURL(STORE_URL);
        if (canOpen) {
          await Linking.openURL(STORE_URL);
          return;
        }
      } catch {}
    }

    Alert.alert(
      'Rate Abhyas Tracker',
      'Abhyas Tracker is currently in development and has not yet been published to Google Play or Apple App Store.\n\nOnce published, this option will direct you to the official store rating page.'
    );
  };

  // Action: Privacy Policy
  const handlePrivacy = async () => {
    if (PRIVACY_URL) {
      try {
        const canOpen = await Linking.canOpenURL(PRIVACY_URL);
        if (canOpen) {
          await Linking.openURL(PRIVACY_URL);
          return;
        }
      } catch {}
    }
    setPrivacyModalVisible(true);
  };

  // Action: Confirm Account Deletion
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      if (typeof req === 'function') {
        // Attempt backend account deletion if an endpoint exists
        await req('/users/me', 'DELETE');
        setDeleteModalVisible(false);
        Alert.alert('Account Deleted', 'Your account has been deleted.');
        if (onSignOut) onSignOut();
      } else {
        throw new Error('Endpoint not implemented');
      }
    } catch {
      setDeleting(false);
      setDeleteModalVisible(false);
      Alert.alert(
        'Account Deletion Unavailable',
        `The backend server does not currently provide an active account-deletion endpoint.\n\nYour account and study data have NOT been modified. To permanently delete your account from the database, please contact your administrator or support at:\n${SUPPORT_EMAIL}`
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Back to Dashboard Navigation */}
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            paddingVertical: 6,
            alignSelf: 'flex-start'
          }}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={20} color={C.blue} />
          <Text style={[txt(14, true, C.blue), { marginLeft: 6 }]}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      )}

      {/* Screen Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={txt(26, true, C.ink)}>Settings</Text>
        <Text style={[txt(13, false, C.muted), { marginTop: 4 }]}>
          Preferences, theme, reminders, support, and account management
        </Text>
      </View>

      {/* Profile Overview Card */}
      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 20,
          padding: 18,
          marginBottom: 18,
          borderWidth: 1,
          borderColor: C.line,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: C.soft,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14
          }}
        >
          <Text style={txt(22, true, C.blue)}>
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={txt(16, true, C.ink)} numberOfLines={1}>{user?.name || 'Aspirant'}</Text>
          <Text style={[txt(12, false, C.muted), { marginTop: 2 }]} numberOfLines={1}>
            {user?.email || 'student@abhyas.local'}
          </Text>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: C.soft,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              marginTop: 6
            }}
          >
            <Text style={txt(11, true, C.blue)}>MPSC · UPSC Aspirant</Text>
          </View>
        </View>
      </View>

      {/* SECTION: App Sections & Quick Access */}
      <Text
        style={[
          txt(11, true, C.muted),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        {lang === 'mr' ? 'सर्व विभाग व अभ्यासक्रम' : 'App Sections & Quick Access'}
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.line,
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        {[
          { id: 'Dashboard', name: lang === 'mr' ? 'डॅशबोर्ड' : 'Dashboard', icon: 'home-outline', desc: lang === 'mr' ? 'दैनिक अभ्यास विहंगावलोकन, ध्येय व सातत्य' : 'Daily overview, focus goals & streaks', color: '#3b82f6', bg: isDarkMode ? '#1e3a5f' : '#eff6ff' },
          { id: 'Syllabus', name: lang === 'mr' ? 'अभ्यासक्रम ट्रॅकर' : 'Syllabus Tracker', icon: 'book-outline', desc: lang === 'mr' ? 'यूपीएससी व एमपीएससी सविस्तर अभ्यासक्रम' : 'UPSC & MPSC curriculum & topic mastery', color: '#8b5cf6', bg: isDarkMode ? '#2d2159' : '#f5f3ff' },
          { id: 'Timer', name: lang === 'mr' ? 'फोकस टाइमर' : 'Focus Timer', icon: 'stopwatch-outline', desc: lang === 'mr' ? 'पोमोडोरो, स्टॉपवॉच व सखोल अभ्यास सत्र' : 'Pomodoro timer & study sessions', color: '#0ea5e9', bg: isDarkMode ? '#1e3850' : '#f0f9ff' },
          { id: 'Planner', name: lang === 'mr' ? 'स्टडी प्लॅनर' : 'Study Planner', icon: 'calendar-outline', desc: lang === 'mr' ? 'आजचे, उद्याचे व साप्ताहिक अभ्यास नियोजन' : 'Plan study targets for today & tomorrow', color: '#10b981', bg: isDarkMode ? '#153e30' : '#ecfdf5' },
          { id: 'Analytics', name: lang === 'mr' ? 'अभ्यास विश्लेषण' : 'Study Analytics', icon: 'analytics-outline', desc: lang === 'mr' ? 'अभ्यास तास, सातत्य व विषयवार अहवाल' : 'Study trends, charts & subject breakdown', color: '#f59e0b', bg: isDarkMode ? '#3b2f15' : '#fffbeb' },
          { id: 'Ticket Support', name: lang === 'mr' ? 'सपोर्ट व मदत' : 'Ticket Support', icon: 'headset-outline', desc: lang === 'mr' ? 'मार्गदर्शक मदत, शंका व तक्रार निवारण' : 'Ask doubts & reach academic support', color: '#ec4899', bg: isDarkMode ? '#3f182c' : '#fdf2f8' }
        ].map((item, idx, arr) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              if (typeof onNavigateTab === 'function') {
                onNavigateTab(item.id);
              } else if (onBack) {
                onBack();
              }
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 14,
              borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
              borderBottomColor: C.line
            }}
            accessibilityLabel={item.name}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: item.bg || C.soft,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}
            >
              <Ionicons name={item.icon} size={20} color={item.color || C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={txt(14, true, C.ink)}>{item.name}</Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.muted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* SECTION A: Appearance */}
      <Text
        style={[
          txt(11, true, C.muted),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        Appearance
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.line,
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: C.soft,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}
            >
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={20}
                color={C.blue}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={txt(14, true, C.ink)}>Dark Mode</Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: isDarkMode ? '#1E3A2E' : '#D1FAE5', true: C.blue }}
            thumbColor={isDarkMode ? '#10B981' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* SECTION B: Study Reminders & Notifications */}
      <Text
        style={[
          txt(11, true, C.muted),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        Reminders & Notifications
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.line,
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        {/* Study Reminder Preferences */}
        <TouchableOpacity
          onPress={onOpenReminders}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.line
          }}
          accessibilityLabel="Study Reminder Preferences"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="alarm-outline" size={20} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Study Reminders</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              Customize study alarm schedules and active days
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>

        {/* In-App Notifications */}
        <TouchableOpacity
          onPress={onOpenNotifications}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
          }}
          accessibilityLabel="Notification Preferences"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Notification Center</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              Review study milestones and system alerts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      {/* SECTION C: Community & Help */}
      <Text
        style={[
          txt(11, true, C.muted),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        Community & Help
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.line,
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        {/* Share */}
        <TouchableOpacity
          onPress={handleShare}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.line
          }}
          accessibilityLabel="Share Abhyas Tracker"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="share-social-outline" size={20} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Share Abhyas Tracker</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              Recommend study tracker to fellow aspirants
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>

        {/* Support */}
        <TouchableOpacity
          onPress={handleSupport}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
          }}
          accessibilityLabel="Email Support"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="mail-outline" size={20} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Support & Helpdesk</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              {SUPPORT_EMAIL}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      {/* SECTION D: About & Legal */}
      <Text
        style={[
          txt(11, true, C.muted),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        About & Legal
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: C.line,
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        {/* Rate the App */}
        <TouchableOpacity
          onPress={handleRate}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: C.line
          }}
          accessibilityLabel="Rate the App"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="star-outline" size={20} color="#f59e0b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Rate Abhyas Tracker</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              Support our journey with your store review
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity
          onPress={handlePrivacy}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
          }}
          accessibilityLabel="Privacy Policy"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: C.soft,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, C.ink)}>Privacy Policy</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              How your study data and credentials are kept safe
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      {/* SECTION E: Account Management (Destructive Action) */}
      <Text
        style={[
          txt(11, true, '#ef4444'),
          { textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }
        ]}
      >
        Account Management
      </Text>

      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: isDarkMode ? '#7f1d1d' : '#fecaca',
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        <TouchableOpacity
          onPress={() => setDeleteModalVisible(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
          }}
          accessibilityLabel="Delete Account Permanently"
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: isDarkMode ? '#450a0a' : '#fee2e2',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#dc2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true, '#dc2626')}>Delete Account Permanently</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              Permanently remove your study profile and all recorded data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {/* Sign Out Action */}
      {onSignOut && (
        <TouchableOpacity
          onPress={onSignOut}
          style={{
            backgroundColor: isDarkMode ? '#1E3A2E' : '#ECFDF5',
            borderColor: C.line,
            borderWidth: 1,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 30
          }}
          accessibilityLabel="Sign Out"
        >
          <Text style={txt(14, true, C.blue)}>Sign Out of Abhyas</Text>
        </TouchableOpacity>
      )}

      {/* MODAL: Privacy Policy */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              backgroundColor: C.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              maxHeight: '80%'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <Text style={txt(18, true, C.ink)}>Privacy Policy</Text>
              <TouchableOpacity
                onPress={() => setPrivacyModalVisible(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={24} color={C.ink} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 12 }]}>
                Abhyas Tracker is designed to provide UPSC & MPSC aspirants with an isolated, focused study environment.
              </Text>

              <Text style={[txt(14, true, C.ink), { marginTop: 10, marginBottom: 4 }]}>
                1. Data Collection & Usage
              </Text>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 12 }]}>
                We collect your name and email address strictly for authentication. Study timer durations, subject progress, and revision targets are stored so you can monitor your academic preparation.
              </Text>

              <Text style={[txt(14, true, C.ink), { marginTop: 10, marginBottom: 4 }]}>
                2. No Third-Party Tracking
              </Text>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 12 }]}>
                Your competitive exam data belongs to you. We do not sell your personal data or provide tracking information to commercial advertisers.
              </Text>

              <Text style={[txt(14, true, C.ink), { marginTop: 10, marginBottom: 4 }]}>
                3. Secure Storage
              </Text>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 16 }]}>
                Session tokens and study metrics are stored securely. You can manage or delete your local sessions at any time.
              </Text>

              <TouchableOpacity
                onPress={() => setPrivacyModalVisible(false)}
                style={{
                  backgroundColor: C.blue,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                  marginTop: 10,
                  marginBottom: 20
                }}
              >
                <Text style={txt(14, true, '#ffffff')}>I Understand</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL: Delete Account Confirmation Dialog */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => !deleting && setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
          }}
        >
          <View
            style={{
              backgroundColor: C.white,
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 380,
              borderWidth: 1,
              borderColor: isDarkMode ? '#7f1d1d' : '#fecaca'
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDarkMode ? '#450a0a' : '#fee2e2',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16
              }}
            >
              <Ionicons name="warning-outline" size={26} color="#dc2626" />
            </View>

            <Text style={txt(19, true, '#dc2626')}>Delete Account Permanently?</Text>

            <Text
              style={[
                txt(13, false, C.muted),
                { marginTop: 10, lineHeight: 20, marginBottom: 22 }
              ]}
            >
              This action is permanent and cannot be undone. All your logged study hours, syllabus mastery, revision plans, and account data will be permanently removed.
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 12,
                  backgroundColor: C.soft,
                  alignItems: 'center'
                }}
              >
                <Text style={txt(13, true, C.ink)}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 12,
                  backgroundColor: '#dc2626',
                  alignItems: 'center',
                  opacity: deleting ? 0.6 : 1
                }}
              >
                <Text style={txt(13, true, '#ffffff')}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
