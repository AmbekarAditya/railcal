import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
import { monthNames, disabledTypes } from "../../utils/constants";
import styles from "../../styles_component/styles_dutyRow";

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
  deleteDuty: (dutyId: number) => void;
  setTotalLeaves: (newTotalLeaves: number) => void;
  selectedMonth: keyof typeof monthNames; // Update the selectedMonth prop type
  initialFromStation: string;
  initialToStation: string;
  onStationChange: (from: string, to: string) => void;
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
  initialFromStation,
  initialToStation,
  onStationChange,
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

    // Recalculate allowance and remarks
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

    // Update duty allowance
    const newDutyAllowance = duty.trips.reduce((total, t) => total + (t.id === tripId ? allowance : t.allowance), 0);
    duty.dutyAllowance = newDutyAllowance;
  };

  const handleTimesChange = useCallback(
    debounce((tripId: number, arrivalTime: string, departureTime: string, dutyHours: string) => {
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

    // Call the onStationChange prop to update the parent state
    onStationChange(sourceStation, destinationStation);

    // Recalculate the allowance based on the new distance
    const updatedTrip = duty.trips.find((t) => t.id === tripId);
    if (updatedTrip) {
      const dutyHoursAsNumber = parseFloat(updatedTrip.dutyHours) || 0;

      const { allowance, remarks } = calculateAllowanceAndRemarks(
        distance,
        updatedTrip.typeOfWork,
        dutyHoursAsNumber * 60
      );

      updateTripData(dutyId, tripId, "allowance", allowance);
      updateTripData(dutyId, tripId, "remarks", remarks);
    }
  };

  const handleTrainNumberChange = (
    trainNumber: string,
    dutyId: number,
    tripId: number
  ) => {
    updateTripData(dutyId, tripId, "trainNumber", trainNumber);
  };

  const handleEditDuty = () => {
    // Reset hasEnded state
    setHasEnded(false);
    duty.hasEnded = false;

    // If the duty is a leave type, we need to reset some fields
    if (duty.isLeave) {
      duty.isLeave = false;
      duty.dutyHours = 0;
      duty.dutyAllowance = 0;
      duty.dutyDistance = 0;

      // Reset the first trip (assuming leave duties only have one trip)
      if (duty.trips.length > 0) {
        const updatedTrip = {
          ...duty.trips[0],
          typeOfWork: "",
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
        updateTripData(duty.id, updatedTrip.id, "typeOfWork", "");
        updateTripData(duty.id, updatedTrip.id, "sourceStation", "");
        updateTripData(duty.id, updatedTrip.id, "destinationStation", "");
        updateTripData(duty.id, updatedTrip.id, "distance", 0);
        updateTripData(duty.id, updatedTrip.id, "trainNumber", "");
        updateTripData(duty.id, updatedTrip.id, "arrivalTime", "");
        updateTripData(duty.id, updatedTrip.id, "departureTime", "");
        updateTripData(duty.id, updatedTrip.id, "dutyHours", "");
        updateTripData(duty.id, updatedTrip.id, "allowance", 0);
        updateTripData(duty.id, updatedTrip.id, "remarks", "");
      }
    }

    // Force a re-render
    setHasEnded(prevState => !prevState);
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

  const isAddTripDisabled =
    duty.hasEnded || shouldDisableInputFields(duty.trips[0].typeOfWork);
  const isEndDutyDisabled =
    duty.hasEnded || shouldDisableInputFields(duty.trips[0].typeOfWork);
  
  // Calculate duty allowance
  const dutyAllowance = duty.trips.reduce((total, t) => total + t.allowance, 0);
  duty.dutyAllowance = dutyAllowance;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.serialNumber}>{duty.id}</Text>
      </View>
      <ScrollView horizontal={false} style={styles.tripsContainer}>
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
                  onChange={(date) =>
                    handleTripDataChange(trip.id, "date", date)
                  }
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
                initialValue={trip.typeOfWork}
              />
            </View>
            <View style={styles.trainNoContainer}>
              <TrainNumberInput
                onChange={(trainNumber) =>
                  handleTrainNumberChange(trainNumber, duty.id, trip.id)
                }
                initialValue={trip.trainNumber}
                disabled={shouldDisableInputFields(trip.typeOfWork)}
              />
            </View>
            <View style={styles.stationsContainer}>
              <PickerComponentStation
                onStationChange={handleStationChange}
                dutyId={duty.id}
                tripId={trip.id}
                initialSourceStation={initialFromStation || duty.trips[0].sourceStation}
                initialDestinationStation={initialToStation || duty.trips[0].destinationStation}
                disabled={shouldDisableInputFields(trip.typeOfWork)}
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
                initialArrivalTime={trip.arrivalTime}
                initialDepartureTime={trip.departureTime}
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
      </ScrollView>
      <View style={styles.buttonsContainer}>
      {!duty.hasEnded && !duty.isLeave && (
          <TouchableOpacity
            style={[styles.commonButtonStyle, styles.addTripButton]}
            onPress={() => addTrip(duty.id)}
          >
            <Text style={styles.buttonText}>Add Trip</Text>
          </TouchableOpacity>
        )}
        {!duty.hasEnded && !duty.isLeave && (
          <TouchableOpacity
            style={[styles.commonButtonStyle, styles.endDutyButton]}
            onPress={() => handleEndDuty(duty)}
          >
            <Text style={styles.buttonText}>End Duty</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.commonButtonStyle, styles.deleteDutyButton]}
          onPress={() => deleteDuty(duty.id)}
        >
          <Text style={styles.buttonText}>Delete Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.commonButtonStyle, styles.editDutyButton]}
          onPress={handleEditDuty}
        >
          <Text style={styles.buttonText}>Edit Duty</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.dutyInfoContainer,
          { display: duty.hasEnded ? "flex" : "none" },
        ]}
      >
        <DutyInfo duty={duty} />
      </View>
    </View>
  );
};

export default DutyRow;
