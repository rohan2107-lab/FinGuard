import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFinanceArticle } from './api'; // Import the new API function
import Icon from 'react-native-vector-icons/FontAwesome'; // You'll need to install this library

// Install vector icons:
// npm install react-native-vector-icons
// For iOS, follow the instructions here: https://github.com/oblador/react-native-vector-icons#ios
// For Android, follow the instructions here: https://github.com/oblador/react-native-vector-icons#android

const ArticleScreen = () => {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Example topics for a dynamic app
  const topics = ['Mutual Funds', 'SIPs', 'Tax Saving', 'Retirement Planning', 'Financial Frauds'];
  const [currentTopic, setCurrentTopic] = useState(topics[0]);

  useEffect(() => {
    fetchArticle(currentTopic);
  }, [currentTopic]);

  const fetchArticle = async (topic) => {
    setIsLoading(true);
    setError('');
    const fetchedArticle = await getFinanceArticle(topic);
    if (fetchedArticle) {
      setArticle(fetchedArticle);
    } else {
      setError('Failed to load article. Please try again.');
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#1E90FF" style={styles.loadingIndicator} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (!article) {
      return null;
    }

    return (
      <View style={styles.articleContainer}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleSummary}>{article.summary}</Text>

        {article.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.keyTakeawaysContainer}>
          <Text style={styles.keyTakeawaysTitle}>Key Takeaways</Text>
          {article.keyTakeaways.map((point, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Icon name="check-circle" size={18} color="#2ECC71" style={styles.bulletIcon} />
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {topics.map(topic => (
          <TouchableOpacity
            key={topic}
            style={[styles.tab, currentTopic === topic && styles.activeTab]}
            onPress={() => setCurrentTopic(topic)}
          >
            <Text style={[styles.tabText, currentTopic === topic && styles.activeTabText]}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Article Content */}
      <ScrollView style={styles.scrollView}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1E90FF',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'red',
  },
  articleContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  articleSummary: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  keyTakeawaysContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
  },
  keyTakeawaysTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 10,
    marginTop: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
});

export default ArticleScreen;