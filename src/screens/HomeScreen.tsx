import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAnnouncements } from '../hooks/useAnnouncements';

const HomeScreen = () => {
  const { announcements, loading, error } = useAnnouncements();

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
        <Text style={styles.errorText}>Failed to load announcements</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardContent}>{item.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardAuthor}>By: {item.author}</Text>
        <Text style={styles.cardDate}>
          {item.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No announcements yet.</Text>
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
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginBottom: 6 },
  cardContent: { fontSize: 14, color: '#34495e', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#ecf0f1', paddingTop: 8 },
  cardAuthor: { fontSize: 12, color: '#7f8c8d' },
  cardDate: { fontSize: 12, color: '#95a5a6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#95a5a6' },
  errorText: { fontSize: 16, color: 'red' },
});

export default HomeScreen;