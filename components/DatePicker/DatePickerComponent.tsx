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
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
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
        <Text>{selectedDateString}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        isDarkModeEnabled={Platform.OS === 'ios'} // Example of platform-specific property
      />
    </View>
  );
};

export default DatePickerComponent;
