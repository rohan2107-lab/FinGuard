import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ExpenseGuessGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionScores, setQuestionScores] = useState([]);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    priceRange: true,
    extraTime: true
  });
  const [showFiftyFifty, setShowFiftyFifty] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  // Enhanced expense questions with multiple difficulty levels
  const expenseQuestions = [
    {
      id: 1,
      item: 'Cup of Coffee',
      emoji: '☕',
      actualPrice: 120,
      category: 'Food & Drink',
      difficulty: 'easy',
      hint: 'Popular chain cafe in India',
      location: 'Urban cafe',
      priceRange: [80, 200],
      alternativeOptions: [50, 120, 180, 250]
    },
    {
      id: 2,
      item: 'Movie Ticket',
      emoji: '🎬',
      actualPrice: 280,
      category: 'Entertainment',
      difficulty: 'medium',
      hint: 'Weekend show, multiplex cinema',
      location: 'City multiplex',
      priceRange: [200, 400],
      alternativeOptions: [150, 280, 350, 500]
    },
    {
      id: 3,
      item: 'Metro Train (10km)',
      emoji: '🚇',
      actualPrice: 35,
      category: 'Transportation',
      difficulty: 'easy',
      hint: 'Delhi Metro, 10 stations',
      location: 'Delhi NCR',
      priceRange: [20, 60],
      alternativeOptions: [15, 35, 50, 80]
    },
    {
      id: 4,
      item: 'Pizza (Medium)',
      emoji: '🍕',
      actualPrice: 450,
      category: 'Food & Drink',
      difficulty: 'medium',
      hint: 'Dominos/Pizza Hut medium pizza',
      location: 'Food delivery',
      priceRange: [300, 600],
      alternativeOptions: [250, 450, 650, 800]
    },
    {
      id: 5,
      item: 'Uber Ride (5km)',
      emoji: '🚗',
      actualPrice: 180,
      category: 'Transportation',
      difficulty: 'medium',
      hint: 'Peak hours, city traffic',
      location: 'Urban area',
      priceRange: [120, 250],
      alternativeOptions: [100, 180, 220, 300]
    },
    {
      id: 6,
      item: 'Gym Monthly Fee',
      emoji: '💪',
      actualPrice: 2500,
      category: 'Health & Fitness',
      difficulty: 'hard',
      hint: 'Mid-range gym with equipment',
      location: 'Local fitness center',
      priceRange: [1500, 4000],
      alternativeOptions: [1200, 2500, 3500, 5000]
    },
    {
      id: 7,
      item: 'Smartphone Screen Repair',
      emoji: '📱',
      actualPrice: 1200,
      category: 'Services',
      difficulty: 'hard',
      hint: 'iPhone screen replacement',
      location: 'Authorized service center',
      priceRange: [800, 2000],
      alternativeOptions: [600, 1200, 1800, 2500]
    },
    {
      id: 8,
      item: 'Haircut (Men)',
      emoji: '✂️',
      actualPrice: 150,
      category: 'Personal Care',
      difficulty: 'easy',
      hint: 'Regular salon, not premium',
      location: 'Local salon',
      priceRange: [80, 300],
      alternativeOptions: [50, 150, 250, 400]
    },
    {
      id: 9,
      item: 'Internet (Monthly)',
      emoji: '🌐',
      actualPrice: 800,
      category: 'Utilities',
      difficulty: 'medium',
      hint: '100 Mbps broadband plan',
      location: 'Home connection',
      priceRange: [500, 1200],
      alternativeOptions: [400, 800, 1000, 1500]
    },
    {
      id: 10,
      item: 'Grocery (Weekly)',
      emoji: '🛒',
      actualPrice: 1500,
      category: 'Essentials',
      difficulty: 'hard',
      hint: 'Family of 4, basic necessities',
      location: 'Supermarket',
      priceRange: [1000, 2500],
      alternativeOptions: [800, 1500, 2000, 3000]
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      // Time's up - auto submit with 0 points
      handleTimeUp();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, showResult]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateScore = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setIsTimerActive(true);
    setTimeLeft(selectedDifficulty === 'easy' ? 45 : selectedDifficulty === 'medium' ? 30 : 20);
  };

  const handleTimeUp = () => {
    setQuestionScores([...questionScores, 0]);
    setShowResult(true);
    setIsTimerActive(false);
    setStreak(0);
  };

  const calculateDetailedScore = (guess, actual, timeUsed, hintsUsedForQuestion, difficulty) => {
    const timeTaken = (difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20) - timeLeft;
    const difference = Math.abs(guess - actual);
    const percentage = (difference / actual) * 100;
    
    let baseScore = 0;
    if (percentage <= 5) baseScore = 10;      // Perfect
    else if (percentage <= 10) baseScore = 8;  // Excellent
    else if (percentage <= 20) baseScore = 6;  // Very Good
    else if (percentage <= 30) baseScore = 4;  // Good
    else if (percentage <= 50) baseScore = 2;  // Fair
    else baseScore = 1;                        // Poor

    // Time bonus (max 2 points)
    const timeBonus = Math.max(0, Math.min(2, Math.floor((timeLeft / (difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20)) * 2)));
    
    // Hint penalty
    const hintPenalty = hintsUsedForQuestion * 0.5;
    
    // Difficulty multiplier
    const difficultyMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'medium' ? 1.0 : 1.2;
    
    const finalScore = Math.max(0, (baseScore + timeBonus - hintPenalty) * difficultyMultiplier);
    return Math.round(finalScore * 10) / 10; // Round to 1 decimal
  };

  const submitGuess = () => {
    if (!userGuess || userGuess.trim() === '') {
      Alert.alert('Please enter your guess!');
      return;
    }

    const guess = parseFloat(userGuess);
    const actual = expenseQuestions[currentQuestion].actualPrice;
    const questionHints = showHint ? 1 : 0;
    const points = calculateDetailedScore(guess, actual, timeLeft, questionHints, difficulty);
    
    setQuestionScores([...questionScores, points]);
    setTotalScore(prevScore => prevScore + points);
    setShowResult(true);
    setIsTimerActive(false);
    animateScore();
    
    if (points >= 6) {
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < expenseQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserGuess('');
      setShowResult(false);
      setShowHint(false);
      setShowFiftyFifty(false);
      setShowPriceRange(false);
      setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20);
      setIsTimerActive(true);
    } else {
      setGameOver(true);
      setIsTimerActive(false);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setUserGuess('');
    setTotalScore(0);
    setGameOver(false);
    setShowResult(false);
    setStreak(0);
    setGameStarted(false);
    setHintsUsed(0);
    setShowHint(false);
    setQuestionScores([]);
    setLifelines({ fiftyFifty: true, priceRange: true, extraTime: true });
    setIsTimerActive(false);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const useLifeline = (type) => {
    if (!lifelines[type]) return;

    if (type === 'fiftyFifty') {
      setShowFiftyFifty(true);
      setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    } else if (type === 'priceRange') {
      setShowPriceRange(true);
      setLifelines(prev => ({ ...prev, priceRange: false }));
    } else if (type === 'extraTime') {
      setTimeLeft(prev => prev + 15);
      setLifelines(prev => ({ ...prev, extraTime: false }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#4CAF50';
    if (score >= 6) return '#FF9800';
    if (score >= 4) return '#2196F3';
    return '#F44336';
  };

  const getAccuracyMessage = (guess, actual) => {
    const difference = Math.abs(guess - actual);
    const percentage = (difference / actual) * 100;
    
    if (percentage <= 5) return 'Perfect! 🎯';
    if (percentage <= 10) return 'Excellent! 🎉';
    if (percentage <= 20) return 'Very Good! 👏';
    if (percentage <= 30) return 'Good! 👍';
    if (percentage <= 50) return 'Fair 🤔';
    return 'Keep trying! 💪';
  };

  // Game Start Screen
  if (!gameStarted) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.startScreenContainer}>
          <View style={styles.startCard}>
            <View style={styles.startHeader}>
              <Text style={styles.startEmoji}>💰</Text>
              <Text style={styles.startTitle}>Expense Guesser</Text>
              <Text style={styles.startSubtitle}>Test your knowledge of everyday prices!</Text>
            </View>
            
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyTitle}>Choose Difficulty</Text>
              <TouchableOpacity 
                style={[styles.difficultyButton, styles.easyButton]}
                onPress={() => startGame('easy')}
              >
                <Text style={styles.difficultyButtonText}>Easy (45s per question)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.difficultyButton, styles.mediumButton]}
                onPress={() => startGame('medium')}
              >
                <Text style={styles.difficultyButtonText}>Medium (30s per question)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.difficultyButton, styles.hardButton]}
                onPress={() => startGame('hard')}
              >
                <Text style={styles.difficultyButtonText}>Hard (20s per question)</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.featuresContainer}>
              <Text style={styles.featureText}>🎯 Total Score: 100 points</Text>
              <Text style={styles.featureText}>⏰ Time bonus available</Text>
              <Text style={styles.featureText}>💡 Lifelines included</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Game Over Screen
  if (gameOver) {
    const finalScore = Math.round(totalScore * 10) / 10;
    
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameOverContainer}>
          <View style={styles.gameOverCard}>
            <View style={styles.gameOverHeader}>
              <Text style={styles.gameOverEmoji}>🏆</Text>
              <Text style={styles.gameOverTitle}>Game Complete!</Text>
            </View>
            
            <View style={styles.finalScoreCard}>
              <Text style={styles.finalScoreLabel}>Final Score</Text>
              <Text style={styles.finalScoreValue}>{finalScore}</Text>
              <Text style={styles.finalScoreMax}>out of 100 points</Text>
              <Text style={styles.performanceText}>
                {finalScore >= 80 ? '🏆 Financial Expert!' :
                 finalScore >= 60 ? '💰 Money Smart!' :
                 finalScore >= 40 ? '📊 Good Knowledge!' :
                 finalScore >= 20 ? '💡 Keep Learning!' :
                 '🎯 Practice More!'}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{difficulty.toUpperCase()}</Text>
                <Text style={styles.statLabel}>Difficulty</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{hintsUsed}</Text>
                <Text style={styles.statLabel}>Hints Used</Text>
              </View>
            </View>

            <View style={styles.questionBreakdown}>
              <Text style={styles.breakdownTitle}>Question Breakdown</Text>
              <View style={styles.scoreGrid}>
                {questionScores.map((score, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <View style={[
                      styles.scoreCircle,
                      { backgroundColor: score >= 8 ? '#4CAF50' : score >= 6 ? '#2196F3' : score >= 4 ? '#FF9800' : '#F44336' }
                    ]}>
                      <Text style={styles.scoreCircleText}>{score}</Text>
                    </View>
                    <Text style={styles.scoreCircleLabel}>Q{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  const question = expenseQuestions[currentQuestion];
  const currentScore = questionScores.reduce((sum, score) => sum + score, 0);
  
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 Expense Guesser</Text>
          <View style={styles.headerStats}>
            <View style={styles.questionProgress}>
              <Text style={styles.progressText}>Question {currentQuestion + 1}/10</Text>
              <Text style={styles.scoreText}>{Math.round(currentScore * 10) / 10}/100</Text>
            </View>
          </View>
          
          <View style={styles.gameStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statText}>{streak} 🔥</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statText}>{difficulty.toUpperCase()}</Text>
            </View>
            <View style={[styles.statItem, timeLeft <= 10 && styles.urgentTimer]}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={[styles.statText, timeLeft <= 10 && styles.urgentText]}>⏰ {timeLeft}s</Text>
            </View>
          </View>
          
          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${((currentQuestion + 1) / 10) * 100}%` }
            ]} />
          </View>
        </View>

        {/* Question Card */}
        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
          
          <Text style={styles.emoji}>{question.emoji}</Text>
          <Text style={styles.itemName}>{question.item}</Text>
          <Text style={styles.locationText}>{question.location}</Text>

          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>💡 Hint: {question.hint}</Text>
            </View>
          )}

          {showPriceRange && (
            <View style={styles.priceRangeContainer}>
              <Text style={styles.priceRangeText}>📊 Price Range: ₹{question.priceRange[0]} - ₹{question.priceRange[1]}</Text>
            </View>
          )}

          {showFiftyFifty && (
            <View style={styles.fiftyFiftyContainer}>
              <Text style={styles.fiftyFiftyText}>🎯 50-50: Either ₹{question.alternativeOptions[1]} or ₹{question.alternativeOptions[2]}</Text>
            </View>
          )}

          {!showResult ? (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What's your guess? (₹)</Text>
              <TextInput
                style={styles.input}
                value={userGuess}
                onChangeText={setUserGuess}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              
              {/* Lifelines */}
              <View style={styles.lifelinesContainer}>
                <TouchableOpacity
                  style={[styles.lifelineButton, !lifelines.fiftyFifty && styles.disabledLifeline]}
                  onPress={() => useLifeline('fiftyFifty')}
                  disabled={!lifelines.fiftyFifty}
                >
                  <Text style={[styles.lifelineText, !lifelines.fiftyFifty && styles.disabledText]}>🎯 50-50</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.lifelineButton, !lifelines.priceRange && styles.disabledLifeline]}
                  onPress={() => useLifeline('priceRange')}
                  disabled={!lifelines.priceRange}
                >
                  <Text style={[styles.lifelineText, !lifelines.priceRange && styles.disabledText]}>📊 Range</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.lifelineButton, !lifelines.extraTime && styles.disabledLifeline]}
                  onPress={() => useLifeline('extraTime')}
                  disabled={!lifelines.extraTime}
                >
                  <Text style={[styles.lifelineText, !lifelines.extraTime && styles.disabledText]}>⏰ +15s</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.lifelineButton, showHint && styles.disabledLifeline]}
                  onPress={() => {
                    setShowHint(true);
                    setHintsUsed(hintsUsed + 1);
                  }}
                  disabled={showHint}
                >
                  <Text style={[styles.lifelineText, showHint && styles.disabledText]}>💡 Hint</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={submitGuess}>
                <Text style={styles.submitButtonText}>Submit Guess</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Result</Text>
              
              <View style={styles.priceComparison}>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Actual Price</Text>
                  <Text style={styles.actualPrice}>₹{question.actualPrice}</Text>
                </View>
                <View style={styles.priceItem}>
                  <Text style={styles.priceLabel}>Your Guess</Text>
                  <Text style={styles.yourGuess}>₹{userGuess}</Text>
                </View>
              </View>
              
              <View style={styles.scoreSection}>
                <Animated.Text style={[
                  styles.pointsText,
                  { color: getScoreColor(questionScores[questionScores.length - 1]), transform: [{ scale: scaleAnim }] }
                ]}>
                  +{questionScores[questionScores.length - 1]} points
                </Animated.Text>
                <Text style={styles.accuracyText}>
                  {getAccuracyMessage(parseFloat(userGuess), question.actualPrice)}
                </Text>
                <Text style={styles.timeText}>
                  Time taken: {(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20) - timeLeft}s
                </Text>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion === expenseQuestions.length - 1 ? 'Finish Game' : 'Next Question'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startScreenContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  startHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  startEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  difficultyContainer: {
    marginBottom: 25,
  },
  difficultyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  difficultyButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#2196F3',
  },
  hardButton: {
    backgroundColor: '#F44336',
  },
  difficultyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  gameOverContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  gameOverHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  gameOverEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  finalScoreCard: {
    backgroundColor: '#f8f9ff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  finalScoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  finalScoreMax: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  performanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  questionBreakdown: {
    marginBottom: 25,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  scoreItem: {
    alignItems: 'center',
    margin: 5,
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCircleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreCircleLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
  },
  playAgainButton: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  headerStats: {
    alignItems: 'center',
    marginBottom: 15,
  },
  questionProgress: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  urgentTimer: {
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  urgentText: {
    color: '#ffcccb',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 70,
    textAlign: 'center',
    marginBottom: 15,
  },
  itemName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  hintContainer: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#856404',
  },
  priceRangeContainer: {
    backgroundColor: '#d1ecf1',
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#0c5460',
  },
  fiftyFiftyContainer: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  fiftyFiftyText: {
    fontSize: 14,
    color: '#155724',
  },
  inputSection: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    width: 200,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  lifelinesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 25,
  },
  lifelineButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
  },
  disabledLifeline: {
    backgroundColor: '#ccc',
  },
  lifelineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledText: {
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  priceItem: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  actualPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  yourGuess: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  accuracyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseGuessGame;