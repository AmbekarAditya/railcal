// DutyRow.tsx
import React from "react";
import Duty from "./Duty";

interface DutyRowProps {
  duty: Duty;
  addTrip: (dutyId: number) => void;
  handleEndDuty: (duty: Duty) => void;
}

const DutyRow: React.FC<DutyRowProps> = ({ duty, addTrip, handleEndDuty }) => {
  console.log("Rendering DutyRow with duty:", duty);

  return (
    <React.Fragment>
      {duty.trips.map((trip, index) => (
        <tr key={trip.id}>
          <td>{trip.date}</td>
          <td>{trip.type}</td>
          <td>{trip.startTime}</td>
          <td>{trip.endTime}</td>
          <td>{trip.distance}</td>
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