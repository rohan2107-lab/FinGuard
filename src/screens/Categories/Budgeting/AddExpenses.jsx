import React, { useState } from "react";
import {
  StyleSheet, View, Text, Pressable, TextInput, Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import Rectangle from "../../../assets/Rectangle.svg";
import Notification from "../../../assets/notification.svg";
import Calendar from "../../../assets/calendar.svg";
import BringBack from "../../../assets/bring-back.svg";

import { Color, Border, Fonts, FontSize } from "../../../constants/GlobleStyle";

const AddExpenses = () => {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState("100000");
  const [expenses, setExpenses] = useState("30000");
  const [message, setMessage] = useState("");

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainView}>
        
        {/* Green Header Background */}
        <View style={styles.headerBackground}>
          {/* Header Content */}
          <View style={styles.headerContent}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <BringBack width={24} height={20} />
            </Pressable>
            
            <Text style={styles.headerTitle}>Add Expenses</Text>
            
            <View style={styles.notificationButton}>
              <Notification width={20} height={20} />
            </View>
          </View>
        </View>

        {/* White Content Background */}
        <View style={styles.contentBackground}>
          <View style={styles.formContainer}>
            
            {/* Date Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Pressable onPress={() => setShowDatePicker(true)} style={styles.inputField}>
                <Text style={styles.inputText}>{formatDate(date)}</Text>
                <View style={styles.calendarIconContainer}>
                  <Calendar width={16} height={16} />
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
              <Text style={styles.fieldLabel}>Amount</Text>
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

            {/* Expenses Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.fieldLabel}>Expenses</Text>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={expenses}
                  onChangeText={setExpenses}
                  placeholder="Rs. 30000"
                  placeholderTextColor="#666"
                />
              </View>
            </View>

            {/* Message Field */}
            <View style={styles.messageFieldWrapper}>
              <TextInput
                style={styles.messageInput}
                placeholder="Enter Message"
                placeholderTextColor="#4ade80"
                multiline={true}
                numberOfLines={8}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>

          </View>

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <Pressable style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  mainView: {
    flex: 1,
  },
  headerBackground: {
    backgroundColor: Color.colorMediumseagreen,
    paddingTop: 10,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray,
    textAlign: 'center',
  },
  notificationButton: {
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBackground: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    marginTop: -30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  messageFieldWrapper: {
    flex: 1,
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
    minHeight: 120,
    flex: 1,
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 14,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.poppinsSemiBold,
    color: Color.colorDarkslategray,
  },
});

export default AddExpenses;