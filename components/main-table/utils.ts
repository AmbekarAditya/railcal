import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import { monthNames } from "../../utils/constants";

export const createDefaultDuty = (id: number, selectedMonth: string): Duty => {
  const trip = createDefaultTrip(selectedMonth);
  const duty = new Duty(id, [trip]);
  duty.hasEnded = false;  // Ensure this is set
  return duty;
};

export const createDefaultTrip = (selectedMonth: string): Trip => {
  const monthNumber = monthNames[selectedMonth];
  const paddedMonth = String(monthNumber).padStart(2, "0");

  return new Trip(1, {
    date: `${new Date().getFullYear()}-${paddedMonth}-01`,
    typeOfWork: "",
    arrivalTime: "",
    departureTime: "",
    timeDifference: 0,
    sourceStation: "",
    destinationStation: "",
    trainNumber: "",
    distance: 0,
    allowance: 1,
    remarks: "",
    dutyHours: "",
  });
};

export const calculateTotalDutyHours = (duties: Duty[]): number => {
  return duties.reduce((total, duty) => {
    return total + duty.trips.reduce((dutyTotal, trip) => {
      const dutyHours = parseFloat(trip.dutyHours);
      return dutyTotal + (isNaN(dutyHours) ? 0 : dutyHours);
    }, 0);
  }, 0);
};

export const calculateTotalKilometers = (duties: Duty[]): number => {
  return duties.reduce((acc, duty) => {
    const dutyDistance = duty.trips.reduce(
      (tripAcc, trip) =>
        tripAcc + (typeof trip.distance === "number" ? trip.distance : 0),
      0
    );
    return acc + dutyDistance;
  }, 0);
};
