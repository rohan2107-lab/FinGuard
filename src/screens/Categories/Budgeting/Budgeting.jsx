import * as React from "react";
import { StyleSheet, Text, View, Pressable, SafeAreaView, ScrollView } from "react-native";
import { Color, FontSize, Fonts, Border } from "../../../constants/GlobleStyle";
import { useNavigation } from "@react-navigation/native";

const Budgeting = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Budgeting</Text>
        <View style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View style={styles.balanceRow}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>Rs. 100000</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Expense</Text>
            <Text style={styles.expenseValue}>-Rs. 30000</Text>
          </View>
        </View>
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressPercent}>30%</Text>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressValue}>$20,000.00</Text>
        </View>
        <View style={styles.progressDescRow}>
          <Text style={styles.progressDesc}>30% Of Your Expenses, Looks Good.</Text>
        </View>
        {/* Expense Titles */}
        <View style={styles.expenseList}>
          {[1,2,3,4,5].map((i) => (
            <View style={styles.expenseItem} key={i}>
              <Text style={styles.expenseItemText}>Title 01</Text>
            </View>
          ))}
          <Pressable style={styles.expenseItemRow}>
            <Text style={styles.expenseItemText}>More</Text>
            <Text style={styles.moreArrow}>{'>'}</Text>
          </Pressable>
        </View>
        {/* Buttons */}
        <Pressable style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Watch Videos</Text>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Add Expenses</Text>
        </Pressable>
      </ScrollView>
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
    marginTop: 40, // Increased from 10 to 40 for more space below header
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
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  progressPercent: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 13,
    color: Color.colorGray,
    backgroundColor: Color.colorWhite,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
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
    width: '30%',
    height: '100%',
    backgroundColor: Color.colorGray,
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
  },
  expenseList: {
    marginBottom: 18,
  },
  expenseItem: {
    backgroundColor: Color.colorHoneydew200,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
    alignItems: 'flex-start',
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
  actionBtn: {
    backgroundColor: Color.colorMediumseagreen,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 40,
  },
  actionBtnText: {
    fontFamily: Fonts.poppinsMedium,
    fontSize: 15,
    color: Color.colorWhite,
    fontWeight: '600',
  },
});

export default Budgeting;
    		