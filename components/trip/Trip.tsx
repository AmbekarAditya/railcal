class Trip {
  id: number;
  date: string;
  typeOfWork: string;
  trainNumber: string;
  departureTime: string;
  arrivalTime: string;
  timeDifference: number;
  sourceStation: string;
  destinationStation: string;
  distance: number;
  allowance: number;
  remarks: string;
  dutyHours: string;

  constructor(id: number, data?: Partial<Trip>) {
    this.id = id;
    this.date = data?.date || "";
    this.typeOfWork = data?.typeOfWork || "";
    this.trainNumber = data?.trainNumber || "";
    this.departureTime = data?.departureTime || "";
    this.arrivalTime = data?.arrivalTime || "";
    this.timeDifference = data?.timeDifference || 0;
    this.sourceStation = data?.sourceStation || "";
    this.destinationStation = data?.destinationStation || "";
    this.distance = data?.distance || 0;
    this.allowance = data?.allowance || 0;
    this.remarks = data?.remarks || "";
    this.dutyHours = data?.dutyHours || "";
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      typeOfWork: this.typeOfWork,
      trainNumber: this.trainNumber,
      departureTime: this.departureTime,
      arrivalTime: this.arrivalTime,
      timeDifference: this.timeDifference,
      sourceStation: this.sourceStation,
      destinationStation: this.destinationStation,
      distance: this.distance,
      allowance: this.allowance,
      remarks: this.remarks,
      dutyHours: this.dutyHours,
    };
  }
}



export default Trip;
export {};
