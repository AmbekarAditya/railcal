import Trip from "./Trip";

class Duty {
  id: number;
  trips: Trip[];
  signIn: string;
  signOff: string;
  osdaValue: boolean;
  rraValue: boolean;
  dutyHours: number;
  nightDutyHours: number;

  constructor(id: number, signIn: string, signOff: string) {
    this.id = id;
    this.trips = [];
    this.signIn = signIn;
    this.signOff = signOff;

    this.osdaValue = false;
    this.rraValue = false;

    this.dutyHours = 0; // default value
    this.nightDutyHours = 0; // default value

    this.updateDutyHours();
  }

  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private updateDutyHours(): void {
    this.dutyHours = this.calculateDutyHours();
    this.nightDutyHours = this.calculateNightDutyHours();
  }

  private calculateDutyHours(): number {
    const signInDate = this.parseTime(this.signIn);
    const signOffDate = this.parseTime(this.signOff);
    return (signOffDate.getTime() - signInDate.getTime()) / (1000 * 60 * 60);
  }

  private calculateNightDutyHours(): number {
    const nightStart = this.parseTime("22:00");
    const nightEnd = new Date(this.parseTime("06:00").getTime() + 24 * 60 * 60 * 1000); // add 24 hours to handle the overnight case
    const signInDate = this.parseTime(this.signIn);
    const signOffDate = this.parseTime(this.signOff);

    if (signOffDate < signInDate) {
      // Handle crossing midnight correctly
      signOffDate.setDate(signOffDate.getDate() + 1);
    }

    let start = Math.max(signInDate.getTime(), nightStart.getTime());
    let end = Math.min(signOffDate.getTime(), nightEnd.getTime());

    if (signInDate < nightEnd && signOffDate > nightStart) {
      if (signOffDate <= nightEnd) {
        end = signOffDate.getTime();
      } else if (signInDate >= nightStart) {
        start = signInDate.getTime();
      }
    } else {
      return 0; // No overlap
    }

    return Math.max(0, (end - start) / (1000 * 60 * 60));
  }
}

export default Duty;
