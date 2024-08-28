// Define a TypeScript type for the case parameters
interface CaseParameter {
  max?: number;
  factor: number;
  remark: string;
  isTimeBased?: boolean;
}

// Define a map for the case parameters by typeOfWork
const caseParameters: { [key: string]: CaseParameter | CaseParameter[] } = {
  Through: [
    { max: 120, factor: 1, remark: "considered actual value" },
    { max: 175, factor: 1.2, remark: "+20%" },
    { max: 200, factor: 1.3, remark: "+30%" },
    { max: Infinity, factor: 1.4, remark: "+40%" },
  ],
  "Passanger Train": [
    { max: 120, factor: 1, remark: "considered actual value" },
    { max: 175, factor: 1.2, remark: "+20%" },
    { max: 200, factor: 1.3, remark: "+30%" },
    { max: Infinity, factor: 1.4, remark: "+40%" },
  ],
  "Mail Express": [
    { max: 120, factor: 1, remark: "considered actual value" },
    { max: 175, factor: 1.2, remark: "+20%" },
    { max: 200, factor: 1.3, remark: "+30%" },
    { max: Infinity, factor: 1.4, remark: "+40%" },
  ],
  "Stationary Duty(HQ)": { factor: 1, remark: "120" },
  "Stationary Duty(Out of HQ)": { factor: 1, remark: "160" },
  "Light Engine/Multi": { factor: 1, remark: "cosidered actual value" },
  "Spare by Goods": { factor: 1, remark: "cosidered actual value" },
  "Sick leave": { factor: 1, remark: "+ 07:25" },
  "Casual leave": { factor: 1, remark: "+ 07:25" },
  "Paid leave": { factor: 1, remark: "+ 07:25" },
  "Maternal leave": { factor: 1, remark: "+ 07:25" },
  "Paternal leave": { factor: 1, remark: "+ 07:25" },
  Spare: { factor: 0.5, remark: "1/2" },
  Ghat: { factor: 5, remark: "*5" },
  Shunting: { factor: 0.25, remark: "+1 Hour : 15km", isTimeBased: true },
  "Light Engine on Mechanical Account": {
    factor: 0.33,
    remark: "+1hour : 20km",
    isTimeBased: true,
  },
  "Breakdown Specials": {
    factor: 0.41,
    remark: "+1hour : 25km",
    isTimeBased: true,
  },
  "Crane Specials": {
    factor: 0.33,
    remark: "+1hour : 20km",
    isTimeBased: true,
  },
  "Material Train": { factor: 1.0, remark: "+1hour : 20km", isTimeBased: true },
  "Medical Relief Trains": {
    factor: 0.41,
    remark: "+1hour : 25km",
    isTimeBased: true,
  },
  default: { factor: 1, remark: "" },
};

// TypeScript function to calculate allowance and remarks
function calculateAllowanceAndRemarks(
  distance: number,
  typeOfWork: string,
  timeInMinutes: number
): { allowance: number; remarks: string } {
  const params = caseParameters[typeOfWork] || caseParameters["default"];

  if (Array.isArray(params)) {
    for (const param of params) {
      if (distance <= param.max!) {
        return {
          allowance: parseFloat((distance * param.factor).toFixed(2)),
          remarks: param.remark,
        };
      }
    }
  } else {
    let allowance: number;
    if (params.isTimeBased) {
      // Calculate distance based on time for time-based cases
      const timeBasedConstant = getTimeBasedConstant(typeOfWork, timeInMinutes);
      const distance = (timeInMinutes / 60) * timeBasedConstant;
      allowance = parseFloat(distance.toFixed(2));
    } else if (typeOfWork === "Stationary Duty(HQ)") {
      allowance = 120;
    } else if (typeOfWork === "Stationary Duty(Out of HQ)") {
      allowance = 160;
    } else {
      allowance = params.factor
        ? parseFloat((distance * params.factor).toFixed(2))
        : 0;
    }

    return {
      allowance: parseFloat(allowance.toFixed(2)),
      remarks: params.remark,
    };
  }
  return { allowance: 0, remarks: "Invalid typeOfWork or distance" }; // Fallback in case no conditions are met
}

// Helper function to get the time-based constant for the given typeOfWork
function getTimeBasedConstant(
  typeOfWork: string,
  timeInMinutes: number
): number {
  const roundedTimeInMinutes = Math.ceil(timeInMinutes / 5) * 5; // Round up to the nearest multiple of 5
  switch (typeOfWork) {
    case "Shunting":
      return 15;
    case "Light Engine on Mechanical Account":
      return 20;
    case "Breakdown Specials":
      return 25;
    case "Crane Specials":
      return 20;
    case "Material Train":
      return 20; // Special case for Material Train
    case "Medical Relief Trains":
      return 25;
    default:
      return roundedTimeInMinutes; // For other cases, return the rounded time in minutes
  }
}

export default calculateAllowanceAndRemarks;
