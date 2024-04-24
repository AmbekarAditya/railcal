import {DESIGNATION_MULTIPLIERS} from "../../utils/constants";

interface DesignationMultipliers {
  [key: string]: number;
}

const calculateOsdaAllowance = (
  designation: string,
  totalOsda: number
): number => {
  console.log("Selected Designation:", designation);

  // Handle missing parameters
  if (designation === undefined || totalOsda === undefined) {
    throw new Error("Missing parameters");
  }

  // Handle non-numeric totalOsda values
  if (typeof totalOsda !== "number") {
    throw new Error("totalOsda must be a numeric value");
  }

  // Handle negative totalOsda values
  if (totalOsda < 0) {
    throw new Error("Negative totalOsda values are not allowed");
  }

  const multiplier: number =
    (DESIGNATION_MULTIPLIERS as DesignationMultipliers)[designation] || 1;

  return totalOsda * 70 * multiplier;
};

export default calculateOsdaAllowance;