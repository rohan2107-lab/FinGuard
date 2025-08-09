import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';

const InvestmentBasics = () => {
  const navigation = useNavigation();
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [selectedLearning, setSelectedLearning] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [learningModalVisible, setLearningModalVisible] = useState(false);

  const investmentCategories = [
    {
      id: 1,
      title: "Stocks & Equity",
      icon: "📈",
      description: "Learn about stock market investing",
      riskLevel: "High",
      riskColor: "#ff5722",
      bgColor: "#e8f5e9",
      topics: ["What are Stocks?", "How to Buy Stocks", "Stock Analysis", "Market Trends"],
      potential: "8-15% annually",
      detailedInfo: {
        overview: "Stocks represent ownership shares in publicly traded companies. When you buy stocks, you become a partial owner of the company.",
        benefits: ["Potential for high returns", "Dividend income", "Liquidity", "Inflation hedge"],
        risks: ["Market volatility", "Company-specific risks", "Economic factors", "Regulatory changes"],
        whoShouldInvest: "Investors with high risk tolerance, long-term investment horizon, and good market knowledge.",
        minimumInvestment: "₹100 - ₹500 per share depending on stock price",
        taxImplications: "LTCG: 10% above ₹1 lakh, STCG: 15%"
      }
    },
    {
      id: 2,
      title: "Mutual Funds",
      icon: "🏦",
      description: "Diversified investment portfolios",
      riskLevel: "Medium",
      riskColor: "#ff9800",
      bgColor: "#e3f2fd",
      topics: ["Types of Funds", "NAV Basics", "Fund Selection", "Expense Ratios"],
      potential: "6-12% annually",
      detailedInfo: {
        overview: "Mutual funds pool money from multiple investors to invest in diversified portfolios of stocks, bonds, or other securities.",
        benefits: ["Professional management", "Diversification", "Low minimum investment", "Liquidity"],
        risks: ["Market risk", "Credit risk", "Interest rate risk", "Fund manager risk"],
        whoShouldInvest: "Beginners, investors seeking diversification, and those who prefer professional management.",
        minimumInvestment: "₹500 - ₹1000 for lump sum, ₹100 for SIP",
        taxImplications: "Equity funds: LTCG 10% above ₹1 lakh, STCG 15%. Debt funds: As per tax slab"
      }
    },
    {
      id: 3,
      title: "SIP Investment",
      icon: "💰",
      description: "Systematic Investment Planning",
      riskLevel: "Low-Medium",
      riskColor: "#10b981",
      bgColor: "#fff3e0",
      topics: ["SIP Benefits", "Amount Planning", "Duration Strategy", "Auto Investment"],
      potential: "7-14% annually",
      detailedInfo: {
        overview: "SIP allows you to invest a fixed amount regularly in mutual funds, helping build wealth through disciplined investing.",
        benefits: ["Rupee cost averaging", "Compounding benefits", "Disciplined investing", "Flexibility"],
        risks: ["Market volatility", "Fund performance risk", "Inflation risk", "Early exit charges"],
        whoShouldInvest: "All investors, especially beginners and those with regular income.",
        minimumInvestment: "₹100 per month",
        taxImplications: "Same as mutual funds based on holding period"
      }
    },
    {
      id: 4,
      title: "Gold Investment",
      icon: "🥇",
      description: "Traditional safe haven asset",
      riskLevel: "Low",
      riskColor: "#10b981",
      bgColor: "#fce4ec",
      topics: ["Physical Gold", "Gold ETFs", "Digital Gold", "Gold Bonds"],
      potential: "5-10% annually",
      detailedInfo: {
        overview: "Gold is considered a safe haven asset that helps preserve wealth and hedge against inflation.",
        benefits: ["Inflation hedge", "Portfolio diversification", "Liquidity", "Cultural significance"],
        risks: ["Price volatility", "Storage costs", "No regular income", "Making charges"],
        whoShouldInvest: "Conservative investors, those seeking portfolio diversification.",
        minimumInvestment: "₹1 for digital gold, ₹1000 for Gold ETFs",
        taxImplications: "LTCG: 20% with indexation (physical), 10% without indexation (ETF)"
      }
    },
    {
      id: 5,
      title: "Trading Basics",
      icon: "📊",
      description: "Active market participation",
      riskLevel: "Very High",
      riskColor: "#d32f2f",
      bgColor: "#f3e5f5",
      topics: ["Day Trading", "Technical Analysis", "Risk Management", "Trading Tools"],
      potential: "Variable (High Risk)",
      detailedInfo: {
        overview: "Trading involves buying and selling securities frequently to profit from short-term price movements.",
        benefits: ["Potential for quick profits", "Flexibility", "Market opportunities", "Skill development"],
        risks: ["High probability of losses", "Emotional stress", "Time intensive", "Transaction costs"],
        whoShouldInvest: "Experienced investors with high risk tolerance and adequate capital.",
        minimumInvestment: "₹10,000 - ₹25,000 for trading account",
        taxImplications: "STCG rates apply. Trading income taxed as business income"
      }
    },
    {
      id: 6,
      title: "Fixed Deposits",
      icon: "🏛️",
      description: "Safe guaranteed returns",
      riskLevel: "Very Low",
      riskColor: "#10b981",
      bgColor: "#e0f2f1",
      topics: ["FD Types", "Interest Rates", "Tax Benefits", "Laddering Strategy"],
      potential: "3-7% annually",
      detailedInfo: {
        overview: "Fixed Deposits offer guaranteed returns with capital protection, ideal for risk-averse investors.",
        benefits: ["Capital protection", "Guaranteed returns", "Predictable income", "Easy to understand"],
        risks: ["Inflation risk", "Opportunity cost", "Interest rate risk", "Liquidity constraints"],
        whoShouldInvest: "Conservative investors, senior citizens, emergency fund allocation.",
        minimumInvestment: "₹1,000 - ₹10,000 depending on bank",
        taxImplications: "Interest taxed as per income tax slab"
      }
    }
  ];

  const quickLearning = [
    {
      id: 1,
      title: "Risk vs Return",
      icon: "⚖️",
      duration: "5 min read",
      difficulty: "Beginner",
      content: {
        overview: "Understanding the fundamental relationship between risk and return is crucial for successful investing.",
        keyPoints: [
          "Higher potential returns typically come with higher risk",
          "Low-risk investments usually offer lower returns",
          "Diversification can help balance risk and return",
          "Your risk tolerance should match your investment choices"
        ],
        examples: [
          "FDs: Low risk, 3-7% returns",
          "Mutual Funds: Medium risk, 6-12% returns", 
          "Stocks: High risk, 8-15% returns",
          "Trading: Very high risk, variable returns"
        ],
        actionTips: [
          "Assess your risk tolerance before investing",
          "Don't chase high returns without understanding risks",
          "Start with low-risk investments and gradually increase",
          "Never invest money you can't afford to lose"
        ]
      }
    },
    {
      id: 2,
      title: "Compound Interest",
      icon: "🔄",
      duration: "7 min read",
      difficulty: "Beginner",
      content: {
        overview: "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it.",
        keyPoints: [
          "Interest earned on both principal and previously earned interest",
          "Time is the most important factor in compounding",
          "Small amounts invested early can grow significantly",
          "Regular investing amplifies compounding benefits"
        ],
        examples: [
          "₹1000 at 10% for 10 years = ₹2,594",
          "₹1000 at 10% for 20 years = ₹6,727",
          "₹1000 at 10% for 30 years = ₹17,449",
          "SIP ₹1000/month for 20 years at 12% = ₹9.9 lakhs"
        ],
        actionTips: [
          "Start investing as early as possible",
          "Be consistent with your investments",
          "Don't withdraw investments prematurely",
          "Choose investments that compound effectively"
        ]
      }
    },
    {
      id: 3,
      title: "Portfolio Diversification",
      icon: "🎯",
      duration: "10 min read",
      difficulty: "Intermediate",
      content: {
        overview: "Don't put all your eggs in one basket. Diversification is a key strategy to manage investment risk.",
        keyPoints: [
          "Spread investments across different asset classes",
          "Reduces overall portfolio risk",
          "Balances growth and stability",
          "Protects against sector-specific downturns"
        ],
        examples: [
          "60% equity, 30% debt, 10% gold allocation",
          "Invest across large-cap, mid-cap, small-cap stocks",
          "Mix of domestic and international funds",
          "Combination of growth and value investments"
        ],
        actionTips: [
          "Don't over-diversify - 15-20 stocks are sufficient",
          "Review and rebalance portfolio regularly",
          "Consider your age and risk tolerance",
          "Include different sectors and geographies"
        ]
      }
    }
  ];

  const investmentTools = [
    {
      id: 1,
      title: "SIP Calculator",
      icon: "🧮",
      description: "Calculate SIP returns",
      action: "calculator"
    },
    {
      id: 2,
      title: "Risk Profile",
      icon: "📋",
      description: "Assess your risk appetite",
      action: "assessment"
    },
    {
      id: 3,
      title: "Goal Planner",
      icon: "🎯",
      description: "Plan financial goals",
      action: "planner"
    },
    {
      id: 4,
      title: "Tax Calculator",
      icon: "💸",
      description: "Calculate investment tax",
      action: "tax"
    }
  ];

  const handleInvestmentPress = (investment) => {
    setSelectedInvestment(investment);
    setModalVisible(true);
  };

  const handleLearningPress = (learning) => {
    setSelectedLearning(learning);
    setLearningModalVisible(true);
  };

  const handleToolPress = (tool) => {
    switch(tool.action) {
      case 'calculator':
        // Navigate to calculator screen or show calculator
        Alert.alert("SIP Calculator", "Opening SIP Calculator...", [
          { text: "OK", onPress: () => console.log("Navigate to SIP Calculator") }
        ]);
        break;
      case 'assessment':
        Alert.alert("Risk Assessment", "Let's assess your risk profile!", [
          { text: "Start Assessment", onPress: () => console.log("Start Risk Assessment") },
          { text: "Cancel" }
        ]);
        break;
      case 'planner':
        Alert.alert("Goal Planner", "Plan your financial goals!", [
          { text: "Start Planning", onPress: () => console.log("Start Goal Planning") },
          { text: "Cancel" }
        ]);
        break;
      case 'tax':
        Alert.alert("Tax Calculator", "Calculate your investment taxes!", [
          { text: "Calculate", onPress: () => console.log("Open Tax Calculator") },
          { text: "Cancel" }
        ]);
        break;
    }
  };

  const handleStartLearning = () => {
    Alert.alert(
      "Start Learning Journey",
      "Choose your learning path:",
      [
        { text: "Beginner Course", onPress: () => console.log("Start Beginner Course") },
        { text: "Intermediate Course", onPress: () => console.log("Start Intermediate Course") },
        { text: "Advanced Course", onPress: () => console.log("Start Advanced Course") },
        { text: "Cancel" }
      ]
    );
  };

  const renderInvestmentCard = (investment) => (
    <Pressable 
      key={investment.id} 
      style={[styles.investmentCard, { backgroundColor: investment.bgColor }]}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      onPress={() => handleInvestmentPress(investment)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.investmentInfo}>
          <Text style={styles.investmentIcon}>{investment.icon}</Text>
          <View style={styles.investmentDetails}>
            <Text style={styles.investmentTitle}>{investment.title}</Text>
            <Text style={styles.investmentDescription}>{investment.description}</Text>
            <View style={styles.riskContainer}>
              <Text style={[styles.riskLevel, { color: investment.riskColor }]}>
                Risk: {investment.riskLevel}
              </Text>
              <Text style={styles.potential}>Returns: {investment.potential}</Text>
            </View>
          </View>
        </View>
        <Pressable 
          style={styles.learnButton}
          android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
          onPress={() => handleInvestmentPress(investment)}
        >
          <Text style={styles.learnText}>Learn</Text>
        </Pressable>
      </View>
      
      <View style={styles.topicsContainer}>
        <Text style={styles.topicsTitle}>Key Topics:</Text>
        <View style={styles.topicsList}>
          {investment.topics.map((topic, index) => (
            <View key={index} style={styles.topicChip}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );

  const renderInvestmentModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar backgroundColor="#10b981" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
        {selectedInvestment && (
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.modalTitleSection}>
              <Text style={styles.modalIcon}>{selectedInvestment.icon}</Text>
              <Text style={styles.modalTitle}>{selectedInvestment.title}</Text>
              <Text style={styles.modalSubtitle}>{selectedInvestment.description}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Overview</Text>
              <Text style={styles.sectionContent}>{selectedInvestment.detailedInfo.overview}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Benefits</Text>
              {selectedInvestment.detailedInfo.benefits.map((benefit, index) => (
                <Text key={index} style={styles.bulletPoint}>• {benefit}</Text>
              ))}
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Risks</Text>
              {selectedInvestment.detailedInfo.risks.map((risk, index) => (
                <Text key={index} style={styles.bulletPoint}>• {risk}</Text>
              ))}
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Who Should Invest</Text>
              <Text style={styles.sectionContent}>{selectedInvestment.detailedInfo.whoShouldInvest}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Minimum Investment</Text>
              <Text style={styles.sectionContent}>{selectedInvestment.detailedInfo.minimumInvestment}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Tax Implications</Text>
              <Text style={styles.sectionContent}>{selectedInvestment.detailedInfo.taxImplications}</Text>
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.actionButton} onPress={() => Alert.alert("Investment", "Ready to start investing?")}>
                <Text style={styles.actionButtonText}>Start Investing</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={() => Alert.alert("More Info", "Get expert advice")}>
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Get Expert Advice</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderLearningModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={learningModalVisible}
      onRequestClose={() => setLearningModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar backgroundColor="#10b981" barStyle="light-content" />
        <View style={styles.modalHeader}>
          <Pressable style={styles.closeButton} onPress={() => setLearningModalVisible(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
        {selectedLearning && (
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.modalTitleSection}>
              <Text style={styles.modalIcon}>{selectedLearning.icon}</Text>
              <Text style={styles.modalTitle}>{selectedLearning.title}</Text>
              <View style={styles.learningMeta}>
                <Text style={styles.duration}>{selectedLearning.duration}</Text>
                <Text style={styles.difficulty}>{selectedLearning.difficulty}</Text>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Overview</Text>
              <Text style={styles.sectionContent}>{selectedLearning.content.overview}</Text>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Key Points</Text>
              {selectedLearning.content.keyPoints.map((point, index) => (
                <Text key={index} style={styles.bulletPoint}>• {point}</Text>
              ))}
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Examples</Text>
              {selectedLearning.content.examples.map((example, index) => (
                <Text key={index} style={styles.bulletPoint}>• {example}</Text>
              ))}
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.sectionHeader}>Action Tips</Text>
              {selectedLearning.content.actionTips.map((tip, index) => (
                <Text key={index} style={styles.bulletPoint}>✓ {tip}</Text>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable style={styles.actionButton} onPress={() => Alert.alert("Progress", "Lesson completed!")}>
                <Text style={styles.actionButtonText}>Mark as Complete</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#10b981" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Investment Basics</Text>
        <Pressable 
          style={styles.notificationButton}
          android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
          onPress={() => Alert.alert("Notifications", "No new notifications")}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Start Your Investment Journey</Text>
            <Text style={styles.welcomeSubtitle}>Learn the basics and make informed decisions</Text>
          </View>

          {/* Quick Learning */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Learning</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.quickScroll}
              contentContainerStyle={styles.quickScrollContent}
            >
              {quickLearning.map((item) => (
                <Pressable 
                  key={item.id} 
                  style={styles.quickCard}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                  onPress={() => handleLearningPress(item)}
                >
                  <Text style={styles.quickIcon}>{item.icon}</Text>
                  <Text style={styles.quickTitle}>{item.title}</Text>
                  <View style={styles.quickMeta}>
                    <Text style={styles.quickDuration}>{item.duration}</Text>
                    <Text style={styles.quickDifficulty}>{item.difficulty}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Investment Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Options</Text>
            {investmentCategories.map((investment) => renderInvestmentCard(investment))}
          </View>

          {/* Get Started Button */}
          <View style={styles.actionSection}>
            <Pressable 
              style={styles.startButton}
              android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
              onPress={handleStartLearning}
            >
              <Text style={styles.startButtonText}>Start Learning Today</Text>
            </Pressable>
            <Text style={styles.disclaimerText}>
              Investment is subject to market risks. Please read all scheme related documents carefully.
            </Text>
          </View>
        </ScrollView>
      </View>

      {renderInvestmentModal()}
      {renderLearningModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10b981",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#10b981",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  welcomeSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10b981",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  quickScroll: {
    marginBottom: 10,
  },
  quickScrollContent: {
    paddingRight: 20,
  },
  quickCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginRight: 16,
    width: 150,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickIcon: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 10,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
  },
  quickMeta: {
    alignItems: "center",
  },
  quickDuration: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
    marginBottom: 6,
  },
  quickDifficulty: {
    fontSize: 11,
    color: "#64748b",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "500",
  },
  investmentCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  investmentInfo: {
    flexDirection: "row",
    flex: 1,
  },
  investmentIcon: {
    fontSize: 36,
    marginRight: 16,
    marginTop: 2,
  },
  investmentDetails: {
    flex: 1,
  },
  investmentTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  investmentDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 20,
  },
  riskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  riskLevel: {
    fontSize: 13,
    fontWeight: "700",
  },
  potential: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: "600",
  },
  learnButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  learnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  topicsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
  },
  topicsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  topicsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  topicChip: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  topicText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  toolCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  toolIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 6,
  },
  toolDescription: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
  actionSection: {
    alignItems: "center",
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#10b981",
    borderRadius: 28,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  startButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  modalHeader: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
    flexGrow: 1,
  },
  modalTitleSection: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  learningMeta: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  duration: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
    marginRight: 16,
  },
  difficulty: {
    fontSize: 12,
    color: "#64748b",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: "500",
  },
  detailSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  bulletPoint: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 4,
  },
  modalActions: {
    marginTop: 24,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: "#10b981",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#10b981",
  },
  secondaryButtonText: {
    color: "#10b981",
  }
});
export default InvestmentBasics;