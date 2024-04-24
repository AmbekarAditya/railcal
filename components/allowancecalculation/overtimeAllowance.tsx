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
  console.log(`Calculating Overtime Unit for Total Time: ${overtimeTotalTime}`);

  if (overtimeTotalTime <= ranges[0].limit) {
    overtimeUnit = 0;
  } else if (overtimeTotalTime > ranges[0].limit && overtimeTotalTime <= ranges[1].limit) {
    overtimeUnit = (overtimeTotalTime - ranges[0].limit) * ranges[0].multiplier;
  } else if (overtimeTotalTime > ranges[1].limit) {
    overtimeUnit = (overtimeTotalTime - ranges[1].limit) * ranges[1].multiplier + ranges[1].extra;
  }

  console.log(`Calculated Overtime Unit: ${overtimeUnit}`);
  return overtimeUnit;
};

const calculateFortnight = (duties: Duty[], offsetDays: number, startDate: Date | null = null): FortnightData | null => {
  if (!duties || duties.length === 0) {
    console.log('calculateFortnight: No duties provided');
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

  console.log(`Fortnight Start Date: ${startDate.toDateString()}, End Date: ${endDate.toDateString()}`);

  let overtimeTotalTime = 0;
  duties.forEach(duty => {
    if (!duty.trips || duty.trips.length === 0) {
      console.log('No trips in duty');
      return;
    }

    const firstTripDate = new Date(duty.trips[0].date);
    if (isNaN(firstTripDate.getTime()) || firstTripDate < startDate || firstTripDate >= endDate) {
      console.log('Trip date is out of range or invalid:', firstTripDate);
      return;
    }

    const overtimeForDuty = duty.dutyHours * 60 ;

    console.log(`Adding ${overtimeForDuty} minutes to total overtime`);
    overtimeTotalTime += overtimeForDuty;
  });

  console.log(`Total Overtime Time for Fortnight: ${overtimeTotalTime} minutes`);

  const fortnightData: FortnightData = {
    startDate: startDate,
    endDate: endDate,
    overtimeHours: Math.floor(overtimeTotalTime / 60),
    overtimeMinutes: overtimeTotalTime % 60,
    overtimeUnit: calculateOvertimeUnit(overtimeTotalTime)
  };

  console.log('Fortnight Data:', fortnightData);
  return fortnightData;
};

const firstFortnight = (duties: Duty[], startDate: Date): FortnightData | null => {
  console.log('Calculating First Fortnight');
  return calculateFortnight(duties, 0);
};

const secondFortnight = (duties: Duty[], firstFortnightEndDate: Date | null): FortnightData | null => {
  console.log('Calculating Second Fortnight');
  if (!firstFortnightEndDate || !(firstFortnightEndDate instanceof Date)) {
    console.log('secondFortnight: Invalid firstFortnightEndDate');
    return null;
  }
  const newStartDate = new Date(firstFortnightEndDate);
  newStartDate.setDate(firstFortnightEndDate.getDate() + 1);
  return calculateFortnight(duties, 0, newStartDate);
};

const overtimeCalculation = (duties: Duty[], startDate: Date): OverTimeCalculationResult => {
    console.log('Initial Duties:', duties);
  
    const firstFortnightData = firstFortnight(duties, startDate);
    console.log('First Fortnight Data:', firstFortnightData);
  
    const firstFortnightEndDate = firstFortnightData ? new Date(firstFortnightData.endDate) : null;
    console.log('First Fortnight End Date:', firstFortnightEndDate ? firstFortnightEndDate.toDateString() : 'null');
  
    const secondFortnightData = secondFortnight(duties, firstFortnightEndDate);
    console.log('Second Fortnight Data:', secondFortnightData);
  
    return {
      firstFortnight: firstFortnightData,
      secondFortnight: secondFortnightData
    };
  };

export { overtimeCalculation, calculateOvertimeUnit, calculateFortnight, firstFortnight, secondFortnight };