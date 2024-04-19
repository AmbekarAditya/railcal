import React, { useState } from 'react';
import { View, StyleSheet, Platform,Text } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  onTimeChange: (hour: string, minute: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeChange }) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set') {
      const hour = String(selectedTime?.getHours()).padStart(2, '0');
      const minute = String(selectedTime?.getMinutes()).padStart(2, '0');
      setSelectedHour(hour);
      setSelectedMinute(minute);
      onTimeChange(hour, minute);
    }
    setShowTimePicker(false);
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Picker
          selectedValue={selectedHour}
          style={styles.picker}
          onValueChange={handleHourChange}
        >
          <Picker.Item label="-" value="-" />
          {Array.from({ length: 24 }).map((_, index) => (
            <Picker.Item
              key={index}
              label={String(index).padStart(2, '0')}
              value={String(index).padStart(2, '0')}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedMinute}
          style={styles.picker1}
          onValueChange={handleMinuteChange}
        >
          <Picker.Item label="-" value="-" />
          {Array.from({ length: 60 }).map((_, index) => (
            <Picker.Item
              key={index}
              label={String(index).padStart(2, '0')}
              value={String(index).padStart(2, '0')}
            />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.container}>
        <View onTouchStart={openTimePicker}>
          <View style={styles.timeContainer}>
            <View>
              <Text>{selectedHour || '--'}</Text>
            </View>
            <Text>:</Text>
            <View>
              <Text>{selectedMinute || '--'}</Text>
            </View>
          </View>
        </View>
      </View>
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
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
    height: 25,
  },
  picker1: {
    flex: 1,
    margin: 1,
    height: 25,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default TimePicker;