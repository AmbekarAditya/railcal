import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface SummaryBlockProps {
  totalAllowance: number | undefined;
  totalKilometers: number | undefined;
  mileage: number | undefined;
  nightDutyAllowance: number | undefined;
  nationalHolidayAllowance: number | undefined;
  leaveMileageAllowance: number | undefined;
  rraOsda: number | undefined;
  overTimeAllowance: number | undefined;
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
  const formatNumber = (value: number | undefined) => {
    return value !== undefined ? value.toFixed(2) : "-";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Summary:</Text>
      <Text style={styles.dates}>{startDate} to {endDate}</Text>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Total Allowance:</Text>
          <Text style={styles.value}>₹{formatNumber(totalAllowance)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Total Kilometers:</Text>
          <Text style={styles.value}>{formatNumber(totalKilometers)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Mileage:</Text>
          <Text style={styles.value}>₹{formatNumber(mileage)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Night Duty:</Text>
          <Text style={styles.value}>₹{formatNumber(nightDutyAllowance)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>National Holiday:</Text>
          <Text style={styles.value}>₹{formatNumber(nationalHolidayAllowance)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Leave Mileage:</Text>
          <Text style={styles.value}>₹{formatNumber(leaveMileageAllowance)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>RRA / OSDA:</Text>
          <Text style={styles.value}>₹{formatNumber(rraOsda)}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Over Time:</Text>
          <Text style={styles.value}>₹{formatNumber(overTimeAllowance)}</Text>
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