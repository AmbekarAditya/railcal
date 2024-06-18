import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DatePickerComponentProps {
  onDateSelected: (date: string) => void;
  defaultDate: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  onDateSelected,
  defaultDate,
}) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState("Select Date");

  const [selectedDate, setSelectedDate] = useState(new Date(defaultDate)); // Set initial date to defaultDate

  const handleConfirm = (date: Date) => {
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    setSelectedDate(date);
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
        isDarkModeEnabled={Platform.OS === "ios"} // Example of platform-specific property
        date={selectedDate} // Set initial date to selectedDate
      />
    </View>
  );
};

export default DatePickerComponent;
