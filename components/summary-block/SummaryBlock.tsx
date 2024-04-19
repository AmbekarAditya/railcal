import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SummaryBlockProps {
  totalAllowance: number;
  totalKilometers: number;
  mileage: number;
  nightDutyAllowance: number;
  nationalHolidayAllowance: number;
  leaveMileageAllowance: number;
  rraOsda: number;
  overTimeAllowance: number;
  startDate: string;
  endDate: string;
}

const SummaryBlock: React.FC<SummaryBlockProps> = ({
  totalAllowance,
  totalKilometers,
  mileage,
  nightDutyAllowance,
  nationalHolidayAllowance,
  leaveMileageAllowance,
  rraOsda,
  overTimeAllowance,
  startDate,
  endDate,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Summary:</Text>
      <Text style={styles.dates}>{startDate} to {endDate}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Total Allowance:</Text>
        <Text style={styles.value}>₹{totalAllowance.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total Kilometers:</Text>
        <Text style={styles.value}>{totalKilometers.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Mileage:</Text>
        <Text style={styles.value}>₹{mileage.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Night Duty Allowance:</Text>
        <Text style={styles.value}>₹{nightDutyAllowance.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>National Holiday Allowance:</Text>
        <Text style={styles.value}>₹{nationalHolidayAllowance.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Leave Mileage Allowance:</Text>
        <Text style={styles.value}>₹{leaveMileageAllowance.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>RRA / OSDA:</Text>
        <Text style={styles.value}>₹{rraOsda.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Over Time Allowance:</Text>
        <Text style={styles.value}>₹{overTimeAllowance.toFixed(2)}</Text>
      </View>
      <Text style={styles.formula}>
        Formula: {totalKilometers.toFixed(2)} 21,258 / 4523 = {(totalKilometers * 21258 / 4523).toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dates: {
    fontSize: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  formula: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default SummaryBlock;