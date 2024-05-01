import { DESIGNATION_MULTIPLIERS } from "../../utils/constants";

const mileageCalculation = (designation: string, totalAllowance: number): number => {
  const multiplier = DESIGNATION_MULTIPLIERS[designation] || 1;
  return totalAllowance * multiplier;
};

export default mileageCalculation;