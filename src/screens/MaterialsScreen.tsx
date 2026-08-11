import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMaterials, Material } from '../services/materials';
import { useAdmin } from '../context/AdminContext';
import { deleteMaterial } from '../services/admin';
import { theme } from '../theme';
import AdminActionBar from '../components/AdminActionBar';

const MaterialsScreen = () => {
  const { isAdmin } = useAdmin();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch {
      Alert.alert('Error', 'Failed to load materials');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMaterials(materials);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredMaterials(
        materials.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.courseName.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, materials]);

  const handleOpenFile = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this file');
      }
    } catch {
      Alert.alert('Error', 'Failed to open file');
    }
  };

  const handleDelete = (item: Material) => {
    Alert.alert('Delete Material', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMaterial(item.id);
            await loadMaterials();
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  const getFileIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'document-text';
      case 'doc':
      case 'docx':
        return 'document';
      case 'ppt':
      case 'pptx':
        return 'albums';
      default:
        return 'file-tray';
    }
  };

  const renderItem = ({ item }: { item: Material }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleOpenFile(item.fileUrl)}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name={getFileIcon(item.fileType)} size={22} color={theme.colors.primary} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        {isAdmin && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              handleDelete(item);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.uploadedBy}>{item.uploadedBy}</Text>
        <Text style={styles.date}>
          {item.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminActionBar screen="UploadMaterial" label="Upload Material" icon="cloud-upload" />
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadMaterials();
            }}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No materials found.' : 'No materials uploaded yet.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: theme.colors.text },
  list: { padding: theme.spacing.md, paddingTop: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.text, flex: 1 },
  courseName: { fontSize: 13, color: theme.colors.primary, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 13, color: theme.colors.textMuted, marginBottom: 8 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 8,
  },
  uploadedBy: { fontSize: 12, color: theme.colors.textMuted },
  date: { fontSize: 12, color: theme.colors.textMuted },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: theme.colors.textMuted, marginTop: 12 },
});

export default MaterialsScreen;
