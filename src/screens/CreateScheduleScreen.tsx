import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { createScheduleItem } from '../services/admin';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';
import { showAlert } from '../utils/alert';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CreateScheduleScreen = () => {
  const { goBack } = useRootNavigation();
  const [courseName, setCourseName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [location, setLocation] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!courseName.trim() || !instructor.trim() || !location.trim() || !startTime.trim() || !endTime.trim()) {
      showAlert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await createScheduleItem({
        courseName: courseName.trim(),
        instructor: instructor.trim(),
        location: location.trim(),
        dayOfWeek,
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      });
      showAlert('Success', 'Class added to schedule!');
      goBack();
    } catch (error: any) {
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add Class to Schedule</Text>

      <Text style={styles.label}>Course Name</Text>
      <TextInput style={styles.input} placeholder="e.g., Data Structures" value={courseName} onChangeText={setCourseName} />

      <Text style={styles.label}>Instructor</Text>
      <TextInput style={styles.input} placeholder="Professor name" value={instructor} onChangeText={setInstructor} />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Room / Building" value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Day of Week</Text>
      <View style={styles.chipRow}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.chip, dayOfWeek === day && styles.chipActive]}
            onPress={() => setDayOfWeek(day)}
          >
            <Text style={[styles.chipText, dayOfWeek === day && styles.chipTextActive]}>
              {day.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Start Time</Text>
      <TextInput style={styles.input} placeholder="e.g., 09:00 AM" value={startTime} onChangeText={setStartTime} />

      <Text style={styles.label}>End Time</Text>
      <TextInput style={styles.input} placeholder="e.g., 10:30 AM" value={endTime} onChangeText={setEndTime} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Add to Schedule</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { ...theme.typography.h2, color: theme.colors.text, marginBottom: 20 },
  label: { ...theme.typography.label, color: theme.colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceAlt,
  },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CreateScheduleScreen;
