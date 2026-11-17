import React, { useState, useEffect, useRef } from 'react';
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
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTranslation, getSubjectName } from './translations';

// Clean, professional, dignified Student Monogram Avatar (NO funky bitmoji)
const StudentAvatar = ({ name, size = 84, C, isDarkMode }) => {
  const cleanName = (name && typeof name === 'string') ? name.trim() : '';
  const initial = cleanName ? cleanName.charAt(0).toUpperCase() : '';
  const bgColor = isDarkMode ? '#1e3a5f' : '#e0f2fe';
  const textColor = C.blue || '#247C78';
  const borderColor = C.blue || '#247C78';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.5,
        borderColor: borderColor,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4
      }}
    >
      {initial ? (
        <Text style={{ fontSize: size * 0.44, fontWeight: '800', color: textColor, letterSpacing: -0.5 }}>
          {initial}
        </Text>
      ) : (
        <Ionicons name="person" size={size * 0.52} color={textColor} />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          backgroundColor: C.card,
          borderRadius: 12,
          padding: 3,
          borderWidth: 1.5,
          borderColor: borderColor
        }}
      >
        <Ionicons name="school" size={13} color={textColor} />
      </View>
    </View>
  );
};

const ProfileField = ({
  label,
  value,
  displayValue,
  onChangeText,
  icon,
  keyboardType,
  editing,
  error,
  styles,
  C,
  isDarkMode
}) => (
  <View style={styles.field}>
    <View style={styles.fieldIcon}>
      <Ionicons name={icon} size={20} color={error ? C.red : C.blue} />
    </View>

    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType || 'default'}
            style={[
              styles.input,
              { backgroundColor: isDarkMode ? '#16222f' : '#ffffff', borderColor: error ? C.red : C.blue }
            ]}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor={C.muted}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      ) : (
        <Text style={styles.fieldValue}>
          {displayValue || value || 'Not provided'}
        </Text>
      )}
    </View>
  </View>
);

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
    bg: theme?.bg || (isDarkMode ? '#111A22' : '#F4F7FA'),
    card: theme?.cardBg || (isDarkMode ? '#1D2A35' : '#FFFFFF'),
    ink: theme?.ink || (isDarkMode ? '#E8F0F3' : '#243746'),
    muted: theme?.muted || (isDarkMode ? '#A2B2BC' : '#718391'),
    blue: theme?.blue || (isDarkMode ? '#55B8A8' : '#247C78'),
    blueLight: theme?.blueLight || (isDarkMode ? '#293F48' : '#E3EDF0'),
    border: theme?.border || (isDarkMode ? '#354956' : '#E1E9ED'),
    green: theme?.green || '#269B78',
    amber: theme?.amber || '#D99536',
    amberSoft: theme?.amberSoft || '#FFF3DF',
    red: theme?.red || (isDarkMode ? '#F08A91' : '#D75B62'),
  };
  const styles = createStyles(C, isDarkMode);
  const scrollRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || user?.phone || '');
  const [exam, setExam] = useState(user?.examTarget || 'MPSC / UPSC');
  const [subjects, setSubjects] = useState(user?.preferredSubjects || 'Polity, History');
  const [showValidation, setShowValidation] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.mobile || user.phone) setMobile(user.mobile || user.phone);
      if (user.examTarget) setExam(user.examTarget);
      if (user.preferredSubjects) setSubjects(user.preferredSubjects);
    }
  }, [user]);

  const validateProfile = () => {
    const errors = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMobile = mobile.trim();
    const cleanExam = exam.trim();
    const cleanSubjects = subjects.trim();

    if (!cleanName) {
      errors.name = lang === 'mr' ? 'पूर्ण नाव आवश्यक आहे.' : 'Full name is required.';
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = lang === 'mr' ? 'वैध ईमेल पत्ता टाका.' : 'Please enter a valid email address.';
    }

    if (cleanMobile) {
      const digits = cleanMobile.replace(/\D/g, '');
      if (digits.length !== 10) {
        errors.mobile = lang === 'mr' ? '१० अंकी मोबाइल नंबर टाका.' : 'Enter a valid 10-digit mobile number.';
      }
    }

    if (!cleanExam) errors.exam = lang === 'mr' ? 'परीक्षा निवडणे आवश्यक आहे.' : 'Exam target is required.';
    if (!cleanSubjects) errors.subjects = lang === 'mr' ? 'विषय आवश्यक आहेत.' : 'Preferred subjects are required.';

    return errors;
  };

  const profileErrors = showValidation ? validateProfile() : {};

  const handleStartEdit = () => {
    setEditing(true);
    setSaveSuccessMsg('');
    // Auto-scroll to inputs so user immediately sees them
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 50);
  };

  const handleCancelEdit = () => {
    // Reset to current user values
    setName(user?.name || '');
    setEmail(user?.email || '');
    setMobile(user?.mobile || user?.phone || '');
    setExam(user?.examTarget || 'MPSC / UPSC');
    setSubjects(user?.preferredSubjects || 'Polity, History');
    setEditing(false);
    setShowValidation(false);
  };

  const saveProfile = async () => {
    setShowValidation(true);
    const errors = validateProfile();

    if (Object.keys(errors).length > 0) {
      const msg = Object.values(errors)[0] || 'Please correct the highlighted fields.';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(msg);
      } else {
        Alert.alert('Validation Error', msg);
      }
      return;
    }

    const updatedName = name.trim();
    const updatedEmail = email.trim();
    const updatedMobile = mobile.trim();
    const updatedExam = exam.trim();
    const updatedSubjects = subjects.trim();

    setSavingProfile(true);
    try {
      if (typeof onProfileUpdated === 'function') {
        await onProfileUpdated({
          name: updatedName,
          email: updatedEmail,
          phone: updatedMobile,
          mobile: updatedMobile,
          examTarget: updatedExam,
          preferredSubjects: updatedSubjects
        });
      }
      setEditing(false);
      setShowValidation(false);
      const successText = lang === 'mr' ? 'माहिती यशस्वीरित्या जतन केली!' : 'Profile details saved successfully!';
      setSaveSuccessMsg(successText);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e) {
      const errText = e.message || 'Unable to save profile changes.';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(errText);
      } else {
        Alert.alert('Update Failed', errText);
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // Format values for display with localized Marathi support
  const getLocalizedExam = (rawVal) => {
    if (lang === 'mr') {
      if (rawVal.includes('MPSC') && rawVal.includes('UPSC')) return 'एमपीएससी / यूपीएससी';
      if (rawVal.includes('MPSC')) return 'एमपीएससी (MPSC)';
      if (rawVal.includes('UPSC')) return 'यूपीएससी (UPSC)';
    }
    return rawVal;
  };

  const getLocalizedSubjects = (rawVal) => {
    return getSubjectName(rawVal, lang);
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

  // All 6 App Sections from the 3-lines menu drawer
  const navigationHubItems = [
    {
      id: 'Dashboard',
      title: t('dashboard', 'Dashboard'),
      desc: lang === 'mr' ? 'दैनिक अभ्यास विहंगावलोकन व प्रगती' : 'Daily study goals, overview & streak',
      icon: 'home-outline',
      color: '#3b82f6',
      bg: isDarkMode ? '#1e3a5f' : '#eff6ff'
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
      id: 'Syllabus',
      title: t('syllabus', 'Syllabus'),
      desc: lang === 'mr' ? 'युपीएससी व एमपीएससी सविस्तर अभ्यासक्रम' : 'Comprehensive curriculum & topic tracker',
      icon: 'book-outline',
      color: '#8b5cf6',
      bg: isDarkMode ? '#2d2159' : '#f5f3ff'
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
      badge: 'PREMIUM'
    },
    {
      id: 'Ticket Support',
      title: t('ticketSupport', 'Ticket Support'),
      desc: lang === 'mr' ? 'मार्गदर्शक मदत, शंका व तक्रार निवारण' : 'Mentor queries, feedback & helpdesk',
      icon: 'headset-outline',
      color: '#ec4899',
      bg: isDarkMode ? '#3f182c' : '#fdf2f8'
    },
    {
      id: 'NetworkSettings',
      title: lang === 'mr' ? 'सर्व्हर व नेटवर्क' : 'Server & Network',
      desc: lang === 'mr' ? 'वाय-फाय, हॉटस्पॉट व सर्व्हर आयपी सेटिंग्ज' : 'Configure Wi-Fi, hotspot & server IP',
      icon: 'wifi-outline',
      color: '#10b981',
      bg: isDarkMode ? '#14382c' : '#ecfdf5'
    }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={onBack}
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={C.ink} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{t('myProfile', 'My Profile')}</Text>

            {/* Prominent Edit / Save / Cancel Button in Top Header */}
            {editing ? (
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <TouchableOpacity
                  style={[styles.headerButton, { width: 'auto', paddingHorizontal: 10, borderColor: C.muted }]}
                  onPress={handleCancelEdit}
                  accessibilityLabel="Cancel editing"
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.muted }}>
                    {lang === 'mr' ? 'रद्द' : 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.headerButton, { width: 'auto', paddingHorizontal: 12, backgroundColor: C.green, borderColor: C.green }]}
                  onPress={saveProfile}
                  disabled={savingProfile}
                  accessibilityLabel="Save profile"
                >
                  <Ionicons name="checkmark-sharp" size={16} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#ffffff' }}>
                    {savingProfile ? '...' : (lang === 'mr' ? 'जतन करा' : 'Save')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.headerButton, { width: 'auto', paddingHorizontal: 12, flexDirection: 'row', gap: 5 }]}
                onPress={handleStartEdit}
                accessibilityLabel="Edit profile details"
              >
                <Ionicons name="create-outline" size={17} color={C.blue} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.blue }}>
                  {lang === 'mr' ? 'बदल करा' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Success Banner when saved */}
          {Boolean(saveSuccessMsg) && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                backgroundColor: isDarkMode ? '#133522' : '#dcfce7',
                borderWidth: 1,
                borderColor: C.green,
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginBottom: 14
              }}
            >
              <Ionicons name="checkmark-circle" size={20} color={C.green} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: isDarkMode ? '#86efac' : '#15803d' }}>
                {saveSuccessMsg}
              </Text>
            </View>
          )}

          {/* Editing Mode Banner */}
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
                marginBottom: 14
              }}
            >
              <Ionicons name="create" size={18} color={C.blue} />
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.blue, flex: 1 }}>
                {lang === 'mr'
                  ? 'माहिती संपादन मोड सक्रिय — खालील माहिती बदला आणि वर "जतन करा" दाबा.'
                  : 'Edit Mode Active — Update your details below and tap "Save".'}
              </Text>
            </View>
          )}

          {/* Professional Profile Hero Card (Clean & Dignified) */}
          <View style={styles.profileCard}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <StudentAvatar
                name={name || user?.name}
                size={86}
                C={C}
                isDarkMode={isDarkMode}
              />
            </View>

            {/* Name: Editable directly right here when in editing mode! */}
            {editing ? (
              <View style={{ width: '100%', alignItems: 'center', marginBottom: 8 }}>
                <TextInput
                  value={name}
                  onChangeText={(val) => { setName(val); if (!showValidation) setShowValidation(true); }}
                  style={[
                    styles.heroNameInput,
                    { backgroundColor: isDarkMode ? '#16222f' : '#ffffff', borderColor: C.blue }
                  ]}
                  placeholder={lang === 'mr' ? 'पूर्ण नाव टाका' : 'Enter your full name'}
                  placeholderTextColor={C.muted}
                  autoFocus={true}
                />
                <Text style={{ fontSize: 10.5, color: C.blue, fontWeight: '600', marginTop: 3 }}>
                  {lang === 'mr' ? 'विद्यार्थी नाव संपादन' : 'Student Full Name (Editable)'}
                </Text>
              </View>
            ) : (
              <Text style={styles.name}>{name || t('aspirant', 'Student Name')}</Text>
            )}

            <Text style={styles.subtitle}>
              {lang === 'mr' ? 'एमपीएससी व यूपीएससी विद्यार्थी' : 'UPSC & MPSC Civil Services Aspirant'}
            </Text>

            <View style={styles.accountBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.accountBadgeText}>{t('studentAccount', 'Student Account')}</Text>
            </View>
          </View>

          {/* 1. PERSONAL INFORMATION CARD (Placed right below hero card for immediate visibility) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 8, marginHorizontal: 4 }}>
            <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginHorizontal: 0 }]}>
              {t('personalInfo', 'Personal Information')}
            </Text>
            {!editing && (
              <TouchableOpacity
                onPress={handleStartEdit}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 6 }}
              >
                <Ionicons name="create-outline" size={14} color={C.blue} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.blue }}>
                  {lang === 'mr' ? 'बदल करा' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.detailsCard, editing && { borderWidth: 1.5, borderColor: C.blue }]}>
            <ProfileField
              label={t('fullName', 'Full Name')}
              value={name}
              onChangeText={(value) => { setName(value); if (!showValidation) setShowValidation(true); }}
              icon="person-outline"
              editing={editing}
              error={profileErrors.name}
              styles={styles}
              C={C}
              isDarkMode={isDarkMode}
            />
            <View style={styles.separator} />

            <ProfileField
              label={t('emailAddress', 'Email Address')}
              value={email}
              onChangeText={(value) => { setEmail(value); if (!showValidation) setShowValidation(true); }}
              icon="mail-outline"
              keyboardType="email-address"
              editing={editing}
              error={profileErrors.email}
              styles={styles}
              C={C}
              isDarkMode={isDarkMode}
            />
            <View style={styles.separator} />

            <ProfileField
              label={t('mobileNumber', 'Mobile Number')}
              value={mobile}
              onChangeText={(value) => { setMobile(value); if (!showValidation) setShowValidation(true); }}
              icon="call-outline"
              keyboardType="phone-pad"
              editing={editing}
              error={profileErrors.mobile}
              styles={styles}
              C={C}
              isDarkMode={isDarkMode}
            />
            <View style={styles.separator} />

            <ProfileField
              label={t('examTarget', 'Exam Target')}
              value={exam}
              displayValue={getLocalizedExam(exam)}
              onChangeText={(value) => { setExam(value); if (!showValidation) setShowValidation(true); }}
              icon="school-outline"
              editing={editing}
              error={profileErrors.exam}
              styles={styles}
              C={C}
              isDarkMode={isDarkMode}
            />
            <View style={styles.separator} />

            <ProfileField
              label={t('preferredSubjects', 'Preferred Subjects')}
              value={subjects}
              displayValue={getLocalizedSubjects(subjects)}
              onChangeText={(value) => { setSubjects(value); if (!showValidation) setShowValidation(true); }}
              icon="book-outline"
              editing={editing}
              error={profileErrors.subjects}
              styles={styles}
              C={C}
              isDarkMode={isDarkMode}
            />
          </View>

          {/* Prominent Save / Cancel Action Bar right under fields when editing */}
          {editing && (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={styles.cancelEditBtn}
                onPress={handleCancelEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelEditBtnText}>
                  {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveProfile}
                disabled={savingProfile}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.saveButtonText}>
                  {savingProfile
                    ? (lang === 'mr' ? 'जतन करत आहे...' : 'Saving...')
                    : (lang === 'mr' ? 'बदल जतन करा' : 'Save Changes')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 2. Study Overview Stats (Streak, Total Hours, Goal) */}
          <Text style={styles.sectionTitle}>
            {lang === 'mr' ? 'अभ्यास विहंगावलोकन' : 'Study Overview & Progress'}
          </Text>

          <View style={styles.statsRow}>
            {/* Study Streak */}
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: C.amberSoft }]}>
                <Ionicons name="flame-outline" size={22} color="#E58A38" />
              </View>
              <Text style={styles.statValue}>{studyStreak} {t('days', 'days')}</Text>
              <Text style={styles.statLabel}>{t('studyStreak', 'Study Streak')}</Text>
            </View>

            {/* Total Study Time */}
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: isDarkMode ? '#1e3850' : '#f0f9ff' }]}>
                <Ionicons name="time-outline" size={22} color="#0ea5e9" />
              </View>
              <Text style={styles.statValue}>{formatTotalTime(totalMinutes)}</Text>
              <Text style={styles.statLabel}>{lang === 'mr' ? 'एकूण अभ्यास वेळ' : 'Total Time'}</Text>
            </View>

            {/* Daily Goal */}
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="flag-outline" size={22} color={C.blue} />
              </View>
              <Text style={styles.statValue}>{studyGoal} {t('hours', 'hrs')}</Text>
              <Text style={styles.statLabel}>{t('dailyStudyGoal', 'Daily Goal')}</Text>
            </View>
          </View>

          {/* 3. ALL FEATURES FROM 3-LINES TAB: Full Navigation & Sections Hub */}
          <Text style={styles.sectionTitle}>
            {lang === 'mr' ? 'सर्व विभाग व नेव्हिगेशन' : 'All App Sections & Tools'}
          </Text>

          <View style={styles.detailsCard}>
            {navigationHubItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.preferenceRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    if (item.id === 'NetworkSettings') {
                      if (onOpenSettings) onOpenSettings();
                      else if (onBack) onBack();
                    } else if (typeof onNavigateTab === 'function') {
                      onNavigateTab(item.id);
                    } else if (item.id === 'Planner' && onOpenPlanner) {
                      onOpenPlanner();
                    } else if (item.id === 'Analytics' && onOpenAnalytics) {
                      onOpenAnalytics();
                    } else if (onBack) {
                      onBack();
                    }
                  }}
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

          {/* 4. Preferences: Notifications, Reminders, Settings & Theme */}
          <Text style={styles.sectionTitle}>{t('preferences', 'Preferences & Notifications')}</Text>

          <View style={styles.detailsCard}>
            {/* Notifications Row */}
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
                      top: 1,
                      right: 1,
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
              <Ionicons name="chevron-forward" size={19} color={C.muted} />
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Study Reminders & Alarms Row */}
            <TouchableOpacity
              style={styles.preferenceRow}
              activeOpacity={0.75}
              onPress={onOpenReminders}
              accessibilityRole="button"
              accessibilityLabel="Study Reminders"
            >
              <View style={styles.fieldIcon}>
                <Ionicons name="alarm-outline" size={21} color={C.blue} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldValue}>{t('studyReminders', 'Study Reminders & Alarms')}</Text>
                <Text style={styles.preferenceHint}>
                  {t('setDailyReminderDesc', 'Set your daily study reminders and alarms')}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={C.muted} />
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* Settings & Language Row */}
            <TouchableOpacity
              style={styles.preferenceRow}
              activeOpacity={0.75}
              onPress={onOpenSettings}
              accessibilityRole="button"
              accessibilityLabel="Settings"
            >
              <View style={styles.fieldIcon}>
                <Ionicons name="settings-outline" size={21} color={C.blue} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldValue}>{t('settings', 'Settings & Language')}</Text>
                <Text style={styles.preferenceHint}>
                  {lang === 'mr' ? 'अ‍ॅप भाषा (मराठी/English), सर्व्हर व डेटा' : 'Change language, dark theme & server'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={C.muted} />
            </TouchableOpacity>

            {/* Day / Night Mode Switch Row */}
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

          {/* 5. Account Actions: Sign Out */}
          <Text style={styles.sectionTitle}>{t('account', 'Account')}</Text>

          <View style={styles.detailsCard}>
            <TouchableOpacity
              style={styles.preferenceRow}
              activeOpacity={0.75}
              onPress={() => setSignOutConfirmOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Sign Out"
            >
              <View style={[styles.fieldIcon, { backgroundColor: isDarkMode ? '#3b1c1c' : '#fee2e2' }]}>
                <Ionicons name="log-out-outline" size={21} color={C.red} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={[styles.fieldValue, { color: C.red }]}>{t('signOut', 'Sign Out')}</Text>
                <Text style={styles.preferenceHint}>
                  {lang === 'mr' ? 'या डिव्हाइसवरून तुमचे सत्र सुरक्षितपणे संपवा' : 'Sign out securely from this device'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={19} color={C.red} />
            </TouchableOpacity>
          </View>

          {/* Version and Footer info */}
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
            <Text style={{ fontSize: 11.5, color: C.muted, fontWeight: '600' }}>
              Abhyas Tracker • v2.0
            </Text>
            <Text style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>
              UPSC & MPSC Preparation Companion
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sign Out Confirmation Modal */}
      <Modal
        visible={signOutConfirmOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSignOutConfirmOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalDialog}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={32} color={C.red} />
            </View>
            <Text style={styles.modalTitle}>
              {lang === 'mr' ? 'खाते लॉगआउट करायचे का?' : 'Sign Out Confirmation'}
            </Text>
            <Text style={styles.modalMsg}>
              {lang === 'mr'
                ? 'तुम्हाला खात्री आहे का की तुम्ही तुमच्या खात्यातून बाहेर पडू इच्छिता?'
                : 'Are you sure you want to sign out from your Abhyas account?'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setSignOutConfirmOpen(false)}
              >
                <Text style={styles.cancelBtnText}>{t('cancel', 'Cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmSignOutBtn}
                onPress={() => {
                  setSignOutConfirmOpen(false);
                  if (onSignOut) onSignOut();
                }}
              >
                <Text style={styles.confirmSignOutBtnText}>{t('signOut', 'Sign Out')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(C, isDarkMode) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: C.bg,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingVertical: 4,
    },
    headerButton: {
      height: 38,
      minWidth: 38,
      borderRadius: 12,
      backgroundColor: C.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: 8
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: C.ink,
    },
    profileCard: {
      backgroundColor: C.card,
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
      marginBottom: 16,
    },
    name: {
      fontSize: 19,
      fontWeight: '800',
      color: C.ink,
      marginBottom: 4,
      textAlign: 'center',
    },
    heroNameInput: {
      fontSize: 18,
      fontWeight: '800',
      color: C.ink,
      textAlign: 'center',
      borderWidth: 1.5,
      borderColor: C.blue,
      borderRadius: 10,
      paddingVertical: 6,
      paddingHorizontal: 16,
      width: '88%',
      maxWidth: 320,
    },
    subtitle: {
      fontSize: 12.5,
      color: C.muted,
      marginBottom: 10,
      textAlign: 'center',
    },
    accountBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: C.blueLight,
    },
    activeDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: C.green,
      marginRight: 6,
    },
    accountBadgeText: {
      fontSize: 11.5,
      fontWeight: '700',
      color: C.blue,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: C.ink,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginTop: 14,
      marginBottom: 8,
      marginHorizontal: 4,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 6,
    },
    statCard: {
      flex: 1,
      backgroundColor: C.card,
      borderRadius: 16,
      padding: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.blueLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    statValue: {
      fontSize: 13,
      fontWeight: '800',
      color: C.ink,
      marginBottom: 2,
      textAlign: 'center',
    },
    statLabel: {
      fontSize: 9.5,
      color: C.muted,
      textAlign: 'center',
      fontWeight: '600',
    },
    detailsCard: {
      backgroundColor: C.card,
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: C.border,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    fieldIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: C.blueLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
      position: 'relative',
    },
    fieldContent: {
      flex: 1,
      minWidth: 0,
    },
    fieldLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: C.muted,
      marginBottom: 2,
    },
    fieldValue: {
      fontSize: 14,
      fontWeight: '700',
      color: C.ink,
    },
    separator: {
      height: 1,
      backgroundColor: C.border,
    },
    preferenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    preferenceHint: {
      fontSize: 11,
      color: C.muted,
      marginTop: 2,
      lineHeight: 15,
    },
    input: {
      fontSize: 14.5,
      fontWeight: '600',
      color: C.ink,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: C.blue,
      marginTop: 4,
    },
    errorText: {
      fontSize: 11,
      color: C.red,
      marginTop: 3,
    },
    cancelEditBtn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.card,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 14,
      paddingVertical: 12,
    },
    cancelEditBtnText: {
      fontSize: 13.5,
      fontWeight: '700',
      color: C.ink,
    },
    saveButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: C.green,
      borderRadius: 14,
      paddingVertical: 12,
    },
    saveButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#ffffff',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalDialog: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: C.card,
      borderRadius: 20,
      padding: 22,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
    },
    modalIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#fee2e2',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: C.ink,
      marginBottom: 8,
      textAlign: 'center',
    },
    modalMsg: {
      fontSize: 13,
      color: C.muted,
      textAlign: 'center',
      lineHeight: 18,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 12,
      backgroundColor: C.bg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.border,
    },
    cancelBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: C.ink,
    },
    confirmSignOutBtn: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 12,
      backgroundColor: C.red,
      alignItems: 'center',
    },
    confirmSignOutBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#ffffff',
    },
  });
}
