import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaxTutorial() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🧾 Tax Guide</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Get a clear understanding of taxes, deductions, and filing processes. 
          We’ll break down complex tax concepts into easy-to-follow guides 
          to help you save money and stay compliant.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5E6', // soft orange background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#E67E22', // warm orange theme for tax
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
    color: '#FFEBD1',
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
