import React from "react";
import Duty from "./Duty";
import { View, Text, StyleSheet } from "react-native";

interface DutyInfoProps {
  duty: Duty;
}

const DutyInfo: React.FC<DutyInfoProps> = ({ duty }) => {
  const totalDistance = 0 || duty.calculateTotalDistance();
  const formatHoursToHHMM = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const decimalHours = hours - wholeHours;
    const minutes = Math.round(decimalHours * 60);
    return `${wholeHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.main}>
      <View style={styles.dutyInfoContainer}>
        <View style={styles.dutyContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Sign In</Text>
              <Text style={styles.value}>
                {duty.signIn
                  ? duty.signIn.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Sign Off</Text>

              <Text style={styles.value}>
                {duty.signOff
                  ? duty.signOff.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Total Km Earned:</Text>
              <Text style={styles.value}>
                {duty.calculateTotalAllowance().toFixed(2)}km
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
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    margin: 10,
    padding: 8,
    width: "100%",
    maxWidth: "none",
  },
  dutyContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  infoBlock: {
    flexShrink: 0,
    marginRight: 24,
    minWidth: 160,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DutyInfo;
