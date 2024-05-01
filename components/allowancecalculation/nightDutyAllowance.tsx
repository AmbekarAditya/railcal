function computeNightDutyAllowance(
    rateOfPay: number | undefined,
    dearnessAllowanceValue: number | undefined,
    nightDutyHours: number | undefined
  ): number | undefined {
    // Check for missing values
    if (
      rateOfPay === undefined ||
      dearnessAllowanceValue === undefined ||
      nightDutyHours === undefined
    ) {
      return undefined;
    }
  
    // Check for negative values
    if (rateOfPay < 0 || dearnessAllowanceValue < 0 || nightDutyHours < 0) {
      return undefined;
    }
  
    // Check for zero values
    if (rateOfPay === 0 && dearnessAllowanceValue === 0 && nightDutyHours === 0) {
      return 0;
    }
  
    // Using the provided calculations
    const a = rateOfPay * (30 / 100);
    const aAsNumber = parseFloat(a);
    const b = aAsNumber + parseFloat(rateOfPay);
    const c = b * (42 / 100);
    const d = parseFloat(c) + parseFloat(rateOfPay);
    const e = d / 1200;
    const totalNightDutyPay = e * nightDutyHours;
  
    return totalNightDutyPay;
  }
  
  export default computeNightDutyAllowance;