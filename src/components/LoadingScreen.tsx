import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const LoadingScreen = () => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Ionicons name="school" size={48} color={theme.colors.primary} />
    </View>
    <Text style={styles.title}>CampusConnect</Text>
    <Text style={styles.subtitle}>Your campus, connected</Text>
    <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primaryDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  loader: {
    marginTop: 8,
  },
});

export default LoadingScreen;
