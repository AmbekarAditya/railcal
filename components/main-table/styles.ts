import { StyleSheet } from "react-native";

export const colors = {
  primary: "#007AFF",
  border: "#CCCCCC",
  // Add more colors as needed
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: "column",
    flexGrow: 1,
    padding: 16,
  },
  summaryBlockContainer: {
    height: "15%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  tableContainer: {
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
  },
  addDuty: {
    flex: 1,
    marginLeft: 8,
  },
});
