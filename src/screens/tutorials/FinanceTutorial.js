import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function FinanceBasicsModule() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Configure your backend URL - Update this with your actual backend URL
  const API_BASE_URL = 'http://10.172.41.93:8000'; // Update with your backend URL
  
  useEffect(() => {
    fetchSIPLearningContent();
  }, []);

  const fetchSIPLearningContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching SIP learning content from:', `${API_BASE_URL}/api/financial/finance-basics`);
      
      const response = await fetch(`${API_BASE_URL}/api/financial/finance-basics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch learning content: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Filter only published content
      const publishedContent = Array.isArray(data) ? data.filter(item => item.isPublished) : [];
      setLearningContent(publishedContent);
      
    } catch (error) {
      console.error('Error fetching learning content:', error);
      Alert.alert(
        'Connection Error', 
        `Unable to connect to server. Please check:\n\n1. Backend server is running on ${API_BASE_URL}\n2. Network connection\n3. API endpoint is accessible\n\nError: ${error.message}`
      );
      setLearningContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  const handleVideoPress = (content) => {
    if (content.videoUrl) {
      setSelectedVideo({
        url: content.videoUrl,
        title: content.videoTitle || content.title,
        description: content.videoDescription || content.description
      });
      setVideoModalVisible(true);
    } else {
      Alert.alert('No Video', 'No video is available for this content.');
    }
  };

  const handleBackToList = () => {
    setSelectedContent(null);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '🟢';
      case 'intermediate': return '🟡';
      case 'advanced': return '🔴';
      default: return '🔵';
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const renderContentItem = ({ item }) => (
    <View style={styles.contentItem}>
      <TouchableOpacity 
        style={styles.contentMain}
        onPress={() => handleContentSelect(item)}
      >
        <View style={styles.contentHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.difficultyBadge}>
                {getDifficultyIcon(item.difficulty)} {item.difficulty || 'General'}
              </Text>
              <Text style={styles.timeEstimate}>
                ⏱️ {formatTime(item.estimatedTime)}
              </Text>
            </View>
          </View>
          
          {item.videoUrl && (
            <TouchableOpacity 
              style={styles.videoButton}
              onPress={() => handleVideoPress(item)}
            >
              <Text style={styles.videoIcon}>▶️</Text>
              <Text style={styles.videoText}>Video</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {item.description && (
          <Text style={styles.contentPreview} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsPreview}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <Text key={index} style={styles.tagPreview}>#{tag}</Text>
            ))}
            {item.tags.length > 3 && (
              <Text style={styles.tagPreview}>+{item.tags.length - 3} more</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderContentDetail = () => (
    <ScrollView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        {selectedContent.videoUrl && (
          <TouchableOpacity 
            style={styles.headerVideoButton}
            onPress={() => handleVideoPress(selectedContent)}
          >
            <Text style={styles.headerVideoIcon}>▶️</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{selectedContent.title}</Text>
        
        <View style={styles.detailMeta}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Difficulty:</Text>
            <Text style={[styles.metaValue, { color: getDifficultyColor(selectedContent.difficulty) }]}>
              {getDifficultyIcon(selectedContent.difficulty)} {selectedContent.difficulty || 'General'}
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Estimated Time:</Text>
            <Text style={styles.metaValue}>⏱️ {formatTime(selectedContent.estimatedTime)}</Text>
          </View>
        </View>
        
        {selectedContent.description && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>📝 Description</Text>
            <Text style={styles.contentText}>{selectedContent.description}</Text>
          </View>
        )}
        
        {selectedContent.learningObjectives && selectedContent.learningObjectives.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>🎯 Learning Objectives</Text>
            {selectedContent.learningObjectives.map((objective, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{objective}</Text>
              </View>
            ))}
          </View>
        )}
        
        {selectedContent.prerequisites && selectedContent.prerequisites.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>📚 Prerequisites</Text>
            {selectedContent.prerequisites.map((prerequisite, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{prerequisite}</Text>
              </View>
            ))}
          </View>
        )}
        
        {selectedContent.videoUrl && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>🎥 Video Content</Text>
            <TouchableOpacity 
              style={styles.videoCard}
              onPress={() => handleVideoPress(selectedContent)}
            >
              <View style={styles.videoCardContent}>
                <Text style={styles.videoCardIcon}>▶️</Text>
                <View style={styles.videoCardText}>
                  <Text style={styles.videoCardTitle}>
                    {selectedContent.videoTitle || selectedContent.title}
                  </Text>
                  {selectedContent.videoDescription && (
                    <Text style={styles.videoCardDescription}>
                      {selectedContent.videoDescription}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        
        {selectedContent.tags && selectedContent.tags.length > 0 && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>🏷️ Tags</Text>
            <View style={styles.tagsContainer}>
              {selectedContent.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>#{tag}</Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderVideoModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={videoModalVisible}
      onRequestClose={closeVideoModal}
    >
      <View style={styles.videoModalContainer}>
        <View style={styles.videoModalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={closeVideoModal}>
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoContainer}>
          {/* Video Player Placeholder */}
          <View style={styles.videoPlayerPlaceholder}>
            <Text style={styles.videoPlayerText}>🎥</Text>
            <Text style={styles.videoPlayerTitle}>Video Player</Text>
            <Text style={styles.videoPlayerSubtitle}>
              {selectedVideo?.title}
            </Text>
            <Text style={styles.videoUrl}>
              URL: {selectedVideo?.url}
            </Text>
            <Text style={styles.videoNote}>
              Replace this placeholder with react-native-video or similar library
            </Text>
          </View>
        </View>
        
        {selectedVideo?.description && (
          <View style={styles.videoDescription}>
            <Text style={styles.videoDescriptionTitle}>About this video:</Text>
            <Text style={styles.videoDescriptionText}>
              {selectedVideo.description}
            </Text>
          </View>
        )}
      </View>
    </Modal>
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
    return renderContentDetail();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>💰 Finance Basics</Text>
        <Text style={styles.subtitle}>
          Master SIP & Investment Fundamentals
        </Text>
      </View>
      
      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Finance learning content will appear here once published by administrators.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchSIPLearningContent}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={learningContent}
          renderItem={renderContentItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {renderVideoModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  contentItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentMain: {
    padding: 16,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 12,
  },
  timeEstimate: {
    fontSize: 12,
    color: '#666',
  },
  videoButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 60,
  },
  videoIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  videoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  contentPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPreview: {
    fontSize: 11,
    color: '#4A90E2',
    marginRight: 8,
    marginBottom: 4,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  headerVideoButton: {
    backgroundColor: '#FF6B6B',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerVideoIcon: {
    fontSize: 20,
    color: 'white',
  },
  detailCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailMeta: {
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 8,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  videoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  videoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  videoCardText: {
    flex: 1,
  },
  videoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoCardDescription: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoModalHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerPlaceholder: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  videoPlayerText: {
    fontSize: 48,
    marginBottom: 12,
  },
  videoPlayerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  videoPlayerSubtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  videoUrl: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  videoNote: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  videoDescription: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  videoDescriptionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  videoDescriptionText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});