import React from "react";
import { View, Text } from "react-native";
// import MainTable from "../secondscreen/calcualtionPage/main/calculationPage";
import { calculationPageStyles as styles } from "./calculationPageStyles";

const CalculationPage = ({ route, navigation }) => {
  const { designation, payBand, level, rateOfPay, selectedMonth } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.row}>
          <Text style={styles.text}>Month: {selectedMonth}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Designation: {designation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>Level: {level}</Text>
          <Text style={styles.text}>Pay Band: {payBand}</Text>
          <Text style={styles.text}>Rate of Pay: {rateOfPay}</Text>
        </View>
      </View>
      {/* <MainTable navigation={navigation} designation={designation} rateOfPay={rateOfPay}/> */}
    </View>
  );
};

export default CalculationPage;
