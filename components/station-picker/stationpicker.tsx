import React, { useState, useEffect } from "react";
import { View, Text, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { combinations } from "../../utils/combinations";
import { styles } from "../../styles_component/styles_stationpicker";

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
}

const PickerComponentStation: React.FC<PickerComponentStationProps> = ({
  onStationChange,
  dutyId,
  tripId,
  disabled,
}) => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [distance, setDistance] = useState(0);

  const handleFromStationChange = (selectedStation: string) => {
    setFromStation(selectedStation);
    updateToStationAndDistance(selectedStation, toStation);
  };

  const handleToStationChange = (selectedStation: string) => {
    setToStation(selectedStation);
    updateToStationAndDistance(fromStation, selectedStation);
  };

  const updateToStationAndDistance = (from: string, to: string) => {
    const combo = combinations.find(
      (c) => c.from_station === from && c.to_station === to
    );
    if (combo) {
      setDistance(combo.distance);
      onStationChange(dutyId, tripId, from, to, combo.distance);
    }
  };

  const uniqueFromStations = Array.from(
    new Set(combinations.map((item) => item.from_station))
  );

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fromStation}
          onValueChange={handleFromStationChange}
          enabled={!disabled}
          style={styles.picker}
        >
          {uniqueFromStations.map((station, index) => (
            <Picker.Item key={index} label={station} value={station} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={toStation}
          onValueChange={handleToStationChange}
          enabled={!disabled}
          style={styles.picker}
        >
          {combinations
            .filter((item) => item.from_station === fromStation)
            .map((item, index) => (
              <Picker.Item key={index} label={item.to_station} value={item.to_station} />
            ))}
        </Picker>
      </View>
      {/* <Text style={styles.distanceText}>Distance: {distance} km</Text> */}
    </View>
  );
};

export default PickerComponentStation;