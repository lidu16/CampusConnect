import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { createMaterial } from '../services/admin';
import { uploadImageToCloudinary, UploadFile } from '../services/cloudinary';
import { useAuth } from '../context/AuthContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';
import { showAlert } from '../utils/alert';

const UploadMaterialScreen = () => {
  const { goBack } = useRootNavigation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<UploadFile | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWebFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const pickFile = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: '*/*',
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
        });
        setFileName(asset.name);
      }
    } catch {
      showAlert('Error', 'Failed to pick file');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !courseName.trim()) {
      showAlert('Missing Fields', 'Please enter title and course name.');
      return;
    }
    if (!file) {
      showAlert('No File', 'Please select a file to upload (PDF, image, or document).');
      return;
    }

    setLoading(true);
    try {
      const fileUrl = await uploadImageToCloudinary(file);
      const name = 'name' in file ? file.name : fileName;
      const fileType = name.split('.').pop()?.toLowerCase() || 'file';

      await createMaterial({
        title: title.trim(),
        courseName: courseName.trim(),
        description: description.trim(),
        fileUrl,
        fileType,
        uploadedBy: user?.email || 'Admin',
        semester: 'Current',
      });

      showAlert('Success', 'Material uploaded successfully!');
      goBack();
    } catch (error: any) {
      showAlert('Upload Failed', error.message || 'Could not upload file. Try a smaller file or different format.');
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
      <Text style={styles.title}>Upload Study Material</Text>
      <Text style={styles.hint}>Supports PDF, images, Word, PowerPoint, and more.</Text>

      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Material title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Course Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., CS101"
        value={courseName}
        onChangeText={setCourseName}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Brief description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        placeholderTextColor={theme.colors.textMuted}
      />

      <Text style={styles.label}>File *</Text>
      <Pressable
        style={({ pressed }) => [styles.filePicker, pressed && styles.pressed]}
        onPress={pickFile}
      >
        <Ionicons name="cloud-upload-outline" size={28} color={theme.colors.primary} />
        <View style={styles.filePickerTextWrap}>
          <Text style={styles.filePickerText}>
            {fileName || 'Tap to select a file'}
          </Text>
          {fileName ? (
            <Text style={styles.fileSelected}>File selected — tap to change</Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
      </Pressable>

      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,image/*"
          style={{ display: 'none' }}
          onChange={handleWebFileSelect}
        />
      )}

      <CustomButton
        title="Upload Material"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, paddingBottom: 48 },
  title: { ...theme.typography.h2, color: theme.colors.text, marginBottom: 4 },
  hint: { fontSize: 13, color: theme.colors.textMuted, marginBottom: 20 },
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
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    gap: 12,
    minHeight: 72,
  },
  pressed: { opacity: 0.88 },
  filePickerTextWrap: { flex: 1 },
  filePickerText: { fontSize: 15, color: theme.colors.text, fontWeight: '600' },
  fileSelected: { fontSize: 12, color: theme.colors.success, marginTop: 2 },
});

export default UploadMaterialScreen;
