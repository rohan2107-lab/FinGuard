import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Alert,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const SCENARIOS = [
  {
    id: 1,
    name: "Casual Dinner",
    bill: 1250,
    people: 4,
    tip: 10,
    discount: 0,
    difficulty: "Easy",
    timeLimit: 30,
    description: "Simple dinner split with standard tip"
  },
  {
    id: 2,
    name: "Birthday Party",
    bill: 2800,
    people: 7,
    tip: 15,
    discount: 200,
    difficulty: "Medium",
    timeLimit: 25,
    description: "Birthday celebration with discount and higher tip"
  },
  {
    id: 3,
    name: "Business Lunch",
    bill: 3500,
    people: 6,
    tip: 18,
    discount: 350,
    difficulty: "Hard",
    timeLimit: 20,
    description: "Corporate lunch with service charge and discount"
  },
  {
    id: 4,
    name: "Date Night",
    bill: 1800,
    people: 2,
    tip: 12,
    discount: 0,
    difficulty: "Easy",
    timeLimit: 25,
    description: "Romantic dinner for two"
  },
  {
    id: 5,
    name: "Group Celebration",
    bill: 4200,
    people: 8,
    tip: 20,
    discount: 500,
    difficulty: "Hard",
    timeLimit: 15,
    description: "Large group with premium service charge"
  }
];

export default function RestaurantBillMaster() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0));
  
  const scenario = SCENARIOS[currentScenario];
  
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const calculateCorrectAnswer = (scenario) => {
    const { bill, people, tip, discount } = scenario;
    const discountedBill = bill - discount;
    const tipAmount = (discountedBill * tip) / 100;
    const totalAmount = discountedBill + tipAmount;
    return (totalAmount / people).toFixed(2);
  };

  const calculateScore = (userAns, correctAns, timeUsed, difficulty) => {
    const accuracy = Math.abs(parseFloat(userAns) - parseFloat(correctAns));
    
    let baseScore = 20; // Base score per question
    
    // Accuracy bonus (0-5 points)
    if (accuracy === 0) baseScore += 5;
    else if (accuracy <= 1) baseScore += 4;
    else if (accuracy <= 5) baseScore += 3;
    else if (accuracy <= 10) baseScore += 1;
    else baseScore -= 5;
    
    // Speed bonus (0-3 points)
    const speedRatio = timeLeft / scenario.timeLimit;
    if (speedRatio > 0.7) baseScore += 3;
    else if (speedRatio > 0.5) baseScore += 2;
    else if (speedRatio > 0.3) baseScore += 1;
    
    // Difficulty bonus
    if (difficulty === 'Hard') baseScore += 2;
    else if (difficulty === 'Medium') baseScore += 1;
    
    return Math.max(0, baseScore);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setTimeLeft(SCENARIOS[0].timeLimit);
    setCompletedScenarios([]);
    setStreak(0);
    setTotalTime(0);
    setUserAnswer('');
    setShowHint(false);
  };

  const handleSubmit = () => {
    const correctAnswer = calculateCorrectAnswer(scenario);
    const earnedScore = calculateScore(userAnswer, correctAnswer, totalTime, scenario.difficulty);
    const isCorrect = Math.abs(parseFloat(userAnswer || 0) - parseFloat(correctAnswer)) <= 1;
    
    setScore(prev => prev + earnedScore);
    setStreak(isCorrect ? streak + 1 : 0);
    
    const result = {
      ...scenario,
      userAnswer: userAnswer || '0',
      correctAnswer,
      score: earnedScore,
      isCorrect,
      timeTaken: scenario.timeLimit - timeLeft
    };
    
    setCompletedScenarios(prev => [...prev, result]);
    
    // Animate result
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
    
    // Show result alert
    Alert.alert(
      isCorrect ? "Correct! 🎉" : "Not quite right 😔",
      `Answer: ₹${correctAnswer}\nYou earned ${earnedScore} points!`,
      [{ text: "Continue", onPress: nextScenario }]
    );
  };

  const nextScenario = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setUserAnswer('');
      setTimeLeft(SCENARIOS[currentScenario + 1].timeLimit);
      setShowHint(false);
    } else {
      setGameState('results');
    }
  };

  const getHint = () => {
    const { bill, people, tip, discount } = scenario;
    return `💡 Hint: Bill ₹${bill} - Discount ₹${discount} = ₹${bill - discount}, then add ${tip}% tip, divide by ${people}`;
  };

  const getPerformanceRating = () => {
    if (score >= 90) return { rating: 'Restaurant Manager 👑', color: '#9333ea' };
    if (score >= 80) return { rating: 'Bill Master 🏆', color: '#f59e0b' };
    if (score >= 70) return { rating: 'Splitting Pro ⭐', color: '#3b82f6' };
    if (score >= 60) return { rating: 'Getting Better 📈', color: '#10b981' };
    return { rating: 'Keep Practicing 💪', color: '#6b7280' };
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (gameState === 'menu') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🍽️ Restaurant Bill Master</Text>
          <Text style={styles.subtitle}>
            Master the art of splitting restaurant bills! Complete 5 realistic scenarios to earn up to 100 points.
          </Text>
        </View>
        
        <View style={styles.rulesCard}>
          <Text style={styles.cardTitle}>🎯 Game Rules</Text>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleIcon}>🏆</Text>
            <Text style={styles.ruleText}>Complete 5 restaurant scenarios</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleIcon}>⏰</Text>
            <Text style={styles.ruleText}>Each scenario has a time limit</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleIcon}>🧮</Text>
            <Text style={styles.ruleText}>Calculate: (Bill - Discount + Tip) ÷ People</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleIcon}>⭐</Text>
            <Text style={styles.ruleText}>Earn points for accuracy and speed</Text>
          </View>
        </View>

        <Text style={styles.scenariosTitle}>📋 Scenarios Preview</Text>
        {SCENARIOS.map((scenario, index) => (
          <View key={scenario.id} style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <Text style={styles.scenarioName}>{scenario.name}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(scenario.difficulty) }]}>
                <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.scenarioDescription}>{scenario.description}</Text>
            <View style={styles.scenarioDetails}>
              <Text style={styles.scenarioDetail}>₹{scenario.bill} • {scenario.people} people</Text>
              <Text style={styles.scenarioDetail}>{scenario.timeLimit}s ⏱️</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Challenge 🚀</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (gameState === 'playing') {
    const timeProgress = (timeLeft / scenario.timeLimit) * 100;
    
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.gameHeader}>
          <View style={styles.gameHeaderTop}>
            <Text style={styles.scenarioCounter}>Scenario {currentScenario + 1}/5</Text>
            <View style={styles.statsContainer}>
              <Text style={styles.statText}>🏆 {score}/100</Text>
              <Text style={styles.statText}>⚡ {streak} streak</Text>
            </View>
          </View>
          
          <View style={styles.scenarioInfo}>
            <Text style={styles.scenarioTitle}>{scenario.name}</Text>
            <Text style={styles.scenarioDesc}>{scenario.description}</Text>
          </View>
          
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: timeLeft <= 5 ? '#ef4444' : '#3b82f6' }]}>
              {timeLeft}s
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${timeProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Scenario Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailsGrid}>
            <View style={[styles.detailCard, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.detailLabel}>💰 Total Bill</Text>
              <Text style={[styles.detailValue, { color: '#3b82f6' }]}>₹{scenario.bill}</Text>
            </View>
            
            <View style={[styles.detailCard, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.detailLabel}>👥 People</Text>
              <Text style={[styles.detailValue, { color: '#16a34a' }]}>
                {scenario.people}
              </Text>
            </View>
            
            <View style={[styles.detailCard, { backgroundColor: '#faf5ff' }]}>
              <Text style={styles.detailLabel}>⭐ Tip %</Text>
              <Text style={[styles.detailValue, { color: '#9333ea' }]}>
                {scenario.tip}%
              </Text>
            </View>
            
            <View style={[styles.detailCard, { backgroundColor: '#fef2f2' }]}>
              <Text style={styles.detailLabel}>🎁 Discount</Text>
              <Text style={[styles.detailValue, { color: '#dc2626' }]}>
                ₹{scenario.discount}
              </Text>
            </View>
          </View>

          <Text style={styles.questionText}>
            How much should each person pay? (₹)
          </Text>
          
          <TextInput
            style={styles.answerInput}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Enter amount per person"
            keyboardType="numeric"
            autoFocus
          />

          {showHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>{getHint()}</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.hintButton, showHint && styles.hintButtonDisabled]} 
              onPress={() => setShowHint(true)}
              disabled={showHint}
            >
              <Text style={styles.hintButtonText}>💡 Hint</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Results Screen
  const performance = getPerformanceRating();
  const correctAnswers = completedScenarios.filter(s => s.isCorrect).length;
  const avgTime = Math.round(totalTime / 5);
  const bestScore = Math.max(...completedScenarios.map(s => s.score));
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>🎉 Challenge Complete!</Text>
        <Animated.View style={[styles.scoreContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={[styles.finalScore, { color: performance.color }]}>
            {score}/100
          </Text>
        </Animated.View>
        <Text style={[styles.performanceText, { color: performance.color }]}>
          {performance.rating}
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Performance Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>{correctAnswers}/5</Text>
            <Text style={styles.summaryLabel}>Correct Answers</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#9333ea' }]}>{avgTime}s</Text>
            <Text style={styles.summaryLabel}>Avg Time</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>{bestScore}</Text>
            <Text style={styles.summaryLabel}>Best Score</Text>
          </View>
        </View>
      </View>

      <View style={styles.resultsCard}>
        <Text style={styles.resultsCardTitle}>📋 Detailed Results</Text>
        {completedScenarios.map((result, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultName}>{result.name}</Text>
              <View style={styles.resultScore}>
                <Text style={styles.resultCorrect}>
                  {result.isCorrect ? '✅' : '❌'}
                </Text>
                <Text style={styles.resultPoints}>{result.score} pts</Text>
              </View>
            </View>
            <View style={styles.resultDetails}>
              <Text style={styles.resultDetail}>Your Answer: ₹{result.userAnswer}</Text>
              <Text style={styles.resultDetail}>Correct: ₹{result.correctAnswer}</Text>
              <Text style={styles.resultDetail}>Time: {result.timeTaken}s</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.playAgainButton} onPress={() => setGameState('menu')}>
        <Text style={styles.playAgainText}>Play Again 🔄</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  rulesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 16,
    color: '#4b5563',
    flex: 1,
  },
  scenariosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  scenarioDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scenarioDetail: {
    fontSize: 14,
    color: '#4b5563',
  },
  startButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scenarioCounter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  scenarioInfo: {
    marginBottom: 16,
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  scenarioDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  answerInput: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  hintContainer: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  hintText: {
    color: '#92400e',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hintButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    alignItems: 'center',
  },
  hintButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  hintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  scoreContainer: {
    marginBottom: 12,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  performanceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  resultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  resultItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  resultScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultCorrect: {
    fontSize: 16,
  },
  resultPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultDetail: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  playAgainButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  playAgainText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});