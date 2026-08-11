import React from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator } from 'react-native';
import { useSchedule } from '../hooks/useSchedule';

const ScheduleScreen = () => {
  const { schedule, loading, error } = useSchedule();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
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

  // Group by day
  const groupByDay = (items: typeof schedule) => {
    const days: Record<string, typeof schedule> = {};
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    dayOrder.forEach(day => { days[day] = []; });
    items.forEach(item => {
      if (days[item.dayOfWeek]) {
        days[item.dayOfWeek].push(item);
      }
    });
    return dayOrder
      .filter(day => days[day].length > 0)
      .map(day => ({ title: day, data: days[day] }));
  };

  const sections = groupByDay(schedule);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>👨‍🏫 Instructor:</Text>
              <Text style={styles.value}>{item.instructor}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>📍 Location:</Text>
              <Text style={styles.value}>{item.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>⏰ Time:</Text>
              <Text style={styles.value}>{item.startTime} - {item.endTime}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No classes scheduled.</Text>
          </View>
        }
        stickySectionHeadersEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  list: { padding: 16, paddingBottom: 80 },
  sectionHeader: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionHeaderText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseName: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginBottom: 8 },
  detailRow: { flexDirection: 'row', marginTop: 4 },
  label: { fontSize: 14, color: '#7f8c8d', width: 90 },
  value: { fontSize: 14, color: '#2c3e50', flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#95a5a6' },
  errorText: { fontSize: 16, color: 'red' },
});

export default ScheduleScreen;