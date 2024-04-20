import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface TrainNumberInputProps {
  onChange: (trainNumber: string) => void; // Callback to send data to parent
  disabled: boolean; 
}

const TrainNumberInput: React.FC<TrainNumberInputProps> = ({ onChange , disabled}) => {
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
        keyboardType="default"
        editable={!disabled}  // Use the disabled prop to control editability
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
