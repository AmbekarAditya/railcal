import { NavigationProp } from "@react-navigation/native";
import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import Fortnight from "../fortnight-block/Fortnight";

export interface MainTableProps {
  navigation: NavigationProp<any>;
  selectedMonth: string;
  rateOfPay: Number;
  designation: string;
  payBand: string;
  level: string;
}

export interface MainTableState {
  duties: Duty[];
  showModal: boolean;
  selectedDuty: Duty | null;
  totalLeaves: number;
  overtimeResult: number;
  progressiveDutyHours: number;
  fortnights: Fortnight[];
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  } | null;
}

export interface OverTimeCalculationResult {
  // Define the structure of OverTimeCalculationResult here
}
