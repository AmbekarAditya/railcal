import React from "react";
import Duty from "./Duty";
import { View, Text, StyleSheet } from "react-native";

interface DutyInfoProps {
  duty: Duty;
}

const DutyInfo: React.FC<DutyInfoProps> = ({ duty }) => {
  console.log('DutyInfo rendering:', duty);
 
  const formatHoursToHHMM = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const decimalHours = hours - wholeHours;
    const minutes = Math.round(decimalHours * 60);
    return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleString('en-NZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const totalDistance = duty.calculateTotalDistance ? duty.calculateTotalDistance() : 0;

  return (
    <View style={styles.main}>
      <View style={styles.dutyInfoContainer}>
        <View style={styles.dutyContent}>
          <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
              <Text style={styles.label}>Sign In</Text>
              <Text style={styles.value}>{formatDate(duty.signIn)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Sign Off</Text>
              <Text style={styles.value}>{formatDate(duty.signOff)}</Text>
            </View>
            <View style={styles.infoBlock}>
            <Text style={styles.label}>Total Km Earned:</Text>
            <Text style={styles.value}>
              {duty.dutyAllowance.toFixed(2)}km
            </Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Total Distance:</Text>
            <Text style={styles.value}>{totalDistance.toFixed(2)} km</Text>
          </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Duty Hours</Text>
              <Text style={styles.value}>
                {formatHoursToHHMM(duty.dutyHours)}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Night Duty Hours :</Text>
              <Text style={styles.value}>
                {formatHoursToHHMM(duty.nightDutyHours)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Progressive Duty Hours</Text>
              <Text style={styles.value}>
                {formatHoursToHHMM(duty.progressiveDutyHours)}
              </Text>
            </View>
            <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
        <Text style={styles.label}>Progressive Night Duty Hours:</Text>
        <Text style={styles.value}>  {formatHoursToHHMM(duty.progressiveNightDutyHours)}</Text>
      </View>
      </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>OSDA</Text>
              <Text style={styles.value}>{duty.isOSDA ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>RRA</Text>
              <Text style={styles.value}>{duty.isRRA ? "Yes" : "No"}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },
  dutyInfoContainer: {
    backgroundColor: "#EDF2F7",
    borderRadius: 12,
    marginTop: 8,
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  dutyContent: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 6,
    width: "100%",
  },
  infoBlock: {
    flex: 1,
    minWidth: "46%",
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E293B",
  },
});

export default DutyInfo;
