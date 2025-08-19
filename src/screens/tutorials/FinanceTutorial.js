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
import Video from 'react-native-video';


const { width, height } = Dimensions.get('window');

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
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'tutorial', 'video'
  const [videoLoading, setVideoLoading] = useState(true);

  const API_BASE_URL = 'http://10.172.41.93:8000';

  useEffect(() => {
    fetchFinanceBasicsContent();
  }, []);

  const fetchFinanceBasicsContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching Finance Basics learning content from:', `${API_BASE_URL}/api/financial/finance-basics`);

      const response = await fetch(`${API_BASE_URL}/api/financial/finance-basics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch learning content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.data && data.data.content && Array.isArray(data.data.content)) {
        setLearningContent(data.data.content);
      } else if (Array.isArray(data)) {
        setLearningContent(data);
      } else {
        console.warn('Unexpected data structure:', data);
        const testData = [
          {
            _id: 'test1',
            title: 'Understanding Compound Interest',
            description: "Learn how compound interest works and why it's important for wealth building",
            content: "Tax planning is a crucial aspect of financial management...",
            detailedContent: "This comprehensive guide covers all aspects of tax planning including...",
            videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
            videoTitle: 'Compound Interest Explained',
            videoDescription: 'A comprehensive guide to compound interest',
            difficulty: 'beginner',
            estimatedTime: 45,
            tags: ['compound-interest', 'saving', 'investing', 'beginners'],
            prerequisites: ['Basic math', 'Understanding of simple interest'],
            learningObjectives: ['Calculate compound interest', 'Understand time value of money'],
            isPublished: true,
          },
          {
            _id: 'test2',
            title: 'Building Your First Budget',
            description: "Step-by-step guide to creating and maintaining a personal budget that works.",
            content: "A budget is your roadmap to financial success.",
            detailedContent: `# Building Your First Budget
A budget is your roadmap to financial success. It helps you control your spending, save money, and reach your financial goals.
...
`,
            videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
            videoTitle: 'How to Create Your First Budget - Step by Step',
            videoDescription: 'Learn how to build a realistic budget that you can actually stick to.',
            difficulty: 'beginner',
            estimatedTime: 25,
            tags: ['budgeting', 'money management', 'savings'],
          }
        ];
        setLearningContent(testData);
      }
    } catch (error) {
      console.error('Error fetching learning content:', error);
      Alert.alert(
        'Connection Error',
        `Unable to connect to server. Showing test data instead.`
      );
      const testData = [
        {
          _id: 'error-test1',
          title: 'Introduction to Personal Finance',
          description: 'Learn the fundamentals of managing your personal finances effectively.',
          content: 'This is the short introduction to personal finance.',
          detailedContent: 'This is the full, detailed guide to personal finance, including sections on budgeting, saving, and investing.',
          videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
          videoTitle: 'Personal Finance Basics',
          videoDescription: 'A comprehensive introduction to personal finance.',
          isPublished: true,
          difficulty: 'beginner',
          estimatedTime: 30
        },
        {
          _id: 'error-test2',
          title: 'Investment Fundamentals',
          description: 'Understanding different types of investments and how to get started.',
          content: 'Here are the basics of investing.',
          detailedContent: 'This tutorial covers the different types of investments, including stocks, bonds, and mutual funds, and explains key principles like diversification.',
          videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
          videoTitle: 'Investment Basics for Beginners',
          videoDescription: 'Learn the fundamentals of investing.',
          isPublished: true,
          difficulty: 'intermediate',
          estimatedTime: 45
        }
      ];
      setLearningContent(testData);
    } finally {
      setLoading(false);
    }
  };

  const handleTitlePress = (content) => {
    const contentToDisplay = content.detailedContent || content.content;
    if (contentToDisplay) {
      setSelectedContent({
        ...content,
        tutorial: contentToDisplay
      });
      setViewMode('tutorial');
    } else {
      Alert.alert('No Content', 'No detailed content is available for this topic.');
    }
  };

  const handleVideoPress = (content) => {
    if (content.videoUrl) {
      setSelectedVideo({
        url: content.videoUrl,
        title: content.videoTitle || content.title,
        description: content.videoDescription || content.description
      });

      setVideoLoading(true);
      setVideoModalVisible(true);
    } else {
      Alert.alert('No Video', 'No valid video is available for this content.');
    }
  };

  const handleBackToList = () => {
    setSelectedContent(null);
    setViewMode('list');
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
    setVideoLoading(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#2196F3';

      
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

  const renderContentItem = ({ item }) => {
    return (
      <View style={styles.contentItem}>
        <View style={styles.contentRow}>
          <TouchableOpacity
            style={styles.titleSection}
            onPress={() => handleTitlePress(item)}
          >
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentDescription} numberOfLines={2}>
              {item.content || item.description}
            </Text>
            <View style={styles.metaInfo}>
              <Text style={[styles.difficultyBadge, { color: getDifficultyColor(item.difficulty) }]}>
                {getDifficultyIcon(item.difficulty)} {item.difficulty || 'General'}
              </Text>
              <Text style={styles.timeEstimate}>⏱ {formatTime(item.estimatedTime)}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.videoIconSection}
            onPress={() => handleVideoPress(item)}
          >
            <View style={styles.videoButton}>
              <Text style={styles.videoIcon}>▶️</Text>
            </View>
            <Text style={styles.videoLabel}>Watch</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTutorialContent = () => {
    if (!selectedContent || !selectedContent.tutorial) {
      return (
        <View style={styles.noTutorialContainer}>
          <Text style={styles.noTutorialText}>No tutorial content available for this topic.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ScrollView style={styles.tutorialContainer}>
        <View style={styles.tutorialHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerVideoButton}
            onPress={() => handleVideoPress(selectedContent)}
          >
            <Text style={styles.headerVideoIcon}>▶️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tutorialCard}>
          <Text style={styles.tutorialTitle}>{selectedContent.title}</Text>

          <View style={styles.tutorialMeta}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Difficulty:</Text>
              <Text style={[styles.metaValue, { color: getDifficultyColor(selectedContent.difficulty) }]}>
                {getDifficultyIcon(selectedContent.difficulty)} {selectedContent.difficulty || 'General'}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Estimated Time:</Text>
              <Text style={styles.metaValue}>⏱ {formatTime(selectedContent.estimatedTime)}</Text>
            </View>
          </View>

          <View style={styles.tutorialContent}>
            {selectedContent.tutorial.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null;

              if (paragraph.startsWith('# ')) {
                return (
                  <Text key={index} style={styles.tutorialMainHeading}>
                    {paragraph.replace('# ', '')}
                  </Text>
                );
              } else if (paragraph.startsWith('## ')) {
                return (
                  <Text key={index} style={styles.tutorialSubHeading}>
                    {paragraph.replace('## ', '')}
                  </Text>
                );
              } else if (paragraph.startsWith('### ')) {
                return (
                  <Text key={index} style={styles.tutorialSubSubHeading}>
                    {paragraph.replace('### ', '')}
                  </Text>
                );
              } else if (paragraph.startsWith('- *') || paragraph.startsWith(' **')) {
                const cleanText = paragraph.replace(/^[-]\s/, '').replace(/\\/g, '');
                return (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.bulletText}>{cleanText}</Text>
                  </View>
                );
              } else if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.bulletText}>{paragraph.replace(/^[-]\s/, '')}</Text>
                  </View>
                );
              } else if (paragraph.match(/^\d+\./)) {
                return (
                  <View key={index} style={styles.numberedPoint}>
                    <Text style={styles.numberedText}>{paragraph}</Text>
                  </View>
                );
              } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <Text key={index} style={styles.boldText}>
                    {paragraph.replace(/\*\*/g, '')}
                  </Text>
                );
              } else {
                return (
                  <Text key={index} style={styles.tutorialParagraph}>
                    {paragraph.replace(/\\/g, '')}
                  </Text>
                );
              }
            })}
          </View>

          {selectedContent.tags && selectedContent.tags.length > 0 && (
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>🏷 Tags</Text>
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
  };

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
          {selectedVideo?.url ? (
            <>
              <Video
                source={{ uri: selectedVideo.url }}
                style={styles.videoPlayer}
                controls={true}
                resizeMode="contain"
                onLoad={() => setVideoLoading(false)}
                onError={(e) => {
                  console.log('Video error:', e);
                  setVideoLoading(false);
                  Alert.alert('Video Error', 'The video could not be played.');
                }}
                onLoadStart={() => setVideoLoading(true)}
              />
              {videoLoading && (
                <View style={styles.videoLoadingOverlay}>
                  <ActivityIndicator size="large" color="#FFF" />
                  <Text style={styles.videoLoadingText}>Loading video...</Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoPlaceholderIcon}>🎥</Text>
              <Text style={styles.videoPlaceholderText}>No video available for this topic.</Text>
            </View>
          )}
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

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>📚 Learn Finance Basics</Text>
        <Text style={styles.subtitle}>
          Tap title for tutorial • Tap video icon to watch
        </Text>

        {learningContent.length > 0 && (
          <Text style={styles.contentCount}>
            {learningContent.length} topic{learningContent.length !== 1 ? 's' : ''} available
          </Text>
        )}

        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchFinanceBasicsContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>


      </View>git 


      </View>

      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
          </Text>

          <TouchableOpacity style={styles.refreshButton} onPress={fetchFinanceBasicsContent}>


          <TouchableOpacity style={styles.refreshButton} onPress={fetchLearningContent}>

          <TouchableOpacity style={styles.refreshButton} onPress={initializeApp}>


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
    marginBottom: 8,
  },
  contentCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  headerRefreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 12,
  },
  headerRefreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  titleSection: {
    flex: 1,
    padding: 20,
    paddingRight: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 24,
  },
  contentDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 16,
  },
  timeEstimate: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: '500',
  },
  videoIconSection: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  videoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  videoIcon: {
    fontSize: 20,
    color: 'white',
  },
  videoLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  tutorialContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,

  backButton: {

    padding: 20,

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
    backgroundColor: '#e74c3c',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerVideoIcon: {
    fontSize: 20,
    color: 'white',
  },
  tutorialCard: {


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
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 32,
  },
  tutorialMeta: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  tutorialContent: {
    marginBottom: 24,
  },
  tutorialMainHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    marginTop: 24,
  },
  tutorialSubHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
    marginTop: 20,
  },
  tutorialSubSubHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    marginBottom: 8,
    marginTop: 16,
  },
  tutorialParagraph: {
    fontSize: 15,
    color: '#5d6d7e',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 16,
  },
  bulletSymbol: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: '#5d6d7e',
    flex: 1,
    lineHeight: 22,
  },
  numberedPoint: {
    marginBottom: 8,
    paddingLeft: 16,
  },
  numberedText: {
    fontSize: 15,
    color: '#5d6d7e',
    lineHeight: 22,
  },
  boldText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 8,
  },
  contentSection: {
    marginBottom: 24,
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
    fontWeight: '600',
  },
  noTutorialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F7FA',
  },
  noTutorialText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
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
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f8c8d',
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
  // Video Modal Styles
  videoModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoModalHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.9)',
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
    backgroundColor: '#000',
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9, // Standard video aspect ratio
  },
  videoLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLoadingText: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 16,
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderIcon: {
    fontSize: 60,
    marginBottom: 16,
    color: '#FFF',
  },
  videoPlaceholderText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  videoDescription: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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