import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Easing,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  
} from "react-native";





const GEMINI_API_KEY = "AIzaSyA0-Nts6CKF-Fm7ikYQEdhknS2A3rMOjW0";
const { width, height } = Dimensions.get("window");

const ChatbotScreen = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your AI assistant. How can I help you today? 😊", 
      sender: "gemini", 
      timestamp: Date.now(),
      id: "welcome"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for send button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Typing indicator animation
  useEffect(() => {
    if (isTyping) {
      const typingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      typingAnimation.start();
      return () => typingAnimation.stop();
    }
  }, [isTyping]);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const userMessage = { 
      text: msg, 
      sender: "user", 
      timestamp: Date.now(),
      id: Date.now().toString()
    };
    
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setMsg("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Simulate realistic typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: msg,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const content = data.candidates?.[0]?.content;
      const reply = content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request. Please try again.";

      // Simulate typing effect for bot response
      await new Promise(resolve => setTimeout(resolve, 500));

      const geminiMessage = { 
        text: reply, 
        sender: "gemini", 
        timestamp: Date.now(),
        id: (Date.now() + 1).toString()
      };
      
      setMessages((prevMessages) => [geminiMessage, ...prevMessages]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { 
        text: "Oops! Something went wrong. Please check your connection and try again.", 
        sender: "gemini", 
        timestamp: Date.now(),
        id: (Date.now() + 2).toString()
      };
      setMessages((prevMessages) => [errorMessage, ...prevMessages]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const messageSave = (text) => {
    setMsg(text);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TypingIndicator = () => (
    <Animated.View style={[styles.typingContainer, { opacity: typingAnim }]}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <View style={[styles.dot, { animationDelay: '0ms' }]} />
          <View style={[styles.dot, { animationDelay: '150ms' }]} />
          <View style={[styles.dot, { animationDelay: '300ms' }]} />
        </View>
        <Text style={styles.typingText}>AI is typing...</Text>
      </View>
    </Animated.View>
  );

  const MessageBubble = ({ item, index }) => {
    const messageAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(messageAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * 100,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          {
            opacity: messageAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: messageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.message,
            item.sender === "user" ? styles.userMessage : styles.geminiMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              item.sender === "user"
                ? styles.userMessageText
                : styles.geminiMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        {item.sender === "gemini" && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
        )}
        {item.sender === "user" && (
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }) => (
    <MessageBubble item={item} index={index} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.aiStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.headerTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
      </Animated.View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Animated.View
          style={[
            styles.messagesWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            inverted
            showsVerticalScrollIndicator={false}
          />
          
          {isTyping && <TypingIndicator />}
        </Animated.View>

        {/* Input Area */}
        <Animated.View
          style={[
            styles.inputWrapper,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, height],
                    outputRange: [0, height],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.inputView}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={msg}
                onChangeText={messageSave}
                placeholderTextColor="#8e8e93"
                multiline
                maxLength={1000}
              />
              {msg.length > 0 && (
                <View style={styles.characterCount}>
                  <Text style={styles.characterCountText}>
                    {msg.length}/1000
                  </Text>
                </View>
              )}
            </View>
            
            <Animated.View
              style={[
                styles.sendButtonContainer,
                {
                  transform: [
                    { scale: buttonScaleAnim },
                    { scale: msg.trim() ? pulseAnim : 1 },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  !msg.trim() && styles.buttonDisabled,
                ]}
                onPress={handleButtonClick}
                disabled={!msg.trim() || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.buttonText}>
                    {msg.trim() ? "✈️" : "💬"}
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: "#16213e",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2d4a8e",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00ff88",
    marginRight: 10,
    shadowColor: "#00ff88",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#00ff88",
    fontSize: 12,
    fontWeight: "500",
  },
  messagesWrapper: {
    flex: 1,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
  },
  message: {
    maxWidth: "85%",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderTopRightRadius: 8,
    marginRight: 40,
  },
  geminiMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderTopLeftRadius: 8,
    marginLeft: 40,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  userMessageText: {
    color: "white",
  },
  geminiMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: "right",
    marginTop: 5,
  },
  aiAvatar: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  userAvatar: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  userAvatarText: {
    fontSize: 14,
  },
  typingContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  typingBubble: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 18,
    alignSelf: "flex-start",
    marginLeft: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  typingDots: {
    flexDirection: "row",
    marginRight: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    marginHorizontal: 1,
  },
  typingText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
  },
  inputWrapper: {
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#2d4a8e",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 25,
    marginRight: 12,
    position: "relative",
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    maxHeight: 120,
  },
  characterCount: {
    position: "absolute",
    right: 10,
    bottom: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  characterCountText: {
    fontSize: 10,
    color: "#666",
  },
  sendButtonContainer: {
    marginBottom: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#8e8e93",
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default ChatbotScreen;