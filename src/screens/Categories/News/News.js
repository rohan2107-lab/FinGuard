import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFinancialNews } from './newsApi';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const newsTopics = [
  'Digital Fraud',
  'RBI News & Updates',
  'PSB News',
  'New Tax Policy',
  'Government Schemes',
  'Loan News'
];

const NewsScreen = () => {
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(newsTopics[0]);

  const scaleValue = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchNews(currentTopic);
  }, [currentTopic]);

  const fetchNews = async (topic) => {
    setIsLoading(true);
    setError('');
    setExpandedArticle(null);

    const fetchedNews = await getFinancialNews(topic);
    if (fetchedNews && fetchedNews.articles) {
      setNews(fetchedNews);
    } else {
      setError('Failed to fetch news. Please try again.');
    }
    setIsLoading(false);
  };

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedArticle(expandedArticle === index ? null : index);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (topic) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    setCurrentTopic(topic);
  };

  const renderNewsContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#2E8B57" style={styles.loadingIndicator} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (!news || !news.articles || !news.articles.length) {
      return <Text style={styles.noNewsText}>No news available for this topic.</Text>;
    }

    return (
      <View>
        <Text style={styles.digestTitle}>{news.title}</Text>
        {news.articles.map((article, index) => (
          <View key={index} style={styles.articleCard}>
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={[
                styles.header,
                expandedArticle === index && styles.expandedHeader
              ]}
            >
              <View style={styles.titleContainer}>
                <Icon
                  name={expandedArticle === index ? "minus" : "plus"}
                  size={16}
                  color={expandedArticle === index ? "#FFFFFF" : "#2E8B57"}
                  style={styles.toggleIcon}
                />
                <Text
                  style={[
                    styles.articleTitle,
                    expandedArticle === index && styles.expandedArticleTitle
                  ]}
                >
                  {article.articleTitle}
                </Text>
              </View>
              <Text
                style={[
                  styles.articleSource,
                  expandedArticle === index && styles.expandedArticleSource
                ]}
              >
                {article.source} • {article.date}
              </Text>
            </TouchableOpacity>

            {expandedArticle === index && (
              <View style={styles.detailsContainer}>
                <Text style={styles.summaryText}>{article.summary}</Text>
                <Text style={styles.detailsText}>{article.details}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.topicTabsContainer}>
        {newsTopics.map(topic => (
          <Animated.View
            key={topic}
            style={[
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={handlePressIn}
              onPressOut={() => handlePressOut(topic)}
              style={[
                styles.tab,
                currentTopic === topic && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  currentTopic === topic && styles.activeTabText,
                ]}
              >
                {topic}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        {renderNewsContent()}
      </ScrollView>
    </View>
  );
};
// #F0F5F0
const styles = StyleSheet.create({
  screenContainer: {
    flex: 0,
    backgroundColor: '#F0F5F0',
  },
  topicTabsContainer: {
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0EAE0',
    minHeight: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tab: {
    paddingVertical: 10, // Reduced vertical padding
    paddingHorizontal: 15, // Reduced horizontal padding
    borderRadius: 20,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#2E8B57',
  },
  tabText: {
    fontSize: 12, // Reduced font size for better fit
    color: '#333',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#B22222',
  },
  noNewsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  digestTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  expandedHeader: {
    backgroundColor: '#3CB371',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  toggleIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    color: '#333',
  },
  expandedArticleTitle: {
    color: '#FFFFFF',
  },
  articleSource: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginLeft: 25,
  },
  expandedArticleSource: {
    color: '#E0E0E0',
  },
  detailsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0EAE0',
  },
  summaryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default NewsScreen;