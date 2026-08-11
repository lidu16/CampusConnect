import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents, rsvpToEvent, hasUserRSVPed, Event } from '../hooks/useEvents';

const EventsScreen = () => {
  const { events, loading, error } = useEvents();

  const handleRSVP = async (eventId: string) => {
    try {
      const rsvpStatus = await rsvpToEvent(eventId);
      Alert.alert('Success', rsvpStatus ? 'You RSVP\'d to this event!' : 'You canceled your RSVP.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }: { item: Event }) => {
    const userRSVPed = hasUserRSVPed(item);
    const attendeeCount = (item.attendees || []).length;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>📍 {item.location}</Text>
        <Text style={styles.detail}>📅 {item.date}</Text>
        <Text style={styles.detail}>🕐 {item.time}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.organizer}>By: {item.organizer}</Text>
        
        {/* RSVP Section */}
        <View style={styles.rsvpSection}>
          <View style={styles.attendeeInfo}>
            <Ionicons name="people" size={16} color="#7f8c8d" />
            <Text style={styles.attendeeCount}>{attendeeCount} attending</Text>
          </View>
          <TouchableOpacity
            style={[styles.rsvpButton, userRSVPed && styles.rsvpButtonCancel]}
            onPress={() => handleRSVP(item.id)}
          >
            <Text style={styles.rsvpButtonText}>
              {userRSVPed ? 'Cancel RSVP' : 'RSVP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <Text style={styles.errorText}>Failed to load events</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="calendar-outline" size={64} color="#bdc3c7" />
            <Text style={styles.empty}>No events scheduled.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  list: { padding: 16 },
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
  title: { fontSize: 18, fontWeight: '700', color: '#2c3e50' },
  detail: { fontSize: 14, color: '#34495e', marginTop: 2 },
  description: { fontSize: 14, color: '#7f8c8d', marginTop: 6 },
  organizer: { fontSize: 12, color: '#95a5a6', marginTop: 8, fontStyle: 'italic' },
  rsvpSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  attendeeInfo: { flexDirection: 'row', alignItems: 'center' },
  attendeeCount: { fontSize: 14, color: '#7f8c8d', marginLeft: 6 },
  rsvpButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rsvpButtonCancel: {
    backgroundColor: '#e74c3c',
  },
  rsvpButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: 16, color: '#95a5a6', marginTop: 8 },
  errorText: { fontSize: 16, color: 'red' },
});

export default EventsScreen;