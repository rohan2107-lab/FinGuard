import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

// Investment ads dataset
const investmentAds = [
  {
    id: 1,
    text: '💰 Earn 30% returns monthly with zero risk! Join our crypto investment plan.',
    isFake: true,
    reason: 'Unrealistic returns and guaranteed profits are classic Ponzi scheme red flags.'
  },
  {
    id: 2,
    text: '🏠 Invest in REITs (Real Estate Investment Trusts) with regulated firms.',
    isFake: false,
    reason: 'REITs are regulated and offer reasonable returns from real estate investments.'
  },
  {
    id: 3,
    text: '📈 Double your money in 7 days! Limited time offer.',
    isFake: true,
    reason: 'Promises of doubling money quickly are usually scams targeting greed.'
  },
  {
    id: 4,
    text: '📉 Invest in Government Bonds with fixed yearly returns.',
    isFake: false,
    reason: 'Government Bonds are low-risk, regulated investments with fixed returns.'
  }
];

export default function InvestmentFraudGame({ navigation }) {
  const [step, setStep] = useState('intro'); 
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReason, setShowReason] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;

  const startScaleAnimation = () => {
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const animateSwipe = () => {
    swipeAnim.setValue(0);
    Animated.timing(swipeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (step === 'game') animateSwipe();
    if (step === 'score') startScaleAnimation();
  }, [step, currentIndex]);

  const handleStartGame = () => {
    setScore(0);
    setCurrentIndex(0);
    setStep('game');
    setShowReason(false);
  };

  const handleAnswer = (userChoice) => {
    const currentAd = investmentAds[currentIndex];
    if ((userChoice === 'fake' && currentAd.isFake) || (userChoice === 'real' && !currentAd.isFake)) {
      setScore((prev) => prev + 1);
    }
    setShowReason(true);
  };

  const handleNext = () => {
    setShowReason(false);
    if (currentIndex + 1 < investmentAds.length) {
      setCurrentIndex((prev) => prev + 1);
      animateSwipe();
    } else {
      setStep('score');
      startScaleAnimation();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      
      {step === 'intro' && (
        <>
          <Text style={styles.title}>💸 Fake Investment Detector</Text>
          <LottieView
            source={require('../../assets/data_ana.json')}
            autoPlay loop style={styles.animation}
          />
          <Text style={styles.info}>Swipe LEFT if it’s a Fake Investment. RIGHT if it’s Legitimate.</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Challenge 🚀</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'game' && (
        <Animated.View style={[styles.gameBox, {
          opacity: swipeAnim,
          transform: [{ scale: swipeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }]
        }]}>
          <Text style={styles.title}>Ad {currentIndex + 1} / {investmentAds.length}</Text>
          <Text style={styles.adText}>{investmentAds[currentIndex].text}</Text>

          {!showReason && (
            <>
              <TouchableOpacity style={styles.buttonFake} onPress={() => handleAnswer('fake')}>
                <Text style={styles.buttonText}>🚨 Fake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonReal} onPress={() => handleAnswer('real')}>
                <Text style={styles.buttonText}>✅ Real</Text>
              </TouchableOpacity>
            </>
          )}

          {showReason && (
            <>
              <View style={styles.reasonBox}>
                <Text style={styles.reason}>{investmentAds[currentIndex].reason}</Text>
              </View>
              <TouchableOpacity style={styles.buttonNext} onPress={handleNext}>
                <Text style={styles.buttonText}>Next ➡️</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}

      {step === 'score' && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.title}>🎉 Challenge Completed!</Text>
          <Text style={styles.score}>You correctly identified {score} / {investmentAds.length} ads!</Text>
          {score >= 3 ? (
            <Text style={styles.rewardGood}>✅ Smart Investor! Stay vigilant.</Text>
          ) : (
            <Text style={styles.rewardBad}>❌ More learning needed. Avoid get-rich-quick traps.</Text>
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
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#0b3d91', textAlign: 'center' },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#34495e' },
  adText: { fontSize: 18, marginBottom: 20, textAlign: 'center', color: '#2c3e50', padding: 15, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', width: '90%' },
  button: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 20, marginBottom: 20, width: '80%', alignItems: 'center', elevation: 3 },
  buttonFake: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 20, marginBottom: 10, width: '80%', alignItems: 'center', elevation: 3 },
  buttonReal: { backgroundColor: '#3498db', padding: 15, borderRadius: 20, marginBottom: 10, width: '80%', alignItems: 'center', elevation: 3 },
  buttonNext: { backgroundColor: '#f39c12', padding: 15, borderRadius: 20, marginBottom: 20, width: '80%', alignItems: 'center', elevation: 3 },
  resultBox: { backgroundColor: '#f5f5f5', padding: 20, borderRadius: 25, alignItems: 'center', width: '90%', elevation: 4 },
  reasonBox: { backgroundColor: '#f0f9ff', padding: 15, borderRadius: 15, marginVertical: 20, width: '90%', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  reason: { fontSize: 16, textAlign: 'center', color: '#2c3e50' },
  score: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, color: '#333' },
  rewardGood: { fontSize: 20, color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  rewardBad: { fontSize: 20, color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  moreButton: { backgroundColor: '#555', padding: 15, borderRadius: 20, marginTop: 15, width: '80%', alignItems: 'center', elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
