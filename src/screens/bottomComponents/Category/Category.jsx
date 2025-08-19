import * as React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, FontFamily, FontSize } from "./../../../constants/GlobleStyle";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../../../contexts/LanguageContext";
import translations from "../../../utils/translations";

import TabNavigation from "../TabNavigation";

// Importing EmergencyHelp component
import EmergencyHelp from "../../Categories/Emergency/EmergencyHelp";  

const Category = () => {
  const navigation = useNavigation();
  const { currentLanguage, getLocalizedText } = useLanguage();
  
  // Get category translations
  const getCategoryName = (englishName) => {
    const categoryTranslations = {
      "Budgeting": {
        english: "Budgeting",
        hindi: "बजटिंग",
        punjabi: "ਬਜਟਿੰਗ"
      },
      "Games": {
        english: "Financial Games",
        hindi: "वित्तीय खेल",
        punjabi: "ਵਿੱਤੀ ਖੇਡਾਂ"
      },
      "Goal Tracker": {
        english: "Goal Tracker",
        hindi: "लक्ष्य ट्रैकर",
        punjabi: "ਟੀਚਾ ਟਰੈਕਰ"
      },
      "Gifts": {
        english: "Gifts & Rewards",
        hindi: "उपहार और पुरस्कार",
        punjabi: "ਤੋਹਫ਼ੇ ਅਤੇ ਇਨਾਮ"
      },
      "Fraud Simulation": {
        english: "Fraud Protection",
        hindi: "धोखाधड़ी सुरक्षा",
        punjabi: "ਧੋਖਾਧੜੀ ਸੁਰੱਖਿਆ"
      },
      "Financial Calculators": {
        english: "Calculator",
        hindi: "कैलकुलेटर",
        punjabi: "ਕੈਲਕੁਲੇਟਰ"
      },
      "Investment Basics": {
        english: "Investment",
        hindi: "निवेश",
        punjabi: "ਨਿਵੇਸ਼"
      },
      "Emergency Help": {
        english: "Emergency",
        hindi: "आपातकालीन",
        punjabi: "ਐਮਰਜੈਂਸੀ"
      }
    };
    
    return categoryTranslations[englishName][currentLanguage] || englishName;
  };

  const categories = [
    { id: 1, name: "Budgeting", displayName: getCategoryName("Budgeting"), icon: "💰" },
    { id: 2, name: "Games", displayName: getCategoryName("Games"), icon: "🎮" },
    { id: 3, name: "Goal Tracker", displayName: getCategoryName("Goal Tracker"), icon: "🎯" },
    { id: 4, name: "Gifts", displayName: getCategoryName("Gifts"), icon: "🎁" },
    { id: 5, name: "Fraud Simulation", displayName: getCategoryName("Fraud Simulation"), icon: "🛡️" },
    { id: 6, name: "Financial Calculators", displayName: getCategoryName("Financial Calculators"), icon: "🧮" },
    { id: 7, name: "Investment Basics", displayName: getCategoryName("Investment Basics"), icon: "📈" },
    { id: 8, name: "Emergency Help", displayName: getCategoryName("Emergency Help"), icon: "🚨" },
  ];


  const handleCategoryPress = (categoryName) => {
  switch (categoryName) {
    case "Emergency Help":
      navigation.navigate("EmergencyHelp");
      break;
    case "Games":
      navigation.navigate("Games");
      break;
    case "Goal Tracker":
      navigation.navigate("GoalTracker");
      break;
    case "Gifts":
      navigation.navigate("Gifts");
      break;
    case "Fraud Simulation":
      navigation.navigate("FraudSimulation");
      break;
    case "Financial Calculators":
      navigation.navigate("FinancialCalculator");
      break;
    case "Investment Basics":
      navigation.navigate("InvestmentBasics");
      break;
    case "Budgeting":
      navigation.navigate("Budgeting")
      break;
    default:
      break;
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
<View style={styles.header}>
  <TouchableOpacity 
    style={styles.backButton}  
    onPress={() => navigation.navigate("TabNaviagtion", { screen: "Home" })} // 👈 fixed
  >
    <Text style={styles.backIcon}>←</Text>
  </TouchableOpacity>

  <Text style={styles.title}>
    {translations.categories[currentLanguage]?.categories || "Categories"}
  </Text>

  <TouchableOpacity style={styles.notificationButton}>
    <Text style={styles.notificationIcon}>🔔</Text>
  </TouchableOpacity>
</View>


        {/* Rewards Section */}
        <View style={styles.rewardsContainer}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>⭐</Text>
            <Text style={styles.rewardLabel}>Today's Earn</Text>
            <Text style={styles.rewardValue}>00000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>⭐</Text>
            <Text style={styles.rewardLabel}>Total Rewards</Text>
            <Text style={styles.rewardValue}>00000</Text>
          </View>
        </View>

         {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.name)}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.iconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.displayName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen || '#00d09e',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(224, 204, 204, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: Color.colorDarkslategray200 || '#2F4F4F',
    fontWeight: 'bold',
  },
  title: {
    fontSize: FontSize?.size_20 || 20,
    fontFamily: FontFamily?.poppinsSemiBold || 'System',
    fontWeight: '600',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    textTransform: 'capitalize',
  },
  notificationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Color.colorHoneydew || '#F0FFF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 16,
  },
  rewardsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  rewardItem: {
    flex: 1,
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  rewardLabel: {
    fontSize: FontSize?.size_12 || 12,
    fontFamily: FontFamily?.poppinsRegular || 'System',
    color: Color.colorDarkslategray200 || '#2F4F4F',
    textAlign: 'center',
    marginBottom: 5,
  },
  rewardValue: {
    fontSize: FontSize?.size_12 || 12,
    fontFamily: FontFamily?.poppinsRegular || 'System',
    color: Color.colorWhite || '#FFFFFF',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 35,
    backgroundColor: Color.colorHoneydew || '#F0FFF0',
    marginHorizontal: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Color.colorDeepskyblue || '#00BFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: FontSize?.size_15 || 14,
    fontFamily: FontFamily?.poppinsMedium || 'System',
    fontWeight: '500',
    color: Color.colorDarkslategray200 || '#0a4747ff',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

export default Category;