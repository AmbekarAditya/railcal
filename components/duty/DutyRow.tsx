// DutyRow.tsx
import React from "react";
import Duty from "./Duty";
import Trip from "../trip/Trip";
import TypeofWorkPickerComponent from "../type-of-work/typeofwork";
import PickerComponentStation from "../station-picker/stationpicker";
import TrainNumberInput from "../trainNumber";
import ArrivalDepartureTimePicker from "../ArrivalDepartureTimePicker";
import DutyInfo  from "./DutyInfo";

interface DutyRowProps {
  duty: Duty;
  addTrip: (dutyId: number) => void;
  handleEndDuty: (duty: Duty) => void;
  updateTripData: (
    dutyId: number,
    tripId: number,
    field: keyof Trip,
    value: string | number
  ) => void;
  selectedMonth: string;
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
    if (field === "date") {
      const selectedYear = new Date().getFullYear();
      const monthIndex = getMonthIndex(selectedMonth)
      const selectedDate = new Date(selectedYear, monthIndex, Number(value));
      updateTripData(duty.id, tripId, field, selectedDate.toISOString().slice(0, 10));
    } else {
      updateTripData(duty.id, tripId, field, value);
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
