// FortnightBlock.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { format } from "date-fns";
import Duty from "../duty/Duty";
import Fortnight from "./Fortnight";

interface FortnightBlockProps {
  selectedMonth: string;
  duties: Duty[];
  rateOfPay: number;
  dearnessAllowance: number;
  transportationAllowance: number;
  totalOvertimeAllowance: number;
  onOvertimeAllowanceChange: (newAllowance: number) => void;
  onFortnightsChange: (fortnights: Fortnight[]) => void;
}

const FORTNIGHT_DATES = [
  new Date("2024-01-01"),
  new Date("2024-01-15"),
  new Date("2024-01-29"),
  new Date("2024-02-12"),
  new Date("2024-02-26"),
  new Date("2024-03-11"),
  new Date("2024-03-25"),
  new Date("2024-04-08"),
  new Date("2024-04-22"),
  new Date("2024-05-06"),
  new Date("2024-05-19"),
  new Date("2024-06-02"),
  new Date("2024-06-16"),
  new Date("2024-06-30"),
  new Date("2024-07-14"),
  new Date("2024-07-28"),
  new Date("2024-08-11"),
  new Date("2024-08-25"),
  new Date("2024-09-08"),
  new Date("2024-09-22"),
  new Date("2024-10-06"),
  new Date("2024-10-20"),
  new Date("2024-11-03"),
  new Date("2024-11-17"),
  new Date("2024-12-01"),
  new Date("2024-12-15"),
  new Date("2024-12-29"),
];

const FortnightBlock: React.FC<FortnightBlockProps> = ({
  selectedMonth,
  duties,
  rateOfPay,
  dearnessAllowance,
  transportationAllowance,
  totalOvertimeAllowance,
  onOvertimeAllowanceChange,
  onFortnightsChange,
}) => {
  const [fortnights, setFortnights] = useState<Fortnight[]>([]);
  const [pastFortnightHours, setPastFortnightHours] = useState(0);
  const [pastFortnightMinutes, setPastFortnightMinutes] = useState(0);

  useEffect(() => {
    const pastFortnight = pastFortnightHours + pastFortnightMinutes / 60;
    recalculateFortnights(pastFortnight);
    onFortnightsChange(fortnights);
  }, [selectedMonth, duties, pastFortnightHours, pastFortnightMinutes]);

  const recalculateFortnights = (pastFortnight: number) => {
    const monthIndex = new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth();
    const startDate = new Date(2024, monthIndex, 1);
    const endDate = new Date(2024, monthIndex + 1, 0);
  
    // Sort duties by start date in ascending order
    const sortedDuties = [...duties].sort((a, b) => {
      const aStartDate = a.signIn ? new Date(a.signIn) : new Date(a.trips[0].date);
      const bStartDate = b.signIn ? new Date(b.signIn) : new Date(b.trips[0].date);
      return aStartDate.getTime() - bStartDate.getTime();
    });
  
    const intersectingFortnights: Fortnight[] = FORTNIGHT_DATES.filter(
      (date) => {
        const fortnightEnd = new Date(date);
        fortnightEnd.setDate(fortnightEnd.getDate() + 13);
        return date <= endDate && fortnightEnd >= startDate;
      }
    ).map((startDate, index) => {
      const endDate = new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000);
  
      let totalForthnightDuration = index === 0 ? pastFortnight : 0;
  
      sortedDuties.forEach((duty) => {
        let dutyStart;
        if (duty.isLeave && duty.trips.length > 0) {
          dutyStart = new Date(duty.trips[0].date);
        } else {
          dutyStart = new Date(duty.signIn);
        }
        if (dutyStart >= startDate && dutyStart <= endDate) {
          const dutyHours =
            duty.dutyHours && !isNaN(duty.dutyHours)
              ? parseFloat(duty.dutyHours)
              : 0;
          totalForthnightDuration += dutyHours;
          duty.progressiveDutyHours = totalForthnightDuration;
        }
      });

      const basicPlusDAPlusTA =
        rateOfPay +
        dearnessAllowance +
        transportationAllowance +
        rateOfPay * 0.3;
      const lowerRate = (basicPlusDAPlusTA * 1.5) / 223;
      const higherRate = (basicPlusDAPlusTA * 2) / 223;

      let overtimeAllowance = 0;
      let totalOvertimeHours = 0;
  
      if (totalForthnightDuration > 104) {
        const overtimeHours = totalForthnightDuration - 104;
  
        if (overtimeHours <= 4) {
          overtimeAllowance = overtimeHours * lowerRate;
        } else {
          overtimeAllowance = 4 * lowerRate + (overtimeHours - 4) * higherRate;
        }
  
        totalOvertimeHours = overtimeHours;
      }

      return new Fortnight(
        startDate,
        endDate,
        totalForthnightDuration,
        overtimeAllowance,
        totalOvertimeHours
      );
    });

    const totalOvertimeAllowance = intersectingFortnights.reduce(
      (total, fortnight) => total + fortnight.overtimeAllowance,
      0
    );

    setFortnights(intersectingFortnights);
    onOvertimeAllowanceChange(totalOvertimeAllowance);
  };

  // const handleApply = () => {
  //   const hours = Number(inputHours);
  //   setInputHours(hours);
  // };

  const handlePastFortnightHoursChange = (text: string) => {
    const hours = parseInt(text, 10);
    if (!isNaN(hours) && hours >= 0 && hours <= 200) {
      setPastFortnightHours(hours);
      recalculateFortnights(hours + pastFortnightMinutes / 60);
    } else {
      setPastFortnightHours(0);
      recalculateFortnights(pastFortnightMinutes / 60);
    }
  };
  
  const handlePastFortnightMinutesChange = (text: string) => {
    const minutes = parseInt(text, 10);
    if (!isNaN(minutes) && minutes >= 0 && minutes <= 59) {
      setPastFortnightMinutes(minutes);
      recalculateFortnights(pastFortnightHours + minutes / 60);
    } else {
      setPastFortnightMinutes(0);
      recalculateFortnights(pastFortnightHours);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fortnights in {selectedMonth}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Past Fortnight Duration</Text>
        <View style={styles.durationInputContainer}>
          <TextInput
            style={styles.durationInput}
            value={pastFortnightHours.toString()}
            keyboardType="numeric"
            onChangeText={handlePastFortnightHoursChange}
            maxLength={3}
          />
          <Text style={styles.durationSeparator}>:</Text>
          <TextInput
            style={styles.durationInput}
            value={pastFortnightMinutes.toString()}
            keyboardType="numeric"
            onChangeText={handlePastFortnightMinutesChange}
            maxLength={2}
          />
        </View>
      </View>
      <ScrollView horizontal contentContainerStyle={styles.fortnightsContainer}>
        {fortnights.map((fortnight, index) => (
          <View key={index} style={styles.fortnight}>
            <Text style={styles.fortnightText}>
              {format(fortnight.startDate, "dd MMM")} -{" "}
              {format(fortnight.endDate, "dd MMM")}
            </Text>
            <Text style={styles.fortnightText}>
              Total Hours:{" "}
              {fortnight.totalForthnightDuration
                ? fortnight.totalForthnightDuration.toFixed(2)
                : "0.00"}
            </Text>
            <Text style={styles.fortnightText}>
              Overtime Hours: {fortnight.totalOvertimeHours.toFixed(2)}
            </Text>
            <Text style={styles.fortnightText}>
              Overtime Allowance:{" "}
              {fortnight.overtimeAllowance
                ? fortnight.overtimeAllowance.toFixed(2)
                : "0.00"}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.totalText}>
        Total Overtime Allowance:{" "}
        {totalOvertimeAllowance ? totalOvertimeAllowance.toFixed(2) : "0.00"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  fortnightText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
  },
  fortnightsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  fortnight: {
    minWidth: 120,
    padding: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    marginRight: 8,
  },
  durationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationInput: {
    width: 40,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    textAlign: "center",
  },
  durationSeparator: {
    fontSize: 18,
    marginHorizontal: 4,
  },
});

export default FortnightBlock;
