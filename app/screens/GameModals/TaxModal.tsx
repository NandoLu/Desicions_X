import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../../styles/ModalStyle'; // Estilos do modal
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaxModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taxes: { poor: number; middle: number; rich: number }, taxPopularityImpact: number, powerCost: number) => void;
  isTurnComplete: boolean; // Prop para indicar se o turno passou
}

enum ActiveSlider {
  Poor = 'poor',
  Middle = 'middle',
  Rich = 'rich',
  Locked = 'locked',
  None = 'none'
}

const TaxModal: React.FC<TaxModalProps> = ({ visible, onClose, onSave, isTurnComplete }) => {
  const [poorTax, setPoorTax] = useState(0);
  const [middleTax, setMiddleTax] = useState(0);
  const [richTax, setRichTax] = useState(0);
  const [tempPoorTax, setTempPoorTax] = useState(0);
  const [tempMiddleTax, setTempMiddleTax] = useState(0);
  const [tempRichTax, setTempRichTax] = useState(0);
  const [initialPoorTax, setInitialPoorTax] = useState(0);
  const [initialMiddleTax, setInitialMiddleTax] = useState(0);
  const [initialRichTax, setInitialRichTax] = useState(0);
  const [activeSlider, setActiveSlider] = useState<ActiveSlider>(ActiveSlider.None);
  const [canSave, setCanSave] = useState(false);
  const [powerCost, setpowerCost] = useState(0);

  useEffect(() => {
    const loadTaxValues = async () => {
      const poor = await AsyncStorage.getItem('poorTax');
      const middle = await AsyncStorage.getItem('middleTax');
      const rich = await AsyncStorage.getItem('richTax');

      if (poor !== null) {
        const poorValue = parseInt(poor);
        setPoorTax(poorValue);
        setTempPoorTax(poorValue);
        setInitialPoorTax(poorValue);
      }
      if (middle !== null) {
        const middleValue = parseInt(middle);
        setMiddleTax(middleValue);
        setTempMiddleTax(middleValue);
        setInitialMiddleTax(middleValue);
      }
      if (rich !== null) {
        const richValue = parseInt(rich);
        setRichTax(richValue);
        setTempRichTax(richValue);
        setInitialRichTax(richValue);
      }
    };

    loadTaxValues();
  }, [visible]);

  useEffect(() => {
    if (isTurnComplete) {
      setActiveSlider(ActiveSlider.None); // Desbloquear todos os sliders quando o turno passar
    }
  }, [isTurnComplete]);

  const calculateTaxRevenue = (poor: number, middle: number, rich: number) => {
    return poor * 4 + middle * 6 + rich * 9;
  };

  const calculateTaxPopularityImpact = (poor: number, middle: number, rich: number) => {
    const impact = 7 - (poor * 0.5 + middle * 0.75 + rich * 1);
    return impact > 0 ? impact : -Math.abs(impact);
  };

  const handleSave = async () => {
    setPoorTax(tempPoorTax);
    setMiddleTax(tempMiddleTax);
    setRichTax(tempRichTax);
    await AsyncStorage.setItem('poorTax', tempPoorTax.toString());
    await AsyncStorage.setItem('middleTax', tempMiddleTax.toString());
    await AsyncStorage.setItem('richTax', tempRichTax.toString());
    const taxRevenue = calculateTaxRevenue(tempPoorTax, tempMiddleTax, tempRichTax);
    const taxPopularityImpact = calculateTaxPopularityImpact(tempPoorTax, tempMiddleTax, tempRichTax);
    console.log(`Receita de Impostos: ${taxRevenue}`);
    console.log(`Impacto na Popularidade: ${taxPopularityImpact}`);
    onSave({ poor: tempPoorTax, middle: tempMiddleTax, rich: tempRichTax }, taxPopularityImpact, powerCost);
    setActiveSlider(ActiveSlider.Locked); // Bloqueia todos os sliders após salvar
    setCanSave(false); // Desabilita o botão Salvar após salvar
  };

  const handleClose = () => {
    setTempPoorTax(poorTax);
    setTempMiddleTax(middleTax);
    setTempRichTax(richTax);
    setActiveSlider(ActiveSlider.None);
    setCanSave(false);
    setpowerCost(0);
    onClose();
  };

  const isSliderDisabled = (slider: ActiveSlider) => {
    return (activeSlider !== ActiveSlider.None && activeSlider !== slider) || activeSlider === ActiveSlider.Locked;
  };

  const handleSliderChange = (slider: ActiveSlider, value: number) => {
    console.log(`Ativo: ${activeSlider}, Slider: ${slider}, Valor: ${value}`);

    if (isSliderDisabled(slider)) {
      console.log('Slider ativo diferente e não está bloqueado.');
      return;
    }

    if (slider === ActiveSlider.Poor) {
      setTempPoorTax(value);
      setpowerCost(Math.abs(value - initialPoorTax));
    } else if (slider === ActiveSlider.Middle) {
      setTempMiddleTax(value);
      setpowerCost(Math.abs(value - initialMiddleTax));
    } else if (slider === ActiveSlider.Rich) {
      setTempRichTax(value);
      setpowerCost(Math.abs(value - initialRichTax));
    }

    setActiveSlider(slider);
    setCanSave(true);

    if ((slider === ActiveSlider.Poor && value === initialPoorTax) ||
      (slider === ActiveSlider.Middle && value === initialMiddleTax) ||
      (slider === ActiveSlider.Rich && value === initialRichTax)) {
      setActiveSlider(ActiveSlider.None);
      setCanSave(false);
      setpowerCost(0);
    }
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
          <Text style={styles.modalTitle}>Defina as Taxas de Imposto</Text>

          <Text>Imposto sobre os Pobres: {tempPoorTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempPoorTax}
            onSlidingComplete={(value) => handleSliderChange(ActiveSlider.Poor, value)}
            disabled={isSliderDisabled(ActiveSlider.Poor)} // Usando a função de verificação
          />

          <Text>Imposto sobre a Classe Média: {tempMiddleTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempMiddleTax}
            onSlidingComplete={(value) => handleSliderChange(ActiveSlider.Middle, value)}
            disabled={isSliderDisabled(ActiveSlider.Middle)} // Usando a função de verificação
          />

          <Text>Imposto sobre os Ricos: {tempRichTax}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={tempRichTax}
            onSlidingComplete={(value) => handleSliderChange(ActiveSlider.Rich, value)}
            disabled={isSliderDisabled(ActiveSlider.Rich)} // Usando a função de verificação
          />

          <Text>Receita de Impostos: {calculateTaxRevenue(tempPoorTax, tempMiddleTax, tempRichTax)}</Text>
          <Text>Custo de poder: {powerCost}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSave, !canSave && styles.buttonSaveDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaxModal;