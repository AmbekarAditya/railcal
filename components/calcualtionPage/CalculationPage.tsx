// CalculationPage.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import MainTable from "../main-table/MainTable";
import { calculationPageStyles as styles } from "./calculationPageStyles";
import { RouteProp } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  CalculationPage: {
    designation: string;
    payBand: number;
    level: number;
    rateOfPay: number;
    selectedMonth: string;
  };
};

type CalculationPageRouteProp = RouteProp<RootStackParamList, 'CalculationPage'>;

interface CalculationPageProps {
  route: CalculationPageRouteProp;
  navigation: NavigationProp<RootStackParamList>;
}

const CalculationPage: React.FC<CalculationPageProps> = ({ route, navigation }) => {
  const { designation, payBand, level, rateOfPay, selectedMonth } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        <MainTable
          navigation={navigation}
          rateOfPay={rateOfPay}
          designation={designation}
          payBand={payBand}
          level={level}
          selectedMonth={selectedMonth}
        />
      </View>
    </ScrollView>
  );
};

export default CalculationPage;
