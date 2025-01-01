import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Leader {
  image: any;
}

interface Country {
  name: string;
  details: {
    pib: number;
    year: number;
  };
  images: {
    flag: any;
  };
}

interface Scenario extends Country {
  leader: Leader;
}

interface HeaderProps {
  scenario: Scenario;
}

const Header: React.FC<HeaderProps> = ({ scenario }) => {
  // Função para formatar o valor do PIB
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <View style={styles.header}>
      <Image source={scenario.images.flag} style={styles.flagImage} />
      <View style={styles.headerText}>
        <Text style={styles.countryText}>{scenario.name}</Text>
        <Text style={styles.infoText}>PIB: {formatNumber(scenario.details.pib)} B</Text>
      </View>
      <Image source={scenario.leader.image} style={styles.leaderImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    top: 0,
    marginBottom: '5%',
  },
  flagImage: {
    width: 70,
    height: 40,
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  countryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
  },
  leaderImage: {
    width: 50,
    height: 70,
  },
});

export default Header;
