import { DEARNESS_FACTOR } from "../../utils/constants";

const calculateDearnessAllowance = (rateOfPay: number): number => {
    return (rateOfPay * 1.3) * (DEARNESS_FACTOR / 100);
  };
  
  export default calculateDearnessAllowance;