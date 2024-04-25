import React from "react";
import Duty from "./Duty";
import "./DutyInfo.css";

interface DutyInfoProps {
  duty: Duty;
}

const DutyInfo: React.FC<DutyInfoProps> = ({ duty }) => {
  return (
    
    //   <div>Sign In: {duty.signIn ? duty.signIn.toLocaleString() : "-"}</div>
    //   <div>Sign Off: {duty.signOff ? duty.signOff.toLocaleString() : "-"}</div>
    //   <div> OSDA: {duty.isOSDA ? "Yes" : "No"}</div>
    //   <div> RRA: {duty.isRRA ? "Yes" : "No"}</div>
    //   <div>Total Allowance: {duty.calculateTotalAllowance().toFixed(2)}</div>
    //   <div>Total Distance: {duty.calculateTotalDistance().toFixed(2)}</div>
    //   <div>Duty Hours: {duty.dutyHours.toFixed(2)}</div>
    //   <div>Night Duty Hours : {duty.nightDutyHours.toFixed(2)}</div>
    //   <div>Progressive Duty Hours: {duty.progressiveDutyHours.toFixed(2)}</div>
    // </div>
    <div className="main">
     <div className="duty-info-container">
     <div className="duty-content">
       <div className="info-block">
         <div className="label">Sign In</div>
         <div className="value">{duty.signIn ? duty.signIn.toLocaleString() : "-"}</div>
       </div>
       <div className="info-block">
         <div className="label">Sign Off</div>
         <div className="value">{duty.signOff ? duty.signOff.toLocaleString() : "-"}</div>
       </div>
       <div className="info-block">
         <div className="label">Total Allowance:</div>
         <div className="value">₹ {duty.calculateTotalAllowance().toFixed(2)}</div>
       </div>
       <div className="info-block">
         <div className="label">Total Distance:</div>
         <div className="value">{duty.calculateTotalDistance().toFixed(2)} km</div>
       </div>
       <div className="info-block">
         <div className="label">Duty Hours</div>
         <div className="value">{duty.dutyHours.toFixed(2)} H</div>
       </div>
       <div className="info-block">
         <div className="label">Night Duty Hours :</div>
         <div className="value">{duty.nightDutyHours.toFixed(2)} H</div>
       </div>
       <div className="info-block">
         <div className="label">Progressive Duty Hours</div>
         <div className="value">{duty.progressiveDutyHours.toFixed(2)} H</div>
       </div>
       <div className="info-block">
         <div className="label">OSDA</div>
         <div className="value">{duty.isOSDA ? "Yes" : "No"}</div>
       </div>
       <div className="info-block">
         <div className="label">RRA</div>
         <div className="value">{duty.isRRA ? "Yes" : "No"}</div>
       </div>
     </div>
   </div>
   </div>
  );
};

export default DutyInfo;