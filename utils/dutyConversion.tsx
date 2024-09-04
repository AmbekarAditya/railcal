// utils/dutyConversion.ts

import Duty from '../components/duty/Duty';
import Trip from '../components/trip/Trip';

export function jsonToDuty(json: any): Duty {
  const duty = new Duty(json.id, []);
  duty.signIn = json.signIn ? new Date(json.signIn) : null;
  duty.signOff = json.signOff ? new Date(json.signOff) : null;
  duty.isOSDA = json.isOSDA;
  duty.isRRA = json.isRRA;
  duty.nightDutyHours = json.nightDutyHours;
  duty.progressiveNightDutyHours = json.progressiveNightDutyHours;
  duty.dutyAllowance = json.dutyAllowance;
  duty.dutyDistance = json.dutyDistance;
  duty.progressiveDutyHours = json.progressiveDutyHours;
  duty.hasEnded = json.hasEnded;

  duty.trips = json.trips.map((tripJson: any) => jsonToTrip(tripJson));

  return duty;
}

export function dutyToJson(duty: Duty): any {
  return {
    id: duty.id,
    trips: duty.trips.map(tripToJson),
    signIn: duty.signIn?.toISOString(),
    signOff: duty.signOff?.toISOString(),
    isOSDA: duty.isOSDA,
    isRRA: duty.isRRA,
    nightDutyHours: duty.nightDutyHours,
    progressiveNightDutyHours: duty.progressiveNightDutyHours,
    dutyAllowance: duty.dutyAllowance,
    dutyDistance: duty.dutyDistance,
    progressiveDutyHours: duty.progressiveDutyHours,
    hasEnded: duty.hasEnded,
  };
}

export function jsonToTrip(json: any): Trip {
  const trip = new Trip(json.id);
  trip.date = json.date;
  trip.typeOfWork = json.typeOfWork;
  trip.trainNumber = json.trainNumber;
  trip.departureTime = json.departureTime;
  trip.arrivalTime = json.arrivalTime;
  trip.sourceStation = json.sourceStation;
  trip.destinationStation = json.destinationStation;
  trip.distance = json.distance;
  trip.allowance = json.allowance;
  trip.remarks = json.remarks;
  trip.dutyHours = json.dutyHours;
  return trip;
}

export function tripToJson(trip: Trip): any {
  return {
    id: trip.id,
    date: trip.date,
    typeOfWork: trip.typeOfWork,
    trainNumber: trip.trainNumber,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    sourceStation: trip.sourceStation,
    destinationStation: trip.destinationStation,
    distance: trip.distance,
    allowance: trip.allowance,
    remarks: trip.remarks,
    dutyHours: trip.dutyHours,
  };
}