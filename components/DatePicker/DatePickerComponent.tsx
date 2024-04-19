// DatePickerComponent.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerComponentProps {
  onDateSelected: (date: string) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateSelected }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState('Select Date');

  const handleConfirm = (date: Date) => {
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    setSelectedDateString(formattedDate);
    onDateSelected(formattedDate);
    setDatePickerVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (
    <View style={{ borderWidth: 1, padding: 4 }}>
      <TouchableOpacity onPress={showDatePicker}>
        <Text >{selectedDateString}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

export default DatePickerComponent;