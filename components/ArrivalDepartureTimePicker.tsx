import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (arrival: string, departure: string, dutyHours: string) => void;
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({ onTimesChange }) => {
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');

  useEffect(() => {
    if (arrivalTime && departureTime) {
      const timeDiff = calculateTimeDifference(arrivalTime, departureTime);
      onTimesChange(arrivalTime, departureTime, timeDiff);
    }
  }, [arrivalTime, departureTime, onTimesChange]);

  const calculateTimeDifference = (arrival: string, departure: string) => {
    const arrivalDate = new Date(`2021/01/01 ${arrival}`);
    const departureDate = new Date(`2021/01/01 ${departure}`);
    const timeDiff = getTimeDifference(arrivalDate, departureDate);
    const hours = Math.floor(timeDiff / 60);
    const minutes = timeDiff % 60;
    return `${hours}h ${minutes}m`;
  };

  const getTimeDifference = (arrivalTime: Date, departureTime: Date): number => {
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
    if (departureTime <= arrivalTime && !(arrivalTime.getHours() === 0 && arrivalTime.getMinutes() === 0)) {
      adjustedDepartureTime = new Date(departureTime.getTime() + 24 * 60 * 60 * 1000);
    }

    return Math.round((adjustedDepartureTime.getTime() - arrivalTime.getTime()) / 60000);
  };

  return (
    <View style={styles.container}>
       <TextInput
        style={styles.input}
        onChangeText={setArrivalTime}
        value={arrivalTime}
        placeholder="HH:MM"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setDepartureTime}
        value={departureTime}
        placeholder="HH:MM"
        keyboardType="numeric"
      />
     
      {/* <Text>Time Difference: {calculateTimeDifference(arrivalTime, departureTime)}</Text> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // Adjust your styling here
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 5,
    width: 100,
  }
});

export default ArrivalDepartureTimePicker;
