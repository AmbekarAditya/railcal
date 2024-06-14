import Duty from "../duty/Duty";
import { leaveTypes } from "../../utils/constants";

interface CalculateLeaveMileageParams {
  rateOfPay: number;
  daysInMonth: number;
  duties: Duty[];
}

interface CalculateLeaveMileageResult {
  leaveMileageAllowance: number;
}



function calculateLeaveMileage({
  rateOfPay,
  daysInMonth,
  duties,
}: CalculateLeaveMileageParams): CalculateLeaveMileageResult {
  // Handle missing parameters
  if (rateOfPay === undefined || daysInMonth === undefined || duties === undefined) {
    throw new Error("Missing parameters");
  }

  // Handle negative values
  if (rateOfPay < 0 || daysInMonth < 0) {
    throw new Error("Negative values are not allowed");
  }

  // Handle edge case when daysInMonth is 0
  if (daysInMonth === 0) {
    throw new Error("daysInMonth cannot be zero");
  }

  // Calculate total leaves
  const totalLeaves = duties.reduce((count, duty) => {
    return count + duty.trips.filter(trip => leaveTypes.includes(trip.typeOfWork)).length;
  }, 0);


  const lmc = (0.3 * rateOfPay) / daysInMonth;
  const leaveMileageAllowance = lmc * totalLeaves;

  return { leaveMileageAllowance };
}

export default calculateLeaveMileage;