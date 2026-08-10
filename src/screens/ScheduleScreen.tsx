import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Schedule</Text>
      <Text style={styles.subtitle}>Your class timetable and reminders.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 8 },
});

export default ScheduleScreen;