import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import { monthNames } from "../../utils/constants";

export const createDefaultTrip = (selectedMonth: string): Trip => {
  const monthNumber = monthNames[selectedMonth];
  const paddedMonth = String(monthNumber).padStart(2, "0");

  return {
    id: 1,
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
  };
};

export const createDefaultDuty = (id: number, selectedMonth: string): Duty => {
  const trip = createDefaultTrip(selectedMonth);
  return new Duty(id, [trip]);
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
