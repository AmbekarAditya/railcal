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

  // Calculate units
  const units = nightDutyHours / 6;

  // Calculate total night duty pay
  const totalNightDutyPay = ((parseFloat(rateOfPay) + dearnessAllowanceValue) / 200) * units;

  return totalNightDutyPay;
}

export default computeNightDutyAllowance;