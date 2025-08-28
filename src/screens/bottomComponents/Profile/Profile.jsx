import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../../contexts/LanguageContext';
import translations from '../../../utils/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appAxios } from "../../../api/apiconfig";

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState({
    name: "",
    id: "",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  
  const { currentLanguage } = useLanguage();
  const navigation = useNavigation();
  const profileText = translations.profile[currentLanguage] || translations.profile.english;
  const commonText = translations.common[currentLanguage] || translations.common.english;

  // Fetch user profile data
  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 10000
      } : { timeout: 10000 };

      const response = await appAxios.get('/api/auth/me', config);
      console.log("Profile API Response:", response.data);

      const apiData = response.data;
      if (!apiData?.success) {
        throw new Error(apiData?.message || 'Failed to fetch profile');
      }

      const profile = apiData.data;
      
      // Update user state with fetched data
      setUser(prevUser => ({
        ...prevUser,
        name: profile?.fullName || 'Guest User',
        id: profile?.id || profile?.userId || '00000000', // Try different possible ID fields
        // Keep existing avatar or use profile avatar if available
        avatar: profile?.avatar || profile?.profileImage || prevUser.avatar
      }));

    } catch (err) {
      console.error("Error fetching profile:", err.message);
      // Set fallback values on error
      setUser(prevUser => ({
        ...prevUser,
        name: 'Guest User',
        id: '00000000'
      }));
      
      // Show error alert if needed
      Alert.alert(
        'Error',
        'Unable to fetch profile data. Please check your connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // ✅ Logout Handler
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); // clear stored session/token
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }], // 👈 replace with your login screen route name
      });
    } catch (e) {
      console.error('Error clearing token:', e);
    }
  };

  // Menu items with translations
  const getMenuItems = () => {
    const menuTranslations = {
      edit: {
        title: {
          english: 'Edit Profile',
          hindi: 'प्रोफाइल संपादित करें',
          punjabi: 'ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ'
        },
        subtitle: {
          english: 'Update your personal information',
          hindi: 'अपनी व्यक्तिगत जानकारी अपडेट करें',
          punjabi: 'ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਅਪਡੇਟ ਕਰੋ'
        }
      },
      security: {
        title: {
          english: 'Security',
          hindi: 'सुरक्षा',
          punjabi: 'ਸੁਰੱਖਿਆ'
        },
        subtitle: {
          english: 'Password and privacy settings',
          hindi: 'पासवर्ड और गोपनीयता सेटिंग्स',
          punjabi: 'ਪਾਸਵਰਡ ਅਤੇ ਪਰਾਈਵੇਸ਼ੀ ਸੈਟਿੰਗਾਂ'
        }
      },
      settings: {
        title: {
          english: 'Settings',
          hindi: 'सेटिंग्स',
          punjabi: 'ਸੈਟਿੰਗਾਂ'
        },
        subtitle: {
          english: 'App preferences and configuration',
          hindi: 'ऐप प्राथमिकताएँ और कॉन्फ़िगरेशन',
          punjabi: 'ਐਪ ਪਸੰਦਾਂ ਅਤੇ ਕੌਨਫਿਗਰੇਸ਼ਨ'
        }
      },
      help: {
        title: {
          english: 'Help & Support',
          hindi: 'सहायता और समर्थन',
          punjabi: 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ'
        },
        subtitle: {
          english: 'Get help and contact support',
          hindi: 'सहायता प्राप्त करें और समर्थन से संपर्क करें',
          punjabi: 'ਮਦਦ ਪ੍ਰਾਪਤ ਕਰੋ ਅਤੇ ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ'
        }
      },
      logout: {
        title: {
          english: 'Logout',
          hindi: 'लॉग आउट',
          punjabi: 'ਲੌਗ ਆਊਟ'
        },
        subtitle: {
          english: 'Sign out of your account',
          hindi: 'अपने खाते से साइन आउट करें',
          punjabi: 'ਆਪਣੇ ਖਾਤੇ ਤੋਂ ਸਾਈਨ ਆਊਟ ਕਰੋ'
        }
      }
    };

    return [
      {
        id: 'edit',
        icon: '👤',
        title: menuTranslations.edit.title[currentLanguage] || menuTranslations.edit.title.english,
        subtitle: menuTranslations.edit.subtitle[currentLanguage] || menuTranslations.edit.subtitle.english,
        backgroundColor: '#3B82F6',
        action: () => navigation.navigate('EditProfile')
      },

      {
        id: 'help',
        icon: '❓',
        title: menuTranslations.help.title[currentLanguage] || menuTranslations.help.title.english,
        subtitle: menuTranslations.help.subtitle[currentLanguage] || menuTranslations.help.subtitle.english,
        backgroundColor: '#F59E0B',
        action: () => navigation.navigate('HelpAndSupport')
      },
      {
        id: 'logout',
        icon: '🚪',
        title: menuTranslations.logout.title[currentLanguage] || menuTranslations.logout.title.english,
        subtitle: menuTranslations.logout.subtitle[currentLanguage] || menuTranslations.logout.subtitle.english,
        backgroundColor: '#EF4444',
        action: () => 
          Alert.alert(
            menuTranslations.logout.title[currentLanguage] || menuTranslations.logout.title.english,
            currentLanguage === 'hindi'
              ? 'क्या आप लॉग आउट करना चाहते हैं?'
              : currentLanguage === 'punjabi'
              ? 'ਕੀ ਤੁਸੀਂ ਲੌਗ ਆਊਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?'
              : 'Are you sure you want to logout?',
            [
              { text: commonText.cancel, style: 'cancel' },
              {
                text: menuTranslations.logout.title[currentLanguage] || menuTranslations.logout.title.english,
                style: 'destructive',
                onPress: handleLogout, // 👈 actual logout
              },
            ]
          )
      },
    ];
  };
  
  const menuItems = getMenuItems();

  const handleNotificationPress = () => {
    setNotifications(0);
    Alert.alert('Notifications', 'All notifications marked as read');
  };

  const handleBackPress = () => {
    navigation.navigate('Home') // Replace with your actual previous screen name
  };

  const handleEditAvatar = () => {
    Alert.alert('Edit Avatar', 'Choose photo from gallery or camera', [
      { text: 'Camera', onPress: () => console.log('Open camera') },
      { text: 'Gallery', onPress: () => console.log('Open gallery') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleRefresh = () => {
    fetchUserProfile();
  };

  // Show loading screen while fetching data
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="#059669" />
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.loadingText}>
          {currentLanguage === 'hindi' ? 'लोड हो रहा है...' :
           currentLanguage === 'punjabi' ? 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...' : 'Loading...'}
        </Text>
      </View>
    );
  }

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
              {/* <Text style={styles.backIcon}>←</Text> */}
            </Pressable>
            
            <Text style={styles.headerTitle}>Profile</Text>
            
            <View style={styles.headerButtonsContainer}>
              {/* Refresh Button */}
              <Pressable 
                style={[styles.headerButton, { marginRight: 10 }]} 
                onPress={handleRefresh}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 20 }}
              >
                <Text style={styles.refreshIcon}>🔄</Text>
              </Pressable>
              
              {/* <Pressable 
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
              </Pressable> */}
            </View>
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
                  source={require('../../../assets/rohang.jpg')}
                  resizeMode="cover"
                />
                {/* Loading overlay for profile refresh */}
                {profileLoading && (
                  <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                )}
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
                <Text style={styles.editIcon}></Text>
              </Pressable>
            </View>
            <View style={styles.idContainer}>
              <Text style={styles.idLabel}>ID: </Text>
              <View style={styles.idBadge}>
                <Text style={styles.idNumber}>{user.id}</Text>
              </View>
            </View>
            
            {/* Profile loading indicator */}
            {profileLoading && (
              <View style={styles.profileLoadingContainer}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={styles.profileLoadingText}>
                  {currentLanguage === 'hindi' ? 'अपडेट हो रहा है...' :
                   currentLanguage === 'punjabi' ? 'ਅਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...' : 'Updating...'}
                </Text>
              </View>
            )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  headerSection: {
    backgroundColor: '#059669',
    paddingBottom: 5,
    position: 'relative',
    overflow: 'hidden',
    paddingTop: -5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshIcon: {
    fontSize: 18,
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
    position: 'relative',
  },
  avatar: {
    width: 122,
    height: 122,
    borderRadius: 61,
    backgroundColor: '#E5E7EB',
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 61,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  profileLoadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
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