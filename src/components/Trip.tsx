class Trip {
    id: number;
    date: string;
    type: string;
    startTime: string;
    endTime: string;
    distance: string;
  
    constructor(id: number) {
      this.id = id;
      this.date = '';
      this.type = '';
      this.startTime = '';
      this.endTime = '';
      this.distance = '';
    }
  }

export default Trip;
export {};