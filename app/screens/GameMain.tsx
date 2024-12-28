import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatsModal from './modals/StatsModal';
import AdviceModal from './modals/AdviceModal';
import styles from './GameMain.styles';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { initializeTurn, advanceTurn, months, Turn } from './logic/GameLogic';
import { RootStackParamList } from '../index';
import AButtonsGame from './GameModals/AButtonsGame'; // Importando o novo componente


// Definição do tipo de navegação para o Stack Navigation
type GameMainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameMain'>;

// Interface para o líder
interface Leader {
  image: any; // Tipo da imagem do líder
}

// Interface para o país
interface Country {
  name: string;
  details: {
    pib: string;
    year: number; // Ano inicial do jogo
  };
  images: {
    flag: any; // Tipo da imagem da bandeira
  };
}

// Interface que estende o país com um líder
interface Scenario extends Country {
  leader: Leader;
}

// Props do componente
interface Props {
  navigation: GameMainScreenNavigationProp;
}

const GameMain: React.FC<Props> = ({ navigation }) => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [turn, setTurn] = useState<Turn | null>(null); // Estado para o turno
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [isAdviceModalVisible, setIsAdviceModalVisible] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const savedScenario = await AsyncStorage.getItem('currentScenario');
        if (savedScenario) {
          const parsedScenario: Scenario = JSON.parse(savedScenario);
          setScenario(parsedScenario);

          const savedTurn = await AsyncStorage.getItem('currentTurn');
          if (savedTurn) {
            setTurn(JSON.parse(savedTurn)); // Recupera o turno salvo
          } else {
            const initialTurn = initializeTurn(parsedScenario.details.year);
            setTurn(initialTurn); // Inicializa o turno se não houver nenhum salvo
            await AsyncStorage.setItem('currentTurn', JSON.stringify(initialTurn));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o cenário ou turno:', error);
      }
    };

    fetchScenario();
  }, []);

  // Adicionando funcionalidade para tratar o botão "voltar"
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Jogo em andamento',
          'Você deseja ir para o menu principal?',
          [
            { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
            { text: 'Ir para o Menu', onPress: () => navigation.navigate('Main') },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleAdvanceTurn = async () => {
    if (turn) {
      const nextTurn = advanceTurn(turn);
      setTurn(nextTurn);

      try {
        await AsyncStorage.setItem('currentTurn', JSON.stringify(nextTurn)); // Salva o turno atualizado
      } catch (error) {
        console.error('Erro ao salvar o turno:', error);
      }
    }
  };

  if (!scenario || !turn) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={scenario.images.flag} style={styles.flagImage} />
        <View style={styles.headerText}>
          <Text style={styles.countryText}>{scenario.name}</Text>
          <Text style={styles.infoText}>PIB: {scenario.details.pib}</Text>
        </View>
        
        <Image source={scenario.leader.image} style={styles.leaderImage} />
      </View>

      <AButtonsGame />  

      <View style={styles.infoBar}>
        <Text>Saldo: {turn.saldoEconomia}</Text>
        <Text>Popularidade: {turn.popularidade}</Text>
        <Text>{`${months[turn.monthIndex]} de ${turn.year}`}</Text>
      </View>

      <TouchableOpacity style={styles.advanceButton} onPress={handleAdvanceTurn}>
        <Text style={styles.advanceButtonText}>Avançar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setIsStatsModalVisible(true)}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
        <View style={styles.footerButtonStatic}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </View>
        <TouchableOpacity style={styles.footerButton} onPress={() => setIsAdviceModalVisible(true)}>
          <Image source={require('../../assets/img/img.png')} style={styles.footerButtonImage} />
        </TouchableOpacity>
      </View>

      <StatsModal
        visible={isStatsModalVisible}
        onClose={() => setIsStatsModalVisible(false)}
        country={scenario.name}
        pib={scenario.details.pib}
        flagImage={scenario.images.flag}
      />
      <AdviceModal
        visible={isAdviceModalVisible}
        onClose={() => setIsAdviceModalVisible(false)}
      />
    </View>
  );
};

export default GameMain;
