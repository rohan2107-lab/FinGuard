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
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Security = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricLogin: false,
    loginNotifications: true,
    deviceManagement: true,
    autoLogout: false,
    privateAccount: false,
    dataSharing: true,
    locationTracking: false,
  });

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [lastActivity] = useState([
    { device: 'iPhone 14 Pro', location: 'San Francisco, CA', time: '2 minutes ago', current: true },
    { device: 'MacBook Pro', location: 'San Francisco, CA', time: '1 hour ago', current: false },
    { device: 'iPad Air', location: 'San Francisco, CA', time: '3 days ago', current: false },
  ]);

  const handleBackPress = () => {
    Alert.alert('Back', 'Navigate back to profile screen');
  };

  const toggleSetting = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Show appropriate alerts for critical settings
    if (setting === 'twoFactorAuth' && securitySettings[setting]) {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will make your account less secure. Are you sure?',
        [
          { text: 'Cancel', onPress: () => setSecuritySettings(prev => ({ ...prev, [setting]: true })) },
          { text: 'Disable', style: 'destructive' }
        ]
      );
    } else if (setting === 'twoFactorAuth' && !securitySettings[setting]) {
      Alert.alert('Two-Factor Authentication', 'We\'ll send you a verification code to set this up.');
    }
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    Alert.alert('Success', 'Password changed successfully!');
    setPasswordModalVisible(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeviceAction = (device, action) => {
    if (action === 'remove') {
      Alert.alert(
        'Remove Device',
        `Remove "${device}" from your account?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => console.log(`Removed ${device}`) }
        ]
      );
    } else if (action === 'view') {
      Alert.alert('Device Details', `Device: ${device}\nClick to view more details`);
    }
  };

  const securityOptions = [
    {
      title: 'Password & Authentication',
      items: [
        {
          id: 'password',
          title: 'Change Password',
          subtitle: 'Last changed 3 months ago',
          icon: '🔑',
          type: 'action',
          action: () => setPasswordModalVisible(true),
          color: '#3B82F6'
        },
        {
          id: 'twoFactorAuth',
          title: 'Two-Factor Authentication',
          subtitle: 'Add an extra layer of security',
          icon: '🛡️',
          type: 'toggle',
          value: securitySettings.twoFactorAuth,
          color: '#10B981'
        },
        {
          id: 'biometricLogin',
          title: 'Biometric Login',
          subtitle: 'Use fingerprint or face ID',
          icon: '👆',
          type: 'toggle',
          value: securitySettings.biometricLogin,
          color: '#8B5CF6'
        }
      ]
    },
    {
      title: 'Account Security',
      items: [
        {
          id: 'loginNotifications',
          title: 'Login Notifications',
          subtitle: 'Get notified of new sign-ins',
          icon: '📧',
          type: 'toggle',
          value: securitySettings.loginNotifications,
          color: '#F59E0B'
        },
        {
          id: 'deviceManagement',
          title: 'Device Management',
          subtitle: 'Manage trusted devices',
          icon: '📱',
          type: 'action',
          action: () => Alert.alert('Device Management', 'View and manage your trusted devices'),
          color: '#EF4444'
        },
        {
          id: 'autoLogout',
          title: 'Auto Logout',
          subtitle: 'Automatically log out after inactivity',
          icon: '⏰',
          type: 'toggle',
          value: securitySettings.autoLogout,
          color: '#06B6D4'
        }
      ]
    },
    {
      title: 'Privacy Settings',
      items: [
        {
          id: 'privateAccount',
          title: 'Private Account',
          subtitle: 'Make your account private',
          icon: '🔒',
          type: 'toggle',
          value: securitySettings.privateAccount,
          color: '#7C3AED'
        },
        {
          id: 'dataSharing',
          title: 'Data Sharing',
          subtitle: 'Share data for better experience',
          icon: '📊',
          type: 'toggle',
          value: securitySettings.dataSharing,
          color: '#059669'
        },
        {
          id: 'locationTracking',
          title: 'Location Tracking',
          subtitle: 'Allow location-based features',
          icon: '📍',
          type: 'toggle',
          value: securitySettings.locationTracking,
          color: '#DC2626'
        }
      ]
    }
  ];

  const SecurityItem = ({ item }) => (
    <View style={styles.securityItem}>
      <View style={styles.securityItemContent}>
        <View style={[styles.securityIcon, { backgroundColor: item.color }]}>
          <Text style={styles.securityIconText}>{item.icon}</Text>
        </View>
        
        <View style={styles.securityTextContainer}>
          <Text style={styles.securityTitle}>{item.title}</Text>
          <Text style={styles.securitySubtitle}>{item.subtitle}</Text>
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
            
            <Text style={styles.headerTitle}>Security</Text>
            
            <Pressable 
              style={styles.helpButton}
              onPress={() => Alert.alert('Help', 'Security tips and help')}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 20 }}
            >
              <Text style={styles.helpIcon}>❓</Text>
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
          {/* Security Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIcon}>
                <Text style={styles.statusIconText}>🛡️</Text>
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Security Score</Text>
                <Text style={styles.statusSubtitle}>Your account is well protected</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>85</Text>
                <Text style={styles.scoreLabel}>%</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '85%' }]} />
            </View>
          </View>

          {/* Security Options */}
          {securityOptions.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <SecurityItem key={item.id} item={item} />
              ))}
            </View>
          ))}

      

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Pressable
                style={styles.modalCloseButton}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.modalContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Current Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  placeholder="Enter current password"
                  secureTextEntry={true}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  placeholder="Enter new password"
                  secureTextEntry={true}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                  placeholder="Confirm new password"
                  secureTextEntry={true}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.modalButtons}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setPasswordModalVisible(false)}
                  android_ripple={{ color: 'rgba(0,0,0,0.1)', radius: 100 }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable
                  style={styles.confirmButton}
                  onPress={handleChangePassword}
                  android_ripple={{ color: 'rgba(255,255,255,0.2)', radius: 100 }}
                >
                  <Text style={styles.confirmButtonText}>Change Password</Text>
                </Pressable>
              </View>
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
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
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
  statusCard: {
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusIconText: {
    fontSize: 24,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: -5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
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
  securityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  securityIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  securitySubtitle: {
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
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIconCurrent: {
    backgroundColor: '#10B981',
  },
  activityIconText: {
    fontSize: 18,
  },
  activityInfo: {
    flex: 1,
  },
  activityDevice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 1,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  currentBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  removeDeviceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeDeviceText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
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
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Security;