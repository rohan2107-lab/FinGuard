import React, { useEffect, useState } from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { getFinanceTip } from '../utils/getTip';

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
        <View style={styles.modal}>
          {loading ? (
            <ActivityIndicator size="large" color="#2ECC71" />
          ) : (
            <Animatable.Text animation="fadeInUp" duration={800} style={styles.tipText}>
              {tip}
            </Animatable.Text>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✖ Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#f0fff0',
    padding: 24,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2ECC71',
    borderRadius: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TipModal;
