import Trip from "../trip/Trip";

class Duty {
  id: number;
  trips: Trip[];
  signIn: Date | null;
  signOff: Date | null;
  dutyHours: number;
  nightDutyHours: number;
  isOSDA: boolean;
  isRRA: boolean

  constructor(id: number, trips: Trip[] = []) {
    this.id = id;
    this.trips = trips;
    this.signIn = null;
    this.signOff = null;
    this.dutyHours = 0;
    this.nightDutyHours = 0;
    this.isOSDA = false;
    this.isRRA = false;
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
      let nightDutyHours = 0;
      let currentDate = new Date(this.signIn);

      while (currentDate < this.signOff) {
        const nightStart = new Date(currentDate);
        nightStart.setHours(22, 0, 0, 0); // 10 PM

        const nightEnd = new Date(currentDate);
        nightEnd.setHours(30, 0, 0, 0); // 6 AM the next day (30 hours)

        const intersectionStart = Math.max(
          currentDate.getTime(),
          nightStart.getTime()
        );
        const intersectionEnd = Math.min(
          this.signOff.getTime(),
          nightEnd.getTime()
        );

        if (intersectionStart < intersectionEnd) {
          const intersectionDuration = intersectionEnd - intersectionStart;
          const hours = Math.floor(intersectionDuration / (1000 * 60 * 60));
          const minutes = Math.floor(
            (intersectionDuration % (1000 * 60 * 60)) / (1000 * 60)
          );
          nightDutyHours += hours + minutes / 60;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return nightDutyHours;
    }
    return 0;
  }
}

export default Duty;
