import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface TrainNumberInputProps {
  onChange: (trainNumber: string) => void;
  disabled: boolean;
  initialValue: string;
}

const TrainNumberInput: React.FC<TrainNumberInputProps> = ({ onChange, disabled, initialValue }) => {
  const [trainNumber, setTrainNumber] = useState(initialValue || '');

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
        keyboardType="default" 
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  input: {
    borderWidth:1,
    padding:5,
    height: 35,
    width: 150,
  }
});

export default TrainNumberInput;
