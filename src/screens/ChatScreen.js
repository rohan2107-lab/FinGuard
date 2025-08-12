import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: '👋 Hi there! I’m FinGuard. How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const navigation = useNavigation();

  const sendMessage = () => {
    if (input.trim() === '') return;
    const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.user : styles.bot]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
<View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Ionicons name="chevron-back" size={24} color="#fff" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>FinGuard Chat</Text>

  <View style={styles.logoContainer}>
    <Image
      source={require('../assets/banklogo.png')} // Adjust path as needed
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
</View>


      {/* Chat Body */}
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContent}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#4CAF50',
  paddingVertical: 14,
  paddingHorizontal: 16,
  elevation: 4,
},
logoContainer: {
  flex: 1,
  alignItems: 'flex-end',
},
logo: {
  width: 40,
  height: 40,
},

  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  chatContent: {
    paddingBottom: 80,
  },
  message: {
    marginVertical: 6,
    maxWidth: '80%',
    borderRadius: 16,
    padding: 10,
  },
  user: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChatScreen;
