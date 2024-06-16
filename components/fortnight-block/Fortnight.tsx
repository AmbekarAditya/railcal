// Fortnight.ts
export default class Fortnight {
  startDate: Date;
  endDate: Date;
  totalForthnightDuration: number;
  overtimeAllowance: number;
  totalOvertimeHours: number;

  constructor(
    startDate: Date,
    endDate: Date,
    totalForthnightDuration: number,
    overtimeAllowance: number,
    totalOvertimeHours: number
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalForthnightDuration = totalForthnightDuration;
    this.overtimeAllowance = overtimeAllowance;
    this.totalOvertimeHours = totalOvertimeHours;
  }
}