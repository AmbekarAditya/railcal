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
        <View style={styles.column}>
          <Text style={styles.label}>Total Allowance:</Text>
          <Text style={styles.value}>₹{totalAllowance.toFixed(2)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Total Kilometers:</Text>
          <Text style={styles.value}>{totalKilometers.toFixed(2)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Mileage:</Text>
          <Text style={styles.value}>₹{mileage.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Night Duty:</Text>
          <Text style={styles.value}>₹{nightDutyAllowance.toFixed(2)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>National Holiday:</Text>
          <Text style={styles.value}>₹{nationalHolidayAllowance.toFixed(2)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Leave Mileage:</Text>
          <Text style={styles.value}>₹{leaveMileageAllowance.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>RRA / OSDA:</Text>
          <Text style={styles.value}>₹{rraOsda.toFixed(2)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Over Time:</Text>
          <Text style={styles.value}>₹{overTimeAllowance.toFixed(2)}</Text>
        </View>
      </View>
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dates: {
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SummaryBlock;