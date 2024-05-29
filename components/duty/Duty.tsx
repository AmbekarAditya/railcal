import Trip from "../trip/Trip";

class Duty {
  id: number;
  trips: Trip[];
  signIn: Date | null;
  signOff: Date | null;
  dutyHours: number;
  nightDutyHours: number;
  isOSDA: boolean;
  isRRA: boolean;
  dutyAllowance: number;
  dutyDistance: number;
  progressiveDutyHours:number;
  progressiveNightDutyHours: number;

  constructor(id: number, trips: Trip[] = []) {
    this.id = id;
    this.trips = trips;
    this.signIn = null;
    this.signOff = null;
    this.dutyHours = 0;
    this.nightDutyHours = 0;
    this.isOSDA = false;
    this.isRRA = false;
    this.dutyAllowance = 0;
    this.dutyDistance = 0;
    this.progressiveDutyHours=0;
    this.progressiveNightDutyHours=0;
  }

  setSignInAndSignOff(signIn: Date, signOff: Date) {
    this.signIn = signIn;
    this.signOff = signOff;
    this.calculateDutyHoursAndNightDutyHours();
  }

  private calculateDutyHoursAndNightDutyHours() {
    if (this.signIn && this.signOff) {
      this.dutyHours = this.calculateDutyHours();
      this.nightDutyHours = this.calculateNightDutyHours();
    }
  }

  calculateTotalAllowance() {
    let totalAllowanceforDuty = 0;
  
    // Calculate the total allowance for non-leave trips
    const nonLeaveTripAllowances = this.trips
      .filter(trip => !["Paid leave", "Sick leave", "Casual leave"].includes(trip.typeOfWork))
      .map(trip => trip.allowance);
  
    totalAllowanceforDuty = nonLeaveTripAllowances.reduce((total, allowance) => total + allowance, 0);
  
    // Apply the minimum allowance of 120 only for non-leave trips
    if (totalAllowanceforDuty > 0 && totalAllowanceforDuty <= 120) {
      totalAllowanceforDuty = 120;
    }
  
    this.dutyAllowance = totalAllowanceforDuty;
    return totalAllowanceforDuty;
  }
  calculateTotalDistance() {
    const totalDistance = this.trips.reduce((acc, trip) => acc + (trip.distance || 0), 0);
    return totalDistance;
  }

  calculateprogressiveDutyHours(dutyIndex: number, totalDuties: Duty[]): number {
    if (dutyIndex === 0) {
      // For the first duty, the progressiveDutyHours is the same as dutyHours
      this.progressiveDutyHours = this.dutyHours;
    } else {
      // Calculate the progressive duty hours based on the previous duty's progressiveDutyHours
      const previousDuty = totalDuties[dutyIndex - 1];
      this.progressiveDutyHours = previousDuty.progressiveDutyHours + this.dutyHours;
    }
  
    return this.progressiveDutyHours;
  }
  calculateProgressiveNightDutyHours(dutyIndex: number, totalDuties: Duty[]): number {
    if (dutyIndex === 0) {
      // For the first duty, the progressiveNightDutyHours is the same as nightDutyHours
      this.progressiveNightDutyHours = this.nightDutyHours;
    } else {
      // Calculate the progressive night duty hours based on the previous duty's progressiveNightDutyHours
      const previousDuty = totalDuties[dutyIndex - 1];
      this.progressiveNightDutyHours = previousDuty.progressiveNightDutyHours + this.nightDutyHours;
    }

    return this.progressiveNightDutyHours;
  }
  updateDutyHoursForLeaveTypes(typeOfWork: string) {
    const leaveTypes = ["Paid leave", "Sick leave", "Casual leave"];

    if (leaveTypes.includes(typeOfWork)) {
      this.dutyHours = 7.41;
      this.dutyAllowance = 0;
      this.dutyDistance = 0;
    } else {
      this.dutyHours = this.calculateDutyHours();
      this.dutyAllowance = this.calculateTotalAllowance();
      this.dutyDistance = this.calculateTotalDistance();
    }
  }

  updateTrip(tripId: number, updatedTrip: Trip) {
    const tripIndex = this.trips.findIndex((trip) => trip.id === tripId);
    if (tripIndex !== -1) {
      this.trips[tripIndex] = updatedTrip;
    }
  }

  private calculateDutyHours(): number {
    if (this.signIn && this.signOff) {
      const timeDiff = this.signOff.getTime() - this.signIn.getTime();
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      return hours + minutes / 60;
    }
    return 0;
  }

  private calculateNightDutyHours(): number {
    if (this.signIn && this.signOff) {
      const NIGHT_START_HOUR = 22; // 10 PM
      const NIGHT_END_HOUR = 6; // 6 AM
      let nightDutyMinutes = 0;

      // Start counting from signIn and stop at signOff
      let current = new Date(this.signIn);

      while (current < this.signOff) {
        let hour = current.getHours();
        if (hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR) {
          nightDutyMinutes++; // Count each minute during the night hours
        }
        current.setMinutes(current.getMinutes() + 1); // Move to next minute
      }

      // Convert total minutes to hours in decimal
      let nightDutyHours = nightDutyMinutes / 60;

      return nightDutyHours;
    }

    return 0;
  }
}

export default Duty;
