import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SIPTutorial() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🌱 SIPs (Systematic Investment Plans)</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Learn how to grow your wealth gradually through Systematic Investment Plans.
          We’ll cover how SIPs work, benefits, risks, and how to get started.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F5', // soft green-tinted background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2ECC71', // green theme for investments
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
