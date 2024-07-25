
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateContainer: {
    width: 100,
    marginRight: 8,
  },
  dutyTypeContainer: {
    width: 120,
    marginRight: 8,
  },
  trainNoContainer: {
    width: 80,
    marginRight: 8,
  },
  stationsContainer: {
    width: 200,
    marginRight: 8,
  },
  timePickerContainer: {
    width: 160,
    marginRight: 8,
  },
  durationContainer: {
    width: 80,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationLabel: {
    fontSize: 12,
    color: '#666',
  },
  allowanceContainer: {
    width: 80,
    alignItems: 'center',
  },
  allowanceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  allowanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  remarksContainer: {
    width: 120,
    marginRight: 8,
  },
  remarksText: {
    fontSize: 14,
  },
  remarksLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    width: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default styles;