import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Easing, Keyboard, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';

export default function BillSplitterGame() {
  const [bill, setBill] = useState('');
  const [people, setPeople] = useState('');
  const [result, setResult] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(0));

  const handleSplit = () => {
    Keyboard.dismiss();
    if (bill === '' || people === '' || isNaN(bill) || isNaN(people) || Number(people) <= 0) {
      setResult('Please enter valid numbers.');
      return;
    }

    const splitAmount = (Number(bill) / Number(people)).toFixed(2);
    setResult(`Each person pays ₹${splitAmount}`);

    // Animate result
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>🧾 Bill Splitter Challenge</Text>
      <LottieView
        source={require('../../assets/bill-anim.json')} // Lottie bill animation 
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.subtitle}>Enter bill details below</Text>

      <TextInput
        placeholder="Total Bill Amount ₹"
        style={styles.input}
        keyboardType="numeric"
        value={bill}
        onChangeText={setBill}
      />

      <TextInput
        placeholder="Number of People"
        style={styles.input}
        keyboardType="numeric"
        value={people}
        onChangeText={setPeople}
      />

      <TouchableOpacity style={styles.button} onPress={handleSplit}>
        <Text style={styles.buttonText}>Split Now 🚀</Text>
      </TouchableOpacity>

      {result && (
        <Animated.View style={[styles.resultBox, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.resultText}>{result}</Text>
        </Animated.View>
      )}

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Tip Challenge:</Text>
        <Text style={styles.tipText}>Save ₹50 per meal by skipping cold drinks!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fffdf0', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 15, color: '#34495e' },
  animation: { width: 200, height: 200, marginBottom: 20 },
  input: {
    width: '90%',
    padding: 15,
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    width: '80%',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultBox: {
    backgroundColor: '#e0ffe0',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },
  resultText: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  tipBox: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 15,
    width: '90%',
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  tipTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#4CAF50' },
  tipText: { fontSize: 14, color: '#555' },
});
