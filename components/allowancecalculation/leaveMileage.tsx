interface CalculateLeaveMileageParams {
    rateOfPay: number;
    daysInMonth: number;
    totalLeaves: number;
  }
  
  interface CalculateLeaveMileageResult {
    lmc: number;
    lma: number;
  }
  
  function calculateLeaveMileage({
    rateOfPay,
    daysInMonth,
    totalLeaves,
  }: CalculateLeaveMileageParams): CalculateLeaveMileageResult {
    // Handle missing parameters
    if (rateOfPay === undefined || daysInMonth === undefined || totalLeaves === undefined) {
      throw new Error("Missing parameters");
    }
  
    // Handle negative values
    if (rateOfPay < 0 || daysInMonth < 0 || totalLeaves < 0) {
      throw new Error("Negative values are not allowed");
    }
  
    // Handle edge case when daysInMonth is 0
    if (daysInMonth === 0) {
      throw new Error("daysInMonth cannot be zero");
    }
  
    const lmc = (0.3 * rateOfPay) / daysInMonth;
    const lma = lmc * totalLeaves;
  
    return { lmc, lma };
  }
  
  export default calculateLeaveMileage;