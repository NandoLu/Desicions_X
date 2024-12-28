import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countries, Country, Leader } from './countries';
import styles from './NewGame.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../index';
import { useFocusEffect } from '@react-navigation/native';
import { initializeTurn } from './logic/GameLogic'; // Importa a função para inicializar o turno

type NewGameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewGame'>;

interface Props {
  navigation: NewGameScreenNavigationProp;
}

const NewGame: React.FC<Props> = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Main');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const startGame = async (country: Country, leader: Leader) => {
    try {
      const scenario = { ...country, leader };
      const initialTurn = initializeTurn(country.details.year); // Inicializa o turno com o ano do país

      // Salva o cenário e o turno no AsyncStorage
      await AsyncStorage.setItem('currentScenario', JSON.stringify(scenario));
      await AsyncStorage.setItem('currentTurn', JSON.stringify(initialTurn));

      navigation.navigate('GameMain');
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  };

  if (selectedCountry) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Selecione um Líder para {selectedCountry.name}</Text>
        <FlatList
          data={selectedCountry.leaders}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => startGame(selectedCountry, item)} style={styles.itemContainer}>
              <Image source={item.image} style={styles.portraitImage} />
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setSelectedCountry(null)}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um País</Text>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCountry(item)} style={styles.itemContainer}>
            <Image source={item.images.flag} style={styles.flagImage} />
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NewGame;
