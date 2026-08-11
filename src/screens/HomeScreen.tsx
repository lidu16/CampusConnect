import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useSchedule } from '../hooks/useSchedule';

const CATEGORIES = ['All', 'General', 'Academic', 'Event', 'Urgent'];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const { announcements, loading, error } = useAnnouncements(selectedCategory);
  const { schedule, loading: scheduleLoading } = useSchedule();

  // Filter announcements by category (in case the hook doesn't filter)
  const filteredAnnouncements = selectedCategory
    ? announcements.filter((a) => a.category === selectedCategory)
    : announcements;

  // Get today's classes
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = schedule.filter((item) => item.dayOfWeek === today);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Urgent':
        return '#e74c3c';
      case 'Academic':
        return '#3498db';
      case 'Event':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  if (loading || scheduleLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load announcements</Text>
      </View>
    );
  }

  const renderAnnouncement = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        {item.category && (
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardContent}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardAuthor}>By: {item.author}</Text>
        <Text style={styles.cardDate}>
          {item.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
        </Text>
      </View>
    </View>
  );

  const renderTodayClasses = () => {
    if (todayClasses.length === 0) return null;

    return (
      <View style={styles.todayContainer}>
        <Text style={styles.todayTitle}>📚 Today's Classes</Text>
        {todayClasses.map((item) => (
          <View key={item.id} style={styles.todayCard}>
            <Text style={styles.todayCourse}>{item.courseName}</Text>
            <Text style={styles.todayTime}>⏰ {item.startTime} - {item.endTime}</Text>
            <Text style={styles.todayLocation}>📍 {item.location}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              selectedCategory === (cat === 'All' ? undefined : cat) &&
                styles.filterButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat === 'All' ? undefined : cat)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === (cat === 'All' ? undefined : cat) &&
                  styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderTodayClasses}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="newspaper-outline" size={64} color="#bdc3c7" />
            <Text style={styles.emptyText}>
              {selectedCategory
                ? `No announcements in "${selectedCategory}" category.`
                : 'No announcements yet.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2c3e50', flex: 1 },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  cardContent: { fontSize: 14, color: '#34495e', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 8,
  },
  cardAuthor: { fontSize: 12, color: '#7f8c8d' },
  cardDate: { fontSize: 12, color: '#95a5a6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#95a5a6', marginTop: 8 },
  errorText: { fontSize: 16, color: 'red' },

  // Today's Classes Styles
  todayContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 12,
  },
  todayCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  todayCourse: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  todayTime: {
    fontSize: 14,
    color: '#34495e',
    marginTop: 2,
  },
  todayLocation: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
});

export default HomeScreen;