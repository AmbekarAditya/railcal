// WebDatePicker.tsx
import React, { ChangeEvent } from 'react';
import { StyleProp, ViewStyle ,StyleSheet} from 'react-native';

interface WebDatePickerProps {
  style?: StyleProp<ViewStyle>;
  value: string;
  onChange: (date: string) => void;
}

const WebDatePicker: React.FC<WebDatePickerProps> = ({ style, value, onChange }) => {
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="date"
      value={value}
      onChange={handleDateChange}
      style={styles.date}
    />
  );
};

const styles = StyleSheet.create({
    date: {
      height:30, // Adjust as needed
    },
  });
export default WebDatePicker;