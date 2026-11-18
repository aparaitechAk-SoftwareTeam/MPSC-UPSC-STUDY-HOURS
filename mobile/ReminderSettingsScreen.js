import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getTranslation } from './translations';

const STORAGE_KEY = 'abhyas_study_reminder_preferences';
const TIMES = ['06:00 AM', '07:00 AM', '08:00 AM', '06:00 PM', '07:00 PM', '08:00 PM'];

export default function ReminderSettingsScreen({
  onBack,
  lang = 'en',
  theme,
  isDarkMode = false,
}) {
  const t = (k, fb = '') => getTranslation(lang, k, fb);
  const [enabled, setEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('07:00 AM');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPreferences() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          const parsed = JSON.parse(saved);
          setEnabled(Boolean(parsed.enabled));
          if (TIMES.includes(parsed.selectedTime)) {
            setSelectedTime(parsed.selectedTime);
          }
        }
      } catch {
        Alert.alert('Reminder settings', 'Could not load saved reminder preferences.');
      } finally {
        if (active) setLoaded(true);
      }
    }

    loadPreferences();
    return () => { active = false; };
  }, []);

  const savePreferences = async (nextEnabled, nextTime) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ enabled: nextEnabled, selectedTime: nextTime })
      );
      setEnabled(nextEnabled);
      setSelectedTime(nextTime);
    } catch {
      Alert.alert('Save failed', 'Your reminder preferences could not be saved.');
    }
  };

  // Emerald / Green theme tokens aligned with application branding
  const C = theme || {
    bg: isDarkMode ? '#0A1612' : '#F6F9F6',
    cardBg: isDarkMode ? '#11221B' : '#FFFFFF',
    ink: isDarkMode ? '#F0FDF4' : '#0F291E',
    muted: isDarkMode ? '#86A394' : '#4B6357',
    blue: isDarkMode ? '#10B981' : '#059669', // Emerald primary
    soft: isDarkMode ? '#0F291E' : '#ECFDF5', // Soft green tint
    line: isDarkMode ? '#17382A' : '#D1FAE5', // Border line
  };

  const primaryColor = C.primary || C.blue || (isDarkMode ? '#10B981' : '#059669');
  const primaryLightColor = C.primaryLight || C.soft || (isDarkMode ? '#0F291E' : '#ECFDF5');
  const borderColor = C.border || C.line || (isDarkMode ? '#17382A' : '#D1FAE5');
  const cardColor = C.card || C.cardBg || (isDarkMode ? '#11221B' : '#FFFFFF');
  const textColor = C.text || C.ink || (isDarkMode ? '#F0FDF4' : '#0F291E');
  const mutedColor = C.muted || (isDarkMode ? '#86A394' : '#4B6357');
  const bgColor = C.background || C.bg || (isDarkMode ? '#0A1612' : '#F6F9F6');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: cardColor, borderColor, borderWidth: 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>{t('studyReminders', 'Study Reminders')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: cardColor, borderColor }]}>
          <View style={[styles.heroIcon, { backgroundColor: primaryLightColor }]}>
            <Ionicons name="notifications-outline" size={30} color={primaryColor} />
          </View>
          <Text style={[styles.title, { color: textColor }]}>{t('buildConsistentRoutine', 'Build a consistent routine')}</Text>
          <Text style={[styles.description, { color: mutedColor }]}>
            {t('reminderHeroDesc', 'Choose a daily reminder time to help you stay on track with your study goals.')}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={[styles.label, { color: textColor }]}>{t('dailyStudyReminder', 'Daily study reminder')}</Text>
              <Text style={[styles.hint, { color: mutedColor }]}>
                {enabled ? t('reminderEnabled', 'Reminder preference is enabled') : t('reminderDisabled', 'Reminder preference is disabled')}
              </Text>
            </View>
            <Switch
              value={enabled}
              disabled={!loaded}
              onValueChange={(value) => savePreferences(value, selectedTime)}
              trackColor={{ false: isDarkMode ? '#2D4A3E' : '#CBD5E1', true: isDarkMode ? '#065F46' : '#A7F3D0' }}
              thumbColor={enabled ? primaryColor : (isDarkMode ? '#86A394' : '#F8FAFC')}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>{t('reminderTime', 'Reminder time')}</Text>
        <Text style={[styles.sectionHint, { color: mutedColor }]}>
          {t('selectPreferredTime', 'Select your preferred time.')}
        </Text>

        <View style={styles.timeGrid}>
          {TIMES.map((time) => {
            const selected = time === selectedTime;
            return (
              <TouchableOpacity
                key={time}
                activeOpacity={0.75}
                disabled={!loaded}
                onPress={() => savePreferences(enabled, time)}
                style={[
                  styles.timeOption,
                  {
                    backgroundColor: selected ? primaryLightColor : cardColor,
                    borderColor: selected ? primaryColor : borderColor,
                  },
                ]}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={19}
                  color={selected ? primaryColor : mutedColor}
                />
                <Text
                  style={[
                    styles.timeText,
                    {
                      color: selected ? primaryColor : textColor,
                      fontWeight: selected ? '700' : '500',
                    },
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.note, { color: mutedColor }]}>
          {t('reminderDeviceNote', 'These preferences are saved on this device. Scheduled notifications and notification permissions must be configured separately before reminders can alert you.')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  content: { padding: 18, paddingBottom: 36 },
  hero: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 18,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 19, fontWeight: '700', textAlign: 'center' },
  description: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  label: { fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, marginTop: 5 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 24 },
  sectionHint: { fontSize: 13, marginTop: 5, marginBottom: 12 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeOption: {
    width: '48%',
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: { fontSize: 14 },
  note: { fontSize: 12, lineHeight: 18, marginTop: 22 },
});
