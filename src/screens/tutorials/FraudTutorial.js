import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FraudTutorial() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🔒 Fraud Awareness</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Learn how to protect yourself from scams and fraudulent activities. 
          We’ll cover common tactics, warning signs, and safety measures 
          to keep your finances secure.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDEDEC', // light red-tinted background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#E74C3C', // strong red for alert/security
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
    color: '#F9E6E6',
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
