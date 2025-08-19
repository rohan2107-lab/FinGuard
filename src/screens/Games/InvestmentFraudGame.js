import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView, Alert, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

// Enhanced investment ads dataset with more realistic scenarios
const investmentAds = [
  {
    id: 1,
    text: '💰 Guaranteed 30% monthly returns! No risk involved. Limited spots available.',
    isFake: true,
    reason: 'No legitimate investment can guarantee 30% monthly returns without risk. This is a classic Ponzi scheme red flag.',
    category: 'Crypto Scam',
    riskLevel: 'Extreme',
    points: 10
  },
  {
    id: 2,
    text: '🏠 Invest in REITs through Vanguard Real Estate ETF (VNQ) - Average annual return: 6-8%',
    isFake: false,
    reason: 'REITs are legitimate investments. Vanguard is a reputable firm, and 6-8% annual returns are realistic for real estate.',
    category: 'Real Estate',
    riskLevel: 'Low',
    points: 8
  },
  {
    id: 3,
    text: '📈 Double your Bitcoin in 72 hours! Send us your crypto for instant doubling.',
    isFake: true,
    reason: 'Bitcoin doubling schemes are always scams. Never send cryptocurrency to unknown parties promising quick returns.',
    category: 'Crypto Scam',
    riskLevel: 'Extreme',
    points: 12
  },
  {
    id: 4,
    text: '📊 Treasury Bills offering 4.5% annual return, backed by US Government.',
    isFake: false,
    reason: 'Treasury Bills are legitimate, low-risk government securities with returns that match current market rates.',
    category: 'Government Securities',
    riskLevel: 'Very Low',
    points: 6
  },
  {
    id: 5,
    text: '🚀 AI Trading Bot with 95% success rate! Make $1000 daily with just $100 investment.',
    isFake: true,
    reason: 'No trading system has 95% success rate. Claims of making 10x daily returns are mathematically impossible.',
    category: 'Trading Scam',
    riskLevel: 'Extreme',
    points: 15
  },
  {
    id: 6,
    text: '📈 S&P 500 Index Fund by Fidelity - Historical average: 10% annual returns over 30 years.',
    isFake: false,
    reason: 'Index funds are legitimate investments. Fidelity is reputable, and 10% long-term average is historically accurate.',
    category: 'Index Fund',
    riskLevel: 'Medium',
    points: 7
  },
  {
    id: 7,
    text: '💎 Exclusive diamond investment opportunity! 50% returns in 6 months guaranteed.',
    isFake: true,
    reason: 'Physical commodities like diamonds are illiquid and risky. Guaranteed 50% returns in 6 months is unrealistic.',
    category: 'Commodity Scam',
    riskLevel: 'High',
    points: 11
  },
  {
    id: 8,
    text: '🏦 High-yield savings account at Marcus by Goldman Sachs - 4.3% APY, FDIC insured.',
    isFake: false,
    reason: 'Marcus is a legitimate bank, FDIC insurance protects deposits, and 4.3% APY is competitive for savings accounts.',
    category: 'Savings Account',
    riskLevel: 'Very Low',
    points: 5
  },
  {
    id: 9,
    text: '🎯 Binary options trading - 80% profit in 60 seconds! Start with $10.',
    isFake: true,
    reason: 'Binary options are largely unregulated gambling, not investing. Claims of 80% profit in 60 seconds are misleading.',
    category: 'Binary Options',
    riskLevel: 'Extreme',
    points: 13
  },
  {
    id: 10,
    text: '🌱 ESG Corporate Bonds from Microsoft - 3.7% annual yield, AAA rated.',
    isFake: false,
    reason: 'Corporate bonds from established companies like Microsoft are legitimate. ESG bonds support environmental initiatives.',
    category: 'Corporate Bonds',
    riskLevel: 'Low',
    points: 6
  }
];

// Tips for users
const investmentTips = [
  "🚨 Red Flag: Any investment promising guaranteed returns above 10% annually",
  "✅ Safe Bet: Diversified index funds from reputable companies",
  "🔍 Always Check: Company registration with SEC or relevant authorities",
  "⏰ Time Factor: Legitimate investments grow over years, not days",
  "🎯 Risk Rule: Higher returns always come with higher risks"
];

export default function InvestmentFraudGame({ navigation }) {
  const [step, setStep] = useState('intro'); 
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReason, setShowReason] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [bonusPoints, setBonusPoints] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer;
    if (step === 'game' && timeLeft > 0 && !showReason) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Add urgency animation when time is running low
        if (timeLeft <= 10) {
          Animated.sequence([
            Animated.timing(timerAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
            Animated.timing(timerAnim, { toValue: 1, duration: 200, useNativeDriver: true })
          ]).start();
        }
      }, 1000);
    } else if (timeLeft === 0 && step === 'game' && !showReason) {
      // Time's up for this question
      setShowReason(true);
      setStreak(0); // Reset streak on timeout
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step, showReason]);

  const startScaleAnimation = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const animateSwipe = () => {
    swipeAnim.setValue(0);
    Animated.timing(swipeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (step === 'game') animateSwipe();
    if (step === 'score') startScaleAnimation();
  }, [step, currentIndex]);

  const handleStartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setStep('game');
    setShowReason(false);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'normal' ? 30 : 20);
    setGameStartTime(Date.now());
    setStreak(0);
    setBonusPoints(0);
  };

  const calculateTimeBonus = () => {
    const baseTime = difficulty === 'easy' ? 45 : difficulty === 'normal' ? 30 : 20;
    const timeTaken = baseTime - timeLeft;
    if (timeTaken <= 10) return 5; // Quick response bonus
    if (timeTaken <= 20) return 2;
    return 0;
  };

  const handleAnswer = (userChoice) => {
    const currentAd = investmentAds[currentIndex];
    const isCorrect = (userChoice === 'fake' && currentAd.isFake) || (userChoice === 'real' && !currentAd.isFake);
    
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = currentAd.points;
      const timeBonus = calculateTimeBonus();
      const streakBonus = streak >= 3 ? 5 : 0;
      
      pointsEarned += timeBonus + streakBonus;
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setBonusPoints(timeBonus + streakBonus);
    } else {
      setStreak(0);
      setBonusPoints(0);
    }
    
    setShowReason(true);
  };

  const handleNext = () => {
    setShowReason(false);
    setBonusPoints(0);
    if (currentIndex + 1 < investmentAds.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'normal' ? 30 : 20);
      animateSwipe();
    } else {
      setStep('score');
      startScaleAnimation();
    }
  };

  const getPerformanceRating = () => {
    const percentage = (score / 100) * 100;
    if (percentage >= 90) return { text: "🏆 Investment Expert", color: "#f1c40f" };
    if (percentage >= 75) return { text: "💎 Smart Investor", color: "#2ecc71" };
    if (percentage >= 60) return { text: "📈 Learning Investor", color: "#3498db" };
    if (percentage >= 40) return { text: "⚠️ Needs Improvement", color: "#f39c12" };
    return { text: "🚨 High Risk Investor", color: "#e74c3c" };
  };

  const showRandomTip = () => {
    const randomTip = investmentTips[Math.floor(Math.random() * investmentTips.length)];
    Alert.alert("💡 Investment Tip", randomTip);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      
      {step === 'intro' && (
        <>
          <Text style={styles.title}>💸 Investment Fraud Detector Pro</Text>
          <LottieView
            source={require('../../assets/data_ana.json')}
            autoPlay loop style={styles.animation}
          />
          <Text style={styles.info}>
            🎯 Goal: Score 100 points by detecting fake investments{'\n'}
            ⏰ Each question is timed{'\n'}
            🔥 Build streaks for bonus points
          </Text>
          
          <Text style={styles.difficultyTitle}>Choose Difficulty:</Text>
          <View style={styles.difficultyContainer}>
            {['easy', 'normal', 'hard'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.difficultyButton, difficulty === level && styles.selectedDifficulty]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={styles.difficultyText}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  {level === 'easy' && ' (45s)'}
                  {level === 'normal' && ' (30s)'}
                  {level === 'hard' && ' (20s)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Challenge 🚀</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tipButton} onPress={showRandomTip}>
            <Text style={styles.tipButtonText}>💡 Get Investment Tip</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'game' && (
        <Animated.View style={[styles.gameBox, {
          opacity: swipeAnim,
          transform: [{ scale: swipeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
        }]}>
          <View style={styles.gameHeader}>
            <Text style={styles.questionCounter}>Question {currentIndex + 1}/{investmentAds.length}</Text>
            <Animated.Text style={[
              styles.timer, 
              { transform: [{ scale: timerAnim }] },
              timeLeft <= 10 ? styles.timerUrgent : {}
            ]}>
              ⏰ {timeLeft}s
            </Animated.Text>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}/100</Text>
            <Text style={styles.streakText}>🔥 Streak: {streak}</Text>
          </View>

          <View style={[styles.adContainer, { borderColor: investmentAds[currentIndex].riskLevel === 'Extreme' ? '#e74c3c' : '#ddd' }]}>
            <Text style={styles.categoryText}>{investmentAds[currentIndex].category}</Text>
            <Text style={styles.adText}>{investmentAds[currentIndex].text}</Text>
            <Text style={styles.riskText}>Risk Level: {investmentAds[currentIndex].riskLevel}</Text>
          </View>

          {!showReason && (
            <>
              <TouchableOpacity 
                style={styles.buttonFake} 
                onPress={() => handleAnswer('fake')}
                disabled={timeLeft === 0}
              >
                <Text style={styles.buttonText}>🚨 FAKE INVESTMENT</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.buttonReal} 
                onPress={() => handleAnswer('real')}
                disabled={timeLeft === 0}
              >
                <Text style={styles.buttonText}>✅ LEGITIMATE</Text>
              </TouchableOpacity>
            </>
          )}

          {showReason && (
            <>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonTitle}>
                  {investmentAds[currentIndex].isFake ? '🚨 SCAM DETECTED' : '✅ LEGITIMATE INVESTMENT'}
                </Text>
                <Text style={styles.reason}>{investmentAds[currentIndex].reason}</Text>
                {bonusPoints > 0 && (
                  <Text style={styles.bonusText}>🎉 Bonus: +{bonusPoints} points!</Text>
                )}
              </View>
              <TouchableOpacity style={styles.buttonNext} onPress={handleNext}>
                <Text style={styles.buttonText}>Next Question ➡️</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}

      {step === 'score' && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.title}>🎉 Challenge Complete!</Text>
          
          <View style={styles.finalScoreContainer}>
            <Text style={styles.finalScore}>{score}/100</Text>
            <Text style={[styles.rating, { color: getPerformanceRating().color }]}>
              {getPerformanceRating().text}
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round((score/100) * 100)}%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <View style={styles.achievementContainer}>
            {score >= 90 && <Text style={styles.achievement}>🏆 Master Detector</Text>}
            {bestStreak >= 5 && <Text style={styles.achievement}>🔥 Streak Master</Text>}
            {score >= 75 && <Text style={styles.achievement}>🛡️ Fraud Fighter</Text>}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.moreButton} onPress={showRandomTip}>
            <Text style={styles.buttonText}>💡 Learn More</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Games</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f8f9fa', alignItems: 'center', justifyContent: 'center' },
  animation: { width: 220, height: 220, marginBottom: 20 },
  gameBox: { alignItems: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50', textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#34495e', lineHeight: 22 },
  
  // Difficulty selection
  difficultyTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  difficultyContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  difficultyButton: { backgroundColor: '#ecf0f1', padding: 10, borderRadius: 15, minWidth: 80 },
  selectedDifficulty: { backgroundColor: '#3498db' },
  difficultyText: { color: '#2c3e50', fontWeight: 'bold', textAlign: 'center', fontSize: 12 },
  
  // Game header
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  questionCounter: { fontSize: 16, fontWeight: 'bold', color: '#7f8c8d' },
  timer: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  timerUrgent: { color: '#e74c3c' },
  
  // Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#2980b9' },
  streakText: { fontSize: 18, fontWeight: 'bold', color: '#e67e22' },
  
  // Ad container
  adContainer: { width: '100%', padding: 20, backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, borderWidth: 2, elevation: 3 },
  categoryText: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 5 },
  adText: { fontSize: 18, textAlign: 'center', color: '#2c3e50', marginBottom: 10 },
  riskText: { fontSize: 14, color: '#e74c3c', fontWeight: 'bold', textAlign: 'center' },
  
  // Buttons
  button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 25, marginBottom: 15, width: '80%', alignItems: 'center', elevation: 3 },
  buttonFake: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 25, marginBottom: 10, width: '85%', alignItems: 'center', elevation: 3 },
  buttonReal: { backgroundColor: '#27ae60', padding: 15, borderRadius: 25, marginBottom: 10, width: '85%', alignItems: 'center', elevation: 3 },
  buttonNext: { backgroundColor: '#f39c12', padding: 15, borderRadius: 25, marginBottom: 20, width: '80%', alignItems: 'center', elevation: 3 },
  tipButton: { backgroundColor: '#9b59b6', padding: 12, borderRadius: 20, width: '70%', alignItems: 'center', marginTop: 10 },
  tipButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  moreButton: { backgroundColor: '#34495e', padding: 15, borderRadius: 20, marginTop: 10, width: '80%', alignItems: 'center', elevation: 3 },
  backButton: { backgroundColor: '#95a5a6', padding: 15, borderRadius: 20, marginTop: 10, width: '80%', alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  // Results
  resultBox: { backgroundColor: '#fff', padding: 25, borderRadius: 25, alignItems: 'center', width: '95%', elevation: 5 },
  finalScoreContainer: { alignItems: 'center', marginBottom: 20 },
  finalScore: { fontSize: 48, fontWeight: 'bold', color: '#2c3e50' },
  rating: { fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#3498db' },
  statLabel: { fontSize: 14, color: '#7f8c8d' },
  
  achievementContainer: { marginBottom: 20, alignItems: 'center' },
  achievement: { fontSize: 16, color: '#f1c40f', fontWeight: 'bold', marginBottom: 5 },
  
  // Reason box
  reasonBox: { backgroundColor: '#ecf0f1', padding: 20, borderRadius: 15, marginVertical: 20, width: '95%', alignItems: 'center', borderWidth: 1, borderColor: '#bdc3c7' },
  reasonTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  reason: { fontSize: 16, textAlign: 'center', color: '#2c3e50', lineHeight: 22 },
  bonusText: { fontSize: 16, color: '#27ae60', fontWeight: 'bold', marginTop: 10 }
});