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
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../utils/translations';
import { appAxios } from '../../api/apiconfig';
import LottieView from "lottie-react-native";


const { width } = Dimensions.get('window');

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigation = useNavigation();
  const [showTipModal, setShowTipModal] = useState(false);
  const [fullName, setFullname] = useState('');
  const [loading, setLoading] = useState(true);

  // Get language context
  const { currentLanguage } = useLanguage();

  // Get translations for current language
  const homeTranslations = translations.home[currentLanguage] || translations.home.english;
  const commonTranslations = translations.common[currentLanguage] || translations.common.english;

  const blinkingAnim = useRef(new Animated.Value(0)).current;
  const expandAnim = useRef(new Animated.Value(0)).current;

  // --- API Call and Data Fetching ---
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      } : { timeout: 10000 };

      const response = await appAxios.get('/api/auth/me', config);
      console.log("Profile API Response:", response.data);

      const apiData = response.data;
      if (apiData?.success && apiData?.data?.fullName) {
        setFullname(apiData.data.fullName);
      } else {
        throw new Error(apiData?.message || 'Failed to fetch profile or full name missing.');
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setFullname('Guest'); // Fallback to 'Guest' on error
    } finally {
      setLoading(false); // Always set loading to false after the fetch attempt
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // --- Animations ---
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
  }, [blinkingAnim]);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: showAllFeatures ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
    }).start();
  }, [showAllFeatures, expandAnim]);
  
  // --- Helper Functions ---
  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (currentLanguage === 'hindi') {
      if (hour < 12) return ('शुभ प्रभात 🌄');
      if (hour < 17) return ('शुभ दोपहर ☀️');
      return ('शुभ संध्या 🌙');
    } else if (currentLanguage === 'punjabi') {
      if (hour < 12) return ('ਸ਼ੁਭ ਸਵੇਰ 🌄');
      if (hour < 17) return ('ਸ਼ੁਭ ਦੁਪਹਿਰ ☀️');
      return ('ਸ਼ੁਭ ਸ਼ਾਮ 🌙');
    } else {
      if (hour < 12) return ('Good Morning 🌄');
      if (hour < 17) return ('Good Afternoon ☀️');
      return ('Good Evening 🌙');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);
    
    const lowercaseQuery = query.toLowerCase();
    
    const allSearchableContent = [
      ...allFeatures.map(feature => ({ ...feature, type: 'feature' })),
      ...learningCards.map(card => ({ ...card, type: 'learning', searchTerms: card.searchTerms || [], category: 'Learning' }))
    ];

    const results = allSearchableContent.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowercaseQuery);
      const descriptionMatch = item.description && item.description.toLowerCase().includes(lowercaseQuery);
      const categoryMatch = item.category && item.category.toLowerCase().includes(lowercaseQuery);
      const searchTermsMatch = item.searchTerms && item.searchTerms.some(term => 
        term.toLowerCase().includes(lowercaseQuery) || 
        lowercaseQuery.includes(term.toLowerCase())
      );
      
      const queryWords = lowercaseQuery.split(' ').filter(word => word.length > 2);
      const fuzzyMatch = queryWords.some(word => 
        item.title.toLowerCase().includes(word) ||
        (item.searchTerms && item.searchTerms.some(term => term.toLowerCase().includes(word)))
      );
      
      return titleMatch || descriptionMatch || categoryMatch || searchTermsMatch || fuzzyMatch;
    });
    
    const sortedResults = results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      if (aTitle.includes(lowercaseQuery) && !bTitle.includes(lowercaseQuery)) return -1;
      if (!aTitle.includes(lowercaseQuery) && bTitle.includes(lowercaseQuery)) return 1;
      
      return aTitle.length - bTitle.length;
    });
    
    setSearchResults(sortedResults);
  };

  const handleFeaturePress = (feature) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setShowSearchResults(false);
    
    if (feature.route) {
      navigation.navigate(feature.route);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    setShowSearchResults(false);
  };

  // --- Data Declarations ---
  const allFeatures = [
    { id: 1, title: currentLanguage === 'hindi' ? 'बजटिंग' : currentLanguage === 'punjabi' ? 'ਬਜਟਿੰਗ' : 'Budgeting', searchTerms: ['budget', 'budgeting', 'expense', 'money management', 'spending', 'track expenses', 'financial planning', 'manage money', 'cost control'], icon: '💰', color: '#4A90E2', gradient: ['#4A90E2', '#357ABD'], description: currentLanguage === 'hindi' ? 'अपना बजट प्रबंधित करें और खर्चों को ट्रैक करें' : currentLanguage === 'punjabi' ? 'ਆਪਣਾ ਬਜਟ ਪ੍ਰਬੰਧਿਤ ਕਰੋ ਅਤੇ ਖਰਚਿਆਂ ਨੂੰ ਟਰੈਕ ਕਰੋ' : 'Manage your budget and track expenses', route: 'Budgeting', category: 'Financial Management' },
    { id: 2, title: currentLanguage === 'hindi' ? 'धोखाधड़ी सिमुलेशन' : currentLanguage === 'punjabi' ? 'ਧੋਖਾਧੜੀ ਸਿਮੁਲੇਸ਼ਨ' : 'Fraud Simulation', searchTerms: ['fraud', 'security', 'simulation', 'scam', 'protection', 'safety', 'cyber security', 'phishing', 'identity theft', 'online safety'], icon: '🔐', color: '#FF6B6B', gradient: ['#FF6B6B', '#EE5A52'], description: currentLanguage === 'hindi' ? 'धोखाधड़ी सुरक्षा और सुरक्षा के बारे में जानें' : currentLanguage === 'punjabi' ? 'ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ ਅਤੇ ਸੁਰੱਖਿਆ ਬਾਰੇ ਜਾਣੋ' : 'Learn about fraud protection and security', route: 'FraudSimulation', category: 'Security' },
    { id: 3, title: currentLanguage === 'hindi' ? 'लक्ष्य ट्रैकर' : currentLanguage === 'punjabi' ? 'ਟੀਚਾ ਟਰੈਕਰ' : 'Goal Tracker', searchTerms: ['goal', 'tracker', 'target', 'achievement', 'progress', 'planning', 'objectives', 'milestones', 'personal goals'], icon: '⏰', color: '#4ECDC4', gradient: ['#4ECDC4', '#44A08D'], description: currentLanguage === 'hindi' ? 'अपने वित्तीय और व्यक्तिगत लक्ष्यों को ट्रैक करें' : currentLanguage === 'punjabi' ? 'ਆਪਣੇ ਵਿੱਤੀ ਅਤੇ ਨਿੱਜੀ ਟੀਚਿਆਂ ਨੂੰ ਟਰੈਕ ਕਰੋ' : 'Track your financial and personal goals', route: 'GoalTracker', category: 'Planning' },
    { id: 4, title: currentLanguage === 'hindi' ? 'खेल' : currentLanguage === 'punjabi' ? 'ਖੇਡਾਂ' : 'Games', searchTerms: ['games', 'play', 'fun', 'entertainment', 'learning games', 'educational games', 'quiz', 'interactive'], icon: '🎮', color: '#7B68EE', gradient: ['#7B68EE', '#6A5ACD'], description: currentLanguage === 'hindi' ? 'शैक्षिक वित्तीय खेल और गतिविधियां' : currentLanguage === 'punjabi' ? 'ਵਿਦਿਅਕ ਵਿੱਤੀ ਖੇਡਾਂ ਅਤੇ ਗਤੀਵਿਧੀਆਂ' : 'Educational financial games and activities', route: 'GamesSplash', category: 'Entertainment' },
    { id: 5, title: currentLanguage === 'hindi' ? 'वित्तीय कैलकुलेटर' : currentLanguage === 'punjabi' ? 'ਵਿੱਤੀ ਕੈਲਕੁਲੇਟਰ' : 'Financial Tools', searchTerms: ['calculator', 'calculation', 'finance', 'math', 'compute', 'calculate', 'interest', 'loan', 'mortgage', 'investment calculator'], icon: '🧮', color: '#45B7D1', gradient: ['#45B7D1', '#3A9BC1'], description: currentLanguage === 'hindi' ? 'वित्तीय गणना उपकरण और कैलकुलेटर' : currentLanguage === 'punjabi' ? 'ਵਿੱਤੀ ਗਣਨਾ ਟੂਲ ਅਤੇ ਕੈਲਕੁਲੇਟਰ' : 'Financial calculation tools and calculators', route: 'FinancialCalculator', category: 'Tools' },
    { id: 6, title: currentLanguage === 'hindi' ? 'उपहार' : currentLanguage === 'punjabi' ? 'ਤੋਹਫ਼ੇ' : 'Gifts', searchTerms: ['gifts', 'rewards', 'present', 'bonus', 'earn', 'redeem', 'points', 'cashback', 'incentives'], icon: '🎁', color: '#F39C12', gradient: ['#F39C12', '#E67E22'], description: currentLanguage === 'hindi' ? 'अपनी गतिविधियों से उपहार और पुरस्कार प्राप्त करें' : currentLanguage === 'punjabi' ? 'ਆਪਣੀਆਂ ਗਤੀਵਿਧੀਆਂ ਤੋਂ ਤੋਹਫ਼ੇ ਅਤੇ ਇਨਾਮ ਪ੍ਰਾਪਤ ਕਰੋ' : 'Redeem gifts and rewards from your activities', route: 'Gifts', category: 'Rewards' },
    { id: 7, title: currentLanguage === 'hindi' ? 'निवेश की मूल बातें' : currentLanguage === 'punjabi' ? 'ਨਿਵੇਸ਼ ਦੀਆਂ ਬੁਨਿਆਦੀ ਗੱਲਾਂ' : 'Investment Basics', searchTerms: ['investment', 'invest', 'stocks', 'basics', 'learning', 'finance', 'portfolio', 'trading', 'mutual funds', 'shares'], icon: '📈', color: '#27AE60', gradient: ['#27AE60', '#229954'], description: currentLanguage === 'hindi' ? 'निवेश के मूल सिद्धांतों और रणनीतियों को सीखें' : currentLanguage === 'punjabi' ? 'ਨਿਵੇਸ਼ ਦੇ ਬੁਨਿਆਦੀ ਸਿਧਾਂਤਾਂ ਅਤੇ ਰਣਨੀਤੀਆਂ ਨੂੰ ਸਿੱਖੋ' : 'Learn investment fundamentals and strategies', route: 'InvestmentBasics', category: 'Learning' },
    { id: 8, title: currentLanguage === 'hindi' ? 'आपातकालीन सहायता' : currentLanguage === 'punjabi' ? 'ਐਮਰਜੈਂਸੀ ਮਦਦ' : 'Emergency Help', searchTerms: ['emergency', 'help', 'support', 'assistance', 'urgent', 'crisis', 'financial emergency', 'quick help'], icon: '🚨', color: '#E74C3C', gradient: ['#E74C3C', '#C0392B'], description: currentLanguage === 'hindi' ? 'आपातकालीन वित्तीय सहायता और समर्थन प्राप्त करें' : currentLanguage === 'punjabi' ? 'ਐਮਰਜੈਂਸੀ ਵਿੱਤੀ ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ' : 'Get emergency financial help and support', route: 'EmergencyHelp', category: 'Support' },
    // New Articles module
    { id: 9, title: currentLanguage === 'hindi' ? 'लेख' : currentLanguage === 'punjabi' ? 'ਲੇਖ' : 'Articles', searchTerms: ['articles', 'read', 'blog', 'content', 'learning', 'financial articles', 'education', 'insights', 'knowledge'], icon: '📰', color: '#9B59B6', gradient: ['#9B59B6', '#8E44AD'], description: currentLanguage === 'hindi' ? 'वित्तीय लेख और शिक्षाप्रद सामग्री पढ़ें' : currentLanguage === 'punjabi' ? 'ਵਿੱਤੀ ਲੇਖ ਅਤੇ ਵਿਦਿਅਕ ਸਮਗਰੀ ਪੜ੍ਹੋ' : 'Read financial articles and educational content', route: 'Articles', category: 'Education' },
    // New News module
    { id: 10, title: currentLanguage === 'hindi' ? 'समाचार' : currentLanguage === 'punjabi' ? 'ਖ਼ਬਰਾਂ' : 'News', searchTerms: ['news', 'updates', 'latest', 'current', 'financial news', 'market news', 'breaking news', 'headlines'], icon: '📺', color: '#E67E22', gradient: ['#E67E22', '#D35400'], description: currentLanguage === 'hindi' ? 'नवीनतम वित्तीय समाचार और अपडेट देखें' : currentLanguage === 'punjabi' ? 'ਨਵੀਨਤਮ ਵਿੱਤੀ ਖ਼ਬਰਾਂ ਅਤੇ ਅਪਡੇਟ ਵੇਖੋ' : 'Get latest financial news and updates', route: 'News', category: 'News & Updates' },
    // --- NEW MODULE ADDED HERE ---
    { id: 11, title: currentLanguage === 'hindi' ? 'निकटतम शाखा' : currentLanguage === 'punjabi' ? 'ਨੇੜਲੀ ਬ੍ਰਾਂਚ' : 'Nearby Branch', searchTerms: ['branch', 'bank', 'location', 'nearby', 'atm', 'office', 'service center', 'find branch'], icon: '📍', color: '#3498DB', gradient: ['#3498DB', '#2980B9'], description: currentLanguage === 'hindi' ? 'हमारे निकटतम शाखा का पता लगाएं' : currentLanguage === 'punjabi' ? 'ਸਾਡੇ ਨੇੜਲੀਆਂ ਬ੍ਰਾਂਚਾਂ ਨੂੰ ਲੱਭੋ' : 'Locate our nearest branch', route: 'BranchLocator', category: 'Support' },
  ];

  const learningCards = [
    { id: '1', title: currentLanguage === 'hindi' ? 'वित्त की मूल बातें' : currentLanguage === 'punjabi' ? 'ਵਿੱਤ ਦੀਆਂ ਬੁਨਿਆਦੀ ਗੱਲਾਂ' : 'Finance Basics', icon: '💵', color: '#4A90E2', route: 'FinanceTutorial', searchTerms: ['finance', 'basics', 'money', 'financial literacy', 'tutorial', 'learning'], description: currentLanguage === 'hindi' ? 'मौलिक वित्तीय अवधारणाओं को सीखें' : currentLanguage === 'punjabi' ? 'ਬੁਨਿਆਦੀ ਵਿੱਤੀ ਧਾਰਨਾਵਾਂ ਸਿੱਖੋ' : 'Learn fundamental financial concepts' },
    { id: '2', title: currentLanguage === 'hindi' ? 'एसआईपी लर्निंग' : currentLanguage === 'punjabi' ? 'ਐਸਆਈਪੀ ਸਿੱਖਣਾ' : 'SIP Learning', icon: '📊', color: '#27AE60', route: 'SIPTutorial', searchTerms: ['sip', 'systematic investment plan', 'recurring investment', 'monthly investment'], description: currentLanguage === 'hindi' ? 'सिस्टमैटिक इन्वेस्टमेंट प्लान को समझें' : currentLanguage === 'punjabi' ? 'ਸਿਸਟਮੈਟਿਕ ਇਨਵੈਸਟਮੈਂਟ ਪਲਾਨ ਨੂੰ ਸਮਝੋ' : 'Understand Systematic Investment Plans' },
    { id: '3', title: currentLanguage === 'hindi' ? 'म्यूचुअल फंड' : currentLanguage === 'punjabi' ? 'ਮਿਊਚੁਅਲ ਫੰਡ' : 'Mutual Funds', icon: '📈', color: '#F39C12', route: 'MutualFundsTutorial', searchTerms: ['mutual funds', 'investment', 'portfolio', 'fund management'], description: currentLanguage === 'hindi' ? 'म्यूचुअल फंड निवेश के बारे में जानें' : currentLanguage === 'punjabi' ? 'ਮਿਊਚੁਅਲ ਫੰਡ ਨਿਵੇਸ਼ਾਂ ਬਾਰੇ ਜਾਣੋ' : 'Learn about mutual fund investments' },
    { id: '4', title: currentLanguage === 'hindi' ? 'धोखाधड़ी जागरूकता' : currentLanguage === 'punjabi' ? 'ਧੋਖਾਧੜੀ ਜਾਗਰੂਕਤਾ' : 'Fraud Awareness', icon: '🕵️‍♂️', color: '#E74C3C', route: 'FraudTutorial', searchTerms: ['fraud', 'awareness', 'scam', 'security', 'protection'], description: currentLanguage === 'hindi' ? 'वित्तीय धोखाधड़ी से सुरक्षित रहें' : currentLanguage === 'punjabi' ? 'ਵਿੱਤੀ ਧੋਖਾਧੜੀ ਤੋਂ ਸੁਰੱਖਿਅਤ ਰਹੋ' : 'Stay protected from financial frauds' },
    { id: '5', title: currentLanguage === 'hindi' ? 'कर नियोजन' : currentLanguage === 'punjabi' ? 'ਟੈਕਸ ਯੋਜਨਾਬੰਦੀ' : 'Tax Planning', icon: '🧾', color: '#9B59B6', route: 'TaxTutorial', searchTerms: ['tax', 'planning', 'income tax', 'tax saving', 'deductions'], description: currentLanguage === 'hindi' ? 'अपने करों की कुशलतापूर्वक योजना बनाएं' : currentLanguage === 'punjabi' ? 'ਆਪਣੇ ਟੈਕਸਾਂ ਦੀ ਕੁਸ਼ਲਤਾ ਨਾਲ ਯੋਜਨਾ ਬਣਾਓ' : 'Plan your taxes efficiently' },
  ];

  // Updated quick access features - now includes 6 items (Budgeting, Games, Articles, News, Financial Tools, and View More)
  const mainFeatures = allFeatures.filter(feature => [1, 4, 9, 10, 5].includes(feature.id)); // 5 features + view more button = 6 items total
  const additionalFeatures = allFeatures.filter(feature => ![1, 4, 9, 10, 5].includes(feature.id)); // Remaining features go to "View More" section

  // --- Render Functions ---
  const renderFeatureCard = (feature) => (
    <Pressable
      key={feature.id}
      style={[styles.featureCard, { transform: [{ scale: 1 }] }]}
      onPress={() => handleFeaturePress(feature)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.3)', borderless: true }}
    >
      <Animated.View
        style={[
          styles.featureIconContainer,
          {
            backgroundColor: feature.color,
            shadowColor: feature.color,
            shadowOffset: { width: 0, height: 4 },
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

  const renderSearchResult = ({ item, index }) => (
    <Pressable
      key={`${item.type}-${item.id}-${index}`}
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
        {item.category && (
          <Text style={styles.searchResultCategory}>{item.category}</Text>
        )}
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
          shadowOffset: { width: 0, height: 4 },
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
        <Text style={styles.featureIcon}>↓</Text>
      </Animated.View>
      <Text style={styles.featureTitle}>
        {showAllFeatures ?
          (currentLanguage === 'hindi' ? 'कम देखें' : currentLanguage === 'punjabi' ? 'ਘੱਟ ਵੇਖੋ' : 'View Less') :
          (currentLanguage === 'hindi' ? 'और देखें' : currentLanguage === 'punjabi' ? 'ਹੋਰ ਵੇਖੋ' : 'View More')}
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
        <Text style={styles.viewLessText}>
          {currentLanguage === 'hindi' ? 'कम देखें' : currentLanguage === 'punjabi' ? 'ਘੱਟ ਵੇਖੋ' : 'View Less'}
        </Text>
        <Text style={styles.viewLessIcon}>↑</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Top Section */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              Hi, {fullName ? fullName : 'Guest'}
            </Text>
            <Text style={styles.subGreeting}>{getTimeGreeting()}</Text>
          </View>
          
          <LottieView
  source={require("../../assets/Hello.json")}
  autoPlay
  loop
  style={{ width: 80, height: 80 }}
/>
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
              placeholder={currentLanguage === 'hindi' ? "सुविधाएँ, ट्यूटोरियल, खेल खोजें..." : currentLanguage === 'punjabi' ? "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ, ਟਿਊਟੋਰੀਅਲ, ਖੇਡਾਂ ਖੋਜੋ..." : "Search features, tutorials, games..."}
              placeholderTextColor={Color.colorGray}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              autoCorrect={false}
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
      {showSearchResults && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchResultsContainer}>
            {searchResults.length > 0 ? (
              <>
                <Text style={styles.searchResultsHeader}>
                  {currentLanguage === 'hindi' ? `"${searchQuery}" के लिए ${searchResults.length} परिणाम मिले` : currentLanguage === 'punjabi' ? `"${searchQuery}" ਲਈ ${searchResults.length} ਨਤੀਜੇ ਮਿਲੇ` : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                </Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              </>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>
                  {currentLanguage === 'hindi' ? `"${searchQuery}" के लिए कोई परिणाम नहीं मिला` : currentLanguage === 'punjabi' ? `"${searchQuery}" ਲਈ ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ` : `No results found for "${searchQuery}"`}
                </Text>
                <Text style={styles.noResultsSubtext}>
                  {currentLanguage === 'hindi' ? 'इसके लिए खोज करें: "बजट", "खेल", "कैलकुलेटर", "निवेश", "धोखाधड़ी", "लक्ष्य", "सीखना"' : currentLanguage === 'punjabi' ? 'ਇਸ ਲਈ ਖੋਜ ਕਰੋ: "ਬਜਟ", "ਖੇਡਾਂ", "ਕੈਲਕੁਲੇਟਰ", "ਨਿਵੇਸ਼", "ਧੋਖਾਧੜੀ", "ਟੀਚੇ", "ਸਿੱਖਣਾ"' : 'Try searching for: "budget", "games", "calculator", "investment", "fraud", "goals", "learning"'}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Scrollable Main Content Area - Hidden when searching */}
      {!showSearchResults && (
        <ScrollView
          style={styles.mainContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Main Features Section - Now shows 6 items (5 features + view more button) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {currentLanguage === 'hindi' ? 'त्वरित पहुंच' : currentLanguage === 'punjabi' ? 'ਤੁਰੰਤ ਪਹੁੰਚ' : 'Quick Access'}
            </Text>
            <View style={styles.featuresGrid}>
              {mainFeatures.map((feature) => renderFeatureCard(feature))}
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
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  {currentLanguage === 'hindi' ? 'सभी सुविधाएँ' : currentLanguage === 'punjabi' ? 'ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ' : 'All Features'}
                </Text>
                <View style={styles.additionalFeaturesGrid}>
                  {additionalFeatures.map((feature) => renderFeatureCard(feature))}
                </View>
                {renderViewLessButton()}
              </View>
            )}
          </Animated.View>

          {/* Tips of the Day */}
          <View style={styles.tipsSection}>
            <Pressable style={styles.tipsMiniCard} onPress={() => setShowTipModal(true)}>
              <Text style={styles.tipsMiniText}>
                {currentLanguage === 'hindi' ? 'आज के टिप्स' : currentLanguage === 'punjabi' ? 'ਅੱਜ ਦੇ ਸੁਝਾਅ' : 'Tips of the Day'}
              </Text>
              <Animated.Text
                style={[
                  styles.blinkingIcon,
                  { opacity: blinkingAnim },
                ]}
              >
                💡
              </Animated.Text>
            </Pressable>
          </View>

          <TipModal visible={showTipModal} onClose={() => setShowTipModal(false)} userName={fullName} />

          {/* Learning Tutorials */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>
              {currentLanguage === 'hindi' ? '  सीखें और बढ़ें' : currentLanguage === 'punjabi' ? '  ਸਿੱਖੋ ਅਤੇ ਵਧੋ' : '  Learn & Grow'}
            </Text>
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowOffset: { width: 0, height: 4 },
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
    shadowOffset: { width: 0, height: 2 },
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
    marginBottom: 2,
  },
  searchResultCategory: {
    fontSize: 11,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorGray,
    fontStyle: 'italic',
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
    flexWrap: 'wrap',
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
    shadowOffset: { width: 0, height: 4 },
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