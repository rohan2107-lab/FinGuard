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

export default function TaxPlanningModule() {
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
    fetchTaxPlanningContent();
  }, [language]); // Re-fetch content when language changes

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
        setLearningContent(getTestData());
      }
    } catch (error) {
      console.error('Error fetching Tax Planning content:', error);
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
        _id: 'tax-test1',
        title: {
          en: "Understanding Income Tax Basics",
          hi: "आयकर की मूल बातें समझना",
          pa: "ਆਮਦਨ ਕਰ ਦੇ ਮੂਲ ਸਿਧਾਂਤਾਂ ਨੂੰ ਸਮਝਣਾ"
        },
        description: {
          en: "A beginner's guide to how income tax works and what it means for you.",
          hi: "आयकर कैसे काम करता है और इसका आपके लिए क्या मतलब है, इसके लिए एक शुरुआती मार्गदर्शिका।",
          pa: "ਆਮਦਨ ਕਰ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਤੁਹਾਡੇ ਲਈ ਇਸਦਾ ਕੀ ਮਤਲਬ ਹੈ, ਲਈ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਗਾਈਡ।"
        },
        content: {
          en: "Income tax is a mandatory contribution to the government from your earnings. Learn the basics of how it is calculated.",
          hi: "आयकर आपकी कमाई से सरकार को एक अनिवार्य योगदान है। जानें कि इसकी गणना कैसे की जाती है।",
          pa: "ਆਮਦਨ ਕਰ ਤੁਹਾਡੀ ਕਮਾਈ ਤੋਂ ਸਰਕਾਰ ਨੂੰ ਇੱਕ ਲਾਜ਼ਮੀ ਯੋਗਦਾਨ ਹੈ। ਜਾਣੋ ਕਿ ਇਸਦੀ ਗਣਨਾ ਕਿਵੇਂ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"
        },
        detailedContent: {
          en: `
          <h1>Understanding Income Tax Basics</h1>
          <p>Income tax is a tax imposed on the income of individuals or corporations. In simple terms, it's a portion of your earnings that you pay to the government.</p>
          <h2>Key Concepts</h2>
          <ul>
            <li><b>Taxable Income</b>: This is the portion of your gross income that is subject to taxation after deductions and exemptions.</li>
            <li><b>Tax Slabs</b>: The income tax system is progressive, meaning higher earners pay a higher percentage of tax. These different tax brackets are known as tax slabs.</li>
            <li><b>Deductions</b>: Expenses or investments that can be subtracted from your gross income to lower your taxable income (e.g., investments under Section 80C).</li>
            <li><b>Exemptions</b>: Incomes that are not included in your taxable income (e.g., House Rent Allowance in some cases).</li>
          </ul>
          <h2>How to Calculate Your Tax</h2>
          <ol>
            <li><b>Determine your Gross Total Income</b>: Add up all income sources (salary, business, investments, etc.).</li>
            <li><b>Subtract Exemptions and Deductions</b>: Use available sections like 80C, 80D, etc., to reduce your taxable income.</li>
            <li><b>Apply the Correct Tax Slab</b>: Use the current year's tax slabs to calculate the final tax amount on your remaining income.</li>
          </ol>
          <i>Disclaimer: Tax laws are complex and subject to change. Always consult a professional financial advisor for personalized tax advice.</i>`,
          hi: `
          <h1>आयकर की मूल बातें समझना</h1>
          <p>आयकर व्यक्तियों या निगमों की आय पर लगाया जाने वाला कर है। सरल शब्दों में, यह आपकी कमाई का एक हिस्सा है जो आप सरकार को चुकाते हैं।</p>
          <h2>मुख्य अवधारणाएं</h2>
          <ul>
            <li><b>कर योग्य आय</b>: यह आपकी सकल आय का वह हिस्सा है जिस पर कटौतियों और छूटों के बाद कर लगाया जाता है।</li>
            <li><b>टैक्स स्लैब</b>: आयकर प्रणाली प्रगतिशील है, जिसका अर्थ है कि उच्च आय वाले लोग कर का उच्च प्रतिशत भुगतान करते हैं। इन विभिन्न कर ब्रैकेटों को टैक्स स्लैब के रूप में जाना जाता है।</li>
            <li><b>कटौतियां</b>: व्यय या निवेश जिन्हें आपकी कर योग्य आय को कम करने के लिए आपकी सकल आय से घटाया जा सकता है (उदाहरण के लिए, धारा 80सी के तहत निवेश)।</li>
            <li><b>छूट</b>: वे आय जिन्हें आपकी कर योग्य आय में शामिल नहीं किया जाता है (उदाहरण के लिए, कुछ मामलों में मकान किराया भत्ता)।</li>
          </ul>
          <h2>अपने कर की गणना कैसे करें</h2>
          <ol>
            <li><b>अपनी सकल कुल आय निर्धारित करें</b>: सभी आय स्रोतों (वेतन, व्यवसाय, निवेश, आदि) को जोड़ें।</li>
            <li><b>छूट और कटौतियां घटाएं</b>: अपनी कर योग्य आय को कम करने के लिए 80सी, 80डी, आदि जैसी उपलब्ध धाराओं का उपयोग करें।</li>
            <li><b>सही टैक्स स्लैब लागू करें</b>: अपनी शेष आय पर अंतिम कर राशि की गणना करने के लिए चालू वर्ष के टैक्स स्लैब का उपयोग करें।</li>
          </ol>
          <i>अस्वीकरण: कर कानून जटिल हैं और परिवर्तन के अधीन हैं। व्यक्तिगत कर सलाह के लिए हमेशा एक पेशेवर वित्तीय सलाहकार से परामर्श करें।</i>`,
          pa: `
          <h1>ਆਮਦਨ ਕਰ ਦੇ ਮੂਲ ਸਿਧਾਂਤਾਂ ਨੂੰ ਸਮਝਣਾ</h1>
          <p>ਆਮਦਨ ਕਰ ਵਿਅਕਤੀਆਂ ਜਾਂ ਕਾਰਪੋਰੇਸ਼ਨਾਂ ਦੀ ਆਮਦਨ 'ਤੇ ਲਗਾਇਆ ਗਿਆ ਇੱਕ ਟੈਕਸ ਹੈ। ਸਧਾਰਨ ਸ਼ਬਦਾਂ ਵਿੱਚ, ਇਹ ਤੁਹਾਡੀ ਕਮਾਈ ਦਾ ਇੱਕ ਹਿੱਸਾ ਹੈ ਜੋ ਤੁਸੀਂ ਸਰਕਾਰ ਨੂੰ ਅਦਾ ਕਰਦੇ ਹੋ।</p>
          <h2>ਮੁੱਖ ਧਾਰਨਾਵਾਂ</h2>
          <ul>
            <li><b>ਟੈਕਸਯੋਗ ਆਮਦਨ</b>: ਇਹ ਤੁਹਾਡੀ ਕੁੱਲ ਆਮਦਨ ਦਾ ਉਹ ਹਿੱਸਾ ਹੈ ਜੋ ਕਟੌਤੀਆਂ ਅਤੇ ਛੋਟਾਂ ਤੋਂ ਬਾਅਦ ਟੈਕਸ ਦੇ ਅਧੀਨ ਹੈ।</li>
            <li><b>ਟੈਕਸ ਸਲੈਬ</b>: ਆਮਦਨ ਕਰ ਪ੍ਰਣਾਲੀ ਪ੍ਰਗਤੀਸ਼ੀਲ ਹੈ, ਜਿਸਦਾ ਮਤਲਬ ਹੈ ਕਿ ਵੱਧ ਕਮਾਈ ਕਰਨ ਵਾਲੇ ਟੈਕਸ ਦਾ ਵੱਧ ਪ੍ਰਤੀਸ਼ਤ ਅਦਾ ਕਰਦੇ ਹਨ। ਇਹਨਾਂ ਵੱਖ-ਵੱਖ ਟੈਕਸ ਬਰੈਕਟਾਂ ਨੂੰ ਟੈਕਸ ਸਲੈਬ ਵਜੋਂ ਜਾਣਿਆ ਜਾਂਦਾ ਹੈ।</li>
            <li><b>ਕਟੌਤੀਆਂ</b>: ਖਰਚੇ ਜਾਂ ਨਿਵੇਸ਼ ਜੋ ਤੁਹਾਡੀ ਟੈਕਸਯੋਗ ਆਮਦਨ ਨੂੰ ਘਟਾਉਣ ਲਈ ਤੁਹਾਡੀ ਕੁੱਲ ਆਮਦਨ ਵਿੱਚੋਂ ਘਟਾਏ ਜਾ ਸਕਦੇ ਹਨ (ਜਿਵੇਂ, ਸੈਕਸ਼ਨ 80C ਦੇ ਅਧੀਨ ਨਿਵੇਸ਼)।</li>
            <li><b>ਛੋਟਾਂ</b>: ਉਹ ਆਮਦਨ ਜੋ ਤੁਹਾਡੀ ਟੈਕਸਯੋਗ ਆਮਦਨ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਹੁੰਦੀਆਂ ਹਨ (ਜਿਵੇਂ, ਕੁਝ ਮਾਮਲਿਆਂ ਵਿੱਚ ਹਾਊਸ ਰੈਂਟ ਅਲਾਊਂਸ)।</li>
          </ul>
          <h2>ਆਪਣੇ ਟੈਕਸ ਦੀ ਗਣਨਾ ਕਿਵੇਂ ਕਰੀਏ</h2>
          <ol>
            <li><b>ਆਪਣੀ ਕੁੱਲ ਕੁੱਲ ਆਮਦਨ ਨਿਰਧਾਰਤ ਕਰੋ</b>: ਸਾਰੇ ਆਮਦਨ ਸਰੋਤਾਂ (ਤਨਖਾਹ, ਕਾਰੋਬਾਰ, ਨਿਵੇਸ਼, ਆਦਿ) ਨੂੰ ਜੋੜੋ।</li>
            <li><b>ਛੋਟਾਂ ਅਤੇ ਕਟੌਤੀਆਂ ਘਟਾਓ</b>: ਆਪਣੀ ਟੈਕਸਯੋਗ ਆਮਦਨ ਨੂੰ ਘਟਾਉਣ ਲਈ 80C, 80D, ਆਦਿ ਵਰਗੇ ਉਪਲਬਧ ਸੈਕਸ਼ਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।</li>
            <li><b>ਸਹੀ ਟੈਕਸ ਸਲੈਬ ਲਾਗੂ ਕਰੋ</b>: ਆਪਣੀ ਬਾਕੀ ਬਚੀ ਆਮਦਨ 'ਤੇ ਅੰਤਮ ਟੈਕਸ ਦੀ ਰਕਮ ਦੀ ਗਣਨਾ ਕਰਨ ਲਈ ਮੌਜੂਦਾ ਸਾਲ ਦੇ ਟੈਕਸ ਸਲੈਬਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।</li>
          </ol>
          <i>ਬੇਦਾਅਵਾ: ਟੈਕਸ ਕਾਨੂੰਨ ਗੁੰਝਲਦਾਰ ਹਨ ਅਤੇ ਬਦਲਣ ਦੇ ਅਧੀਨ ਹਨ। ਵਿਅਕਤੀਗਤ ਟੈਕਸ ਸਲਾਹ ਲਈ ਹਮੇਸ਼ਾ ਇੱਕ ਪੇਸ਼ੇਵਰ ਵਿੱਤੀ ਸਲਾਹਕਾਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।</i>`,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'Income Tax Explained for Beginners',
        videoDescription: 'A simple guide to understanding the fundamentals of income tax.',
        difficulty: 'beginner',
        estimatedTime: 20,
        tags: ['tax', 'income-tax', 'basics', 'beginners'],
      },
      {
        _id: 'tax-test2',
        title: {
          en: "Common Tax-Saving Investments",
          hi: "सामान्य कर-बचत निवेश",
          pa: "ਆਮ ਟੈਕਸ-ਬਚਤ ਨਿਵੇਸ਼"
        },
        description: {
          en: "Explore popular investment options that help you reduce your tax liability.",
          hi: "लोकप्रिय निवेश विकल्पों का अन्वेषण करें जो आपकी कर देयता को कम करने में आपकी मदद करते हैं।",
          pa: "ਪ੍ਰਸਿੱਧ ਨਿਵੇਸ਼ ਵਿਕਲਪਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ ਜੋ ਤੁਹਾਡੀ ਟੈਕਸ ਦੇਣਦਾਰੀ ਨੂੰ ਘਟਾਉਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰਦੇ ਹਨ।"
        },
        content: {
          en: "Tax-saving investments are financial instruments that allow you to claim deductions on your income tax.",
          hi: "कर-बचत निवेश वित्तीय उपकरण हैं जो आपको अपने आयकर पर कटौती का दावा करने की अनुमति देते हैं।",
          pa: "ਟੈਕਸ-ਬਚਤ ਨਿਵੇਸ਼ ਵਿੱਤੀ ਸਾਧਨ ਹਨ ਜੋ ਤੁਹਾਨੂੰ ਤੁਹਾਡੀ ਆਮਦਨ ਕਰ 'ਤੇ ਕਟੌਤੀਆਂ ਦਾ ਦਾਅਵਾ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦੇ ਹਨ।"
        },
        detailedContent: {
          en: `
          <h1>Common Tax-Saving Investments</h1>
          <p>Tax planning is an essential part of financial management. Here are some popular investment options that can help you save on taxes:</p>
          <h2>Section 80C Deductions</h2>
          <p>This is one of the most widely used sections for tax deductions, allowing a maximum deduction of up to ₹1.5 lakh per year. Common instruments include:</p>
          <ul>
            <li><b>EPF/PPF</b>: Employee Provident Fund and Public Provident Fund are safe, long-term options.</li>
            <li><b>ELSS</b>: Equity-Linked Savings Schemes are mutual funds with a 3-year lock-in period.</li>
            <li><b>Life Insurance Premiums</b>: Premiums paid for a life insurance policy are eligible for deduction.</li>
            <li><b>Home Loan Principal Repayment</b>: The principal amount of your home loan can be deducted.</li>
          </ul>
          <h2>Other Important Sections</h2>
          <ul>
            <li><b>Section 80D</b>: Deductions for health insurance premiums.</li>
            <li><b>Section 80E</b>: Deductions for interest paid on an education loan.</li>
            <li><b>Section 24</b>: Deductions for interest on a home loan.</li>
          </ul>
          <p>By strategically using these tax-saving options, you can significantly reduce your tax burden while building your wealth.</p>`,
          hi: `
          <h1>सामान्य कर-बचत निवेश</h1>
          <p>कर नियोजन वित्तीय प्रबंधन का एक अनिवार्य हिस्सा है। यहां कुछ लोकप्रिय निवेश विकल्प दिए गए हैं जो आपको करों पर बचत करने में मदद कर सकते हैं:</p>
          <h2>धारा 80सी कटौतियां</h2>
          <p>यह कर कटौती के लिए सबसे व्यापक रूप से उपयोग की जाने वाली धाराओं में से एक है, जो प्रति वर्ष ₹1.5 लाख तक की अधिकतम कटौती की अनुमति देती है। सामान्य उपकरणों में शामिल हैं:</p>
          <ul>
            <li><b>ईपीएफ/पीपीएफ</b>: कर्मचारी भविष्य निधि और सार्वजनिक भविष्य निधि सुरक्षित, दीर्घकालिक विकल्प हैं।</li>
            <li><b>ईएलएसएस</b>: इक्विटी-लिंक्ड बचत योजनाएं 3 साल की लॉक-इन अवधि वाले म्यूचुअल फंड हैं।</li>
            <li><b>जीवन बीमा प्रीमियम</b>: जीवन बीमा पॉलिसी के लिए भुगतान किए गए प्रीमियम कटौती के लिए योग्य हैं।</li>
            <li><b>गृह ऋण मूलधन पुनर्भुगतान</b>: आपके गृह ऋण की मूल राशि में कटौती की जा सकती है।</li>
          </ul>
          <h2>अन्य महत्वपूर्ण धाराएं</h2>
          <ul>
            <li><b>धारा 80डी</b>: स्वास्थ्य बीमा प्रीमियम के लिए कटौती।</li>
            <li><b>धारा 80ई</b>: शिक्षा ऋण पर भुगतान किए गए ब्याज के लिए कटौती।</li>
            <li><b>धारा 24</b>: गृह ऋण पर ब्याज के लिए कटौती।</li>
          </ul>
          <p>इन कर-बचत विकल्पों का रणनीतिक रूप से उपयोग करके, आप अपनी संपत्ति का निर्माण करते हुए अपने कर बोझ को काफी कम कर सकते हैं।</p>`,
          pa: `
          <h1>ਆਮ ਟੈਕਸ-ਬਚਤ ਨਿਵੇਸ਼</h1>
          <p>ਟੈਕਸ ਯੋਜਨਾਬੰਦੀ ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ ਦਾ ਇੱਕ ਜ਼ਰੂਰੀ ਹਿੱਸਾ ਹੈ। ਇੱਥੇ ਕੁਝ ਪ੍ਰਸਿੱਧ ਨਿਵੇਸ਼ ਵਿਕਲਪ ਹਨ ਜੋ ਤੁਹਾਡੇ ਟੈਕਸਾਂ ਨੂੰ ਬਚਾਉਣ ਵਿੱਚ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ:</p>
          <h2>ਸੈਕਸ਼ਨ 80C ਕਟੌਤੀਆਂ</h2>
          <p>ਇਹ ਟੈਕਸ ਕਟੌਤੀਆਂ ਲਈ ਸਭ ਤੋਂ ਵੱਧ ਵਰਤੇ ਜਾਣ ਵਾਲੇ ਸੈਕਸ਼ਨਾਂ ਵਿੱਚੋਂ ਇੱਕ ਹੈ, ਜੋ ਪ੍ਰਤੀ ਸਾਲ ₹1.5 ਲੱਖ ਤੱਕ ਦੀ ਅਧਿਕਤਮ ਕਟੌਤੀ ਦੀ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ। ਆਮ ਸਾਧਨਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ:</p>
          <ul>
            <li><b>EPF/PPF</b>: ਕਰਮਚਾਰੀ ਭਵਿੱਖ ਨਿਧੀ ਅਤੇ ਜਨਤਕ ਭਵਿੱਖ ਨਿਧੀ ਸੁਰੱਖਿਅਤ, ਲੰਬੀ-ਮਿਆਦ ਦੇ ਵਿਕਲਪ ਹਨ।</li>
            <li><b>ELSS</b>: ਇਕੁਇਟੀ-ਲਿੰਕਡ ਸੇਵਿੰਗਜ਼ ਸਕੀਮਾਂ 3-ਸਾਲ ਦੀ ਲਾਕ-ਇਨ ਮਿਆਦ ਵਾਲੇ ਮਿਊਚਲ ਫੰਡ ਹਨ।</li>
            <li><b>ਜੀਵਨ ਬੀਮਾ ਪ੍ਰੀਮੀਅਮ</b>: ਜੀਵਨ ਬੀਮਾ ਪਾਲਿਸੀ ਲਈ ਅਦਾ ਕੀਤੇ ਪ੍ਰੀਮੀਅਮ ਕਟੌਤੀ ਲਈ ਯੋਗ ਹਨ।</li>
            <li><b>ਹੋਮ ਲੋਨ ਮੂਲ ਦੀ ਮੁੜ-ਅਦਾਇਗੀ</b>: ਤੁਹਾਡੇ ਹੋਮ ਲੋਨ ਦੀ ਮੂਲ ਰਕਮ ਨੂੰ ਘਟਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।</li>
          </ul>
          <h2>ਹੋਰ ਮਹੱਤਵਪੂਰਨ ਸੈਕਸ਼ਨ</h2>
          <ul>
            <li><b>ਸੈਕਸ਼ਨ 80D</b>: ਸਿਹਤ ਬੀਮਾ ਪ੍ਰੀਮੀਅਮਾਂ ਲਈ ਕਟੌਤੀਆਂ।</li>
            <li><b>ਸੈਕਸ਼ਨ 80E</b>: ਸਿੱਖਿਆ ਕਰਜ਼ੇ 'ਤੇ ਅਦਾ ਕੀਤੇ ਗਏ ਵਿਆਜ ਲਈ ਕਟੌਤੀਆਂ।</li>
            <li><b>ਸੈਕਸ਼ਨ 24</b>: ਹੋਮ ਲੋਨ 'ਤੇ ਵਿਆਜ ਲਈ ਕਟੌਤੀਆਂ।</li>
          </ul>
          <p>ਇਹਨਾਂ ਟੈਕਸ-ਬਚਤ ਵਿਕਲਪਾਂ ਦੀ ਰਣਨੀਤਕ ਤੌਰ 'ਤੇ ਵਰਤੋਂ ਕਰਕੇ, ਤੁਸੀਂ ਆਪਣੀ ਦੌਲਤ ਬਣਾਉਂਦੇ ਹੋਏ ਆਪਣੇ ਟੈਕਸ ਦੇ ਬੋਝ ਨੂੰ ਕਾਫ਼ੀ ਘਟਾ ਸਕਦੇ ਹੋ।</p>`,
        },
        videoUrl: 'https://res.cloudinary.com/dn2bkta45/video/upload/v1755507891/videos/azfp76mopx9frgbnl2yg.mp4',
        videoTitle: 'Smart Tax Saving Strategies',
        videoDescription: 'A guide to tax-saving investments and how to choose the right ones.',
        difficulty: 'intermediate',
        estimatedTime: 25,
        tags: ['tax', 'investing', 'tax-saving', '80C'],
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
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading Tax Planning content...</Text>
      </SafeAreaView>
    );
  }

  if (viewMode === 'tutorial') {
    return renderTutorialContent();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>🗓️ Tax Planning</Text>
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
    </SafeAreaView>
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
    color: '#6A1B9A',
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