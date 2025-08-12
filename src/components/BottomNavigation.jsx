import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize } from '../constants/GlobleStyle';
import HomeIcon from "../assets/Home.svg";
import CategoryIcon from "../assets/Category.svg";
import FinShortIcon from "../assets/finShort.svg";
import AnalyticsIcon from "../assets/Analysis.svg";
import ProfileIcon from "../assets/Profile.svg";

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: <HomeIcon width={30} height={30} /> },
    { id: 'categories', label: 'Categories', icon: <CategoryIcon width={30} height={30} /> },
    { id: 'finShort', label: 'FinShort', icon: <FinShortIcon width={30} height={30} /> },
    { id: 'analytics', label: 'Languages', icon: <AnalyticsIcon width={30} height={30} /> },
    { id: 'profile', label: 'Profile', icon: <ProfileIcon width={30} height={30} /> },
  
  ];

 return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <View style={[
            styles.iconContainer,
            activeTab === tab.id && styles.activeIconContainer
          ]}>
            <View style={[
              styles.icon,
              activeTab === tab.id && styles.activeIcon
            ]}>
              {tab.icon}
            </View>
          </View>
          <Text style={[
            styles.label,
            activeTab === tab.id && styles.activeLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    marginHorizontal: -20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Active tab styling
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  activeIconContainer: {
    backgroundColor: Color.colorMediumseagreen,
  },
  icon: {
    fontSize: 22,
  },
  activeIcon: {
    color: Color.colorWhite,
  },
  label: {
    fontSize: FontSize.size_12,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorDarkslategray100,
    textAlign: 'center',
  },
  activeLabel: {
    color: Color.colorMediumseagreen,
    fontWeight: '600',
  },
});

export default BottomNavigation; 