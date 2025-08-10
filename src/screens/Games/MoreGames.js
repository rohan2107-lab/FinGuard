import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function MoreGames({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>More Game</Text>

      <TouchableOpacity style={styles.gameCard} onPress={() => navigation.navigate('BudgetPlannerGame')}>
        <Image source={require('../../assets/new.png')} style={styles.gameImage} />
        <Text style={styles.gameText}>Budget Planner Puzzle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gameCard} onPress={() => navigation.navigate('ScamQuizGame')}>
        <Image source={require('../../assets/new.png')} style={styles.gameImage} />
        <Text style={styles.gameText}>ATM & Scam Safety Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gameCard} onPress={() => navigation.navigate('CreditScoreClimber')}>
        <Image source={require('../../assets/new.png')} style={styles.gameImage} />
        <Text style={styles.gameText}>Credit Score Climber</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.gameCard} onPress={() => navigation.navigate('ExpenseGuessGame')}>
        <Image source={require('../../assets/new.png')} style={styles.gameImage} />
        <Text style={styles.gameText}>Daily Expense Guess</Text>
      </TouchableOpacity>

      {/* You can add more games here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f2fcff', alignItems: 'center', paddingTop: 50, paddingBottom: 30 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#e5f9ff',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  gameImage: { width: 70, height: 70, marginRight: 15 },
  gameText: { fontSize: 18, fontWeight: '600', color: '#222' },
});
