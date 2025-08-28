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

export default function SIPTutorial() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'tutorial'
  const [videoLoading, setVideoLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Default to English

  // Replace with your actual API base URL
  const API_BASE_URL = 'http://10.172.41.93:8000';

  useEffect(() => {
    fetchSIPLearningContent();
  }, [language]); // Re-fetch content when language changes

  const fetchSIPLearningContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching SIP learning content from:', `${API_BASE_URL}/api/financial/sip-learning`);

      const response = await fetch(`${API_BASE_URL}/api/financial/sip-learning`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch SIP learning content: ${response.status} ${response.statusText}`);
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
      console.error('Error fetching SIP learning content:', error);
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
        _id: 'sip-test1',
        title: {
          en: "What is a SIP?",
          hi: "एसआईपी क्या है?",
          pa: "ਇੱਕ SIP ਕੀ ਹੈ?"
        },
        description: {
          en: "Understand the basics of a Systematic Investment Plan.",
          hi: "एक व्यवस्थित निवेश योजना की मूल बातें समझें।",
          pa: "ਇੱਕ ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼ ਯੋਜਨਾ ਦੇ ਮੂਲ ਸਿਧਾਂਤਾਂ ਨੂੰ ਸਮਝੋ।"
        },
        content: {
          en: "A SIP (Systematic Investment Plan) is a method of investing a fixed amount of money regularly in a mutual fund.",
          hi: "एक एसआईपी (व्यवस्थित निवेश योजना) एक म्यूचुअल फंड में नियमित रूप से एक निश्चित राशि का निवेश करने की एक विधि है।",
          pa: "ਇੱਕ SIP (ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼ ਯੋਜਨਾ) ਇੱਕ ਮਿਊਚਲ ਫੰਡ ਵਿੱਚ ਨਿਯਮਤ ਤੌਰ 'ਤੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਰਕਮ ਨਿਵੇਸ਼ ਕਰਨ ਦਾ ਇੱਕ ਤਰੀਕਾ ਹੈ।"
        },
        detailedContent: {
          en: `
          <h1>What is a SIP?</h1>
          <p>A SIP, or Systematic Investment Plan, is a method of investing in mutual funds where you invest a fixed amount of money at regular intervals (e.g., weekly, monthly, quarterly).</p>
          <h2>How It Works</h2>
          <p>SIPs work on the principle of <b>rupee-cost averaging</b>. This means you buy more units when the market is low and fewer units when the market is high, averaging out your cost over time.</p>
          <h2>Key Benefits</h2>
          <ul>
            <li><b>Discipline</b>: It encourages disciplined investing.</li>
            <li><b>Rupee-Cost Averaging</b>: Reduces the risk of market timing.</li>
            <li><b>Convenience</b>: Automated investments are easy to manage.</li>
            <li><b>Power of Compounding</b>: Your returns generate further returns over the long term.</li>
          </ul>
          <h2>Getting Started</h2>
          <ol>
            <li>Choose a mutual fund.</li>
            <li>Decide on your investment amount and frequency.</li>
            <li>Set up an auto-debit from your bank account.</li>
          </ol>`,
          hi: `
          <h1>एसआईपी क्या है?</h1>
          <p>एक एसआईपी, या व्यवस्थित निवेश योजना, म्यूचुअल फंड में निवेश करने की एक विधि है जहां आप नियमित अंतराल (जैसे, साप्ताहिक, मासिक, त्रैमासिक) पर एक निश्चित राशि का निवेश करते हैं।</p>
          <h2>यह कैसे काम करता है</h2>
          <p>एसआईपी <b>रुपया-लागत औसत</b> के सिद्धांत पर काम करते हैं। इसका मतलब है कि जब बाजार कम होता है तो आप अधिक इकाइयां खरीदते हैं और जब बाजार अधिक होता है तो कम इकाइयां खरीदते हैं, जिससे समय के साथ आपकी लागत का औसत निकल जाता है।</p>
          <h2>मुख्य लाभ</h2>
          <ul>
            <li><b>अनुशासन</b>: यह अनुशासित निवेश को प्रोत्साहित करता है।</li>
            <li><b>रुपया-लागत औसत</b>: बाजार के समय के जोखिम को कम करता है।</li>
            <li><b>सुविधा</b>: स्वचालित निवेश का प्रबंधन करना आसान है।</li>
            <li><b>चक्रवृद्धि की शक्ति</b>: आपके रिटर्न लंबी अवधि में और रिटर्न उत्पन्न करते हैं।</li>
          </ul>
          <h2>शुरू करना</h2>
          <ol>
            <li>एक म्यूचुअल फंड चुनें।</li>
            <li>अपनी निवेश राशि और आवृत्ति तय करें।</li>
            <li>अपने बैंक खाते से एक ऑटो-डेबिट सेट करें।</li>
          </ol>`,
          pa: `
          <h1>ਇੱਕ SIP ਕੀ ਹੈ?</h1>
          <p>ਇੱਕ SIP, ਜਾਂ ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼ ਯੋਜਨਾ, ਮਿਊਚਲ ਫੰਡਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰਨ ਦਾ ਇੱਕ ਤਰੀਕਾ ਹੈ ਜਿੱਥੇ ਤੁਸੀਂ ਨਿਯਮਤ ਅੰਤਰਾਲਾਂ (ਜਿਵੇਂ, ਹਫ਼ਤਾਵਾਰੀ, ਮਾਸਿਕ, ਤਿਮਾਹੀ) 'ਤੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਰਕਮ ਦਾ ਨਿਵੇਸ਼ ਕਰਦੇ ਹੋ।</p>
          <h2>ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ</h2>
          <p>SIP <b>ਰੁਪਈਆ-ਲਾਗਤ ਔਸਤ</b> ਦੇ ਸਿਧਾਂਤ 'ਤੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਇਸਦਾ ਮਤਲਬ ਹੈ ਕਿ ਜਦੋਂ ਬਜ਼ਾਰ ਘੱਟ ਹੁੰਦਾ ਹੈ ਤਾਂ ਤੁਸੀਂ ਵਧੇਰੇ ਯੂਨਿਟ ਖਰੀਦਦੇ ਹੋ ਅਤੇ ਜਦੋਂ ਬਜ਼ਾਰ ਉੱਚਾ ਹੁੰਦਾ ਹੈ ਤਾਂ ਘੱਟ ਯੂਨਿਟ ਖਰੀਦਦੇ ਹੋ, ਸਮੇਂ ਦੇ ਨਾਲ ਤੁਹਾਡੀ ਲਾਗਤ ਦਾ ਔਸਤ ਕੱਢਦੇ ਹੋ।</p>
          <h2>ਮੁੱਖ ਲਾਭ</h2>
          <ul>
            <li><b>ਅਨੁਸ਼ਾਸਨ</b>: ਇਹ ਅਨੁਸ਼ਾਸਿਤ ਨਿਵੇਸ਼ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ।</li>
            <li><b>ਰੁਪਈਆ-ਲਾਗਤ ਔਸਤ</b>: ਬਜ਼ਾਰ ਦੇ ਸਮੇਂ ਦੇ ਜੋਖਮ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ।</li>
            <li><b>ਸਹੂਲਤ</b>: ਸਵੈਚਾਲਿਤ ਨਿਵੇਸ਼ਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰਨਾ ਆਸਾਨ ਹੈ।</li>
            <li><b>ਚੱਕਰਵਿਧ ਦੀ ਸ਼ਕਤੀ</b>: ਤੁਹਾਡੇ ਰਿਟਰਨ ਲੰਬੇ ਸਮੇਂ ਵਿੱਚ ਹੋਰ ਰਿਟਰਨ ਪੈਦਾ ਕਰਦੇ ਹਨ।</li>
          </ul>
          <h2>ਸ਼ੁਰੂ ਕਰਨਾ</h2>
          <ol>
            <li>ਇੱਕ ਮਿਊਚਲ ਫੰਡ ਚੁਣੋ।</li>
            <li>ਆਪਣੀ ਨਿਵੇਸ਼ ਦੀ ਰਕਮ ਅਤੇ ਆਵਿਰਤੀ ਦਾ ਫੈਸਲਾ ਕਰੋ।</li>
            <li>ਆਪਣੇ ਬੈਂਕ ਖਾਤੇ ਤੋਂ ਇੱਕ ਆਟੋ-ਡੈਬਿਟ ਸੈਟ ਕਰੋ।</li>
          </ol>
          `,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'SIP Explained for Beginners',
        videoDescription: 'A simple guide to understanding SIPs and their benefits.',
        difficulty: 'beginner',
        estimatedTime: 15,
        tags: ['sip', 'basics', 'investing'],
      },
      {
        _id: 'sip-test2',
        title: {
          en: "SIP vs Lumpsum Investment",
          hi: "एसआईपी बनाम एकमुश्त निवेश",
          pa: "SIP ਬਨਾਮ ਇਕਮੁਸ਼ਤ ਨਿਵੇਸ਼"
        },
        description: {
          en: "Compare SIP and lump sum investments to see which is right for you.",
          hi: "यह देखने के लिए एसआईपी और एकमुश्त निवेश की तुलना करें कि आपके लिए कौन सा सही है।",
          pa: "ਇਹ ਦੇਖਣ ਲਈ SIP ਅਤੇ ਇਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ ਕਿ ਤੁਹਾਡੇ ਲਈ ਕਿਹੜਾ ਸਹੀ ਹੈ।"
        },
        content: {
          en: "Lump sum investing involves a one-time, large investment, while a SIP involves regular, smaller investments over time.",
          hi: "एकमुश्त निवेश में एक बार, बड़ा निवेश शामिल होता है, जबकि एक एसआईपी में समय के साथ नियमित, छोटे निवेश शामिल होते हैं।",
          pa: "ਇਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਵਿੱਚ ਇੱਕ ਵਾਰ, ਵੱਡਾ ਨਿਵੇਸ਼ ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ, ਜਦੋਂ ਕਿ ਇੱਕ SIP ਵਿੱਚ ਸਮੇਂ ਦੇ ਨਾਲ ਨਿਯਮਤ, ਛੋਟੇ ਨਿਵੇਸ਼ ਸ਼ਾਮਲ ਹੁੰਦੇ ਹਨ।"
        },
        detailedContent: {
          en: `
          <h1>SIP vs Lumpsum Investment</h1>
          <p>Choosing between a SIP and a lump sum investment depends on your financial situation and market view.</p>
          <h2>Lump Sum</h2>
          <ul>
            <li><b>Definition</b>: Investing a large sum of money at once.</li>
            <li><b>Best for</b>: Investors with a large corpus and a positive short-term market outlook.</li>
            <li><b>Risk</b>: Higher risk if the market falls right after your investment.</li>
          </ul>
          <h2>Systematic Investment Plan (SIP)</h2>
          <ul>
            <li><b>Definition</b>: Investing a fixed amount at regular intervals.</li>
            <li><b>Best for</b>: Regular income earners and those who want to mitigate market risk.</li>
            <li><b>Risk</b>: Lower risk due to rupee-cost averaging.</li>
          </ul>
          <h2>Conclusion</h2>
          <p>For most new investors, SIP is the preferred method as it removes the emotion of market timing and promotes disciplined wealth creation.</p>
          `,
          hi: `
          <h1>एसआईपी बनाम एकमुश्त निवेश</h1>
          <p>एसआईपी और एकमुश्त निवेश के बीच चयन आपकी वित्तीय स्थिति और बाजार के दृष्टिकोण पर निर्भर करता है।</p>
          <h2>एकमुश्त</h2>
          <ul>
            <li><b>परिभाषा</b>: एक बार में बड़ी राशि का निवेश करना।</li>
            <li><b>सबसे अच्छा किसके लिए</b>: बड़े फंड वाले निवेशकों और सकारात्मक अल्पकालिक बाजार दृष्टिकोण वाले लोगों के लिए।</li>
            <li><b>जोखिम</b>: यदि आपके निवेश के ठीक बाद बाजार गिरता है तो अधिक जोखिम।</li>
          </ul>
          <h2>व्यवस्थित निवेश योजना (एसआईपी)</h2>
          <ul>
            <li><b>परिभाषा</b>: नियमित अंतराल पर एक निश्चित राशि का निवेश करना।</li>
            <li><b>सबसे अच्छा किसके लिए</b>: नियमित आय अर्जित करने वालों और उन लोगों के लिए जो बाजार जोखिम को कम करना चाहते हैं।</li>
            <li><b>जोखिम</b>: रुपया-लागत औसत के कारण कम जोखिम।</li>
          </ul>
          <h2>निष्कर्ष</h2>
          <p>अधिकांश नए निवेशकों के लिए, एसआईपी पसंदीदा तरीका है क्योंकि यह बाजार के समय की भावना को हटाता है और अनुशासित धन सृजन को बढ़ावा देता है।</p>
          `,
          pa: `
          <h1>SIP ਬਨਾਮ ਇਕਮੁਸ਼ਤ ਨਿਵੇਸ਼</h1>
          <p>ਇੱਕ SIP ਅਤੇ ਇੱਕ ਇਕਮੁਸ਼ਤ ਨਿਵੇਸ਼ ਦੇ ਵਿਚਕਾਰ ਚੋਣ ਤੁਹਾਡੀ ਵਿੱਤੀ ਸਥਿਤੀ ਅਤੇ ਬਜ਼ਾਰ ਦੇ ਦ੍ਰਿਸ਼ਟੀਕੋਣ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।</p>
          <h2>ਇਕਮੁਸ਼ਤ</h2>
          <ul>
            <li><b>ਪਰਿਭਾਸ਼ਾ</b>: ਇੱਕ ਵਾਰ ਵਿੱਚ ਵੱਡੀ ਰਕਮ ਦਾ ਨਿਵੇਸ਼ ਕਰਨਾ।</li>
            <li><b>ਸਭ ਤੋਂ ਵਧੀਆ</b>: ਵੱਡੇ ਫੰਡ ਵਾਲੇ ਨਿਵੇਸ਼ਕਾਂ ਅਤੇ ਸਕਾਰਾਤਮਕ ਛੋਟੀ ਮਿਆਦ ਦੇ ਬਜ਼ਾਰ ਦ੍ਰਿਸ਼ਟੀਕੋਣ ਵਾਲੇ ਲੋਕਾਂ ਲਈ।</li>
            <li><b>ਜੋਖਮ</b>: ਜੇਕਰ ਤੁਹਾਡੇ ਨਿਵੇਸ਼ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਬਜ਼ਾਰ ਡਿੱਗਦਾ ਹੈ ਤਾਂ ਵਧੇਰੇ ਜੋਖਮ।</li>
          </ul>
          <h2>ਯੋਜਨਾਬੱਧ ਨਿਵੇਸ਼ ਯੋਜਨਾ (SIP)</h2>
          <ul>
            <li><b>ਪਰਿਭਾਸ਼ਾ</b>: ਨਿਯਮਤ ਅੰਤਰਾਲਾਂ 'ਤੇ ਇੱਕ ਨਿਸ਼ਚਿਤ ਰਕਮ ਨਿਵੇਸ਼ ਕਰਨਾ।</li>
            <li><b>ਸਭ ਤੋਂ ਵਧੀਆ</b>: ਨਿਯਮਤ ਆਮਦਨ ਕਮਾਉਣ ਵਾਲੇ ਅਤੇ ਉਹਨਾਂ ਲਈ ਜੋ ਬਜ਼ਾਰ ਦੇ ਜੋਖਮ ਨੂੰ ਘਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹਨ।</li>
            <li><b>ਜੋਖਮ</b>: ਰੁਪਈਆ-ਲਾਗਤ ਔਸਤ ਕਾਰਨ ਘੱਟ ਜੋਖਮ।</li>
          </ul>
          <h2>ਸਿੱਟਾ</h2>
          <p>ਜ਼ਿਆਦਾਤਰ ਨਵੇਂ ਨਿਵੇਸ਼ਕਾਂ ਲਈ, SIP ਪਸੰਦੀਦਾ ਤਰੀਕਾ ਹੈ ਕਿਉਂਕਿ ਇਹ ਬਜ਼ਾਰ ਦੇ ਸਮੇਂ ਦੀ ਭਾਵਨਾ ਨੂੰ ਹਟਾਉਂਦਾ ਹੈ ਅਤੇ ਅਨੁਸ਼ਾਸਿਤ ਦੌਲਤ ਸਿਰਜਣਾ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦਾ ਹੈ।</p>
          `,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'SIP vs Lumpsum: The Ultimate Guide',
        videoDescription: 'A detailed comparison of SIP and lump sum investing strategies.',
        difficulty: 'intermediate',
        estimatedTime: 20,
        tags: ['sip', 'investing', 'comparison'],
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
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading SIP content...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>🌱 SIPs Learning</Text>
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
        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchSIPLearningContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0F8F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E8B57',
  },
  header: {
    backgroundColor: '#4CAF50', // Green header
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
    color: '#4CAF50',
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
    fontWeight: '700',
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
    backgroundColor: '#f8f9fa',
  },
  videoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#4CAF50',
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
    backgroundColor: '#F0F8F5',
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
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerVideoButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
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
    backgroundColor: '#E8F5E9', // Lighter green background
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
    color: '#2E8B57',
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
    color: '#4CAF50',
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
    backgroundColor: '#C8E6C9', // Lighter green
    color: '#388E3C', // Darker green
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
    backgroundColor: '#F0F8F5',
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
    backgroundColor: '#4CAF50',
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