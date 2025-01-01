import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles/ModalStyle'; // Estilos do modal
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (education: { primary: number; secondary: number; higher: number }) => void;
}

const EducationModal: React.FC<EducationModalProps> = ({ visible, onClose, onSave }) => {
  const [primaryEducation, setPrimaryEducation] = useState(0);
  const [secondaryEducation, setSecondaryEducation] = useState(0);
  const [higherEducation, setHigherEducation] = useState(0);
  const [tempPrimaryEducation, setTempPrimaryEducation] = useState(0);
  const [tempSecondaryEducation, setTempSecondaryEducation] = useState(0);
  const [tempHigherEducation, setTempHigherEducation] = useState(0);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [lockedSlider, setLockedSlider] = useState<string | null>(null);

  useEffect(() => {
    const loadEducationValues = async () => {
      const primary = await AsyncStorage.getItem('primaryEducation');
      const secondary = await AsyncStorage.getItem('secondaryEducation');
      const higher = await AsyncStorage.getItem('higherEducation');

      if (primary !== null) {
        const primaryValue = parseInt(primary);
        setPrimaryEducation(primaryValue);
        setTempPrimaryEducation(primaryValue);
      }
      if (secondary !== null) {
        const secondaryValue = parseInt(secondary);
        setSecondaryEducation(secondaryValue);
        setTempSecondaryEducation(secondaryValue);
      }
      if (higher !== null) {
        const higherValue = parseInt(higher);
        setHigherEducation(higherValue);
        setTempHigherEducation(higherValue);
      }
    };

    loadEducationValues();
  }, [visible]);

  useEffect(() => {
    if (
      tempPrimaryEducation === primaryEducation &&
      tempSecondaryEducation === secondaryEducation &&
      tempHigherEducation === higherEducation
    ) {
      setIsSaveDisabled(true);
      setLockedSlider(null);
    } else {
      setIsSaveDisabled(false);
    }
  }, [tempPrimaryEducation, tempSecondaryEducation, tempHigherEducation]);

  const calculateDespesaEducacao = (primary: number, secondary: number, higher: number) => {
    return primary * -2 + secondary * -4 + higher * -6;
  };

  const handleSave = async () => {
    setPrimaryEducation(tempPrimaryEducation);
    setSecondaryEducation(tempSecondaryEducation);
    setHigherEducation(tempHigherEducation);
    await AsyncStorage.setItem('primaryEducation', tempPrimaryEducation.toString());
    await AsyncStorage.setItem('secondaryEducation', tempSecondaryEducation.toString());
    await AsyncStorage.setItem('higherEducation', tempHigherEducation.toString());
    const despesaEducacao = calculateDespesaEducacao(tempPrimaryEducation, tempSecondaryEducation, tempHigherEducation);
    console.log(`Despesa em Educação: ${despesaEducacao}`);
    onSave({ primary: tempPrimaryEducation, secondary: tempSecondaryEducation, higher: tempHigherEducation });
  };

  const handleSliderChange = (value: number, type: 'primary' | 'secondary' | 'higher') => {
    if (lockedSlider && lockedSlider !== type) return;

    switch (type) {
      case 'primary':
        setTempPrimaryEducation(value);
        if (value !== primaryEducation) {
          setLockedSlider('primary');
        } else {
          setLockedSlider(null);
        }
        break;
      case 'secondary':
        setTempSecondaryEducation(value);
        if (value !== secondaryEducation) {
          setLockedSlider('secondary');
        } else {
          setLockedSlider(null);
        }
        break;
      case 'higher':
        setTempHigherEducation(value);
        if (value !== higherEducation) {
          setLockedSlider('higher');
        } else {
          setLockedSlider(null);
        }
        break;
    }
  };

  const handleClose = () => {
    setTempPrimaryEducation(primaryEducation);
    setTempSecondaryEducation(secondaryEducation);
    setTempHigherEducation(higherEducation);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Defina os Investimentos em Educação</Text>

          <Text>Educação Primária: {tempPrimaryEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempPrimaryEducation}
            onSlidingComplete={(value) => handleSliderChange(value, 'primary')}
            disabled={lockedSlider !== null && lockedSlider !== 'primary'}
          />

          <Text>Educação Secundária: {tempSecondaryEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempSecondaryEducation}
            onSlidingComplete={(value) => handleSliderChange(value, 'secondary')}
            disabled={lockedSlider !== null && lockedSlider !== 'secondary'}
          />

          <Text>Educação Superior: {tempHigherEducation}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempHigherEducation}
            onSlidingComplete={(value) => handleSliderChange(value, 'higher')}
            disabled={lockedSlider !== null && lockedSlider !== 'higher'}
          />

          <Text>Despesa em Educação: {calculateDespesaEducacao(tempPrimaryEducation, tempSecondaryEducation, tempHigherEducation)}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={isSaveDisabled ? styles.buttonSaveDisabled : styles.button}
              onPress={handleSave}
              disabled={isSaveDisabled}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EducationModal;
