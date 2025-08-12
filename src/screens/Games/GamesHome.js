import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';

import LottieView from 'lottie-react-native';

export default function GamesHome({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getAnimatedStyle = () => ({
    opacity: fadeAnim,
    transform: [{ translateY: translateAnim }],
  });

  const handlePressIn = (scale) => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const AnimatedCard = ({ onPress, image, text }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(scale)}
        onPressOut={() => handlePressOut(scale)}
        onPress={onPress}
      >
        <Animated.View style={[styles.gameCard, { transform: [{ scale }] }]}>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.gameImage} />
          </View>
          <Text style={styles.gameText}>{text}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Optional floating background animation */}
      <LottieView
        source={require('../../assets/data_ana.json')} 
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.Text style={[styles.header, getAnimatedStyle()]}>Financial Games</Animated.Text>
        <Animated.Text style={[styles.subtitle, getAnimatedStyle()]}>Learn while you play!</Animated.Text>

        <View style={styles.gamesGrid}>
          <AnimatedCard
            onPress={() => navigation.navigate('BudgetGame')}
            image={require('../../assets/piggy.jpg')}
            text="₹5000 in 5 Days"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('ScamGame')}
            image={require('../../assets/scammer.jpg')}
            text="Spot The Scam"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('BillSplitterGame')}
            image={require('../../assets/new.png')}
            text="Bill Splitter Challenge"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('InvestmentFraudGame')}
            image={require('../../assets/bribe.png')}
            text="Fake Investment Detector"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('BudgetPlannerGame')}
            image={require('../../assets/budget.png')}
            text="Budget Planner Puzzle"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('ScamQuizGame')}
            image={require('../../assets/atm.png')}
            text="ATM & Scam Safety Quiz"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('CreditScoreClimber')}
            image={require('../../assets/credit.png')}
            text="Credit Score Climber"
          />

          <AnimatedCard
            onPress={() => navigation.navigate('ExpenseGuessGame')}
            image={require('../../assets/dailyExpense.png')}
            text="Daily Expense Guess"
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eaffec',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  gameCard: {
    backgroundColor: '#f0ffe6',
    padding: 16,
    width: '47%',
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    backgroundColor: '#e6f7e1',
    padding: 12,
    borderRadius: 50,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#00d084',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gameImage: { 
    width: 50, 
    height: 50,
    borderRadius: 25,
  },
  gameText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#222',
    textAlign: 'center',
    lineHeight: 18,
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
});