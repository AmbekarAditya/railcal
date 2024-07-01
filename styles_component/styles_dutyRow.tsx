import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  serialNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tripsContainer: {
    maxHeight: 300, // Adjust this value as needed
  },
  tripContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    width: "10%",
    marginRight: 5,
  },
  dutyTypeContainer: {
    width: "10%",
    marginRight: 5,
  },
  trainNoContainer: {
    width: "15%", // Increased width to provide more space
    marginRight: 5,
  },
  stationsContainer: {
    width: "15%", // Increased width to provide more space
    marginRight: 5,
  },
  timePickerContainer: {
    width: "15%", // Increased width to provide more space
    marginRight: 5,
  },
  durationContainer: {
    width: "8%",
    alignItems: "center",
    marginRight: 5,
  },
  allowanceContainer: {
    width: "8%",
    alignItems: "center",
    marginRight: 5,
  },
  remarksContainer: {
    width: "8%",
    alignItems: "center",
    marginRight: 5,
  },
  actionsContainer: {
    width: "5%",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    width: "50%", // Set to 50% of the row width
  },

  commonButtonStyle: {
    width: 120, // Increased width to accommodate larger text
    height: 40, // Increased height
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Add right margin for spacing between buttons
  },
  button: {
    flex: 0.5, // Adjusted to 30% of the previous length
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 2,
  },
  addTripButton: {
    backgroundColor: "#2196F3",
  },
  endDutyButton: {
    backgroundColor: "#2196F3",
  },
  deleteDutyButton: {
    backgroundColor: "#2196F3",
  },
  editDutyButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14, // Increased font size
  },
});

export default styles;
