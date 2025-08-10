import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

/**
 * ATM & Scam Safety Quiz Component
 * 
 * Features:
 * - 10 interactive multiple-choice questions
 * - Score tracking and progress display
 * - Question shuffling for randomization
 * - Immediate feedback with explanations
 * - Final results screen with replay option
 * - Mobile-friendly responsive design
 * 
 * To add new questions:
 * 1. Add new question object to QUIZ_DATA array
 * 2. Follow the same structure: question, options, correctAnswer, explanation
 * 3. Make sure correctAnswer is the index (0-3) of the correct option
 */

// Quiz Data - Add or modify questions here
const QUIZ_DATA = [
  {
    id: 1,
    question: "What should you do if you notice a suspicious device attached to an ATM card slot?",
    options: [
      "Use the ATM anyway but be quick",
      "Try to remove the device yourself",
      "Do not use the ATM and report it to the bank immediately",
      "Use a different card slot on the same ATM"
    ],
    correctAnswer: 2,
    explanation: "If you notice any suspicious devices, avoid using the ATM entirely and report it to the bank. These could be card skimmers used to steal your card information."
  },
  {
    id: 2,
    question: "You receive an SMS saying your bank account will be closed unless you click a link and verify details. What should you do?",
    options: [
      "Click the link immediately to save your account",
      "Call the bank's official number to verify",
      "Reply to the SMS with your details",
      "Forward the message to friends for advice"
    ],
    correctAnswer: 1,
    explanation: "Banks never ask for sensitive information via SMS or email. Always call the official bank number to verify any suspicious messages. This is a common phishing scam."
  },
  {
    id: 3,
    question: "When entering your ATM PIN, what is the best practice?",
    options: [
      "Enter it quickly so others can't see",
      "Cover the keypad with your hand while entering",
      "Look around to see who's watching",
      "Ask someone to hold your bag while you enter the PIN"
    ],
    correctAnswer: 1,
    explanation: "Always cover the keypad with your free hand when entering your PIN. This prevents shoulder surfing and hidden cameras from capturing your PIN."
  },
  {
    id: 4,
    question: "Someone calls claiming to be from your bank and asks for your OTP 'for verification purposes'. What should you do?",
    options: [
      "Give them the OTP since they're from the bank",
      "Ask for their employee ID first",
      "Never share your OTP with anyone, even if they claim to be from the bank",
      "Share only the first 3 digits of the OTP"
    ],
    correctAnswer: 2,
    explanation: "OTPs are meant only for you. Banks will never ask for your OTP over the phone. Sharing your OTP can give fraudsters access to your accounts."
  },
  {
    id: 5,
    question: "You receive a UPI payment request for ₹1 from an unknown number with message 'Refund Process - Accept to receive ₹5000'. What should you do?",
    options: [
      "Accept it to get the refund",
      "Decline and block the number",
      "Ask them to send ₹5000 first",
      "Share the request with friends"
    ],
    correctAnswer: 1,
    explanation: "This is a common UPI scam. The ₹1 request is actually a payment request FROM you. Always check if it says 'Pay' or 'Receive' before accepting any UPI request."
  },
  {
    id: 6,
    question: "What should you check before using an ATM?",
    options: [
      "Only if there's security guard present",
      "Check for proper lighting and cameras",
      "Look for loose parts, hidden cameras, or suspicious devices",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Always inspect the ATM for any suspicious devices, ensure proper lighting, check for security cameras, and look for any loose parts on the card reader or keypad."
  },
  {
    id: 7,
    question: "You get an email saying you've won ₹10 lakhs in a lottery you never entered. They ask for ₹5000 as processing fee. What should you do?",
    options: [
      "Pay the processing fee to claim your prize",
      "Negotiate for a lower processing fee",
      "Delete the email - it's a scam",
      "Ask them to deduct the fee from the prize money"
    ],
    correctAnswer: 2,
    explanation: "This is a classic advance fee scam. Legitimate lotteries don't require you to pay fees to claim prizes. Never send money to claim unexpected prizes."
  },
  {
    id: 8,
    question: "Your card gets blocked after 3 wrong PIN attempts at an ATM. What should you do?",
    options: [
      "Try using it at a different ATM",
      "Wait 24 hours and try again",
      "Contact your bank immediately to unblock it",
      "Ask someone else to try using your card"
    ],
    correctAnswer: 2,
    explanation: "If your card is blocked due to wrong PIN attempts, contact your bank immediately. Don't wait or try other ATMs as this could be due to a compromised ATM."
  },
  {
    id: 9,
    question: "What information should you NEVER share with anyone claiming to be from your bank?",
    options: [
      "Your account balance",
      "Your PIN, CVV, OTP, or full card number",
      "Your branch name",
      "Your registered mobile number"
    ],
    correctAnswer: 1,
    explanation: "Never share sensitive information like PIN, CVV, OTP, passwords, or complete card details with anyone. Banks already have this information and will never ask for it."
  },
  {
    id: 10,
    question: "You notice unauthorized transactions in your bank statement. What should be your immediate action?",
    options: [
      "Wait and see if more transactions appear",
      "Change your PIN at the next ATM visit",
      "Immediately contact your bank and block your cards",
      "Check with family members if they used your card"
    ],
    correctAnswer: 2,
    explanation: "Time is critical in fraud cases. Immediately contact your bank to report unauthorized transactions and block your cards to prevent further misuse."
  }
];

const ScamQuizGame = ({ navigation }) => {
  // State Management
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  // Initialize quiz with shuffled questions
  useEffect(() => {
    shuffleQuestions();
  }, []);

  /**
   * Shuffle questions array to randomize quiz order
   * Uses Fisher-Yates shuffle algorithm
   */
  const shuffleQuestions = () => {
    const shuffled = [...QUIZ_DATA];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setQuestions(shuffled);
  };

  /**
   * Handle answer selection
   * Shows immediate feedback and explanation
   */
  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Store user's answer for results
    setUserAnswers([...userAnswers, {
      questionId: questions[currentQuestion].id,
      selectedAnswer: answerIndex,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect
    }]);
  };

  /**
   * Move to next question or complete quiz
   */
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  /**
   * Reset quiz to initial state
   */
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    shuffleQuestions(); // Shuffle again for replay
  };

  /**
   * Get performance message based on score percentage
   */
  const getPerformanceMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90) return "Excellent! You're well-prepared against scams! 🏆";
    if (percentage >= 80) return "Great job! You have good scam awareness! 👍";
    if (percentage >= 70) return "Good work! Keep learning about scam prevention! 📚";
    if (percentage >= 60) return "Not bad! There's room for improvement! 💪";
    return "Keep learning! Scam awareness is crucial for your safety! 🔒";
  };

  // Show loading if questions aren't loaded yet
  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Quiz completion screen
  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsCard}>
            <Icon name="security" size={80} color="#4CAF50" style={styles.resultsIcon} />
            <Text style={styles.resultsTitle}>Quiz Completed!</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.finalScore}>{score}/{questions.length}</Text>
              <Text style={styles.percentage}>{percentage}%</Text>
            </View>
            
            <Text style={styles.performanceText}>
              {getPerformanceMessage()}
            </Text>

            <View style={styles.resultsSummary}>
              <View style={styles.summaryRow}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.summaryText}>Correct: {score}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Icon name="cancel" size={20} color="#F44336" />
                <Text style={styles.summaryText}>Wrong: {questions.length - score}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Icon name="quiz" size={20} color="#2196F3" />
                <Text style={styles.summaryText}>Total: {questions.length}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.playAgainButton}
                onPress={resetQuiz}
              >
                <Icon name="refresh" size={20} color="#fff" />
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation && navigation.goBack()}
              >
                <Icon name="home" size={20} color="#2196F3" />
                <Text style={styles.homeText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation && navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ATM & Scam Safety Quiz</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Q{currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>
            {currentQ.question}
          </Text>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              let optionStyle = [styles.optionButton];
              let textStyle = [styles.optionText];

              if (selectedAnswer !== null) {
                if (index === currentQ.correctAnswer) {
                  optionStyle.push(styles.correctOption);
                  textStyle.push(styles.correctOptionText);
                } else if (index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer) {
                  optionStyle.push(styles.wrongOption);
                  textStyle.push(styles.wrongOptionText);
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <Text style={styles.optionLabel}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                  <Text style={textStyle}>{option}</Text>
                  {selectedAnswer !== null && index === currentQ.correctAnswer && (
                    <Icon name="check" size={20} color="#fff" />
                  )}
                  {selectedAnswer !== null && index === selectedAnswer && selectedAnswer !== currentQ.correctAnswer && (
                    <Icon name="close" size={20} color="#fff" />
                  )}
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
                  color={selectedAnswer === currentQ.correctAnswer ? "#4CAF50" : "#FF9800"} 
                />
                <Text style={styles.explanationTitle}>Explanation</Text>
              </View>
              <Text style={styles.explanationText}>
                {currentQ.explanation}
              </Text>
            </View>
          )}

          {/* Next Button */}
          {showExplanation && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>
                {currentQuestion === questions.length - 1 ? "View Results" : "Next Question"}
              </Text>
              <Icon 
                name={currentQuestion === questions.length - 1 ? "flag" : "arrow-forward"} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Current Score */}
        <View style={styles.scoreDisplay}>
          <Icon name="stars" size={20} color="#FFD700" />
          <Text style={styles.currentScore}>Score: {score}/{currentQuestion + (showExplanation ? 1 : 0)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  questionCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 26,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#45a049',
  },
  wrongOption: {
    backgroundColor: '#F44336',
    borderColor: '#e53935',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginRight: 12,
    minWidth: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  correctOptionText: {
    color: '#fff',
  },
  wrongOptionText: {
    color: '#fff',
  },
  explanationContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 16,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  resultsContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  resultsIcon: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  percentage: {
    fontSize: 24,
    fontWeight: '600',
    color: '#666',
    marginTop: 4,
  },
  performanceText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    lineHeight: 22,
  },
  resultsSummary: {
    width: '100%',
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  actionButtons: {
    width: '100%',
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
  },
  homeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 8,
  },
});

export default ScamQuizGame;