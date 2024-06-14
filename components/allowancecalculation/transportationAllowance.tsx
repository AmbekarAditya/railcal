import { DEARNESS_FACTOR, DESIGNATION_BASIC_TRANPORTATION } from "../../utils/constants";

const calculateTransportationAllowance = (designation: keyof typeof DESIGNATION_BASIC_TRANPORTATION): number => {
  const basic = DESIGNATION_BASIC_TRANPORTATION[designation];
  return basic + basic * (DEARNESS_FACTOR / 100);
};

export default calculateTransportationAllowance;
