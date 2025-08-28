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
  SafeAreaView,
} from 'react-native';
import Video from 'react-native-video';
import RenderHtml from 'react-native-render-html';

const { width, height } = Dimensions.get('window');

export default function FinanceTutorial() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'tutorial'
  const [videoLoading, setVideoLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Default to English

  // Replace with your actual API base URL
  const API_BASE_URL = 'http://10.77.224.93:8000';

  useEffect(() => {
    fetchFinanceBasicsContent();
  }, [language]); // Re-fetch content when language changes

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
        setLearningContent(getTestData());
      }
    } catch (error) {
      console.error('Error fetching learning content:', error);
      Alert.alert(
        'Connection Error',
        `Unable to connect to server. Showing test data instead.`
      );
      setLearningContent(getTestData());
    } finally {
      setLoading(false);
    }
  };

  const getTestData = () => {
    return [
      {
        _id: 'test1',
        title: {
          en: "<b>Understanding Compound Interest</b>",
          hi: "<b>चक्रवृद्धि ब्याज को समझना</b>",
          pa: "<b>ਚੱਕਰਵਿਧ ਬਿਆਜ ਨੂੰ ਸਮਝਣਾ</b>"
        },
        description: {
          en: "Learn how compound interest works and why it's important for wealth building.",
          hi: "सीखें कि चक्रवृद्धि ब्याज कैसे काम करता है और यह धन बनाने के लिए क्यों महत्वपूर्ण है।",
          pa: "ਸਮਝੋ ਕਿ ਚੱਕਰਵਿਧ ਬਿਆਜ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਇਹ ਦੌਲਤ ਬਣਾਉਣ ਲਈ ਕਿਉਂ ਜ਼ਰੂਰੀ ਹੈ।"
        },
        content: {
          en: "<p>Tax planning is a crucial aspect of financial management...</p>",
          hi: "<p>कर नियोजन वित्तीय प्रबंधन का एक महत्वपूर्ण पहलू है...</p>",
          pa: "<p>ਟੈਕਸ ਪਲਾਨਿੰਗ ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ ਦਾ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਪਹਿਲੂ ਹੈ...</p>"
        },
        detailedContent: {
          en: `
          <h1>Understanding Compound Interest</h1>
          <p>Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.</p>
          <p>It's often referred to as "interest on interest" and is one of the most powerful concepts in finance.</p>
          <h2>Why is it so powerful?</h2>
          <p>Compound interest allows your money to grow exponentially over time. Here's how it works:</p>
          <ul>
            <li>In the first period, you earn interest on your initial investment (the principal).</li>
            <li>In the second period, you earn interest on the principal PLUS the interest you earned in the first period.</li>
            <li>This cycle continues, with each period's interest being added to the principal for the next period's calculation.</li>
          </ul>`,
          hi: `
          <h1>चक्रवृद्धि ब्याज को समझना</h1>
          <p>चक्रवृद्धि ब्याज किसी ऋण या जमा पर प्रारंभिक मूलधन और पिछले अवधियों से संचित ब्याज दोनों के आधार पर गणना किया गया ब्याज है।</p>
          <p>इसे अक्सर "ब्याज पर ब्याज" के रूप में जाना जाता है और यह वित्त में सबसे शक्तिशाली अवधारणाओं में से एक है।</p>
          <h2>यह इतना शक्तिशाली क्यों है?</h2>
          <p>चक्रवृद्धि ब्याज आपके पैसे को समय के साथ तेजी से बढ़ने देता है। यह इस तरह काम करता है:</p>
          <ul>
            <li>पहली अवधि में, आप अपने प्रारंभिक निवेश (मूलधन) पर ब्याज कमाते हैं।</li>
            <li>दूसरी अवधि में, आप मूलधन और पहली अवधि में अर्जित ब्याज दोनों पर ब्याज कमाते हैं।</li>
            <li>यह चक्र जारी रहता है, जिसमें प्रत्येक अवधि का ब्याज अगली अवधि की गणना के लिए मूलधन में जोड़ा जाता है।</li>
          </ul>`,
          pa: `
          <h1>ਚੱਕਰਵਿਧ ਬਿਆਜ ਨੂੰ ਸਮਝਣਾ</h1>
          <p>ਚੱਕਰਵਿਧ ਬਿਆਜ ਕਿਸੇ ਕਰਜ਼ੇ ਜਾਂ ਜਮ੍ਹਾਂ ਉੱਤੇ ਅਸਲ ਮੂਲ ਅਤੇ ਪਿਛਲੀਆਂ ਮਿਆਦਾਂ ਦੇ ਇਕੱਠੇ ਹੋਏ ਬਿਆਜ ਦੋਵਾਂ ਉੱਤੇ ਗਣਨਾ ਕੀਤਾ ਗਿਆ ਬਿਆਜ ਹੈ।</p>
          <p>ਇਸਨੂੰ ਅਕਸਰ "ਬਿਆਜ ਉੱਤੇ ਬਿਆਜ" ਕਿਹਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇਹ ਵਿੱਤ ਵਿੱਚ ਸਭ ਤੋਂ ਸ਼ਕਤੀਸ਼ਾਲੀ ਧਾਰਨਾਵਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ।</p>
          <h2>ਇਹ ਇੰਨਾ ਸ਼ਕਤੀਸ਼ਾਲੀ ਕਿਉਂ ਹੈ?</h2>
          <p>ਚੱਕਰਵਿਧ ਬਿਆਜ ਤੁਹਾਡੇ ਪੈਸੇ ਨੂੰ ਸਮੇਂ ਦੇ ਨਾਲ ਤੇਜ਼ੀ ਨਾਲ ਵਧਾਉਣ ਦਿੰਦਾ ਹੈ। ਇਹ ਇਸ ਤਰ੍ਹਾਂ ਕੰਮ ਕਰਦਾ ਹੈ:</p>
          <ul>
            <li>ਪਹਿਲੀ ਮਿਆਦ ਵਿੱਚ, ਤੁਸੀਂ ਆਪਣੇ ਮੁੱਢਲੇ ਨਿਵੇਸ਼ (ਮੂਲ) ਉੱਤੇ ਬਿਆਜ ਕਮਾਉਂਦੇ ਹੋ।</li>
            <li>ਦੂਜੀ ਮਿਆਦ ਵਿੱਚ, ਤੁਸੀਂ ਮੂਲ ਅਤੇ ਪਹਿਲੀ ਮਿਆਦ ਵਿੱਚ ਕਮਾਏ ਬਿਆਜ ਦੋਵਾਂ ਉੱਤੇ ਬਿਆਜ ਕਮਾਉਂਦੇ ਹੋ।</li>
            <li>ਇਹ ਚੱਕਰ ਜਾਰੀ ਰਹਿੰਦਾ ਹੈ, ਜਿੱਥੇ ਹਰ ਮਿਆਦ ਦਾ ਬਿਆਜ ਅਗਲੀ ਮਿਆਦ ਦੀ ਗਣਨਾ ਲਈ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।</li>
          </ul>`
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'Compound Interest Explained',
        videoDescription: 'A comprehensive guide to compound interest.',
        difficulty: 'beginner',
        estimatedTime: 45,
        tags: ['compound-interest', 'saving', 'investing', 'beginners'],
        prerequisites: ['Basic math', 'Understanding of simple interest'],
        learningObjectives: ['Calculate compound interest', 'Understand time value of money'],
        isPublished: true,
      },
      {
        _id: 'test2',
        title: {
          en: "<b>Building Your First Budget</b>",
          hi: "<b>अपना पहला बजट बनाना</b>",
          pa: "<b>ਆਪਣਾ ਪਹਿਲਾ ਬਜਟ ਬਣਾਉਣਾ</b>"
        },
        description: {
          en: "Step-by-step guide to creating and maintaining a personal budget that works.",
          hi: "एक व्यक्तिगत बजट बनाने और बनाए रखने के लिए चरण-दर-चरण मार्गदर्शिका जो काम करता है।",
          pa: "ਇੱਕ ਨਿੱਜੀ ਬਜਟ ਬਣਾਉਣ ਅਤੇ ਬਣਾਈ ਰੱਖਣ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ ਜੋ ਕੰਮ ਕਰਦਾ ਹੈ।"
        },
        content: {
          en: "<p>A budget is your roadmap to financial success.</p>",
          hi: "<p>एक बजट वित्तीय सफलता के लिए आपका रोडमैप है।</p>",
          pa: "<p>ਇੱਕ ਬਜਟ ਵਿੱਤੀ ਸਫ਼ਲਤਾ ਲਈ ਤੁਹਾਡਾ ਰੋਡਮੈਪ ਹੈ।</p>"
        },
        detailedContent: {
          en: `<h1>Building Your First Budget</h1>
          <p>A budget is your roadmap to financial success. It helps you control your spending, save money, and reach your financial goals. A simple budget helps you:</p>
          <ul>
            <li>Track where your money is going.</li>
            <li>Find areas where you can cut back.</li>
            <li>Allocate funds for savings and investments.</li>
          </ul>
          <h2>The 50/30/20 Rule</h2>
          <p>A popular budgeting method is the 50/30/20 rule:</p>
          <ul>
            <li><b>50% Needs:</b> Essential expenses like rent, utilities, and groceries.</li>
            <li><b>30% Wants:</b> Non-essential items like dining out, entertainment, and hobbies.</li>
            <li><b>20% Savings/Debt:</b> Money for your emergency fund, retirement, and paying off debt.</li>
          </ul>
          `,
          hi: `<h1>अपना पहला बजट बनाना</h1>
          <p>एक बजट वित्तीय सफलता के लिए आपका रोडमैप है। यह आपको अपने खर्च को नियंत्रित करने, पैसे बचाने और अपने वित्तीय लक्ष्यों तक पहुंचने में मदद करता है। एक सरल बजट आपको मदद करता है:</p>
          <ul>
            <li>यह ट्रैक करने में कि आपका पैसा कहाँ जा रहा है।</li>
            <li>ऐसे क्षेत्रों को खोजने में जहाँ आप खर्च कम कर सकते हैं।</li>
            <li>बचत और निवेश के लिए धन आवंटित करने में।</li>
          </ul>
          <h2>50/30/20 नियम</h2>
          <p>एक लोकप्रिय बजटिंग विधि 50/30/20 नियम है:</p>
          <ul>
            <li><b>50% आवश्यकताएं:</b> आवश्यक खर्च जैसे किराया, उपयोगिताएं, और किराने का सामान।</li>
            <li><b>30% इच्छाएं:</b> गैर-आवश्यक वस्तुएं जैसे बाहर खाना, मनोरंजन, और शौक।</li>
            <li><b>20% बचत/ऋण:</b> आपके आपातकालीन निधि, सेवानिवृत्ति, और ऋण चुकाने के लिए पैसा।</li>
          </ul>
          `,
          pa: `<h1>ਆਪਣਾ ਪਹਿਲਾ ਬਜਟ ਬਣਾਉਣਾ</h1>
          <p>ਇੱਕ ਬਜਟ ਵਿੱਤੀ ਸਫ਼ਲਤਾ ਲਈ ਤੁਹਾਡਾ ਰੋਡਮੈਪ ਹੈ। ਇਹ ਤੁਹਾਨੂੰ ਆਪਣੇ ਖਰਚ ਨੂੰ ਕੰਟਰੋਲ ਕਰਨ, ਪੈਸੇ ਬਚਾਉਣ ਅਤੇ ਆਪਣੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਇੱਕ ਸਧਾਰਨ ਬਜਟ ਤੁਹਾਡੀ ਮਦਦ ਕਰਦਾ ਹੈ:</p>
          <ul>
            <li>ਇਹ ਟਰੈਕ ਕਰਨ ਵਿੱਚ ਕਿ ਤੁਹਾਡਾ ਪੈਸਾ ਕਿੱਥੇ ਜਾ ਰਿਹਾ ਹੈ।</li>
            <li>ਉਹਨਾਂ ਖੇਤਰਾਂ ਨੂੰ ਲੱਭਣ ਵਿੱਚ ਜਿੱਥੇ ਤੁਸੀਂ ਖਰਚ ਘਟਾ ਸਕਦੇ ਹੋ।</li>
            <li>ਬਚਤ ਅਤੇ ਨਿਵੇਸ਼ ਲਈ ਫੰਡ ਵੰਡਣ ਵਿੱਚ।</li>
          </ul>
          <h2>50/30/20 ਨਿਯਮ</h2>
          <p>ਇੱਕ ਪ੍ਰਸਿੱਧ ਬਜਟਿੰਗ ਵਿਧੀ 50/30/20 ਨਿਯਮ ਹੈ:</p>
          <ul>
            <li><b>50% ਜ਼ਰੂਰਤਾਂ:</b> ਜ਼ਰੂਰੀ ਖਰਚੇ ਜਿਵੇਂ ਕਿਰਾਇਆ, ਉਪਯੋਗਤਾਵਾਂ, ਅਤੇ ਕਰਿਆਨਾ।</li>
            <li><b>30% ਇੱਛਾਵਾਂ:</b> ਗੈਰ-ਜ਼ਰੂਰੀ ਵਸਤੂਆਂ ਜਿਵੇਂ ਬਾਹਰ ਖਾਣਾ, ਮਨੋਰੰਜਨ, ਅਤੇ ਸ਼ੌਕ।</li>
            <li><b>20% ਬਚਤ/ਕਰਜ਼ਾ:</b> ਤੁਹਾਡੇ ਐਮਰਜੈਂਸੀ ਫੰਡ, ਰਿਟਾਇਰਮੈਂਟ, ਅਤੇ ਕਰਜ਼ਾ ਚੁਕਾਉਣ ਲਈ ਪੈਸਾ।</li>
          </ul>
          `
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'How to Create Your First Budget - Step by Step',
        videoDescription: 'Learn how to build a realistic budget that you can actually stick to.',
        difficulty: 'beginner',
        estimatedTime: 25,
        tags: ['budgeting', 'money management', 'savings'],
      },
    ];
  };

  const handleTitlePress = (content) => {
    const contentToDisplay = content.detailedContent?.[language] || content.detailedContent?.en;

    if (contentToDisplay) {
      setSelectedContent({
        ...content,
        tutorial: contentToDisplay
      });
      setViewMode('tutorial');
    } else {
      Alert.alert('No Content', `No detailed content is available for this topic in ${language.toUpperCase()}.`);
    }
  };

  const handleVideoPress = (content) => {
    if (content.videoUrl) {
      setSelectedVideo({
        url: content.videoUrl,
        title: content.videoTitle || content.title?.[language] || content.title.en,
        description: content.videoDescription || content.description?.[language] || content.description.en,
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
      case 'beginner': return '#27ae60';
      case 'intermediate': return '#f39c12';
      case 'advanced': return '#e74c3c';
      default: return '#3498db';
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
        <TouchableOpacity
          style={styles.cardContentContainer}
          onPress={() => handleTitlePress(item)}
          activeOpacity={0.8}
        >
          {/* RENDER THE TITLE IN THE SELECTED LANGUAGE */}
          <RenderHtml
            contentWidth={width}
            source={{ html: item.title?.[language] || item.title?.en }}
            tagsStyles={{ b: styles.contentTitle, h1: styles.contentTitle, p: styles.contentTitle }}
          />
          {/* RENDER THE DESCRIPTION IN THE SELECTED LANGUAGE */}
          <Text style={styles.contentDescription} numberOfLines={2}>
            {item.description?.[language] || item.description?.en || 'No description available.'}
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
          activeOpacity={0.8}
        >
          <View style={styles.videoButton}>
            <Text style={styles.videoIcon}>▶️</Text>
          </View>
          <Text style={styles.videoLabel}>Watch</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTutorialContent = () => {
    if (!selectedContent || !selectedContent.tutorial) {
      return (
        <SafeAreaView style={styles.noTutorialContainer}>
          <Text style={styles.noTutorialText}>No tutorial content available for this topic.</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    const source = { html: selectedContent.tutorial };

    const tagsStyles = {
      h1: styles.tutorialMainHeading,
      h2: styles.tutorialSubHeading,
      h3: styles.tutorialSubSubHeading,
      p: styles.tutorialParagraph,
      li: styles.bulletText,
      ul: { marginBottom: 16, paddingLeft: 0, listStyleType: 'disc' },
      ol: { marginBottom: 16, paddingLeft: 0, listStyleType: 'decimal' },
      b: styles.boldText,
      strong: styles.boldText,
    };

    return (
      <SafeAreaView style={styles.tutorialContainer}>
        <View style={styles.tutorialHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerVideoButton}
            onPress={() => handleVideoPress(selectedContent)}
            activeOpacity={0.8}
          >
            <Text style={styles.headerVideoIcon}>▶️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.tutorialScroll}>
          <View style={styles.tutorialCard}>
            <RenderHtml
              contentWidth={width}
              source={{ html: selectedContent.title?.[language] || selectedContent.title?.en }}
              tagsStyles={{ b: styles.tutorialTitle, h1: styles.tutorialTitle, p: styles.tutorialTitle }}
            />
            <View style={styles.tutorialMeta}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Difficulty:</Text>
                <Text style={[styles.metaValue, { color: getDifficultyColor(selectedContent.difficulty) }]}>
                  {getDifficultyIcon(selectedContent.difficulty)} {selectedContent.difficulty || 'General'}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Time:</Text>
                <Text style={styles.metaValue}>⏱ {formatTime(selectedContent.estimatedTime)}</Text>
              </View>
            </View>

            <View style={styles.tutorialContent}>
              <RenderHtml
                contentWidth={width}
                source={source}
                tagsStyles={tagsStyles}
              />
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
      </SafeAreaView>
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
            <RenderHtml
              contentWidth={width}
              source={{ html: `<p>${selectedVideo.description}</p>` }}
              tagsStyles={{ p: styles.videoDescriptionText }}
            />
          </View>
        )}
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading finance content...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>📚 Learn Finance Basics</Text>
        <Text style={styles.subtitle}>
          Tap title for tutorial • Tap video icon to watch
        </Text>
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === 'hi' && styles.langButtonActive]}
            onPress={() => setLanguage('hi')}
          >
            <Text style={[styles.langText, language === 'hi' && styles.langTextActive]}>हिंदी</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === 'pa' && styles.langButtonActive]}
            onPress={() => setLanguage('pa')}
          >
            <Text style={[styles.langText, language === 'pa' && styles.langTextActive]}>ਪੰਜਾਬੀ</Text>
          </TouchableOpacity>
        </View>

        {learningContent.length > 0 && (
          <Text style={styles.contentCount}>
            {learningContent.length} topic{learningContent.length !== 1 ? 's' : ''} available
          </Text>
        )}

        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchFinanceBasicsContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchFinanceBasicsContent}>
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
    </SafeAreaView>
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  langButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  langText: {
    color: 'white',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#667eea',
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
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContentContainer: {
    flex: 1,
    padding: 20,
    paddingRight: 12,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
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
    backgroundColor: '#ecf0f1',
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
  tutorialScroll: {
    flex: 1,
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
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
  },
  bulletText: {
    fontSize: 15,
    color: '#5d6d7e',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 24,
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
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
    aspectRatio: 16 / 9,
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