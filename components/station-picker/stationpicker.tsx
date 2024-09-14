import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
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
  const [fromSearch, setFromSearch] = useState(initialSourceStation || "");
  const [toSearch, setToSearch] = useState(initialDestinationStation || "");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  useEffect(() => {
    setFromStation(initialSourceStation || "");
    setToStation(initialDestinationStation || "");
    setFromSearch(initialSourceStation || "");
    setToSearch(initialDestinationStation || "");
  }, [initialSourceStation, initialDestinationStation]);

  const handleFromStationChange = (selectedStation: string) => {
    setFromStation(selectedStation);
    setFromSearch(selectedStation);
    updateStationAndDistance(selectedStation, toStation);
  };

  const handleToStationChange = (selectedStation: string) => {
    setToStation(selectedStation);
    setToSearch(selectedStation);
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

  const uniqueFromStations = useMemo(() => Array.from(
    new Set(combinations.map((item) => item.from_station))
  ), []);

  const filteredFromStations = useMemo(() => 
    uniqueFromStations.filter(station => 
      station.toLowerCase().includes(fromSearch.toLowerCase())
    ),
    [uniqueFromStations, fromSearch]
  );

  const filteredToStations = useMemo(() => 
    combinations
      .filter(item => item.from_station === fromStation)
      .map(item => item.to_station)
      .filter(station => station.toLowerCase().includes(toSearch.toLowerCase())),
    [fromStation, toSearch]
  );

  const renderSearchBar = (isFrom: boolean) => {
    const label = isFrom ? "From:" : "To:";
    const value = isFrom ? fromSearch : toSearch;
    const setValue = isFrom ? setFromSearch : setToSearch;
    const showSuggestions = isFrom ? showFromSuggestions : showToSuggestions;
    const setShowSuggestions = isFrom ? setShowFromSuggestions : setShowToSuggestions;
    const filteredStations = isFrom ? filteredFromStations : filteredToStations;

    const handleSelect = (station: string) => {
      if (isFrom) {
        handleFromStationChange(station);
      } else {
        handleToStationChange(station);
      }
      setShowSuggestions(false);
    };

    return (
      <View style={styles.searchContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            setShowSuggestions(true);
            if (isFrom) {
              handleFromStationChange(text);
            } else {
              handleToStationChange(text);
            }
          }}
          placeholder={isFrom ? "Search From Station" : "Search To Station"}
          disabled={disabled}
        />
        {showSuggestions && (
          <FlatList
            data={filteredStations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Text style={styles.suggestionItem}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSearchBar(true)}
      {renderSearchBar(false)}
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
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  suggestionList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default PickerComponentStation;