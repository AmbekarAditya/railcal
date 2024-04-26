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
import { Platform } from "react-native";

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
    console.log(`handleTripDataChange called with tripId: ${tripId}, field: ${field}, value: ${value}`);
  
    updateTripData(duty.id, tripId, field, value);
  
    // Perform additional actions if needed
    if (field === "typeOfWork") {
      const trip = duty.trips.find((t) => t.id === tripId);
      if (trip) {
        duty.updateDutyHoursForLeaveTypes(value as string);
      }
    }
  
    if (field === "arrivalTime" || field === "departureTime") {
      const trip = duty.trips.find((t) => t.id === tripId);
      if (trip) {
        const isArrivalTimeValid = trip.arrivalTime && trip.arrivalTime !== "";
        const isDepartureTimeValid = trip.departureTime && trip.departureTime !== "";
  
        if (isArrivalTimeValid && isDepartureTimeValid) {
          const arrivalTime = new Date(`1970-01-01T${trip.arrivalTime}:00`);
          const departureTime = new Date(`1970-01-01T${trip.departureTime}:00`);
          const timeDifference = departureTime.getTime() - arrivalTime.getTime();
          const dutyHours = timeDifference / (1000 * 60 * 60);
          updateTripData(duty.id, tripId, "dutyHours", dutyHours.toString());
        } else {
          updateTripData(duty.id, tripId, "dutyHours", "0");
        }
      }
    }
    
    if (field === "distance" || field === "typeOfWork" || (field === "dutyHours" && value !== "")) {
      const trip = duty.trips.find((t) => t.id === tripId);
      if (trip) {
        const dutyHoursAsNumber = parseFloat(trip.dutyHours) || 0;
        const dutyHoursInMinutes = dutyHoursAsNumber * 60;
  
        const { allowance, remarks } = calculateAllowanceAndRemarks(
          trip.distance,
          trip.typeOfWork,
          dutyHoursInMinutes
        );
  
        updateTripData(duty.id, tripId, "allowance", allowance);
        updateTripData(duty.id, tripId, "remarks", remarks);
      }
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
    <React.Fragment>
      <tr>
        <th style={{ width: '80px' }}>Date</th>
        <th style={{ width: '150px' }}>Duty Type</th>
        <th style={{ width: '80px' }}>Train No.</th>
        <th style={{ width: '100px' }}>Stations</th>
        <th style={{ width: '60px' }}>Distance</th>
        <th style={{ width: '120px' }}>Start & End Time</th>
        <th style={{ width: '80px' }}>Duration</th>
        <th style={{ width: '80px' }}>Allowance</th>
        <th style={{ width: '120px' }}>Remarks</th>
        <th style={{ width: '80px' }}>Actions</th>
      </tr>
      {duty.trips.map((trip, index) => (
        <tr key={trip.id}>
          <td style={{ width: '80px' }}>
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
          </td>
          <td style={{ width: '150px' }}>
            <TypeofWorkPickerComponent
              TypeofWork={(newValue) => handleTripDataChange(trip.id, "typeOfWork", newValue)}
            />
          </td>
          <td style={{ width: '80px' }}>
            <TrainNumberInput
              onChange={(trainNumber) => handleTrainNumberChange(trainNumber, duty.id, trip.id)}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              maxLength={7}
              style={{ width: '100%' }}
            />
          </td>
          <td style={{ width: '100px' }}>
            <PickerComponentStation
              onStationChange={handleStationChange}
              dutyId={duty.id}
              tripId={trip.id}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              style={{ width: '100%' }}
            />
          </td>
          <td style={{ textAlign: "center", fontWeight: "bold", width: '60px' }}>
            {trip.distance.toFixed(2)}
          </td>
          <td style={{ width: '120px' }}>
          <ArrivalDepartureTimePicker
  onTimesChange={(arrivalTime, departureTime) => {
    handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
    handleTripDataChange(trip.id, "departureTime", departureTime);
  }}
  disabled={shouldDisableInputFields(trip.typeOfWork)}
/>
            {/* <ArrivalDepartureTimePicker
              onTimesChange={(arrivalTime, departureTime, dutyHours) => {
                handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
                handleTripDataChange(trip.id, "departureTime", departureTime);
                handleTripDataChange(trip.id, "dutyHours", dutyHours);
              }}
              disabled={shouldDisableInputFields(trip.typeOfWork)}
              style={{ width: '100%' }}
            /> */}
          </td>
          <td style={{ width: '80px' }}>{trip.dutyHours}</td>
          <td style={{ width: '80px' }}>{trip.allowance}</td>
          <td style={{ width: '120px' }}>{trip.remarks}</td>
          <td style={{ width: '80px' }}>
            <button onClick={() => deleteTrip(duty.id, trip.id)}>Delete</button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan={10}>
          <button
            onClick={() => addTrip(duty.id)}
            disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
          >
            Add Trip
          </button>
          <button
            onClick={() => handleEndDuty(duty)}
            disabled={shouldDisableInputFields(duty.trips[0].typeOfWork)}
          >
            End Duty
          </button>
          <button onClick={() => deleteDuty(duty.id)}>Delete Duty</button>
          <DutyInfo duty={duty} />
        </td>
      </tr>
      {duty.trips.length > 0 && (
        <tr className="duty-separator">
          <td colSpan={10}></td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default DutyRow;
