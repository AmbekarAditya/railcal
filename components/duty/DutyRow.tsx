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
}

const DutyRow: React.FC<DutyRowProps> = ({
  duty,
  addTrip,
  handleEndDuty,
  updateTripData,
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

  console.log(duty);

  return (
    <React.Fragment>
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
                onDateSelected={(date) => handleTripDataChange(trip.id, "date", date)}
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
              onChange={(trainNumber) =>
                handleTrainNumberChange(trainNumber, duty.id, trip.id)
              }
            />
          </td>
          <td>
            <PickerComponentStation
              onStationChange={handleStationChange}
              dutyId={duty.id}
              tripId={trip.id}
              disabled={false}
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
            />
          </td>
          <td>{trip.dutyHours}</td>
          <td>{trip.allowance}</td>
          <td>{trip.remarks}</td>
        </tr>
      ))}
      <tr>
        <td colSpan={6}>
          <button onClick={() => addTrip(duty.id)}>Add Trip</button>
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