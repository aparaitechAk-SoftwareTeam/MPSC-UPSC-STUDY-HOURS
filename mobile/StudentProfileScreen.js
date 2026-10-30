
import React, { useState } from 'react';
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


const BLUE = '#3478F6';
const BG = '#F3F7FF';
const INK = '#172B4D';
const MUTED = '#738199';
const BORDER = '#E5EAF3';

const ProfileField = ({
  label,
  value,
  onChangeText,
  icon,
  keyboardType,
  editing,
  error,
}) => (
  <View style={styles.field}>
    <View style={styles.fieldIcon}>
      <Ionicons name={icon} size={20} color={error ? '#DC2626' : BLUE} />
    </View>

    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {editing ? (
        <>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType || 'default'}
            style={[styles.input, error ? styles.inputError : null]}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="#A0AABC"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      ) : (
        <Text style={styles.fieldValue}>
          {value || 'Not provided'}
        </Text>
      )}
    </View>
  </View>
);
export default function StudentProfileScreen({
  user,
  onBack,
  onSignOut,
  onOpenSettings, onOpenReminders, onProfileUpdated,
  studyGoal = 6,
  studyStreak = 0,
}) {
  const [editing, setEditing] = useState(false);
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


  const saveProfile = () => {
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

    setName(updatedName);
    setEmail(updatedEmail);
    setMobile(updatedMobile);
    setExam(updatedExam);
    setSubjects(updatedSubjects);

    onProfileUpdated?.(updatedUser);
    setEditing(false);

    Alert.alert(
      'Profile updated',
      'Your changes have been saved for this app session.'
    );
  };
    const confirmSignOut = () => {
  setSignOutConfirmOpen(true);
};

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
            <Ionicons name="arrow-back" size={23} color={INK} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerButton}>
            <Ionicons name="person-circle-outline" size={25} color={BLUE} />
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={39} color={BLUE} />
          </View>

          <Text style={styles.name}>{name || 'Student Name'}</Text>
          <Text style={styles.subtitle}>MPSC / UPSC Aspirant</Text>

          <View style={styles.accountBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.accountBadgeText}>Student Account</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Study Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="flag-outline" size={22} color={BLUE} />
            </View>
            <Text style={styles.statValue}>{studyGoal} hrs</Text>
            <Text style={styles.statLabel}>Daily Study Goal</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF0E2' }]}>
              <Ionicons name="flame-outline" size={22} color="#E58A38" />
            </View>
            <Text style={styles.statValue}>{studyStreak} days</Text>
            <Text style={styles.statLabel}>Study Streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.detailsCard}>
          <ProfileField
            label="Full Name"
            value={name}
            onChangeText={(value) => { setName(value); if (!showValidation) setShowValidation(true); }}
            icon="person-outline"
           editing={editing}
            error={profileErrors.name} />
          <View style={styles.separator} />

          <ProfileField
            label="Email Address"
            value={email}
            onChangeText={(value) => { setEmail(value); if (!showValidation) setShowValidation(true); }}
            icon="mail-outline"
            keyboardType="email-address"
           editing={editing}
            error={profileErrors.email} />
          <View style={styles.separator} />

          <ProfileField
            label="Mobile Number"
            value={mobile}
            onChangeText={(value) => { setMobile(value); if (!showValidation) setShowValidation(true); }}
            icon="call-outline"
            keyboardType="phone-pad"
           editing={editing}
            error={profileErrors.mobile} />
          <View style={styles.separator} />

          <ProfileField
            label="Exam Target"
            value={exam}
            onChangeText={(value) => { setExam(value); if (!showValidation) setShowValidation(true); }}
            icon="school-outline"
           editing={editing}
            error={profileErrors.exam} />
          <View style={styles.separator} />

          <ProfileField
            label="Preferred Subjects"
            value={subjects}
            onChangeText={(value) => { setSubjects(value); if (!showValidation) setShowValidation(true); }}
            icon="book-outline"
           editing={editing}
            error={profileErrors.subjects} />
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.detailsCard}>
          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.75} onPress={onOpenReminders} accessibilityRole="button" accessibilityLabel="Study Reminders"><View style={styles.fieldIcon}><Ionicons name="notifications-outline" size={21} color={BLUE} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>Study Reminders</Text>
              <Text style={styles.preferenceHint}>
                Set your daily study reminder
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={MUTED} />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.preferenceRow} activeOpacity={0.75} onPress={onOpenSettings} accessibilityRole="button" accessibilityLabel="Privacy and Account"><View style={styles.fieldIcon}><Ionicons name="shield-checkmark-outline" size={21} color={BLUE} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldValue}>Privacy & Account</Text>
              <Text style={styles.preferenceHint}>
                Manage your account settings
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={MUTED} />
          </TouchableOpacity>
        </View>

        {editing ? (
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
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Ionicons name="checkmark" size={19} color="#FFFFFF" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={confirmSignOut}
        >
          <Ionicons name="log-out-outline" size={21} color="#D43B46" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Your preparation, your progress.</Text>
      </ScrollView>
      {signOutConfirmOpen && (
  <View style={styles.signOutOverlay}>
    <View style={styles.signOutDialog}>
      <Text style={styles.signOutTitle}>Sign Out?</Text>

      <Text style={styles.signOutMessage}>
        Are you sure you want to sign out of Abhyas?
      </Text>

      <View style={styles.signOutActions}>
        <TouchableOpacity
          onPress={() => setSignOutConfirmOpen(false)}
          style={styles.cancelSignOutButton}
        >
          <Text>Stay Focused</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSignOutConfirmOpen(false);
            onSignOut?.();
          }}
          style={styles.confirmSignOutButton}
        >
          <Text style={{ color: '#FFFFFF' }}>Yes, Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 23,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DCEAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    color: INK,
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: MUTED,
    fontSize: 13,
    marginTop: 5,
  },
  accountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF3FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 13,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#20A56B',
    marginRight: 7,
  },
  accountBadgeText: {
    color: BLUE,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    color: INK,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#E8F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    color: INK,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: MUTED,
    fontSize: 11,
    marginTop: 5,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    marginBottom: 24,
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
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: MUTED,
    fontSize: 11,
    marginBottom: 4,
  },
  fieldValue: {
    color: INK,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    color: INK,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDF1F7',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  preferenceHint: {
    color: MUTED,
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
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: INK,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    minHeight: 49,
    borderRadius: 15,
    backgroundColor: BLUE,
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
    backgroundColor: BLUE,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2CACA',
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
    color: MUTED,
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
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  zIndex: 1000,
  elevation: 20,
},

signOutDialog: {
  width: '100%',
  maxWidth: 380,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 24,
},

signOutTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#172033',
},

signOutMessage: {
  marginTop: 10,
  marginBottom: 24,
  fontSize: 14,
  lineHeight: 21,
  color: '#64748B',
},

signOutActions: {
  flexDirection: 'row',
  gap: 12,
},

cancelSignOutButton: {
  flex: 1,
  padding: 13,
  borderRadius: 10,
  backgroundColor: '#E9F0FC',
  alignItems: 'center',
  justifyContent: 'center',
},

confirmSignOutButton: {
  flex: 1,
  padding: 13,
  borderRadius: 10,
  backgroundColor: '#2563EB',
  alignItems: 'center',
  justifyContent: 'center',
},
});









