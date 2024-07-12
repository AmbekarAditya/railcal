import React, { SetStateAction, useState, useEffect } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import { pickerItems } from "../../utils/constants";

interface TypeofWorkPickerComponentProps {
  TypeofWork: (newValue: string) => void;
  initialValue?: string;
}

const TypeofWorkPickerComponent: React.FC<TypeofWorkPickerComponentProps> = ({
  TypeofWork,
  initialValue = "",
}) => {
  const [ChoosenItem, setChoosenItem] = useState(initialValue);

  useEffect(() => {
    if (initialValue && initialValue !== ChoosenItem) {
      setChoosenItem(initialValue);
      TypeofWork(initialValue);
    }
  }, [initialValue, TypeofWork]);

  const commonPickerStyle = {
    height: 40,
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  };

  // iOS-specific picker using RNPickerSelect
  const iosPicker = (
    <RNPickerSelect
      value={ChoosenItem}
      onValueChange={(newValue: SetStateAction<string>) => {
        setChoosenItem(newValue);
        TypeofWork(newValue);
      }}
      items={pickerItems.map((item) => ({
        label: item.label,
        value: item.value,
      }))}
      placeholder={{
        label: "Select Duty Type",
        value: "Select Duty Type",
        color: "#9EA0A4",
      }}
      style={{
        inputIOS: {
          ...commonPickerStyle,
          paddingHorizontal: 10,
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
      style={commonPickerStyle}
    >
      <Picker.Item label="Duty type" value="Select Duty Type" />
      {pickerItems.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? iosPicker : defaultPicker}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default TypeofWorkPickerComponent;
