import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";
interface TimePickerProps {
  onTimeChange: (hour: string, minute: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeChange }) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);

  const handleHourChange = (itemValue: string) => {
    setSelectedHour(itemValue);
    if (itemValue !== '-') {
      onTimeChange(itemValue, selectedMinute || '');
    }
  };

  const handleMinuteChange = (itemValue: string) => {
    setSelectedMinute(itemValue);
    if (itemValue !== '-') {
      onTimeChange(selectedHour || '', itemValue);
    }
  };

  return (
    <View style={styles.container}>
      <Picker selectedValue={selectedHour} style={styles.picker} onValueChange={handleHourChange}>
        <Picker.Item label="-" value="-" />
        {Array.from({ length: 24 }).map((_, index) => (
          <Picker.Item key={index} label={String(index).padStart(2, '0')} value={String(index).padStart(2, '0')} />
        ))}
      </Picker>
      <Picker selectedValue={selectedMinute} style={styles.picker1} onValueChange={handleMinuteChange}>
        <Picker.Item label="-" value="-" />
        {Array.from({ length: 60 }).map((_, index) => (
          <Picker.Item key={index} label={String(index).padStart(2, '0')} value={String(index).padStart(2, '0')} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    margin: 1,
    height: 37,
  },
  picker1: {
    flex: 1,
    margin: 1,
    height: 37,
  },
});

export default TimePicker;