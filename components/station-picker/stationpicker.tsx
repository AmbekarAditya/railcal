import React, { useState, useEffect } from "react";
import { View, Platform, StyleSheet } from "react-native";
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
}

const PickerComponentStation: React.FC<PickerComponentStationProps> = ({
  onStationChange,
  dutyId,
  tripId,
  disabled,
  duty,
}) => {
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");

  const currentTripIndex = duty.trips.findIndex((trip) => trip.id === tripId);
  const previousTrip =
    currentTripIndex > 0 ? duty.trips[currentTripIndex - 1] : null;
  const previousTripDestinationStation = previousTrip
    ? previousTrip.destinationStation
    : "";

  useEffect(() => {
    setFromStation(previousTripDestinationStation || "");
  }, [previousTripDestinationStation]);

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
          <Picker.Item label="From Station" value="" />
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
          <Picker.Item label="To Station" value="" />
          {combinations
            .filter((item) => item.from_station === fromStation)
            .map((item, index) => (
              <Picker.Item
                key={index}
                label={item.to_station}
                value={item.to_station}
              />
            ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  picker: {
    height: 40,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default PickerComponentStation;
