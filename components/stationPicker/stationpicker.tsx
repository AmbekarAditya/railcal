import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { combinations } from "../../utils/combinations";
import { styles } from "../../styles_component/styles_stationpicker";

interface PickerComponentStationProps {
  updateTrip: (dutyIndex: number, tripId: number, field: string, value: any) => void;
  tripId: number;
  dutyIndex: number;
  disabled: boolean;
}

const PickerComponentStation: React.FC<PickerComponentStationProps> = ({
  updateTrip,
  tripId,
  dutyIndex,
  disabled,
}) => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [distance, setDistance] = useState(0);

  const handleStationChange = (stationType: string, selectedStation: string) => {
    const updateField = stationType === "from" ? "sourceStation" : "destinationStation";
    updateTrip(dutyIndex, tripId, updateField, selectedStation);

    const otherStation = stationType === "from" ? toStation : fromStation;
    const searchCriteria = stationType === "from" ? 
      (combo) => combo.from_station === selectedStation && combo.to_station === otherStation :
      (combo: { to_station: string; from_station: string; }) => combo.to_station === selectedStation && combo.from_station === otherStation;

    const foundCombination = combinations.find(searchCriteria);
    if (foundCombination) {
      setDistance(foundCombination.distance);
      updateTrip(dutyIndex, tripId, "distance", foundCombination.distance);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={fromStation}
        onValueChange={(selected) => handleStationChange("from", selected)}
        style={styles.pickerstation}
        enabled={!disabled}
      >
        {Array.from(new Set(combinations.map(item => item.from_station))).map((station, index) => (
          <Picker.Item key={index} label={station} value={station} />
        ))}
      </Picker>
      <Picker
        selectedValue={toStation}
        onValueChange={(selected) => handleStationChange("to", selected)}
        style={styles.pickerstation}
        enabled={!disabled}
      >
        {combinations.filter(item => item.from_station === fromStation).map((item, index) => (
          <Picker.Item key={index} label={item.to_station} value={item.to_station} />
        ))}
      </Picker>
      <Text>Distance: {distance} km</Text>
    </View>
  );
};

export default PickerComponentStation;