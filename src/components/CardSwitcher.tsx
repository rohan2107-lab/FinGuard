import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const cards = [
  {
    title: 'RBI Update',
    description: 'New policy on digital lending released. Know your rights!',
    backgroundColor: '#e0f7fa',
  },
  {
    title: 'PSB News',
    description: 'PSB Bank launches 5.5% savings account scheme for youth.',
    backgroundColor: '#f1f8e9',
  },
  {
    title: 'Rupee Exchange Rates',
    description: 'Show daily USD/INR or EUR/INR exchange rate.',
    backgroundColor: '#fff3e0',
  },
];

const CardSwitcher = () => {
  const [index, setIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Reset animation
      slideAnim.setValue(width);
      // Animate slide in from right
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      // Cycle card index
      setIndex((prev) => (prev + 1) % cards.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const card = cards[index];

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: card.backgroundColor },
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.description}>{card.description}</Text>
    </Animated.View>
  );
};

export default CardSwitcher;

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
});
