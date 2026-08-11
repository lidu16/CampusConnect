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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMaterials, Material } from '../services/materials';

const MaterialsScreen = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMaterials(materials);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = materials.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.courseName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
      setFilteredMaterials(filtered);
    }
  }, [searchQuery, materials]);

  const loadMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
      setFilteredMaterials(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open file');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'document-text';
      case 'doc': case 'docx': return 'document';
      case 'ppt': case 'pptx': return 'albums';
      case 'xls': case 'xlsx': return 'grid';
      default: return 'file-tray';
    }
  };

  const renderItem = ({ item }: { item: Material }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleOpenFile(item.fileUrl)}>
      <View style={styles.cardHeader}>
        <Ionicons name={getFileIcon(item.fileType)} size={24} color="#3498db" />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.courseName}>📚 {item.courseName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.uploadedBy}>👤 {item.uploadedBy}</Text>
        <Text style={styles.date}>
          {item.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search materials..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#95a5a6"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#95a5a6" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="document-outline" size={64} color="#bdc3c7" />
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
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  list: { padding: 16, paddingTop: 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#2c3e50', marginLeft: 8, flex: 1 },
  courseName: { fontSize: 14, color: '#34495e', marginBottom: 4 },
  description: { fontSize: 13, color: '#7f8c8d', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#ecf0f1', paddingTop: 8 },
  uploadedBy: { fontSize: 12, color: '#7f8c8d' },
  date: { fontSize: 12, color: '#95a5a6' },
  emptyText: { fontSize: 16, color: '#95a5a6', marginTop: 8 },
});

export default MaterialsScreen;