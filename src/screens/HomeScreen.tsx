import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnnouncements, Announcement } from '../hooks/useAnnouncements';
import { useAdmin } from '../context/AdminContext';
import { deleteAnnouncement } from '../services/admin';
import { theme, categoryColors } from '../theme';

const CATEGORIES = ['All', 'General', 'Academic', 'Event', 'Urgent'];

const HomeScreen = () => {
  const { announcements, loading, error } = useAnnouncements();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    let result = announcements;
    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }
    return result;
  }, [announcements, selectedCategory, searchQuery]);

  const handleDelete = (item: Announcement) => {
    Alert.alert('Delete Announcement', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAnnouncement(item.id);
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const renderAnnouncement = ({ item }: { item: Announcement }) => {
    const catStyle = categoryColors[item.category || 'General'] || categoryColors.General;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.category && (
            <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
              <Text style={[styles.categoryText, { color: catStyle.text }]}>{item.category}</Text>
            </View>
          )}
          {isAdmin && (
            <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardContent}>{item.content}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <Ionicons name="person-circle-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.cardAuthor}>{item.author}</Text>
          </View>
          <Text style={styles.cardDate}>
            {item.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
          </Text>
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
        <Ionicons name="cloud-offline-outline" size={48} color={theme.colors.danger} />
        <Text style={styles.errorText}>Failed to load announcements</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search announcements..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === item && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === item && styles.categoryChipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
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
          <View style={styles.empty}>
            <Ionicons name="newspaper-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory !== 'All'
                ? 'No announcements match your filters.'
                : 'No announcements yet.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },
  categoryList: { maxHeight: 44, marginBottom: 4 },
  categoryContent: { paddingHorizontal: theme.spacing.md, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary },
  categoryChipTextActive: { color: '#fff' },
  list: { padding: theme.spacing.md, paddingTop: 8 },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: theme.radius.full },
  categoryText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 },
  cardContent: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
    alignItems: 'center',
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardAuthor: { fontSize: 12, color: theme.colors.textMuted },
  cardDate: { fontSize: 12, color: theme.colors.textMuted },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: theme.colors.textMuted, marginTop: 12, textAlign: 'center' },
  errorText: { fontSize: 16, color: theme.colors.danger, marginTop: 12 },
});

export default HomeScreen;
