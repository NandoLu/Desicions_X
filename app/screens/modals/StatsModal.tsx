import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../../styles/ModalsFooterStyles';

interface StatsModalProps {
  visible: boolean;
  onClose: () => void;
  country: string;
  pib: number;
  flagImage: any;
  saldoEconomia?: number[];
  popularidade?: number[];
}

const StatsModal: React.FC<StatsModalProps> = ({ visible, onClose, pib, flagImage, saldoEconomia = [], popularidade = [] }) => {
  const screenWidth = Dimensions.get('window').width;

  const [storedSaldoEconomia, setStoredSaldoEconomia] = useState<number[]>([]);
  const [storedPopularidade, setStoredPopularidade] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      // Função para carregar os dados armazenados
      const loadStoredData = async () => {
        try {
          const storedSaldo = await AsyncStorage.getItem('saldoEconomia');
          const storedPop = await AsyncStorage.getItem('popularidade');
          if (storedSaldo) {
            setStoredSaldoEconomia(JSON.parse(storedSaldo));
          } else {
            await AsyncStorage.setItem('saldoEconomia', JSON.stringify(saldoEconomia));
            setStoredSaldoEconomia(saldoEconomia);
          }
          if (storedPop) {
            setStoredPopularidade(JSON.parse(storedPop));
          } else {
            await AsyncStorage.setItem('popularidade', JSON.stringify(popularidade));
            setStoredPopularidade(popularidade);
          }
        } catch (error) {
          console.log('Erro ao carregar os dados armazenados:', error);
        }
      };

      loadStoredData();
    }
  }, [visible, saldoEconomia, popularidade]);

  useEffect(() => {
    if (visible) {
      // Função para salvar os dados no AsyncStorage se ainda não existirem
      const saveData = async () => {
        try {
          if (saldoEconomia.length > 0) {
            await AsyncStorage.setItem('saldoEconomia', JSON.stringify(saldoEconomia));
          }
          if (popularidade.length > 0) {
            await AsyncStorage.setItem('popularidade', JSON.stringify(popularidade));
          }
        } catch (error) {
          console.log('Erro ao salvar os dados:', error);
        }
      };

      saveData();
    }
  }, [visible, saldoEconomia, popularidade]);

  const fullSaldoEconomia = useMemo(() => [...Array(16 - (storedSaldoEconomia.length || saldoEconomia.length)).fill(0), ...(storedSaldoEconomia.length ? storedSaldoEconomia : saldoEconomia)], [storedSaldoEconomia, saldoEconomia]);

  const fullPopularidade = useMemo(() => [...Array(16 - (storedPopularidade.length || popularidade.length)).fill(0), ...(storedPopularidade.length ? storedPopularidade : popularidade)], [storedPopularidade, popularidade]);

  const labels = useMemo(() => fullSaldoEconomia.map((_, index) => `T${index + 1}`), [fullSaldoEconomia]);

  const saldoEconomiaData = useMemo(() => ({
    labels: labels,
    datasets: [
      {
        data: fullSaldoEconomia.map(val => Math.round(val)),
        color: (opacity = 1) => fullSaldoEconomia[fullSaldoEconomia.length - 1] === 0 ? `rgba(255, 0, 0, ${opacity})` : `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 1
      }
    ]
  }), [labels, fullSaldoEconomia]);

  const popularidadeData = useMemo(() => ({
    labels: labels,
    datasets: [
      {
        data: fullPopularidade.map(val => Math.round(val)),
        color: (opacity = 1) => fullPopularidade[fullPopularidade.length - 1] === 0 ? `rgba(255, 0, 0, ${opacity})` : `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 1
      }
    ]
  }), [labels, fullPopularidade]);

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '1.5',
      strokeWidth: '0.5',
      stroke: '#ffa726'
    },
    propsForBackgroundLines: {
      strokeDasharray: '4',
      strokeWidth: 1,
      stroke: 'gray'
    },
    propsForLabels: {
      fontSize: 5
    }
  };

  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={flagImage} style={styles.flagImage} />
          <Text style={styles.infoText}>PIB: {pib}</Text>
          <ScrollView horizontal={true} style={styles.scrollView} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.chartContainer}>
              <View style={styles.chartItem}>
                <Text style={styles.chartTitle}>Saldo Econômico</Text>
                <LineChart
                  data={saldoEconomiaData}
                  width={screenWidth - 80}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              </View>
              <View style={styles.chartItem}>
                <Text style={styles.chartTitle}>Popularidade</Text>
                <LineChart
                  data={popularidadeData}
                  width={screenWidth - 80}
                  height={200}
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                />
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default StatsModal;
