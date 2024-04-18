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
      <div>Is OSDA: {duty.isOSDA ? "Yes" : "No"}</div>
      <div>Is RRA: {duty.isRRA ? "Yes" : "No"}</div>
    </div>
  );
};

export default DutyInfo;