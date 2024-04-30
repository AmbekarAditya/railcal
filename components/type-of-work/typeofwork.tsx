import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {pickerItems} from "../../utils/constants";

interface TypeofWorkPickerComponentProps {
  TypeofWork: (newValue: string) => void;
}

const TypeofWorkPickerComponent: React.FC<TypeofWorkPickerComponentProps> = ({ TypeofWork }) => {
  const [ChoosenItem, setChoosenItem] = useState("");

  return (
    <View>
      <Picker
        selectedValue={ChoosenItem}
        onValueChange={(newValue, index) => {
          setChoosenItem(newValue);
          TypeofWork(newValue);
        }}
        style={{
          height: 35,
          width: 130,
          margin: 10,
          ...(Platform.OS === "ios" && { marginBottom: 197, height: 30 }),
          ...(Platform.OS === "android" && { width: 250, marginBottom: 30 }),
        }}
      >
        <Picker.Item label="Duty type" value="Select Duty Type" />
        {pickerItems.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

export default TypeofWorkPickerComponent;