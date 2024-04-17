import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface TrainNumberInputProps {
  onChange: (trainNumber: string) => void; // Callback to send data to parent
}

const TrainNumberInput: React.FC<TrainNumberInputProps> = ({ onChange }) => {
  const [trainNumber, setTrainNumber] = useState('');

  const handleInputChange = (text: string) => {
    setTrainNumber(text);
    onChange(text); // Propagate the change to the parent component
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={trainNumber}
        placeholder="Enter train number"
        keyboardType="default" // 'default' since it can include numbers and characters
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  input: {
    // Input field styles
  }
});

export default TrainNumberInput;
