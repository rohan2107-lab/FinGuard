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
        default: return '•';
      }
    };
    
    return (
      <Text style={{ fontSize: size, color, fontWeight: 'bold' }}>
        {getIconText()}
      </Text>
    );
  };
  const [creditScore, setCreditScore] = useState(550);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [money, setMoney] = useState(5000);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [lastDecisionResult, setLastDecisionResult] = useState(null);
  const [playerStats, setPlayerStats] = useState({
    creditCards: 0,
    loans: 0,
    latePayments: 0,
    creditUtilization: 30,
  });

  const scoreAnimation = useRef(new Animated.Value(creditScore)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const scenarios = [
    {
      id: 1,
      title: "Credit Card Bill Due",
      description: "Your credit card bill of ₹2,000 is due. You have enough money to pay it.",
      options: [
        {
          text: "Pay full amount on time",
          scoreChange: +15,
          moneyChange: -2000,
          feedback: "Great! Paying on time boosts your credit score significantly."
        },
        {
          text: "Pay minimum amount (₹500)",
          scoreChange: -5,
          moneyChange: -500,
          feedback: "Paying only minimum hurts your score and increases interest."
        },
        {
          text: "Skip payment this month",
          scoreChange: -25,
          moneyChange: 0,
          feedback: "Missed payment! This severely damages your credit score."
        }
      ]
    },
    {
      id: 2,
      title: "New Credit Card Offer",
      description: "Bank offers you a new credit card with ₹50,000 limit.",
      options: [
        {
          text: "Accept the card",
          scoreChange: +10,
          moneyChange: 0,
          feedback: "New credit increases your available credit, improving your score!"
        },
        {
          text: "Decline the offer",
          scoreChange: 0,
          moneyChange: 0,
          feedback: "Safe choice, but missed opportunity to improve credit mix."
        }
      ]
    },
    {
      id: 3,
      title: "Emergency Expense",
      description: "Unexpected medical bill of ₹3,000. How will you handle it?",
      options: [
        {
          text: "Use credit card",
          scoreChange: -10,
          moneyChange: 0,
          feedback: "High utilization can hurt your score, but you avoided debt."
        },
        {
          text: "Take personal loan",
          scoreChange: -15,
          moneyChange: +3000,
          feedback: "New loan inquiry reduces score temporarily."
        },
        {
          text: "Use emergency savings",
          scoreChange: +5,
          moneyChange: -3000,
          feedback: "Smart! Using savings shows good financial planning."
        }
      ]
    },
    {
      id: 4,
      title: "Salary Bonus",
      description: "You received a ₹10,000 bonus! How should you use it?",
      options: [
        {
          text: "Pay down credit card debt",
          scoreChange: +20,
          moneyChange: +10000,
          feedback: "Excellent! Reducing debt improves your credit utilization ratio."
        },
        {
          text: "Buy new gadgets",
          scoreChange: 0,
          moneyChange: +10000,
          feedback: "Fun, but missed opportunity to improve your credit health."
        },
        {
          text: "Save for emergency fund",
          scoreChange: +5,
          moneyChange: +10000,
          feedback: "Good financial planning, but less direct credit impact."
        }
      ]
    },
    {
      id: 5,
      title: "Credit Report Error",
      description: "You found an error on your credit report showing a loan you never took.",
      options: [
        {
          text: "Dispute the error immediately",
          scoreChange: +25,
          moneyChange: 0,
          feedback: "Smart! Correcting errors can significantly boost your score."
        },
        {
          text: "Ignore it for now",
          scoreChange: -10,
          moneyChange: 0,
          feedback: "Missed opportunity! Errors can severely damage your score."
        }
      ]
    },
    {
      id: 6,
      title: "Friend Asks for Loan Co-signing",
      description: "Your friend wants you to co-sign a ₹50,000 personal loan.",
      options: [
        {
          text: "Co-sign the loan",
          scoreChange: -20,
          moneyChange: 0,
          feedback: "Risky! Co-signing affects your credit and debt-to-income ratio."
        },
        {
          text: "Politely decline",
          scoreChange: 0,
          moneyChange: 0,
          feedback: "Smart decision! Protecting your credit is important."
        }
      ]
    }
  ];

  useEffect(() => {
    generateNewScenario();
  }, [currentMonth]);

  useEffect(() => {
    Animated.timing(scoreAnimation, {
      toValue: creditScore,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    if (creditScore >= 750) {
      setGameWon(true);
      setGameOver(true);
    } else if (creditScore <= 300 || currentMonth > 12) {
      setGameOver(true);
    }
  }, [creditScore]);

  const generateNewScenario = () => {
    if (currentMonth <= 12 && !gameOver) {
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      setCurrentScenario(randomScenario);
    }
  };

  const handleDecision = (option) => {
    const newScore = Math.max(300, Math.min(850, creditScore + option.scoreChange));
    const newMoney = Math.max(0, money + option.moneyChange);
    
    setCreditScore(newScore);
    setMoney(newMoney);
    
    const result = {
      month: currentMonth,
      scenario: currentScenario.title,
      decision: option.text,
      scoreChange: option.scoreChange,
      moneyChange: option.moneyChange,
      feedback: option.feedback,
      newScore: newScore,
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
    generateNewScenario();
  };

  const restartGame = () => {
    setCreditScore(550);
    setCurrentMonth(1);
    setMoney(5000);
    setGameOver(false);
    setGameWon(false);
    setGameHistory([]);
    setShowResultModal(false);
    setCurrentScenario(null);
    generateNewScenario();
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return '#22c55e'; // Green
    if (score >= 700) return '#84cc16'; // Light Green
    if (score >= 650) return '#eab308'; // Yellow
    if (score >= 600) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  if (gameOver) {
    return (
      <View style={styles.container}>
        <View style={styles.gameOverContainer}>
          <CustomIcon 
            name={gameWon ? "trophy" : "sad"} 
            size={60} 
            color={gameWon ? "#ffd700" : "#ef4444"} 
          />
          <Text style={styles.gameOverTitle}>
            {gameWon ? "Congratulations! 🎉" : "Game Over"}
          </Text>
          <Text style={styles.gameOverText}>
            {gameWon 
              ? `You achieved an excellent credit score of ${creditScore}!`
              : `Your final credit score: ${creditScore}`
            }
          </Text>
          <Text style={styles.monthsPlayed}>
            Months played: {currentMonth - 1}
          </Text>
          
          <View style={styles.finalStats}>
            <Text style={styles.finalStatsTitle}>Final Stats:</Text>
            <Text style={styles.statText}>💰 Money: ₹{money.toLocaleString()}</Text>
            <Text style={styles.statText}>📊 Credit Score: {creditScore}</Text>
            <Text style={styles.statText}>🏆 Rating: {getCreditScoreLabel(creditScore)}</Text>
          </View>

          <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Games</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backIcon} 
            onPress={() => navigation.goBack()}
          >
            <CustomIcon name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.title}>Credit Score Climber</Text>
        </View>

        {/* Stats Dashboard */}
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
              <Text style={styles.statLabel}>Month</Text>
              <Text style={styles.statValue}>{currentMonth}/12</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Money</Text>
              <Text style={styles.statValue}>₹{money.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Goal</Text>
              <Text style={styles.statValue}>750+</Text>
            </View>
          </View>
        </View>

        {/* Current Scenario */}
        {currentScenario && (
          <View style={styles.scenarioContainer}>
            <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
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
                      <Text style={[
                        styles.effectText,
                        { color: option.scoreChange > 0 ? '#22c55e' : '#ef4444' }
                      ]}>
                        {option.scoreChange > 0 ? '+' : ''}{option.scoreChange} score
                      </Text>
                    )}
                    {option.moneyChange !== 0 && (
                      <Text style={[
                        styles.effectText,
                        { color: option.moneyChange > 0 ? '#22c55e' : '#ef4444' }
                      ]}>
                        {option.moneyChange > 0 ? '+' : ''}₹{option.moneyChange.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Game Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Credit Tips</Text>
          <Text style={styles.tipText}>• Pay bills on time to avoid late payment penalties</Text>
          <Text style={styles.tipText}>• Keep credit utilization below 30%</Text>
          <Text style={styles.tipText}>• Don't close old credit cards unnecessarily</Text>
          <Text style={styles.tipText}>• Check your credit report regularly for errors</Text>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Decision Result</Text>
            
            {lastDecisionResult && (
              <>
                <Text style={styles.modalFeedback}>
                  {lastDecisionResult.feedback}
                </Text>
                
                <View style={styles.modalStats}>
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>Score Change:</Text>
                    <Text style={[
                      styles.modalStatValue,
                      { color: lastDecisionResult.scoreChange >= 0 ? '#22c55e' : '#ef4444' }
                    ]}>
                      {lastDecisionResult.scoreChange >= 0 ? '+' : ''}{lastDecisionResult.scoreChange}
                    </Text>
                  </View>
                  
                  <View style={styles.modalStatRow}>
                    <Text style={styles.modalStatLabel}>New Score:</Text>
                    <Text style={[styles.modalStatValue, { color: getCreditScoreColor(lastDecisionResult.newScore) }]}>
                      {lastDecisionResult.newScore}
                    </Text>
                  </View>
                </View>
              </>
            )}
            
            <TouchableOpacity style={styles.continueButton} onPress={nextMonth}>
              <Text style={styles.continueButtonText}>Continue to Next Month</Text>
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
    backgroundColor: '#eaffec',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backIcon: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  dashboard: {
    backgroundColor: '#f0ffe6',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
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
    color: '#555',
    marginBottom: 10,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
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
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  scenarioContainer: {
    backgroundColor: '#f0ffe6',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  scenarioDescription: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  optionEffects: {
    flexDirection: 'row',
    gap: 15,
  },
  effectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: '#f0ffe6',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 5,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
    marginBottom: 10,
  },
  gameOverText: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  monthsPlayed: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  finalStats: {
    backgroundColor: '#f0ffe6',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
  },
  finalStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  statText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#00d084',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  playAgainText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#666',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: width * 0.85,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  modalFeedback: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalStats: {
    width: '100%',
    marginBottom: 20,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalStatLabel: {
    fontSize: 16,
    color: '#666',
  },
  modalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#00d084',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
// export default CreditScoreClimber; // Removed duplicate default export