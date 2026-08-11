import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, grantAdminRole, revokeAdminRole, UserProfile } from '../services/user';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { theme } from '../theme';
import { isSuperAdminEmail } from '../config/admin';
import { showAlert } from '../utils/alert';
import { confirmAction } from '../utils/confirm';

const ADMIN_ACTIONS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  screen: keyof RootStackParamList;
  color: string;
}> = [
  {
    icon: 'megaphone',
    label: 'Announcement',
    subtitle: 'Post news',
    screen: 'CreateAnnouncement',
    color: theme.colors.primary,
  },
  {
    icon: 'calendar',
    label: 'Add Event',
    subtitle: 'New event',
    screen: 'CreateEvent',
    color: theme.colors.info,
  },
  {
    icon: 'document-attach',
    label: 'Upload Material',
    subtitle: 'PDF, docs',
    screen: 'UploadMaterial',
    color: theme.colors.success,
  },
  {
    icon: 'time',
    label: 'Add Class',
    subtitle: 'Schedule',
    screen: 'CreateSchedule',
    color: theme.colors.accent,
  },
];

const AdminPanelScreen = () => {
  const { navigate } = useRootNavigation();
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch {
      showAlert('Error', 'Failed to load users');
    } finally {
      setUsersLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    } else {
      setUsersLoading(false);
    }
  }, [isAdmin, loadUsers]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, users]);

  const handleGrantAdmin = async (uid: string, email: string) => {
    const ok = await confirmAction('Grant Admin', `Give admin privileges to ${email}?`, 'Grant');
    if (!ok) return;
    try {
      await grantAdminRole(uid);
      await loadUsers();
      showAlert('Success', 'Admin privileges granted.');
    } catch (error: any) {
      showAlert('Error', error.message);
    }
  };

  const handleRevokeAdmin = async (uid: string, email: string) => {
    const ok = await confirmAction('Revoke Admin', `Remove admin privileges from ${email}?`, 'Revoke');
    if (!ok) return;
    try {
      await revokeAdminRole(uid);
      await loadUsers();
      showAlert('Success', 'Admin privileges revoked.');
    } catch (error: any) {
      showAlert('Error', error.message);
    }
  };

  if (loading || usersLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <View style={styles.lockCircle}>
          <Ionicons name="lock-closed" size={48} color={theme.colors.danger} />
        </View>
        <Text style={styles.accessDenied}>Access Denied</Text>
        <Text style={styles.accessDeniedSub}>You need admin privileges to view this panel.</Text>
      </View>
    );
  }

  const adminCount = users.filter((u) => u.isAdmin).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadUsers();
          }}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.headerBanner}>
        <Ionicons name="shield-checkmark" size={28} color={theme.colors.gold} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Admin Command Center</Text>
          <Text style={styles.subtitle}>Manage content & user roles</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: theme.colors.accent }]}>{adminCount}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Create Content</Text>
      <View style={styles.actionGrid}>
        {ADMIN_ACTIONS.map((item) => (
          <Pressable
            key={item.screen}
            style={({ pressed }) => [
              styles.actionCard,
              { borderColor: item.color },
              pressed && styles.actionCardPressed,
              Platform.OS === 'web' && styles.webPressable,
            ]}
            onPress={() => navigate(item.screen)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon} size={26} color={item.color} />
            </View>
            <Text style={styles.actionLabel}>{item.label}</Text>
            <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>User Management</Text>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users by email..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {filteredUsers.map((u) => (
        <View key={u.uid} style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{(u.email?.[0] || '?').toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail} numberOfLines={1}>{u.email}</Text>
            <View style={[styles.roleBadge, u.isAdmin ? styles.adminBadge : styles.userBadge]}>
              <Ionicons name={u.isAdmin ? 'shield-checkmark' : 'person'} size={12} color="#fff" />
              <Text style={styles.roleBadgeText}>{u.isAdmin ? 'Admin' : 'User'}</Text>
            </View>
          </View>
          {u.uid === user?.uid ? (
            <Text style={styles.youLabel}>You</Text>
          ) : isSuperAdminEmail(u.email) ? (
            <Text style={styles.superAdminLabel}>Super Admin</Text>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.roleButton,
                u.isAdmin ? styles.revokeBtn : styles.grantBtn,
                pressed && styles.roleButtonPressed,
              ]}
              onPress={() =>
                u.isAdmin
                  ? handleRevokeAdmin(u.uid, u.email)
                  : handleGrantAdmin(u.uid, u.email)
              }
            >
              <Text style={styles.roleButtonText}>{u.isAdmin ? 'Revoke' : 'Promote'}</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  lockCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryDark,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    gap: 12,
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: theme.spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: theme.colors.primary },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    gap: 10,
  },
  actionCard: {
    width: Platform.OS === 'web' ? '48%' : '47%',
    minHeight: 110,
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  webPressable: { cursor: 'pointer' as any },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 14, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },
  actionSubtitle: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  userInfo: { flex: 1 },
  userEmail: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    marginTop: 4,
    gap: 4,
  },
  adminBadge: { backgroundColor: theme.colors.primary },
  userBadge: { backgroundColor: theme.colors.textMuted },
  roleBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  roleButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.sm, minHeight: 36 },
  roleButtonPressed: { opacity: 0.85 },
  grantBtn: { backgroundColor: theme.colors.success },
  revokeBtn: { backgroundColor: theme.colors.danger },
  roleButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  youLabel: { fontSize: 12, color: theme.colors.primary, fontWeight: '700' },
  superAdminLabel: { fontSize: 11, color: theme.colors.accent, fontWeight: '700' },
  accessDenied: { fontSize: 22, fontWeight: '800', color: theme.colors.danger },
  accessDeniedSub: { fontSize: 15, color: theme.colors.textSecondary, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});

export default AdminPanelScreen;
