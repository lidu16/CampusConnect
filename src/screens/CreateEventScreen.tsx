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
import { createEvent } from '../services/admin';

const CreateEventScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        title,
        description,
        location,
        date,
        time,
        organizer: organizer || 'Campus Admin',
      });
      Alert.alert('Success', 'Event created!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 Create Event</Text>

      <Text style={styles.label}>Event Title</Text>
      <TextInput style={styles.input} placeholder="Enter event title" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Enter event description" value={description} onChangeText={setDescription} multiline numberOfLines={3} />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} placeholder="Enter location" value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} placeholder="e.g., August 20, 2026" value={date} onChangeText={setDate} />

      <Text style={styles.label}>Time</Text>
      <TextInput style={styles.input} placeholder="e.g., 10:00 AM - 6:00 PM" value={time} onChangeText={setTime} />

      <Text style={styles.label}>Organizer (optional)</Text>
      <TextInput style={styles.input} placeholder="Enter organizer name" value={organizer} onChangeText={setOrganizer} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>📤 Create Event</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  submitButton: { backgroundColor: '#3498db', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default CreateEventScreen;