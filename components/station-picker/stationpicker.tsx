import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { combinations } from "../../utils/combinations";
import Duty from "../duty/Duty";

interface PickerComponentStationProps {
  onStationChange: (
    dutyId: number,
    tripId: number,
    sourceStation: string,
    destinationStation: string,
    distance: number
  ) => void;
  dutyId: number;
  tripId: number;
  disabled: boolean;
  duty: Duty;
  initialSourceStation: string;
  initialDestinationStation: string;
}

const PickerComponentStation: React.FC<PickerComponentStationProps> = ({
  onStationChange,
  dutyId,
  tripId,
  disabled,
  duty,
  initialSourceStation,
  initialDestinationStation,
}) => {
  const [fromStation, setFromStation] = useState(initialSourceStation || "");
  const [toStation, setToStation] = useState(initialDestinationStation || "");

  useEffect(() => {
    setFromStation(initialSourceStation || "");
    setToStation(initialDestinationStation || "");
  }, [initialSourceStation, initialDestinationStation]);

  const handleFromStationChange = (selectedStation: string) => {
    setFromStation(selectedStation);
    updateStationAndDistance(selectedStation, toStation);
  };

  const handleToStationChange = (selectedStation: string) => {
    setToStation(selectedStation);
    updateStationAndDistance(fromStation, selectedStation);
  };

  const updateStationAndDistance = (from: string, to: string) => {
    const combo = combinations.find(
      (c) => c.from_station === from && c.to_station === to
    );
    if (combo) {
      onStationChange(dutyId, tripId, from, to, combo.distance);
    }
  };

  const uniqueFromStations = Array.from(
    new Set(combinations.map((item) => item.from_station))
  );

  const renderPicker = (isFrom: boolean) => {
    const label = isFrom ? "From:" : "To:";
    const value = isFrom ? fromStation : toStation;
    const onValueChange = isFrom ? handleFromStationChange : handleToStationChange;
    const items = isFrom
      ? uniqueFromStations
      : combinations.filter((item) => item.from_station === fromStation).map((item) => item.to_station);

    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>{label}</Text>
        {Platform.OS === "web" ? (
          <select
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={disabled}
            style={styles.webSelect}
          >
            <option value="">{isFrom ? "From Station" : "To Station"}</option>
            {items.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        ) : (
          <Picker
            selectedValue={value}
            onValueChange={onValueChange}
            enabled={!disabled}
            style={styles.picker}
          >
            <Picker.Item label={isFrom ? "From Station" : "To Station"} value="" />
            {items.map((station, index) => (
              <Picker.Item key={index} label={station} value={station} />
            ))}
          </Picker>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPicker(true)}
      {renderPicker(false)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  pickerContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    marginBottom: 2,
  },
  picker: {
    height: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  webSelect: {
    width: "100%",
    height: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    fontSize: 12,
  },
});

export default PickerComponentStation;