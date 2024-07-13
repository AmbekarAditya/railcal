import { MainTableState } from "./types";
import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import { leaveTypes } from "../../utils/constants";
import { createDefaultDuty } from "./utils";

export const addDuty = (state: MainTableState, selectedMonth: string): MainTableState => {
  const lastDuty = state.duties[state.duties.length - 1];
  let newDuty: Duty;

  if (lastDuty && lastDuty.trips.length > 0) {
    const lastTrip = lastDuty.trips[lastDuty.trips.length - 1];
    const newTripDate = getNewTripDate(lastTrip);
    const newSourceStation = lastTrip.destinationStation;

    const newTrip: Trip = createNewTrip(1, newTripDate, newSourceStation);
    newDuty = new Duty(state.duties.length + 1, [newTrip]);
  } else {
    newDuty = createDefaultDuty(state.duties.length + 1, selectedMonth);
  }

  return {
    ...state,
    duties: [...state.duties, newDuty],
  };
};

export const addTrip = (state: MainTableState, dutyId: number, selectedMonth: string): MainTableState => {
  const updatedDuties = state.duties.map((duty) => {
    if (duty.id === dutyId) {
      const newTrip = createNewTripForDuty(duty, state.duties, selectedMonth);
      return new Duty(duty.id, [...duty.trips, newTrip]);
    }
    return duty;
  });

  return { ...state, duties: updatedDuties };
};

export const handleEndDuty = (state: MainTableState, duty: Duty): MainTableState => {
  const updatedDuties = state.duties.map((d) => (d.id === duty.id ? duty : d));
  const nonLeaveDuties = updatedDuties.filter((d) => !d.isLeave);
  const sortedDuties = sortDutiesBySignIn(nonLeaveDuties);
  updateProgressiveNightDutyHours(sortedDuties);

  return {
    ...state,
    duties: updatedDuties,
    selectedDuty: duty,
    showModal: true,
  };
};

// Helper functions

const getNewTripDate = (lastTrip: Trip): string => {
  if (leaveTypes.includes(lastTrip.typeOfWork)) {
    return addOneDay(lastTrip.date);
  } else if (lastTrip.departureTime && lastTrip.arrivalTime) {
    const lastDepartureTime = new Date(`2000-01-01T${lastTrip.departureTime}`);
    const lastArrivalTime = new Date(`2000-01-01T${lastTrip.arrivalTime}`);
    return lastDepartureTime < lastArrivalTime ? addOneDay(lastTrip.date) : lastTrip.date;
  }
  return lastTrip.date;
};

const createNewTrip = (id: number, date: string, sourceStation: string): Trip => ({
  id,
  date,
  typeOfWork: "",
  arrivalTime: "",
  departureTime: "",
  timeDifference: 0,
  sourceStation,
  destinationStation: "",
  distance: 0,
  allowance: 0,
  remarks: "",
  trainNumber: "",
  dutyHours: "",
});

const createNewTripForDuty = (duty: Duty, allDuties: Duty[], selectedMonth: string): Trip => {
  if (duty.trips.length > 0) {
    const lastTrip = duty.trips[duty.trips.length - 1];
    const newTripDate = getNewTripDate(lastTrip);
    const newSourceStation = lastTrip.destinationStation;
    return createNewTrip(duty.trips.length + 1, newTripDate, newSourceStation);
  } else if (duty.id > 1) {
    const previousDuty = allDuties.find(d => d.id === duty.id - 1);
    if (previousDuty && previousDuty.trips.length > 0) {
      const lastTripOfPreviousDuty = previousDuty.trips[previousDuty.trips.length - 1];
      const newTripDate = getNewTripDate(lastTripOfPreviousDuty);
      const newSourceStation = lastTripOfPreviousDuty.destinationStation;
      return createNewTrip(1, newTripDate, newSourceStation);
    }
  }
  return createNewTrip(1, getDefaultDate(selectedMonth), "");
};

const addOneDay = (date: string): string => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay.toISOString().split('T')[0];
};

const getDefaultDate = (selectedMonth: string): string => {
  const monthNumber = monthNames[selectedMonth];
  const paddedMonth = String(monthNumber).padStart(2, "0");
  return `${new Date().getFullYear()}-${paddedMonth}-01`;
};

const sortDutiesBySignIn = (duties: Duty[]): Duty[] => {
  return duties.sort((a, b) => {
    return new Date(a.signIn).getTime() - new Date(b.signIn).getTime();
  });
};

const updateProgressiveNightDutyHours = (duties: Duty[]): void => {
  let cumulativeNightDutyHours = 0;
  duties.forEach((d) => {
    cumulativeNightDutyHours += d.nightDutyHours;
    d.progressiveNightDutyHours = cumulativeNightDutyHours;
  });
};
