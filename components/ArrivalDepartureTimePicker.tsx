import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import TimePicker from "./time-picker/TimePicker";

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (arrivalTime: string, departureTime: string, dutyHours: string) => void;
  disabled: boolean;
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({
  onTimesChange,
  disabled,
}) => {
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [timeDifference, setTimeDifference] = useState("");

  const calculateTimeDifference = useCallback(
    (arrival: string, departure: string) => {
      const arrivalDate = new Date(`2021/01/01 ${arrival}`);
      const departureDate = new Date(`2021/01/01 ${departure}`);
      const timeDiff = getTimeDifference(arrivalDate, departureDate);
      return timeDiff;
    },
    []
  );

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

    let timeDiff = departureTime.getTime() - arrivalTime.getTime();

    // If the departure time is earlier than the arrival time, add 24 hours
    if (timeDiff < 0) {
      timeDiff += 24 * 60 * 60 * 1000;
    }

    return Math.round(timeDiff / 60000);
  };

  useEffect(() => {
    if (arrivalTime && departureTime) {
      const calculatedTimeDifference = calculateTimeDifference(arrivalTime, departureTime);
      onTimesChange(arrivalTime, departureTime, calculatedTimeDifference);
    }
  }, [arrivalTime, departureTime, onTimesChange, calculateTimeDifference]);

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