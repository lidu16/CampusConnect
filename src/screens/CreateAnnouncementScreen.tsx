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
import { createAnnouncement } from '../services/admin';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';
import { showAlert } from '../utils/alert';

const CreateAnnouncementScreen = () => {
  const { goBack } = useRootNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);

  const categories = ['General', 'Academic', 'Event', 'Urgent'];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      showAlert('Missing Fields', 'Please fill in title and content.');
      return;
    }

    setLoading(true);
    try {
      await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        category,
        author: user?.displayName || user?.email || 'Admin',
      });
      showAlert('Success', 'Announcement published!');
      goBack();
    } catch (error: any) {
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Announcement</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder="Announcement title" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your announcement..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryButton, category === cat && styles.categoryActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Publish Announcement</Text>
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
  textArea: { height: 130, textAlignVertical: 'top' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceAlt,
  },
  categoryActive: { backgroundColor: theme.colors.primary },
  categoryText: { color: theme.colors.textSecondary, fontWeight: '600' },
  categoryTextActive: { color: '#fff' },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default CreateAnnouncementScreen;
