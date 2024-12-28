import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from './ModalStyle'; // Estilos do modal
import Slider from '@react-native-community/slider';


interface EducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (education: { primary: number; secondary: number; higher: number }) => void;
}

const EducationModal: React.FC<EducationModalProps> = ({ visible, onClose, onSave }) => {
  const [primaryEducation, setPrimaryEducation] = useState(0);
  const [secondaryEducation, setSecondaryEducation] = useState(0);
  const [higherEducation, setHigherEducation] = useState(0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Defina os Investimentos em Educação</Text>

          <Text>Educação Primária: {primaryEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={primaryEducation}
            onValueChange={setPrimaryEducation}
          />

          <Text>Educação Secundária: {secondaryEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={secondaryEducation}
            onValueChange={setSecondaryEducation}
          />

          <Text>Educação Superior: {higherEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={higherEducation}
            onValueChange={setHigherEducation}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSave({ primary: primaryEducation, secondary: secondaryEducation, higher: higherEducation })}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EducationModal;
