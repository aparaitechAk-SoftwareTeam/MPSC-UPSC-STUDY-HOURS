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
  req
}) {
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const C = theme || {
    bg: isDarkMode ? '#0f172a' : '#f7f9fe',
    white: isDarkMode ? '#1e293b' : '#ffffff',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    ink: isDarkMode ? '#f8fafc' : '#142841',
    muted: isDarkMode ? '#94a3b8' : '#72849f',
    blue: isDarkMode ? '#60a5fa' : '#37689f',
    soft: isDarkMode ? '#334155' : '#e9f0fc',
    line: isDarkMode ? '#334155' : '#e8eef8',
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
    <View style={{ flex: 1 }}>
      {/* Back to Dashboard Navigation */}
      {onBack && (
        <TouchableOpacity
          onPress={onBack}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
            paddingVertical: 4
          }}
          accessibilityLabel="Back to Dashboard"
        >
          <Ionicons name="arrow-back" size={18} color={C.blue} />
          <Text style={[txt(13, true, C.blue), { marginLeft: 6 }]}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      )}

      {/* Screen Header */}
      <View style={{ marginBottom: 18 }}>
        <Text style={txt(24, true)}>Settings</Text>
        <Text style={[txt(13, false, C.muted), { marginTop: 4 }]}>
          Preferences, theme, support, and account management
        </Text>
      </View>

      {/* Profile Overview Card */}
      <View
        style={{
          backgroundColor: C.white,
          borderRadius: 20,
          padding: 18,
          marginBottom: 16,
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
          <Text style={txt(20, true, C.blue)}>
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={txt(16, true)}>{user?.name || 'Aspirant'}</Text>
          <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
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
            <Text style={txt(10, true, C.blue)}>MPSC · UPSC Aspirant</Text>
          </View>
        </View>
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
              <Text style={txt(14, true)}>Dark Mode</Text>
              <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
                {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
              </Text>
            </View>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#d0daf0', true: C.blue }}
            thumbColor={isDarkMode ? '#ffffff' : '#f8fafc'}
          />
        </View>
      </View>

      {/* SECTION B: Share and Support */}
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
            <Text style={txt(14, true)}>Share Abhyas Tracker</Text>
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
            <Text style={txt(14, true)}>Support & Helpdesk</Text>
            <Text style={[txt(12, false, C.muted), { marginTop: 2 }]}>
              {SUPPORT_EMAIL}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </TouchableOpacity>
      </View>

      {/* SECTION C & D: Rating and Privacy */}
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
            <Text style={txt(14, true)}>Rate Abhyas Tracker</Text>
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
            <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={txt(14, true)}>Privacy Policy</Text>
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
            backgroundColor: C.soft,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 30
          }}
          accessibilityLabel="Sign Out"
        >
          <Text style={txt(13, true, C.blue)}>Sign Out of Abhyas</Text>
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
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
              <Text style={txt(18, true)}>Privacy Policy</Text>
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

              <Text style={[txt(14, true), { marginTop: 10, marginBottom: 4 }]}>
                1. Data Collection & Usage
              </Text>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 12 }]}>
                We collect your name and email address strictly for authentication. Study timer durations, subject progress, and revision targets are stored so you can monitor your academic preparation.
              </Text>

              <Text style={[txt(14, true), { marginTop: 10, marginBottom: 4 }]}>
                2. No Third-Party Tracking
              </Text>
              <Text style={[txt(13, false, C.muted), { lineHeight: 20, marginBottom: 12 }]}>
                Your competitive exam data belongs to you. We do not sell your personal data or provide tracking information to commercial advertisers.
              </Text>

              <Text style={[txt(14, true), { marginTop: 10, marginBottom: 4 }]}>
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
    </View>
  );
}
