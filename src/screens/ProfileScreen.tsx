import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';
// ✅ CHANGE: Use ImgBB instead of Cloudinary
import { uploadImageToImgBB } from '../services/imgbb';
import { getUserProfile, updateUserProfile } from '../services/user';

const ProfileScreen = () => {
  const { user } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile picture from Firestore
  useEffect(() => {
    const loadProfilePic = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        console.log('🔵 Loading profile for user:', user.uid);
        const profile = await getUserProfile(user.uid);
        console.log('🔵 Profile data:', profile);
        
        if (profile?.photoURL) {
          console.log('🟢 Found profile picture URL:', profile.photoURL);
          setProfilePic(profile.photoURL);
        } else {
          console.log('🟡 No profile picture found');
        }
      } catch (error) {
        console.error('🔴 Error loading profile picture:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfilePic();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔵 Logging out...');
              await signOut(auth);
              console.log('🟢 Logout successful');
            } catch (error) {
              console.error('🔴 Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('🟡 No file selected');
      return;
    }

    console.log('🔵 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Alert.alert('Error', 'Please select an image file');
      console.log('🔴 Invalid file type:', file.type);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('Error', 'Image must be less than 5MB');
      console.log('🔴 File too large:', file.size);
      return;
    }

    setUploading(true);
    try {
      // ✅ CHANGE: Use uploadImageToImgBB instead of Cloudinary
      console.log('🔵 Starting upload to ImgBB...');
      const url = await uploadImageToImgBB(file);
      console.log('🟢 Upload successful! URL:', url);
      
      setProfilePic(url);
      
      // Save URL to Firestore
      if (user) {
        console.log('🔵 Saving URL to Firestore for user:', user.uid);
        await updateUserProfile({ photoURL: url });
        console.log('🟢 URL saved to Firestore successfully');
      }
      
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error: any) {
      console.error('🔴 Upload error:', error);
      Alert.alert('Error', 'Failed to upload image: ' + (error.message || 'Unknown error'));
    } finally {
      setUploading(false);
      // Reset file input so same file can be re-uploaded
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFilePicker = () => {
    console.log('🔵 File picker triggered');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      
      {/* Profile Picture Section */}
      <View style={styles.profilePicSection}>
        <TouchableOpacity onPress={triggerFilePicker} disabled={uploading}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.placeholderPic}>
              <Text style={styles.placeholderText}>📸</Text>
            </View>
          )}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={triggerFilePicker} style={styles.changePhotoButton} disabled={uploading}>
          <Text style={styles.changePhotoText}>
            {uploading ? 'Uploading...' : (profilePic ? 'Change Photo' : 'Add Photo')}
          </Text>
        </TouchableOpacity>
        
        {/* Hidden file input for web */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'Not logged in'}</Text>
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user?.uid || 'N/A'}</Text>
        <Text style={styles.label}>Profile Picture Status</Text>
        <Text style={[styles.value, { fontSize: 14, color: profilePic ? '#27ae60' : '#95a5a6' }]}>
          {profilePic ? '✅ Uploaded' : '❌ Not uploaded'}
        </Text>
      </View>

      <CustomButton title="Logout" onPress={handleLogout} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: 24 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  
  // Profile Picture
  profilePicSection: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  profilePic: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 3, 
    borderColor: '#3498db' 
  },
  placeholderPic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#3498db',
  },
  placeholderText: { 
    fontSize: 40 
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // User Info
  card: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: { 
    fontSize: 14, 
    color: '#7f8c8d', 
    marginTop: 12 
  },
  value: { 
    fontSize: 18, 
    color: '#2c3e50', 
    fontWeight: '600' 
  },
});

export default ProfileScreen;