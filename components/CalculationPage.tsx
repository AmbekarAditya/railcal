import React from "react";
import { View, Text } from "react-native";
import MainTable from "./main-table/MainTable";
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
      <MainTable navigation={navigation} payband={23}/>
    </View>
  );
};

export default CalculationPage;
