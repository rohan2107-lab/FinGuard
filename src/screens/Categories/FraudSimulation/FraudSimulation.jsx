import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PermissionsAndroid } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

Ionicons.loadFont();

const { width, height } = Dimensions.get('window');

const FraudDetectionApp = ({ navigation }) => {
  // State Management
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Animation Values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [headerAnim] = useState(new Animated.Value(-100));
  const [cardAnim] = useState(new Animated.Value(0));

  // Component Mount Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Fraud Detection Logic
  const checkFraud = async () => {
    if (!inputText.trim()) {
      setError('Please enter a message to analyze');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Card shake animation for loading
    Animated.sequence([
      Animated.timing(cardAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
      Animated.timing(cardAnim, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();

    try {
      const response = await fetch('http://10.172.41.93:9000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });

      if (!response.ok) throw new Error('Server connection failed');

      const data = await response.json();
      setResult(data);

      // Result animation
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true
        })
      ]).start();

    } catch (err) {
      setError('Unable to connect to detection service. Please try again.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  // SMS Import Functionality
  const importFromSMS = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Access Required",
          message: "Allow access to SMS messages for fraud detection analysis.",
          buttonNeutral: "Ask Later",
          buttonNegative: "Cancel",
          buttonPositive: "Allow"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        SmsAndroid.list(
          JSON.stringify({ box: 'inbox', maxCount: 10 }),
          fail => {
            console.log('SMS read failed: ', fail);
            setError("Failed to access SMS messages");
          },
          (count, smsList) => {
            const messages = JSON.parse(smsList);
            if (messages.length > 0) {
              setInputText(messages[0].body);
              // Success animation
              Animated.spring(scaleAnim, {
                toValue: 1.05,
                tension: 100,
                friction: 3,
                useNativeDriver: true
              }).start(() => {
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  tension: 100,
                  friction: 3,
                  useNativeDriver: true
                }).start();
              });
            } else {
              setError("No SMS messages found");
            }
          }
        );
      } else {
        setError("SMS permission denied");
      }
    } catch (err) {
      console.warn(err);
      setError("Error accessing SMS messages");
    }
  };

  // Clear input function
  const clearInput = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#1A237E" barStyle="light-content" />
      
      {/* Header with Back Button */}
      <Animated.View 
        style={[
          styles.header,
          { transform: [{ translateY: headerAnim }] }
        ]}
      >
        <LinearGradient
          colors={['#1A237E', '#3F51B5', '#5C6BC0']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.headerGradient}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Ionicons name="shield-checkmark" size={32} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Fraud Detective</Text>
            <Text style={styles.headerSubtitle}>Advanced Message Analysis</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Input Card */}
          <Animated.View
            style={[
              styles.inputSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                  { translateX: cardAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FF']}
              style={styles.inputCard}
            >
              <View style={styles.inputHeader}>
                <Ionicons name="document-text" size={20} color="#3F51B5" />
                <Text style={styles.inputTitle}>Message to Analyze</Text>
                {inputText.length > 0 && (
                  <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color="#FF5252" />
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="Paste your message here or import from SMS..."
                placeholderTextColor="#9E9E9E"
                value={inputText}
                onChangeText={setInputText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <View style={styles.inputActions}>
                <TouchableOpacity 
                  style={styles.smsButton} 
                  onPress={importFromSMS}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#66BB6A']}
                    style={styles.actionButtonGradient}
                  >
                    <Ionicons name="chatbox-ellipses" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Import SMS</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.characterCount}>
                  <Text style={styles.characterCountText}>
                    {inputText.length} characters
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Analysis Button */}
          <Animated.View
            style={[
              styles.analyzeSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={[
                styles.analyzeButton,
                { opacity: inputText.length > 0 ? 1 : 0.6 }
              ]} 
              onPress={checkFraud}
              disabled={loading || inputText.length === 0}
            >
              <LinearGradient
                colors={loading ? ['#9E9E9E', '#BDBDBD'] : ['#FF6B35', '#FF8A65']}
                style={styles.analyzeButtonGradient}
              >
                {loading ? (
                  <View style={styles.loadingContent}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                  </View>
                ) : (
                  <View style={styles.analyzeContent}>
                    <Ionicons name="scan" size={22} color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>Analyze Message</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Results Section */}
          {result && (
            <Animated.View
              style={[
                styles.resultSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={
                  result.is_spam 
                    ? ['#FFEBEE', '#FFCDD2'] 
                    : ['#E8F5E9', '#C8E6C9']
                }
                style={[
                  styles.resultCard,
                  result.is_spam ? styles.spamResult : styles.safeResult
                ]}
              >
                {/* Lottie Animation */}
                <View style={styles.animationContainer}>
                  <LottieView
                    source={
                      result.is_spam
                        ? require('../../../assets/spam.json')
                        : require('../../../assets/notspam.json')
                    }
                    autoPlay
                    loop={false}
                    style={styles.lottieAnimation}
                  />
                </View>

                <View style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Ionicons
                      name={result.is_spam ? "warning" : "shield-checkmark"}
                      size={32}
                      color={result.is_spam ? "#D32F2F" : "#2E7D32"}
                    />
                    <Text style={[
                      styles.resultStatus,
                      { color: result.is_spam ? "#D32F2F" : "#2E7D32" }
                    ]}>
                      {result.is_spam ? "FRAUD DETECTED" : "MESSAGE SAFE"}
                    </Text>
                  </View>

                  <Text style={styles.resultDescription}>
                    {result.prediction}
                  </Text>

                  <View style={styles.confidenceContainer}>
                    <View style={styles.confidenceBar}>
                      <Animated.View 
                        style={[
                          styles.confidenceFill,
                          {
                            width: `${result.confidence * 100}%`,
                            backgroundColor: result.is_spam ? "#FF5252" : "#4CAF50"
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.confidenceText}>
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.resultActions}>
                    <TouchableOpacity 
                      style={styles.actionChip}
                      onPress={() => setResult(null)}
                    >
                      <Ionicons name="refresh" size={16} color="#757575" />
                      <Text style={styles.actionChipText}>New Analysis</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Error Display */}
          {error && (
            <Animated.View
              style={[
                styles.errorSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={['#FFEBEE', '#FFCDD2']}
                style={styles.errorCard}
              >
                <Ionicons name="alert-circle" size={24} color="#D32F2F" />
                <Text style={styles.errorText}>{error}</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 120,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8EAF6',
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F51B5',
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  textInput: {
    minHeight: 120,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  smsButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  characterCount: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  characterCountText: {
    fontSize: 12,
    color: '#757575',
  },
  analyzeSection: {
    marginBottom: 20,
  },
  analyzeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultSection: {
    marginBottom: 20,
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  spamResult: {
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  safeResult: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lottieAnimation: {
    width: 120,
    height: 120,
  },
  resultContent: {
    alignItems: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultStatus: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  confidenceContainer: {
    width: '100%',
    marginBottom: 20,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionChipText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 6,
  },
  errorSection: {
    marginBottom: 20,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#D32F2F',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default FraudDetectionApp;