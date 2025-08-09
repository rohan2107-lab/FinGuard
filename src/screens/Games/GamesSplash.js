import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function GamesSplash({ navigation }) {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate text fade-in and slide-up
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigation after 3 seconds
    const timeout = setTimeout(() => {
      navigation.replace('GamesHome');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fullscreen Lottie Animation */}
      <LottieView
        source={require('../../assets/naya.json')}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Animated Text Section */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        <Text style={styles.title}>Welcome to PSB Bank Games</Text>
        <Text style={styles.subtitle}>
          Learn and play for a financially smarter life!
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaffec',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003300',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
