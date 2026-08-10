import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import CustomButton from '../components/CustomButton';

const ProfileScreen = () => {
  const { user } = useAuth();

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
              await signOut(auth);
              // The AuthContext will automatically update and navigate to Login
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'Not logged in'}</Text>
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user?.uid || 'N/A'}</Text>
      </View>
      <CustomButton title="Logout" onPress={handleLogout} variant="secondary" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 24 },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: { fontSize: 14, color: '#7f8c8d', marginTop: 12 },
  value: { fontSize: 18, color: '#2c3e50', fontWeight: '600' },
});

export default ProfileScreen;