// DutyRow.tsx
import React from "react";
import Duty from "./Duty";
import Trip from "./Trip";
import TypeofWorkPickerComponent from "./typeofwork";
import PickerComponentStation from "./stationpicker";
import TrainNumberInput from "./trainNumber";
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

  const handleStationChange = (dutyId: number, tripId: number, sourceStation: string, destinationStation: string, distance: number) => {
    // Assuming updateTripData is a method that updates the trip information
    updateTripData(dutyId, tripId, 'sourceStation', sourceStation);
    updateTripData(dutyId, tripId, 'destinationStation', destinationStation);
    updateTripData(dutyId, tripId, 'distance', distance);
  };
  
  const handleTrainNumberChange = (trainNumber: string,dutyId: number, tripId: number) => {
    updateTripData(dutyId, tripId, 'trainNumber', trainNumber);
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
              onChange={(e) => handleTripDataChange(trip.id, "date", e.target.value)}
            />
          </td>
          <td>
          <TypeofWorkPickerComponent
        TypeofWork={(newValue) => handleTripDataChange(trip.id, "typeOfWork", newValue)}
      />
          </td>
          <td>
          <TrainNumberInput onChange={handleTrainNumberChange} />
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
          <PickerComponentStation
          onStationChange={handleStationChange}
          dutyId={duty.id}
          tripId={trip.id}
          disabled={false} // Or some logic to determine if it should be disabled
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