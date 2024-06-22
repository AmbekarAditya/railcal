import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serialNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    flex: 1,
    marginRight: 10,
  },
  dutyTypeContainer: {
    flex: 1,
    marginRight: 10,
  },
  trainNoContainer: {
    flex: 1,
    marginRight: 10,
  },
  stationsContainer: {
    flex: 2,
    marginRight: 10,
  },
  timePickerContainer: {
    flex: 2,
    marginRight: 10,
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationLabel: {
    fontSize: 12,
  },
  allowanceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  allowanceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  allowanceLabel: {
    fontSize: 12,
  },
  remarksContainer: {
    flex: 1,
    alignItems: 'center',
  },
  remarksText: {
    fontSize: 14,
  },
  remarksLabel: {
    fontSize: 12,
  },
  actionsContainer: {
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
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
    marginHorizontal: 5,
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
  },
  separator: {
    marginVertical: 10,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'gray',
  },
});

export default styles;