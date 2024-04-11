import Trip from "./Trip";

class Duty {
    id: number;
    trips: Trip[];
    startTime: string;
    endTime: string;
    isOSDAApplicable: boolean;
    isOTApplicable: boolean;
  
    constructor(id: number) {
      this.id = id;
      this.trips = [];
      this.startTime = '';
      this.endTime = '';
      this.isOSDAApplicable = false;
      this.isOTApplicable = false;
    }
  }

export default Duty;
export {};