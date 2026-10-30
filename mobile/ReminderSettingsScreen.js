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

const STORAGE_KEY = 'abhyas_study_reminder_preferences';
const TIMES = ['06:00 AM', '07:00 AM', '08:00 AM', '06:00 PM', '07:00 PM', '08:00 PM'];

export default function ReminderSettingsScreen({ onBack }) {
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

  const C = {
    background: '#F3F7FF',
    card: '#FFFFFF',
    text: '#172B4D',
    muted: '#738199',
    blue: '#3478F6',
    border: '#E5EAF3',
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>Study Reminders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.heroIcon}>
            <Ionicons name="notifications-outline" size={30} color={C.blue} />
          </View>
          <Text style={[styles.title, { color: C.text }]}>Build a consistent routine</Text>
          <Text style={[styles.description, { color: C.muted }]}>
            Choose a daily reminder time to help you stay on track with your study goals.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={[styles.label, { color: C.text }]}>Daily study reminder</Text>
              <Text style={[styles.hint, { color: C.muted }]}>
                {enabled ? 'Reminder preference is enabled' : 'Reminder preference is disabled'}
              </Text>
            </View>
            <Switch
              value={enabled}
              disabled={!loaded}
              onValueChange={(value) => savePreferences(value, selectedTime)}
              trackColor={{ false: '#CBD5E1', true: '#93B7FF' }}
              thumbColor={enabled ? C.blue : '#F8FAFC'}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: C.text }]}>Reminder time</Text>
        <Text style={[styles.sectionHint, { color: C.muted }]}>
          Select your preferred time.
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
                    backgroundColor: selected ? '#E6EFFF' : C.card,
                    borderColor: selected ? C.blue : C.border,
                  },
                ]}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={19}
                  color={selected ? C.blue : C.muted}
                />
                <Text style={[styles.timeText, { color: C.text }]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.note, { color: C.muted }]}>
          These preferences are saved on this device. Scheduled notifications and notification permissions must be configured separately before reminders can alert you.
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#EAF1FF',
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
  timeText: { fontSize: 14, fontWeight: '500' },
  note: { fontSize: 12, lineHeight: 18, marginTop: 22 },
});
