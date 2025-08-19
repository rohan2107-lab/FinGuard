import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, Alert, Modal } from 'react-native';

// Realistic scenarios for each day
const dailyScenarios = [
  {
    day: 1,
    scenarios: [
      {
        id: 's1',
        title: "Morning Coffee Decision",
        description: "You're feeling tired and considering buying coffee",
        options: [
          { text: "Buy premium coffee ₹150", cost: 150, points: -5 },
          { text: "Buy regular coffee ₹80", cost: 80, points: -2 },
          { text: "Make coffee at home ₹20", cost: 20, points: 5 },
          { text: "Skip coffee today", cost: 0, points: 8 }
        ]
      },
      {
        id: 's2',
        title: "Lunch Plans",
        description: "Your friends invite you to an expensive restaurant",
        options: [
          { text: "Join friends - ₹400", cost: 400, points: -10 },
          { text: "Suggest cheaper place - ₹200", cost: 200, points: 0 },
          { text: "Pack lunch from home - ₹50", cost: 50, points: 10 },
          { text: "Skip lunch to save", cost: 0, points: -15 }
        ]
      }
    ]
  },
  {
    day: 2,
    scenarios: [
      {
        id: 's3',
        title: "Transportation Choice",
        description: "You need to travel across the city",
        options: [
          { text: "Take Uber/Ola - ₹300", cost: 300, points: -8 },
          { text: "Take auto-rickshaw - ₹150", cost: 150, points: -3 },
          { text: "Take bus - ₹30", cost: 30, points: 8 },
          { text: "Walk/cycle - ₹0", cost: 0, points: 15 }
        ]
      },
      {
        id: 's4',
        title: "Phone Recharge Needed",
        description: "Your phone balance is low",
        options: [
          { text: "Premium plan - ₹399", cost: 399, points: -12 },
          { text: "Regular plan - ₹199", cost: 199, points: 0 },
          { text: "Basic plan - ₹99", cost: 99, points: 5 },
          { text: "Emergency recharge - ₹20", cost: 20, points: 8 }
        ]
      }
    ]
  },
  {
    day: 3,
    scenarios: [
      {
        id: 's5',
        title: "Grocery Shopping",
        description: "You need to buy groceries for the week",
        options: [
          { text: "Buy everything branded - ₹800", cost: 800, points: -15 },
          { text: "Mix of branded & local - ₹500", cost: 500, points: -5 },
          { text: "Buy local products - ₹300", cost: 300, points: 5 },
          { text: "Buy only essentials - ₹200", cost: 200, points: 12 }
        ]
      },
      {
        id: 's6',
        title: "Entertainment Temptation",
        description: "New movie release, friends planning to watch",
        options: [
          { text: "Premium seats - ₹350", cost: 350, points: -10 },
          { text: "Regular seats - ₹200", cost: 200, points: -5 },
          { text: "Wait for OTT release", cost: 0, points: 10 },
          { text: "Watch at home with friends", cost: 50, points: 8 }
        ]
      }
    ]
  },
  {
    day: 4,
    scenarios: [
      {
        id: 's7',
        title: "Unexpected Expense",
        description: "Your earphones broke, need replacement",
        options: [
          { text: "Buy premium brand - ₹2000", cost: 2000, points: -20 },
          { text: "Buy mid-range - ₹800", cost: 800, points: -10 },
          { text: "Buy basic ones - ₹300", cost: 300, points: 0 },
          { text: "Borrow from friend", cost: 0, points: 5 }
        ]
      },
      {
        id: 's8',
        title: "Social Pressure",
        description: "Friends want to go to an expensive café",
        options: [
          { text: "Order expensive items - ₹400", cost: 400, points: -12 },
          { text: "Order something cheap - ₹150", cost: 150, points: -3 },
          { text: "Just order tea/coffee - ₹80", cost: 80, points: 3 },
          { text: "Politely decline invitation", cost: 0, points: 8 }
        ]
      }
    ]
  },
  {
    day: 5,
    scenarios: [
      {
        id: 's9',
        title: "Last Day Celebration",
        description: "You want to treat yourself on the last day",
        options: [
          { text: "Expensive dinner - ₹600", cost: 600, points: -15 },
          { text: "Nice meal - ₹300", cost: 300, points: -5 },
          { text: "Cook special meal - ₹100", cost: 100, points: 8 },
          { text: "Simple home meal", cost: 50, points: 12 }
        ]
      },
      {
        id: 's10',
        title: "Final Temptation",
        description: "You see something you really want to buy",
        options: [
          { text: "Buy it immediately - ₹500", cost: 500, points: -20 },
          { text: "Think about it - ₹0", cost: 0, points: 10 },
          { text: "Add to wishlist for later", cost: 0, points: 15 },
          { text: "Calculate if you can afford", cost: 0, points: 20 }
        ]
      }
    ]
  }
];

export default function BudgetGame({ navigation }) {
  const [step, setStep] = useState('intro');
  const [currentDay, setCurrentDay] = useState(1);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [gameChoices, setGameChoices] = useState([]);
  const [showDaySummary, setShowDaySummary] = useState(false);
  const [daySpending, setDaySpending] = useState(0);

  const weeklyBudget = 5000;
  const dailyBudget = weeklyBudget / 5; // ₹1000 per day

  const handleStartGame = () => {
    setStep('game');
    setCurrentDay(1);
    setCurrentScenarioIndex(0);
    setTotalSpent(0);
    setTotalPoints(0);
    setGameChoices([]);
    setDaySpending(0);
  };

  const handleChoice = (choice, scenario) => {
    const newSpent = totalSpent + choice.cost;
    const newPoints = totalPoints + choice.points;
    const newDaySpending = daySpending + choice.cost;
    
    setTotalSpent(newSpent);
    setTotalPoints(newPoints);
    setDaySpending(newDaySpending);
    
    const choiceRecord = {
      day: currentDay,
      scenario: scenario.title,
      choice: choice.text,
      cost: choice.cost,
      points: choice.points
    };
    
    setGameChoices([...gameChoices, choiceRecord]);

    // Move to next scenario
    const currentDayScenarios = dailyScenarios.find(d => d.day === currentDay).scenarios;
    
    if (currentScenarioIndex < currentDayScenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
    } else {
      // Day completed, show summary
      setShowDaySummary(true);
    }
  };

  const handleNextDay = () => {
    setShowDaySummary(false);
    setDaySpending(0);
    
    if (currentDay < 5) {
      setCurrentDay(currentDay + 1);
      setCurrentScenarioIndex(0);
    } else {
      setStep('score');
    }
  };

  const calculateFinalScore = () => {
    let score = totalPoints;
    
    // Bonus points for staying under budget
    const remaining = weeklyBudget - totalSpent;
    if (remaining >= 0) {
      score += Math.floor(remaining / 50); // 1 point per ₹50 saved
    } else {
      score -= Math.floor(Math.abs(remaining) / 100); // -1 point per ₹100 overspent
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score + 50)); // Adding 50 to make scoring more balanced
  };

  const getScoreRating = (score) => {
    if (score >= 90) return { text: "Excellent Money Manager! 🏆", color: "gold" };
    if (score >= 80) return { text: "Great Budgeting Skills! 🌟", color: "green" };
    if (score >= 70) return { text: "Good Financial Discipline! 👍", color: "blue" };
    if (score >= 60) return { text: "Average Performance 📊", color: "orange" };
    if (score >= 40) return { text: "Needs Improvement 📈", color: "red" };
    return { text: "Financial Planning Required! 📚", color: "darkred" };
  };

  const resetGame = () => setStep('intro');

  const currentScenario = step === 'game' && currentDay <= 5 
    ? dailyScenarios.find(d => d.day === currentDay)?.scenarios[currentScenarioIndex]
    : null;

  const remaining = weeklyBudget - totalSpent;
  const finalScore = calculateFinalScore();
  const scoreRating = getScoreRating(finalScore);

  return (
    <View style={styles.container}>
      {step === 'intro' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>₹5000 in 5 Days Challenge</Text>
          <Image source={require('../../assets/piggy.jpg')} style={styles.image} />
          <Text style={styles.info}>
            🎯 Your mission: Manage ₹5000 for 5 days wisely!{'\n\n'}
            📊 You'll face realistic daily scenarios{'\n'}
            🏆 Earn points based on smart financial decisions{'\n'}
            💡 Each choice affects your budget and score{'\n\n'}
            Target: 100 points for perfect money management!
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Challenge</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 'game' && currentScenario && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.dayTitle}>Day {currentDay} of 5</Text>
            <Text style={styles.budget}>Budget: ₹{weeklyBudget}</Text>
            <Text style={styles.spent}>Spent: ₹{totalSpent}</Text>
            <Text style={styles.remaining}>Remaining: ₹{remaining}</Text>
            <Text style={styles.points}>Points: {totalPoints}</Text>
          </View>

          <View style={styles.scenarioCard}>
            <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
            <Text style={styles.scenarioDesc}>{currentScenario.description}</Text>
            
            <Text style={styles.choicesTitle}>What will you do?</Text>
            {currentScenario.options.map((option, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.choiceButton,
                  option.points > 0 ? styles.goodChoice : 
                  option.points < -10 ? styles.badChoice : styles.neutralChoice
                ]}
                onPress={() => handleChoice(option, currentScenario)}
              >
                <Text style={styles.choiceText}>{option.text}</Text>
                <Text style={styles.pointsPreview}>
                  {option.points > 0 ? `+${option.points}` : option.points} pts
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Day Summary Modal */}
      <Modal visible={showDaySummary} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Day {currentDay} Complete! 📊</Text>
            <Text style={styles.modalText}>Today's Spending: ₹{daySpending}</Text>
            <Text style={styles.modalText}>Daily Budget: ₹{dailyBudget}</Text>
            <Text style={styles.modalText}>
              {daySpending <= dailyBudget ? '✅ Under Budget!' : '❌ Over Budget!'}
            </Text>
            <Text style={styles.modalText}>Current Points: {totalPoints}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={handleNextDay}>
              <Text style={styles.buttonText}>
                {currentDay < 5 ? 'Next Day' : 'See Final Results'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {step === 'score' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>🎉 Challenge Complete!</Text>
          
          <View style={styles.scoreCard}>
            <Text style={styles.finalScore}>{finalScore}/100 Points</Text>
            <Text style={[styles.rating, { color: scoreRating.color }]}>
              {scoreRating.text}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Financial Summary</Text>
            <Text style={styles.summaryText}>Total Budget: ₹{weeklyBudget}</Text>
            <Text style={styles.summaryText}>Total Spent: ₹{totalSpent}</Text>
            <Text style={[
              styles.summaryText, 
              { color: remaining >= 0 ? 'green' : 'red' }
            ]}>
              {remaining >= 0 ? 'Saved' : 'Overspent'}: ₹{Math.abs(remaining)}
            </Text>
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Money Tips</Text>
            {finalScore >= 80 ? (
              <Text style={styles.tipsText}>
                Excellent! You understand the value of money and make smart choices. 
                Keep tracking expenses and planning ahead!
              </Text>
            ) : finalScore >= 60 ? (
              <Text style={styles.tipsText}>
                Good effort! Try to resist impulse purchases and always consider 
                alternatives before spending. Plan your expenses in advance.
              </Text>
            ) : (
              <Text style={styles.tipsText}>
                Focus on needs vs wants. Create a daily spending limit and stick to it. 
                Look for free or cheaper alternatives before making purchases.
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Games</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 20, alignItems: 'center', minHeight: '100%', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#2c3e50' },
  dayTitle: { fontSize: 20, fontWeight: 'bold', color: '#27ae60', textAlign: 'center' },
  info: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24, color: '#34495e' },
  image: { width: 120, height: 120, marginBottom: 20, borderRadius: 60 },
  
  header: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 20, 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  budget: { fontSize: 16, textAlign: 'center', color: '#3498db', marginTop: 5 },
  spent: { fontSize: 16, textAlign: 'center', color: '#e74c3c', marginTop: 2 },
  remaining: { fontSize: 16, textAlign: 'center', color: '#27ae60', marginTop: 2 },
  points: { fontSize: 18, textAlign: 'center', color: '#f39c12', marginTop: 5, fontWeight: 'bold' },

  scenarioCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  scenarioTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 10 },
  scenarioDesc: { fontSize: 16, textAlign: 'center', color: '#7f8c8d', marginBottom: 20, lineHeight: 22 },
  choicesTitle: { fontSize: 18, fontWeight: '600', color: '#34495e', marginBottom: 15, textAlign: 'center' },
  
  choiceButton: { 
    padding: 15, 
    marginBottom: 12, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  goodChoice: { backgroundColor: '#d5f4e6', borderWidth: 1, borderColor: '#27ae60' },
  neutralChoice: { backgroundColor: '#fef9e7', borderWidth: 1, borderColor: '#f39c12' },
  badChoice: { backgroundColor: '#fadbd8', borderWidth: 1, borderColor: '#e74c3c' },
  choiceText: { fontSize: 16, flex: 1, color: '#2c3e50' },
  pointsPreview: { fontSize: 14, fontWeight: 'bold', color: '#34495e' },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20
  },
  modalContent: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 20, 
    alignItems: 'center',
    width: '100%',
    maxWidth: 350
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#2c3e50', textAlign: 'center' },
  modalText: { fontSize: 16, marginBottom: 8, color: '#34495e', textAlign: 'center' },
  modalButton: { 
    backgroundColor: '#3498db', 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 20 
  },

  scoreCard: { 
    backgroundColor: '#fff', 
    padding: 25, 
    borderRadius: 20, 
    marginBottom: 20, 
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8
  },
  finalScore: { fontSize: 36, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  rating: { fontSize: 18, fontWeight: '600', textAlign: 'center' },

  summaryCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 20, 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  summaryTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2c3e50' },
  summaryText: { fontSize: 16, marginBottom: 8, textAlign: 'center', color: '#34495e' },

  tipsCard: { 
    backgroundColor: '#e8f5e8', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 30, 
    width: '100%',
    borderWidth: 1,
    borderColor: '#27ae60'
  },
  tipsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#27ae60' },
  tipsText: { fontSize: 15, lineHeight: 22, textAlign: 'center', color: '#2c3e50' },

  button: { 
    backgroundColor: '#27ae60', 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    borderRadius: 25, 
    width: '100%', 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  moreButton: { 
    backgroundColor: '#95a5a6', 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    borderRadius: 25, 
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 }
});