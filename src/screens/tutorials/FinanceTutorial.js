import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FinanceTutorial() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>💵 Finance Basics</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          This tutorial will guide you through the essentials of personal finance —
          budgeting, saving, investing, and more. Stay tuned for in-depth lessons!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', // light, calm background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#4A90E2', // blue theme for finance
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
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
