// InterdependentPicker.tsx
import React from "react";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { levelOptions,payBandOptions,rateOfPayOptions } from "../utils/constants";

interface InterdependentPickersProps {
  payBand: string;
  setPayBand: React.Dispatch<React.SetStateAction<string>>;
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  rateOfPay: string;
  setRateOfPay: React.Dispatch<React.SetStateAction<string>>;
}

const InterdependentPickers: React.FC<InterdependentPickersProps> = ({
  payBand,
  setPayBand,
  level,
  setLevel,
  rateOfPay,
  setRateOfPay,
}) => {
 
  return (
    <View style={{ display: "flex", justifyContent: "center" }}>
      <View
        style={{
          display: "flex",
          ...(Platform.OS === "ios" && {
            overflow: "hidden",
            justifyContent: "center",
          }),
          width: 350,
          height: 60,
        }}
      >
        <Picker
          style={{
            height: 40,
            ...(Platform.OS === "ios" && { marginBottom: 180 }),
          }}
          selectedValue={payBand}
          onValueChange={(value) => {
            setPayBand(value);
            setLevel("");
            setRateOfPay("");
          }}
        >
          <Picker.Item label="Select Pay Band" value="" />
          {payBandOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      <View
        style={{
          ...(Platform.OS === "ios" && {
            overflow: "hidden",
            justifyContent: "center",
          }),
          display: "flex",
          width: 350,
          marginTop: 20,
          height: 60,
        }}
      >
        <Picker
          style={{
            height: 40,
            ...(Platform.OS === "ios" && { marginBottom: 180 }),
          }}
          selectedValue={level}
          onValueChange={(value) => {
            setLevel(value);
            setRateOfPay("");
          }}
        >
          <Picker.Item label="Select Level of Pay" value="" />
          {(levelOptions[payBand] || []).map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      <View
        style={{
          display: "flex",
          ...(Platform.OS === "ios" && {
            overflow: "hidden",
            justifyContent: "center",
          }),
          width: 350,
          marginTop: 20,
          height: 60,
        }}
      >
        <Picker
          style={{
            height: 40,
            ...(Platform.OS === "ios" && { marginBottom: 180 }),
          }}
          selectedValue={rateOfPay}
          onValueChange={setRateOfPay}
        >
          <Picker.Item label="Select Rate of Pay" value="" />
          {(rateOfPayOptions[level] || []).map((option, index) => (
            <Picker.Item
              key={index}
              label={option.toString()}
              value={option.toString()}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default InterdependentPickers;
