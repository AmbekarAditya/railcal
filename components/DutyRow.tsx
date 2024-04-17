// DutyRow.tsx
import React from "react";
import Duty from "./Duty";
import Trip from "./Trip";
import TypeofWorkPickerComponent from "./typeofwork";
interface DutyRowProps {
  duty: Duty;
  addTrip: (dutyId: number) => void;
  handleEndDuty: (duty: Duty) => void;
  updateTripData: (dutyId: number, tripId: number, field: keyof Trip, value: string | number) => void;
}

const DutyRow: React.FC<DutyRowProps> = ({ duty, addTrip, handleEndDuty, updateTripData }) => {
  console.log("Rendering DutyRow with duty:", duty);

  const handleTripDataChange = (tripId: number, field: keyof Trip, value: string | number) => {
    updateTripData(duty.id, tripId, field, value);
  };

  return (
    <React.Fragment>
      {duty.trips.map((trip, index) => (
        <tr key={trip.id}>
          <td>
            <input
              type="date"
              value={trip.date}
              onChange={(e) => handleTripDataChange(trip.id, "date", e.target.value)}
            />
          </td>
          <td>
          <TypeofWorkPickerComponent
        TypeofWork={(newValue) => handleTripDataChange(trip.id, "typeOfWork", newValue)}
      />
          </td>
          {/* <td>
            <input
              type="time"
              value={trip.startTime}
              onChange={(e) => handleTripDataChange(trip.id, "startTime", e.target.value)}
            />
          </td>
          <td> */}
            {/* <input
              type="time"
              value={trip.endTime}
              onChange={(e) => handleTripDataChange(trip.id, "endTime", e.target.value)}
            /> */}
          {/* </td> */}
          <td>
            <input
              type="number"
              value={trip.distance}
              onChange={(e) => handleTripDataChange(trip.id, "distance", Number(e.target.value))}
            />
          </td>
          <td>
            {index === duty.trips.length - 1 && (
              <button onClick={() => handleEndDuty(duty)}>End Duty</button>
            )}
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan={6}>
          <button onClick={() => addTrip(duty.id)}>Add Trip</button>
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