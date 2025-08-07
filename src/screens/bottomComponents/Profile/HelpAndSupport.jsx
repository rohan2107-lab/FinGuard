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
  Modal,
  FlatList,
  Linking,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const HelpAndSupport = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleBackPress = () => {
    Alert.alert('Back', 'Navigate back to profile screen');
  };

  const handleContactOption = (type) => {
    switch (type) {
      case 'email':
        Linking.openURL('mailto:support@example.com');
        break;
      case 'phone':
        Linking.openURL('tel:+1234567890');
        break;
      case 'chat':
        Alert.alert('Live Chat', 'Starting live chat session...');
        break;
      case 'whatsapp':
        Linking.openURL('https://wa.me/1234567890');
        break;
    }
  };

  const handleSocialMedia = (platform) => {
    const urls = {
      twitter: 'https://twitter.com/yourapp',
      facebook: 'https://facebook.com/yourapp',
      instagram: 'https://instagram.com/yourapp',
      youtube: 'https://youtube.com/yourapp'
    };
    Linking.openURL(urls[platform]);
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
      setFeedbackText('');
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };

  const handleSubmitContact = () => {
    if (contactForm.name && contactForm.email && contactForm.message) {
      Alert.alert('Message Sent!', 'We\'ll get back to you within 24 hours.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setModalVisible(false);
    } else {
      Alert.alert('Error', 'Please fill in all required fields.');
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login screen and tap 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password."
    },
    {
      question: "How do I update my profile information?",
      answer: "Navigate to Settings > Profile and tap on any field you want to edit. Make your changes and tap 'Save' to update your information."
    },
    {
      question: "Why am I not receiving notifications?",
      answer: "Check Settings > Notifications and ensure push notifications are enabled. Also verify that notifications are allowed in your device settings for this app."
    },
    {
      question: "How do I sync my data across devices?",
      answer: "Enable 'Auto Sync' in Settings > App Behavior. Make sure you're logged in with the same account on all devices."
    },
    {
      question: "Can I use the app offline?",
      answer: "Yes! Enable 'Offline Mode' in Settings > Privacy & Data. Some features may be limited when offline."
    },
    {
      question: "How do I delete my account?",
      answer: "Contact our support team through the app or email support@example.com. We'll help you with the account deletion process."
    }
  ];

  const tutorialTopics = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀', duration: '5 min' },
    { id: 'basic-features', title: 'Basic Features', icon: '⭐', duration: '8 min' },
    { id: 'advanced-tips', title: 'Advanced Tips', icon: '🎯', duration: '12 min' },
    { id: 'customization', title: 'Customization', icon: '🎨', duration: '6 min' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔧', duration: '10 min' },
    { id: 'privacy-security', title: 'Privacy & Security', icon: '🔒', duration: '7 min' }
  ];

  const supportSections = [
    {
      title: 'Quick Help',
      items: [
        {
          id: 'faq',
          title: 'Frequently Asked Questions',
          subtitle: 'Find answers to common questions',
          icon: '❓',
          type: 'action',
          action: () => openModal('faq'),
          color: '#3B82F6'
        },
        {
          id: 'tutorials',
          title: 'Video Tutorials',
          subtitle: 'Step-by-step guides and tips',
          icon: '📺',
          type: 'action',
          action: () => openModal('tutorials'),
          color: '#8B5CF6'
        },
        {
          id: 'troubleshooting',
          title: 'Troubleshooting',
          subtitle: 'Solve common issues quickly',
          icon: '⚠️',
          type: 'action',
          action: () => Alert.alert('Troubleshooting', 'Opening troubleshooting guide...'),
          color: '#F59E0B'
        }
      ]
    },
    {
      title: 'Contact Support',
      items: [
        {
          id: 'live-chat',
          title: 'Live Chat',
          subtitle: 'Chat with our support team',
          icon: '💬',
          type: 'action',
          action: () => handleContactOption('chat'),
          color: '#10B981'
        },
        {
          id: 'email',
          title: 'Email Support',
          subtitle: 'support@example.com',
          icon: '📧',
          type: 'action',
          action: () => handleContactOption('email'),
          color: '#06B6D4'
        },
        {
          id: 'phone',
          title: 'Phone Support',
          subtitle: '+1 (234) 567-8900',
          icon: '📞',
          type: 'action',
          action: () => handleContactOption('phone'),
          color: '#EF4444'
        },
        {
          id: 'contact-form',
          title: 'Contact Form',
          subtitle: 'Send us a detailed message',
          icon: '📝',
          type: 'action',
          action: () => openModal('contact'),
          color: '#84CC16'
        }
      ]
    },
    {
      title: 'Resources',
      items: [
        {
          id: 'user-guide',
          title: 'User Guide',
          subtitle: 'Comprehensive app documentation',
          icon: '📖',
          type: 'action',
          action: () => Alert.alert('User Guide', 'Opening user guide...'),
          color: '#7C3AED'
        },
        {
          id: 'whats-new',
          title: 'What\'s New',
          subtitle: 'Latest features and updates',
          icon: '🆕',
          type: 'action',
          action: () => Alert.alert('What\'s New', 'Showing latest updates...'),
          color: '#F59E0B'
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          subtitle: 'Help us improve the app',
          icon: '📢',
          type: 'action',
          action: () => openModal('feedback'),
          color: '#10B981'
        }
      ]
    },
    {
      title: 'Community',
      items: [
        {
          id: 'community-forum',
          title: 'Community Forum',
          subtitle: 'Connect with other users',
          icon: '👥',
          type: 'action',
          action: () => Alert.alert('Community', 'Opening community forum...'),
          color: '#3B82F6'
        },
        {
          id: 'social-media',
          title: 'Follow Us',
          subtitle: 'Stay updated on social media',
          icon: '📱',
          type: 'action',
          action: () => openModal('social'),
          color: '#8B5CF6'
        }
      ]
    }
  ];

  const SupportItem = ({ item }) => (
    <View style={styles.settingItem}>
      <Pressable
        style={styles.settingItemContent}
        onPress={item.action}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
      >
        <View style={[styles.settingIcon, { backgroundColor: item.color }]}>
          <Text style={styles.settingIconText}>{item.icon}</Text>
        </View>
        
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </View>
  );

  const FAQItem = ({ item, index }) => (
    <View style={styles.faqItem}>
      <Pressable
        style={styles.faqHeader}
        onPress={() => toggleFAQ(index)}
        android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
      >
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Text style={[styles.faqIcon, expandedFAQ === index && styles.faqIconExpanded]}>
          {expandedFAQ === index ? '−' : '+'}
        </Text>
      </Pressable>
      {expandedFAQ === index && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  const TutorialItem = ({ item }) => (
    <Pressable
      style={styles.tutorialItem}
      onPress={() => Alert.alert('Tutorial', `Starting "${item.title}" tutorial...`)}
      android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 200 }}
    >
      <Text style={styles.tutorialIcon}>{item.icon}</Text>
      <View style={styles.tutorialContent}>
        <Text style={styles.tutorialTitle}>{item.title}</Text>
        <Text style={styles.tutorialDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.playButton}>▶</Text>
    </Pressable>
  );

  const renderModalContent = () => {
    switch (modalType) {
      case 'faq':
        return (
          <ScrollView style={styles.modalScrollView}>
            {faqData.map((item, index) => (
              <FAQItem key={index} item={item} index={index} />
            ))}
          </ScrollView>
        );

      case 'tutorials':
        return (
          <ScrollView style={styles.modalScrollView}>
            {tutorialTopics.map((item) => (
              <TutorialItem key={item.id} item={item} />
            ))}
          </ScrollView>
        );

      case 'feedback':
        return (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackLabel}>Your Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              multiline={true}
              numberOfLines={6}
              placeholder="Tell us what you think about the app..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />
            <Pressable
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
              android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 100 }}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </Pressable>
          </View>
        );

      case 'contact':
        return (
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.contactForm}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Your full name"
                value={contactForm.name}
                onChangeText={(text) => setContactForm({...contactForm, name: text})}
              />

              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="your.email@example.com"
                value={contactForm.email}
                onChangeText={(text) => setContactForm({...contactForm, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.formLabel}>Subject</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({...contactForm, subject: text})}
              />

              <Text style={styles.formLabel}>Message *</Text>
              <TextInput
                style={[styles.formInput, styles.messageInput]}
                multiline={true}
                numberOfLines={5}
                placeholder="Please describe your issue or question in detail..."
                value={contactForm.message}
                onChangeText={(text) => setContactForm({...contactForm, message: text})}
                textAlignVertical="top"
              />

              <Pressable
                style={styles.submitButton}
                onPress={handleSubmitContact}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 100 }}
              >
                <Text style={styles.submitButtonText}>Send Message</Text>
              </Pressable>
            </View>
          </ScrollView>
        );

      case 'social':
        return (
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Follow us on social media</Text>
            <View style={styles.socialGrid}>
              <Pressable
                style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                onPress={() => handleSocialMedia('twitter')}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 50 }}
              >
                <Text style={styles.socialIcon}>🐦</Text>
                <Text style={styles.socialText}>Twitter</Text>
              </Pressable>

              <Pressable
                style={[styles.socialButton, { backgroundColor: '#1877F2' }]}
                onPress={() => handleSocialMedia('facebook')}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 50 }}
              >
                <Text style={styles.socialIcon}>📘</Text>
                <Text style={styles.socialText}>Facebook</Text>
              </Pressable>

              <Pressable
                style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
                onPress={() => handleSocialMedia('instagram')}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 50 }}
              >
                <Text style={styles.socialIcon}>📷</Text>
                <Text style={styles.socialText}>Instagram</Text>
              </Pressable>

              <Pressable
                style={[styles.socialButton, { backgroundColor: '#FF0000' }]}
                onPress={() => handleSocialMedia('youtube')}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 50 }}
              >
                <Text style={styles.socialIcon}>📺</Text>
                <Text style={styles.socialText}>YouTube</Text>
              </Pressable>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'faq': return 'Frequently Asked Questions';
      case 'tutorials': return 'Video Tutorials';
      case 'feedback': return 'Send Feedback';
      case 'contact': return 'Contact Support';
      case 'social': return 'Social Media';
      default: return 'Help & Support';
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
            
            <Text style={styles.headerTitle}>Help & Support</Text>
            
            <Pressable 
              style={styles.searchButton}
              onPress={() => Alert.alert('Search', 'Search help articles functionality')}
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
          {/* Quick Help Card */}
          <View style={styles.quickActionsCard}>
            <Text style={styles.quickActionsTitle}>Need Help?</Text>
            <Text style={styles.quickActionsSubtitle}>Choose the fastest way to get support</Text>
            <View style={styles.quickActionsGrid}>
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => handleContactOption('chat')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>💬</Text>
                <Text style={styles.quickActionText}>Live Chat</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => openModal('faq')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>❓</Text>
                <Text style={styles.quickActionText}>FAQ</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => handleContactOption('email')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>📧</Text>
                <Text style={styles.quickActionText}>Email</Text>
              </Pressable>
              
              <Pressable 
                style={styles.quickActionButton}
                onPress={() => handleContactOption('phone')}
                android_ripple={{ color: 'rgba(0,0,0,0.05)', radius: 50 }}
              >
                <Text style={styles.quickActionIcon}>📞</Text>
                <Text style={styles.quickActionText}>Call</Text>
              </Pressable>
            </View>
          </View>

          {/* Support Sections */}
          {supportSections.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <SupportItem key={item.id} item={item} />
              ))}
            </View>
          ))}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Modal */}
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
    marginBottom: 5,
  },
  quickActionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
    maxHeight: height * 0.8,
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
    maxHeight: height * 0.6,
  },
  modalScrollView: {
    padding: 20,
  },
  // FAQ Styles
  faqItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 10,
  },
  faqIcon: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  faqIconExpanded: {
    color: '#059669',
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginTop: 12,
  },
  // Tutorial Styles
  tutorialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tutorialIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  tutorialDuration: {
    fontSize: 13,
    color: '#6B7280',
  },
  playButton: {
    fontSize: 20,
    color: '#059669',
  },
  // Feedback Styles
  feedbackContainer: {
    padding: 20,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    marginBottom: 20,
  },
  // Contact Form Styles
  contactForm: {
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 15,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Social Media Styles
  socialContainer: {
    padding: 20,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpAndSupport;