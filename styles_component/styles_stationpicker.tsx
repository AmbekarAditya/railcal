import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    // paddingVertical: 5,
  },
  pickerContainer: {
    width: 150,
    marginVertical:3,
  },
  picker: {
    width: 150,
    height:25,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    
  },
  IOSpicker: {
    width: 150,
    height:25,
    
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    
  },
  distanceText: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 1,
  },
});

export { styles };