import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView, Keyboard } from 'react-native';
import LottieView from 'lottie-react-native';

const scamMessages = [
  { id: 1, text: 'Dear user, your KYC will expire. Refund ₹4000 pending. Confirm UPI PIN now.', isScam: true },
  { id: 2, text: 'Your electricity bill is due. Pay now to avoid disconnection.', isScam: false },
  { id: 3, text: 'Congratulations! You won ₹1 crore lottery. Send ₹2000 fee to claim.', isScam: true },
  { id: 4, text: 'Bank Update: Click here to update your debit card details.', isScam: true },
  { id: 5, text: 'Amazon delivery: Your package will arrive today.', isScam: false },
];

export default function ScamGame({ navigation }) {
  const [step, setStep] = useState('intro'); 
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const messageAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (step === 'game') animateMessage();
    if (step === 'score') startScaleAnimation();
  }, [step, currentIndex]);

  const handleStartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setStep('game');
  };

  const handleAnswer = (userChoice) => {
    const currentMessage = scamMessages[currentIndex];
    if ((userChoice === 'scam' && currentMessage.isScam) || (userChoice === 'safe' && !currentMessage.isScam)) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < scamMessages.length) {
      setCurrentIndex((prev) => prev + 1);
      animateMessage();
    } else {
      setStep('score');
      startScaleAnimation();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {step === 'intro' && (
        <>
          <Text style={styles.title}>🚨 Spot the Scam Challenge</Text>
          <LottieView
            source={require('../../assets/bill-anim.json')} 
            autoPlay loop style={styles.animation}
          />
          <Text style={styles.info}>Read each message and decide if it’s SCAM or SAFE.</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Game 🚀</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'game' && (
        <Animated.View style={[styles.gameBox, {
          opacity: messageAnim,
          transform: [{ scale: messageAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
        }]}>
          <Text style={styles.title}>Message {currentIndex + 1} / {scamMessages.length}</Text>
          <Text style={styles.messageText}>{scamMessages[currentIndex].text}</Text>

          <TouchableOpacity style={styles.buttonScam} onPress={() => handleAnswer('scam')}>
            <Text style={styles.buttonText}>🚨 Scam</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSafe} onPress={() => handleAnswer('safe')}>
            <Text style={styles.buttonText}>✅ Safe</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {step === 'score' && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.title}>🎉 Game Completed!</Text>
          <Text style={styles.score}>You caught {score} / {scamMessages.length} scams!</Text>

          {score >= 4 ? (
            <Text style={styles.rewardGood}>✅ Well done, Fraud Fighter!</Text>
          ) : (
            <Text style={styles.rewardBad}>❌ You need more practice spotting scams.</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Games</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fffdf0', alignItems: 'center', justifyContent: 'center' },
  animation: { width: 220, height: 220, marginBottom: 20 },
  gameBox: { alignItems: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#d9534f', textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#34495e' },
  messageText: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#2c3e50', padding: 10, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', width: '90%' },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 20, marginBottom: 20, width: '80%', alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonScam: { backgroundColor: '#dc3545', padding: 15, borderRadius: 20, marginBottom: 15, width: '80%', alignItems: 'center', elevation: 3 },
  buttonSafe: { backgroundColor: '#28a745', padding: 15, borderRadius: 20, marginBottom: 15, width: '80%', alignItems: 'center', elevation: 3 },
  resultBox: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 25, alignItems: 'center', width: '90%', elevation: 4 },
  score: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  rewardGood: { fontSize: 20, color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  rewardBad: { fontSize: 20, color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  moreButton: { backgroundColor: '#555', padding: 15, borderRadius: 20, marginTop: 15, width: '80%', alignItems: 'center', elevation: 3 },
});
