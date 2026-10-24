import React from "react";
import { View, StyleSheet } from "react-native";
import { levelOptions, payBandOptions, rateOfPayOptions } from "../utils/constants";
import { NeuSelect } from "../src/components/neomorphic/NeuSelect";
import { NeuSpacing } from "../src/theme/neomorphicTheme";

interface InterdependentPickersProps {
  payBand: string;
  setPayBand: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  rateOfPay: string;
  setRateOfPay: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
}

const InterdependentPickers: React.FC<InterdependentPickersProps> = ({
  payBand,
  setPayBand,
  level,
  setLevel,
  rateOfPay,
  setRateOfPay,
}) => {
  const payBandItems = payBandOptions.map((opt) => ({
    label: opt,
    value: opt,
  }));

  const levelItems = (levelOptions[payBand] || []).map((opt) => ({
    label: `Level ${opt}`,
    value: opt,
  }));

  const rateItems = (rateOfPayOptions[level] || []).map((opt) => ({
    label: `₹ ${opt}`,
    value: opt.toString(),
  }));

  return (
    <View style={styles.container}>
      <NeuSelect
        label="Pay Band"
        placeholder="Select Pay Band"
        selectedValue={payBand}
        items={payBandItems}
        onValueChange={(value) => {
          setPayBand(value);
          setLevel("");
          setRateOfPay("");
        }}
      />

      <NeuSelect
        label="Pay Level"
        placeholder={payBand ? "Select Level of Pay" : "Select Pay Band First"}
        selectedValue={level}
        items={levelItems}
        disabled={!payBand}
        onValueChange={(value) => {
          setLevel(value);
          setRateOfPay("");
        }}
      />

      <NeuSelect
        label="Rate of Pay"
        placeholder={level ? "Select Basic Rate of Pay" : "Select Pay Level First"}
        selectedValue={rateOfPay}
        items={rateItems}
        disabled={!level}
        onValueChange={(value) => {
          setRateOfPay(value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default InterdependentPickers;
