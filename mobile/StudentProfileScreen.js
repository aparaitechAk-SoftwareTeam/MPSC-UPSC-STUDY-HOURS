import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTranslation } from './translations';

const GREEN = '#059669';
const GREEN_LIGHT = '#ECFDF5';
const INK_LIGHT = '#0F291E';
const MUTED_LIGHT = '#4B6357';
const BORDER_LIGHT = '#D1FAE5';

const ProfileField = ({
  label,
  value,
  onChangeText,
  icon,
  keyboardType,
  editing,
  error,
  C,
  styles: propStyles,
}) => {
  const s = propStyles || {};
  return (
    <View style={s.field || { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 }}>
      <View style={s.fieldIcon || { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={20} color={error ? '#DC2626' : (C?.blue || GREEN)} />
      </View>

      <View style={s.fieldContent || { flex: 1 }}>
        <Text style={s.fieldLabel || { fontSize: 11, marginBottom: 4, color: C?.muted || MUTED_LIGHT }}>{label}</Text>
        {editing ? (
          <>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType || 'default'}
              style={{
                fontSize: 13.5,
                fontWeight: '600',
                color: C?.ink || INK_LIGHT,
                backgroundColor: C?.soft || '#ECFDF5',
                borderWidth: 1.5,
                borderColor: error ? '#DC2626' : (C?.blue || GREEN),
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 7,
                marginTop: 2
              }}
              placeholder={`Enter ${(label || '').toLowerCase()}`}
              placeholderTextColor={C?.muted || MUTED_LIGHT}
            />
            {error ? <Text style={s.errorText || { color: '#DC2626', fontSize: 12, marginTop: 4 }}>{error}</Text> : null}
          </>
        ) : (
          <Text style={s.fieldValue || { fontSize: 13, fontWeight: '700', color: C?.ink || INK_LIGHT }}>
            {value || 'Not provided'}
          </Text>
        )}
      </View>
    </View>
  );
};
export default function StudentProfileScreen({
  user,
  onBack,
  onSignOut,
  onOpenSettings,
  onOpenReminders,
  onOpenNotifications,
  onOpenPlanner,
  onOpenAnalytics,
  onNavigateTab,
  unreadCount = 0,
  onProfileUpdated,
  studyGoal = 6,
  studyStreak = 0,
  totalMinutes = 0,
  lang = 'en',
  theme,
  isDarkMode = false,
  onToggleTheme
}) {
  const t = (k, fb = '') => getTranslation(lang, k, fb);
  const C = {
    bg: theme?.bg || (isDarkMode ? '#0A1612' : '#F6F9F6'),
    card: theme?.card || theme?.cardBg || (isDarkMode ? '#11221B' : '#FFFFFF'),
    cardBg: theme?.cardBg || theme?.card || (isDarkMode ? '#11221B' : '#FFFFFF'),
    ink: theme?.ink || (isDarkMode ? '#F0FDF4' : '#0F291E'),
    muted: theme?.muted || (isDarkMode ? '#86A394' : '#4B6357'),
    blue: theme?.blue || (isDarkMode ? '#10B981' : '#059669'),
    soft: theme?.soft || theme?.blueLight || (isDarkMode ? '#0F291E' : '#ECFDF5'),
    blueLight: theme?.blueLight || theme?.soft || (isDarkMode ? '#0F291E' : '#ECFDF5'),
    line: theme?.line || theme?.border || (isDarkMode ? '#17382A' : '#D1FAE5'),
    border: theme?.border || theme?.line || (isDarkMode ? '#17382A' : '#D1FAE5'),
    green: theme?.green || '#10B981',
    amber: theme?.amber || '#D99536',
    amberSoft: theme?.amberSoft || '#FFF3DF',
    red: theme?.red || '#DC2626',
  };
  const INK = C.ink;
  const BLUE = C.blue;
  const MUTED = C.muted;
  const BG = C.bg;
  const BORDER = C.line;
  const styles = React.useMemo(() => getStyles(C, isDarkMode), [C, isDarkMode]);
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(
    user?.mobile || user?.phone || ''
  );
  const [exam, setExam] = useState(user?.examTarget || 'MPSC / UPSC');
  const [subjects, setSubjects] = useState(
    user?.preferredSubjects || 'Polity, History'
  );
  const [showValidation, setShowValidation] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  // Synchronize state when user prop updates
  useEffect(() => {
    if (user && !editing) {
      setName(user.name || '');
      setEmail(user.email || '');
      setMobile(user.mobile || user.phone || '');
      setExam(user.examTarget || 'MPSC / UPSC');
      setSubjects(user.preferredSubjects || 'Polity, History');
    }
  }, [user, editing]);

  const validateProfile = () => {
    const errors = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    const cleanExam = exam.trim();
    const cleanSubjects = subjects.trim();

    if (!cleanName) {
      errors.name = 'Full name is required.';
    } else if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(cleanName)) {
      errors.name = 'Use letters, spaces, apostrophes, periods, or hyphens.';
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (cleanMobile) {
      const digits = cleanMobile.replace(/\D/g, '');
      if (!/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(cleanMobile) || digits.length !== 10) {
        errors.mobile = 'Enter a valid 10-digit Indian mobile number.';
      }
    }

    if (!cleanExam) errors.exam = 'Exam target is required.';
    if (!cleanSubjects) errors.subjects = 'Preferred subjects are required.';

    return errors;
  };

  const profileErrors = showValidation ? validateProfile() : {};


  const saveProfile = async () => {
    setShowValidation(true);
    const errors = validateProfile();

    if (Object.keys(errors).length > 0) {
      Alert.alert('Please check your details', 'Correct the highlighted fields before saving.');
      return;
    }
    const updatedName = name.trim();
    const updatedEmail = email.trim();
    const updatedMobile = mobile.trim();
    const updatedExam = exam.trim();
    const updatedSubjects = subjects.trim();

    if (!updatedName) {
      Alert.alert('Required field', 'Please enter your full name.');
      return;
    }

    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(updatedName)) {
      Alert.alert(
        'Invalid name',
        'Use letters, spaces, apostrophes, periods, or hyphens in your name.'
      );
      return;
    }

    if (
      updatedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)
    ) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }

    if (updatedMobile) {
      const digits = updatedMobile.replace(/\D/g, '');
      const validIndianMobile =
        /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(updatedMobile);

      if (!validIndianMobile || digits.length !== 10) {
        Alert.alert(
          'Invalid mobile number',
          'Enter a valid 10-digit Indian mobile number, optionally starting with +91.'
        );
        return;
      }
    }

    if (!updatedExam) {
      Alert.alert('Required field', 'Please enter your exam target.');
      return;
    }

    if (!updatedSubjects) {
      Alert.alert('Required field', 'Please enter your preferred subjects.');
      return;
    }

    const updatedUser = {
      ...user,
      name: updatedName,
      email: updatedEmail,
      mobile: updatedMobile,
      phone: updatedMobile,
      examTarget: updatedExam,
      preferredSubjects: updatedSubjects,
    };

    setSavingProfile(true);

    try {
      if (typeof onProfileUpdated !== 'function') {
        throw new Error('Profile saving is unavailable. Please try again.');
      }

      const savedUser = await onProfileUpdated(updatedUser);
      const confirmedUser = savedUser || updatedUser;

      setName(confirmedUser.name || updatedName);
      setEmail(confirmedUser.email || updatedEmail);
      setMobile(confirmedUser.phone || confirmedUser.mobile || updatedMobile);
      setExam(confirmedUser.examTarget || updatedExam);
      setSubjects(confirmedUser.preferredSubjects || updatedSubjects);

      setEditing(false);

      Alert.alert(
        'Profile updated',
        'Your profile has been saved to your account.'
      );
    } catch (error) {
      Alert.alert(
        'Unable to save profile',
        error?.message || 'Your changes could not be saved. Please try again.'
      );
    } finally {
      setSavingProfile(false);
    }
  };
    const confirmSignOut = () => {
  setSignOutConfirmOpen(true);
};

  const formatTotalTime = (mins) => {
    const totalMins = Number(mins) || 0;
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (lang === 'mr') {
      return h > 0 ? `${h} तास ${m} मि.` : `${m} मिनिटे`;
    }
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const handleItemPress = (itemId) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(itemId);
    } else if (itemId === 'Planner' && onOpenPlanner) {
      onOpenPlanner();
    } else if (itemId === 'Analytics' && onOpenAnalytics) {
      onOpenAnalytics();
    } else if (onBack) {
      onBack();
    }
  };

  const navigationHubItems = [
    {
      id: 'Dashboard',
      title: t('dashboard', 'Dashboard'),
      desc: lang === 'mr' ? 'दैनिक अभ्यास विहंगावलोकन, ध्येय व सातत्य' : 'Daily study goals, overview & streak',
      icon: 'home-outline',
      color: '#3b82f6',
      bg: isDarkMode ? '#1e3a5f' : '#eff6ff'
    },
    {
      id: 'Syllabus',
      title: t('syllabus', 'Syllabus Tracker'),
      desc: lang === 'mr' ? 'यूपीएससी व एमपीएससी सविस्तर अभ्यासक्रम ट्रॅकर' : 'UPSC & MPSC curriculum & topic mastery',
      icon: 'book-outline',
      color: '#8b5cf6',
      bg: isDarkMode ? '#2d2159' : '#f5f3ff'
    },
    {
      id: 'Timer',
      title: t('timer', 'Focus Timer'),
      desc: lang === 'mr' ? 'पोमोडोरो, स्टॉपवॉच व सखोल अभ्यास सत्र' : 'Pomodoro, deep work & study clock',
      icon: 'stopwatch-outline',
      color: '#0ea5e9',
      bg: isDarkMode ? '#1e3850' : '#f0f9ff'
    },
    {
      id: 'Planner',
      title: t('planner', 'Study Planner'),
      desc: lang === 'mr' ? 'आजचे, उद्याचे व साप्ताहिक अभ्यास नियोजन' : 'Today, tomorrow & weekly study schedules',
      icon: 'calendar-outline',
      color: '#10b981',
      bg: isDarkMode ? '#153e30' : '#ecfdf5'
    },
    {
      id: 'Analytics',
      title: t('analytics', 'Study Analytics'),
      desc: lang === 'mr' ? 'अभ्यास तास, सातत्य व विषयवार अहवाल' : 'Study hours, focus score & subject analysis',
      icon: 'analytics-outline',
      color: '#f59e0b',
      bg: isDarkMode ? '#3b2f15' : '#fffbeb'
    },
    {
      id: 'Premium',
      title: t('upgradeToPremium', 'Abhyas Premium'),
      desc: lang === 'mr' ? 'अमर्याद अभ्यास इतिहास, प्रगत विश्लेषण व AI मेंटर' : 'Unlimited study history, advanced analytics & AI mentor',
      icon: 'ribbon-outline',
      color: '#1d4ed8',
      bg: isDarkMode ? '#1e3a5f' : '#eff6ff',
      badge: 'PRO'
    },
    {
      id: 'Ticket Support',
      title: t('ticketSupport', 'Ticket Support'),
      desc: lang === 'mr' ? 'मार्गदर्शक मदत, शंका व तक्रार निवारण' : 'Mentor queries, feedback & helpdesk',
      icon: 'headset-outline',
      color: '#ec4899',
      bg: isDarkMode ? '#3f182c' : '#fdf2f8'
    }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onBack}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={23} color={C.ink} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.headerTitle}>{t('myProfile', 'My Profile')}</Text>
            {!editing ? (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: C.soft,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: C.blue
                }}
                accessibilityLabel="Edit Profile"
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color={C.blue} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.blue }}>
                  {lang === 'mr' ? 'बदल करा' : 'Edit'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                  setMobile(user?.mobile || user?.phone || '');
                  setExam(user?.examTarget || 'MPSC / UPSC');
                  setSubjects(user?.preferredSubjects || 'Polity, History');
                  setEditing(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: isDarkMode ? '#3b181e' : '#fef2f2',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: '#fca5a5'
                }}
                accessibilityLabel="Cancel editing"
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={16} color="#ef4444" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#ef4444' }}>
                  {lang === 'mr' ? 'रद्द' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Right Header Action: Save button when editing, removed unused profile icon completely */}
          {editing ? (
            <TouchableOpacity
              onPress={saveProfile}
              disabled={savingProfile}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: C.blue,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12
              }}
              accessibilityLabel="Save profile"
              activeOpacity={0.75}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              <Text style={{ fontSize: 12.5, fontWeight: '800', color: '#FFFFFF' }}>
                {savingProfile ? '...' : (lang === 'mr' ? 'जतन करा' : 'Save')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 43 }} />
          )}
        </View>

        {/* Edit mode active banner */}
        {editing && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: isDarkMode ? '#1e3a5f' : '#eff6ff',
              borderWidth: 1.5,
              borderColor: C.blue,
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              marginBottom: 16
            }}
          >
            <Ionicons name="create" size={18} color={C.blue} />
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.blue, flex: 1 }}>
              {lang === 'mr'
                ? 'माहिती संपादन मोड सक्रिय — खालील माहिती बदला आणि वर "जतन करा" दाबा.'
                : 'Edit mode active — Update your details below and tap "Save".'}
            </Text>
          </View>
        )}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={39} color={C.blue} />
          </View>

          {editing ? (
            <View style={{ width: '100%', alignItems: 'center', marginVertical: 4 }}>
              <TextInput
                value={name}
                onChangeText={(val) => { setName(val); if (!showValidation) setShowValidation(true); }}
                style={{
                  fontSize: 18,
                  fontWeight: '800',
                  color: C.ink,
                  textAlign: 'center',
                  backgroundColor: C.soft,
                  borderWidth: 1.5,
                  borderColor: C.blue,
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  minWidth: 200,
                  maxWidth: '90%'
                }}
                placeholder={lang === 'mr' ? 'पूर्ण नाव टाका' : 'Enter your name'}
                placeholderTextColor={C.muted}
              />
            </View>
          ) : (
            <Text style={styles.name}>{name || t('aspirant', 'Student Name')}</Text>
          )}
          <Text style={styles.subtitle}>{t('aspirantSubtitle', 'MPSC / UPSC Aspirant')}</Text>

          <View style={styles.accountBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.accountBadgeText}>{t('studentAccount', 'Student Account')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('studyOverview', 'Study Overview')}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flag-outline" size={22} color={C.blue} />
            </View>
            <Text style={styles.statValue}>{studyGoal} {t('hours', 'hrs')}</Text>
            <Text style={styles.statLabel}>{t('dailyStudyGoal', 'Daily Goal')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: C.amberSoft }]}>
              <Ionicons name="flame-outline" size={22} color="#E58A38" />
            </View>
            <Text style={styles.statValue}>{studyStreak} {t('days', 'days')}</Text>
            <Text style={styles.statLabel}>{t('studyStreak', 'Study Streak')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: isDarkMode ? '#1e3850' : '#f0f9ff' }]}>
              <Ionicons name="time-outline" size={22} color="#0ea5e9" />
            </View>
            <Text style={styles.statValue}>{formatTotalTime(totalMinutes)}</Text>
            <Text style={styles.statLabel}>{lang === 'mr' ? 'एकूण वेळ' : 'Total Time'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('personalInfo', 'Personal Information')}</Text>

        <View style={styles.detailsCard}>
          <ProfileField
            C={C}
            styles={styles}
            label={t('fullName', 'Full Name')}
            value={name}
            onChangeText={(value) => { setName(value); if (!showValidation) setShowValidation(true); }}
            icon="person-outline"
            editing={editing}
            error={profileErrors.name}
          />
          <View style={styles.separator} />

          <ProfileField
            C={C}
            styles={styles}
            label={t('emailAddress', 'Email Address')}
            value={email}
            onChangeText={(value) => { setEmail(value); if (!showValidation) setShowValidation(true); }}
            icon="mail-outline"
            keyboardType="email-address"
            editing={editing}
            error={profileErrors.email}
          />
          <View style={styles.separator} />

          <ProfileField
            C={C}
            styles={styles}
            label={t('mobileNumber', 'Mobile Number')}
            value={mobile}
            onChangeText={(value) => { setMobile(value); if (!showValidation) setShowValidation(true); }}
            icon="call-outline"
            keyboardType="phone-pad"
            editing={editing}
            error={profileErrors.mobile}
          />
          <View style={styles.separator} />

          <ProfileField
            C={C}
            styles={styles}
            label={t('examTarget', 'Exam Target')}
            value={exam}
            onChangeText={(value) => { setExam(value); if (!showValidation) setShowValidation(true); }}
            icon="school-outline"
            editing={editing}
            error={profileErrors.exam}
          />
          <View style={styles.separator} />

          <ProfileField
            C={C}
            styles={styles}
            label={t('preferredSubjects', 'Preferred Subjects')}
            value={subjects}
            onChangeText={(value) => { setSubjects(value); if (!showValidation) setShowValidation(true); }}
            icon="book-outline"
            editing={editing}
            error={profileErrors.subjects}
          />
        </View>

        {/* All App Sections & Tools (Dashboard, Syllabus Tracker, Focus Timer, Study Planner, Study Analytics, Premium, Ticket Support) */}
        <Text style={styles.sectionTitle}>
          {lang === 'mr' ? 'सर्व विभाग व अभ्यासक्रम' : 'All App Sections & Tools'}
        </Text>

        <View style={styles.detailsCard}>
          {navigationHubItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.preferenceRow}
                activeOpacity={0.75}
                onPress={() => handleItemPress(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={[styles.fieldIcon, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={21} color={item.color} />
                </View>
                <View style={styles.fieldContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.fieldValue}>{item.title}</Text>
                    {Boolean(item.badge) && (
                      <View style={{ backgroundColor: '#fee2e2', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 }}>
                        <Text style={{ color: '#dc2626', fontSize: 10, fontWeight: '800' }}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.preferenceHint}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={19} color={C.muted} />
              </TouchableOpacity>
              {index < navigationHubItems.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('preferences', 'Preferences')}</Text>

        <View style={styles.detailsCard}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.preferenceRow}
            activeOpacity={0.75}
            onPress={onOpenNotifications}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <View style={styles.fieldIcon}>
              <Ionicons name="notifications-outline" size={21} color={C.blue} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#ef4444'
                  }}
                />
              )}
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>
                {t('notificationsTitle', 'Notifications')}
                {unreadCount > 0 ? ` (${unreadCount})` : ''}
              </Text>
              <Text style={styles.preferenceHint}>
                {unreadCount > 0
                  ? `${unreadCount} ${t('unreadAlerts', 'new notifications')}`
                  : t('viewNotifications', 'View all announcements and alerts')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* Study Reminders */}
          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.75} onPress={onOpenReminders} accessibilityRole="button" accessibilityLabel="Study Reminders">
            <View style={styles.fieldIcon}>
              <Ionicons name="alarm-outline" size={21} color={C.blue} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>{t('studyReminders', 'Study Reminders')}</Text>
              <Text style={styles.preferenceHint}>
                {t('setDailyReminderDesc', 'Set your daily study reminder')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          <View style={styles.separator} />

          {/* Privacy & Account / Settings */}
          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.75} onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Privacy and Account">
            <View style={styles.fieldIcon}>
              <Ionicons name="shield-checkmark-outline" size={21} color={C.blue} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>{t('privacyAndAccount', 'Privacy & Account')}</Text>
              <Text style={styles.preferenceHint}>
                {t('manageAccountSettings', 'Manage your account settings')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.muted} />
          </TouchableOpacity>

          {/* Dark / Light Mode Switch */}
          {typeof onToggleTheme === 'function' && (
            <>
              <View style={styles.separator} />
              <TouchableOpacity
                style={styles.preferenceRow}
                activeOpacity={0.75}
                onPress={onToggleTheme}
                accessibilityRole="button"
                accessibilityLabel="Toggle Dark Mode"
              >
                <View style={[styles.fieldIcon, { backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }]}>
                  <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={21} color={C.blue} />
                </View>
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldValue}>
                    {isDarkMode ? (lang === 'mr' ? 'दिवस मोड (Light Theme)' : 'Day Mode (Light)') : (lang === 'mr' ? 'रात्र मोड (Dark Theme)' : 'Night Mode (Dark)')}
                  </Text>
                  <Text style={styles.preferenceHint}>
                    {isDarkMode ? (lang === 'mr' ? 'प्रकाशित थीमवर बदला' : 'Switch to light mode') : (lang === 'mr' ? 'डोळ्यांना आराम देणारी गडद थीम' : 'Switch to comfortable dark mode')}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.ink }}>
                    {isDarkMode ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        {editing && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setName(user?.name || '');
                setEmail(user?.email || '');
                setMobile(user?.mobile || user?.phone || '');
                setExam(user?.examTarget || 'MPSC / UPSC');
                setSubjects(user?.preferredSubjects || 'Polity, History');
                setEditing(false);
              }}
            >
              <Text style={styles.cancelText}>{t('cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, savingProfile && { opacity: 0.6 }]}
              onPress={saveProfile}
              disabled={savingProfile}
            >
              <Ionicons
                name={savingProfile ? "hourglass-outline" : "checkmark"}
                size={19}
                color="#FFFFFF"
              />
              <Text style={styles.saveText}>
                {savingProfile ? t('savingChanges', 'Saving...') : t('saveChanges', 'Save Changes')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={confirmSignOut}
        >
          <Ionicons name="log-out-outline" size={21} color="#D43B46" />
          <Text style={styles.signOutText}>{t('signOut', 'Sign Out')}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>{t('yourPrepYourProgress', 'Your preparation, your progress.')}</Text>
      </ScrollView>
      {signOutConfirmOpen && (
  <View style={styles.signOutOverlay}>
    <View style={styles.signOutDialog}>
      <Text style={styles.signOutTitle}>{t('signOutPrompt', 'Sign Out?')}</Text>

      <Text style={styles.signOutMessage}>
        {t('signOutConfirmDesc', 'Are you sure you want to sign out of Abhyas?')}
      </Text>

      <View style={styles.signOutActions}>
        <TouchableOpacity
          onPress={() => setSignOutConfirmOpen(false)}
          style={styles.cancelSignOutButton}
        >
          <Text style={{ color: C.ink, fontWeight: '700' }}>{t('stayFocused', 'Stay Focused')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSignOutConfirmOpen(false);
            onSignOut?.();
          }}
          style={styles.confirmSignOutButton}
        >
          <Text style={{ color: '#FFFFFF' }}>{t('yesSignOut', 'Yes, Sign Out')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}
    </SafeAreaView>
  );
}

const getStyles = (C, isDarkMode) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: C.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.line,
  },
  headerTitle: {
    color: C.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: C.cardBg,
    borderRadius: 23,
    padding: 23,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.line,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    color: C.ink,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: C.muted,
    fontSize: 13,
    marginTop: 5,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.soft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 13,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 7,
  },
  accountBadgeText: {
    color: C.blue,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    color: C.ink,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.cardBg,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: C.line,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: C.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: C.muted,
    fontSize: 11,
    marginTop: 5,
  },
  detailsCard: {
    backgroundColor: C.cardBg,
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.line,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: C.muted,
    fontSize: 11,
    marginBottom: 4,
  },
  fieldValue: {
    color: C.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    color: C.ink,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: C.line,
  },
  separator: {
    height: 1,
    backgroundColor: C.line,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  preferenceHint: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  cancelButton: {
    flex: 1,
    minHeight: 49,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: C.ink,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    minHeight: 49,
    borderRadius: 15,
    backgroundColor: C.blue,
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  editButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: C.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  signOutButton: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: isDarkMode ? '#1f1315' : '#fff5f5',
    borderWidth: 1,
    borderColor: isDarkMode ? '#4c1d24' : '#F2CACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    color: '#D43B46',
    fontSize: 14,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 11,
    marginTop: 18,
  },
  inputError: {
    borderColor: '#DC2626',
    borderWidth: 1,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  signOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 1000,
    elevation: 20,
  },
  signOutDialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: C.cardBg,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: C.line,
  },
  signOutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.ink,
  },
  signOutMessage: {
    marginTop: 10,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 21,
    color: C.muted,
  },
  signOutActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelSignOutButton: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    backgroundColor: C.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSignOutButton: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
});












