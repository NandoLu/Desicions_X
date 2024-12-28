import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import styles from './ModalStyle'; // Estilos do modal

interface TaxModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taxes: { low: number; medium: number; high: number }) => void;
}

const TaxModal: React.FC<TaxModalProps> = ({ visible, onClose, onSave }) => {
  const [lowTax, setLowTax] = useState(0);
  const [mediumTax, setMediumTax] = useState(0);
  const [highTax, setHighTax] = useState(0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Defina os Impostos</Text>

          <Text>Imposto para Pobre: {lowTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={lowTax}
            onValueChange={setLowTax}
          />

          <Text>Imposto Médio: {mediumTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={mediumTax}
            onValueChange={setMediumTax}
          />

          <Text>Imposto Alta Renda: {highTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={highTax}
            onValueChange={setHighTax}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSave({ low: lowTax, medium: mediumTax, high: highTax })}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaxModal;

