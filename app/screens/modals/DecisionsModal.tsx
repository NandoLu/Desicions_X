import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles/ModalsFooterStyles';

interface DecisionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const DecisionsModal: React.FC<DecisionsModalProps> = ({ visible, onClose }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.titleText}>Decisões</Text>
            <View>
                

            </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DecisionsModal;
