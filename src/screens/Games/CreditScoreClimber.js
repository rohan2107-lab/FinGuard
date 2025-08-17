import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
  Modal,
  ProgressBarAndroid,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CreditScoreClimber({ navigation }) {
  // Custom Icon Component for React Native CLI
  const CustomIcon = ({ name, size = 24, color = '#222' }) => {
    const getIconText = () => {
      switch (name) {
        case 'arrow-back': return '←';
        case 'trophy': return '🏆';
        case 'sad': return '😢';
        case 'star': return '⭐';
        case 'warning': return '⚠️';
        case 'check': return '✅';
        case 'time': return '⏰';
        case 'money': return '💰';
        case 'credit-card': return '💳';
        case 'bank': return '🏦';
        case 'house': return '🏠';
        case 'car': return '🚗';
        default: return '•';
      }
    };
    
    return (
      <Text style={{ fontSize: size, color, fontWeight: 'bold' }}>
        {getIconText()}
      </Text>
    );
  };

  // Game State
  const [creditScore, setCreditScore] = useState(580);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [money, setMoney] = useState(25000);
  const [gamePoints, setGamePoints] = useState(0); // New 100-point system
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastDecisionResult, setLastDecisionResult] = useState(null);
  
  // Enhanced Player Stats
  const [playerStats, setPlayerStats] = useState({
    creditCards: 1,
    totalCreditLimit: 50000,
    currentDebt: 15000,
    creditUtilization: 30,
    latePayments: 0,
    creditAge: 24, // months
    creditInquiries: 0,
    loans: [],
    paymentHistory: 85, // percentage
    emergencyFund: 10000,
    monthlyIncome: 40000,
    expenses: 25000,
    emi: 0,
    achievements: [],
  });

  // New Achievement System
  const [achievements, setAchievements] = useState([]);

  const scoreAnimation = useRef(new Animated.Value(creditScore)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Enhanced Scenarios with more realistic situations
  const scenarios = [
    {
      id: 1,
      title: "Credit Card Bill Due - ₹12,000",
      description: "Your credit card bill of ₹12,000 is due. Your current utilization is at 30%. Choose wisely!",
      icon: "credit-card",
      difficulty: "medium",
      options: [
        {
          text: "Pay full amount on time",
          scoreChange: +20,
          moneyChange: -12000,
          pointsEarned: 15,
          feedback: "Excellent! Full payment on time significantly boosts your score and reduces utilization.",
          statsUpdate: { creditUtilization: -24, paymentHistory: +3 }
        },
        {
          text: "Pay 50% now, rest next week",
          scoreChange: +5,
          moneyChange: -6000,
          pointsEarned: 8,
          feedback: "Good partial payment, but late payment may still impact your score slightly.",
          statsUpdate: { creditUtilization: -12, paymentHistory: -1 }
        },
        {
          text: "Pay minimum amount (₹2,400)",
          scoreChange: -8,
          moneyChange: -2400,
          pointsEarned: 3,
          feedback: "Minimum payment avoids late fees but high utilization hurts your score.",
          statsUpdate: { creditUtilization: -4, paymentHistory: -2 }
        },
        {
          text: "Skip payment this month",
          scoreChange: -35,
          moneyChange: 0,
          pointsEarned: -5,
          feedback: "Missed payment severely damages your score and adds late payment mark.",
          statsUpdate: { latePayments: +1, paymentHistory: -8 }
        }
      ]
    },
    {
      id: 2,
      title: "New Premium Credit Card Offer",
      description: "Bank offers premium card with ₹2,00,000 limit but ₹2,000 annual fee. You have 2 existing cards.",
      icon: "star",
      difficulty: "hard",
      options: [
        {
          text: "Accept - Need higher limit",
          scoreChange: +15,
          moneyChange: -2000,
          pointsEarned: 12,
          feedback: "Higher credit limit improved your utilization ratio significantly!",
          statsUpdate: { creditCards: +1, totalCreditLimit: +200000, creditInquiries: +1 }
        },
        {
          text: "Negotiate for fee waiver first",
          scoreChange: +8,
          moneyChange: 0,
          pointsEarned: 10,
          feedback: "Smart negotiation! Got the card without annual fee.",
          statsUpdate: { creditCards: +1, totalCreditLimit: +200000, creditInquiries: +1 }
        },
        {
          text: "Decline - Don't need more cards",
          scoreChange: +2,
          moneyChange: 0,
          pointsEarned: 5,
          feedback: "Conservative approach. Avoided unnecessary credit inquiry.",
          statsUpdate: {}
        }
      ]
    },
    {
      id: 3,
      title: "Medical Emergency - ₹50,000",
      description: "Sudden hospitalization requires ₹50,000. Your insurance covers 80%. How will you manage?",
      icon: "warning",
      difficulty: "hard",
      options: [
        {
          text: "Use emergency fund (₹10k) + credit card",
          scoreChange: -5,
          moneyChange: -10000,
          pointsEarned: 12,
          feedback: "Smart use of emergency fund! Minimized credit impact.",
          statsUpdate: { emergencyFund: -10000, currentDebt: +10000 }
        },
        {
          text: "Take personal loan at 12% interest",
          scoreChange: -15,
          moneyChange: +50000,
          pointsEarned: 6,
          feedback: "Loan inquiry affects score temporarily but manageable EMI.",
          statsUpdate: { loans: 'personal_loan', creditInquiries: +1, emi: +4500 }
        },
        {
          text: "Max out credit cards",
          scoreChange: -25,
          moneyChange: 0,
          pointsEarned: 2,
          feedback: "High utilization severely impacts score. Consider debt consolidation.",
          statsUpdate: { currentDebt: +50000, creditUtilization: +100 }
        },
        {
          text: "Borrow from family",
          scoreChange: +5,
          moneyChange: +50000,
          pointsEarned: 8,
          feedback: "No credit impact! Remember to maintain good family relations.",
          statsUpdate: {}
        }
      ]
    },
    {
      id: 4,
      title: "Salary Increment - 25% Raise!",
      description: "Great news! Your salary increased from ₹40,000 to ₹50,000. How will you use extra income?",
      icon: "money",
      difficulty: "easy",
      options: [
        {
          text: "Pay off all credit card debt",
          scoreChange: +25,
          moneyChange: +10000,
          pointsEarned: 18,
          feedback: "Excellent! Debt-free status dramatically improves your credit health.",
          statsUpdate: { currentDebt: -15000, creditUtilization: -30, monthlyIncome: +10000 }
        },
        {
          text: "Build emergency fund to 6 months",
          scoreChange: +10,
          moneyChange: +10000,
          pointsEarned: 15,
          feedback: "Smart financial planning! Emergency fund provides security.",
          statsUpdate: { emergencyFund: +40000, monthlyIncome: +10000 }
        },
        {
          text: "Upgrade lifestyle proportionally",
          scoreChange: 0,
          moneyChange: +10000,
          pointsEarned: 5,
          feedback: "Lifestyle inflation! Missed opportunity to improve credit health.",
          statsUpdate: { monthlyIncome: +10000, expenses: +8000 }
        },
        {
          text: "Invest 70%, pay debt with 30%",
          scoreChange: +15,
          moneyChange: +10000,
          pointsEarned: 20,
          feedback: "Perfect balance! Building wealth while improving credit.",
          statsUpdate: { currentDebt: -7000, creditUtilization: -14, monthlyIncome: +10000 }
        }
      ]
    },
    {
      id: 5,
      title: "Home Loan Pre-Approval",
      description: "You're applying for home loan pre-approval. Bank will do hard inquiry on your credit report.",
      icon: "house",
      difficulty: "medium",
      options: [
        {
          text: "Apply now - Ready to buy",
          scoreChange: -10,
          moneyChange: 0,
          pointsEarned: 10,
          feedback: "Hard inquiry temporarily lowers score but you're pre-approved for ₹25L!",
          statsUpdate: { creditInquiries: +1 }
        },
        {
          text: "Wait 3 months to improve score",
          scoreChange: +5,
          moneyChange: 0,
          pointsEarned: 12,
          feedback: "Patient approach! Better score will get you lower interest rates.",
          statsUpdate: {}
        },
        {
          text: "Shop around - Apply to 3 banks",
          scoreChange: -20,
          moneyChange: 0,
          pointsEarned: 5,
          feedback: "Multiple inquiries in short time period hurt your score significantly.",
          statsUpdate: { creditInquiries: +3 }
        }
      ]
    },
    {
      id: 6,
      title: "Credit Report Identity Error",
      description: "You discover someone else's loan of ₹3L is showing on your credit report by mistake.",
      icon: "warning",
      difficulty: "medium",
      options: [
        {
          text: "File dispute immediately online",
          scoreChange: +40,
          moneyChange: 0,
          pointsEarned: 20,
          feedback: "Quick action! Error removed and score improved significantly.",
          statsUpdate: { paymentHistory: +10 }
        },
        {
          text: "Call bank first to understand",
          scoreChange: +30,
          moneyChange: 0,
          pointsEarned: 15,
          feedback: "Good approach! Bank helped expedite the correction process.",
          statsUpdate: { paymentHistory: +8 }
        },
        {
          text: "Ignore - Will resolve automatically",
          scoreChange: -15,
          moneyChange: 0,
          pointsEarned: -5,
          feedback: "Big mistake! Errors don't resolve themselves and continue damaging score.",
          statsUpdate: {}
        }
      ]
    },
    {
      id: 7,
      title: "Friend's Business Loan Co-signing",
      description: "Close friend asks you to co-sign ₹5L business loan. They have average credit score.",
      icon: "bank",
      difficulty: "hard",
      options: [
        {
          text: "Co-sign - Trust my friend",
          scoreChange: -10,
          moneyChange: 0,
          pointsEarned: 3,
          feedback: "Risky! Co-signing makes you equally responsible for the debt.",
          statsUpdate: { loans: 'co_signed', creditInquiries: +1 }
        },
        {
          text: "Offer to lend personally instead",
          scoreChange: 0,
          moneyChange: -50000,
          pointsEarned: 8,
          feedback: "Alternative solution! No credit impact but significant cash outflow.",
          statsUpdate: {}
        },
        {
          text: "Politely decline and explain risks",
          scoreChange: +5,
          moneyChange: 0,
          pointsEarned: 12,
          feedback: "Wise decision! Protected your credit while maintaining friendship.",
          statsUpdate: {}
        }
      ]
    },
    {
      id: 8,
      title: "Car Loan vs Cash Purchase",
      description: "Need a car worth ₹8L. You have cash but car loan is available at 8.5% interest.",
      icon: "car",
      difficulty: "medium",
      options: [
        {
          text: "Take car loan - Keep cash liquid",
          scoreChange: +10,
          moneyChange: +800000,
          pointsEarned: 12,
          feedback: "Good credit mix! Car loan adds to your credit history positively.",
          statsUpdate: { loans: 'car_loan', creditInquiries: +1, emi: +15000 }
        },
        {
          text: "Pay full cash",
          scoreChange: 0,
          moneyChange: -800000,
          pointsEarned: 8,
          feedback: "Debt-free approach but missed opportunity to build credit history.",
          statsUpdate: {}
        },
        {
          text: "50% down payment + loan",
          scoreChange: +15,
          moneyChange: -400000,
          pointsEarned: 15,
          feedback: "Perfect balance! Lower EMI and good credit building.",
          statsUpdate: { loans: 'car_loan', creditInquiries: +1, emi: +7500 }
        }
      ]
    },
    {
      id: 9,
      title: "Credit Card Limit Increase Offer",
      description: "Bank offers to increase your credit limit from ₹50K to ₹1.5L without hard inquiry.",
      icon: "credit-card",
      difficulty: "easy",
      options: [
        {
          text: "Accept the increase",
          scoreChange: +12,
          moneyChange: 0,
          pointsEarned: 12,
          feedback: "Smart! Higher limit improved your utilization ratio instantly.",
          statsUpdate: { totalCreditLimit: +100000, creditUtilization: -20 }
        },
        {
          text: "Decline - Don't want temptation",
          scoreChange: 0,
          moneyChange: 0,
          pointsEarned: 5,
          feedback: "Conservative approach. Missed opportunity to improve utilization ratio.",
          statsUpdate: {}
        }
      ]
    },
    {
      id: 10,
      title: "Investment vs Debt Payment",
      description: "You have ₹50K bonus. Credit card debt is at 18% interest, SIP can give 12% returns.",
      icon: "money",
      difficulty: "hard",
      options: [
        {
          text: "Pay off high-interest debt first",
          scoreChange: +20,
          moneyChange: +50000,
          pointsEarned: 18,
          feedback: "Mathematically correct! 18% guaranteed return vs 12% market risk.",
          statsUpdate: { currentDebt: -50000, creditUtilization: -100 }
        },
        {
          text: "Split 50-50 between debt and investment",
          scoreChange: +10,
          moneyChange: +50000,
          pointsEarned: 12,
          feedback: "Balanced approach but debt should be priority at 18% interest.",
          statsUpdate: { currentDebt: -25000, creditUtilization: -50 }
        },
        {
          text: "Invest everything - Market is good",
          scoreChange: -5,
          moneyChange: +50000,
          pointsEarned: 3,
          feedback: "Risky! High-interest debt grows faster than most investments.",
          statsUpdate: {}
        }
      ]
    }
  ];

  // Achievement definitions
  const achievementList = [
    { id: 'first_700', name: 'Good Credit Club', description: 'Reach 700+ credit score', points: 10, icon: '🎯' },
    { id: 'first_750', name: 'Credit Champion', description: 'Reach 750+ credit score', points: 15, icon: '🏆' },
    { id: 'debt_free', name: 'Debt Destroyer', description: 'Pay off all credit card debt', points: 20, icon: '💪' },
    { id: 'emergency_fund', name: 'Safety Net', description: 'Build 6 months emergency fund', points: 15, icon: '🛡️' },
    { id: 'perfect_month', name: 'Perfect Decision', description: 'Make all optimal choices in a month', points: 10, icon: '✨' },
    { id: 'credit_mix', name: 'Credit Mixer', description: 'Have 3+ different types of credit', points: 12, icon: '🔗' },
    { id: 'utilization_master', name: 'Utilization Master', description: 'Keep utilization below 10%', points: 8, icon: '📊' },
  ];

  useEffect(() => {
    if (currentMonth <= 12 && !gameOver) {
      generateNewScenario();
    }
  }, [currentMonth]);

  useEffect(() => {
    Animated.timing(scoreAnimation, {
      toValue: creditScore,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Check for achievements
    checkAchievements();

    // Win/lose conditions
    if (creditScore >= 800 && gamePoints >= 80) {
      setGameWon(true);
      setGameOver(true);
    } else if (creditScore <= 350 || currentMonth > 12 || gamePoints < -20) {
      setGameOver(true);
    }
  }, [creditScore, gamePoints, playerStats]);

  const checkAchievements = () => {
    const newAchievements = [];
    
    // Check various achievement conditions
    if (creditScore >= 700 && !achievements.includes('first_700')) {
      newAchievements.push('first_700');
    }
    if (creditScore >= 750 && !achievements.includes('first_750')) {
      newAchievements.push('first_750');
    }
    if (playerStats.currentDebt === 0 && !achievements.includes('debt_free')) {
      newAchievements.push('debt_free');
    }
    if (playerStats.emergencyFund >= playerStats.monthlyIncome * 6 && !achievements.includes('emergency_fund')) {
      newAchievements.push('emergency_fund');
    }
    if (playerStats.creditUtilization <= 10 && !achievements.includes('utilization_master')) {
      newAchievements.push('utilization_master');
    }

    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
      // Add achievement points
      const achievementPoints = newAchievements.reduce((total, achId) => {
        const ach = achievementList.find(a => a.id === achId);
        return total + (ach ? ach.points : 0);
      }, 0);
      setGamePoints(prev => prev + achievementPoints);
    }
  };

  const generateNewScenario = () => {
    if (currentMonth <= 12 && !gameOver) {
      const availableScenarios = scenarios.filter(s => {
        // Some scenarios are only available under certain conditions
        if (s.id === 5 && playerStats.loans.length === 0) return false;
        if (s.id === 8 && money < 400000) return false;
        return true;
      });
      
      const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
      setCurrentScenario(randomScenario);
    }
  };

  const handleDecision = (option) => {
    const newScore = Math.max(300, Math.min(850, creditScore + option.scoreChange));
    const newMoney = Math.max(0, money + option.moneyChange);
    const newPoints = gamePoints + option.pointsEarned;
    
    setCreditScore(newScore);
    setMoney(newMoney);
    setGamePoints(newPoints);
    
    // Update player stats
    if (option.statsUpdate) {
      const updatedStats = { ...playerStats };
      Object.keys(option.statsUpdate).forEach(key => {
        if (typeof option.statsUpdate[key] === 'number') {
          updatedStats[key] = Math.max(0, (updatedStats[key] || 0) + option.statsUpdate[key]);
        } else if (option.statsUpdate[key] === 'personal_loan') {
          updatedStats.loans = [...updatedStats.loans, 'personal_loan'];
        } else if (option.statsUpdate[key] === 'car_loan') {
          updatedStats.loans = [...updatedStats.loans, 'car_loan'];
        }
      });
      
      // Recalculate utilization if debt or limit changed
      if (option.statsUpdate.currentDebt !== undefined || option.statsUpdate.totalCreditLimit !== undefined) {
        updatedStats.creditUtilization = Math.round((updatedStats.currentDebt / updatedStats.totalCreditLimit) * 100);
      }
      
      setPlayerStats(updatedStats);
    }
    
    const result = {
      month: currentMonth,
      scenario: currentScenario.title,
      decision: option.text,
      scoreChange: option.scoreChange,
      moneyChange: option.moneyChange,
      pointsEarned: option.pointsEarned,
      feedback: option.feedback,
      newScore: newScore,
      newPoints: newPoints,
    };
    
    setLastDecisionResult(result);
    setGameHistory([...gameHistory, result]);
    setShowResultModal(true);
    
    // Pulse animation for score change
    Animated.sequence([
      Animated.timing(pulseAnimation, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(pulseAnimation, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth + 1);
    setShowResultModal(false);
    
    // Age the credit accounts
    setPlayerStats(prev => ({
      ...prev,
      creditAge: prev.creditAge + 1
    }));
    
    generateNewScenario();
  };

  const restartGame = () => {
    setCreditScore(580);
    setCurrentMonth(1);
    setMoney(25000);
    setGamePoints(0);
    setGameOver(false);
    setGameWon(false);
    setGameHistory([]);
    setShowResultModal(false);
    setCurrentScenario(null);
    setAchievements([]);
    setPlayerStats({
      creditCards: 1,
      totalCreditLimit: 50000,
      currentDebt: 15000,
      creditUtilization: 30,
      latePayments: 0,
      creditAge: 24,
      creditInquiries: 0,
      loans: [],
      paymentHistory: 85,
      emergencyFund: 10000,
      monthlyIncome: 40000,
      expenses: 25000,
      emi: 0,
      achievements: [],
    });
    generateNewScenario();
  };

  const getCreditScoreColor = (score) => {
    if (score >= 800) return '#10b981'; // Excellent - Emerald
    if (score >= 750) return '#22c55e'; // Very Good - Green
    if (score >= 700) return '#84cc16'; // Good - Light Green
    if (score >= 650) return '#eab308'; // Fair - Yellow
    if (score >= 600) return '#f97316'; // Poor - Orange
    return '#ef4444'; // Very Poor - Red
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 750) return 'Very Good';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  const getGameRating = (points) => {
    if (points >= 90) return { label: 'Financial Genius', color: '#10b981', icon: '🧠' };
    if (points >= 75) return { label: 'Credit Master', color: '#22c55e', icon: '🎯' };
    if (points >= 60) return { label: 'Smart Spender', color: '#84cc16', icon: '💡' };
    if (points >= 40) return { label: 'Learning Fast', color: '#eab308', icon: '📚' };
    if (points >= 20) return { label: 'Beginner', color: '#f97316', icon: '🌱' };
    return { label: 'Needs Improvement', color: '#ef4444', icon: '📖' };
  };

  if (gameOver) {
    const rating = getGameRating(gamePoints);
    const earnedAchievements = achievements.map(id => achievementList.find(a => a.id === id)).filter(Boolean);
    
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameOverScrollContainer}>
          <View style={styles.gameOverContainer}>
            <CustomIcon 
              name={gameWon ? "trophy" : "sad"} 
              size={60} 
              color={gameWon ? "#ffd700" : "#ef4444"} 
            />
            <Text style={styles.gameOverTitle}>
              {gameWon ? "🎉 Congratulations!" : "Game Over"}
            </Text>
            
            <View style={styles.finalScoreCard}>
              <Text style={styles.finalScoreTitle}>Final Score</Text>
              <Text style={[styles.finalPoints, { color: rating.color }]}>
                {gamePoints}/100 Points
              </Text>
              <Text style={[styles.finalRating, { color: rating.color }]}>
                {rating.icon} {rating.label}
              </Text>
            </View>

            <View style={styles.finalStatsGrid}>
              <View style={styles.finalStatCard}>
                <Text style={styles.finalStatLabel}>Credit Score</Text>
                <Text style={[styles.finalStatValue, { color: getCreditScoreColor(creditScore) }]}>
                  {creditScore}
                </Text>
                <Text style={styles.finalStatSubtext}>{getCreditScoreLabel(creditScore)}</Text>
              </View>
              
              <View style={styles.finalStatCard}>
                <Text style={styles.finalStatLabel}>Money</Text>
                <Text style={styles.finalStatValue}>₹{(money/1000).toFixed(0)}K</Text>
                <Text style={styles.finalStatSubtext}>Net Worth</Text>
              </View>
              
              <View style={styles.finalStatCard}>
                <Text style={styles.finalStatLabel}>Months</Text>
                <Text style={styles.finalStatValue}>{currentMonth - 1}</Text>
                <Text style={styles.finalStatSubtext}>Completed</Text>
              </View>
              
              <View style={styles.finalStatCard}>
                <Text style={styles.finalStatLabel}>Achievements</Text>
                <Text style={styles.finalStatValue}>{achievements.length}</Text>
                <Text style={styles.finalStatSubtext}>Unlocked</Text>
              </View>
            </View>

            {earnedAchievements.length > 0 && (
              <View style={styles.achievementsContainer}>
                <Text style={styles.achievementsTitle}>🏆 Achievements Unlocked</Text>
                {earnedAchievements.map((ach, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Text style={styles.achievementIcon}>{ach.icon}</Text>
                    <View style={styles.achievementText}>
                      <Text style={styles.achievementName}>{ach.name}</Text>
                      <Text style={styles.achievementDesc}>{ach.description}</Text>
                    </View>
                    <Text style={styles.achievementPoints}>+{ach.points}pts</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.gameOverButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
                <Text style={styles.playAgainText}>🔄 Play Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.backButtonText}>← Back to Games</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backIcon} 
            onPress={() => navigation.goBack()}
          >
            <CustomIcon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>Credit Score Climber</Text>
          <View style={styles.monthIndicator}>
            <Text style={styles.monthText}>{currentMonth}/12</Text>
          </View>
        </View>

        {/* Points and Progress Bar */}
        <View style={styles.pointsContainer}>
          <View style={styles.pointsHeader}>
            <Text style={styles.pointsLabel}>Game Score</Text>
            <Text style={styles.pointsValue}>{gamePoints}/100</Text>
          </View>
          <View style={styles.pointsBar}>
            <View 
              style={[
                styles.pointsProgress, 
                { 
                  width: `${Math.max(0, Math.min(100, gamePoints))}%`,
                  backgroundColor: getGameRating(gamePoints).color
                }
              ]} 
            />
          </View>
        </View>

        {/* Enhanced Stats Dashboard */}
        <View style={styles.dashboard}>
          <View style={styles.scoreContainer}>
            <Animated.Text style={[
              styles.creditScore,
              { color: getCreditScoreColor(creditScore), transform: [{ scale: pulseAnimation }] }
            ]}>
              {creditScore}
            </Animated.Text>
            <Text style={styles.scoreLabel}>{getCreditScoreLabel(creditScore)}</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreProgress, 
                  { 
                    width: `${((creditScore - 300) / 550) * 100}%`,
                    backgroundColor: getCreditScoreColor(creditScore)
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.gameStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>💰 Money</Text>
              <Text style={styles.statValue}>₹{(money/1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>💳 Utilization</Text>
              <Text style={[
                styles.statValue,
                { color: playerStats.creditUtilization <= 30 ? '#22c55e' : '#ef4444' }
              ]}>
                {playerStats.creditUtilization}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>📊 Goal</Text>
              <Text style={styles.statValue}>800+</Text>
            </View>
          </View>
        </View>

        {/* Detailed Credit Profile */}
        <View style={styles.creditProfile}>
          <Text style={styles.profileTitle}>📋 Your Credit Profile</Text>
          
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Credit Cards</Text>
              <Text style={styles.profileValue}>{playerStats.creditCards}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Total Limit</Text>
              <Text style={styles.profileValue}>₹{(playerStats.totalCreditLimit/100000).toFixed(1)}L</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Current Debt</Text>
              <Text style={[
                styles.profileValue,
                { color: playerStats.currentDebt > 0 ? '#ef4444' : '#22c55e' }
              ]}>
                ₹{(playerStats.currentDebt/1000).toFixed(0)}K
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Payment History</Text>
              <Text style={[
                styles.profileValue,
                { color: playerStats.paymentHistory >= 95 ? '#22c55e' : playerStats.paymentHistory >= 85 ? '#eab308' : '#ef4444' }
              ]}>
                {playerStats.paymentHistory}%
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Late Payments</Text>
              <Text style={[
                styles.profileValue,
                { color: playerStats.latePayments === 0 ? '#22c55e' : '#ef4444' }
              ]}>
                {playerStats.latePayments}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Credit Age</Text>
              <Text style={styles.profileValue}>{Math.floor(playerStats.creditAge/12)}y {playerStats.creditAge%12}m</Text>
            </View>
          </View>
        </View>

        {/* Current Scenario */}
        {currentScenario && (
          <View style={styles.scenarioContainer}>
            <View style={styles.scenarioHeader}>
              <CustomIcon name={currentScenario.icon} size={28} color="#2563eb" />
              <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: currentScenario.difficulty === 'easy' ? '#22c55e' : currentScenario.difficulty === 'medium' ? '#eab308' : '#ef4444' }
              ]}>
                <Text style={styles.difficultyText}>
                  {currentScenario.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.scenarioDescription}>
              {currentScenario.description}
            </Text>
            
            <View style={styles.optionsContainer}>
              {currentScenario.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleDecision(option)}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                  
                  <View style={styles.optionEffects}>
                    {option.scoreChange !== 0 && (
                      <View style={styles.effectBadge}>
                        <Text style={[
                          styles.effectText,
                          { color: option.scoreChange > 0 ? '#22c55e' : '#ef4444' }
                        ]}>
                          📊 {option.scoreChange > 0 ? '+' : ''}{option.scoreChange}
                        </Text>
                      </View>
                    )}
                    {option.moneyChange !== 0 && (
                      <View style={styles.effectBadge}>
                        <Text style={[
                          styles.effectText,
                          { color: option.moneyChange > 0 ? '#22c55e' : '#ef4444' }
                        ]}>
                          💰 {option.moneyChange > 0 ? '+' : ''}₹{Math.abs(option.moneyChange/1000).toFixed(0)}K
                        </Text>
                      </View>
                    )}
                    <View style={[
                      styles.effectBadge,
                      { backgroundColor: option.pointsEarned >= 0 ? '#e0f2fe' : '#ffebee' }
                    ]}>
                      <Text style={[
                        styles.effectText,
                        { color: option.pointsEarned >= 0 ? '#1976d2' : '#d32f2f' }
                      ]}>
                        🎯 {option.pointsEarned >= 0 ? '+' : ''}{option.pointsEarned} pts
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Smart Credit Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>• Keep credit utilization below 30% (ideally under 10%)</Text>
            <Text style={styles.tipText}>• Never miss payment due dates - set auto-pay</Text>
            <Text style={styles.tipText}>• Don't close old credit cards - age matters</Text>
            <Text style={styles.tipText}>• Limit hard credit inquiries to avoid score drops</Text>
            <Text style={styles.tipText}>• Pay off high-interest debt first (debt avalanche)</Text>
            <Text style={styles.tipText}>• Build emergency fund = 6 months expenses</Text>
          </View>
        </View>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <View style={styles.recentAchievements}>
            <Text style={styles.achievementsTitle}>🏆 Achievements ({achievements.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {achievements.map((achId, index) => {
                const ach = achievementList.find(a => a.id === achId);
                return ach ? (
                  <View key={index} style={styles.achievementBadge}>
                    <Text style={styles.achievementBadgeIcon}>{ach.icon}</Text>
                    <Text style={styles.achievementBadgeName}>{ach.name}</Text>
                  </View>
                ) : null;
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Enhanced Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Decision Result</Text>
              <View style={[
                styles.pointsBadge,
                { backgroundColor: lastDecisionResult?.pointsEarned >= 0 ? '#e8f5e8' : '#ffeaea' }
              ]}>
                <Text style={[
                  styles.pointsBadgeText,
                  { color: lastDecisionResult?.pointsEarned >= 0 ? '#22c55e' : '#ef4444' }
                ]}>
                  {lastDecisionResult?.pointsEarned >= 0 ? '+' : ''}{lastDecisionResult?.pointsEarned} pts
                </Text>
              </View>
            </View>
            
            {lastDecisionResult && (
              <>
                <Text style={styles.modalFeedback}>
                  {lastDecisionResult.feedback}
                </Text>
                
                <View style={styles.modalStats}>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Credit Score:</Text>
                    <View style={styles.modalStatChange}>
                      <Text style={[styles.modalStatValue, { color: getCreditScoreColor(lastDecisionResult.newScore) }]}>
                        {lastDecisionResult.newScore}
                      </Text>
                      <Text style={[
                        styles.modalStatDelta,
                        { color: lastDecisionResult.scoreChange >= 0 ? '#22c55e' : '#ef4444' }
                      ]}>
                        ({lastDecisionResult.scoreChange >= 0 ? '+' : ''}{lastDecisionResult.scoreChange})
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Game Score:</Text>
                    <View style={styles.modalStatChange}>
                      <Text style={[styles.modalStatValue, { color: getGameRating(lastDecisionResult.newPoints).color }]}>
                        {lastDecisionResult.newPoints}/100
                      </Text>
                    </View>
                  </View>

                  {lastDecisionResult.moneyChange !== 0 && (
                    <View style={styles.modalStatRow}>
                      <Text style={styles.modalStatLabel}>Money Change:</Text>
                      <Text style={[
                        styles.modalStatValue,
                        { color: lastDecisionResult.moneyChange >= 0 ? '#22c55e' : '#ef4444' }
                      ]}>
                        {lastDecisionResult.moneyChange >= 0 ? '+' : ''}₹{(lastDecisionResult.moneyChange/1000).toFixed(0)}K
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
            
            <TouchableOpacity style={styles.continueButton} onPress={nextMonth}>
              <Text style={styles.continueButtonText}>
                {currentMonth >= 12 ? '🏁 Finish Game' : '⏭️ Next Month'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  gameOverScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  monthIndicator: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  monthText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointsContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pointsBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  pointsProgress: {
    height: '100%',
    borderRadius: 4,
    minWidth: 4,
  },
  dashboard: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  creditScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
    fontWeight: '500',
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  creditProfile: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scenarioContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  scenarioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginLeft: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scenarioDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
    lineHeight: 20,
  },
  optionEffects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  effectBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  effectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  recentAchievements: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  achievementBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  achievementBadgeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  achievementBadgeName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
    textAlign: 'center',
  },
  gameOverContainer: {
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  finalScoreCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  finalScoreTitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 10,
  },
  finalPoints: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  finalRating: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  finalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  finalStatCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  finalStatLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 5,
  },
  finalStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  finalStatSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  achievementsContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  gameOverButtons: {
    width: '100%',
    gap: 15,
  },
  playAgainButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 4,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#64748b',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    width: width * 0.9,
    maxWidth: 400,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFeedback: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
  },
  modalStats: {
    marginBottom: 25,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  modalStatLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  modalStatChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalStatDelta: {
    fontSize: 14,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});