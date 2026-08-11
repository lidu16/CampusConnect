import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../context/AdminContext';
import { useRootNavigation } from '../navigation/useRootNavigation';
import { RootStackParamList } from '../navigation/RootNavigator';
import { theme } from '../theme';

interface AdminActionBarProps {
  screen: keyof RootStackParamList;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const AdminActionBar: React.FC<AdminActionBarProps> = ({
  screen,
  label,
  icon = 'add-circle',
}) => {
  const { isAdmin } = useAdmin();
  const { navigate } = useRootNavigation();

  if (!isAdmin) return null;

  return (
    <Pressable
      style={({ pressed }) => [styles.bar, pressed && styles.pressed, Platform.OS === 'web' && styles.web]}
      onPress={() => navigate(screen)}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    gap: 10,
    minHeight: 52,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  web: { cursor: 'pointer' as any },
  label: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700' },
});

export default AdminActionBar;
