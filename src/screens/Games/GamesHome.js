import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

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
          <Image source={image} style={styles.gameImage} />
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
        <Animated.Text style={[styles.header, getAnimatedStyle()]}>Games</Animated.Text>

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
          image={require('../../assets/new.png')}
          text="Fake Investment Detector"
        />

        <TouchableWithoutFeedback onPress={() => navigation.navigate('MoreGames')}>
          <Animated.View style={[styles.moreButton, getAnimatedStyle()]}>
            <Text style={styles.moreText}>More</Text>
          </Animated.View>
        </TouchableWithoutFeedback>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eaffec',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#f0ffe6',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
  },
  gameImage: { width: 70, height: 70, marginRight: 15 },
  gameText: { fontSize: 18, fontWeight: '600', color: '#222' },
  moreButton: {
    backgroundColor: '#00d084',
    paddingVertical: 15,
    width: '50%',
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  moreText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
});
