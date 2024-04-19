import React from "react";
import Duty from "./Duty";
import "./DutyInfo.css";

interface DutyInfoProps {
  duty: Duty;
}

const DutyInfo: React.FC<DutyInfoProps> = ({ duty }) => {
  return (
    <div className="duty-info">
      <div>Sign In: {duty.signIn ? duty.signIn.toLocaleString() : "-"}</div>
      <div>Sign Off: {duty.signOff ? duty.signOff.toLocaleString() : "-"}</div>
      <div> OSDA: {duty.isOSDA ? "Yes" : "No"}</div>
      <div> RRA: {duty.isRRA ? "Yes" : "No"}</div>
      <div>Total Allowance: {duty.calculateTotalAllowance().toFixed(2)}</div>
      <div>Total Distance: {duty.calculateTotalDistance().toFixed(2)}</div>
      <div>Duty Hours: {duty.dutyHours.toFixed(2)}</div>
    </div>
  );
};

export default DutyInfo;