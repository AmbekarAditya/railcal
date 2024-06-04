import { StyleSheet ,Platform} from "react-native";
const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  tripContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingHorizontal: 10,
  },
  
  headerCell: {
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  serialNumber: {
    color: 'grey',
  },
  headerDate:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 30 }),
  },
  headerDuration:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 30 }),
  },
  headerAllowance:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 30 }),
  },
  headerRemarks:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 30 }),
  },
  headerActions:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 30 }),
  },
  headerDistance:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 100 }),
  },
  headerTimes:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 130 }),
  },
  headertTypeofWork:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 120 }),
  },
  headerTrainNumber:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 150 }),
  },
  headerStation:
  { 
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
    ...(Platform.OS === "web" && { marginLeft: 150 }),
  },
  dateContainer: {
    flex: 2,
    marginRight: 8,
  },
  dutyTypeContainer: {
    flex: 2,
    ...(Platform.OS === "web" && { marginLeft: 30 , marginBottom:5}),
    marginRight: 8,
  },
  trainNoContainer: {
    flex: 1.5,
    ...(Platform.OS === "web" && { marginLeft: 110 }),
    marginRight: 8,
  },
  stationsContainer: {
    flex: 2.5,
    ...(Platform.OS === "web" && { marginLeft: 110 }),
    marginRight: 8,
  },
  distanceText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 8,
    marginLeft: 20,
  },
  timePickerContainer: {
    flex: 2.5,
    marginRight: 8,
    ...(Platform.OS === "web" && { marginLeft: 100 }),
  },
  durationText: {
    flex: 1.5,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 8,

  },
  allowanceText: {
    flex: 1.5,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 8,
  },
  remarksText: {
    fontWeight: "bold",
    flex: 2,
    marginHorizontal: 8,
  },
  actionsContainer: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  separator: {
    marginVertical: 10,
  },
});
export default styles ;