import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../../../styles/GameBottomBar.styles';

interface GameBottomBarProps {
  turn: {
    saldoEconomia: number;
    popularidade: number;
    monthIndex: number;
    year: number;
    
  };
  months: string[];
  onShowStatsModal: () => void;
  onShowAdviceModal: () => void;
  onShowDecisionsModal: () => void; // Novo prop para o DecisionsModal
}

const GameBottomBar: React.FC<GameBottomBarProps> = ({ turn, months, onShowStatsModal, onShowAdviceModal, onShowDecisionsModal }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoBar}>
        <Text> {turn.saldoEconomia} M</Text>
        <Text> {turn.popularidade.toFixed(0)}</Text> 
        <Text>{`${months[turn.monthIndex]} / ${turn.year}`}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onShowStatsModal}>
          <Image source={require('../../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={onShowDecisionsModal}>
          <Image source={require('../../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={onShowAdviceModal}>
          <Image source={require('../../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameBottomBar;
