import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';

const expensesData = [
  { id: '1', category: 'Food', amount: 150 },
  { id: '2', category: 'Recharge', amount: 200 },
  { id: '3', category: 'Impulse', amount: 100 },
];

export default function BudgetGame({ navigation }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'game' | 'score'
  const [expenses, setExpenses] = useState([]);
  const weeklyBudget = 5000;

  const handleStartGame = () => {
    setExpenses([]);
    setStep('game');
  };

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = weeklyBudget - totalSpent;

  const handleFinishGame = () => setStep('score');

  const resetGame = () => setStep('intro');

  return (
    <View style={styles.container}>

      {step === 'intro' && (
        <>
          <Text style={styles.title}>Welcome to ₹5000 in 5 Days Challenge</Text>
          <Image source={require('../../assets/piggy.jpg')} style={styles.image} />
          <Text style={styles.info}>Your goal is to manage ₹5000 for 5 days. Try to spend wisely and track your expenses!</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'game' && (
        <>
          <Text style={styles.title}>Track Your Expenses</Text>
          <FlatList
            data={expensesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.expenseButton} onPress={() => handleAddExpense(item)}>
                <Text>{item.category}: ₹{item.amount}</Text>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.status}>Total Spent: ₹{totalSpent}</Text>
          <Text style={styles.status}>Remaining: ₹{remaining}</Text>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinishGame}>
            <Text style={styles.buttonText}>Finish Game</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 'score' && (
        <>
          <Text style={styles.title}>🎉 Game Completed!</Text>
          <Text style={styles.score}>Total Spent: ₹{totalSpent}</Text>
          <Text style={styles.score}>Remaining Balance: ₹{remaining}</Text>

          {remaining >= 0 ? (
            <Text style={styles.resultGood}>✅ Well Done! You managed your budget!</Text>
          ) : (
            <Text style={styles.resultBad}>❌ You overspent! Try Again!</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back to Games</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#2b7a0b' },
  info: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  image: { width: 120, height: 120, marginBottom: 20 },
  expenseButton: { backgroundColor: '#d1ffd6', padding: 15, marginBottom: 10, borderRadius: 10, width: '100%' },
  status: { fontSize: 16, marginVertical: 5, fontWeight: '600' },
  finishButton: { backgroundColor: '#007bff', padding: 15, marginTop: 20, borderRadius: 10, width: '100%' },
  button: { backgroundColor: '#00d084', padding: 15, borderRadius: 10, width: '100%', marginTop: 15 },
  moreButton: { backgroundColor: '#555', padding: 15, borderRadius: 10, width: '100%', marginTop: 15 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
  score: { fontSize: 18, marginBottom: 10, fontWeight: '600' },
  resultGood: { fontSize: 18, color: 'green', fontWeight: 'bold' },
  resultBad: { fontSize: 18, color: 'red', fontWeight: 'bold' },
});
