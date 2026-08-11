import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, grantAdminRole, revokeAdminRole, UserProfile } from '../services/user';

const AdminPanelScreen = ({ navigation }: any) => {
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleGrantAdmin = async (uid: string) => {
    Alert.alert(
      'Grant Admin',
      'Are you sure you want to grant admin privileges to this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Grant',
          onPress: async () => {
            try {
              await grantAdminRole(uid);
              await loadUsers();
              Alert.alert('Success', 'Admin privileges granted');
            } catch (error) {
              Alert.alert('Error', 'Failed to grant admin');
            }
          },
        },
      ]
    );
  };

  const handleRevokeAdmin = async (uid: string) => {
    Alert.alert(
      'Revoke Admin',
      'Are you sure you want to revoke admin privileges from this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          onPress: async () => {
            try {
              await revokeAdminRole(uid);
              await loadUsers();
              Alert.alert('Success', 'Admin privileges revoked');
            } catch (error) {
              Alert.alert('Error', 'Failed to revoke admin');
            }
          },
        },
      ]
    );
  };

  if (loading || usersLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Ionicons name="lock-closed" size={64} color="#e74c3c" />
        <Text style={styles.accessDenied}>Access Denied</Text>
        <Text style={styles.accessDeniedSub}>You don't have admin privileges.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Admin Panel</Text>

      {/* Admin Tools */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Create Content</Text>
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('CreateAnnouncement')}
        >
          <Ionicons name="megaphone" size={24} color="#fff" />
          <Text style={styles.adminButtonText}>Create Announcement</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.adminButtonText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('UploadMaterial')}
        >
          <Ionicons name="cloud-upload" size={24} color="#fff" />
          <Text style={styles.adminButtonText}>Upload Material</Text>
        </TouchableOpacity>
      </View>

      {/* User Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 User Management</Text>
        <Text style={styles.userCount}>Total Users: {users.length}</Text>
        <ScrollView style={styles.userList}>
          {users.map((u) => (
            <View key={u.uid} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{u.email}</Text>
                <View style={[styles.adminBadge, u.isAdmin ? styles.isAdmin : styles.notAdmin]}>
                  <Text style={styles.adminBadgeText}>
                    {u.isAdmin ? 'Admin' : 'User'}
                  </Text>
                </View>
              </View>
              {u.uid !== user?.uid && (
                <TouchableOpacity
                  style={[styles.actionButton, u.isAdmin ? styles.revokeButton : styles.grantButton]}
                  onPress={() =>
                    u.isAdmin ? handleRevokeAdmin(u.uid) : handleGrantAdmin(u.uid)
                  }
                >
                  <Text style={styles.actionButtonText}>
                    {u.isAdmin ? 'Revoke' : 'Grant Admin'}
                  </Text>
                </TouchableOpacity>
              )}
              {u.uid === user?.uid && (
                <Text style={styles.youLabel}>You</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f5f6fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 12 },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  adminButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 12 },
  userCount: { fontSize: 14, color: '#7f8c8d', marginBottom: 12 },
  userList: { maxHeight: 300 },
  userCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userEmail: { fontSize: 14, color: '#2c3e50' },
  adminBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 },
  isAdmin: { backgroundColor: '#2ecc71' },
  notAdmin: { backgroundColor: '#95a5a6' },
  adminBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  actionButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  grantButton: { backgroundColor: '#2ecc71' },
  revokeButton: { backgroundColor: '#e74c3c' },
  actionButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  youLabel: { fontSize: 12, color: '#3498db', fontWeight: '600' },
  accessDenied: { fontSize: 24, fontWeight: 'bold', color: '#e74c3c', marginTop: 16 },
  accessDeniedSub: { fontSize: 16, color: '#7f8c8d', marginTop: 8 },
});

export default AdminPanelScreen;