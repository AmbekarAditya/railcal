import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import TimePicker from "./time-picker/TimePicker";

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (
    arrival: string,
    departure: string,
    dutyHours: string
  ) => void;
  disabled: boolean;
  
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({
  onTimesChange,
  disabled,

}) => {
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  useEffect(() => {
    if (arrivalTime && departureTime) {
      const timeDiff = calculateTimeDifference(arrivalTime, departureTime);
      onTimesChange(arrivalTime, departureTime, timeDiff);
    }
  }, [arrivalTime, departureTime]);

  const calculateTimeDifference = (arrival: string, departure: string) => {
    const arrivalDate = new Date(`2021/01/01 ${arrival}`);
    const departureDate = new Date(`2021/01/01 ${departure}`);
    const timeDiff = getTimeDifference(arrivalDate, departureDate);
    const hours = Math.floor(timeDiff / 60);
    const minutes = timeDiff % 60;
    return `${hours}h ${minutes}m`;
  };

  const getTimeDifference = (
    arrivalTime: Date,
    departureTime: Date
  ): number => {
    if (!arrivalTime || !departureTime) {
      return 0;
    }

    // Check if arrival and departure times are equal
    if (arrivalTime.getTime() === departureTime.getTime()) {
      // Special case: both times are at midnight
      if (arrivalTime.getHours() === 0 && arrivalTime.getMinutes() === 0) {
        return 24 * 60;
      }
      return 0;
    }

    if (
      arrivalTime.getHours() === 0 &&
      arrivalTime.getMinutes() === 0 &&
      departureTime.getHours() === 0 &&
      departureTime.getMinutes() === 0
    ) {
      return 24 * 60;
    }

    let adjustedDepartureTime = departureTime;
    if (
      departureTime <= arrivalTime &&
      !(arrivalTime.getHours() === 0 && arrivalTime.getMinutes() === 0)
    ) {
      adjustedDepartureTime = new Date(
        departureTime.getTime() + 24 * 60 * 60 * 1000
      );
    }

    return Math.round(
      (adjustedDepartureTime.getTime() - arrivalTime.getTime()) / 60000
    );
  };

  const handleArrivalTimeChange = (hour: string, minute: string) => {
    setArrivalTime(`${hour}:${minute}`);
  };

  const handleDepartureTimeChange = (hour: string, minute: string) => {
    setDepartureTime(`${hour}:${minute}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Arrival Time:</Text>
        <View style={styles.timePickerWrapper}>
          <TimePicker disabled={disabled} onTimeChange={handleArrivalTimeChange} />
        </View>
      </View>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Departure Time:</Text>
        <View style={styles.timePickerWrapper}>
          <TimePicker disabled={disabled}  onTimeChange={handleDepartureTimeChange} />
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
