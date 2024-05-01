import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dutyTable: {
    borderCollapse: 'collapse',
    width: '100%',
  },
  dutyTableCell: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    textAlign: 'left',
  },
  dutyTableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  dutySeparator: {
    borderTopWidth: 2,
    borderTopColor: '#999',
    padding: 4,
  },
  dutyTableButton: {
    padding: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4caf50',
    color: 'white',
  },
  tableContainer: {
    overflow: 'scroll',
    maxHeight: '80vh',
    width: '100%',
  },
  tableContainerScrollBar: {
    width: 10,
    height: 10,
  },
  tableContainerScrollBarThumb: {
    backgroundColor: 'darkgrey',
    borderRadius: 10,
  },
  tableContainerScrollBarTrack: {
    backgroundColor: '#f1f1f1',
  },
});