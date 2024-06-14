import Duty from '../duty/Duty';
import Trip from '../trip/Trip';

interface Range {
  limit: number;
  multiplier: number;
  extra: number;
}

interface FortnightData {
  startDate: Date;
  endDate: Date;
  overtimeHours: number;
  overtimeMinutes: number;
  overtimeUnit: number;
}

interface OverTimeCalculationResult {
  firstFortnight: FortnightData | null;
  secondFortnight: FortnightData | null;
}

const ranges: Range[] = [
  { limit: 104 * 60, multiplier: 1.5, extra: 0 },
  { limit: 108 * 60, multiplier: 2, extra: 6 },
];

const calculateOvertimeUnit = (overtimeTotalTime: number): number => {
  let overtimeUnit = 0;

  if (overtimeTotalTime <= ranges[0].limit) {
    overtimeUnit = 0;
  } else if (overtimeTotalTime > ranges[0].limit && overtimeTotalTime <= ranges[1].limit) {
    overtimeUnit = (overtimeTotalTime - ranges[0].limit) * ranges[0].multiplier;
  } else if (overtimeTotalTime > ranges[1].limit) {
    overtimeUnit = (overtimeTotalTime - ranges[1].limit) * ranges[1].multiplier + ranges[1].extra;
  }

  return overtimeUnit;
};

const calculateFortnight = (duties: Duty[], offsetDays: number, startDate: Date | null = null): FortnightData | null => {
  if (!duties || duties.length === 0) {
    return null;
  }

  if (!startDate) {
    const firstTripDate = duties[0].trips.find(trip => trip.date)?.date;
    if (!firstTripDate) {
      console.error('calculateFortnight: Invalid first trip date');
      return null;
    }
    startDate = new Date(firstTripDate);
  }

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 13 + offsetDays);

  let overtimeTotalTime = 0;
  duties.forEach(duty => {
    if (!duty.trips || duty.trips.length === 0) {
      return;
    }

    const firstTripDate = new Date(duty.trips[0].date);
    if (isNaN(firstTripDate.getTime()) || firstTripDate < startDate || firstTripDate >= endDate) {
      return;
    }

    const overtimeForDuty = duty.dutyHours * 60 ;

    overtimeTotalTime += overtimeForDuty;
  });

  const fortnightData: FortnightData = {
    startDate: startDate,
    endDate: endDate,
    overtimeHours: Math.floor(overtimeTotalTime / 60),
    overtimeMinutes: overtimeTotalTime % 60,
    overtimeUnit: calculateOvertimeUnit(overtimeTotalTime)
  };

  return fortnightData;
};

const firstFortnight = (duties: Duty[], startDate: Date): FortnightData | null => {
  return calculateFortnight(duties, 0);
};

const secondFortnight = (duties: Duty[], firstFortnightEndDate: Date | null): FortnightData | null => {
  if (!firstFortnightEndDate || !(firstFortnightEndDate instanceof Date)) {
    return null;
  }
  const newStartDate = new Date(firstFortnightEndDate);
  newStartDate.setDate(firstFortnightEndDate.getDate() + 1);
  return calculateFortnight(duties, 0, newStartDate);
};

const overtimeCalculation = (duties: Duty[], startDate: Date): OverTimeCalculationResult => {
  
    const firstFortnightData = firstFortnight(duties, startDate);
  
    const firstFortnightEndDate = firstFortnightData ? new Date(firstFortnightData.endDate) : null;
  
    const secondFortnightData = secondFortnight(duties, firstFortnightEndDate);
  
    return {
      firstFortnight: firstFortnightData,
      secondFortnight: secondFortnightData
    };
  };

export { overtimeCalculation, calculateOvertimeUnit, calculateFortnight, firstFortnight, secondFortnight };