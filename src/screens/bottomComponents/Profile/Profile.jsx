import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const Profile = () => {
  const [notifications, setNotifications] = useState(3);
  const [user] = useState({
    name: "Alex Johnson",
    id: "25030024",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const menuItems = [
    {
      id: 'edit',
      icon: '👤',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      backgroundColor: '#3B82F6',
      action: () => navigation.navigate('EditProfile')
      
    },
    {
      id: 'security',
      icon: '🛡️',
      title: 'Security',
      subtitle: 'Password and privacy settings',
      backgroundColor: '#10B981',
      action: () => navigation.navigate('Security')
    },
    {
      id: 'settings',
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'App preferences and configuration',
      backgroundColor: '#8B5CF6',
      action: () => navigation.navigate('Settings')
    },
    {
      id: 'help',
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      backgroundColor: '#F59E0B',
      action: () => navigation.navigate('HelpAndSupport')
    },
    {
      id: 'logout',
      icon: '🚪',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      backgroundColor: '#EF4444',
      action: () => Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') }
      ])
    }
  ];
  const navigation = useNavigation();

  const handleNotificationPress = () => {
    setNotifications(0);
    Alert.alert('Notifications', 'All notifications marked as read');
  };

  const handleBackPress = () => {
    navigation.navigate('Home'); // Replace with your actual previous screen name
    Alert.alert('Back', 'Navigate back to previous screen');
  };

  const handleEditAvatar = () => {
    Alert.alert('Edit Avatar', 'Choose photo from gallery or camera', [
      { text: 'Camera', onPress: () => console.log('Open camera') },
      { text: 'Gallery', onPress: () => console.log('Open gallery') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* Background Decorative Circles */}
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
        
        {/* Header Navigation */}
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable 
              style={styles.headerButton} 
              onPress={handleBackPress}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 25 }}
            >
              <Text style={styles.backIcon} onPress={() => navigation.navigate("Home")}>←</Text>
            </Pressable>
            
            <Text style={styles.headerTitle}>Profile</Text>
            
            <Pressable 
              style={styles.notificationButton} 
              onPress={handleNotificationPress}
              android_ripple={{ color: 'rgba(0,0,0,0.1)', radius: 20 }}
            >
              <Text style={styles.notificationIcon}>🔔</Text>
              {notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{notifications}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Avatar Section - Overlapping */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  style={styles.avatar}
                  source={{ uri: user.avatar }}
                  resizeMode="cover"
                />
              </View>
              <Pressable 
                style={styles.editAvatarButton} 
                onPress={handleEditAvatar}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 15 }}
              >
                <Text style={styles.editAvatarIcon}>📷</Text>
              </Pressable>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{user.name}</Text>
              <Pressable style={styles.editNameButton}>
                <Text style={styles.editIcon}>✏️</Text>
              </Pressable>
            </View>
            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>ID: </Text>
              <View style={styles.idBadge}>
                <Text style={styles.idNumber}>{user.id}</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.menuItem,
                  { 
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.9 : 1 
                  }
                ]}
                onPress={item.action}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIcon, { backgroundColor: item.backgroundColor }]}>
                    <Text style={styles.menuIconText}>{item.icon}</Text>
                  </View>
                  
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  
                  <Text style={styles.chevron}>›</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSection: {
    backgroundColor: '#059669',
    paddingBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
  },
  circle1: {
    width: 120,
    height: 120,
    top: 20,
    left: -30,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 40,
    right: 20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: 20,
    left: width * 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  headerButton: {
    padding: 10,
    borderRadius: 25,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 40,
    minHeight: height * 0.8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 4,
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: '#E5E7EB',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: -5,
    backgroundColor: '#10B981',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  editAvatarIcon: {
    fontSize: 16,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  editNameButton: {
    marginLeft: 10,
    padding: 5,
  },
  editIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  idLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  idBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  idNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  chevron: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Profile;