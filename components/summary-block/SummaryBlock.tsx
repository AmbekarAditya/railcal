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
  progressiveDutyHours: number;
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
  progressiveDutyHours,
  dearnessAllowance,
  overtimeResult,
}) => {
  const formatNumber = (value: number | undefined) => {
    return value !== undefined ? value.toFixed(2) : "-";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Summary:</Text>
        <Text style={styles.dates}>
          {startDate} to {endDate}
        </Text>
      </View>
      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainerWrapper}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Hours Worked</Text>
            <Text style={styles.value}>
              {formatNumber(progressiveDutyHours)}H
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Total Allowance:</Text>
            <Text style={styles.value}>₹{formatNumber(totalAllowance)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Total Kilometers:</Text>
            <Text style={styles.value}>{formatNumber(totalKilometers)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Mileage:</Text>
            <Text style={styles.value}>₹{formatNumber(mileage)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Night Duty:</Text>
            <Text style={styles.value}>
              ₹{formatNumber(nightDutyAllowance)}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Dearness Allowance:</Text>
            <Text style={styles.value}>₹{formatNumber(dearnessAllowance)}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Leave Mileage:</Text>
            <Text style={styles.value}>
              ₹{formatNumber(leaveMileageAllowance)}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>RRA / OSDA:</Text>
            <Text style={styles.value}>₹{formatNumber(rraOsda)}</Text>
          </View>
          {/* <View style={styles.infoContainer}>
            <Text style={styles.label}>Over Time:</Text>
            <Text style={styles.value}>₹{formatNumber(overTimeAllowance)}</Text>
          </View> */}
        </View>
        {overtimeResult && (
          <View style={{ flexDirection: "row" }}>
            {overtimeResult.firstFortnight && (
              <View style={styles.overtimeRow}>
                <View style={styles.overtimeInfo}>
                  <Text style={styles.label}>First Fortnight</Text>
                  <Text style={styles.value}>
                    {overtimeResult.firstFortnight.overtimeHours}H{" "}
                    {overtimeResult.firstFortnight.overtimeMinutes}M
                  </Text>
                  <Text style={styles.overtimeUnit}>
                    ({overtimeResult.firstFortnight.overtimeUnit})
                  </Text>
                </View>
                <View style={styles.overtimeDates}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>
                    {formatDate(overtimeResult.firstFortnight.startDate)}
                  </Text>
                  <Text style={styles.label}>End Date:</Text>
                  <Text style={styles.value}>
                    {formatDate(overtimeResult.firstFortnight.endDate)}
                  </Text>
                </View>
              </View>
            )}
            {overtimeResult.secondFortnight && (
              <View style={styles.overtimeRow}>
                <View style={styles.overtimeInfo}>
                  <Text style={styles.label}>Second Fortnight</Text>
                  <Text style={styles.value}>
                    {overtimeResult.secondFortnight.overtimeHours}H{" "}
                    {overtimeResult.secondFortnight.overtimeMinutes}M
                  </Text>
                  <Text style={styles.overtimeUnit}>
                    ({overtimeResult.secondFortnight.overtimeUnit})
                  </Text>
                </View>
                <View style={styles.overtimeDates}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>
                    {formatDate(overtimeResult.secondFortnight.startDate)}
                  </Text>
                  <Text style={styles.label}>End Date:</Text>
                  <Text style={styles.value}>
                    {formatDate(overtimeResult.secondFortnight.endDate)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 1,
    // maxHeight: Dimensions.get("window").height * 0.3, // Increased maxHeight
  },
  headerContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingHorizontal: 2,
    marginLeft: 2,
    paddingTop: 8,
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  dates: {
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  infoContainerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoContainer: {
    marginRight: 24,
    alignItems: "flex-start",
  },
  overtimeContainer: {
    maxHeight: "30%", // Added maxHeight
    flexDirection: "row",
  },
  overtimeRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingHorizontal: 16,
    // paddingVertical: 1,
  },
  overtimeInfo: {
    alignItems: "flex-start",
  },
  overtimeDates: {
    alignItems: "flex-end",
  },
  overtimeUnit: {
    fontSize: 12,
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
