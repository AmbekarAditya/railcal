import React, { useCallback, useEffect, useState } from "react";
import Duty from "./Duty";
import Trip from "../trip/Trip";
import TypeofWorkPickerComponent from "../type-of-work/typeofwork";
import PickerComponentStation from "../station-picker/stationPicker";
import TrainNumberInput from "../trainNumber";
import ArrivalDepartureTimePicker from "../arrivalDepartureTImePIcker/ArrivalDepartureTimePicker";
import DutyInfo from "./DutyInfo";
import calculateAllowanceAndRemarks from "../allowancecalculation/calculateAllowanceAndRemarks";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import WebDatePicker from "../DatePicker/WebDatePicker";
import { monthNames } from "../../utils/constants";

import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import styles from "../../styles_component/styles_dutyRow";
import { disabledTypes } from "../../utils/constants";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

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
  selectedMonth: keyof typeof monthNames; // Update the selectedMonth prop type
}

const DutyRow: React.FC<DutyRowProps> = ({
  duty,
  addTrip,
  handleEndDuty,
  updateTripData,
  deleteTrip,
  deleteDuty,
  setTotalLeaves,
  selectedMonth, // Receive the selectedMonth prop
}) => {
  const [hasEnded, setHasEnded] = useState(duty.hasEnded);

  const handleTripDataChange = (
    tripId: number,
    field: keyof Trip,
    value: any
  ) => {
    const tripIndex = duty.trips.findIndex((trip) => trip.id === tripId);
    const trip = duty.trips[tripIndex];

    const shouldDisableInputFields = (typeOfWork: string) => {
      return disabledTypes.includes(typeOfWork);
    };

    // Update the dutyHours for leave types before updating the trip data
    if (field === "typeOfWork") {
      duty.updateDutyHoursForLeaveTypes(value);

      // Check if the new type is a leave type and the previous type was not
      if (
        shouldDisableInputFields(value) &&
        !shouldDisableInputFields(trip.typeOfWork)
      ) {
        // Reset all values except date
        const updatedTrip = {
          ...trip,
          [field]: value,
          sourceStation: "",
          destinationStation: "",
          distance: 0,
          trainNumber: "",
          arrivalTime: "",
          departureTime: "",
          dutyHours: "",
          allowance: 0,
          remarks: "",
        };
        updateTripData(duty.id, tripId, field, value);
        updateTripData(duty.id, tripId, "sourceStation", "");
        updateTripData(duty.id, tripId, "destinationStation", "");
        updateTripData(duty.id, tripId, "distance", 0);
        updateTripData(duty.id, tripId, "trainNumber", "");
        updateTripData(duty.id, tripId, "arrivalTime", "");
        updateTripData(duty.id, tripId, "departureTime", "");
        updateTripData(duty.id, tripId, "dutyHours", "");
        updateTripData(duty.id, tripId, "allowance", 0);
        updateTripData(duty.id, tripId, "remarks", "");

        // Set duty.hasEnded to true if the new type is a leave type
        duty.hasEnded = true;

        return;
      } else if (shouldDisableInputFields(value)) {
        // Set duty.hasEnded to true if the new type is a leave type
        duty.hasEnded = true;
      } else {
        // Reset duty.hasEnded to false if the new type is not a leave type
        duty.hasEnded = false;
      }
    }

    // Update the trip data
    const updatedTrip = { ...trip, [field]: value };
    updateTripData(duty.id, tripId, field, value);

    // Recalculate allowance and remarks whenever any field that affects the calculation is changed
    const dutyHoursInMinutes = calculateDutyHoursFromTimes(
      updatedTrip.arrivalTime,
      updatedTrip.departureTime
    );

    const { allowance, remarks } = calculateAllowanceAndRemarks(
      updatedTrip.distance,
      updatedTrip.typeOfWork,
      dutyHoursInMinutes
    );

    updateTripData(duty.id, tripId, "allowance", allowance);
    updateTripData(duty.id, tripId, "remarks", remarks);
  };

  const handleTimesChange = useCallback(
    debounce((tripId, arrivalTime, departureTime, dutyHours) => {
      handleTripDataChange(tripId, "arrivalTime", arrivalTime);
      handleTripDataChange(tripId, "departureTime", departureTime);
      handleTripDataChange(tripId, "dutyHours", dutyHours);
    }, 300),
    [handleTripDataChange]
  );

  const calculateDutyHoursFromTimes = (
    arrivalTime: string,
    departureTime: string
  ): number => {
    if (!arrivalTime || !departureTime) {
      return 0;
    }

    const arrival = new Date(`1970-01-01T${arrivalTime}`);
    const departure = new Date(`1970-01-01T${departureTime}`);

    // Check if arrival time is less than departure time
    if (arrival.getTime() > departure.getTime()) {
      // Increment the arrival date by one day
      departure.setDate(departure.getDate() + 1);
    }

    const dutyHoursInMinutes =
      (departure.getTime() - arrival.getTime()) / (1000 * 60);

    return dutyHoursInMinutes;
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

    // Recalculate the allowance based on the new distance
    duty.trips.forEach((trip) => {
      if (trip.id === tripId) {
        const dutyHoursAsNumber = parseFloat(trip.dutyHours) || 0;

        const { allowance, remarks } = calculateAllowanceAndRemarks(
          distance,
          trip.typeOfWork,
          dutyHoursAsNumber * 60
        );

        updateTripData(dutyId, tripId, "allowance", allowance);
        updateTripData(dutyId, tripId, "remarks", remarks);
      }
    });
  };

  const handleTrainNumberChange = (
    trainNumber: string,
    dutyId: number,
    tripId: number
  ) => {
    updateTripData(dutyId, tripId, "trainNumber", trainNumber);
  };

  const handleEditDuty = () => {
    setHasEnded(false);
    duty.hasEnded = false; // Directly modify the duty object
  };

  useEffect(() => {
    duty.trips.forEach((trip) => {
      const dutyHoursInMinutes = calculateDutyHoursFromTimes(
        trip.arrivalTime,
        trip.departureTime
      );

      const { allowance, remarks } = calculateAllowanceAndRemarks(
        trip.distance,
        trip.typeOfWork,
        dutyHoursInMinutes
      );

      updateTripData(duty.id, trip.id, "allowance", allowance);
      updateTripData(duty.id, trip.id, "remarks", remarks);
    });
  }, [
    duty.trips,
    updateTripData,
    duty.id,
    calculateDutyHoursFromTimes,
    calculateAllowanceAndRemarks,
  ]);

  const shouldDisableInputFields = (typeOfWork: string) => {
    return disabledTypes.includes(typeOfWork);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.serialNumber}>{duty.id}</Text>
      </View>
      {duty.trips.map((trip, index) => (
        <View key={trip.id} style={styles.tripContainer}>
          <View style={styles.dateContainer}>
            {Platform.OS === "web" ? (
              <WebDatePicker
                value={
                  trip.date ||
                  `${new Date().getFullYear()}-${String(
                    monthNames[selectedMonth]
                  ).padStart(2, "0")}-01`
                }
                onChange={(date) => handleTripDataChange(trip.id, "date", date)}
                min={`2023-${String(monthNames[selectedMonth]).padStart(
                  2,
                  "0"
                )}-01`}
              />
            ) : (
              <DatePickerComponent
                onDateSelected={(date) =>
                  handleTripDataChange(trip.id, "date", date)
                }
                defaultDate={`${new Date().getFullYear()}-${
                  monthNames[selectedMonth]
                }-01`}
                minimumDate={
                  new Date(
                    `2023-${String(monthNames[selectedMonth]).padStart(
                      2,
                      "0"
                    )}-01`
                  )
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
              duty={duty}
            />
          </View>
          <View style={styles.timePickerContainer}>
            <ArrivalDepartureTimePicker
              onTimesChange={(arrivalTime, departureTime, dutyHours) =>
                handleTimesChange(
                  trip.id,
                  arrivalTime,
                  departureTime,
                  dutyHours
                )
              }
              disabled={shouldDisableInputFields(trip.typeOfWork)}
            />
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{trip.dutyHours}</Text>
            <Text style={styles.durationLabel}>duration</Text>
          </View>
          <View style={styles.allowanceContainer}>
            <Text style={styles.allowanceText}>
              {trip.allowance === 1 ? 0 : trip.allowance.toFixed(2)}
            </Text>
            <Text style={styles.allowanceLabel}>km earned</Text>
          </View>
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksText}>{trip.remarks}</Text>
            <Text style={styles.remarksLabel}>remarks</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => deleteTrip(duty.id, trip.id)}
              disabled={duty.trips.length === 1}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.addTripButton]}
          onPress={() => addTrip(duty.id)}
          disabled={
            duty.hasEnded || shouldDisableInputFields(duty.trips[0].typeOfWork)
          }
        >
          <Text style={styles.buttonText}>Add Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.endDutyButton]}
          onPress={() => handleEndDuty(duty)}
          disabled={
            duty.hasEnded || shouldDisableInputFields(duty.trips[0].typeOfWork)
          }
        >
          <Text style={styles.buttonText}>End Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteDutyButton]}
          onPress={() => deleteDuty(duty.id)}
        >
          <Text style={styles.buttonText}>Delete Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.editDutyButton]}
          onPress={handleEditDuty}
        >
          <Text style={styles.buttonText}>Edit Duty</Text>
        </TouchableOpacity>
      </View>
      {duty.hasEnded && <DutyInfo duty={duty} />}
      {duty.trips.length > 0 && (
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
        </View>
      )}
    </ScrollView>
  );
};

export default DutyRow;
