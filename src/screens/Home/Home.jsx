import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../../components/BottomNavigation';
import { Color, FontFamily, FontSize } from '../../constants/GlobleStyle';
import { useNavigation } from '@react-navigation/native';
import TipModal from '../../components/TipModal';
import ChatbotBubble from '../../components/ChatbotBubble';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigation = useNavigation();
  const [showTipModal, setShowTipModal] = useState(false);
  const userName = 'Rohan'; // dono line tips of the day ke liye hai.....

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const features = [
    {
      id: 1,
      title: 'Budgeting',
      icon: '💰',
      color: Color.colorDeepskyblue,
    },
    {
      id: 2,
      title: 'Fraud\nSimulation',
      icon: '🔐',
      color: Color.colorDeepskyblue,
    },
    {
      id: 3,
      title: 'Goal\nTracker',
      icon: '⏰',
      color: Color.colorDeepskyblue,
    },
    {
      id: 4,
      title: 'Games',
      icon: '🎮',
      color: Color.colorDeepskyblue,
    },
    {
      id: 5,
      title: 'Financial\nCalculators',
      icon: '🧮',
      color: Color.colorDeepskyblue,
    },
    {
      id: 6,
      title: 'More',
      icon: '➕',
      color: Color.colorDeepskyblue,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section with Green Background */}
      <View style={styles.topSection}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, Dear Rohan</Text>
            <Text style={styles.subGreeting}>Good Morning</Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statLabel}>Today's Earn</Text>
            <Text style={styles.statValue}>00000</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statLabel}>Total Rewards</Text>
            <Text style={styles.statValue}>00000</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Pressable style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </Pressable>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={Color.colorGray}
            />
            <Pressable style={styles.profileButton}>
              <Text style={styles.profileIcon}>👤</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <Pressable
              key={feature.id}
              style={styles.featureCard}
              onPress={() => {
                if (feature.title === 'Budgeting') {
                  navigation.navigate('Budgeting');
                }
              }}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: feature.color }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </Pressable>
          ))}
        </View>

        {/* Tips of the Day */}
<Pressable style={styles.tipsCard} onPress={() => setShowTipModal(true)}>
  <Text style={styles.tipsTitle}>Tips of the Day</Text>
  <Text style={styles.tipsArrow}>→</Text>
</Pressable>
<TipModal visible={showTipModal} onClose={() => setShowTipModal(false)} userName={userName} />
      </View>
<ChatbotBubble/>
      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorMediumseagreen,
  },
  topSection: {
    backgroundColor: Color.colorMediumseagreen,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize.size_18,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.colorGray200,
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: FontSize.size_12,
    fontFamily: FontFamily.leagueSpartanRegular,
    color: Color.colorGray200,
  },
  notificationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Color.colorHoneydew,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Color.colorHoneydew,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: Color.colorWhite,
    marginHorizontal: 8,
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FontSize.size_10,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorDarkslategray,
    textAlign: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSize.size_10,
    fontFamily: FontFamily.poppinsRegular,
    color: Color.colorDarkslategray,
    textAlign: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: Color.colorHoneydew,
    borderRadius: 15,
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.colorGhostwhite,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '90%',
  },
  menuButton: {
    marginRight: 8,
  },
  menuIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.size_14,
    fontFamily: FontFamily.robotoRegular,
    color: Color.colorGray100,
    textAlign: 'center',
  },
  profileButton: {
    marginLeft: 8,
  },
  profileIcon: {
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    backgroundColor: Color.colorHoneydew,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: FontSize.size_12,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorDarkslategray,
    textAlign: 'center',
    lineHeight: 14,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Color.colorDeepskyblue,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tipsTitle: {
    fontSize: FontSize.size_18,
    fontFamily: FontFamily.poppinsMedium,
    color: Color.colorBlack,
    fontWeight: '500',
  },
  tipsArrow: {
    fontSize: 18,
    color: Color.colorBlack,
  },
});

export default Home;
