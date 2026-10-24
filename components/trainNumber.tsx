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
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 36,
    width: "100%",
    fontSize: 13,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
});

export default TrainNumberInput;
