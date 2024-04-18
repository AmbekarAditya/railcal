// DutyRow.tsx
import React from "react";
import { useEffect } from "react";
import Duty from "./Duty";
import Trip from "../trip/Trip";
import TypeofWorkPickerComponent from "../type-of-work/typeofwork";
import PickerComponentStation from "../station-picker/stationpicker";
import TrainNumberInput from "../trainNumber";
import ArrivalDepartureTimePicker from "../ArrivalDepartureTimePicker";
import DutyInfo  from "./DutyInfo";
import calculateAllowanceAndRemarks from "../allowancecalculation/calculateAllowanceAndRemarks";

interface DutyRowProps {
  duty: Duty;
  addTrip: (dutyId: number) => void;
  handleEndDuty: (duty: Duty) => void;

  selectedMonth: string;
  updateTripData: (dutyId: number, tripId: number, field: keyof Trip, value: any) => void;

}

const DutyRow: React.FC<DutyRowProps> = ({
  duty,
  addTrip,
  handleEndDuty,
  updateTripData,
  selectedMonth,
}) => {
  console.log("Rendering DutyRow with duty:", duty);

  const getMonthIndex = (month: string) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames.indexOf(month);
  };

  const handleTripDataChange = (
    tripId: number,
    field: keyof Trip,
    value: string | number
  ) => {
    const tripIndex = duty.trips.findIndex((trip) => trip.id === tripId);
    let trip = duty.trips[tripIndex];
  
    // Update the trip data immediately for synchronous processing
    trip = { ...trip, [field]: value };
    updateTripData(duty.id, tripId, field, value);
  
    // Perform calculations only on specific field changes
    if (field === "distance" || field === "typeOfWork" || (field === "dutyHours" && value !== "")) {
      const dutyHoursAsNumber = parseFloat(trip.dutyHours) || 0; // Convert safely
  
      console.log(`Calculating allowance for distance: ${trip.distance}, typeOfWork: ${trip.typeOfWork}, dutyHours: ${dutyHoursAsNumber}`);
  
      const { allowance, remarks } = calculateAllowanceAndRemarks(
        trip.distance,
        trip.typeOfWork,
        dutyHoursAsNumber * 60 // Convert hours to minutes if necessary
      );
  
      console.log(`Calculated allowance: ${allowance}, remarks: ${remarks}`);
  
      // Update allowance and remarks
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
    // Assuming updateTripData is a method that updates the trip information
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
    // Here you could also update the state or send this to a backend server
  };

  useEffect(() => {
    duty.trips.forEach((trip) => {
      if (trip.distance > 0 && trip.typeOfWork) {
        const dutyHoursAsNumber = parseFloat(trip.dutyHours) || 0; // default to 0 if parsing fails
        const { allowance, remarks } = calculateAllowanceAndRemarks(
          trip.distance,
          trip.typeOfWork,
          dutyHoursAsNumber * 60 // Convert hours to minutes
        );
  
        // Debugging
        console.log(`Updated calculations for Trip ID ${trip.id}: Allowance - ${allowance}, Remarks - ${remarks}`);
  
        updateTripData(duty.id, trip.id, 'allowance', allowance);
        updateTripData(duty.id, trip.id, 'remarks', remarks);
      }
    });
  }, [duty.trips]); // Dependency on trips to re-calculate when trips data changes
  


  return (
    <React.Fragment>
      {duty.trips.map((trip, index) => (
        <tr key={trip.id}>
          <td>
            <input
              type="date"
              value={trip.date}
              onChange={(e) =>
                handleTripDataChange(trip.id, "date", e.target.value)
              }
            />
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
              disabled={false} // Or some logic to determine if it should be disabled
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
function updateDuty(id: number, arg1: Duty) {
  throw new Error("Function not implemented.");
}

