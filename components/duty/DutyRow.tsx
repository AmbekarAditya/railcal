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
  updateTripData: (dutyId: number, tripId: number, field: keyof Trip, value: any) => void;
  deleteTrip: (dutyId: number, tripId: number) => void;
  updateDutyDetails: (updatedDuty: Duty) => void;
}

const DutyRow: React.FC<DutyRowProps> = ({
  duty,
  addTrip,
  handleEndDuty,
  updateTripData,
  deleteTrip,
  updateDutyDetails,
}) => {
  const handleTripDataChange = (
    tripId: number,
    field: keyof Trip,
    value: string | number
  ) => {
    const tripIndex = duty.trips.findIndex((trip) => trip.id === tripId);
    const trip = duty.trips[tripIndex];

    // Update the trip data immediately for synchronous processing
    const updatedTrip = { ...trip, [field]: value };
    updateTripData(duty.id, tripId, field, value);

    // Perform calculations only on specific field changes
    if (field === "distance" || field === "typeOfWork" || (field === "dutyHours" && value !== "")) {
      const dutyHoursAsNumber = parseFloat(updatedTrip.dutyHours) || 0;

      const { allowance, remarks } = calculateAllowanceAndRemarks(
        updatedTrip.distance,
        updatedTrip.typeOfWork,
        dutyHoursAsNumber * 60
      );

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

        updateTripData(duty.id, trip.id, 'allowance', allowance);
        updateTripData(duty.id, trip.id, 'remarks', remarks);
      }
    });
  }, [duty.trips, updateTripData]);

  const isLeaveType = (typeOfWork: string): boolean => {
    return ['Sick leave', 'Casual leave', 'Paid leave'].includes(typeOfWork);
  };

  const hasLeaveTypeTrip = duty.trips.some((trip) =>
    isLeaveType(trip.typeOfWork)
  );

  useEffect(() => {
    console.log('duty before useEffect:', duty);
  
    // Filter trips that have a leave type of work
    const tripsWithLeaveType = duty.trips.filter(trip => isLeaveType(trip.typeOfWork));
  
    if (tripsWithLeaveType.length > 0) {
      // Set duty hours for the entire duty when there is at least one leave type trip
      const dutyHoursForLeave = "7h 25m"; // Representing 7 hours and 25 minutes as a string
  
      // Create a new Duty object with the updated dutyHours property
      const updatedDuty = new Duty(duty.id, duty.trips, null, null, dutyHoursForLeave, duty.nightDutyHours, duty.isOSDA, duty.isRRA, duty.dutyAllowance, duty.dutyDistance);
  
      console.log('updatedDuty:', updatedDuty);
  
      // Call the updateDutyDetails function with the updated Duty object
      updateDutyDetails(updatedDuty);
    }
  
    console.log('duty after useEffect:', duty);
  }, [duty.trips]);

  console.log(duty);

  return (
    <React.Fragment>
      <tr>
                  <th>Date</th>
                  <th>Type of Duty</th>
                  <th>Train Number</th>
                  <th>Start & End Station</th>
                  <th>Trip Distance</th>
                  <th>Start & End Time</th>
                  <th>Trip Duration</th>
                  <th>Allowance</th>
                  <th>Remarks</th>
                </tr>
                {duty.trips.map((trip, index) => (
        <tr key={trip.id}>
          <td>
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
          </td>
          <td>
            <TypeofWorkPickerComponent
              TypeofWork={(newValue) =>
                handleTripDataChange(trip.id, "typeOfWork", newValue)
              }
            />
          </td>
          <td>
          <TrainNumberInput
  onChange={(trainNumber) => handleTrainNumberChange(trainNumber, duty.id, trip.id)}
  disabled={isLeaveType(trip.typeOfWork)} // Disable if it's a leave type
/>
          </td>
          <td>
            <PickerComponentStation
              onStationChange={handleStationChange}
              dutyId={duty.id}
              tripId={trip.id}
              disabled={isLeaveType(trip.typeOfWork)}
            />
          </td>
          <td style={{ textAlign: "center", fontWeight: "bold" }}>
            {trip.distance.toFixed(2)}
          </td>
          <td>
          <ArrivalDepartureTimePicker
  onTimesChange={(arrivalTime, departureTime, dutyHours) => {
    handleTripDataChange(trip.id, "arrivalTime", arrivalTime);
    handleTripDataChange(trip.id, "departureTime", departureTime);
    handleTripDataChange(trip.id, "dutyHours", dutyHours);
  }}
  disabled={isLeaveType(trip.typeOfWork)} // Disable if it's a leave type
/>
          </td>
          <td>{trip.dutyHours}</td>
          <td>{trip.allowance}</td>
          <td>{trip.remarks}</td>
          <td>
            <button onClick={() => deleteTrip(duty.id, trip.id)}>
              Delete Trip
            </button>
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan={6}>
        <button onClick={() => addTrip(duty.id)} disabled={duty.trips.some(trip => isLeaveType(trip.typeOfWork))}>
  Add Trip
</button>
       
          <button onClick={() => handleEndDuty(duty)}> End Duty</button>
          <DutyInfo duty={duty} />
        </td>
      </tr>
      {duty.trips.length > 0 && (
        <tr className="duty-separator">
          <td colSpan={6}></td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default DutyRow;