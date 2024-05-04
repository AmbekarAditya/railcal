import React, { SetStateAction, useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { pickerItems } from '../../utils/constants';

interface TypeofWorkPickerComponentProps {
  TypeofWork: (newValue: string) => void;
}

const TypeofWorkPickerComponent: React.FC<TypeofWorkPickerComponentProps> = ({ TypeofWork }) => {
  const [ChoosenItem, setChoosenItem] = useState('');

  // iOS-specific picker using RNPickerSelect
  const iosPicker = (
    <RNPickerSelect
      value={ChoosenItem}
      onValueChange={(newValue: SetStateAction<string>) => {
        setChoosenItem(newValue);
        TypeofWork(newValue);
      }}
      items={pickerItems.map(item => ({ label: item.label, value: item.value }))}
      placeholder={{ label: 'Select Duty Type', value: 'Select Duty Type', color: '#9EA0A4' }}
      style={{
        inputIOS: {
          height: 30,
          width: 180,
          margin: 10,
          backgroundColor: 'white',
          borderWidth:1,
        },
      }}
    />
  );

  // Android and potentially web picker using the default Picker
  const defaultPicker = (
    <Picker
      selectedValue={ChoosenItem}
      onValueChange={(newValue) => {
        setChoosenItem(newValue);
        TypeofWork(newValue);
      }}
      style={{
        height: 30,
        width: 180,
        margin: Platform.OS === 'web' ? 10 : 0,
        marginBottom: Platform.OS === 'android' ? 20 : 0
      }}
    >
      <Picker.Item label="Duty type" value="Select Duty Type" />
      {pickerItems.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? iosPicker : defaultPicker}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    
  },
});

export default TypeofWorkPickerComponent;
