import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { uploadImageToCloudinary, UploadFile } from '../services/cloudinary';
import { getUserProfile, updateUserProfile } from '../services/user';
import CustomButton from '../components/CustomButton';
import { theme } from '../theme';
import { confirmAction } from '../utils/confirm';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { isAdmin, refreshAdminStatus } = useAdmin();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfilePic = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.photoURL) setProfilePic(profile.photoURL);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfilePic();
  }, [user]);

  const handleLogout = async () => {
    const confirmed = await confirmAction('Logout', 'Are you sure you want to logout?', 'Logout');
    if (!confirmed) return;

    setLoggingOut(true);
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const uploadPhoto = async (file: UploadFile) => {
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setProfilePic(url);
      if (user) {
        await updateUserProfile({ photoURL: url });
      }
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleWebImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Alert.alert('Error', 'Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('Error', 'Image must be less than 5MB');
      return;
    }
    await uploadPhoto(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFilePicker = async () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadPhoto({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'image/jpeg',
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={triggerFilePicker} disabled={uploading} style={styles.avatarWrapper}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.placeholderPic}>
              <Ionicons name="person" size={48} color={theme.colors.primaryLight} />
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color="#fff" />
          </View>
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, isAdmin ? styles.adminBadge : styles.userBadge]}>
          <Ionicons name={isAdmin ? 'shield-checkmark' : 'person'} size={14} color="#fff" />
          <Text style={styles.roleText}>{isAdmin ? 'Administrator' : 'Student'}</Text>
        </View>
      </View>

      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleWebImageUpload}
        />
      )}

      <View style={styles.card}>
        <InfoRow icon="mail-outline" label="Email" value={user?.email || 'N/A'} />
        <InfoRow icon="key-outline" label="User ID" value={user?.uid?.slice(0, 12) + '...' || 'N/A'} />
        <InfoRow
          icon="image-outline"
          label="Photo"
          value={profilePic ? 'Uploaded' : 'Not set'}
          valueColor={profilePic ? theme.colors.success : theme.colors.textMuted}
        />
      </View>

      <CustomButton title="Change Photo" onPress={triggerFilePicker} disabled={uploading} variant="secondary" />
      <CustomButton title="Refresh Role Status" onPress={async () => { await refreshAdminStatus(); Alert.alert('Done', 'Role status refreshed.'); }} variant="secondary" />
      <CustomButton title="Logout" onPress={handleLogout} variant="danger" loading={loggingOut} disabled={loggingOut} />
    </ScrollView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={theme.colors.primary} />
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: theme.spacing.lg },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  placeholderPic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.primaryLight,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: theme.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    gap: 6,
  },
  adminBadge: { backgroundColor: theme.colors.primary },
  userBadge: { backgroundColor: theme.colors.textMuted },
  roleText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  infoContent: { flex: 1 },
  label: { fontSize: 12, color: theme.colors.textMuted, marginBottom: 2 },
  value:  { fontSize: 15, fontWeight: '600', color: theme.colors.text },
});

export default ProfileScreen;
