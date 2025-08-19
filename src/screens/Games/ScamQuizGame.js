import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

/**
 * Enhanced ATM & Scam Safety Game for React Native
 * 
 * Features:
 * - Multiple game modes (Quick Quiz, Scenario Challenge, Time Attack)
 * - 100-point scoring system with performance bonuses
 * - Realistic scenarios with visual elements
 * - Streak bonuses and time bonuses
 * - Achievement system
 * - Difficulty levels
 */

// Enhanced Quiz Data with difficulty levels and categories
const QUIZ_DATA = [
  // ATM Safety - Basic (5 points each)
  {
    id: 1,
    category: "ATM Safety",
    difficulty: "basic",
    points: 5,
    question: "You notice the card slot on an ATM looks different and seems loose. What's your best action?",
    scenario: "🏧 You're at an ATM late at night and notice something unusual about the card reader.",
    options: [
      "Use it quickly and leave",
      "Try to fix it yourself", 
      "Don't use it and report to bank immediately",
      "Use another slot on same machine"
    ],
    correctAnswer: 2,
    explanation: "Card skimmers are often attached to ATM slots. If anything looks suspicious or different, avoid using the ATM entirely and report it to the bank immediately.",
    timeLimit: 15
  },
  {
    id: 2,
    category: "Phone Scams",
    difficulty: "basic",
    points: 5,
    question: "A caller claims to be from your bank and asks for your OTP to 'verify your identity'. What do you do?",
    scenario: "📞 Unknown number calling: 'Hello, this is State Bank security. We need to verify your account.'",
    options: [
      "Give the OTP since they're from the bank",
      "Ask for their employee ID number",
      "Never share OTP with anyone calling you",
      "Give only half the OTP digits"
    ],
    correctAnswer: 2,
    explanation: "Banks NEVER ask for OTPs over the phone. OTPs are meant only for you to complete transactions. This is a common fraud technique.",
    timeLimit: 12
  },
  // UPI Scams - Intermediate (7 points each)
  {
    id: 3,
    category: "UPI Scams",
    difficulty: "intermediate", 
    points: 7,
    question: "You receive a UPI request for ₹1 with message 'Cashback credited - Accept to receive ₹2000 cashback'. The request shows 'PAY ₹1'. What do you do?",
    scenario: "📱 UPI Notification: 'Pay ₹1 to +91-XXXXX-XXXX' with message about cashback",
    options: [
      "Accept it to get the cashback",
      "Decline - it's a trick to make me pay",
      "Contact the sender first",
      "Accept but only pay ₹0.50"
    ],
    correctAnswer: 1,
    explanation: "This is a UPI reversal scam. The message is misleading - you're actually PAYING ₹1, not receiving money. Always check if it says 'PAY' or 'RECEIVE' before accepting.",
    timeLimit: 18
  },
  {
    id: 4,
    category: "Investment Scams",
    difficulty: "intermediate",
    points: 7,
    question: "A WhatsApp group admin promises 300% returns in 30 days through 'Stock Market Tips'. They ask for ₹5000 joining fee. What's your response?",
    scenario: "💬 WhatsApp: 'Join our premium group! Last month members made 400% profit! Limited seats - pay ₹5000 now!'",
    options: [
      "Pay and join - sounds profitable",
      "Negotiate for lower joining fee", 
      "It's a scam - legitimate investments don't guarantee such returns",
      "Ask for previous profit statements first"
    ],
    correctAnswer: 2,
    explanation: "No legitimate investment guarantees such high returns. This is a classic Ponzi scheme. Real stock market experts don't need joining fees.",
    timeLimit: 20
  },
  // Advanced Scenarios (10 points each)
  {
    id: 5,
    category: "Social Engineering",
    difficulty: "advanced",
    points: 10,
    question: "You get a call: 'Your Aadhaar is linked to money laundering. To avoid arrest, immediately transfer ₹50,000 to this account for verification.' What do you do?",
    scenario: "☎️ Caller ID shows 'Police Station' - 'This is urgent! Your Aadhaar is compromised in a money laundering case!'",
    options: [
      "Transfer money immediately to avoid arrest",
      "Ask for FIR number and hang up",
      "Go to police station with the money",
      "Transfer smaller amount first"
    ],
    correctAnswer: 1,
    explanation: "This is a government impersonation scam. Police never ask for money over phone. Real legal issues involve proper documentation and court procedures.",
    timeLimit: 25
  },
  {
    id: 6,
    category: "Online Shopping",
    difficulty: "advanced", 
    points: 10,
    question: "An online seller offers iPhone 15 for ₹15,000 (market price ₹80,000) but wants full payment via UPI before delivery. Red flags?",
    scenario: "🛒 Facebook Marketplace: 'iPhone 15 Pro Max - Brand new, sealed box - ₹15,000 only! Pay now, delivery tomorrow!'",
    options: [
      "Great deal - pay immediately",
      "Too good to be true - likely fake/stolen/scam",
      "Negotiate to pay ₹20,000",
      "Ask for half payment first"
    ],
    correctAnswer: 1,
    explanation: "Prices far below market value are major red flags. Legitimate sellers don't need full advance payment. This is likely a fake product scam.",
    timeLimit: 22
  },
  // Cryptocurrency & Investment (10 points each)
  {
    id: 7,
    category: "Crypto Scams",
    difficulty: "advanced",
    points: 10,
    question: "A 'crypto expert' on Instagram asks you to send Bitcoin to 'double your investment in 24 hours'. What's happening?",
    scenario: "📸 Instagram DM: 'I can double your Bitcoin! Send me 0.1 BTC, get back 0.2 BTC tomorrow! Limited time offer!'",
    options: [
      "Send small amount to test",
      "Classic doubling scam - never send crypto",
      "Ask for credentials first",
      "Send but ask for 50% upfront"
    ],
    correctAnswer: 1,
    explanation: "Cryptocurrency doubling schemes are always scams. Once you send crypto, it's gone forever. No legitimate investment doubles money overnight.",
    timeLimit: 18
  },
  // Emergency Scams (8 points each)
  {
    id: 8,
    category: "Emergency Scams",
    difficulty: "intermediate",
    points: 8,
    question: "You get a call: 'Your son met with accident, needs ₹2 lakhs for surgery immediately. Send money to this account.' Your son's phone is unreachable. What do you do?",
    scenario: "📞 Panicked voice: 'Hello uncle/aunty, I'm calling from City Hospital. Your son had an accident and needs immediate surgery!'",
    options: [
      "Send money immediately - it's emergency",
      "Try calling other family members/friends to verify",
      "Rush to the mentioned hospital",
      "Send partial amount first"
    ],
    correctAnswer: 1,
    explanation: "Emergency scams exploit emotions. Always verify through multiple sources. Hospitals have proper procedures and don't demand immediate money transfers.",
    timeLimit: 30
  },
  // Banking Fraud (7 points each)  
  {
    id: 9,
    category: "Banking Fraud",
    difficulty: "intermediate",
    points: 7,
    question: "SMS: 'Your account will be blocked in 2 hours due to KYC expiry. Click link to update: bit.ly/kyc-update-urgent'. What should you do?",
    scenario: "📱 SMS from 'SB-SBIINB': 'URGENT: Complete KYC update to avoid account suspension. Click: bit.ly/urgent-kyc'",
    options: [
      "Click link and update KYC",
      "Call bank's official number to verify",
      "Visit bank branch immediately", 
      "Forward SMS to friends for advice"
    ],
    correctAnswer: 1,
    explanation: "Banks never send KYC update links via SMS. Always call the official bank number or visit branch to verify such messages. These links lead to fake websites.",
    timeLimit: 15
  },
  // Tech Support Scams (6 points each)
  {
    id: 10,
    category: "Tech Support",
    difficulty: "basic",
    points: 6,
    question: "Pop-up on your computer: 'VIRUS DETECTED! Call Microsoft Support: 1800-XXX-XXXX immediately!' What do you do?",
    scenario: "💻 Loud beeping sound from computer with pop-up: 'Your computer is infected! Call now or lose all data!'",
    options: [
      "Call the number immediately",
      "Close browser and run actual antivirus scan",
      "Restart computer and call the number",
      "Click 'Fix Now' button on pop-up"
    ],
    correctAnswer: 1,
    explanation: "These are fake pop-ups designed to scare you. Microsoft never puts support numbers in pop-ups. Close the browser and run your legitimate antivirus software.",
    timeLimit: 12
  },
  // Romance/Dating Scams (8 points each)
  {
    id: 11,
    category: "Romance Scams", 
    difficulty: "intermediate",
    points: 8,
    question: "Online dating match claims to be overseas military personnel, asks for ₹50,000 to pay for flight tickets to meet you. Red flags?",
    scenario: "💕 Dating app message: 'I'm deployed in Syria. I need help with flight booking fees to come meet you. Can you send ₹50,000?'",
    options: [
      "Send money - they love me",
      "Classic romance scam - military personnel don't need money for flights", 
      "Send smaller amount first",
      "Ask for video call proof"
    ],
    correctAnswer: 1,
    explanation: "Romance scammers often pose as military personnel. Real military members don't need civilians to pay for travel. Never send money to online contacts you haven't met.",
    timeLimit: 20
  },
  // Lottery/Prize Scams (5 points each)
  {
    id: 12,
    category: "Lottery Scams",
    difficulty: "basic", 
    points: 5,
    question: "Email: 'Congratulations! You won ₹25 lakhs in Google Lottery! Pay ₹15,000 processing fee to claim prize.' Your response?",
    scenario: "📧 From: google-lottery@gmail.com 'WINNER ANNOUNCEMENT: Your email won our monthly lottery! Claim now!'",
    options: [
      "Pay processing fee to claim prize",
      "Negotiate lower processing fee",
      "Delete email - it's a scam",
      "Ask them to deduct fee from prize"
    ],
    correctAnswer: 2,
    explanation: "You cannot win lotteries you never entered. Legitimate prizes don't require advance fees. Google doesn't run email lotteries.",
    timeLimit: 10
  }
];

// Game modes configuration
const GAME_MODES = {
  QUICK_QUIZ: {
    name: "Quick Quiz",
    description: "5 random questions, no time pressure",
    icon: "quiz",
    questionCount: 5,
    timeLimit: false,
    pointMultiplier: 1
  },
  SCENARIO_CHALLENGE: {
    name: "Scenario Challenge", 
    description: "10 realistic scenarios with time limits",
    icon: "security",
    questionCount: 10,
    timeLimit: true,
    pointMultiplier: 1.2
  },
  TIME_ATTACK: {
    name: "Time Attack",
    description: "12 questions, race against time!",
    icon: "flash-on",
    questionCount: 12,
    timeLimit: true,
    pointMultiplier: 1.5,
    fastAnswerBonus: true
  }
};

const EnhancedScamSafetyGame = ({ navigation }) => {
  // Game state
  const [gameMode, setGameMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalTimeBonus, setTotalTimeBonus] = useState(0);
  const [achievements, setAchievements] = useState([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && gameMode && GAME_MODES[gameMode].timeLimit) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, showExplanation, gameMode]);

  const selectGameMode = (mode) => {
    setGameMode(mode);
    initializeGame(mode);
  };

  const initializeGame = (mode) => {
    const config = GAME_MODES[mode];
    const shuffled = [...QUIZ_DATA].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, config.questionCount);
    
    setQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameCompleted(false);
    setUserAnswers([]);
    setStreak(0);
    setMaxStreak(0);
    setTotalTimeBonus(0);
    setAchievements([]);
    
    if (config.timeLimit && selectedQuestions.length > 0) {
      setTimeLeft(selectedQuestions[0].timeLimit);
    }
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1); // Indicate timeout
    setShowExplanation(true);
    setStreak(0);
    
    setUserAnswers([...userAnswers, {
      questionId: questions[currentQuestion].id,
      selectedAnswer: -1,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect: false,
      timeUsed: questions[currentQuestion].timeLimit,
      timedOut: true
    }]);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null || gameCompleted) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;
    const timeUsed = currentQ.timeLimit ? currentQ.timeLimit - timeLeft : 0;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    // Calculate points
    let points = 0;
    if (isCorrect) {
      points = currentQ.points;
      
      // Streak bonus (2 points per streak after 2)
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      
      if (newStreak > 2) {
        points += (newStreak - 2) * 2;
      }

      // Time bonus for time attack mode
      if (gameMode === 'TIME_ATTACK' && GAME_MODES[gameMode].fastAnswerBonus) {
        const timeBonus = Math.max(0, Math.floor((currentQ.timeLimit - timeUsed) / 3));
        points += timeBonus;
        setTotalTimeBonus(totalTimeBonus + timeBonus);
      }

      // Apply game mode multiplier
      points = Math.floor(points * GAME_MODES[gameMode].pointMultiplier);
    } else {
      setStreak(0);
    }

    setScore(score + points);

    // Check for achievements
    checkAchievements(newStreak || 0, isCorrect);

    setUserAnswers([...userAnswers, {
      questionId: currentQ.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQ.correctAnswer,
      isCorrect,
      pointsEarned: points,
      timeUsed,
      timedOut: false
    }]);
  };

  const checkAchievements = (currentStreak, isCorrect) => {
    const newAchievements = [...achievements];
    
    if (currentStreak === 3 && !achievements.includes('streak_3')) {
      newAchievements.push('streak_3');
    }
    if (currentStreak === 5 && !achievements.includes('streak_5')) {
      newAchievements.push('streak_5');
    }
    if (isCorrect && timeLeft > (questions[currentQuestion].timeLimit * 0.8) && !achievements.includes('speed_demon')) {
      newAchievements.push('speed_demon');
    }
    
    setAchievements(newAchievements);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setShowExplanation(false);
      
      if (gameMode && GAME_MODES[gameMode].timeLimit) {
        setTimeLeft(questions[nextQuestion].timeLimit);
      }
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameCompleted(false);
    setQuestions([]);
    setUserAnswers([]);
    setTimeLeft(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalTimeBonus(0);
    setAchievements([]);
  };

  const getPerformanceLevel = () => {
    const percentage = (score / 100) * 100;
    if (percentage >= 90) return { level: "Expert", color: "#4F46E5", emoji: "🏆" };
    if (percentage >= 75) return { level: "Advanced", color: "#059669", emoji: "⭐" };
    if (percentage >= 60) return { level: "Intermediate", color: "#D97706", emoji: "👍" };
    if (percentage >= 40) return { level: "Beginner", color: "#DC2626", emoji: "📚" };
    return { level: "Needs Practice", color: "#7C2D12", emoji: "💪" };
  };

  const achievementDetails = {
    'streak_3': { name: "Triple Threat", description: "3 correct answers in a row", icon: "🔥" },
    'streak_5': { name: "Unstoppable", description: "5 correct answers in a row", icon: "⚡" },
    'speed_demon': { name: "Speed Demon", description: "Quick correct answer", icon: "💨" }
  };

  // Game mode selection screen
  if (!gameMode) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.welcomeHeader}>
            <View style={styles.logoContainer}>
              <Icon name="security" size={60} color="#4F46E5" />
            </View>
            <Text style={styles.welcomeTitle}>Scam Safety Challenge</Text>
            <Text style={styles.welcomeSubtitle}>Test your knowledge and protect yourself from scams!</Text>
            <View style={styles.goalContainer}>
              <Icon name="emoji-events" size={20} color="#F59E0B" />
              <Text style={styles.goalText}>Goal: Score up to 100 points based on your performance!</Text>
            </View>
          </View>

          {/* Game Modes */}
          <View style={styles.gameModesContainer}>
            {Object.entries(GAME_MODES).map(([key, mode]) => (
              <TouchableOpacity
                key={key}
                style={styles.gameModeCard}
                onPress={() => selectGameMode(key)}
                activeOpacity={0.8}
              >
                <View style={styles.gameModeIcon}>
                  <Icon name={mode.icon} size={32} color="#4F46E5" />
                </View>
                <Text style={styles.gameModeTitle}>{mode.name}</Text>
                <Text style={styles.gameModeDescription}>{mode.description}</Text>
                <View style={styles.gameModeDetails}>
                  <Text style={styles.detailText}>Questions: {mode.questionCount}</Text>
                  <Text style={styles.detailText}>Time Limit: {mode.timeLimit ? "Yes" : "No"}</Text>
                  <Text style={styles.multiplierText}>Points Multiplier: {mode.pointMultiplier}x</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Scoring Information */}
          <View style={styles.scoringInfo}>
            <View style={styles.scoringHeader}>
              <Icon name="emoji-events" size={24} color="#F59E0B" />
              <Text style={styles.scoringTitle}>How Scoring Works</Text>
            </View>
            <View style={styles.scoringGrid}>
              <View style={[styles.scoringItem, { backgroundColor: '#F0FDF4' }]}>
                <Text style={[styles.scoringLabel, { color: '#15803D' }]}>Basic Questions</Text>
                <Text style={[styles.scoringPoints, { color: '#16A34A' }]}>5-6 points each</Text>
              </View>
              <View style={[styles.scoringItem, { backgroundColor: '#FFFBEB' }]}>
                <Text style={[styles.scoringLabel, { color: '#A16207' }]}>Intermediate</Text>
                <Text style={[styles.scoringPoints, { color: '#D97706' }]}>7-8 points each</Text>
              </View>
              <View style={[styles.scoringItem, { backgroundColor: '#FEF2F2' }]}>
                <Text style={[styles.scoringLabel, { color: '#B91C1C' }]}>Advanced</Text>
                <Text style={[styles.scoringPoints, { color: '#DC2626' }]}>10 points each</Text>
              </View>
              <View style={[styles.scoringItem, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.scoringLabel, { color: '#7C3AED' }]}>Bonus Points</Text>
                <Text style={[styles.scoringPoints, { color: '#8B5CF6' }]}>Streaks & Speed</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Game completed screen
  if (gameCompleted) {
    const performance = getPerformanceLevel();
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsScrollContainer}>
          <View style={styles.resultsCard}>
            {/* Performance Header */}
            <Text style={styles.resultsEmoji}>{performance.emoji}</Text>
            <Text style={styles.resultsTitle}>Game Complete!</Text>
            <Text style={[styles.finalScore, { color: performance.color }]}>{score}/100</Text>
            <Text style={styles.performanceLevel}>{performance.level}</Text>
            
            {/* Performance Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{correctAnswers}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{maxStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalTimeBonus}</Text>
                <Text style={styles.statLabel}>Time Bonus</Text>
              </View>
            </View>

            {/* Achievements */}
            {achievements.length > 0 && (
              <View style={styles.achievementsContainer}>
                <View style={styles.achievementsHeader}>
                  <Icon name="military-tech" size={20} color="#F59E0B" />
                  <Text style={styles.achievementsTitle}>Achievements Unlocked</Text>
                </View>
                <View style={styles.achievementsList}>
                  {achievements.map(achievement => (
                    <View key={achievement} style={styles.achievementItem}>
                      <Text style={styles.achievementIcon}>{achievementDetails[achievement].icon}</Text>
                      <View style={styles.achievementText}>
                        <Text style={styles.achievementName}>{achievementDetails[achievement].name}</Text>
                        <Text style={styles.achievementDesc}>{achievementDetails[achievement].description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={() => initializeGame(gameMode)}
                activeOpacity={0.8}
              >
                <Icon name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.changeModeButton}
                onPress={resetGame}
                activeOpacity={0.8}
              >
                <Icon name="home" size={20} color="#4F46E5" />
                <Text style={styles.changeModeText}>Change Mode</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Icon name="hourglass-empty" size={40} color="#4F46E5" />
        <Text style={styles.loadingText}>Loading game...</Text>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.gameScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.gameHeader}>
          <TouchableOpacity style={styles.headerButton} onPress={resetGame}>
            <Icon name="home" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{GAME_MODES[gameMode].name}</Text>
          <View style={styles.headerStats}>
            {GAME_MODES[gameMode].timeLimit && (
              <View style={[styles.timerContainer, timeLeft <= 5 && styles.timerUrgent]}>
                <Icon name="schedule" size={16} color={timeLeft <= 5 ? "#DC2626" : "#F59E0B"} />
                <Text style={[styles.timerText, timeLeft <= 5 && styles.timerUrgentText]}>{timeLeft}s</Text>
              </View>
            )}
            <View style={styles.scoreContainer}>
              <Icon name="stars" size={16} color="#4F46E5" />
              <Text style={styles.scoreText}>{score}/100</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Question {currentQuestion + 1} of {questions.length}</Text>
            {streak > 0 && (
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>🔥 {streak} streak</Text>
              </View>
            )}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View style={styles.questionMeta}>
              <View style={[
                styles.difficultyBadge,
                currentQ.difficulty === 'basic' && styles.difficultyBasic,
                currentQ.difficulty === 'intermediate' && styles.difficultyIntermediate,
                currentQ.difficulty === 'advanced' && styles.difficultyAdvanced
              ]}>
                <Text style={styles.difficultyText}>{currentQ.difficulty.toUpperCase()} • {currentQ.points} pts</Text>
              </View>
              <Text style={styles.categoryText}>{currentQ.category}</Text>
            </View>
            {GAME_MODES[gameMode].timeLimit && (
              <View style={[styles.questionTimer, timeLeft <= 5 && styles.questionTimerUrgent]}>
                <Icon name="schedule" size={16} color={timeLeft <= 5 ? "#DC2626" : "#4F46E5"} />
                <Text style={[styles.questionTimerText, timeLeft <= 5 && styles.questionTimerUrgentText]}>
                  {timeLeft}s
                </Text>
              </View>
            )}
          </View>

          {/* Scenario */}
          <View style={styles.scenarioContainer}>
            <Text style={styles.scenarioText}>{currentQ.scenario}</Text>
          </View>

          {/* Question */}
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              let buttonStyle = [styles.optionButton];
              let textStyle = [styles.optionText];
              
              if (selectedAnswer === null) {
                buttonStyle.push(styles.optionButtonDefault);
              } else if (index === currentQ.correctAnswer) {
                buttonStyle.push(styles.optionButtonCorrect);
                textStyle.push(styles.optionTextCorrect);
              } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
                buttonStyle.push(styles.optionButtonWrong);
                textStyle.push(styles.optionTextWrong);
              } else {
                buttonStyle.push(styles.optionButtonDisabled);
                textStyle.push(styles.optionTextDisabled);
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={buttonStyle}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionLabel}>
                      <Text style={styles.optionLabelText}>{String.fromCharCode(65 + index)}</Text>
                    </View>
                    <Text style={textStyle}>{option}</Text>
                    {selectedAnswer !== null && index === currentQ.correctAnswer && (
                      <Icon name="check-circle" size={20} color="#10B981" />
                    )}
                    {selectedAnswer === index && selectedAnswer !== currentQ.correctAnswer && (
                      <Icon name="cancel" size={20} color="#EF4444" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationContainer}>
              <View style={styles.explanationHeader}>
                <Icon 
                  name={selectedAnswer === currentQ.correctAnswer ? "lightbulb" : "info"} 
                  size={20} 
                  color={selectedAnswer === currentQ.correctAnswer ? "#10B981" : "#F59E0B"} 
                />
                <Text style={styles.explanationTitle}>
                  {selectedAnswer === currentQ.correctAnswer ? 
                    `Correct! +${Math.floor(currentQ.points * GAME_MODES[gameMode].pointMultiplier)} points` : 
                    selectedAnswer === -1 ? 'Time\'s up!' : 'Incorrect'}
                  {selectedAnswer === currentQ.correctAnswer && streak > 2 && (
                    <Text style={styles.streakBonus}> 🔥 +{(streak - 2) * 2} streak bonus!</Text>
                  )}
                </Text>
              </View>
              <Text style={styles.explanationText}>{currentQ.explanation}</Text>
            </View>
          )}

          {/* Next Button */}
          {showExplanation && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion === questions.length - 1 ? "View Results" : "Next Question"}
              </Text>
              <Icon 
                name={currentQuestion === questions.length - 1 ? "emoji-events" : "arrow-forward"} 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Live Stats */}
        <View style={styles.liveStatsCard}>
          <View style={styles.liveStatsGrid}>
            <View style={styles.liveStatItem}>
              <Text style={styles.liveStatNumber}>{score}</Text>
              <Text style={styles.liveStatLabel}>Score</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={styles.liveStatNumber}>{userAnswers.filter(a => a.isCorrect).length}</Text>
              <Text style={styles.liveStatLabel}>Correct</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={styles.liveStatNumber}>{streak}</Text>
              <Text style={styles.liveStatLabel}>Streak</Text>
            </View>
            <View style={styles.liveStatItem}>
              <Text style={styles.liveStatNumber}>
                {userAnswers.length > 0 ? 
                  Math.round((userAnswers.filter(a => a.isCorrect).length / userAnswers.length) * 100) : 0}%
              </Text>
              <Text style={styles.liveStatLabel}>Accuracy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  
  // Welcome Screen Styles
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  
  // Game Mode Cards
  gameModesContainer: {
    marginBottom: 24,
  },
  gameModeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gameModeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  gameModeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameModeDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  gameModeDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  
  // Scoring Info
  scoringInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  scoringGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoringItem: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  scoringLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoringPoints: {
    fontSize: 11,
  },
  
  // Results Screen
  resultsScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  resultsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  resultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performanceLevel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 24,
  },
  
  // Performance Stats
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  
  // Achievements
  achievementsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  achievementsList: {
    alignItems: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  achievementIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  achievementDesc: {
    fontSize: 10,
    color: '#A16207',
  },
  
  // Action Buttons
  actionButtons: {
    width: '100%',
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  changeModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
  },
  changeModeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginLeft: 8,
  },
  
  // Game Screen
  gameScrollView: {
    flex: 1,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  timerUrgent: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 4,
  },
  timerUrgentText: {
    color: '#991B1B',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3730A3',
    marginLeft: 4,
  },
  
  // Progress
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  streakContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  
  // Question Card
  questionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionMeta: {
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  difficultyBasic: {
    backgroundColor: '#D1FAE5',
  },
  difficultyIntermediate: {
    backgroundColor: '#FEF3C7',
  },
  difficultyAdvanced: {
    backgroundColor: '#FEE2E2',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  questionTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questionTimerUrgent: {
    backgroundColor: '#FEE2E2',
  },
  questionTimerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3730A3',
    marginLeft: 4,
  },
  questionTimerUrgentText: {
    color: '#991B1B',
  },
  
  // Scenario
  scenarioContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    marginBottom: 16,
  },
  scenarioText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  // Question
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 20,
  },
  
  // Options
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  optionButtonDefault: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  optionButtonCorrect: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  optionButtonWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: '600',
  },
  optionTextWrong: {
    color: '#991B1B',
    fontWeight: '600',
  },
  optionTextDisabled: {
    color: '#9CA3AF',
  },
  
  // Explanation
  explanationContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
    marginBottom: 16,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  streakBonus: {
    color: '#F59E0B',
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  // Next Button
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  
  // Live Stats
  liveStatsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  liveStatsGrid: {
    flexDirection: 'row',
  },
  liveStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  liveStatNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  liveStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default EnhancedScamSafetyGame;