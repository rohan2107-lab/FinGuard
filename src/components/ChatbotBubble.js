import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const ChatbotBubble = () => {
  const navigation = useNavigation();

  const pan = useRef(new Animated.ValueXY({ x: 300, y: 500 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[pan.getLayout(), styles.container]}
    >
      <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
        <LottieView
          source={require('../assets/chatbot.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  lottie: {
    width: 120,
    height: 120,
  },
});

export default ChatbotBubble;
