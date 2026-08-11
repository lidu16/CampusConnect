import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents, rsvpToEvent, hasUserRSVPed, Event } from '../hooks/useEvents';
import { useAdmin } from '../context/AdminContext';
import { deleteEvent } from '../services/admin';
import { theme } from '../theme';
import AdminActionBar from '../components/AdminActionBar';

const EventsScreen = () => {
  const { events, loading, error } = useEvents();
  const { isAdmin } = useAdmin();
  const [refreshing, setRefreshing] = useState(false);

  const handleRSVP = async (eventId: string) => {
    try {
      const rsvpStatus = await rsvpToEvent(eventId);
      Alert.alert('Success', rsvpStatus ? "You're going to this event!" : 'RSVP cancelled.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = (item: Event) => {
    Alert.alert('Delete Event', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(item.id);
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Event }) => {
    const userRSVPed = hasUserRSVPed(item);
    const attendeeCount = (item.attendees || []).length;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar" size={14} color={theme.colors.primary} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          {isAdmin && (
            <TouchableOpacity onPress={() => handleDelete(item)}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.detail}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
          <Text style={styles.detail}>{item.time}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.organizer}>Organized by {item.organizer}</Text>

        <View style={styles.rsvpSection}>
          <View style={styles.attendeeInfo}>
            <Ionicons name="people" size={16} color={theme.colors.primary} />
            <Text style={styles.attendeeCount}>{attendeeCount} attending</Text>
          </View>
          <TouchableOpacity
            style={[styles.rsvpButton, userRSVPed && styles.rsvpButtonCancel]}
            onPress={() => handleRSVP(item.id)}
          >
            <Text style={styles.rsvpButtonText}>{userRSVPed ? 'Cancel RSVP' : 'RSVP'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <Text style={styles.errorText}>Failed to load events</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminActionBar screen="CreateEvent" label="Add New Event" icon="calendar" />
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 800);
            }}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>No events scheduled yet.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  dateText: { fontSize: 12, fontWeight: '600', color: theme.colors.primary },
  title: { ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  detail: { fontSize: 14, color: theme.colors.textSecondary },
  description: { fontSize: 14, color: theme.colors.textMuted, marginTop: 8, lineHeight: 20 },
  organizer: { fontSize: 12, color: theme.colors.textMuted, marginTop: 8, fontStyle: 'italic' },
  rsvpSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  attendeeInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  attendeeCount: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  rsvpButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
  },
  rsvpButtonCancel: { backgroundColor: theme.colors.danger },
  rsvpButtonText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: theme.colors.textMuted, marginTop: 12 },
  errorText: { fontSize: 16, color: theme.colors.danger },
});

export default EventsScreen;
