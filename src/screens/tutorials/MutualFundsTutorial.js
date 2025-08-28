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

export default function MutualFundsModule() {
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
    fetchMutualFundsContent();
  }, [language]); // Re-fetch content when language changes

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
        setLearningContent(getTestData());
      }
    } catch (error) {
      console.error('Error fetching Mutual Funds content:', error);
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
        _id: 'mf-test1',
        title: {
          en: "Introduction to Mutual Funds",
          hi: "म्यूचुअल फंड्स का परिचय",
          pa: "ਮਿਊਚਲ ਫੰਡਾਂ ਦੀ ਜਾਣ-ਪਛਾਣ"
        },
        description: {
          en: "Learn what mutual funds are and how they work.",
          hi: "म्यूचुअल फंड क्या हैं और वे कैसे काम करते हैं, यह जानें।",
          pa: "ਜਾਣੋ ਕਿ ਮਿਊਚਲ ਫੰਡ ਕੀ ਹਨ ਅਤੇ ਉਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ।"
        },
        content: {
          en: "A mutual fund is a professionally managed investment fund that pools money from many investors.",
          hi: "म्यूचुअल फंड एक पेशेवर रूप से प्रबंधित निवेश फंड है जो कई निवेशकों से पैसा जमा करता है।",
          pa: "ਇੱਕ ਮਿਊਚਲ ਫੰਡ ਇੱਕ ਪੇਸ਼ੇਵਰ ਤੌਰ 'ਤੇ ਪ੍ਰਬੰਧਿਤ ਨਿਵੇਸ਼ ਫੰਡ ਹੈ ਜੋ ਬਹੁਤ ਸਾਰੇ ਨਿਵੇਸ਼ਕਾਂ ਤੋਂ ਪੈਸਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ।"
        },
        detailedContent: {
          en: `
          <h1>Introduction to Mutual Funds</h1>
          <p>Mutual funds are a type of professionally managed investment that pools money from many investors to purchase securities like stocks and bonds.</p>
          <h2>How Mutual Funds Work</h2>
          <ul>
            <li><b>Pooling of Funds</b>: Money from thousands of investors is collected into a single fund.</li>
            <li><b>Professional Management</b>: A fund manager invests this pool of money on behalf of the investors.</li>
            <li><b>Diversification</b>: Mutual funds typically hold a wide range of investments, which helps to spread risk.</li>
            <li><b>NAV (Net Asset Value)</b>: The price of a mutual fund unit is its NAV, calculated daily.</li>
          </ul>
          <h2>Types of Mutual Funds</h2>
          <ul>
            <li><b>Equity Funds</b>: Invest primarily in stocks.</li>
            <li><b>Debt Funds</b>: Invest in bonds and other fixed-income securities.</li>
            <li><b>Hybrid Funds</b>: A mix of both stocks and bonds.</li>
            <li><b>Index Funds</b>: Track a specific market index like the S&P 500.</li>
          </ul>`,
          hi: `
          <h1>म्यूचुअल फंड्स का परिचय</h1>
          <p>म्यूचुअल फंड एक प्रकार का पेशेवर रूप से प्रबंधित निवेश है जो स्टॉक और बॉन्ड जैसी प्रतिभूतियों को खरीदने के लिए कई निवेशकों से पैसा जमा करता है।</p>
          <h2>म्यूचुअल फंड कैसे काम करते हैं</h2>
          <ul>
            <li><b>फंड्स का पूल</b>: हजारों निवेशकों से पैसा एक ही फंड में एकत्र किया जाता है।</li>
            <li><b>पेशेवर प्रबंधन</b>: एक फंड मैनेजर निवेशकों की ओर से इस पैसे का निवेश करता है।</li>
            <li><b>विविधीकरण</b>: म्यूचुअल फंड आमतौर पर निवेश की एक विस्तृत श्रृंखला रखते हैं, जो जोखिम को फैलाने में मदद करता है।</li>
            <li><b>एनएवी (शुद्ध संपत्ति मूल्य)</b>: म्यूचुअल फंड इकाई की कीमत उसका एनएवी है, जिसकी गणना दैनिक रूप से की जाती है।</li>
          </ul>
          <h2>म्यूचुअल फंड के प्रकार</h2>
          <ul>
            <li><b>इक्विटी फंड्स</b>: मुख्य रूप से स्टॉक में निवेश करते हैं।</li>
            <li><b>ऋण फंड्स</b>: बॉन्ड और अन्य निश्चित आय वाली प्रतिभूतियों में निवेश करते हैं।</li>
            <li><b>हाइब्रिड फंड्स</b>: स्टॉक और बॉन्ड दोनों का मिश्रण।</li>
            <li><b>इंडेक्स फंड्स</b>: एस एंड पी 500 जैसे एक विशिष्ट बाजार सूचकांक को ट्रैक करते हैं।</li>
          </ul>`,
          pa: `
          <h1>ਮਿਊਚਲ ਫੰਡਾਂ ਦੀ ਜਾਣ-ਪਛਾਣ</h1>
          <p>ਮਿਊਚਲ ਫੰਡ ਇੱਕ ਕਿਸਮ ਦਾ ਪੇਸ਼ੇਵਰ ਤੌਰ 'ਤੇ ਪ੍ਰਬੰਧਿਤ ਨਿਵੇਸ਼ ਹੈ ਜੋ ਸਟਾਕਾਂ ਅਤੇ ਬਾਂਡਾਂ ਵਰਗੀਆਂ ਪ੍ਰਤੀਭੂਤੀਆਂ ਨੂੰ ਖਰੀਦਣ ਲਈ ਬਹੁਤ ਸਾਰੇ ਨਿਵੇਸ਼ਕਾਂ ਤੋਂ ਪੈਸਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ।</p>
          <h2>ਮਿਊਚਲ ਫੰਡ ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ</h2>
          <ul>
            <li><b>ਫੰਡਾਂ ਦਾ ਪੂਲਿੰਗ</b>: ਹਜ਼ਾਰਾਂ ਨਿਵੇਸ਼ਕਾਂ ਤੋਂ ਪੈਸਾ ਇੱਕ ਸਿੰਗਲ ਫੰਡ ਵਿੱਚ ਇਕੱਠਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।</li>
            <li><b>ਪੇਸ਼ੇਵਰ ਪ੍ਰਬੰਧਨ</b>: ਇੱਕ ਫੰਡ ਮੈਨੇਜਰ ਨਿਵੇਸ਼ਕਾਂ ਦੀ ਤਰਫੋਂ ਇਸ ਪੈਸੇ ਦਾ ਨਿਵੇਸ਼ ਕਰਦਾ ਹੈ।</li>
            <li><b>ਵਿਵਿਧਤਾ</b>: ਮਿਊਚਲ ਫੰਡ ਆਮ ਤੌਰ 'ਤੇ ਨਿਵੇਸ਼ਾਂ ਦੀ ਇੱਕ ਵਿਸ਼ਾਲ ਸ਼੍ਰੇਣੀ ਰੱਖਦੇ ਹਨ, ਜੋ ਜੋਖਮ ਨੂੰ ਫੈਲਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।</li>
            <li><b>NAV (ਨੈੱਟ ਅਸੈੱਟ ਵੈਲਿਊ)</b>: ਇੱਕ ਮਿਊਚਲ ਫੰਡ ਯੂਨਿਟ ਦੀ ਕੀਮਤ ਇਸਦਾ NAV ਹੈ, ਜਿਸਦੀ ਗਣਨਾ ਰੋਜ਼ਾਨਾ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।</li>
          </ul>
          <h2>ਮਿਊਚਲ ਫੰਡਾਂ ਦੀਆਂ ਕਿਸਮਾਂ</h2>
          <ul>
            <li><b>ਇਕੁਇਟੀ ਫੰਡ</b>: ਮੁੱਖ ਤੌਰ 'ਤੇ ਸਟਾਕਾਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ।</li>
            <li><b>ਕਰਜ਼ਾ ਫੰਡ</b>: ਬਾਂਡ ਅਤੇ ਹੋਰ ਨਿਸ਼ਚਿਤ-ਆਮਦਨ ਪ੍ਰਤੀਭੂਤੀਆਂ ਵਿੱਚ ਨਿਵੇਸ਼ ਕਰਦੇ ਹਨ।</li>
            <li><b>ਹਾਈਬ੍ਰਿਡ ਫੰਡ</b>: ਸਟਾਕਾਂ ਅਤੇ ਬਾਂਡਾਂ ਦੋਵਾਂ ਦਾ ਮਿਸ਼ਰਣ।</li>
            <li><b>ਇੰਡੈਕਸ ਫੰਡ</b>: ਐਸ ਐਂਡ ਪੀ 500 ਵਰਗੇ ਇੱਕ ਖਾਸ ਬਜ਼ਾਰ ਸੂਚਕਾਂਕ ਨੂੰ ਟ੍ਰੈਕ ਕਰਦੇ ਹਨ।</li>
          </ul>`,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'What are Mutual Funds? A Complete Guide',
        videoDescription: 'An easy-to-understand explanation of mutual funds for beginners.',
        difficulty: 'beginner',
        estimatedTime: 20,
        tags: ['mutual-funds', 'basics', 'investing', 'portfolio'],
      },
      {
        _id: 'mf-test2',
        title: {
          en: "Choosing the Right Mutual Fund",
          hi: "सही म्यूचुअल फंड चुनना",
          pa: "ਸਹੀ ਮਿਊਚਲ ਫੰਡ ਚੁਣਨਾ"
        },
        description: {
          en: "A guide to selecting mutual funds based on your goals and risk tolerance.",
          hi: "अपने लक्ष्यों और जोखिम सहनशीलता के आधार पर म्यूचुअल फंड का चयन करने के लिए एक मार्गदर्शिका।",
          pa: "ਆਪਣੇ ਟੀਚਿਆਂ ਅਤੇ ਜੋਖਮ ਸਹਿਣਸ਼ੀਲਤਾ ਦੇ ਅਧਾਰ 'ਤੇ ਮਿਊਚਲ ਫੰਡਾਂ ਦੀ ਚੋਣ ਕਰਨ ਲਈ ਇੱਕ ਗਾਈਡ।"
        },
        content: {
          en: "Choosing the right mutual fund involves assessing your financial goals, risk appetite, and the fund's past performance.",
          hi: "सही म्यूचुअल फंड चुनने में आपके वित्तीय लक्ष्यों, जोखिम की भूख और फंड के पिछले प्रदर्शन का आकलन करना शामिल है।",
          pa: "ਸਹੀ ਮਿਊਚਲ ਫੰਡ ਚੁਣਨ ਵਿੱਚ ਤੁਹਾਡੇ ਵਿੱਤੀ ਟੀਚਿਆਂ, ਜੋਖਮ ਦੀ ਭੁੱਖ, ਅਤੇ ਫੰਡ ਦੇ ਪਿਛਲੇ ਪ੍ਰਦਰਸ਼ਨ ਦਾ ਮੁਲਾਂਕਣ ਕਰਨਾ ਸ਼ਾਮਲ ਹੈ।"
        },
        detailedContent: {
          en: `
          <h1>Choosing the Right Mutual Fund</h1>
          <p>Selecting a mutual fund requires careful consideration. Here's a step-by-step guide:</p>
          <h2>1. Define Your Financial Goals</h2>
          <ul>
            <li><b>Short-Term</b>: Goals less than 3 years (e.g., car purchase, vacation).</li>
            <li><b>Medium-Term</b>: Goals 3-7 years away (e.g., house down payment).</li>
            <li><b>Long-Term</b>: Goals 7+ years away (e.g., retirement, child's education).</li>
          </ul>
          <h2>2. Assess Your Risk Tolerance</h2>
          <ul>
            <li><b>Conservative</b>: Low risk, prefers capital preservation (e.g., Debt Funds).</li>
            <li><b>Moderate</b>: Balanced risk-reward approach (e.g., Hybrid Funds).</li>
            <li><b>Aggressive</b>: High risk, seeks high returns (e.g., Equity Funds).</li>
          </ul>
          <h2>3. Analyze Fund Performance</h2>
          <ul>
            <li>Look at the fund's <b>past performance</b>, but remember it's not a guarantee of future returns.</li>
            <li>Check the fund's <b>expense ratio</b> (the fee charged by the fund).</li>
            <li>Examine the fund manager's experience and tenure.</li>
          </ul>
          `,
          hi: `
          <h1>सही म्यूचुअल फंड चुनना</h1>
          <p>म्यूचुअल फंड का चयन करने के लिए सावधानीपूर्वक विचार की आवश्यकता होती है। यहां एक चरण-दर-चरण मार्गदर्शिका दी गई है:</p>
          <h2>1. अपने वित्तीय लक्ष्यों को परिभाषित करें</h2>
          <ul>
            <li><b>अल्पकालिक</b>: 3 साल से कम के लक्ष्य (जैसे, कार खरीदना, छुट्टी)।</li>
            <li><b>मध्यम-अवधि</b>: 3-7 साल दूर के लक्ष्य (जैसे, घर के लिए डाउन पेमेंट)।</li>
            <li><b>दीर्घकालिक</b>: 7+ साल दूर के लक्ष्य (जैसे, सेवानिवृत्ति, बच्चे की शिक्षा)।</li>
          </ul>
          <h2>2. अपनी जोखिम सहनशीलता का आकलन करें</h2>
          <ul>
            <li><b>रूढ़िवादी</b>: कम जोखिम, पूंजी संरक्षण पसंद करता है (जैसे, ऋण फंड)।</li>
            <li><b>मध्यम</b>: संतुलित जोखिम-इनाम दृष्टिकोण (जैसे, हाइब्रिड फंड)।</li>
            <li><b>आक्रामक</b>: उच्च जोखिम, उच्च रिटर्न चाहता है (जैसे, इक्विटी फंड)।</li>
          </ul>
          <h2>3. फंड प्रदर्शन का विश्लेषण करें</h2>
          <ul>
            <li>फंड के <b>पिछले प्रदर्शन</b> को देखें, लेकिन याद रखें कि यह भविष्य के रिटर्न की गारंटी नहीं है।</li>
            <li>फंड के <b>व्यय अनुपात</b> (फंड द्वारा लिया जाने वाला शुल्क) की जाँच करें।</li>
            <li>फंड मैनेजर के अनुभव और कार्यकाल की जाँच करें।</li>
          </ul>
          `,
          pa: `
          <h1>ਸਹੀ ਮਿਊਚਲ ਫੰਡ ਚੁਣਨਾ</h1>
          <p>ਇੱਕ ਮਿਊਚਲ ਫੰਡ ਦੀ ਚੋਣ ਕਰਨ ਲਈ ਧਿਆਨ ਨਾਲ ਵਿਚਾਰ ਕਰਨ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਇੱਥੇ ਇੱਕ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ ਹੈ:</p>
          <h2>1. ਆਪਣੇ ਵਿੱਤੀ ਟੀਚਿਆਂ ਨੂੰ ਪਰਿਭਾਸ਼ਿਤ ਕਰੋ</h2>
          <ul>
            <li><b>ਛੋਟੀ ਮਿਆਦ</b>: 3 ਸਾਲਾਂ ਤੋਂ ਘੱਟ ਦੇ ਟੀਚੇ (ਜਿਵੇਂ, ਕਾਰ ਖਰੀਦਣਾ, ਛੁੱਟੀਆਂ)।</li>
            <li><b>ਮੱਧਮ ਮਿਆਦ</b>: 3-7 ਸਾਲ ਦੂਰ ਦੇ ਟੀਚੇ (ਜਿਵੇਂ, ਘਰ ਲਈ ਡਾਊਨ ਪੇਮੈਂਟ)।</li>
            <li><b>ਲੰਬੀ ਮਿਆਦ</b>: 7+ ਸਾਲ ਦੂਰ ਦੇ ਟੀਚੇ (ਜਿਵੇਂ, ਰਿਟਾਇਰਮੈਂਟ, ਬੱਚੇ ਦੀ ਸਿੱਖਿਆ)।</li>
          </ul>
          <h2>2. ਆਪਣੀ ਜੋਖਮ ਸਹਿਣਸ਼ੀਲਤਾ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ</h2>
          <ul>
            <li><b>ਰੂੜ੍ਹੀਵਾਦੀ</b>: ਘੱਟ ਜੋਖਮ, ਪੂੰਜੀ ਸੰਭਾਲ ਨੂੰ ਤਰਜੀਹ ਦਿੰਦਾ ਹੈ (ਜਿਵੇਂ, ਕਰਜ਼ਾ ਫੰਡ)।</li>
            <li><b>ਮੱਧਮ</b>: ਸੰਤੁਲਿਤ ਜੋਖਮ-ਇਨਾਮ ਪਹੁੰਚ (ਜਿਵੇਂ, ਹਾਈਬ੍ਰਿਡ ਫੰਡ)।</li>
            <li><b>ਆਕ੍ਰਾਮਕ</b>: ਉੱਚ ਜੋਖਮ, ਉੱਚ ਰਿਟਰਨ ਦੀ ਮੰਗ ਕਰਦਾ ਹੈ (ਜਿਵੇਂ, ਇਕੁਇਟੀ ਫੰਡ)।</li>
          </ul>
          <h2>3. ਫੰਡ ਪ੍ਰਦਰਸ਼ਨ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ</h2>
          <ul>
            <li>ਫੰਡ ਦੇ <b>ਪਿਛਲੇ ਪ੍ਰਦਰਸ਼ਨ</b> ਨੂੰ ਵੇਖੋ, ਪਰ ਯਾਦ ਰੱਖੋ ਕਿ ਇਹ ਭਵਿੱਖ ਦੇ ਰਿਟਰਨ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਹੈ।</li>
            <li>ਫੰਡ ਦੇ <b>ਖਰਚ ਅਨੁਪਾਤ</b> (ਫੰਡ ਦੁਆਰਾ ਲਿਆ ਗਿਆ ਫੀਸ) ਦੀ ਜਾਂਚ ਕਰੋ।</li>
            <li>ਫੰਡ ਮੈਨੇਜਰ ਦੇ ਤਜ਼ਰਬੇ ਅਤੇ ਕਾਰਜਕਾਲ ਦੀ ਜਾਂਚ ਕਰੋ।</li>
          </ul>
          `,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'How to Pick a Mutual Fund',
        videoDescription: 'Expert tips on selecting the best mutual funds for your portfolio.',
        difficulty: 'intermediate',
        estimatedTime: 25,
        tags: ['mutual-funds', 'strategy', 'selection'],
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
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loadingText}>Loading Mutual Funds content...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>💰 Mutual Funds Learning</Text>
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
    </SafeAreaView>
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
    color: '#FF9800',
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