import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../../components/BottomNavigation';
import { Color, FontFamily, FontSize } from '../../constants/GlobleStyle';
import { useNavigation } from '@react-navigation/native';
import TipModal from '../../components/TipModal';
import ChatbotBubble from '../../components/ChatbotBubble';
import CardSwitcher from '../../components/CardSwitcher';

const { width } = Dimensions.get('window');


const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigation = useNavigation();
  const [showTipModal, setShowTipModal] = useState(false);
  const [fullName, setFullname] = useState('');
  const [loading, setLoading] = useState(true);

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const blinkingAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

   const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return ('Good Morning 🌄');
    if (hour < 17) return ('Good Afternoon ☀️');
    return ('Good Evening 🌙');
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // token saved after login
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }

        const res = await fetch('http://10.20.106.48:8000/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setFullname(data.fullName); // assuming backend sends { username: "Rahul" }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(blinkingAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: showAllFeatures ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();
  }, [showAllFeatures]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const allFeatures = [
    {
      id: 1,
      title: 'Budgeting',
      searchTerms: ['budget', 'budgeting', 'expense', 'money management', 'spending'],
      icon: '💰',
      color: '#4A90E2',
      gradient: ['#4A90E2', '#357ABD'],
      description: 'Manage your budget and track expenses',
      route: 'Budgeting'
    },
    {
      id: 2,
      title: 'Fraud Simulation',
      searchTerms: ['fraud', 'security', 'simulation', 'scam', 'protection', 'safety'],
      icon: '🔐',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#EE5A52'],
      description: 'Learn about fraud protection',
      route: 'FraudSimulation'
    },
    {
      id: 3,
      title: 'Goal Tracker',
      searchTerms: ['goal', 'tracker', 'target', 'achievement', 'progress', 'planning'],
      icon: '⏰',
      color: '#4ECDC4',
      gradient: ['#4ECDC4', '#44A08D'],
      description: 'Track your financial goals',
      route: 'GoalTracker'
    },
    {
      id: 4,
      title: 'Games',
      searchTerms: ['games', 'play', 'fun', 'entertainment', 'learning games'],
      icon: '🎮',
      color: '#7B68EE',
      gradient: ['#7B68EE', '#6A5ACD'],
      description: 'Educational financial games',
      route: 'GamesSplash'
    },
    {
      id: 5,
      title: 'Financial Calculators',
      searchTerms: ['calculator', 'calculation', 'finance', 'math', 'compute', 'calculate'],
      icon: '🧮',
      color: '#45B7D1',
      gradient: ['#45B7D1', '#3A9BC1'],
      description: 'Financial calculation tools',
      route: 'FinancialCalculator'
    },
    {
      id: 6,
      title: 'Gifts',
      searchTerms: ['gifts', 'rewards', 'present', 'bonus', 'earn'],
      icon: '🎁',
      color: '#F39C12',
      gradient: ['#F39C12', '#E67E22'],
      description: 'Redeem gifts and rewards',
      route: 'Gifts'
    },
    {
      id: 7,
      title: 'Investment Basics',
      searchTerms: ['investment', 'invest', 'stocks', 'basics', 'learning', 'finance'],
      icon: '📈',
      color: '#27AE60',
      gradient: ['#27AE60', '#229954'],
      description: 'Learn investment fundamentals',
      route: 'InvestmentBasics'
    },
    {
      id: 8,
      title: 'Emergency Help',
      searchTerms: ['emergency', 'help', 'support', 'assistance', 'urgent', 'crisis'],
      icon: '🚨',
      color: '#E74C3C',
      gradient: ['#E74C3C', '#C0392B'],
      description: 'Get emergency financial help',
      route: 'EmergencyHelp'
    },
  ];

  // Learning card data
  const learningCards = [
    { id: '1', title: 'Finance Basics', icon: '💵', color: '#4A90E2', route: 'FinanceTutorial' },
    { id: '2', title: 'SIP Learning', icon: '📊', color: '#27AE60', route: 'SIPTutorial' },
    { id: '3', title: 'Mutual Funds', icon: '📈', color: '#F39C12', route: 'MutualFundsTutorial' },
    { id: '4', title: 'Fraud Awareness', icon: '🕵️‍♂️', color: '#E74C3C', route: 'FraudTutorial' },
    { id: '5', title: 'Tax Planning', icon: '🧾', color: '#9B59B6', route: 'TaxTutorial' },
  ];

  const mainFeatures = allFeatures.filter(feature => [1, 4].includes(feature.id));
  const additionalFeatures = allFeatures.filter(feature => ![1, 4].includes(feature.id));

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lowercaseQuery = query.toLowerCase();
    
    const results = allFeatures.filter(feature => 
      feature.title.toLowerCase().includes(lowercaseQuery) ||
      feature.searchTerms.some(term => term.toLowerCase().includes(lowercaseQuery)) ||
      feature.description.toLowerCase().includes(lowercaseQuery)
    );
    
    setSearchResults(results);
  };

  const handleFeaturePress = (feature) => {
    // Clear search when navigating
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    
    if (feature.route) {
      navigation.navigate(feature.route);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const renderFeatureCard = (feature, index = 0) => (
    <Pressable
      key={feature.id}
      style={[styles.featureCard, { 
        transform: [{ scale: 1 }] 
      }]}
      onPress={() => handleFeaturePress(feature)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true }}
    >
      <Animated.View 
        style={[
          styles.featureIconContainer, 
          { 
            backgroundColor: feature.color,
            shadowColor: feature.color,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }
        ]}
      >
        <Text style={styles.featureIcon}>{feature.icon}</Text>
      </Animated.View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
    </Pressable>
  );

  const renderSearchResult = ({ item }) => (
    <Pressable
      style={styles.searchResultItem}
      onPress={() => handleFeaturePress(item)}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={[styles.searchResultIcon, { backgroundColor: item.color }]}>
        <Text style={styles.searchResultIconText}>{item.icon}</Text>
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultDescription}>{item.description}</Text>
      </View>
      <Text style={styles.searchResultArrow}>→</Text>
    </Pressable>
  );

  const renderViewMoreButton = () => (
    <Pressable
      style={styles.viewMoreCard}
      onPress={() => setShowAllFeatures(!showAllFeatures)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true }}
    >
      <Animated.View style={[
        styles.featureIconContainer, 
        { 
          backgroundColor: showAllFeatures ? '#E67E22' : '#3498DB',
          shadowColor: showAllFeatures ? '#E67E22' : '#3498DB',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          transform: [{ 
            rotate: expandAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg']
            }) 
          }]
        }
      ]}>
        <Text style={styles.featureIcon}>
          {showAllFeatures ? '↑' : '↓'}
        </Text>
      </Animated.View>
      <Text style={styles.featureTitle}>
        {showAllFeatures ? 'View Less' : 'View More'}
      </Text>
    </Pressable>
  );

  const renderViewLessButton = () => (
    <Pressable
      style={styles.viewLessButton}
      onPress={() => setShowAllFeatures(false)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true }}
    >
      <View style={styles.viewLessContent}>
        <Text style={styles.viewLessText}>View Less</Text>
        <Text style={styles.viewLessIcon}>↑</Text>
      </View>
    </Pressable>
  );

  return (
      <SafeAreaView style={styles.container}>
      {/* Enhanced Top Section */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {('hi')}, {fullName ? fullName : ('guest')}
            </Text>
            <Text style={styles.subGreeting}>{getTimeGreeting()} </Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>


        {/* Enhanced Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={styles.statLabel}>Today's Earn</Text>
            <Text style={styles.statValue}>00000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>Total Rewards</Text>
            <Text style={styles.statValue}>00000</Text>
          </View>
        </View>

        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search features..."
              placeholderTextColor={Color.colorGray}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Search Results Overlay */}
      {isSearching && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchResultsContainer}>
            {searchResults.length > 0 ? (
              <>
                <Text style={styles.searchResultsHeader}>
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for "budget", "games", "calculator", etc.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Scrollable Main Content Area - Hidden when searching */}
      {!isSearching && (
        <ScrollView 
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Main Features Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.featuresGrid}>
              {mainFeatures.map((feature, index) => renderFeatureCard(feature, index))}
              {renderViewMoreButton()}
            </View>
          </View>

          {/* Additional Features with Animation */}
          <Animated.View
            style={[
              styles.additionalFeaturesContainer,
              {
                maxHeight: expandAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000],
                }),
                opacity: expandAnim,
              },
            ]}
          >
            {showAllFeatures && (
              <>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>All Features</Text>
                  <View style={styles.additionalFeaturesGrid}>
                    {additionalFeatures.map((feature, index) => renderFeatureCard(feature, index))}
                  </View>
                  {renderViewLessButton()}
                </View>
              </>
            )}
          </Animated.View>

          {/* Tips of the Day */}
          <View style={styles.tipsSection}>
            <Pressable style={styles.tipsMiniCard} onPress={() => setShowTipModal(true)}>
              <Text style={styles.tipsMiniText}>Tips of the Day</Text>
              <Animated.Text
                style={[
                  styles.blinkingIcon,
                  {
                    opacity: blinkingAnim,
                  },
                ]}
              >
                💡
              </Animated.Text>
            </Pressable>
          </View>

          <TipModal visible={showTipModal} onClose={() => setShowTipModal(false)} userName={fullName} />

          {/* Learning Tutorials */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>      Learn & Grow</Text>
            <FlatList
              data={learningCards}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.learningCard, { backgroundColor: item.color }]}
                  onPress={() => navigation.navigate(item.route)}
                >
                  <Text style={styles.learningIcon}>{item.icon}</Text>
                  <Text style={styles.learningTitle}>{item.title}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={(width - 60) / 2 + 16}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </View>

          {/* Card Switcher */}
          <View style={styles.cardSwitcherContainer}>
            <CardSwitcher />
          </View>
        </ScrollView>
      )}

      <ChatbotBubble />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  topSection: {
    backgroundColor: Color.colorMediumseagreen,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorGray200,
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: FontFamily.leagueSpartanRegular,
    color: Color.colorGray200,
    opacity: 0.9,
  },
  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Color.colorHoneydew,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationIcon: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Color.colorHoneydew,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 2,
    backgroundColor: Color.colorWhite,
    marginHorizontal: 12,
    borderRadius: 1,
  },
  statIcon: {
    fontSize: 15,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorDarkslategray,
    textAlign: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorDarkslategray,
    textAlign: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: Color.colorHoneydew,
    borderRadius: 20,
    width: '100%',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.colorGhostwhite,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '90%',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FontFamily.robotoRegular,
    color: Color.colorGray100,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: Color.colorGray,
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  searchResultsContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  searchResultsHeader: {
    fontSize: 16,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorDarkslategray,
    marginBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  searchResultIconText: {
    fontSize: 20,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorDarkslategray,
    marginBottom: 4,
  },
  searchResultDescription: {
    fontSize: 13,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray,
  },
  searchResultArrow: {
    fontSize: 18,
    color: Color.colorGray,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorDarkslategray,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorDarkslategray,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  additionalFeaturesContainer: {
    overflow: 'hidden',
  },
  additionalFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
    borderRadius: 16,
  },
  viewMoreCard: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
    borderRadius: 16,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 12,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorDarkslategray,
    textAlign: 'center',
    lineHeight: 16,
  },
  viewLessButton: {
    alignSelf: 'center',
    backgroundColor: '#E67E22',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#E67E22',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  viewLessContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLessText: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsSemiBold,
    color: 'white',
    marginRight: 8,
  },
  viewLessIcon: {
    fontSize: 16,
    color: 'white',
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tipsMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginLeft: 5,
  },
  tipsMiniText: {
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    color: '#003366',
    marginRight: 8,
  },
  blinkingIcon: {
    fontSize: 18,
  },
  cardSwitcherContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // Learning tutorial styles
  learningCard: {
    width: (width - 60) / 2,
    height: 140,
    borderRadius: 16,
    marginRight: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  learningIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  learningTitle: {
    fontSize: 14,
    fontFamily: FontFamily.poppinsSemiBold,
    color: 'white',
    textAlign: 'center',
  },
});

export default Home;