import React, { useEffect } from "react";
import Duty from "./Duty";
import Trip from "../trip/Trip";
import TypeofWorkPickerComponent from "../type-of-work/typeofwork";
import PickerComponentStation from "../station-picker/stationpicker";
import TrainNumberInput from "../trainNumber";
import ArrivalDepartureTimePicker from "../arrivalDepartureTImePIcker/ArrivalDepartureTimePicker";
import DutyInfo from "./DutyInfo";
import calculateAllowanceAndRemarks from "../allowancecalculation/calculateAllowanceAndRemarks";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import WebDatePicker from "../DatePicker/WebDatePicker";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";

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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {duty.trips.map((trip, index) => (
        <View key={trip.id} style={styles.tripContainer}>
          <View style={styles.dateContainer}>
            {Platform.OS === "web" ? (
              <WebDatePicker
                value={trip.date}
                onChange={(date) => handleTripDataChange(trip.id, "date", date)}
              />
            ) : (
              <DatePickerComponent
                onDateSelected={(date) =>
                  handleTripDataChange(trip.id, "date", date)
                }
              />
            )}
          </View>
          <View style={styles.dutyTypeContainer}>
            <TypeofWorkPickerComponent
              TypeofWork={(newValue) =>
                handleTripDataChange(trip.id, "typeOfWork", newValue)
              }
            />
          </View>
          <View style={styles.trainNoContainer}>
            <TrainNumberInput
              onChange={(trainNumber) =>
                handleTrainNumberChange(trainNumber, duty.id, trip.id)
              }
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              maxLength={7}
            />
          </View>
          <View style={styles.stationsContainer}>
            <PickerComponentStation
              onStationChange={handleStationChange}
              dutyId={duty.id}
              tripId={trip.id}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              maxLength={5}
            />
          </View>
          <Text style={styles.distanceText}>{typeof trip.distance === 'number' ? trip.distance.toFixed(2) : trip.distance}km</Text>
          <View style={styles.timePickerContainer}>
            <ArrivalDepartureTimePicker
              onTimesChange={(arrivalTime, departureTime, dutyHours) => {
                handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
                handleTripDataChange(trip.id, "departureTime", departureTime);
                handleTripDataChange(trip.id, "dutyHours", dutyHours);
              }}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
            />
          </View>
          <Text style={styles.durationText}>{trip.dutyHours}</Text>
          <Text style={styles.allowanceText}>{trip.allowance}₹</Text>
          <Text style={styles.remarksText}>{trip.remarks}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => deleteTrip(duty.id, trip.id)}    disabled={duty.trips.length === 1} >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { marginLeft: 3, marginRight: 10 }]}
          onPress={() => addTrip(duty.id)}
          disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
        >
          <Text>Add Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginRight: 10 }]}
          onPress={() => handleEndDuty(duty)}
          disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
        >
          <Text>End Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => deleteDuty(duty.id)} >
          <Text>Delete Duty</Text>
        </TouchableOpacity>
      </View>
      <DutyInfo duty={duty} />
      {duty.trips.length > 0 && (
        <View style={styles.separator}>
          <View style={{ height: 1, backgroundColor: "gray" }} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  tripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  dateContainer: {
    flex: 2,
    marginRight: 8,
    
  },
  dutyTypeContainer: {
    flex: 2,
    ...(Platform.OS === "web" && { marginLeft: 30 }),
    marginRight: 8,
  },
  trainNoContainer: {
    flex: 1.5,
    ...(Platform.OS === "web" && { marginLeft: 110 }),
    marginRight: 8,
  },
  stationsContainer: {
    flex: 2.5,
    ...(Platform.OS === "web" && { marginLeft: 110 }),
    marginRight: 8,
  },
  distanceText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 8,
    marginLeft: 20,
  },
  timePickerContainer: {
    flex: 2.5,
    marginRight: 8,
    ...(Platform.OS === "web" && { marginLeft: 100 }),
  },
  durationText: {
    flex: 1.5,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  allowanceText: {
    flex: 1.5,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  remarksText: {
    flex: 2,
    marginHorizontal: 8,
  },
  actionsContainer: {
    flex: 1,
    margin:5,
    alignItems:'center',
    borderWidth:1,
    padding:5,
    borderRadius :5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft:10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  separator: {
    marginVertical: 10,
  },
});
export default DutyRow;
