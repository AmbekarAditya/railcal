class Trip {
  id: number;
  date: string;
  typeOfWork: string;
  departureTime: string;
  arrivalTime: string;
  timeDifference: number;
  sourceStation: string;
  destinationStation: string;
  distance: number;
  allowance: number;
  remarks: string;

  constructor(id: number) {
    this.id = id;
    this.date = "";
    this.typeOfWork = "";
    this.departureTime = "";
    this.arrivalTime = "";
    this.timeDifference = 0;
    this.sourceStation = "";
    this.destinationStation = "";
    this.distance = 0;
    this.allowance = 0;
    this.remarks = "";
  }
}

export default Trip;
export {};
