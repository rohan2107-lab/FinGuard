import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ExpenseGuessGame = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  // Expense questions data
  const expenseQuestions = [
    {
      id: 1,
      item: 'Cup of Coffee',
      emoji: '☕',
      actualPrice: 150,
      hint: 'A regular coffee from a local cafe',
      category: 'Food & Drink'
    },
    {
      id: 2,
      item: 'Movie Ticket',
      emoji: '🎬',
      actualPrice: 250,
      hint: 'Single ticket for latest movie',
      category: 'Entertainment'
    },
    {
      id: 3,
      item: 'Bus Fare (Local)',
      emoji: '🚌',
      actualPrice: 15,
      hint: 'One way city bus ticket',
      category: 'Transportation'
    },
    {
      id: 4,
      item: 'Lunch (Restaurant)',
      emoji: '🍽️',
      actualPrice: 300,
      hint: 'Meal at a mid-range restaurant',
      category: 'Food & Drink'
    },
    {
      id: 5,
      item: 'Newspaper',
      emoji: '📰',
      actualPrice: 5,
      hint: 'Daily local newspaper',
      category: 'Reading'
    },
    {
      id: 6,
      item: 'Ice Cream',
      emoji: '🍦',
      actualPrice: 80,
      hint: 'Single scoop from ice cream parlor',
      category: 'Food & Drink'
    },
    {
      id: 7,
      item: 'Auto Rickshaw (5km)',
      emoji: '🛺',
      actualPrice: 120,
      hint: '5 kilometer ride in the city',
      category: 'Transportation'
    },
    {
      id: 8,
      item: 'Bottled Water',
      emoji: '💧',
      actualPrice: 20,
      hint: '1 liter branded water bottle',
      category: 'Food & Drink'
    },
    {
      id: 9,
      item: 'Gym Session',
      emoji: '💪',
      actualPrice: 200,
      hint: 'Single day gym entry',
      category: 'Health & Fitness'
    },
    {
      id: 10,
      item: 'Parking Fee',
      emoji: '🅿️',
      actualPrice: 50,
      hint: '2 hours parking in city center',
      category: 'Transportation'
    }
  ];

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

  const calculateScore = (guess, actual) => {
    const difference = Math.abs(guess - actual);
    const percentage = (difference / actual) * 100;
    
    if (percentage <= 10) return 100; // Excellent
    if (percentage <= 20) return 80;  // Very Good
    if (percentage <= 30) return 60;  // Good
    if (percentage <= 50) return 40;  // Fair
    return 20; // Poor
  };

  const getAccuracyMessage = (guess, actual) => {
    const difference = Math.abs(guess - actual);
    const percentage = (difference / actual) * 100;
    
    if (percentage <= 10) return 'Excellent! 🎉';
    if (percentage <= 20) return 'Very Good! 👏';
    if (percentage <= 30) return 'Good! 👍';
    if (percentage <= 50) return 'Fair 🤔';
    return 'Keep trying! 💪';
  };

  const submitGuess = () => {
    if (!userGuess || userGuess.trim() === '') {
      Alert.alert('Please enter your guess!');
      return;
    }

    const guess = parseFloat(userGuess);
    const actual = expenseQuestions[currentQuestion].actualPrice;
    const points = calculateScore(guess, actual);
    
    setScore(score + points);
    setShowResult(true);
    
    if (points >= 60) {
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) {
        setBestStreak(streak + 1);
      }
    } else {
      setStreak(0);
    }
    
    animateScore();
  };

  const nextQuestion = () => {
    if (currentQuestion < expenseQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserGuess('');
      setShowResult(false);
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setUserGuess('');
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setStreak(0);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getScoreColor = (points) => {
    if (points >= 80) return '#4CAF50';
    if (points >= 60) return '#FF9800';
    return '#F44336';
  };

  if (gameOver) {
    const finalPercentage = (score / (expenseQuestions.length * 100)) * 100;
    
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Game Complete! 🎉</Text>
          
          <View style={styles.scoreCard}>
            <Text style={styles.finalScoreText}>Final Score</Text>
            <Text style={styles.finalScore}>{score}/{expenseQuestions.length * 100}</Text>
            <Text style={styles.percentage}>{finalPercentage.toFixed(1)}%</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{expenseQuestions.length}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
          </View>

          <Text style={styles.performanceText}>
            {finalPercentage >= 80 ? '🏆 Financial Expert!' :
             finalPercentage >= 60 ? '💰 Money Smart!' :
             finalPercentage >= 40 ? '📊 Keep Learning!' :
             '💡 Practice More!'}
          </Text>

          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  const question = expenseQuestions[currentQuestion];
  
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>💰 Expense Guesser</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${((currentQuestion + 1) / expenseQuestions.length) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1} of {expenseQuestions.length}
            </Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Animated.View style={[styles.scoreBox, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </Animated.View>
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>{streak} 🔥</Text>
          </View>
        </View>

        <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
          
          <Text style={styles.emoji}>{question.emoji}</Text>
          <Text style={styles.itemName}>{question.item}</Text>
          <Text style={styles.hint}>💡 {question.hint}</Text>
          
          {!showResult ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your guess (₹)</Text>
              <TextInput
                style={styles.input}
                value={userGuess}
                onChangeText={setUserGuess}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.submitButton} onPress={submitGuess}>
                <Text style={styles.submitButtonText}>Submit Guess</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Result</Text>
              <Text style={styles.actualPrice}>Actual Price: ₹{question.actualPrice}</Text>
              <Text style={styles.yourGuess}>Your Guess: ₹{userGuess}</Text>
              
              <View style={styles.pointsContainer}>
                <Text style={[
                  styles.pointsText,
                  { color: getScoreColor(calculateScore(parseFloat(userGuess), question.actualPrice)) }
                ]}>
                  +{calculateScore(parseFloat(userGuess), question.actualPrice)} points
                </Text>
                <Text style={styles.accuracyText}>
                  {getAccuracyMessage(parseFloat(userGuess), question.actualPrice)}
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 0.45,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  streakBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 0.45,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  hint: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actualPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  yourGuess: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accuracyText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  finalScoreText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  percentage: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  statItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 0.4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  performanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 10,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExpenseGuessGame;