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

export default function FraudAwarenessModule() {
  const [learningContent, setLearningContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'tutorial'
  const [videoLoading, setVideoLoading] = useState(true);
  const [language, setLanguage] = useState('en'); // Default to English

  const API_BASE_URL = 'http://10.172.41.93:8000';

  useEffect(() => {
    fetchFraudAwarenessContent();
  }, [language]); // Re-fetch content when language changes

  const fetchFraudAwarenessContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching Fraud Awareness content from:', `${API_BASE_URL}/api/financial/fraud-awareness`);

      const response = await fetch(`${API_BASE_URL}/api/financial/fraud-awareness`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch Fraud Awareness content: ${response.status} ${response.statusText}`);
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
      console.error('Error fetching Fraud Awareness content:', error);
      Alert.alert(
        'Connection Error',
        `Unable to connect to the server. Showing test data instead.`
      );
      setLearningContent(getTestData());
    } finally {
      setLoading(false);
    }
  };

  const getTestData = () => {
    return [
      {
        _id: 'fa-test1',
        title: {
          en: "Phishing Scams: What to Look For",
          hi: "फिशिंग स्कैम: क्या देखें",
          pa: "ਫਿਸ਼ਿੰਗ ਘੁਟਾਲੇ: ਕੀ ਵੇਖਣਾ ਹੈ"
        },
        description: {
          en: "Learn how to identify and avoid common phishing attacks.",
          hi: "फिशिंग हमलों को कैसे पहचानें और उनसे कैसे बचें, यह जानें।",
          pa: "ਜਾਣੋ ਕਿ ਆਮ ਫਿਸ਼ਿੰਗ ਹਮਲਿਆਂ ਦੀ ਪਛਾਣ ਕਿਵੇਂ ਕਰਨੀ ਹੈ ਅਤੇ ਉਹਨਾਂ ਤੋਂ ਕਿਵੇਂ ਬਚਣਾ ਹੈ।"
        },
        content: {
          en: "Phishing is a type of online fraud where criminals impersonate legitimate organizations to steal your personal information.",
          hi: "फिशिंग एक प्रकार का ऑनलाइन धोखाधड़ी है जहां अपराधी आपकी व्यक्तिगत जानकारी चुराने के लिए वैध संगठनों का प्रतिरूपण करते हैं।",
          pa: "ਫਿਸ਼ਿੰਗ ਇੱਕ ਕਿਸਮ ਦੀ ਔਨਲਾਈਨ ਧੋਖਾਧੜੀ ਹੈ ਜਿੱਥੇ ਅਪਰਾਧੀ ਤੁਹਾਡੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰਨ ਲਈ ਜਾਇਜ਼ ਸੰਸਥਾਵਾਂ ਦਾ ਭੇਸ ਧਾਰਦੇ ਹਨ।"
        },
        detailedContent: {
          en: `
          <h1>Phishing Scams: What to Look For</h1>
          <p>Phishing is a deceptive practice used by cybercriminals to trick you into revealing sensitive information like passwords, bank details, and credit card numbers.</p>
          <h2>Common Red Flags</h2>
          <ul>
            <li><b>Urgent or Threatening Language</b>: Scammers often use threats or a sense of urgency to make you act without thinking.</li>
            <li><b>Spelling and Grammar Mistakes</b>: Legitimate companies rarely send emails with errors.</li>
            <li><b>Suspicious Links</b>: Hover over links to check the URL. If it doesn't match the company's official website, don't click it.</li>
            <li><b>Requests for Personal Information</b>: Be cautious of any email or message that asks for your password, social security number, or other private data.</li>
          </ul>
          <h2>How to Protect Yourself</h2>
          <ol>
            <li><b>Verify the Sender</b>: Always check the sender's email address. It should match the official domain.</li>
            <li><b>Avoid Clicking Links</b>: Instead of clicking a link, manually type the website's address into your browser.</li>
            <li><b>Use Multi-Factor Authentication (MFA)</b>: This adds an extra layer of security to your accounts.</li>
            <li><b>Report Phishing Attempts</b>: Forward suspicious emails to your email provider or the company being impersonated.</li>
          </ol>`,
          hi: `
          <h1>फिशिंग स्कैम: क्या देखें</h1>
          <p>फिशिंग एक भ्रामक अभ्यास है जिसका उपयोग साइबर अपराधी आपको पासवर्ड, बैंक विवरण और क्रेडिट कार्ड नंबर जैसी संवेदनशील जानकारी प्रकट करने के लिए करते हैं।</p>
          <h2>सामान्य खतरे के संकेत</h2>
          <ul>
            <li><b>अत्यावश्यक या धमकी भरी भाषा</b>: स्कैमर अक्सर आपको बिना सोचे-समझे काम करने के लिए धमकियों या अत्यावश्यकता की भावना का उपयोग करते हैं।</li>
            <li><b>वर्तनी और व्याकरण की गलतियाँ</b>: वैध कंपनियां शायद ही कभी गलतियों वाले ईमेल भेजती हैं।</li>
            <li><b>संदिग्ध लिंक</b>: यूआरएल की जांच करने के लिए लिंक पर होवर करें। यदि यह कंपनी की आधिकारिक वेबसाइट से मेल नहीं खाता है, तो उस पर क्लिक न करें।</li>
            <li><b>व्यक्तिगत जानकारी के लिए अनुरोध</b>: किसी भी ईमेल या संदेश से सावधान रहें जो आपके पासवर्ड, सामाजिक सुरक्षा नंबर, या अन्य निजी डेटा के लिए पूछता है।</li>
          </ul>
          <h2>खुद को कैसे बचाएं</h2>
          <ol>
            <li><b>प्रेषक को सत्यापित करें</b>: हमेशा प्रेषक का ईमेल पता जांचें। यह आधिकारिक डोमेन से मेल खाना चाहिए।</li>
            <li><b>लिंक पर क्लिक करने से बचें</b>: लिंक पर क्लिक करने के बजाय, मैन्युअल रूप से वेबसाइट का पता अपने ब्राउज़र में टाइप करें।</li>
            <li><b>मल्टी-फैक्टर ऑथेंटिकेशन (एमएफए) का उपयोग करें</b>: यह आपके खातों में सुरक्षा की एक अतिरिक्त परत जोड़ता है।</li>
            <li><b>फिशिंग प्रयासों की रिपोर्ट करें</b>: संदिग्ध ईमेल को अपने ईमेल प्रदाता या प्रतिरूपित की जा रही कंपनी को अग्रेषित करें।</li>
          </ol>`,
          pa: `
          <h1>ਫਿਸ਼ਿੰਗ ਘੁਟਾਲੇ: ਕੀ ਵੇਖਣਾ ਹੈ</h1>
          <p>ਫਿਸ਼ਿੰਗ ਇੱਕ ਧੋਖੇਬਾਜ਼ ਅਭਿਆਸ ਹੈ ਜਿਸਦੀ ਵਰਤੋਂ ਸਾਈਬਰ ਅਪਰਾਧੀ ਤੁਹਾਨੂੰ ਪਾਸਵਰਡ, ਬੈਂਕ ਵੇਰਵੇ, ਅਤੇ ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਨੰਬਰ ਵਰਗੀ ਸੰਵੇਦਨਸ਼ੀਲ ਜਾਣਕਾਰੀ ਦਾ ਖੁਲਾਸਾ ਕਰਨ ਲਈ ਕਰਦੇ ਹਨ।</p>
          <h2>ਆਮ ਲਾਲ ਝੰਡੇ</h2>
          <ul>
            <li><b>ਅਤਿ ਜ਼ਰੂਰੀ ਜਾਂ ਧਮਕੀ ਭਰੀ ਭਾਸ਼ਾ</b>: ਘੁਟਾਲੇਬਾਜ਼ ਅਕਸਰ ਤੁਹਾਨੂੰ ਬਿਨਾਂ ਸੋਚੇ-ਸਮਝੇ ਕੰਮ ਕਰਨ ਲਈ ਧਮਕੀਆਂ ਜਾਂ ਅਤਿ ਜ਼ਰੂਰੀ ਦੀ ਭਾਵਨਾ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਨ।</li>
            <li><b>ਸਪੈਲਿੰਗ ਅਤੇ ਵਿਆਕਰਨ ਦੀਆਂ ਗਲਤੀਆਂ</b>: ਜਾਇਜ਼ ਕੰਪਨੀਆਂ ਸ਼ਾਇਦ ਹੀ ਗਲਤੀਆਂ ਵਾਲੇ ਈਮੇਲ ਭੇਜਦੀਆਂ ਹਨ।</li>
            <li><b>ਸ਼ੱਕੀ ਲਿੰਕ</b>: URL ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਲਿੰਕਾਂ 'ਤੇ ਹੋਵਰ ਕਰੋ। ਜੇਕਰ ਇਹ ਕੰਪਨੀ ਦੀ ਅਧਿਕਾਰਤ ਵੈੱਬਸਾਈਟ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ, ਤਾਂ ਇਸ 'ਤੇ ਕਲਿੱਕ ਨਾ ਕਰੋ।</li>
            <li><b>ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਲਈ ਬੇਨਤੀਆਂ</b>: ਕਿਸੇ ਵੀ ਈਮੇਲ ਜਾਂ ਸੁਨੇਹੇ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ ਜੋ ਤੁਹਾਡੇ ਪਾਸਵਰਡ, ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਨੰਬਰ, ਜਾਂ ਹੋਰ ਨਿੱਜੀ ਡੇਟਾ ਲਈ ਪੁੱਛਦਾ ਹੈ।</li>
          </ul>
          <h2>ਆਪਣੇ ਆਪ ਨੂੰ ਕਿਵੇਂ ਬਚਾਉਣਾ ਹੈ</h2>
          <ol>
            <li><b>ਭੇਜਣ ਵਾਲੇ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਕਰੋ</b>: ਹਮੇਸ਼ਾ ਭੇਜਣ ਵਾਲੇ ਦੇ ਈਮੇਲ ਪਤੇ ਦੀ ਜਾਂਚ ਕਰੋ। ਇਹ ਅਧਿਕਾਰਤ ਡੋਮੇਨ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।</li>
            <li><b>ਲਿੰਕਾਂ 'ਤੇ ਕਲਿੱਕ ਕਰਨ ਤੋਂ ਬਚੋ</b>: ਕਿਸੇ ਲਿੰਕ 'ਤੇ ਕਲਿੱਕ ਕਰਨ ਦੀ ਬਜਾਏ, ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੈੱਬਸਾਈਟ ਦਾ ਪਤਾ ਖੁਦ ਟਾਈਪ ਕਰੋ।</li>
            <li><b>ਮਲਟੀ-ਫੈਕਟਰ ਪ੍ਰਮਾਣਿਕਤਾ (MFA) ਦੀ ਵਰਤੋਂ ਕਰੋ</b>: ਇਹ ਤੁਹਾਡੇ ਖਾਤਿਆਂ ਵਿੱਚ ਸੁਰੱਖਿਆ ਦੀ ਇੱਕ ਵਾਧੂ ਪਰਤ ਜੋੜਦਾ ਹੈ।</li>
            <li><b>ਫਿਸ਼ਿੰਗ ਕੋਸ਼ਿਸ਼ਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ</b>: ਸ਼ੱਕੀ ਈਮੇਲਾਂ ਨੂੰ ਆਪਣੇ ਈਮੇਲ ਪ੍ਰਦਾਤਾ ਜਾਂ ਜਿਸ ਕੰਪਨੀ ਦਾ ਭੇਸ ਧਾਰਿਆ ਜਾ ਰਿਹਾ ਹੈ, ਨੂੰ ਅੱਗੇ ਭੇਜੋ।</li>
          </ol>`,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'How to Spot a Phishing Email',
        videoDescription: 'A detailed video guide on protecting yourself from phishing scams.',
        difficulty: 'beginner',
        estimatedTime: 10,
        tags: ['phishing', 'scam', 'security', 'cybersecurity'],
      },
      {
        _id: 'fa-test2',
        title: {
          en: "Online Shopping Fraud",
          hi: "ऑनलाइन खरीदारी धोखाधड़ी",
          pa: "ਔਨਲਾਈਨ ਖਰੀਦਦਾਰੀ ਧੋਖਾਧੜੀ"
        },
        description: {
          en: "Protect yourself from fraudulent e-commerce websites and sellers.",
          hi: "धोखाधड़ी वाली ई-कॉमर्स वेबसाइटों और विक्रेताओं से खुद को बचाएं।",
          pa: "ਧੋਖੇਬਾਜ਼ ਈ-ਕਾਮਰਸ ਵੈੱਬਸਾਈਟਾਂ ਅਤੇ ਵਿਕਰੇਤਾਵਾਂ ਤੋਂ ਆਪਣੇ ਆਪ ਨੂੰ ਬਚਾਓ।"
        },
        content: {
          en: "Online shopping fraud involves deceptive practices used by criminals to steal money or information during online purchases.",
          hi: "ऑनलाइन खरीदारी धोखाधड़ी में ऑनलाइन खरीद के दौरान पैसे या जानकारी चुराने के लिए अपराधियों द्वारा उपयोग की जाने वाली भ्रामक प्रथाएं शामिल हैं।",
          pa: "ਔਨਲਾਈਨ ਖਰੀਦਦਾਰੀ ਧੋਖਾਧੜੀ ਵਿੱਚ ਔਨਲਾਈਨ ਖਰੀਦਾਂ ਦੌਰਾਨ ਪੈਸੇ ਜਾਂ ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰਨ ਲਈ ਅਪਰਾਧੀਆਂ ਦੁਆਰਾ ਵਰਤੀਆਂ ਜਾਂਦੀਆਂ ਧੋਖੇਬਾਜ਼ ਪ੍ਰਥਾਵਾਂ ਸ਼ਾਮਲ ਹਨ।"
        },
        detailedContent: {
          en: `
          <h1>Online Shopping Fraud</h1>
          <p>Fraudulent online sellers and websites are a major risk. Here's how to shop safely online:</p>
          <h2>Signs of a Fake Website</h2>
          <ul>
            <li><b>No SSL Certificate</b>: Look for a padlock icon or 'https://' in the URL. If it's missing, the site is not secure.</li>
            <li><b>Unbelievable Deals</b>: If a deal seems too good to be true, it probably is.</li>
            <li><b>Poor Design and Content</b>: Websites with low-quality images, bad grammar, and no contact information are often fake.</li>
          </ul>
          <h2>Safe Shopping Practices</h2>
          <ol>
            <li><b>Use Trusted Retailers</b>: Stick to well-known e-commerce platforms.</li>
            <li><b>Check Reviews</b>: Look for customer reviews of the website or seller before making a purchase.</li>
            <li><b>Use Secure Payment Methods</b>: Use credit cards or secure payment gateways like PayPal, which offer buyer protection.</li>
          </ol>`,
          hi: `
          <h1>ऑनलाइन खरीदारी धोखाधड़ी</h1>
          <p>धोखाधड़ी वाले ऑनलाइन विक्रेता और वेबसाइट एक बड़ा जोखिम हैं। यहां सुरक्षित रूप से ऑनलाइन खरीदारी कैसे करें:</p>
          <h2>नकली वेबसाइट के संकेत</h2>
          <ul>
            <li><b>कोई SSL प्रमाणपत्र नहीं</b>: URL में पैडलॉक आइकन या 'https://' देखें। यदि यह अनुपस्थित है, तो साइट सुरक्षित नहीं है।</li>
            <li><b>अविश्वसनीय सौदे</b>: यदि कोई सौदा इतना अच्छा लगता है कि सच होना मुश्किल है, तो शायद वह है।</li>
            <li><b>खराब डिजाइन और सामग्री</b>: कम-गुणवत्ता वाली छवियों, खराब व्याकरण और कोई संपर्क जानकारी वाली वेबसाइटें अक्सर नकली होती हैं।</li>
          </ul>
          <h2>सुरक्षित खरीदारी अभ्यास</h2>
          <ol>
            <li><b>विश्वसनीय खुदरा विक्रेताओं का उपयोग करें</b>: अच्छी तरह से ज्ञात ई-कॉमर्स प्लेटफार्मों से जुड़े रहें।</li>
            <li><b>समीक्षाएं जांचें</b>: खरीदारी करने से पहले वेबसाइट या विक्रेता की ग्राहक समीक्षाएं देखें।</li>
            <li><b>सुरक्षित भुगतान विधियों का उपयोग करें</b>: क्रेडिट कार्ड या पेपैल जैसे सुरक्षित भुगतान गेटवे का उपयोग करें, जो खरीदार को सुरक्षा प्रदान करते हैं।</li>
          </ol>`,
          pa: `
          <h1>ਔਨਲਾਈਨ ਖਰੀਦਦਾਰੀ ਧੋਖਾਧੜੀ</h1>
          <p>ਧੋਖੇਬਾਜ਼ ਔਨਲਾਈਨ ਵਿਕਰੇਤਾ ਅਤੇ ਵੈੱਬਸਾਈਟਾਂ ਇੱਕ ਵੱਡਾ ਜੋਖਮ ਹਨ। ਇੱਥੇ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਔਨਲਾਈਨ ਖਰੀਦਦਾਰੀ ਕਿਵੇਂ ਕਰਨੀ ਹੈ:</p>
          <h2>ਨਕਲੀ ਵੈੱਬਸਾਈਟ ਦੇ ਸੰਕੇਤ</h2>
          <ul>
            <li><b>ਕੋਈ SSL ਸਰਟੀਫਿਕੇਟ ਨਹੀਂ</b>: URL ਵਿੱਚ ਇੱਕ ਪੈਡਲੌਕ ਆਈਕਨ ਜਾਂ 'https://' ਦੀ ਭਾਲ ਕਰੋ। ਜੇਕਰ ਇਹ ਗੁੰਮ ਹੈ, ਤਾਂ ਸਾਈਟ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੈ।</li>
            <li><b>ਅਵਿਸ਼ਵਾਸ਼ਯੋਗ ਸੌਦੇ</b>: ਜੇਕਰ ਕੋਈ ਸੌਦਾ ਇੰਨਾ ਵਧੀਆ ਲੱਗਦਾ ਹੈ ਕਿ ਸੱਚ ਹੋਣਾ ਮੁਸ਼ਕਲ ਹੈ, ਤਾਂ ਇਹ ਸ਼ਾਇਦ ਹੈ।</li>
            <li><b>ਮਾੜਾ ਡਿਜ਼ਾਈਨ ਅਤੇ ਸਮੱਗਰੀ</b>: ਘੱਟ-ਗੁਣਵੱਤਾ ਵਾਲੀਆਂ ਤਸਵੀਰਾਂ, ਮਾੜੇ ਵਿਆਕਰਨ, ਅਤੇ ਕੋਈ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਵਾਲੀਆਂ ਵੈੱਬਸਾਈਟਾਂ ਅਕਸਰ ਨਕਲੀ ਹੁੰਦੀਆਂ ਹਨ।</li>
          </ul>
          <h2>ਸੁਰੱਖਿਅਤ ਖਰੀਦਦਾਰੀ ਅਭਿਆਸ</h2>
          <ol>
            <li><b>ਭਰੋਸੇਯੋਗ ਰਿਟੇਲਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ</b>: ਚੰਗੀ ਤਰ੍ਹਾਂ ਜਾਣੇ-ਪਛਾਣੇ ਈ-ਕਾਮਰਸ ਪਲੇਟਫਾਰਮਾਂ ਨਾਲ ਜੁੜੇ ਰਹੋ।</li>
            <li><b>ਸਮੀਖਿਆਵਾਂ ਦੀ ਜਾਂਚ ਕਰੋ</b>: ਖਰੀਦਦਾਰੀ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਵੈੱਬਸਾਈਟ ਜਾਂ ਵਿਕਰੇਤਾ ਦੀਆਂ ਗਾਹਕ ਸਮੀਖਿਆਵਾਂ ਵੇਖੋ।</li>
            <li><b>ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਵਿਧੀਆਂ ਦੀ ਵਰਤੋਂ ਕਰੋ</b>: ਕ੍ਰੈਡਿਟ ਕਾਰਡਾਂ ਜਾਂ ਪੇਪਾਲ ਵਰਗੇ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਗੇਟਵੇ ਦੀ ਵਰਤੋਂ ਕਰੋ, ਜੋ ਖਰੀਦਦਾਰ ਨੂੰ ਸੁਰੱਖਿਆ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ।</li>
          </ol>`,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'Stay Safe While Shopping Online',
        videoDescription: 'Tips and tricks to avoid getting scammed on e-commerce sites.',
        difficulty: 'intermediate',
        estimatedTime: 15,
        tags: ['online-shopping', 'fraud', 'e-commerce', 'safety'],
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
          <RenderHtml
            contentWidth={width}
            source={{ html: item.title?.[language] || item.title?.en }}
            tagsStyles={{ b: styles.contentTitle, h1: styles.contentTitle, p: styles.contentTitle }}
          />
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
        <ActivityIndicator size="large" color="#F44336" />
        <Text style={styles.loadingText}>Loading Fraud Awareness content...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>🚨 Fraud Awareness</Text>
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
        <TouchableOpacity style={styles.headerRefreshButton} onPress={fetchFraudAwarenessContent}>
          <Text style={styles.headerRefreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>
      
      {learningContent.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Content Available</Text>
          <Text style={styles.emptyDescription}>
            Learning content will appear here once available.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchFraudAwarenessContent}>
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
    backgroundColor: '#FBE8E7', // Soft red background
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FBE8E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#D32F2F',
  },
  header: {
    backgroundColor: '#D32F2F', // Red header
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
    color: '#D32F2F',
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
    backgroundColor: '#E53935', // Red video button
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#E53935',
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
    backgroundColor: '#FBE8E7',
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
    color: '#D32F2F',
    fontWeight: '600',
  },
  headerVideoButton: {
    backgroundColor: '#E53935',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
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
    backgroundColor: '#FFEBEE', // Lighter red background
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
    color: '#D32F2F',
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
    color: '#D32F2F',
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
    backgroundColor: '#FFCDD2', // Lighter red
    color: '#B71C1C', // Darker red
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
    backgroundColor: '#FBE8E7',
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
    backgroundColor: '#D32F2F',
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