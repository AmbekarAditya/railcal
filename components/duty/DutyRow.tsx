// DutyRow.tsx
import React, { useEffect } from "react";
import Duty from "./Duty";
import Trip from "../trip/Trip";
import TypeofWorkPickerComponent from "../type-of-work/typeofwork";
import PickerComponentStation from "../station-picker/stationpicker";
import TrainNumberInput from "../trainNumber";
import ArrivalDepartureTimePicker from "../ArrivalDepartureTimePicker";
import DutyInfo from "./DutyInfo";
import calculateAllowanceAndRemarks from "../allowancecalculation/calculateAllowanceAndRemarks";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import WebDatePicker from "../DatePicker/WebDatePicker";
import { Platform, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface DutyRowProps {
  duty: Duty;
  addTrip: (dutyId: number) => void;
  handleEndDuty: (duty: Duty) => void;
  updateTripData: (
    dutyId: number,
    tripId: number,
    field: keyof Trip,
    value: any
  ) => void;
  deleteTrip: (dutyId: number, tripId: number) => void;
  setTotalLeaves: (newTotalLeaves: number) => void;
}

const DutyRow: React.FC<DutyRowProps> = ({
  duty,
  addTrip,
  handleEndDuty,
  updateTripData,
  deleteTrip,
  deleteDuty,
  setTotalLeaves,
}) => {
  const handleTripDataChange = (
    tripId: number,
    field: keyof Trip,
    value: string | number
  ) => {
    const tripIndex = duty.trips.findIndex((trip) => trip.id === tripId);
    const trip = duty.trips[tripIndex];

    // Update the dutyHours for leave types before updating the trip data
    if (field === "typeOfWork") {
      duty.updateDutyHoursForLeaveTypes(value as string);
    }

    // Update the trip data immediately for synchronous processing
    const updatedTrip = { ...trip, [field]: value };
    updateTripData(duty.id, tripId, field, value);

    // Perform calculations only on specific field changes
    if (
      field === "distance" ||
      field === "typeOfWork" ||
      (field === "dutyHours" && value !== "")
    ) {
      const dutyHoursAsNumber = parseFloat(updatedTrip.dutyHours) || 0;

      const { allowance, remarks } = calculateAllowanceAndRemarks(
        updatedTrip.distance,
        updatedTrip.typeOfWork,
        dutyHoursAsNumber * 60
      );

      // shouldDisableInputFields(trip.typeOfWork);
      updateTripData(duty.id, tripId, "allowance", allowance);
      updateTripData(duty.id, tripId, "remarks", remarks);
    }
  };
  const handleStationChange = (
    dutyId: number,
    tripId: number,
    sourceStation: string,
    destinationStation: string,
    distance: number
  ) => {
    updateTripData(dutyId, tripId, "sourceStation", sourceStation);
    updateTripData(dutyId, tripId, "destinationStation", destinationStation);
    updateTripData(dutyId, tripId, "distance", distance);
  };

  const handleTrainNumberChange = (
    trainNumber: string,
    dutyId: number,
    tripId: number
  ) => {
    updateTripData(dutyId, tripId, "trainNumber", trainNumber);
  };

  useEffect(() => {
    duty.trips.forEach((trip) => {
      if (trip.distance > 0 && trip.typeOfWork) {
        const dutyHoursAsNumber = parseFloat(trip.dutyHours) || 0;

        const { allowance, remarks } = calculateAllowanceAndRemarks(
          trip.distance,
          trip.typeOfWork,
          dutyHoursAsNumber * 60
        );

        updateTripData(duty.id, trip.id, "allowance", allowance);
        updateTripData(duty.id, trip.id, "remarks", remarks);
      }
    });
  }, [duty.trips, updateTripData]);

  console.log(duty);

  const shouldDisableInputFields = (typeOfWork: string) => {
    const disabledTypes = [
      "Waiting for duty",
      "Periodic rest",
      "Paid leave",
      "Sick leave",
      "Casual leave",
    ];
    return disabledTypes.includes(typeOfWork);
  };

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { width: 80 }]}>Date</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Duty Type</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Train No.</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Stations</Text>
        <Text style={[styles.headerCell, { width: 60 }]}>Distance</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Start & End Time</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Duration</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Allowance</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Remarks</Text>
        <Text style={[styles.headerCell, { width: 80 }]}>Actions</Text>
      </View>
      {duty.trips.map((trip, index) => (
        <View key={trip.id} style={styles.row}>
          <View style={[styles.cell, { width: 80 }]}>
            {Platform.OS === "web" ? (
              <WebDatePicker
                value={trip.date}
                onChange={(date) => handleTripDataChange(trip.id, "date", date)}
              />
            ) : (
              <DatePickerComponent
                onDateSelected={(date) => handleTripDataChange(trip.id, "date", date)}
              />
            )}
          </View>
          <View style={[styles.cell, { width: 150 }]}>
            <TypeofWorkPickerComponent
              TypeofWork={(newValue) => handleTripDataChange(trip.id, "typeOfWork", newValue)}
            />
          </View>
          <View style={[styles.cell, { width: 80 }]}>
            <TrainNumberInput
              onChange={(trainNumber) => handleTrainNumberChange(trainNumber, duty.id, trip.id)}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              maxLength={7}
              style={{ width: "100%" }}
            />
          </View>
          <View style={[styles.cell, { width: 100 }]}>
            <PickerComponentStation
              onStationChange={handleStationChange}
              dutyId={duty.id}
              tripId={trip.id}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              maxLength={5}
              style={{ width: "100%" }}
            />
          </View>
          <Text style={[styles.cell, styles.boldText, { width: 60 }]}>
            {trip.distance.toFixed(2)}
          </Text>
          <View style={[styles.cell, { width: 120 }]}>
  <ArrivalDepartureTimePicker
    onTimesChange={(arrivalTime, departureTime, dutyHours) => {
      handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
      handleTripDataChange(trip.id, "departureTime", departureTime);
      handleTripDataChange(trip.id, "dutyHours", dutyHours);
    }}
    disabled={shouldDisableInputFields(trip.typeOfWork)}
    style={{ width: '100%' }}
  />
</View>
<Text style={[styles.cell, { width: 80 }]}>{trip.dutyHours}</Text>
<Text style={[styles.cell, { width: 80 }]}>{trip.allowance}</Text>
<Text style={[styles.cell, { width: 120 }]}>{trip.remarks}</Text>
<View style={[styles.cell, { width: 80 }]}>
  <TouchableOpacity onPress={() => deleteTrip(duty.id, trip.id)}>
    <Text>Delete</Text>
  </TouchableOpacity>
</View>
</View>
      ))}
      <View style={styles.row}>
        <View style={styles.cell} colSpan={10}>
          <TouchableOpacity
            onPress={() => addTrip(duty.id)}
            disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
          >
            <Text>Add Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEndDuty(duty)}
            disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
          >
            <Text>End Duty</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteDuty(duty.id)}>
            <Text>Delete Duty</Text>
          </TouchableOpacity>
          <DutyInfo duty={duty} />
        </View>
      </View>
      {duty.trips.length > 0 && (
        <View style={styles.separator}>
          <View style={{ height: 1, backgroundColor: 'gray' }} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  headerCell: {
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  boldText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 8,
  },
});

export default DutyRow;