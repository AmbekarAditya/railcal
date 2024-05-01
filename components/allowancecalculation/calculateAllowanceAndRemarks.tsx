// Define a TypeScript type for the case parameters
interface CaseParameter {
    max?: number;
    factor: number;
    remark: string;
    isTimeBased?: boolean;
  }
  
  // Define a map for the case parameters by typeOfWork
  const caseParameters: { [key: string]: CaseParameter | CaseParameter[] } = {
    "Through": [
      { max: 120, factor: 1, remark: "considered actual value" },
      { max: 175, factor: 1.2, remark: "+20%" },
      { max: 200, factor: 1.3, remark: "+30%" },
      { max: Infinity, factor: 1.4, remark: "+40%" }
    ],
    "Sick leave": { factor: 1, remark: "+7 hours 25 minutes" },
    "Casual leave": { factor: 1, remark: "+7 hours 25 minutes" },
    "Paid leave": { factor: 1, remark: "+7 hours 25 minutes" },
    "Spare": { factor: 0.5, remark: "1/2" },
    "Ghat": { factor: 5, remark: "*5" },
    "Shunting": { factor: 0.25, remark: "+1 Hour : 15km", isTimeBased: true },
    "Light Engine on Mechanical Account": { factor: 0.33, remark: "+1hour : 20km", isTimeBased: true },
    "Breakdown Specials": { factor: 0.41, remark: "+1hour : 25km", isTimeBased: true },
    "Crane Specials": { factor: 0.33, remark: "+1hour : 20km", isTimeBased: true },
    "Material Train": { factor: 0.33, remark: "+0.33", isTimeBased: true },
    "Medical Relief Trains": { factor: 0.41, remark: "+1hour : 25km", isTimeBased: true },
    "default": { factor: 1, remark: "default remarks" }
  };
  
  // TypeScript function to calculate allowance and remarks
  function calculateAllowanceAndRemarks(distance: number, typeOfWork: string, timeInMinutes: number): { allowance: number, remarks: string } {
    const params = caseParameters[typeOfWork] || caseParameters["default"];
    
    if (Array.isArray(params)) {
      for (const param of params) {
        if (distance <= param.max!) {
          return {
            allowance: Math.round(distance * param.factor),
            remarks: param.remark
          };
        }
      }
    } else {
      let allowance: number;
      if (typeOfWork === "Material Train") {
        allowance = distance * 0.33; // Adjusted calculation for "Material Train"
      } else {
        allowance = params.factor 
                    ? (params.isTimeBased ? timeInMinutes * params.factor : distance * params.factor)
                    : 0;
      }
    
      return {
        allowance: Math.round(allowance),
        remarks: params.remark
      };
    }
    return { allowance: 0, remarks: "Invalid typeOfWork or distance" }; // Fallback in case no conditions are met
  }
  
  export default calculateAllowanceAndRemarks;
  