import React, { useState, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { createMaterial } from '../services/admin';
import { uploadImageToCloudinary } from '../services/cloudinary'; // or imgbb

const UploadMaterialScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !courseName.trim() || !file) {
      Alert.alert('Error', 'Please fill in all fields and select a file');
      return;
    }

    setLoading(true);
    try {
      // Upload file to Cloudinary/ImgBB
      const fileUrl = await uploadImageToCloudinary(file);
      
      // Get file extension
      const fileType = file.name.split('.').pop() || 'file';

      await createMaterial({
        title,
        courseName,
        description,
        fileUrl,
        fileType,
        uploadedBy: 'Admin',
        semester: 'Current',
      });

      Alert.alert('Success', 'Material uploaded!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📚 Upload Material</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} placeholder="Enter material title" value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Course Name</Text>
      <TextInput style={styles.input} placeholder="Enter course name" value={courseName} onChangeText={setCourseName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder="Enter description" value={description} onChangeText={setDescription} multiline numberOfLines={3} />

      <Text style={styles.label}>File</Text>
      <TouchableOpacity style={styles.filePicker} onPress={() => fileInputRef.current?.click()}>
        <Ionicons name="cloud-upload" size={24} color="#3498db" />
        <Text style={styles.filePickerText}>{fileName || 'Select a file'}</Text>
      </TouchableOpacity>
      <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>📤 Upload Material</Text>}
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
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  filePickerText: { fontSize: 16, color: '#2c3e50', marginLeft: 12 },
  submitButton: { backgroundColor: '#3498db', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default UploadMaterialScreen;