import {StyleSheet,    Platform,} from "react-native";
export const styles = StyleSheet.create({
    container: {
      // width: '100%',
      flexDirection: "row",
      // justifyContent: 'center',
      marginTop:15,
      
      ...(Platform.OS === "web" && { marginTop: 10,flex:1 }),
    },
    pickerstation: {
      width: 200,
      borderWidth: 1,
      marginLeft: 40,
      // marginBottom: 200,
      ...(Platform.OS === "web" && { marginTop: 10 }),
      ...(Platform.OS === "android" && { marginBottom: 10 }),
      ...(Platform.OS === "ios" && { marginBottom:200,height:30 }),
      height: 35,
    },
    row: {
      flexDirection: "row",
      
  
    },
    distanceContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 100,
      width: 100,
      
    },
    allowanceContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 60,
      width: 100,
      
    },
    distanceText: {
      ...(Platform.OS === "ios" && { marginBottom: 20 }),
      ...(Platform.OS === "android" && { marginBottom: 20 }),
    },
    allowanceText: {
      ...(Platform.OS === "ios" && { marginBottom: 20 }),
      ...(Platform.OS === "android" && { marginBottom: 20 }),
    },
  });
  