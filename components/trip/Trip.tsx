class Trip {
  id: number;
  date: string;
  typeOfWork: string;
  trainNumber:string;
  departureTime: string;
  arrivalTime: string;
  timeDifference: number;
  sourceStation: string;
  destinationStation: string;
  distance: number;
  dutyHours:string;
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
    this.trainNumber="";
    this.remarks = "";
    this.dutyHours="";
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      typeOfWork: this.typeOfWork,
      arrivalTime: this.arrivalTime,
      departureTime: this.departureTime,
      timeDifference: this.timeDifference,
      sourceStation: this.sourceStation,
      destinationStation: this.destinationStation,
      distance: this.distance,
      allowance: this.allowance,
      remarks: this.remarks,
      trainNumber: this.trainNumber,
      dutyHours: this.dutyHours,
    };
  }
}



export default Trip;
export {};
