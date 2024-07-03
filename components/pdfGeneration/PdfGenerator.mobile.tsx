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
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          
        </style>
      </head>
      <body>
        <h1>Duty Report</h1>
        <table>
          <thead>
            <tr>
              <th>Designation</th>
              <th>Pay Band</th>
              <th>Level</th>
              <th>Rate of Pay</th>
              <th>Selected Month</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${designation}</td>
              <td>${payBand}</td>
              <td>${level}</td>
              <td>${rateOfPay}</td>
              <td>${selectedMonth}</td>
            </tr>
          </tbody>
        </table>
        <br />
        ${duties.map((duty, dutyIndex) => `
        <h2>Duty ${dutyIndex + 1}</h2>
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
        <table>
          <thead>
            <tr>
              <th colspan="2">Duty Info</th>
            </tr>
            <tr>
              <th>Sign In</th>
              <th>Sign Off</th>
              <th>Total Allowance</th>
              <th>Total Distance</th>
              <th>Duty Hours</th>
              <th>Night Duty Hours</th>
              <th>Progressive Duty Hours</th>
              <th>OSDA</th>
              <th>RRA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${duty.signIn ? duty.signIn.toLocaleString() : '-'}</td>
              <td>${duty.signOff ? duty.signOff.toLocaleString() : '-'}</td>
              <td>₹${duty.calculateTotalAllowance().toFixed(2)}</td>
              <td>${duty.calculateTotalDistance().toFixed(2)} km</td>
              <td>${duty.dutyHours.toFixed(2)} H</td>
              <td>${duty.nightDutyHours.toFixed(2)} H</td>
              <td>${duty.progressiveDutyHours.toFixed(2)} H</td>
              <td>${duty.isOSDA ? 'Yes' : 'No'}</td>
              <td>${duty.isRRA ? 'Yes' : 'No'}</td>
            </tr>
          </tbody>
        </table>
      `).join('')}

      <h2>Summary Block</h2>
      <table>
        <thead>
          <tr>
            <th>Total Kilometers</th>
            <th>Mileage</th>
            <th>Night Duty Allowance</th>
            <th>Leave Mileage Allowance</th>
            <th>Dearness Allowance</th>
            <th>Progressive Duty Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${totalKilometers.toFixed(2)}</td>
            <td>₹${mileage.toFixed(2)}</td>
            <td>₹${nightDutyAllowance.toFixed(2)}</td>
            <td>₹${leaveMileageAllowance.toFixed(2)}</td>
            <td>₹${dearnessAllowance.toFixed(2)}</td>
            <td>${progressiveDutyHours.toFixed(2)} H</td>
          </tr>
        </tbody>
      </table>

        ${overtimeResult ? `
          <h2>Overtime Calculation Result</h2>
          <table>
            <thead>
              <tr>
                <th colspan="2">First Fortnight</th>
              </tr>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Overtime Hours</th>
                <th>Overtime Minutes</th>
                <th>Overtime Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${overtimeResult.firstFortnight ? overtimeResult.firstFortnight.startDate.toDateString() : '-'}</td>
                <td>${overtimeResult.firstFortnight ? overtimeResult.firstFortnight.endDate.toDateString() : '-'}</td>
                <td>${overtimeResult.firstFortnight ? overtimeResult.firstFortnight.overtimeHours : '-'}</td>
                <td>${overtimeResult.firstFortnight ? overtimeResult.firstFortnight.overtimeMinutes : '-'}</td>
                <td>${overtimeResult.firstFortnight ? overtimeResult.firstFortnight.overtimeUnit : '-'}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th colspan="2">Second Fortnight</th>
              </tr>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Overtime Hours</th>
                <th>Overtime Minutes</th>
                <th>Overtime Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${overtimeResult.secondFortnight ? overtimeResult.secondFortnight.startDate.toDateString() : '-'}</td>
                <td>${overtimeResult.secondFortnight ? overtimeResult.secondFortnight.endDate.toDateString() : '-'}</td>
                <td>${overtimeResult.secondFortnight ? overtimeResult.secondFortnight.overtimeHours : '-'}</td>
                <td>${overtimeResult.secondFortnight ? overtimeResult.secondFortnight.overtimeMinutes : '-'}</td>
                <td>${overtimeResult.secondFortnight ? overtimeResult.secondFortnight.overtimeUnit : '-'}</td>
              </tr>
            </tbody>
          </table>
        ` : ''}
      </body>
    </html>
  `;
    const { uri } = await Print.printToFileAsync({
      html,
      orientation: 'landscape'

    });
    // Share the PDF file with the user
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share PDF',
      UTI: 'com.adobe.pdf',
    });
  };

  return (
    <View style={styles.container}>
      <Button title="PDF" onPress={generatePDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',}});

    export default PdfGeneratorMobile;