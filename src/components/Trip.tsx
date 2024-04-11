class Trip {
    id: number;
    date?: string;
    type?: string;
    startTime?: string;
    endTime?: string;
    distance?: number;
  
    constructor(id: number) {
      this.id = id;
      this.date = '';
      this.type = '';
      this.startTime = '';
      this.endTime = '';
      this.distance = 0;
    }
  }
  
  export default Trip;
  export {};