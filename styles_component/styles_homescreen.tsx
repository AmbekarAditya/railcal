
import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  homepageFlexBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  homepageBg: {
    marginTop: 30,
  },
  allowanceCalculator1: {
    fontSize: 26,
    color: "#000",
    textAlign: "center",
    alignSelf: "stretch",
  },
  allowanceCalculator: {
    alignSelf: "stretch",
  },
  homepageChild: {
    marginTop: 52,
    ...(Platform.OS === "ios" && {
      overflow: "hidden",
      justifyContent: "center",
    }),
    display: "flex",
    width: 350,
    height: 60,
  },
  homepageItem: {
    marginTop: 52,
    display: "flex",
    ...(Platform.OS === "ios" && { overflow: "hidden" }),
    justifyContent: "center",
    width: 350,
    height: 60,
  },
  homepageInner: {
    width: 350,
    ...(Platform.OS === "ios" && { overflow: "hidden" }),
    display: "flex",
    justifyContent: "center",
  },
  rectanglePressable: {
    width: 180,
    margin: 10,
    height: 40,
    backgroundColor: "#11c2f7",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  proceedText: {
    fontWeight: "600",
    color: "#fff",
  },
  homepage: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    height: 855,
    overflow: "hidden",
    paddingHorizontal: 93,
    paddingVertical: 82,
  },
});
