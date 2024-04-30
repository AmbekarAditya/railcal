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
    <ScrollView horizontal>
      {/* <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Duty Type</Text>
        <Text style={styles.headerCell}>Train No.</Text>
        <Text style={styles.headerCell}>Stations</Text>
        <Text style={styles.headerCell}>Distance</Text>
        <Text style={styles.headerCell}>Start & End Time</Text>
        <Text style={styles.headerCell}>Duration</Text>
        <Text style={styles.headerCell}>Allowance</Text>
        <Text style={styles.headerCell}>Remarks</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View> */}
      <View>
        {duty.trips.map((trip, index) => (
          <View key={trip.id} style={styles.row}>
            <View style={styles.dateCell}>
              {Platform.OS === "web" ? (
                <WebDatePicker
                  value={trip.date}
                  onChange={(date) =>
                    handleTripDataChange(trip.id, "date", date)
                  }
                />
              ) : (
                <DatePickerComponent
                  onDateSelected={(date) =>
                    handleTripDataChange(trip.id, "date", date)
                  }
                />
              )}
            </View>
            <View style={styles.dutyTypeCell}>
              <TypeofWorkPickerComponent
                TypeofWork={(newValue) =>
                  handleTripDataChange(trip.id, "typeOfWork", newValue)
                }
              />
            </View>
            <View style={styles.trainNoCell}>
              <TrainNumberInput
                onChange={(trainNumber) =>
                  handleTrainNumberChange(trainNumber, duty.id, trip.id)
                }
                disabled={shouldDisableInputFields(trip.typeOfWork)}
                maxLength={7}
              />
            </View>
            <View style={styles.stationsCell}>
              <PickerComponentStation
                onStationChange={handleStationChange}
                dutyId={duty.id}
                tripId={trip.id}
                disabled={shouldDisableInputFields(trip.typeOfWork)}
                maxLength={5}
              />
            </View>
            <Text style={styles.distanceCell}>
              {trip.distance.toFixed(2)}km
            </Text>
            <View style={styles.timePickerCell}>
              <ArrivalDepartureTimePicker
                onTimesChange={(arrivalTime, departureTime, dutyHours) => {
                  handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
                  handleTripDataChange(trip.id, "departureTime", departureTime);
                  handleTripDataChange(trip.id, "dutyHours", dutyHours);
                }}
                disabled={shouldDisableInputFields(trip.typeOfWork)}
              />
            </View>
            <Text style={styles.durationCell}>{trip.dutyHours}</Text>
            <Text style={styles.allowanceCell}>{trip.allowance}₹</Text>
            <Text style={styles.remarksCell}>{trip.remarks}</Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity onPress={() => deleteTrip(duty.id, trip.id)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={styles.buttonsRow}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => deleteDuty(duty.id)}
          >
            <Text>Delete Duty</Text>
          </TouchableOpacity>
        </View>
        <DutyInfo duty={duty} />
        {duty.trips.length > 0 && (
          <View style={styles.separator}>
            <View style={{ height: 1, backgroundColor: "gray" }} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingHorizontal: 10,
  },
  headerCell: {
    fontWeight: "bold",
    paddingVertical: 10,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  separator: {
    margin: 5,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingHorizontal: 10,
  },
  dateCell: {
    width: "10%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dutyTypeCell: {
    width: "20%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  trainNoCell: {
    width: "15%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  stationsCell: {
    width: "25%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  distanceCell: {
    width: "10%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  timePickerCell: {
    width: "25%",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  durationCell: {
    width: "15%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: "center",
    marginHorizontal: 10,
  },
  allowanceCell: {
    width: "15%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    textAlign: "center",
  },
  remarksCell: {
    width: "20%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  actionsCell: {
    width: "10%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  tripCell: {
    width: "10%",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
});
export default DutyRow;
