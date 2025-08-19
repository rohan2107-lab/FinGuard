import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const BudgetPlannerGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [allocations, setAllocations] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [perfectLevels, setPerfectLevels] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  // Realistic budget scenarios with random events
  const puzzleLevels = [
    {
      id: 1,
      title: "College Student - Final Semester",
      totalBudget: 15000,
      timeLimit: 60,
      categories: [
        { name: "Food & Groceries", emoji: "🍽️", min: 4000, max: 6000, optimal: 5000, priority: "high" },
        { name: "Textbooks & Study", emoji: "📚", min: 2000, max: 4000, optimal: 3000, priority: "high" },
        { name: "Transportation", emoji: "🚌", min: 1200, max: 2500, optimal: 1800, priority: "medium" },
        { name: "Entertainment", emoji: "🎬", min: 800, max: 2000, optimal: 1500, priority: "low" },
        { name: "Emergency Fund", emoji: "💰", min: 1500, max: 3000, optimal: 2200, priority: "medium" },
        { name: "Phone & Internet", emoji: "📱", min: 800, max: 1500, optimal: 1000, priority: "medium" },
        { name: "Clothing", emoji: "👕", min: 500, max: 1200, optimal: 700, priority: "low" }
      ],
      events: [
        { type: "expense", description: "Laptop repair needed", impact: 2000, category: "Emergency Fund" },
        { type: "income", description: "Part-time job bonus", impact: 1500, category: null },
        { type: "discount", description: "Student discount on books", impact: -500, category: "Textbooks & Study" }
      ],
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Young Professional - First Job",
      totalBudget: 45000,
      timeLimit: 75,
      categories: [
        { name: "Rent & Utilities", emoji: "🏠", min: 15000, max: 20000, optimal: 18000, priority: "high" },
        { name: "Groceries & Dining", emoji: "🛒", min: 8000, max: 12000, optimal: 10000, priority: "high" },
        { name: "Transportation", emoji: "🚗", min: 4000, max: 7000, optimal: 5500, priority: "medium" },
        { name: "Health Insurance", emoji: "⚕️", min: 3000, max: 5000, optimal: 4000, priority: "high" },
        { name: "Savings & Investment", emoji: "📈", min: 6000, max: 10000, optimal: 8000, priority: "medium" },
        { name: "Entertainment & Social", emoji: "🎉", min: 2000, max: 5000, optimal: 3500, priority: "low" },
        { name: "Professional Development", emoji: "🎓", min: 1000, max: 3000, optimal: 2000, priority: "medium" }
      ],
      events: [
        { type: "expense", description: "Medical emergency", impact: 3000, category: "Health Insurance" },
        { type: "income", description: "Freelance project", impact: 2500, category: null },
        { type: "expense", description: "Car maintenance", impact: 1500, category: "Transportation" }
      ],
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Growing Family - New Baby",
      totalBudget: 65000,
      timeLimit: 90,
      categories: [
        { name: "Housing & Utilities", emoji: "🏡", min: 20000, max: 28000, optimal: 24000, priority: "high" },
        { name: "Groceries & Baby Food", emoji: "🍼", min: 12000, max: 16000, optimal: 14000, priority: "high" },
        { name: "Childcare & Education", emoji: "👶", min: 8000, max: 15000, optimal: 12000, priority: "high" },
        { name: "Healthcare & Insurance", emoji: "🏥", min: 6000, max: 10000, optimal: 8000, priority: "high" },
        { name: "Transportation", emoji: "🚙", min: 5000, max: 8000, optimal: 6500, priority: "medium" },
        { name: "Savings & Emergency", emoji: "🆘", min: 4000, max: 8000, optimal: 6000, priority: "medium" },
        { name: "Family Entertainment", emoji: "👨‍👩‍👧", min: 2000, max: 4000, optimal: 3000, priority: "low" }
      ],
      events: [
        { type: "expense", description: "Baby's hospital bills", impact: 4000, category: "Healthcare & Insurance" },
        { type: "expense", description: "Bigger car needed", impact: 3000, category: "Transportation" },
        { type: "income", description: "Government child benefit", impact: 2000, category: null }
      ],
      difficulty: "Advanced"
    },
    {
      id: 4,
      title: "Mid-Career Crisis - Job Change",
      totalBudget: 55000,
      timeLimit: 75,
      categories: [
        { name: "Housing & Mortgage", emoji: "🏠", min: 18000, max: 25000, optimal: 22000, priority: "high" },
        { name: "Living Expenses", emoji: "🛒", min: 10000, max: 15000, optimal: 12500, priority: "high" },
        { name: "Job Search & Training", emoji: "💼", min: 3000, max: 8000, optimal: 5500, priority: "high" },
        { name: "Emergency Buffer", emoji: "🆘", min: 8000, max: 15000, optimal: 12000, priority: "high" },
        { name: "Insurance & Healthcare", emoji: "⚕️", min: 4000, max: 7000, optimal: 5500, priority: "medium" },
        { name: "Debt Payments", emoji: "💳", min: 2000, max: 5000, optimal: 3500, priority: "medium" },
        { name: "Family Support", emoji: "👥", min: 1000, max: 3000, optimal: 2000, priority: "low" }
      ],
      events: [
        { type: "expense", description: "Certification course fees", impact: 2500, category: "Job Search & Training" },
        { type: "expense", description: "Extended job search", impact: 3000, category: "Emergency Buffer" },
        { type: "income", description: "Severance package", impact: 4000, category: null }
      ],
      difficulty: "Expert"
    },
    {
      id: 5,
      title: "Pre-Retirement Planning",
      totalBudget: 75000,
      timeLimit: 90,
      categories: [
        { name: "Housing & Maintenance", emoji: "🏡", min: 20000, max: 30000, optimal: 25000, priority: "high" },
        { name: "Healthcare & Medicine", emoji: "💊", min: 12000, max: 18000, optimal: 15000, priority: "high" },
        { name: "Living Expenses", emoji: "🛒", min: 15000, max: 20000, optimal: 17500, priority: "high" },
        { name: "Retirement Savings", emoji: "🏦", min: 10000, max: 20000, optimal: 15000, priority: "high" },
        { name: "Insurance Premiums", emoji: "🛡️", min: 4000, max: 8000, optimal: 6000, priority: "medium" },
        { name: "Travel & Hobbies", emoji: "✈️", min: 2000, max: 6000, optimal: 4000, priority: "low" },
        { name: "Family Support", emoji: "👴", min: 1000, max: 4000, optimal: 2500, priority: "medium" }
      ],
      events: [
        { type: "expense", description: "Major health checkup", impact: 3500, category: "Healthcare & Medicine" },
        { type: "income", description: "Investment dividends", impact: 3000, category: null },
        { type: "expense", description: "Home repairs", impact: 4000, category: "Housing & Maintenance" }
      ],
      difficulty: "Master"
    }
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !levelComplete && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, levelComplete, gameOver]);

  // Initialize level
  useEffect(() => {
    if (puzzleLevels[currentLevel]) {
      initializeLevel();
    }
  }, [currentLevel]);

  // Calculate total when allocations change
  useEffect(() => {
    calculateTotal();
  }, [allocations]);

  // Animations
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [currentLevel]);

  const initializeLevel = () => {
    const level = puzzleLevels[currentLevel];
    const initialAllocations = {};
    level.categories.forEach(category => {
      initialAllocations[category.name] = '';
    });
    setAllocations(initialAllocations);
    setTotalAllocated(0);
    setLevelComplete(false);
    setTimeLeft(level.timeLimit);
    setCurrentEvent(null);
    setLevelScore(0);
    setFeedback({ type: '', message: '' });
    setShowFeedback(false);
    
    // 40% chance of random event
    if (Math.random() < 0.4) {
      const randomEvent = level.events[Math.floor(Math.random() * level.events.length)];
      setCurrentEvent(randomEvent);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(allocations).forEach(value => {
      const numValue = parseFloat(value) || 0;
      total += numValue;
    });
    setTotalAllocated(total);
  };

  const startGame = () => {
    setGameStarted(true);
    setTotalScore(0);
    setCurrentLevel(0);
    setGameOver(false);
    setPerfectLevels(0);
    setAchievements([]);
  };

  const handleTimeUp = () => {
    if (!levelComplete) {
      setFeedback({ type: 'error', message: 'Time\'s up! Your budget planning was incomplete.' });
      setShowFeedback(true);
      setLevelScore(Math.max(0, calculateLevelScore() - 5)); // Penalty for timeout
      setTimeout(() => nextLevel(), 2000);
    }
  };

  const animateShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const updateAllocation = (categoryName, value) => {
    setAllocations(prev => ({
      ...prev,
      [categoryName]: value
    }));
  };

  const calculateLevelScore = () => {
    const level = puzzleLevels[currentLevel];
    let score = 0;
    let accuracyBonus = 0;
    let priorityBonus = 0;
    let timeBonus = 0;
    let budgetBonus = 0;

    // Category accuracy scoring (0-15 points)
    level.categories.forEach(category => {
      const allocated = parseFloat(allocations[category.name]) || 0;
      const optimal = category.optimal;
      const range = category.max - category.min;
      const difference = Math.abs(allocated - optimal);
      
      // Accuracy within range
      if (allocated >= category.min && allocated <= category.max) {
        const accuracy = Math.max(0, 100 - (difference / range) * 100) / 100;
        accuracyBonus += accuracy * 2; // Up to 2 points per category
        
        // Priority bonus
        if (category.priority === 'high' && accuracy > 0.8) {
          priorityBonus += 1;
        }
      }
    });

    // Budget balance scoring (0-3 points)
    const budgetDifference = Math.abs(totalAllocated - level.totalBudget);
    if (budgetDifference <= 500) budgetBonus = 3;
    else if (budgetDifference <= 1000) budgetBonus = 2;
    else if (budgetDifference <= 2000) budgetBonus = 1;

    // Time bonus (0-2 points)
    const timeRemaining = timeLeft / level.timeLimit;
    if (timeRemaining > 0.5) timeBonus = 2;
    else if (timeRemaining > 0.25) timeBonus = 1;

    score = Math.min(20, accuracyBonus + priorityBonus + budgetBonus + timeBonus);
    return Math.round(score);
  };

  const getBudgetValidation = () => {
    const level = puzzleLevels[currentLevel];
    const errors = [];
    let warnings = [];
    
    // Check total budget
    const budgetDifference = Math.abs(totalAllocated - level.totalBudget);
    if (budgetDifference > 2000) {
      errors.push(`Budget is off by ₹${budgetDifference.toLocaleString()}`);
    } else if (budgetDifference > 500) {
      warnings.push(`Budget difference: ₹${budgetDifference.toLocaleString()}`);
    }

    // Check category constraints
    level.categories.forEach(category => {
      const allocated = parseFloat(allocations[category.name]) || 0;
      if (allocated < category.min) {
        errors.push(`${category.name}: Below minimum (₹${category.min.toLocaleString()})`);
      }
      if (allocated > category.max) {
        errors.push(`${category.name}: Above maximum (₹${category.max.toLocaleString()})`);
      }
      
      // Priority warnings
      if (category.priority === 'high' && allocated < category.optimal * 0.8) {
        warnings.push(`${category.name} might be underfunded (high priority)`);
      }
    });

    return { errors, warnings };
  };

  const submitBudget = () => {
    const { errors, warnings } = getBudgetValidation();
    
    if (errors.length > 0) {
      animateShake();
      Alert.alert('Budget Issues', errors.join('\n\n'));
      return;
    }

    const score = calculateLevelScore();
    setLevelScore(score);
    setTotalScore(prev => prev + score);
    setLevelComplete(true);

    // Check for achievements
    if (score >= 18) {
      setPerfectLevels(prev => prev + 1);
      if (!achievements.includes('perfectionist')) {
        setAchievements(prev => [...prev, 'perfectionist']);
      }
    }

    if (timeLeft > puzzleLevels[currentLevel].timeLimit * 0.7 && score >= 15) {
      if (!achievements.includes('speedster')) {
        setAchievements(prev => [...prev, 'speedster']);
      }
    }

    // Feedback based on performance
    if (score >= 18) {
      setFeedback({ type: 'excellent', message: 'Outstanding budget planning! You\'re a financial wizard! 🎉' });
    } else if (score >= 15) {
      setFeedback({ type: 'good', message: 'Great job! Your budget is well-balanced. 👍' });
    } else if (score >= 10) {
      setFeedback({ type: 'okay', message: 'Not bad, but there\'s room for improvement. 🤔' });
    } else {
      setFeedback({ type: 'poor', message: 'Your budget needs work. Review the priorities! 📚' });
    }
    setShowFeedback(true);
  };

  const nextLevel = () => {
    if (currentLevel < puzzleLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
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
    setTotalScore(0);
    setGameOver(false);
    setGameStarted(false);
    setPerfectLevels(0);
    setAchievements([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBudgetStatus = () => {
    const level = puzzleLevels[currentLevel];
    const remaining = level.totalBudget - totalAllocated;
    
    if (Math.abs(remaining) <= 500) return { text: 'Perfect Balance! ✨', color: '#10B981' };
    if (remaining > 500) return { text: `₹${remaining.toLocaleString()} under budget`, color: '#3B82F6' };
    return { text: `₹${Math.abs(remaining).toLocaleString()} over budget`, color: '#EF4444' };
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': '#10B981',
      'Intermediate': '#F59E0B',
      'Advanced': '#EF4444',
      'Expert': '#8B5CF6',
      'Master': '#EC4899'
    };
    return colors[difficulty] || '#6B7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#EF4444',
      'medium': '#F59E0B',
      'low': '#10B981'
    };
    return colors[priority] || '#6B7280';
  };

  // Game start screen
  if (!gameStarted) {
    return (
      <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameStartContainer}>
          <Text style={styles.gameStartEmoji}>🎯</Text>
          <Text style={styles.gameStartTitle}>Budget Master Challenge</Text>
          <Text style={styles.gameStartDescription}>
            Test your financial planning skills across 5 realistic life scenarios. 
            Score up to 100 points based on accuracy, speed, and smart decisions!
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Game Features:</Text>
            <Text style={styles.featureItem}>• Time pressure challenges</Text>
            <Text style={styles.featureItem}>• Random financial events</Text>
            <Text style={styles.featureItem}>• Priority-based scoring</Text>
            <Text style={styles.featureItem}>• Achievement system</Text>
            <Text style={styles.featureItem}>• Realistic budget constraints</Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Challenge 🚀</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  // Game over screen
  if (gameOver) {
    const finalGrade = totalScore >= 90 ? 'A+' : totalScore >= 80 ? 'A' : totalScore >= 70 ? 'B+' : totalScore >= 60 ? 'B' : totalScore >= 50 ? 'C' : 'D';
    const performance = totalScore >= 90 ? '🏆 Financial Genius!' : totalScore >= 80 ? '💎 Budget Expert!' : totalScore >= 70 ? '🎯 Skilled Planner!' : totalScore >= 60 ? '📊 Good Effort!' : '💡 Keep Learning!';
    
    return (
      <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>🎉</Text>
          <Text style={styles.gameOverTitle}>Challenge Complete!</Text>
          
          <View style={styles.finalScoreCard}>
            <Text style={styles.finalScoreNumber}>{totalScore}/100</Text>
            <Text style={styles.finalGrade}>Grade: {finalGrade}</Text>
            <Text style={styles.performanceText}>{performance}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{perfectLevels}</Text>
              <Text style={styles.statLabel}>Perfect Scores</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>

          {achievements.length > 0 && (
            <View style={styles.achievementsContainer}>
              <Text style={styles.achievementsTitle}>🏆 Achievements Unlocked:</Text>
              {achievements.includes('perfectionist') && <Text style={styles.achievementItem}>🎯 Perfectionist - Perfect score achieved!</Text>}
              {achievements.includes('speedster') && <Text style={styles.achievementItem}>⚡ Speed Demon - Fast & accurate!</Text>}
            </View>
          )}

          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Play Again 🔄</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budget Master Challenge</Text>
          <View style={styles.headerStats}>
            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, { color: timeLeft <= 10 ? '#EF4444' : '#fff' }]}>
                ⏰ {formatTime(timeLeft)}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>🎯 {totalScore}/100</Text>
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Level {currentLevel + 1} of {puzzleLevels.length}</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentLevel + (levelComplete ? 1 : 0)) / puzzleLevels.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.levelScoreText}>Current Level: {levelScore}/20</Text>
          </View>
        </View>

        {/* Level Card */}
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

          <View style={styles.budgetInfoCard}>
            <Text style={styles.totalBudgetText}>
              Budget: ₹{level.totalBudget.toLocaleString()}
            </Text>
            <Text style={[styles.budgetStatusText, { color: budgetStatus.color }]}>
              {budgetStatus.text}
            </Text>
          </View>

          {/* Random Event */}
          {currentEvent && (
            <View style={styles.eventContainer}>
              <Text style={styles.eventTitle}>⚠️ Random Event!</Text>
              <Text style={styles.eventDescription}>{currentEvent.description}</Text>
              <Text style={styles.eventImpact}>
                Impact: {currentEvent.type === 'income' ? '+' : ''}₹{currentEvent.impact.toLocaleString()}
                {currentEvent.category && ` (affects ${currentEvent.category})`}
              </Text>
            </View>
          )}

          {!levelComplete ? (
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Allocate Your Budget:</Text>
              {level.categories.map((category, index) => (
                <View key={category.name} style={styles.categoryContainer}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleRow}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(category.priority) }]}>
                      <Text style={styles.priorityText}>
                        {category.priority === 'high' ? 'HIGH' : category.priority === 'medium' ? 'MED' : 'LOW'}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.categoryRange}>
                    Range: ₹{category.min.toLocaleString()} - ₹{category.max.toLocaleString()}
                  </Text>
                  
                  <TextInput
                    style={styles.categoryInput}
                    value={allocations[category.name] || ''}
                    onChangeText={(value) => updateAllocation(category.name, value)}
                    placeholder="Enter amount"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
              ))}
              
              <TouchableOpacity 
                style={[styles.submitButton, { opacity: timeLeft === 0 ? 0.5 : 1 }]} 
                onPress={submitBudget}
                disabled={timeLeft === 0}
              >
                <Text style={styles.submitButtonText}>Submit Budget Plan 🎯</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultEmoji}>
                {levelScore >= 18 ? '🏆' : levelScore >= 15 ? '🎉' : levelScore >= 10 ? '👍' : '📚'}
              </Text>
              
              <View style={styles.levelCompleteCard}>
                <Text style={styles.levelCompleteTitle}>Level Complete!</Text>
                <Text style={styles.levelScoreDisplay}>{levelScore}/20 Points</Text>
                <Text style={styles.totalScoreDisplay}>Total Score: {totalScore}/100</Text>
              </View>

              {/* Performance Breakdown */}
              <View style={styles.performanceContainer}>
                <Text style={styles.performanceTitle}>📊 Performance Breakdown:</Text>
                {level.categories.map(category => {
                  const allocated = parseFloat(allocations[category.name]) || 0;
                  const optimal = category.optimal;
                  const difference = Math.abs(allocated - optimal);
                  const accuracy = Math.max(0, 100 - ((difference / optimal) * 100));
                  
                  return (
                    <View key={category.name} style={styles.performanceItem}>
                      <Text style={styles.performanceCategory}>
                        {category.emoji} {category.name}
                      </Text>
                      <View style={styles.accuracyContainer}>
                        <View style={[
                          styles.accuracyBar,
                          { 
                            backgroundColor: accuracy >= 90 ? '#10B981' :
                            accuracy >= 70 ? '#F59E0B' :
                            accuracy >= 50 ? '#F97316' : '#EF4444',
                            width: `${accuracy}%`
                          }
                        ]} />
                        <Text style={styles.accuracyText}>{Math.round(accuracy)}%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Optimal vs Actual */}
              <View style={styles.optimalContainer}>
                <Text style={styles.optimalTitle}>💡 Optimal Allocations:</Text>
                <View style={styles.optimalGrid}>
                  {level.categories.map(category => (
                    <View key={category.name} style={styles.optimalItem}>
                      <Text style={styles.optimalCategoryText}>
                        {category.emoji} {category.name}
                      </Text>
                      <Text style={styles.optimalAmountText}>
                        ₹{category.optimal.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={nextLevel}>
                <Text style={styles.nextButtonText}>
                  {currentLevel === puzzleLevels.length - 1 ? '🏁 Finish Challenge' : '➡️ Next Level'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Progress Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📈 Game Progress</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryEmoji}>💰</Text>
              <Text style={styles.summaryValue}>{totalScore}</Text>
              <Text style={styles.summaryLabel}>Total Score</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryEmoji}>🏆</Text>
              <Text style={styles.summaryValue}>{perfectLevels}</Text>
              <Text style={styles.summaryLabel}>Perfect Scores</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryEmoji}>⚡</Text>
              <Text style={styles.summaryValue}>{achievements.length}</Text>
              <Text style={styles.summaryLabel}>Achievements</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryEmoji}>🎯</Text>
              <Text style={styles.summaryValue}>{currentLevel + 1}/{puzzleLevels.length}</Text>
              <Text style={styles.summaryLabel}>Levels</Text>
            </View>
          </View>
          
          {achievements.length > 0 && (
            <View style={styles.achievementsSummary}>
              <Text style={styles.achievementsSummaryTitle}>🏆 Achievements:</Text>
              <View style={styles.achievementsBadges}>
                {achievements.includes('perfectionist') && (
                  <View style={styles.achievementBadge}>
                    <Text style={styles.achievementBadgeText}>🎯 Perfectionist</Text>
                  </View>
                )}
                {achievements.includes('speedster') && (
                  <View style={styles.achievementBadge}>
                    <Text style={styles.achievementBadgeText}>⚡ Speed Demon</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {feedback.type === 'excellent' ? '🎉 Excellent!' :
               feedback.type === 'good' ? '👍 Great Job!' :
               feedback.type === 'okay' ? '🤔 Not Bad!' :
               '📚 Keep Learning!'}
            </Text>
            <Text style={styles.modalText}>{feedback.message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowFeedback(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  
  // Game Start Screen
  gameStartContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameStartEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  gameStartTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  gameStartDescription: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.9,
    lineHeight: 24,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    opacity: 0.9,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 15,
    width: '100%',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Game Over Screen
  gameOverContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
  },
  finalScoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  finalScoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  finalGrade: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  performanceText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 0.45,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    width: '100%',
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  achievementItem: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    opacity: 0.9,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 15,
    width: '100%',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timerContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSection: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  levelScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Level Card
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  totalBudgetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  budgetStatusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventContainer: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
  },
  eventImpact: {
    fontSize: 12,
    color: '#6c757d',
  },

  // Categories
  categoriesSection: {
    marginTop: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryRange: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  categoryInput: {
    height: 45,
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
    borderRadius: 12,
    marginTop: 15,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Results
  resultContainer: {
    alignItems: 'center',
    padding: 15,
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  levelCompleteCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  levelCompleteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  levelScoreDisplay: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  totalScoreDisplay: {
    fontSize: 16,
    color: '#666',
  },
  performanceContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    width: '100%',
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceCategory: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  accuracyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyBar: {
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    width: 50,
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    width: 35,
  },
  optimalContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  optimalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  optimalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optimalItem: {
    width: '48%',
    marginBottom: 8,
  },
  optimalCategoryText: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 2,
  },
  optimalAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementsSummary: {
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  achievementsSummaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f57f17',
    marginBottom: 10,
  },
  achievementsBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementBadge: {
    backgroundColor: '#ffecb3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  achievementBadgeText: {
    fontSize: 12,
    color: '#f57f17',
    fontWeight: '600',
  },

  // Modal
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
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetPlannerGame;