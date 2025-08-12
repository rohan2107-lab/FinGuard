import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MutualFundsTutorial() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📊 Mutual Funds</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Understand how mutual funds pool money from multiple investors to create
          diversified portfolios. We’ll explore types, benefits, risks, and selection tips.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4FB', // soft lavender background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#9B59B6', // purple theme for mutual funds
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
  },
});
