import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView, Alert, Vibration } from 'react-native';
import LottieView from 'lottie-react-native';

const scamMessages = [
  { 
    id: 1, 
    text: 'Dear user, your KYC will expire in 24 hours. Refund ₹4000 pending. Click here to verify: bit.ly/kyc-verify', 
    isScam: true,
    difficulty: 'easy',
    redFlags: ['Urgent deadline', 'Suspicious link', 'Asks for verification'],
    explanation: 'Banks never ask for KYC updates via SMS with suspicious links.'
  },
  { 
    id: 2, 
    text: 'Maharashtra State Electricity Board: Your bill of ₹1,240 is due on 25th. Pay online at mseb.co.in', 
    isScam: false,
    difficulty: 'easy',
    redFlags: [],
    explanation: 'This appears to be a legitimate bill notification from official source.'
  },
  { 
    id: 3, 
    text: 'CONGRATULATIONS! You won ₹1 CRORE in KBC lottery! Send processing fee ₹2000 to claim prize. Call: 9876543210', 
    isScam: true,
    difficulty: 'easy',
    redFlags: ['Too good to be true', 'Asks for money upfront', 'Random phone number'],
    explanation: 'Legitimate lotteries never ask for fees to claim prizes.'
  },
  { 
    id: 4, 
    text: 'SBI Alert: Suspicious activity detected. Your account will be blocked. Update details: sbi-secure.com', 
    isScam: true,
    difficulty: 'medium',
    redFlags: ['Creates panic', 'Fake domain', 'Urgent action required'],
    explanation: 'Real banks use their official domains, not similar-looking fake ones.'
  },
  { 
    id: 5, 
    text: 'Amazon: Your order #402-1234567-8901234 has been dispatched. Track: amzn.to/track123', 
    isScam: false,
    difficulty: 'medium',
    redFlags: [],
    explanation: 'Legitimate tracking notification with proper Amazon short link format.'
  },
  { 
    id: 6, 
    text: 'COVID-19 VACCINE CERTIFICATE expired! Download new certificate immediately. Link: covid19-cert.org.in', 
    isScam: true,
    difficulty: 'medium',
    redFlags: ['Fake urgency', 'Unofficial domain', 'Vaccine certificates don\'t expire'],
    explanation: 'Official vaccine certificates are available only on cowin.gov.in'
  },
  { 
    id: 7, 
    text: 'Dear Customer, your Aadhaar card has been suspended due to non-verification. Verify now: uidai-verify.in', 
    isScam: true,
    difficulty: 'hard',
    redFlags: ['Aadhaar suspension threat', 'Fake UIDAI domain', 'Creates fear'],
    explanation: 'UIDAI only uses uidai.gov.in domain. Aadhaar cards are not suspended via SMS.'
  },
  { 
    id: 8, 
    text: 'IRCTC: Your ticket booking failed. Amount ₹2,340 will be refunded in 5-7 working days. PNR: 4567891234', 
    isScam: false,
    difficulty: 'hard',
    redFlags: [],
    explanation: 'Standard IRCTC refund notification with proper PNR format.'
  },
  { 
    id: 9, 
    text: 'Income Tax Dept: You have a refund of ₹18,750. Claim now before March 31st. Login: incometax-refund.co.in', 
    isScam: true,
    difficulty: 'hard',
    redFlags: ['Fake government domain', 'Deadline pressure', 'Refund bait'],
    explanation: 'Official IT dept uses incometaxindia.gov.in domain only.'
  },
  { 
    id: 10, 
    text: 'Paytm: ₹500 cashback credited to your wallet for UPI transaction. Check wallet balance in app.', 
    isScam: false,
    difficulty: 'medium',
    redFlags: [],
    explanation: 'Standard cashback notification without any suspicious links or requests.'
  }
];

export default function ScamGame({ navigation }) {
  const [step, setStep] = useState('intro'); 
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    wrong: 0,
    timeBonus: 0,
    difficultyBonus: 0
  });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerInterval = useRef(null);

  const startScaleAnimation = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const animateMessage = () => {
    messageAnim.setValue(0);
    Animated.timing(messageAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  const updateProgress = () => {
    const progress = (currentIndex + 1) / scamMessages.length;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const startTimer = () => {
    setTimeLeft(30);
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const handleTimeUp = () => {
    stopTimer();
    Vibration.vibrate(500);
    setShowExplanation(true);
    // Treat as wrong answer
    setStreak(0);
    setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
  };

  useEffect(() => {
    if (step === 'game') {
      animateMessage();
      updateProgress();
      startTimer();
    }
    if (step === 'score') {
      startScaleAnimation();
      stopTimer();
    }

    return () => stopTimer();
  }, [step, currentIndex]);

  const calculateScore = (isCorrect, difficulty, timeLeft) => {
    let points = 0;
    
    if (isCorrect) {
      // Base points
      points += 5;
      
      // Difficulty bonus
      switch (difficulty) {
        case 'easy': points += 2; break;
        case 'medium': points += 5; break;
        case 'hard': points += 8; break;
      }
      
      // Time bonus (faster = more points)
      if (timeLeft > 20) points += 5;
      else if (timeLeft > 10) points += 3;
      else if (timeLeft > 5) points += 1;
      
      // Streak bonus
      if (streak >= 3) points += 3;
      if (streak >= 5) points += 5;
    }
    
    return points;
  };

  const handleStartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setShowExplanation(false);
    setGameStats({ correct: 0, wrong: 0, timeBonus: 0, difficultyBonus: 0 });
    setStep('game');
  };

  const handleAnswer = (userChoice) => {
    stopTimer();
    const currentMessage = scamMessages[currentIndex];
    const isCorrect = (userChoice === 'scam' && currentMessage.isScam) || 
                     (userChoice === 'safe' && !currentMessage.isScam);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      
      const points = calculateScore(true, currentMessage.difficulty, timeLeft);
      setScore(prev => prev + points);
      setGameStats(prev => ({ 
        ...prev, 
        correct: prev.correct + 1,
        timeBonus: prev.timeBonus + (timeLeft > 10 ? 3 : 1),
        difficultyBonus: prev.difficultyBonus + (currentMessage.difficulty === 'hard' ? 8 : 
                         currentMessage.difficulty === 'medium' ? 5 : 2)
      }));
      
      // Success feedback
      Vibration.vibrate(100);
    } else {
      setStreak(0);
      setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      // Error feedback
      Vibration.vibrate([100, 100, 100]);
    }

    setShowExplanation(true);
  };

  const handleNextMessage = () => {
    setShowExplanation(false);
    
    if (currentIndex + 1 < scamMessages.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep('score');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#28a745';
      case 'medium': return '#ffc107';
      case 'hard': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPerformanceRating = (score) => {
    if (score >= 90) return { rating: 'Expert Fraud Fighter! 🏆', color: '#28a745' };
    if (score >= 75) return { rating: 'Scam Detective! 🕵️', color: '#17a2b8' };
    if (score >= 60) return { rating: 'Good Observer! 👀', color: '#ffc107' };
    if (score >= 40) return { rating: 'Need More Practice! 📚', color: '#fd7e14' };
    return { rating: 'Scam Vulnerable! ⚠️', color: '#dc3545' };
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {step === 'intro' && (
        <>
          <Text style={styles.title}>🚨 Advanced Scam Detection Challenge</Text>
          <LottieView
            source={require('../../assets/bill-anim.json')} 
            autoPlay loop style={styles.animation}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.info}>🎯 Total Points: 100</Text>
            <Text style={styles.info}>⏱️ 30 seconds per message</Text>
            <Text style={styles.info}>🔥 Build streaks for bonus points</Text>
            <Text style={styles.info}>💡 Get explanations after each answer</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Challenge 🚀</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'game' && (
        <>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {scamMessages.length}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })}
                ]} 
              />
            </View>
          </View>

          {/* Timer and Score */}
          <View style={styles.gameHeader}>
            <Text style={[styles.timer, { color: timeLeft <= 10 ? '#dc3545' : '#28a745' }]}>
              ⏱️ {timeLeft}s
            </Text>
            <Text style={styles.currentScore}>Score: {score}</Text>
            {streak > 0 && (
              <Text style={styles.streak}>🔥 {streak} streak</Text>
            )}
          </View>

          <Animated.View style={[styles.gameBox, {
            opacity: messageAnim,
            transform: [{ scale: messageAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
          }]}>
            {/* Difficulty Badge */}
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(scamMessages[currentIndex].difficulty) }]}>
              <Text style={styles.difficultyText}>
                {scamMessages[currentIndex].difficulty.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.messageText}>{scamMessages[currentIndex].text}</Text>

            {!showExplanation ? (
              <>
                <TouchableOpacity 
                  style={styles.buttonScam} 
                  onPress={() => handleAnswer('scam')}
                  disabled={showExplanation}
                >
                  <Text style={styles.buttonText}>🚨 SCAM</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.buttonSafe} 
                  onPress={() => handleAnswer('safe')}
                  disabled={showExplanation}
                >
                  <Text style={styles.buttonText}>✅ SAFE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>
                  {((gameStats.correct + gameStats.wrong === currentIndex + 1 && 
                    gameStats.correct > gameStats.wrong) ? '✅ Correct!' : '❌ Wrong!')}
                </Text>
                
                <Text style={styles.explanation}>
                  {scamMessages[currentIndex].explanation}
                </Text>

                {scamMessages[currentIndex].redFlags.length > 0 && (
                  <View style={styles.redFlagsContainer}>
                    <Text style={styles.redFlagsTitle}>🚩 Red Flags:</Text>
                    {scamMessages[currentIndex].redFlags.map((flag, index) => (
                      <Text key={index} style={styles.redFlag}>• {flag}</Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.nextButton} onPress={handleNextMessage}>
                  <Text style={styles.buttonText}>
                    {currentIndex + 1 < scamMessages.length ? 'Next Message ➡️' : 'View Results 📊'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </>
      )}

      {step === 'score' && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.title}>🎉 Challenge Completed!</Text>
          
          <View style={styles.finalScoreContainer}>
            <Text style={styles.finalScore}>{score}/100</Text>
            <Text style={[styles.performanceRating, { color: getPerformanceRating(score).color }]}>
              {getPerformanceRating(score).rating}
            </Text>
          </View>

          <View style={styles.detailedStats}>
            <Text style={styles.statsTitle}>📊 Performance Breakdown:</Text>
            <Text style={styles.statItem}>✅ Correct Answers: {gameStats.correct}/{scamMessages.length}</Text>
            <Text style={styles.statItem}>❌ Wrong Answers: {gameStats.wrong}/{scamMessages.length}</Text>
            <Text style={styles.statItem}>⚡ Time Bonus: +{gameStats.timeBonus} points</Text>
            <Text style={styles.statItem}>🎯 Difficulty Bonus: +{gameStats.difficultyBonus} points</Text>
            <Text style={styles.statItem}>🔥 Max Streak: {maxStreak} messages</Text>
            <Text style={styles.statItem}>📈 Accuracy: {((gameStats.correct / scamMessages.length) * 100).toFixed(1)}%</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Play Again 🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Games 🏠</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 20, 
    backgroundColor: '#f8f9fa', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  animation: { 
    width: 200, 
    height: 200, 
    marginBottom: 20 
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 15,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#495057',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  streak: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fd7e14',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 15,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameBox: { 
    alignItems: 'center', 
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    color: '#dc3545', 
    textAlign: 'center' 
  },
  info: { 
    fontSize: 16, 
    marginBottom: 8, 
    textAlign: 'center', 
    color: '#495057',
    fontWeight: '500',
  },
  messageText: { 
    fontSize: 16, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#212529', 
    padding: 15, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#dee2e6', 
    width: '100%',
    lineHeight: 22,
  },
  explanationContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  explanation: {
    fontSize: 15,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  redFlagsContainer: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  redFlagsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  redFlag: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 2,
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 15, 
    borderRadius: 25, 
    marginBottom: 15, 
    width: '80%', 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  buttonScam: { 
    backgroundColor: '#dc3545', 
    padding: 15, 
    borderRadius: 25, 
    marginBottom: 15, 
    width: '80%', 
    alignItems: 'center', 
    elevation: 3 
  },
  buttonSafe: { 
    backgroundColor: '#28a745', 
    padding: 15, 
    borderRadius: 25, 
    marginBottom: 15, 
    width: '80%', 
    alignItems: 'center', 
    elevation: 3 
  },
  nextButton: {
    backgroundColor: '#17a2b8',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
  },
  resultBox: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 25, 
    alignItems: 'center', 
    width: '95%', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  finalScoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  finalScore: { 
    fontSize: 48, 
    fontWeight: 'bold', 
    color: '#007bff',
    marginBottom: 5,
  },
  performanceRating: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailedStats: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
    textAlign: 'center',
  },
  statItem: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
    paddingLeft: 5,
  },
  backButton: { 
    backgroundColor: '#6c757d', 
    padding: 15, 
    borderRadius: 25, 
    marginTop: 10, 
    width: '80%', 
    alignItems: 'center', 
    elevation: 3 
  },
});