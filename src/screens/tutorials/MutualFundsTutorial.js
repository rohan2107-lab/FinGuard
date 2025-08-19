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
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MutualFundsModule() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'tutorial', 'video'

  const API_BASE_URL = 'http://10.172.41.93:8000';

  useEffect(() => {
    fetchMutualFundsContent();
  }, []);

  const fetchMutualFundsContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching Mutual Funds learning content from:', `${API_BASE_URL}/api/financial/mutual-funds`);

      const response = await fetch(`${API_BASE_URL}/api/financial/mutual-funds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch Mutual Funds content: ${response.status} ${response.statusText}`);
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
            _id: 'mf-test1',
            title: 'Introduction to Mutual Funds',
            description: "Learn what mutual funds are and how they work.",
            content: "A mutual fund is a professionally managed investment fund that pools money from many investors.",
            detailedContent: "# Introduction to Mutual Funds\n\nMutual funds are a type of professionally managed investment that pools money from many investors to purchase securities like stocks and bonds.\n\n## How Mutual Funds Work\n\n- **Pooling of Funds**: Money from thousands of investors is collected into a single fund.\n- **Professional Management**: A fund manager invests this pool of money on behalf of the investors.\n- **Diversification**: Mutual funds typically hold a wide range of investments, which helps to spread risk.\n- **NAV (Net Asset Value)**: The price of a mutual fund unit is its NAV, calculated daily.\n\n## Types of Mutual Funds\n\n- **Equity Funds**: Invest primarily in stocks.\n- **Debt Funds**: Invest in bonds and other fixed-income securities.\n- **Hybrid Funds**: A mix of both stocks and bonds.\n- **Index Funds**: Track a specific market index like the S&P 500.",
            videoUrl: 'https://example.com/mf-intro.mp4',
            videoTitle: 'What are Mutual Funds? A Complete Guide',
            videoDescription: 'An easy-to-understand explanation of mutual funds for beginners.',
            difficulty: 'beginner',
            estimatedTime: 20,
            tags: ['mutual-funds', 'basics', 'investing', 'portfolio'],
          },
          {
            _id: 'mf-test2',
            title: 'Choosing the Right Mutual Fund',
            description: "A guide to selecting mutual funds based on your goals and risk tolerance.",
            content: "Choosing the right mutual fund involves assessing your financial goals, risk appetite, and the fund's past performance.",
            detailedContent: "# Choosing the Right Mutual Fund\n\nSelecting a mutual fund requires careful consideration. Here's a step-by-step guide:\n\n## 1. Define Your Financial Goals\n\n- **Short-Term**: Goals less than 3 years (e.g., car purchase, vacation).\n- **Medium-Term**: Goals 3-7 years away (e.g., house down payment).\n- **Long-Term**: Goals 7+ years away (e.g., retirement, child's education).\n\n## 2. Assess Your Risk Tolerance\n\n- **Conservative**: Low risk, prefers capital preservation (e.g., Debt Funds).\n- **Moderate**: Balanced risk-reward approach (e.g., Hybrid Funds).\n- **Aggressive**: High risk, seeks high returns (e.g., Equity Funds).\n\n## 3. Analyze Fund Performance\n\n- Look at the fund's **past performance**, but remember it's not a guarantee of future returns.\n- Check the fund's **expense ratio** (the fee charged by the fund).\n- Examine the fund manager's experience and tenure.",
            videoUrl: 'https://example.com/mf-selection.mp4',
            videoTitle: 'How to Pick a Mutual Fund',
            videoDescription: 'Expert tips on selecting the best mutual funds for your portfolio.',
            difficulty: 'intermediate',
            estimatedTime: 25,
            tags: ['mutual-funds', 'strategy', 'selection'],
          },
        ];
        setLearningContent(testData);
      }
    } catch (error) {
      console.error('Error fetching Mutual Funds content:', error);
      Alert.alert(
        'Connection Error',
        `Unable to connect to the server. Showing test data instead.`
      );
      const testData = [
        {
            _id: 'mf-test1',
            title: 'Introduction to Mutual Funds',
            description: "Learn what mutual funds are and how they work.",
            content: "A mutual fund is a professionally managed investment fund that pools money from many investors.",
            detailedContent: "# Introduction to Mutual Funds\n\nMutual funds are a type of professionally managed investment that pools money from many investors to purchase securities like stocks and bonds.\n\n## How Mutual Funds Work\n\n- **Pooling of Funds**: Money from thousands of investors is collected into a single fund.\n- **Professional Management**: A fund manager invests this pool of money on behalf of the investors.\n- **Diversification**: Mutual funds typically hold a wide range of investments, which helps to spread risk.\n- **NAV (Net Asset Value)**: The price of a mutual fund unit is its NAV, calculated daily.\n\n## Types of Mutual Funds\n\n- **Equity Funds**: Invest primarily in stocks.\n- **Debt Funds**: Invest in bonds and other fixed-income securities.\n- **Hybrid Funds**: A mix of both stocks and bonds.\n- **Index Funds**: Track a specific market index like the S&P 500.",
            videoUrl: 'https://example.com/mf-intro.mp4',
            videoTitle: 'What are Mutual Funds? A Complete Guide',
            videoDescription: 'An easy-to-understand explanation of mutual funds for beginners.',
            difficulty: 'beginner',
            estimatedTime: 20,
            tags: ['mutual-funds', 'basics', 'investing', 'portfolio'],
        },
        {
            _id: 'mf-test2',
            title: 'Choosing the Right Mutual Fund',
            description: "A guide to selecting mutual funds based on your goals and risk tolerance.",
            content: "Choosing the right mutual fund involves assessing your financial goals, risk appetite, and the fund's past performance.",
            detailedContent: "# Choosing the Right Mutual Fund\n\nSelecting a mutual fund requires careful consideration. Here's a step-by-step guide:\n\n## 1. Define Your Financial Goals\n\n- **Short-Term**: Goals less than 3 years (e.g., car purchase, vacation).\n- **Medium-Term**: Goals 3-7 years away (e.g., house down payment).\n- **Long-Term**: Goals 7+ years away (e.g., retirement, child's education).\n\n## 2. Assess Your Risk Tolerance\n\n- **Conservative**: Low risk, prefers capital preservation (e.g., Debt Funds).\n- **Moderate**: Balanced risk-reward approach (e.g., Hybrid Funds).\n- **Aggressive**: High risk, seeks high returns (e.g., Equity Funds).\n\n## 3. Analyze Fund Performance\n\n- Look at the fund's **past performance**, but remember it's not a guarantee of future returns.\n- Check the fund's **expense ratio** (the fee charged by the fund).\n- Examine the fund manager's experience and tenure.",
            videoUrl: 'https://example.com/mf-selection.mp4',
            videoTitle: 'How to Pick a Mutual Fund',
            videoDescription: 'Expert tips on selecting the best mutual funds for your portfolio.',
            difficulty: 'intermediate',
            estimatedTime: 25,
            tags: ['mutual-funds', 'strategy', 'selection'],
        },
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
    if (content.videoUrl && content.videoUrl !== 'https://example.com/video.mp4') {
      setSelectedVideo({
        url: content.videoUrl,
        title: content.videoTitle || content.title,
        description: content.videoDescription || content.description
      });
      setViewMode('video');
      setVideoModalVisible(true);
    } else {
      Alert.alert('No Video', 'No valid video is available for this content.');
    }
  };

  const handleBackToList = () => {
    setSelectedContent(null);
    setViewMode('list');
  };

  // NEW: Added the missing function to close the video modal
  const closeVideoModal = () => {
    setVideoModalVisible(false);
    setSelectedVideo(null);
    setViewMode('list');
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
      onRequestClose={closeVideoModal} // Correctly points to the new function
    >
      <View style={styles.videoModalContainer}>
        <View style={styles.videoModalHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={closeVideoModal}>
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoContainer}>
          <View style={styles.videoPlayerPlaceholder}>
            <Text style={styles.videoPlayerIcon}>🎥</Text>
            <Text style={styles.videoPlayerTitle}>Video Player</Text>
            <Text style={styles.videoPlayerSubtitle}>
              {selectedVideo?.title}
            </Text>
            <Text style={styles.videoUrl}>
              URL: {selectedVideo?.url}
            </Text>
            <View style={styles.videoControlsContainer}>
              <TouchableOpacity style={styles.videoControlButton}>
                <Text style={styles.videoControlIcon}>⏮</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.videoPlayButton}>
                <Text style={styles.videoPlayIcon}>▶️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.videoControlButton}>
                <Text style={styles.videoControlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.timeText}>0:00 / 15:30</Text>
            </View>
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
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Loading Mutual Funds content...</Text>
      </View>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>💰 Mutual Funds Learning</Text>
        <Text style={styles.subtitle}>
          Tap a topic to learn more • Tap video icon to watch
        </Text>
        {learningContent.length > 0 && (
          <Text style={styles.contentCount}>
            {learningContent.length} topic{learningContent.length !== 1 ? 's' : ''} available
          </Text>
        )}
        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchMutualFundsContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchMutualFundsContent}>
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
    backgroundColor: '#FFF8F2', // Soft orange background
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#D46D00',
  },
  header: {
    backgroundColor: '#FF9800', // Orange header
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
    backgroundColor: '#FF7043', // Orange-Red button
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#FF7043',
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
    backgroundColor: '#FFF8F2',
  },
  tutorialHeader: {
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
    color: '#FF9800',
    fontWeight: '600',
  },
  headerVideoButton: {
    backgroundColor: '#FF7043',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7043',
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
    backgroundColor: '#FFF3E0', // Lighter orange background
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
    color: '#D46D00',
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
    color: '#FF9800',
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
    color: '#FF9800',
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
    backgroundColor: '#FFCC80', // Lighter orange
    color: '#D46D00', // Darker orange
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
    backgroundColor: '#FFF8F2',
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
    backgroundColor: '#FF9800',
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
    padding: 20,
  },
  videoPlayerPlaceholder: {
    width: width * 0.95,
    height: height * 0.5,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  videoPlayerIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  videoPlayerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  videoPlayerSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  videoUrl: {
    color: '#888',
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  videoControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  videoControlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  videoPlayButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF7043',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
  },
  videoControlIcon: {
    fontSize: 20,
    color: 'white',
  },
  videoPlayIcon: {
    fontSize: 28,
    color: 'white',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    width: '30%',
    height: '100%',
    backgroundColor: '#FF7043',
    borderRadius: 2,
  },
  timeText: {
    color: '#ccc',
    fontSize: 12,
  },
  videoNote: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
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