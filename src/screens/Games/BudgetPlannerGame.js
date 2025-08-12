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
  Modal,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const BudgetPlannerGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [allocations, setAllocations] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  // Budget puzzle levels
  const puzzleLevels = [
    {
      id: 1,
      title: "Student Budget",
      totalBudget: 10000,
      categories: [
        { name: "Food", emoji: "🍽️", min: 3000, max: 4500, optimal: 3500 },
        { name: "Books", emoji: "📚", min: 1500, max: 2500, optimal: 2000 },
        { name: "Transport", emoji: "🚌", min: 1000, max: 2000, optimal: 1500 },
        { name: "Entertainment", emoji: "🎬", min: 500, max: 1500, optimal: 1000 },
        { name: "Savings", emoji: "💰", min: 1500, max: 3000, optimal: 2000 }
      ],
      difficulty: "Easy",
      hint: "Students should prioritize food and studies while maintaining some entertainment and savings."
    },
    {
      id: 2,
      title: "Family Monthly Budget",
      totalBudget: 50000,
      categories: [
        { name: "Groceries", emoji: "🛒", min: 12000, max: 18000, optimal: 15000 },
        { name: "Rent", emoji: "🏠", min: 15000, max: 20000, optimal: 18000 },
        { name: "Utilities", emoji: "💡", min: 3000, max: 5000, optimal: 4000 },
        { name: "Healthcare", emoji: "⚕️", min: 2000, max: 4000, optimal: 3000 },
        { name: "Children Education", emoji: "🎓", min: 4000, max: 6000, optimal: 5000 },
        { name: "Emergency Fund", emoji: "🆘", min: 3000, max: 7000, optimal: 5000 }
      ],
      difficulty: "Medium",
      hint: "Family budgets need to balance essentials like rent and groceries with future planning."
    },
    {
      id: 3,
      title: "Young Professional",
      totalBudget: 75000,
      categories: [
        { name: "Rent", emoji: "🏠", min: 20000, max: 30000, optimal: 25000 },
        { name: "Food", emoji: "🍽️", min: 8000, max: 15000, optimal: 12000 },
        { name: "Transportation", emoji: "🚗", min: 5000, max: 10000, optimal: 7500 },
        { name: "Investments", emoji: "📈", min: 10000, max: 20000, optimal: 15000 },
        { name: "Lifestyle", emoji: "🎉", min: 5000, max: 12000, optimal: 8000 },
        { name: "Insurance", emoji: "🛡️", min: 3000, max: 6000, optimal: 4500 },
        { name: "Emergency Fund", emoji: "🆘", min: 5000, max: 10000, optimal: 7500 }
      ],
      difficulty: "Hard",
      hint: "Young professionals should focus on building wealth through investments while enjoying life."
    },
    {
      id: 4,
      title: "Retirement Planning",
      totalBudget: 40000,
      categories: [
        { name: "Healthcare", emoji: "⚕️", min: 8000, max: 15000, optimal: 12000 },
        { name: "Basic Living", emoji: "🏠", min: 12000, max: 18000, optimal: 15000 },
        { name: "Medications", emoji: "💊", min: 3000, max: 6000, optimal: 4000 },
        { name: "Recreation", emoji: "🎨", min: 2000, max: 5000, optimal: 3000 },
        { name: "Family Support", emoji: "👨‍👩‍👧‍👦", min: 3000, max: 8000, optimal: 6000 }
      ],
      difficulty: "Medium",
      hint: "Retirees need to prioritize healthcare while maintaining quality of life on fixed income."
    },
    {
      id: 5,
      title: "Entrepreneur Startup",
      totalBudget: 200000,
      categories: [
        { name: "Product Development", emoji: "⚙️", min: 50000, max: 80000, optimal: 65000 },
        { name: "Marketing", emoji: "📢", min: 30000, max: 50000, optimal: 40000 },
        { name: "Office Expenses", emoji: "🏢", min: 20000, max: 35000, optimal: 25000 },
        { name: "Team Salaries", emoji: "👥", min: 40000, max: 70000, optimal: 55000 },
        { name: "Emergency Buffer", emoji: "🆘", min: 10000, max: 25000, optimal: 15000 }
      ],
      difficulty: "Expert",
      hint: "Startups must balance innovation with sustainability, keeping enough buffer for uncertainties."
    }
  ];

  useEffect(() => {
    if (puzzleLevels[currentLevel]) {
      initializeLevel();
    }
  }, [currentLevel]);

  useEffect(() => {
    calculateTotal();
  }, [allocations]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeLevel = () => {
    const initialAllocations = {};
    puzzleLevels[currentLevel].categories.forEach(category => {
      initialAllocations[category.name] = '';
    });
    setAllocations(initialAllocations);
    setTotalAllocated(0);
    setLevelComplete(false);
    setShowHint(false);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(allocations).forEach(value => {
      const numValue = parseFloat(value) || 0;
      total += numValue;
    });
    setTotalAllocated(total);
  };

  const animateShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const animatePulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const updateAllocation = (categoryName, value) => {
    setAllocations(prev => ({
      ...prev,
      [categoryName]: value
    }));
  };

  const checkBudgetConstraints = () => {
    const level = puzzleLevels[currentLevel];
    const errors = [];
    
    // Check if total matches budget
    if (Math.abs(totalAllocated - level.totalBudget) > 100) {
      errors.push(`Total must be close to ₹${level.totalBudget.toLocaleString()}`);
    }

    // Check category constraints
    level.categories.forEach(category => {
      const allocated = parseFloat(allocations[category.name]) || 0;
      if (allocated < category.min) {
        errors.push(`${category.name}: Minimum ₹${category.min.toLocaleString()}`);
      }
      if (allocated > category.max) {
        errors.push(`${category.name}: Maximum ₹${category.max.toLocaleString()}`);
      }
    });

    return errors;
  };

  const calculateLevelScore = () => {
    const level = puzzleLevels[currentLevel];
    let totalScore = 0;
    let maxPossibleScore = level.categories.length * 100;

    level.categories.forEach(category => {
      const allocated = parseFloat(allocations[category.name]) || 0;
      const optimal = category.optimal;
      const difference = Math.abs(allocated - optimal);
      const range = category.max - category.min;
      const accuracy = Math.max(0, 100 - (difference / range) * 100);
      totalScore += accuracy;
    });

    // Budget accuracy bonus
    const budgetDifference = Math.abs(totalAllocated - level.totalBudget);
    const budgetAccuracy = Math.max(0, 100 - (budgetDifference / level.totalBudget) * 100);
    totalScore += budgetAccuracy;
    maxPossibleScore += 100;

    return Math.round((totalScore / maxPossibleScore) * 1000);
  };

  const submitBudget = () => {
    const errors = checkBudgetConstraints();
    
    if (errors.length > 0) {
      animateShake();
      Alert.alert('Budget Issues', errors.join('\n'));
      return;
    }

    const levelScore = calculateLevelScore();
    setScore(score + levelScore);
    
    if (levelScore >= 700) {
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    if (score + levelScore > bestScore) {
      setBestScore(score + levelScore);
    }

    setLevelComplete(true);
    animatePulse();
  };

  const nextLevel = () => {
    if (currentLevel < puzzleLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      
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
    setCurrentLevel(0);
    setScore(0);
    setGameOver(false);
    setStreak(0);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const getBudgetStatus = () => {
    const level = puzzleLevels[currentLevel];
    const remaining = level.totalBudget - totalAllocated;
    
    if (remaining > 100) return { text: `₹${remaining.toLocaleString()} remaining`, color: '#4CAF50' };
    if (remaining >= -100) return { text: 'Perfect!', color: '#2196F3' };
    return { text: `₹${Math.abs(remaining).toLocaleString()} over budget`, color: '#F44336' };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      case 'Expert': return '#9C27B0';
      default: return '#2196F3';
    }
  };

  if (gameOver) {
    return (
      <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>🎉 Budget Master!</Text>
          
          <View style={styles.scoreCard}>
            <Text style={styles.finalScoreText}>Final Score</Text>
            <Text style={styles.finalScore}>{score.toLocaleString()}</Text>
            <Text style={styles.levelText}>Completed {puzzleLevels.length} levels</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Final Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{bestScore.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
          </View>

          <Text style={styles.performanceText}>
            {score >= 4000 ? '🏆 Financial Genius!' :
             score >= 3000 ? '💰 Budget Expert!' :
             score >= 2000 ? '📊 Good Planner!' :
             '💡 Keep Practicing!'}
          </Text>

          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  const level = puzzleLevels[currentLevel];
  const budgetStatus = getBudgetStatus();

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🧩 Budget Planner Puzzle</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${((currentLevel + 1) / puzzleLevels.length) * 100}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>
              Level {currentLevel + 1} of {puzzleLevels.length}
            </Text>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Animated.View style={[styles.scoreBox, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </Animated.View>
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>Streak</Text>
            <Text style={styles.streakValue}>{streak} 🔥</Text>
          </View>
        </View>

        <Animated.View style={[
          styles.levelCard,
          { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] }
        ]}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(level.difficulty) }]}>
              <Text style={styles.difficultyText}>{level.difficulty}</Text>
            </View>
          </View>

          <View style={styles.budgetInfo}>
            <Text style={styles.totalBudgetText}>
              Total Budget: ₹{level.totalBudget.toLocaleString()}
            </Text>
            <Text style={[styles.budgetStatus, { color: budgetStatus.color }]}>
              {budgetStatus.text}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.hintButton} 
            onPress={() => setShowHint(!showHint)}
          >
            <Text style={styles.hintButtonText}>
              {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
            </Text>
          </TouchableOpacity>

          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{level.hint}</Text>
            </View>
          )}

          {!levelComplete ? (
            <View style={styles.categoriesContainer}>
              {level.categories.map((category, index) => (
                <View key={category.name} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  
                  <Text style={styles.categoryRange}>
                    ₹{category.min.toLocaleString()} - ₹{category.max.toLocaleString()}
                  </Text>
                  
                  <TextInput
                    style={styles.categoryInput}
                    value={allocations[category.name]}
                    onChangeText={(value) => updateAllocation(category.name, value)}
                    placeholder="Enter amount"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              ))}
              
              <TouchableOpacity style={styles.submitButton} onPress={submitBudget}>
                <Text style={styles.submitButtonText}>Check Budget Plan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Level Complete! 🎉</Text>
              <Text style={styles.levelScore}>
                Score: {calculateLevelScore().toLocaleString()} points
              </Text>
              
              <View style={styles.optimalsContainer}>
                <Text style={styles.optimalsTitle}>Optimal Allocations:</Text>
                {level.categories.map(category => (
                  <Text key={category.name} style={styles.optimalItem}>
                    {category.emoji} {category.name}: ₹{category.optimal.toLocaleString()}
                  </Text>
                ))}
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
                <Text style={styles.nextButtonText}>
                  {currentLevel === puzzleLevels.length - 1 ? 'Finish Game' : 'Next Level'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showHint}
          onRequestClose={() => setShowHint(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>💡 Budget Tip</Text>
              <Text style={styles.modalText}>{level.hint}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowHint(false)}
              >
                <Text style={styles.modalCloseText}>Got it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    padding: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
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
    fontSize: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetInfo: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  totalBudgetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  budgetStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  hintButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 15,
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  hintText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoryItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryRange: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  categoryInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  levelScore: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  optimalsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optimalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  optimalItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#2196F3',
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
  levelText: {
    fontSize: 16,
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
    fontSize: 24,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    margin: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalCloseButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetPlannerGame;