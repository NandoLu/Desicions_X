import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    height: '70%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  scrollContainer: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  chartItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 0,
    borderWidth: 0, // Removendo a borda
    padding: 0, // Removendo o padding
  },
  flagImage: {
    width: 100,
    height: 60,
    marginBottom: 20,
  },
  titleText:{
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    bottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;
