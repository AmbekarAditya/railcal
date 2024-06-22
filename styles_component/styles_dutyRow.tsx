import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripsContainer: {
    maxHeight: 300, // Adjust this value as needed
  },
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dateContainer: {
    width: 120,
    marginRight: 5,
  },
  dutyTypeContainer: {
    width: 120,
    marginRight: 5,
  },
  trainNoContainer: {
    width: 80,
    marginRight: 5,
  },
  stationsContainer: {
    width: 200,
    marginRight: 5,
  },
  timePickerContainer: {
    width: 200,
    marginRight: 5,
  },
  durationContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: 5,
  },
  durationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  durationLabel: {
    fontSize: 10,
    color: '#666',
  },
  allowanceContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: 5,
  },
  allowanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  allowanceLabel: {
    fontSize: 10,
    color: '#666',
  },
  remarksContainer: {
    width: 100,
    alignItems: 'center',
    marginRight: 5,
  },
  remarksText: {
    fontSize: 12,
    color: '#333',
  },
  remarksLabel: {
    fontSize: 10,
    color: '#666',
  },
  actionsContainer: {
    width: 60,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  addTripButton: {
    backgroundColor: '#4CAF50',
  },
  endDutyButton: {
    backgroundColor: '#2196F3',
  },
  deleteDutyButton: {
    backgroundColor: '#f44336',
  },
  editDutyButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default styles;