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

export default function TaxPlanningModule() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'tutorial', 'video'

  const API_BASE_URL = 'http://10.172.41.93:8000';

  useEffect(() => {
    fetchTaxPlanningContent();
  }, []);

  const fetchTaxPlanningContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching Tax Planning content from:', `${API_BASE_URL}/api/financial/tax-planning`);

      const response = await fetch(`${API_BASE_URL}/api/financial/tax-planning`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch Tax Planning content: ${response.status} ${response.statusText}`);
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
            _id: 'tax-test1',
            title: 'Understanding Income Tax Basics',
            description: "A beginner's guide to how income tax works and what it means for you.",
            content: "Income tax is a mandatory contribution to the government from your earnings. Learn the basics of how it is calculated.",
            detailedContent: "# Understanding Income Tax Basics\n\nIncome tax is a tax imposed on the income of individuals or corporations. In simple terms, it's a portion of your earnings that you pay to the government.\n\n## Key Concepts\n\n- **Taxable Income**: This is the portion of your gross income that is subject to taxation after deductions and exemptions.\n- **Tax Slabs**: The income tax system is progressive, meaning higher earners pay a higher percentage of tax. These different tax brackets are known as tax slabs.\n- **Deductions**: Expenses or investments that can be subtracted from your gross income to lower your taxable income (e.g., investments under Section 80C).\n- **Exemptions**: Incomes that are not included in your taxable income (e.g., House Rent Allowance in some cases).\n\n## How to Calculate Your Tax\n\n1. **Determine your Gross Total Income**: Add up all income sources (salary, business, investments, etc.).\n2. **Subtract Exemptions and Deductions**: Use available sections like 80C, 80D, etc., to reduce your taxable income.\n3. **Apply the Correct Tax Slab**: Use the current year's tax slabs to calculate the final tax amount on your remaining income.\n\n*Disclaimer*: Tax laws are complex and subject to change. Always consult a professional financial advisor for personalized tax advice.",
            videoUrl: 'https://example.com/tax-basics.mp4',
            videoTitle: 'Income Tax Explained for Beginners',
            videoDescription: 'A simple guide to understanding the fundamentals of income tax.',
            difficulty: 'beginner',
            estimatedTime: 20,
            tags: ['tax', 'income-tax', 'basics', 'beginners'],
          },
          {
            _id: 'tax-test2',
            title: 'Common Tax-Saving Investments',
            description: "Explore popular investment options that help you reduce your tax liability.",
            content: "Tax-saving investments are financial instruments that allow you to claim deductions on your income tax.",
            detailedContent: "# Common Tax-Saving Investments\n\nTax planning is an essential part of financial management. Here are some popular investment options that can help you save on taxes:\n\n## Section 80C Deductions\n\nThis is one of the most widely used sections for tax deductions, allowing a maximum deduction of up to ₹1.5 lakh per year. Common instruments include:\n\n- **EPF/PPF**: Employee Provident Fund and Public Provident Fund are safe, long-term options.\n- **ELSS**: Equity-Linked Savings Schemes are mutual funds with a 3-year lock-in period.\n- **Life Insurance Premiums**: Premiums paid for a life insurance policy are eligible for deduction.\n- **Home Loan Principal Repayment**: The principal amount of your home loan can be deducted.\n\n## Other Important Sections\n\n- **Section 80D**: Deductions for health insurance premiums.\n- **Section 80E**: Deductions for interest paid on an education loan.\n- **Section 24**: Deductions for interest on a home loan.\n\nBy strategically using these tax-saving options, you can significantly reduce your tax burden while building your wealth.",
            videoUrl: 'https://example.com/tax-investments.mp4',
            videoTitle: 'Smart Tax Saving Strategies',
            videoDescription: 'A guide to tax-saving investments and how to choose the right ones.',
            difficulty: 'intermediate',
            estimatedTime: 25,
            tags: ['tax', 'investing', 'tax-saving', '80C'],
          },
        ];
        setLearningContent(testData);
      }
    } catch (error) {
      console.error('Error fetching Tax Planning content:', error);
      Alert.alert(
        'Connection Error',
        `Unable to connect to the server. Showing test data instead.`
      );
      const testData = [
        {
          _id: 'tax-test1',
          title: 'Understanding Income Tax Basics',
          description: "A beginner's guide to how income tax works and what it means for you.",
          content: "Income tax is a mandatory contribution to the government from your earnings. Learn the basics of how it is calculated.",
          detailedContent: "# Understanding Income Tax Basics\n\nIncome tax is a tax imposed on the income of individuals or corporations. In simple terms, it's a portion of your earnings that you pay to the government.\n\n## Key Concepts\n\n- **Taxable Income**: This is the portion of your gross income that is subject to taxation after deductions and exemptions.\n- **Tax Slabs**: The income tax system is progressive, meaning higher earners pay a higher percentage of tax. These different tax brackets are known as tax slabs.\n- **Deductions**: Expenses or investments that can be subtracted from your gross income to lower your taxable income (e.g., investments under Section 80C).\n- **Exemptions**: Incomes that are not included in your taxable income (e.g., House Rent Allowance in some cases).\n\n## How to Calculate Your Tax\n\n1. **Determine your Gross Total Income**: Add up all income sources (salary, business, investments, etc.).\n2. **Subtract Exemptions and Deductions**: Use available sections like 80C, 80D, etc., to reduce your taxable income.\n3. **Apply the Correct Tax Slab**: Use the current year's tax slabs to calculate the final tax amount on your remaining income.\n\n*Disclaimer*: Tax laws are complex and subject to change. Always consult a professional financial advisor for personalized tax advice.",
          videoUrl: 'https://example.com/tax-basics.mp4',
          videoTitle: 'Income Tax Explained for Beginners',
          videoDescription: 'A simple guide to understanding the fundamentals of income tax.',
          difficulty: 'beginner',
          estimatedTime: 20,
          tags: ['tax', 'income-tax', 'basics', 'beginners'],
        },
        {
          _id: 'tax-test2',
          title: 'Common Tax-Saving Investments',
          description: "Explore popular investment options that help you reduce your tax liability.",
          content: "Tax-saving investments are financial instruments that allow you to claim deductions on your income tax.",
          detailedContent: "# Common Tax-Saving Investments\n\nTax planning is an essential part of financial management. Here are some popular investment options that can help you save on taxes:\n\n## Section 80C Deductions\n\nThis is one of the most widely used sections for tax deductions, allowing a maximum deduction of up to ₹1.5 lakh per year. Common instruments include:\n\n- **EPF/PPF**: Employee Provident Fund and Public Provident Fund are safe, long-term options.\n- **ELSS**: Equity-Linked Savings Schemes are mutual funds with a 3-year lock-in period.\n- **Life Insurance Premiums**: Premiums paid for a life insurance policy are eligible for deduction.\n- **Home Loan Principal Repayment**: The principal amount of your home loan can be deducted.\n\n## Other Important Sections\n\n- **Section 80D**: Deductions for health insurance premiums.\n- **Section 80E**: Deductions for interest paid on an education loan.\n- **Section 24**: Deductions for interest on a home loan.\n\nBy strategically using these tax-saving options, you can significantly reduce your tax burden while building your wealth.",
          videoUrl: 'https://example.com/tax-investments.mp4',
          videoTitle: 'Smart Tax Saving Strategies',
          videoDescription: 'A guide to tax-saving investments and how to choose the right ones.',
          difficulty: 'intermediate',
          estimatedTime: 25,
          tags: ['tax', 'investing', 'tax-saving', '80C'],
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
      onRequestClose={closeVideoModal}
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
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading Tax Planning content...</Text>
      </View>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>🗓️ Tax Planning</Text>
        <Text style={styles.subtitle}>
          Tap a topic to learn more • Tap video icon to watch
        </Text>
        {learningContent.length > 0 && (
          <Text style={styles.contentCount}>
            {learningContent.length} topic{learningContent.length !== 1 ? 's' : ''} available
          </Text>
        )}
        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchTaxPlanningContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchTaxPlanningContent}>
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
    backgroundColor: '#F3E5F5', // Soft purple background
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6A1B9A',
  },
  header: {
    backgroundColor: '#6A1B9A', // Purple header
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
    backgroundColor: '#8E24AA', // Purple video button
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#8E24AA',
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
    backgroundColor: '#F3E5F5',
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
    color: '#6A1B9A',
    fontWeight: '600',
  },
  headerVideoButton: {
    backgroundColor: '#8E24AA',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8E24AA',
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
    backgroundColor: '#EDE7F6', // Lighter purple background
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
    color: '#6A1B9A',
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
    color: '#6A1B9A',
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
    color: '#6A1B9A',
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
    backgroundColor: '#D1C4E9', // Lighter purple
    color: '#4527A0', // Darker purple
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
    backgroundColor: '#F3E5F5',
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
    backgroundColor: '#6A1B9A',
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
    backgroundColor: '#8E24AA',
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
    backgroundColor: '#8E24AA',
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