import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { createEvent } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';
import { showAlert } from '../utils/alert';

const CreateEventScreen = () => {
  const { goBack } = useRootNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim()) {
      showAlert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        date: date.trim(),
        time: time.trim(),
        organizer: user?.email || 'Campus Admin',
      });
      showAlert('Success', 'Event created!');
      goBack();
    } catch (error: any) {
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Event</Text>

      <Text style={styles.label}>Event Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Event name"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Event details..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        placeholder="Venue / Room"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Date *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., August 20, 2026"
        value={date}
        onChangeText={setDate}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Time *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 10:00 AM - 6:00 PM"
        value={time}
        onChangeText={setTime}
        placeholderTextColor={theme.colors.textMuted}
      />

      <CustomButton title="Create Event" onPress={handleSubmit} loading={loading} disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 48 },
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
  textArea: { height: 100, textAlignVertical: 'top' },
});

export default CreateEventScreen;
