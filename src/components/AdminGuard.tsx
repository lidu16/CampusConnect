import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';
import { theme } from '../theme';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
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
          <Ionicons name="shield-outline" size={48} color={theme.colors.danger} />
        </View>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>Only admins can access this feature.</Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  lockCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.danger,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdminGuard;
