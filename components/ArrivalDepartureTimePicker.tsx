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
      const timeDiff = calculateTimeDifference();
      onTimesChange(arrivalTime, departureTime, timeDiff);
    }
  }, [arrivalTime, departureTime, onTimesChange]);

  const calculateTimeDifference = () => {
    if (!arrivalTime || !departureTime) return '';
    const arrival = new Date(`2021/01/01 ${arrivalTime}`);
    const departure = new Date(`2021/01/01 ${departureTime}`);
    const diff = departure.getTime() - arrival.getTime();  // milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setDepartureTime}
        value={departureTime}
        placeholder="HH:MM"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={setArrivalTime}
        value={arrivalTime}
        placeholder="HH:MM"
        keyboardType="numeric"
      />
      <Text>Time Difference: {calculateTimeDifference()}</Text>
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
