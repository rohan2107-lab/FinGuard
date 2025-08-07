import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Settings = () => {
  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    soundEffects: true,
    vibration: false,
    darkMode: false,
    autoSync: true,
    offlineMode: false,
    analytics: true,
    crashReports: true,
    backgroundRefresh: true,
    autoUpdate: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedTheme, setSelectedTheme] = useState('Light');
  const [selectedFontSize, setSelectedFontSize] = useState('Medium');

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { id: 'it', name: 'Italiano', flag: '🇮🇹' },
    { id: 'pt', name: 'Português', flag: '🇵🇹' },
    { id: 'zh', name: '中文', flag: '🇨🇳' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const themes = [
    { id: 'light', name: 'Light', icon: '☀️', description: 'Bright and clean interface' },
    { id: 'dark', name: 'Dark', icon: '🌙', description: 'Easy on the eyes' },
    { id: 'auto', name: 'Auto', icon: '🌓', description: 'Follows system settings' },
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', size: 14 },
    { id: 'medium', name: 'Medium', size: 16 },
    { id: 'large', name: 'Large', size: 18 },
    { id: 'xlarge', name: 'Extra Large', size: 20 },
  ];

  const handleBackPress = () => {
    Alert.alert('Back', 'Navigate back to profile screen');
  };

  const toggleSetting = (setting) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Show feedback for important settings
    if (setting === 'pushNotifications' && !appSettings[setting]) {
      Alert.alert('Notifications Enabled', 'You\'ll now receive push notifications');
    } else if (setting === 'darkMode') {
      Alert.alert('Theme Changed', `${!appSettings[setting] ? 'Dark' : 'Light'} mode activated`);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSelection = (type, value) => {
    switch (type) {
      case 'language':
        setSelectedLanguage(value);
        Alert.alert('Language Changed', `Language set to ${value}`);
        break;
      case 'theme':
        setSelectedTheme(value);
        Alert.alert('Theme Changed', `Theme set to ${value}`);
        break;
      case 'fontSize':
        setSelectedFontSize(value);
        Alert.alert('Font Size Changed', `Font size set to ${value}`);
        break;
    }
    setModalVisible(false);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all temporary files and may slow down the app initially. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset All Settings',
      'This will reset all settings to their default values. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: () => {
            setAppSettings({
              pushNotifications: true,
              emailNotifications: false,
              smsNotifications: true,
              soundEffects: true,
              vibration: false,
              darkMode: false,
              autoSync: true,
              offlineMode: false,
              analytics: true,
              crashReports: true,
              backgroundRefresh: true,
              autoUpdate: false,
            });
            setSelectedLanguage('English');
            setSelectedTheme('Light');
            setSelectedFontSize('Medium');
            Alert.alert('Success', 'All settings have been reset to defaults');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications on this device',
          icon: '🔔',
          type: 'toggle',
          value: appSettings.pushNotifications,
          color: '#3B82F6'
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          icon: '📧',
          type: 'toggle',
          value: appSettings.emailNotifications,
          color: '#10B981'
        },
        {
          id: 'smsNotifications',
          title: 'SMS Notifications',
          subtitle: 'Receive notifications via SMS',
          icon: '💬',
          type: 'toggle',
          value: appSettings.smsNotifications,
          color: '#8B5CF6'
        }
      ]
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: `Current: ${selectedTheme}`,
          icon: '🎨',
          type: 'action',
          action: () => openModal('theme'),
          color: '#F59E0B'
        },
        {
          id: 'fontSize',
          title: 'Font Size',
          subtitle: `Current: ${selectedFontSize}`,
          icon: '🔤',
          type: 'action',
          action: () => openModal('fontSize'),
          color: '#EF4444'
        },
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          icon: '🌙',
          type: 'toggle',
          value: appSettings.darkMode,
          color: '#6B7280'
        }
      ]
    },
    {
      title: 'App Behavior',
      items: [
        {
          id: 'soundEffects',
          title: 'Sound Effects',
          subtitle: 'Play sounds for app interactions',
          icon: '🔊',
          type: 'toggle',
          value: appSettings.soundEffects,
          color: '#06B6D4'
        },
        {
          id: 'vibration',
          title: 'Vibration',
          subtitle: 'Vibrate for notifications and feedback',
          icon: '📳',
          type: 'toggle',
          value: appSettings.vibration,
          color: '#84CC16'
        },
        {
          id: 'autoSync',
          title: 'Auto Sync',
          subtitle: 'Automatically sync data',
          icon: '🔄',
          type: 'toggle',
          value: appSettings.autoSync,
          color: '#10B981'
        },
        {
          id: 'backgroundRefresh',
          title: 'Background Refresh',
          subtitle: 'Update content in background',
          icon: '🔃',
          type: 'toggle',
          value: appSettings.backgroundRefresh,
          color: '#3B82F6'
        }
      ]
    },
    {
      title: 'Language & Region',
      items: [
        {
          id: 'language',
          title: 'Language',
          subtitle: `Current: ${selectedLanguage}`,
          icon: '🌐',
          type: 'action',
          action: () => openModal('language'),
          color: '#8B5CF6'
        },
        {
          id: 'region',
          title: 'Region',
          subtitle: 'United States',
          icon: '🗺️',
          type: 'action',
          action: () => Alert.alert('Region', 'Region settings coming soon'),
          color: '#F59E0B'
        }
      ]
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'analytics',
          title: 'Analytics',
          subtitle: 'Help improve the app',
          icon: '📊',
          type: 'toggle',
          value: appSettings.analytics,
          color: '#059669'
        },
        {
          id: 'crashReports',
          title: 'Crash Reports',
          subtitle: 'Automatically send crash reports',
          icon: '🐛',
          type: 'toggle',
          value: appSettings.crashReports,
          color: '#DC2626'
        },
        {
          id: 'offlineMode',
          title: 'Offline Mode',
          subtitle: 'Work without internet connection',
          icon: '📱',
          type: 'toggle',
          value: appSettings.offlineMode,
          color: '#7C3AED'
        }
      ]
    },
    {
      title: 'Advanced',
      items: [
        {
          id: 'autoUpdate',
          title: 'Auto Update',
          subtitle: 'Automatically update the app',
          icon: '⬆️',
          type: 'toggle',
          value: appSettings.autoUpdate,
          color: '#10B981'
        },
        {
          id: 'clearCache',
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          icon: '🗑️',
          type: 'action',
          action: handleClearCache,
          color: '#F59E0B'
        },
        {
          id: 'resetSettings',
          title: 'Reset Settings',
          subtitle: 'Reset all settings to default',
          icon: '🔄',
          type: 'action',
          action: handleResetSettings,
          color: '#EF4444'
        }
      ]
    }
  ];

  const SettingItem = ({ item }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingItemContent}>
        <View style={[styles.settingIcon, { backgroundColor: item.color }]}>
          <Text style={styles.settingIconText}>{item.icon}</Text>
        </View>
        
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={() => toggleSetting(item.id)}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
            style={styles.switch}
          />
        ) : (
          <Pressable
            style={styles.actionButton}
            onPress={item.action}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', radius: 20 }}
          >
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderModalContent = () => {
    switch (modalType) {
      case 'language':
        return (
          <FlatList
            data={languages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.modalItem,
                  selectedLanguage === item.name && styles.modalItemSelected
                ]}
                onPress={() => handleSelection('language', item.name)}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
              >
                <Text style={styles.modalItemFlag}>{item.flag}</Text>
                <Text style={[
                  styles.modalItemText,
                  selectedLanguage === item.name && styles.modalItemTextSelected
                ]}>
                  {item.name}
                </Text>
                {selectedLanguage === item.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            )}
          />
        );
      
      case 'theme':
        return (
          <View>
            {themes.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.modalItem,
                  selectedTheme === item.name && styles.modalItemSelected
                ]}
                onPress={() => handleSelection('theme', item.name)}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
              >
                <Text style={styles.modalItemFlag}>{item.icon}</Text>
                <View style={styles.themeInfo}>
                  <Text style={[
                    styles.modalItemText,
                    selectedTheme === item.name && styles.modalItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                  <Text style={styles.themeDescription}>{item.description}</Text>
                </View>
                {selectedTheme === item.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        );

      case 'fontSize':
        return (
          <View>
            {fontSizes.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.modalItem,
                  selectedFontSize === item.name && styles.modalItemSelected
                ]}
                onPress={() => handleSelection('fontSize', item.name)}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
              >
                <Text style={[styles.fontSizeText, { fontSize: item.size }]}>Aa</Text>
                <Text style={[
                  styles.modalItemText,
                  selectedFontSize === item.name && styles.modalItemTextSelected
                ]}>
                  {item.name}
                </Text>
                {selectedFontSize === item.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'language': return 'Select Language';
      case 'theme': return 'Choose Theme';
      case 'fontSize': return 'Font Size';
      default: return 'Settings';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
        <View style={[styles.decorativeCircle, styles.circle3]} />
        
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable 
              style={styles.headerButton} 
              onPress={handleBackPress}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 25 }}
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
            
            <Text style={styles.headerTitle}>Settings</Text>
            
            <Pressable 
              style={styles.searchButton}
              onPress={() => Alert.alert('Search', 'Search settings functionality')}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 20 }}
            >
              <Text style={styles.searchIcon}>🔍</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Quick Actions Card */}
          <View style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => toggleSetting('darkMode')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>🌙</Text>
                <Text style={styles.quickActionText}>Dark Mode</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => toggleSetting('pushNotifications')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>🔔</Text>
                <Text style={styles.quickActionText}>Notifications</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => openModal('language')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>🌐</Text>
                <Text style={styles.quickActionText}>Language</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={handleClearCache}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>🗑️</Text>
                <Text style={styles.quickActionText}>Clear Cache</Text>
              </Pressable>
            </View>
          </View>

          {/* Settings Sections */}
          {settingSections.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <SettingItem key={item.id} item={item} />
              ))}
            </View>
          ))}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.modalContent}>
              {renderModalContent()}
            </View>
          </View>
        </View>
      </Modal>
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
    bottom: 10,
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 18,
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
    marginTop: -20,
    paddingTop: 30,
    minHeight: height * 0.85,
  },
  quickActionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    paddingLeft: 4,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  actionButton: {
    padding: 8,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalContent: {
    padding: 20,
    maxHeight: height * 0.5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemSelected: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  modalItemFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  modalItemTextSelected: {
    color: '#10B981',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#10B981',
    fontWeight: 'bold',
  },
  themeInfo: {
    flex: 1,
  },
  themeDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  fontSizeText: {
    fontWeight: 'bold',
    color: '#374151',
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
});

export default Settings;