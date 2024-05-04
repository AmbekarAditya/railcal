import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Duty from '../duty/Duty';
import Trip from '../trip/Trip';
import { OverTimeCalculationResult } from '../allowancecalculation/overtimeAllowance';

interface PdfGeneratorMobileProps {
  duties: Duty[];
  designation: string;
  payBand: string;
  level: string;
  rateOfPay: number;
  selectedMonth: string;
  totalKilometers: number;
  mileage: number;
  nightDutyAllowance: number;
  leaveMileageAllowance: number;
  dearnessAllowance: number;
  progressiveDutyHours: number;
  overtimeResult: OverTimeCalculationResult | null;
}

const PdfGeneratorMobile: React.FC<PdfGeneratorMobileProps> = ({
  duties,
  designation,
  payBand,
  level,
  rateOfPay,
  selectedMonth,
  totalKilometers,
  mileage,
  nightDutyAllowance,
  leaveMileageAllowance,
  dearnessAllowance,
  progressiveDutyHours,
  overtimeResult,
}) => {
  const generatePDF = async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Duty Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            h1 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Duty Report</h1>
          <p>Designation: ${designation}</p>
          <p>Pay Band: ${payBand}</p>
          <p>Level: ${level}</p>
          <p>Rate of Pay: ${rateOfPay}</p>
          <p>Selected Month: ${selectedMonth}</p>

          ${duties.map((duty, index) => `
            <h2>Duty ${index + 1}</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type of Work</th>
                  <th>Train No.</th>
                  <th>Dep. Time</th>
                  <th>Arr. Time</th>
                  <th>Source</th>
                  <th>Dest.</th>
                  <th>Distance</th>
                  <th>Duty Hours</th>
                  <th>Allowance</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${duty.trips.map((trip) => `
                  <tr>
                    <td>${trip.date}</td>
                    <td>${trip.typeOfWork}</td>
                    <td>${trip.trainNumber}</td>
                    <td>${trip.departureTime}</td>
                    <td>${trip.arrivalTime}</td>
                    <td>${trip.sourceStation}</td>
                    <td>${trip.destinationStation}</td>
                    <td>${trip.distance}</td>
                    <td>${trip.dutyHours}</td>
                    <td>${trip.allowance}</td>
                    <td>${trip.remarks}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p>Sign In: ${duty.signIn ? duty.signIn.toLocaleString() : '-'}</p>
            <p>Sign Off: ${duty.signOff ? duty.signOff.toLocaleString() : '-'}</p>
            <p>Total Allowance: ₹${duty.calculateTotalAllowance().toFixed(2)}</p>
            <p>Total Distance: ${duty.calculateTotalDistance().toFixed(2)} km</p>
            <p>Duty Hours: ${duty.dutyHours.toFixed(2)} H</p>
            <p>Night Duty Hours: ${duty.nightDutyHours.toFixed(2)} H</p>
            <p>Progressive Duty Hours: ${duty.progressiveDutyHours.toFixed(2)} H</p>
            <p>OSDA: ${duty.isOSDA ? 'Yes' : 'No'}</p>
            <p>RRA: ${duty.isRRA ? 'Yes' : 'No'}</p>
          `).join('')}

          <h2>Summary Block</h2>
          <p>Total Kilometers: ${totalKilometers.toFixed(2)}</p>
          <p>Mileage: ₹${mileage.toFixed(2)}</p>
          <p>Night Duty Allowance: ₹${nightDutyAllowance.toFixed(2)}</p>
          <p>Leave Mileage Allowance: ₹${leaveMileageAllowance.toFixed(2)}</p>
          <p>Dearness Allowance: ₹${dearnessAllowance.toFixed(2)}</p>
          <p>Progressive Duty Hours: ${progressiveDutyHours.toFixed(2)} H</p>

          ${overtimeResult ? `
            <h2>Overtime Calculation Result</h2>
            ${overtimeResult.firstFortnight ? `
              <h3>First Fortnight</h3>
              <p>Start Date: ${overtimeResult.firstFortnight.startDate.toDateString()}</p>
              <p>End Date: ${overtimeResult.firstFortnight.endDate.toDateString()}</p>
              <p>Overtime Hours: ${overtimeResult.firstFortnight.overtimeHours}</p>
              <p>Overtime Minutes: ${overtimeResult.firstFortnight.overtimeMinutes}</p>
              <p>Overtime Unit: ${overtimeResult.firstFortnight.overtimeUnit}</p>
            ` : ''}
            ${overtimeResult.secondFortnight ? `
              <h3>Second Fortnight</h3>
              <p>Start Date: ${overtimeResult.secondFortnight.startDate.toDateString()}</p>
              <p>End Date: ${overtimeResult.secondFortnight.endDate.toDateString()}</p>
              <p>Overtime Hours: ${overtimeResult.secondFortnight.overtimeHours}</p>
              <p>Overtime Minutes: ${overtimeResult.secondFortnight.overtimeMinutes}</p>
              <p>Overtime Unit: ${overtimeResult.secondFortnight.overtimeUnit}</p>
            ` : ''}
          ` : ''}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html,
      orientation: 'landscape'
    });

    console.log('PDF generated:', uri);

    // Share the PDF file with the user
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share PDF',
      UTI: 'com.adobe.pdf',
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',}});

    export default PdfGeneratorMobile;