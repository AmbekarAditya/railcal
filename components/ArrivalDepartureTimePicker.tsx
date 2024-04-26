import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import TimePicker from "./time-picker/TimePicker";

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (arrivalTime: string, departureTime: string) => void;
  disabled: boolean;
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({
  onTimesChange,
  disabled,
}) => {
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const getTimeDifference = useCallback(
    (arrivalTime: string, departureTime: string): number => {
      if (!arrivalTime || !departureTime) {
        return 0;
      }
  
      const [arrivalHour, arrivalMinute] = arrivalTime.split(":");
      const [departureHour, departureMinute] = departureTime.split(":");
  
      const arrivalDate = new Date(1970, 0, 1, parseInt(arrivalHour), parseInt(arrivalMinute));
      const departureDate = new Date(1970, 0, 1, parseInt(departureHour), parseInt(departureMinute));
  
      let diffInMilliseconds = departureDate.getTime() - arrivalDate.getTime();
  
      // Handle case where departure time is on the next day
      if (diffInMilliseconds < 0) {
        diffInMilliseconds += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
      }
  
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      return diffInHours;
    },
    []
  );

  useEffect(() => {
    if (arrivalTime && departureTime) {
      const dutyHours = getTimeDifference(arrivalTime, departureTime).toString();
      onTimesChange(arrivalTime, departureTime);
    }
  }, [arrivalTime, departureTime,onTimesChange]);

  const handleArrivalTimeChange = (hour: string, minute: string) => {
    const newArrivalTime = `${hour}:${minute}`;
    setArrivalTime(newArrivalTime);
  };

  const handleDepartureTimeChange = (hour: string, minute: string) => {
    const newDepartureTime = `${hour}:${minute}`;
    setDepartureTime(newDepartureTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Arrival Time:</Text>
        <View style={styles.timePickerWrapper}>
          <TimePicker
            disabled={disabled}
            onTimeChange={handleArrivalTimeChange}
          />
        </View>
      </View>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Departure Time:</Text>
        <View style={styles.timePickerWrapper}>
          <TimePicker
            disabled={disabled}
            onTimeChange={handleDepartureTimeChange}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  label: {
    marginTop: 5,
    marginBottom: 5,
  },
  timePickerContainer: {
    alignItems: "center",
  },
  timePickerWrapper: {
    width: 200, // Adjust the width as needed
  },
});

export default ArrivalDepartureTimePicker;