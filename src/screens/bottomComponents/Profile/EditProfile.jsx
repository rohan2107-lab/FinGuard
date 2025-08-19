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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from "@react-navigation/native";


const { width, height } = Dimensions.get('window');

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Software Developer passionate about creating amazing mobile experiences.',
    location: 'San Francisco, CA',
    website: 'www.alexjohnson.dev',
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleSave = () => {
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            setIsEditing(false);
            setActiveField(null);
            Alert.alert('Success', 'Profile updated successfully!');
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    if (isEditing) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => {
              setIsEditing(false);
              setActiveField(null);
            }
          }
        ]
      );
    } else {
      navigation.goBack(); // Navigate back if not editing
    }
  };

  const handleEditAvatar = () => {
    Alert.alert('Change Photo', 'Select a new profile photo', [
      { text: 'Camera', onPress: () => console.log('Open camera') },
      { text: 'Gallery', onPress: () => console.log('Open gallery') },
      { text: 'Remove Photo', style: 'destructive', onPress: () => console.log('Remove photo') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const InputField = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        activeField === label && styles.inputWrapperActive
      ]}>
        <TextInput
          style={[styles.textInput, multiline && styles.textInputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          keyboardType={keyboardType}
          onFocus={() => {
            setActiveField(label);
            setIsEditing(true);
          }}
          onBlur={() => setActiveField(null)}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
              onPress={handleCancel}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 25 }}
            >
              <Text style={styles.backIcon}>←</Text>
            </Pressable>
            
            <Text style={styles.headerTitle}>Edit Profile</Text>
            
            <Pressable 
              style={[styles.saveButton, isEditing && styles.saveButtonActive]} 
              onPress={handleSave}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 25 }}
            >
              <Text style={[styles.saveText, isEditing && styles.saveTextActive]}>Save</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentContainer}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarBorder}>
                <Image
                  style={styles.avatar}
                  source={{ uri: userInfo.avatar }}
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
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <InputField
                label="First Name"
                value={userInfo.firstName}
                onChangeText={(text) => setUserInfo({...userInfo, firstName: text})}
                placeholder="Enter your first name"
              />

              <InputField
                label="Last Name"
                value={userInfo.lastName}
                onChangeText={(text) => setUserInfo({...userInfo, lastName: text})}
                placeholder="Enter your last name"
              />

              <InputField
                label="Bio"
                value={userInfo.bio}
                onChangeText={(text) => setUserInfo({...userInfo, bio: text})}
                placeholder="Tell us about yourself"
                multiline={true}
              />
            </View>

            {/* Contact Information Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <InputField
                label="Email"
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({...userInfo, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <InputField
                label="Phone"
                value={userInfo.phone}
                onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <InputField
                label="Location"
                value={userInfo.location}
                onChangeText={(text) => setUserInfo({...userInfo, location: text})}
                placeholder="Enter your location"
              />

              <InputField
                label="Website"
                value={userInfo.website}
                onChangeText={(text) => setUserInfo({...userInfo, website: text})}
                placeholder="Enter your website URL"
                keyboardType="url"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <Pressable 
                style={styles.resetButton}
                onPress={() => Alert.alert('Reset', 'Reset all fields to original values?')}
                android_ripple={{ color: 'rgba(239, 68, 68, 0.1)', radius: 100 }}
              >
                <Text style={styles.resetButtonText}>Reset Changes</Text>
              </Pressable>

              <Pressable 
                style={[styles.saveMainButton, isEditing && styles.saveMainButtonActive]}
                onPress={handleSave}
                android_ripple={{ color: 'rgba(255,255,255,0.2)', radius: 100 }}
              >
                <Text style={styles.saveMainButtonText}>
                  {isEditing ? 'Save Changes' : 'No Changes'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  saveButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  saveTextActive: {
    color: '#059669',
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#E5E7EB',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#059669',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  editAvatarIcon: {
    fontSize: 14,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    paddingLeft: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapperActive: {
    borderColor: '#10B981',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtonsContainer: {
    gap: 16,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveMainButton: {
    backgroundColor: '#D1D5DB',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  saveMainButtonActive: {
    backgroundColor: '#10B981',
  },
  saveMainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default EditProfile;