import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { getFinanceTip } from '../utils/getTip';

// Import your downloaded Lottie animation JSON file
import loadingAnimation from '../assets/tips.json';

const TipModal = ({ visible, onClose, userName }) => {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getFinanceTip(userName).then((fetchedTip) => {
        setTip(fetchedTip);
        setLoading(false);
      });
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animatable.View animation="zoomIn" duration={500} style={styles.modal}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                source={loadingAnimation}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
              <Text style={styles.loadingText}>Fetching a tip just for you...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.modalTitle}>💡 Your Financial Tip</Text>
              <Animatable.Text animation="fadeInUp" duration={800} delay={100} style={styles.tipText}>
                {tip}
              </Animatable.Text>
              <Pressable
                style={({ pressed }) => [
                  styles.closeButton,
                  { backgroundColor: pressed ? '#249E63' : '#2ECC71' }
                ]}
                onPress={onClose}>
                <Text style={styles.closeText}>Got it!</Text>
              </Pressable>
            </>
          )}
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  lottieAnimation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default TipModal;