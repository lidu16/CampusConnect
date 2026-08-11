import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSchedule } from '../hooks/useSchedule';
import { useAdmin } from '../context/AdminContext';
import { deleteScheduleItem } from '../services/admin';
import { theme } from '../theme';

const ScheduleScreen = () => {
  const { schedule, loading, error } = useSchedule();
  const { isAdmin } = useAdmin();

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Class', `Remove "${name}" from schedule?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteScheduleItem(id);
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load schedule</Text>
      </View>
    );
  }

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const days: Record<string, typeof schedule> = {};
  dayOrder.forEach((day) => { days[day] = []; });
  schedule.forEach((item) => {
    if (days[item.dayOfWeek]) days[item.dayOfWeek].push(item);
  });
  const sections = dayOrder
    .filter((day) => days[day].length > 0)
    .map((day) => ({ title: day, data: days[day] }));

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.courseName}>{item.courseName}</Text>
              {isAdmin && (
                <TouchableOpacity onPress={() => handleDelete(item.id, item.courseName)}>
                  <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.value}>{item.instructor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.value}>{item.location}</Text>
            </View>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
              <Text style={styles.timeText}>{item.startTime} – {item.endTime}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="time-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>No classes scheduled.</Text>
          </View>
        }
        stickySectionHeadersEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md, paddingBottom: 80 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
    marginBottom: 8,
    gap: 8,
  },
  sectionHeaderText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  courseName: { ...theme.typography.h3, color: theme.colors.text, flex: 1 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  value: { fontSize: 14, color: theme.colors.textSecondary },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    marginTop: 8,
    gap: 4,
  },
  timeText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: theme.colors.textMuted, marginTop: 12 },
  errorText: { fontSize: 16, color: theme.colors.danger },
});

export default ScheduleScreen;
