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
    return value !== undefined ? value.toFixed(2) : "-";
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
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  headerContainer: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
  },
  grandTotalCard: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});

export default SummaryBlock;
