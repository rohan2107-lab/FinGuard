import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

// Import your SVG components (assuming they exist)
// import Rectangle from "../../../assets/Rectangle.svg";
// import Notification from "../../../assets/notification.svg";
// import Calendar from "../../../assets/calendar.svg";
// import BringBack from "../../../assets/bring-back.svg";

import { Color, Border, Fonts, FontSize } from "../../../constants/GlobleStyle";

const { width: screenWidth } = Dimensions.get('window');

const Budgeting = () => {
  const navigation = useNavigation();

  // Budget State
  const [totalBalance, setTotalBalance] = useState(100000);
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);

  // Modal State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Add Expense Form State
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [message, setMessage] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");

  // Animation
  const [progressAnimation] = useState(new Animated.Value(0));
  const [balanceAnimation] = useState(new Animated.Value(0));

  // Calculate derived values
  const remainingBalance = totalBalance - totalExpense;
  const expensePercentage = totalBalance > 0 ? Math.round((totalExpense / totalBalance) * 100) : 0;

  // Update total expense when expenses array changes
  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpense(total);
  }, [expenses]);

  // Animate progress bar when expense percentage changes
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: expensePercentage / 100,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [expensePercentage]);

  // Animate balance changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(balanceAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(balanceAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalExpense]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const resetForm = () => {
    setAmount("");
    setExpenseAmount("");
    setMessage("");
    setExpenseTitle("");
    setDate(new Date());
  };

  const validateForm = () => {
    if (!expenseTitle.trim()) {
      Alert.alert("Error", "Please enter expense title");
      return false;
    }
    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid expense amount");
      return false;
    }
    if (parseFloat(expenseAmount) > remainingBalance) {
      Alert.alert("Warning", "Expense amount exceeds remaining balance!");
      return false;
    }
    return true;
  };

  const handleSaveExpense = () => {
    if (!validateForm()) return;

    const newExpense = {
      id: Date.now().toString(),
      title: expenseTitle.trim(),
      amount: parseFloat(expenseAmount),
      date: date,
      message: message.trim(),
      timestamp: new Date(),
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    resetForm();
    setShowAddExpenseModal(false);
    
    Alert.alert(
      "Success", 
      `Expense "${newExpense.title}" added successfully!`,
      [{ text: "OK" }]
    );
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setExpenses(prevExpenses => 
              prevExpenses.filter(expense => expense.id !== expenseId)
            );
          }
        }
      ]
    );
  };

  const getProgressColor = () => {
    if (expensePercentage < 50) return Color.colorMediumseagreen;
    if (expensePercentage < 80) return '#FFA500';
    return '#FF4444';
  };

  const getProgressMessage = () => {
    if (expensePercentage < 30) return "Great! You're managing your budget well.";
    if (expensePercentage < 60) return "Good spending pace, keep monitoring.";
    if (expensePercentage < 80) return "Caution: You're approaching your budget limit.";
    return "Warning: You've exceeded recommended spending!";
  };

  const renderExpenseItem = (expense, index) => (
    <Pressable
      key={expense.id}
      style={styles.expenseItem}
      onLongPress={() => handleDeleteExpense(expense.id)}
    >
      <View style={styles.expenseItemContent}>
        <View style={styles.expenseItemLeft}>
          <Text style={styles.expenseItemTitle}>{expense.title}</Text>
          <Text style={styles.expenseItemDate}>
            {expense.date.toLocaleDateString()}
          </Text>
          {expense.message && (
            <Text style={styles.expenseItemMessage} numberOfLines={1}>
              {expense.message}
            </Text>
          )}
        </View>
        <View style={styles.expenseItemRight}>
          <Text style={styles.expenseItemAmount}>
            -{formatCurrency(expense.amount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderAddExpenseModal = () => (
    <Modal
      visible={showAddExpenseModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddExpenseModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable 
            style={styles.modalCloseButton} 
            onPress={() => setShowAddExpenseModal(false)}
          >
            <Text style={styles.modalCloseText}>Cancel</Text>
          </Pressable>
          
          <Text style={styles.modalTitle}>Add Expense</Text>
          
          <Pressable style={styles.modalSaveButton} onPress={handleSaveExpense}>
            <Text style={styles.modalSaveText}>Save</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Expense Title Field */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Expense Title *</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                value={expenseTitle}
                onChangeText={setExpenseTitle}
                placeholder="e.g., Groceries, Fuel, etc."
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Date Field */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Date</Text>
            <Pressable 
              onPress={() => setShowDatePicker(true)} 
              style={styles.inputField}
            >
              <Text style={styles.inputText}>{formatDate(date)}</Text>
              <View style={styles.calendarIconContainer}>
                <Text style={styles.calendarIcon}>📅</Text>
              </View>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Amount Field */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Budget Amount</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Rs. 100000"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Expense Amount Field */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Expense Amount *</Text>
            <View style={styles.inputField}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                placeholder="Rs. 5000"
                placeholderTextColor="#666"
              />
            </View>
            <Text style={styles.fieldHint}>
              Remaining Balance: {formatCurrency(remainingBalance)}
            </Text>
          </View>

          {/* Message Field */}
          <View style={styles.messageFieldWrapper}>
            <Text style={styles.fieldLabel}>Notes (Optional)</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Add notes about this expense..."
              placeholderTextColor="#4ade80"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Smart Budgeting</Text>
        <View style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Cards */}
        <Animated.View 
          style={[
            styles.balanceRow,
            {
              transform: [{
                scale: balanceAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                })
              }]
            }
          ]}
        >
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>{formatCurrency(totalBalance)}</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={styles.expenseValue}>-{formatCurrency(totalExpense)}</Text>
            <Text style={styles.remainingBalance}>
              Remaining: {formatCurrency(remainingBalance)}
            </Text>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={[styles.progressPercent, { color: getProgressColor() }]}>
            {expensePercentage}%
          </Text>
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: getProgressColor(),
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }
              ]} 
            />
          </View>
          <Text style={styles.progressValue}>
            {formatCurrency(totalExpense)}
          </Text>
        </View>

        <View style={styles.progressDescRow}>
          <Text style={styles.progressDesc}>{getProgressMessage()}</Text>
        </View>

        {/* Recent Expenses */}
        <View style={styles.expenseSection}>
          <View style={styles.expenseSectionHeader}>
            <Text style={styles.expenseSectionTitle}>
              Recent Expenses ({expenses.length})
            </Text>
            {expenses.length > 0 && (
              <Pressable 
                style={styles.clearAllButton}
                onPress={() => {
                  Alert.alert(
                    "Clear All Expenses",
                    "Are you sure you want to clear all expenses?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Clear All", 
                        style: "destructive",
                        onPress: () => setExpenses([])
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.expenseList}>
            {expenses.length > 0 ? (
              expenses.slice(0, 5).map((expense, index) => renderExpenseItem(expense, index))
            ) : (
              <View style={styles.noExpensesContainer}>
                <Text style={styles.noExpensesText}>No expenses added yet</Text>
                <Text style={styles.noExpensesSubtext}>
                  Tap "Add Expense" to start tracking your spending
                </Text>
              </View>
            )}
            
            {expenses.length > 5 && (
              <Pressable style={styles.expenseItemRow}>
                <Text style={styles.expenseItemText}>
                  View All ({expenses.length} expenses)
                </Text>
                <Text style={styles.moreArrow}>{'>'}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Pressable 
            style={styles.actionBtn}
            onPress={() => setShowAddExpenseModal(true)}
          >
            <Text style={styles.actionBtnText}>+ Add Expense</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.actionBtn, styles.secondaryBtn]}
            onPress={() => {
              Alert.alert(
                "Add Income",
                "Enter additional income amount:",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Add",
                    onPress: () => {
                      // You can implement income addition here
                      Alert.alert("Feature", "Income addition feature can be implemented here");
                    }
                  }
                ]
              );
            }}
          >
            <Text style={[styles.actionBtnText, styles.secondaryBtnText]}>
              💰 Add Income
            </Text>
          </Pressable>
        </View>

        {/* Budget Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Budget Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Daily Average Expense:</Text>
            <Text style={styles.summaryValue}>
              {expenses.length > 0 
                ? formatCurrency(Math.round(totalExpense / Math.max(expenses.length, 1)))
                : formatCurrency(0)
              }
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Days Until Budget Exhausted:</Text>
            <Text style={styles.summaryValue}>
              {remainingBalance > 0 && expenses.length > 0
                ? `${Math.round(remainingBalance / (totalExpense / expenses.length))} days`
                : '∞'
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Expense Modal */}
      {renderAddExpenseModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Color.colorMediumseagreen,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: Color.colorWhite,
  },
  headerTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 20,
    color: Color.colorDarkslategray100,
    fontWeight: '600',
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Color.colorHoneydew200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 18,
    paddingTop: 0,
    backgroundColor: Color.colorHoneydew200,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -20,
    minHeight: 700,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 40,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: Color.colorWhite,
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  balanceLabel: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 13,
    color: Color.colorGray,
    marginBottom: 6,
  },
  balanceValue: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 20,
    color: Color.colorDarkslategray100,
    fontWeight: '700',
  },
  expenseValue: {
    fontFamily: Fonts.poppinsBold,
    fontSize: 20,
    color: Color.colorRoyalblue,
    fontWeight: '700',
  },
  remainingBalance: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 11,
    color: Color.colorGray,
    marginTop: 4,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  progressPercent: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 13,
    backgroundColor: Color.colorWhite,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    fontWeight: '600',
  },
  progressBarBg: {
    flex: 1,
    height: 14,
    backgroundColor: Color.colorWhite,
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  progressValue: {
    fontFamily: Fonts.poppinsMediumItalic,
    fontSize: 13,
    color: Color.colorGray,
    fontWeight: '500',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  progressDescRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  progressDesc: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 15,
    color: Color.colorGray,
    marginLeft: 2,
    textAlign: 'center',
    flex: 1,
  },
  expenseSection: {
    marginBottom: 18,
  },
  expenseSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expenseSectionTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 16,
    color: Color.colorDarkslategray100,
    fontWeight: '600',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#FFE5E5',
  },
  clearAllText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 12,
    color: '#FF4444',
    fontWeight: '500',
  },
  expenseList: {
    marginBottom: 18,
  },
  expenseItem: {
    backgroundColor: Color.colorWhite,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  expenseItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseItemLeft: {
    flex: 1,
  },
  expenseItemTitle: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 15,
    color: Color.colorDarkslategray100,
    fontWeight: '500',
  },
  expenseItemDate: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 12,
    color: Color.colorGray,
    marginTop: 2,
  },
  expenseItemMessage: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 12,
    color: Color.colorGray,
    marginTop: 2,
    fontStyle: 'italic',
  },
  expenseItemRight: {
    alignItems: 'flex-end',
  },
  expenseItemAmount: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 14,
    color: Color.colorRoyalblue,
    fontWeight: '600',
  },
  expenseItemRow: {
    backgroundColor: Color.colorHoneydew200,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expenseItemText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 15,
    color: Color.colorDarkslategray100,
    fontWeight: '500',
  },
  moreArrow: {
    fontSize: 18,
    color: Color.colorGray,
    marginLeft: 8,
  },
  noExpensesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noExpensesText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 16,
    color: Color.colorGray,
    fontWeight: '500',
  },
  noExpensesSubtext: {
    fontFamily: Fonts.poppinsRegular,
    fontSize: 14,
    color: Color.colorGray,
    textAlign: 'center',
    marginTop: 8,
  },
  actionButtonsContainer: {
    marginBottom: 20,
  },
  actionBtn: {
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  secondaryBtn: {
    backgroundColor: Color.colorWhite,
    borderWidth: 2,
    borderColor: Color.colorMediumseagreen,
  },
  actionBtnText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 15,
    color: Color.colorWhite,
    fontWeight: '600',
  },
  secondaryBtnText: {
    color: Color.colorMediumseagreen,
  },
  summaryCard: {
    backgroundColor: Color.colorWhite,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  summaryTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 16,
    color: Color.colorDarkslategray100,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 14,
    color: Color.colorGray,
    flex: 1,
  },
  summaryValue: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 14,
    color: Color.colorDarkslategray100,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Color.colorHoneydew200,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Color.colorMediumseagreen,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalCloseText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 16,
    color: Color.colorWhite,
    fontWeight: '500',
  },
  modalTitle: {
    fontFamily: Fonts.poppinsSemiBold,
    fontSize: 18,
    color: Color.colorDarkslategray100,
    fontWeight: '600',
  },
  modalSaveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Color.colorWhite,
    borderRadius: 12,
  },
  modalSaveText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 16,
    color: Color.colorMediumseagreen,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray,
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 12,
    fontFamily: Fonts.poppinsRegular,
    color: Color.colorGray,
    marginTop: 4,
  },
  inputField: {
    backgroundColor: Color.colorHoneydew,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
  },
  inputText: {
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray,
    flex: 1,
  },
  textInput: {
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray,
    flex: 1,
    padding: 0,
  },
  calendarIconContainer: {
    width: 28,
    height: 28,
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    fontSize: 14,
  },
  messageFieldWrapper: {
    marginBottom: 20,
  },
  messageInput: {
    backgroundColor: Color.colorHoneydew,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: Fonts.poppinsMedium,
    color: Color.colorDarkslategray,
    textAlignVertical: 'top',
    minHeight: 100,
  },
});

export default Budgeting;