import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import BottomNavigation from "../../components/BottomNavigation"; // adjust path

// Import all screens
import HomeScreen from "../Home/Home";
import CategoriesScreen from "../../screens/bottomComponents/Category";
import FinShortScreen from "../bottomComponents/FinShort";
import AnalyticsScreen from "../bottomComponents/Analytics";
import ProfileScreen from "../bottomComponents/Profile";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "categories":
        return <CategoriesScreen />;
      case "finShort":
        return <FinShortScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

export default TabNavigation;
