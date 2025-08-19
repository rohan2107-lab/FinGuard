import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';

export default function FinanceTutorial() {

  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  // Replace with your actual API base URL
  const API_BASE_URL = 'http://10.172.41.48:8000';
  
  useEffect(() => {
    fetchLearningContent();
  }, []);

  const fetchLearningContent = async () => {
    try {
      setLoading(true);
      // Using category slug for finance content
      const response = await fetch('${API_BASE_URL}/api/learning/content/category/finance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch learning content');
      }
      
      const data = await response.json();
      setLearningContent(data);
    } catch (error) {
      console.error('Error fetching learning content:', error);
      Alert.alert('Error', 'Failed to load learning content. Please try again later.');
    } finally {
      setLoading(false);
    }
  }




  const [learningContent, setLearningContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [financeCategory, setFinanceCategory] = useState(null);

  // Configure your backend URL - Update this with your actual backend URL
  const API_BASE_URL = 'http://10.172.41.93:8000'; // Common for local development
  // For production: const API_BASE_URL = 'https://your-domain.com';
  // For network testing: const API_BASE_URL = 'http://YOUR_IP:PORT';
  
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // First, get all categories to find finance category
      console.log('Fetching categories from:', `${API_BASE_URL}/api/learning/categories`);
      await fetchCategories();
      
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert(
        'Connection Error', 
        `Unable to connect to server. Please check:\n\n1. Backend server is running on ${API_BASE_URL}\n2. Network connection\n3. CORS settings if applicable\n\nError: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/learning/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      
      console.log('Categories response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Categories error response:', errorText);
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      
      const categoriesData = await response.json();
      console.log('Categories data:', categoriesData);
      setCategories(categoriesData);
      
      // Find finance category
      const financeCategory = categoriesData.find(cat => 
        cat.slug === 'finance' || 
        cat.name.toLowerCase().includes('finance') ||
        cat.slug === 'finance-basics'
      );
      
      if (financeCategory) {
        console.log('Found finance category:', financeCategory);
        setFinanceCategory(financeCategory);
        await fetchLearningContent(financeCategory.slug);
      } else {
        console.log('No finance category found, fetching all content');
        await fetchAllLearningContent();
      }
      
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to fetching all content
      await fetchAllLearningContent();
    }
  };

  const fetchLearningContent = async (categorySlug = 'finance') => {
    try {
      console.log('Fetching content for category:', categorySlug);
      const url = `${API_BASE_URL}/api/learning/content/category/${categorySlug}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      
      console.log('Content response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Content error response:', errorText);
        throw new Error(`Failed to fetch learning content: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched content data:', data);
      setLearningContent(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error fetching learning content:', error);
      throw error;
    }
  };

  const fetchAllLearningContent = async () => {
    try {
      console.log('Fetching all learning content');
      const response = await fetch(`${API_BASE_URL}/api/learning/content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      
      console.log('All content response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('All content error response:', errorText);
        throw new Error(`Failed to fetch all learning content: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched all content data:', data);
      
      // Filter for finance-related content if no specific category
      const financeContent = Array.isArray(data) ? data.filter(item => 
        item.title?.toLowerCase().includes('finance') ||
        item.description?.toLowerCase().includes('finance') ||
        item.category?.toLowerCase().includes('finance') ||
        item.tags?.some(tag => tag.toLowerCase().includes('finance'))
      ) : [];
      
      setLearningContent(financeContent);
      
    } catch (error) {
      console.error('Error fetching all learning content:', error);
      setLearningContent([]);

    }
  };

  const fetchContentDetails = async (contentId) => {
    try {
      setContentLoading(true);

      const response = await fetch('${API_BASE_URL}/api/learning/content/${contentId}');

      
      if (!response.ok) {
        throw new Error('Failed to fetch content details');
      }
      
      const data = await response.json();
      setSelectedContent(data);
    } catch (error) {
      console.error('Error fetching content details:', error);
      Alert.alert('Error', 'Failed to load content details. Please try again.');
    } finally {
      setContentLoading(false);
    }
  };

  const handleContentSelect = (content) => {
    fetchContentDetails(content.id);
  };

  const handleBackToList = () => {
    setSelectedContent(null);
  };

  const renderContentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contentItem} 
      onPress={() => handleContentSelect(item)}
    >
      <View style={styles.contentHeader}>
        <Text style={styles.contentTitle}>{item.title}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
      {item.description && (
        <Text style={styles.contentPreview} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      {item.duration && (
        <Text style={styles.duration}>Duration: {item.duration}</Text>
      )}
    </TouchableOpacity>
  );

  const renderContentDetail = () => (
    <ScrollView style={styles.detailContainer}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
        <Text style={styles.backButtonText}>← Back to Topics</Text>
      </TouchableOpacity>
      
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{selectedContent.title}</Text>
        
        {selectedContent.description && (
          <Text style={styles.detailDescription}>
            {selectedContent.description}
          </Text>
        )}
        
        {selectedContent.content && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.contentText}>{selectedContent.content}</Text>
          </View>
        )}
        
        {selectedContent.videos && selectedContent.videos.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Videos</Text>
            {selectedContent.videos.map((video, index) => (
              <View key={video.id || index} style={styles.videoItem}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                {video.description && (
                  <Text style={styles.videoDescription}>{video.description}</Text>
                )}
                {video.duration && (
                  <Text style={styles.videoDuration}>Duration: {video.duration}</Text>
                )}
              </View>
            ))}
          </View>
        )}
        
        {selectedContent.tags && selectedContent.tags.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {selectedContent.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading finance content...</Text>
      </View>
    );
  }

  if (selectedContent) {
    if (contentLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading content details...</Text>
        </View>
      );
    }
    return renderContentDetail();
  }

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>💵 Finance Basics</Text>
        <Text style={styles.subtitle}>
          Master the fundamentals of personal finance
        </Text>

      </View>git 

      </View>
      
      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Finance learning content will appear here once added by administrators.
          </Text>

          <TouchableOpacity style={styles.refreshButton} onPress={fetchLearningContent}>

          <TouchableOpacity style={styles.refreshButton} onPress={initializeApp}>

            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={learningContent}
          renderItem={renderContentItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mainTitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  listContainer: {

    padding: 20,
  },
  contentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  contentPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  backButton: {

    padding: 20,
    paddingTop: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },

  contentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  contentPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  backButton: {
    padding: 20,
    paddingTop: 60,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },

  detailCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  contentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  videoItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});