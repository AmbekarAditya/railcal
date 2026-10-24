import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

interface OvertimeCalculationResult {
  firstFortnight?: {
    startDate: string;
    endDate: string;
    overtimeHours: number;
    overtimeMinutes: number;
    overtimeUnit: string;
  };
  secondFortnight?: {
    startDate: string;
    endDate: string;
    overtimeHours: number;
    overtimeMinutes: number;
    overtimeUnit: string;
  };
}

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
  dearnessAllowance: number;
  transportationAllowance: number;
  grandTotalAllowance: number | undefined;
  overtimeResult: OvertimeCalculationResult | null;
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
  dearnessAllowance,
  transportationAllowance,
  grandTotalAllowance,
  overtimeResult,
}) => {
  const formatNumber = (value: number | undefined) => {
    return value !== undefined && !isNaN(value) ? value.toFixed(2) : "0.00";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to convert decimal hours to HH:MM format
  const formatHoursToHHMM = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const decimalHours = hours - wholeHours;
    const minutes = Math.round(decimalHours * 60);
    return `${wholeHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };
  const formatOvertimeDuration = (hours: number, minutes: number) => {
    const totalMinutes = hours * 60 + minutes;
    const formattedHours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const remainingMinutes = totalMinutes % 60;
    const formattedMinutes = remainingMinutes
      .toFixed(2)
      .padStart(4, "0")
      .slice(0, 2);
    return `${formattedHours}:${formattedMinutes}`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Monthly Allowance Summary</Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.statCard}>
          <Text style={styles.label}>Dearness Allowance</Text>
          <Text style={styles.value}>₹{formatNumber(dearnessAllowance)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Transport Allowance</Text>
          <Text style={styles.value}>₹{formatNumber(transportationAllowance)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Kilometers Earned</Text>
          <Text style={styles.value}>{formatNumber(totalAllowance)} km</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Mileage Allowance</Text>
          <Text style={styles.value}>₹{formatNumber(mileage)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Night Duty (NDA)</Text>
          <Text style={styles.value}>₹{formatNumber(nightDutyAllowance)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Leave Mileage</Text>
          <Text style={styles.value}>₹{formatNumber(leaveMileageAllowance)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>RRA / OSDA</Text>
          <Text style={styles.value}>₹{formatNumber(rraOsda)}</Text>
        </View>
      </View>

      <View style={styles.grandTotalCard}>
        <Text style={styles.grandTotalLabel}>Grand Total Allowance</Text>
        <Text style={styles.grandTotalValue}>₹{formatNumber(grandTotalAllowance)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 0,
    backgroundColor: "transparent",
  },
  headerContainer: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    width: "100%",
  },
  statCard: {
    flex: 1,
    minWidth: "46%",
    maxWidth: "49%",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E293B",
  },
  grandTotalCard: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  grandTotalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});

export default SummaryBlock;
