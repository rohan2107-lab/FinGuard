import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function GamesHome({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const AnimatedGameCard = ({ onPress, image, text, index, gradient = ['#e8f5e8', '#f0fff0'] }) => {
    const cardScale = useRef(new Animated.Value(1)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.7)).current;

    useEffect(() => {
      // Staggered entrance
      setTimeout(() => {
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, index * 150);

      // Continuous pulse effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.gameCard,
          {
            opacity: cardOpacity,
            transform: [
              { scale: Animated.multiply(cardScale, pulseAnim) },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardContent}
        >
          {/* Animated glow overlay */}
          <Animated.View 
            style={[
              styles.glowOverlay,
              { opacity: glowAnim }
            ]} 
          />

          {/* Card header with play icon */}
          <View style={styles.cardHeader}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>

          {/* Image container with animated border */}
          <Animated.View 
            style={[
              styles.imageContainer,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            <View style={styles.imageBorder}>
              <Image source={image} style={styles.gameImage} />
            </View>
            
            {/* Animated ring around image */}
            <Animated.View 
              style={[
                styles.imageRing,
                {
                  opacity: glowAnim,
                  transform: [{ scale: glowAnim.interpolate({
                    inputRange: [0.7, 1],
                    outputRange: [1, 1.1]
                  }) }]
                }
              ]}
            />
          </Animated.View>

          {/* Game title */}
          <Text style={styles.gameTitle}>{text}</Text>

          {/* Difficulty indicator */}
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map((star, i) => (
              <Text key={i} style={[
                styles.star, 
                { opacity: i < (index % 3) + 2 ? 1 : 0.3 }
              ]}>⭐</Text>
            ))}
          </View>

          {/* CTA Button */}
          <View style={styles.playNowButton}>
            <Text style={styles.playNowText}>PLAY NOW</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const gameData = [
    { nav: 'BudgetGame', image: require('../../assets/piggy.jpg'), text: '₹5000 in 5 Days', color: '#4CAF50' },
    { nav: 'ScamGame', image: require('../../assets/scammer.jpg'), text: 'Spot The Scam', color: '#FF5722' },
    { nav: 'BillSplitterGame', image: require('../../assets/new.png'), text: 'Bill Splitter Challenge', color: '#2196F3' },
    { nav: 'InvestmentFraudGame', image: require('../../assets/bribe.png'), text: 'Fake Investment Detector', color: '#FF9800' },
    { nav: 'BudgetPlannerGame', image: require('../../assets/budget.png'), text: 'Budget Planner Puzzle', color: '#9C27B0' },
    { nav: 'ScamQuizGame', image: require('../../assets/atm.png'), text: 'ATM & Scam Safety Quiz', color: '#607D8B' },
    { nav: 'CreditScoreClimber', image: require('../../assets/credit.png'), text: 'Credit Score Climber', color: '#795548' },
    { nav: 'ExpenseGuessGame', image: require('../../assets/dailyExpense.png'), text: 'Daily Expense Guess', color: '#E91E63' },
  ];

  return (
    <View style={styles.container}>
      {/* Background Animation */}
      <LottieView
        source={require('../../assets/data_ana.json')} 
        autoPlay
        loop
        style={styles.backgroundAnimation}
      />

      {/* Gradient Overlay */}
      <View style={styles.gradientBackground} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.mainTitle}>🎮 Financial Games 🎮</Text>
          <Text style={styles.subtitle}>Master your money skills through gaming</Text>
          
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Learning</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>Fun</Text>
            </View>
          </View>
        </Animated.View>

        {/* Games Grid */}
        <Animated.View 
          style={[
            styles.gamesGrid,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {gameData.map((game, index) => (
            <AnimatedGameCard
              key={index}
              index={index}
              onPress={() => navigation.navigate(game.nav)}
              image={game.image}
              text={game.text}
              color={game.color}
            />
          ))}
        </Animated.View>

        {/* Bottom CTA Section */}
        <Animated.View 
          style={[
            styles.bottomCTA,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.ctaTitle}>Ready to Level Up? 🚀</Text>
          <Text style={styles.ctaSubtitle}>Start your financial gaming journey today!</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.08,
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(232, 245, 233, 0.3)',
  },
  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 15,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 20,
  },
  cardHeader: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#10b981',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  playIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  imageBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e0f2fe',
  },
  gameImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  imageRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#10b981',
    borderStyle: 'dashed',
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 8,
    marginHorizontal: 1,
  },
  playNowButton: {
    backgroundColor: '#059669',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  playNowText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomCTA: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 25,
    borderRadius: 20,
    elevation: 3,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});