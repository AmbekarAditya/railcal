// PDFGenerator.tsx
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Duty from '../duty/Duty';
import Trip from '../trip/Trip';
import DutyInfo from '../duty/DutyInfo';

interface PDFGeneratorProps {
  duties: Duty[];
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ duties }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Trip header
    const tripHeader = [
      ['Date', 'Type of Work', 'Train No.', 'Dep. Time', 'Arr. Time', 'Time Diff', 'Source', 'Dest.', 'Distance', 'Duty Hours', 'Allowance', 'Remarks']
    ];
    doc.autoTable({
      head: tripHeader,
      theme: 'grid',
      styles: { fontSize: 8 },
      margin: { top: 10 },
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text('Trip Details', 20, 10);
      }
    });

    // Trip data
    const tripData = duties.flatMap(duty =>
      duty.trips.map(trip => [
        trip.date,
        trip.typeOfWork,
        trip.trainNumber,
        trip.departureTime,
        trip.arrivalTime,
        trip.timeDifference.toString(),
        trip.sourceStation,
        trip.destinationStation,
        trip.distance.toString(),
        trip.dutyHours,
        trip.allowance.toString(),
        trip.remarks
      ])
    );
    doc.autoTable({
      body: tripData,
      styles: { fontSize: 8 },
      margin: { top: 10 }
    });

    // Duty data
    const dutyHeader = [
      ['SignIn', 'SignOff', 'Duty Hours', 'Night Duty Hours', 'OSDA', 'RRA', 'Duty Allowance', 'Duty Distance', 'Progressive Duty Hours']
    ];
    doc.autoTable({
      head: dutyHeader,
      theme: 'grid',
      styles: { fontSize: 8 },
      margin: { top: 20 },
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text('Duty Details', 20, data.cursor.y + 10);
      }
    });

    const dutyData = duties.map(duty => [
      duty.signIn ? duty.signIn.toLocaleString() : '',
      duty.signOff ? duty.signOff.toLocaleString() : '',
      duty.dutyHours.toString(),
      duty.nightDutyHours.toString(),
      duty.isOSDA.toString(),
      duty.isRRA.toString(),
      duty.dutyAllowance.toString(),
      duty.dutyDistance.toString(),
      duty.progressiveDutyHours.toString()
    ]);
    doc.autoTable({
      body: dutyData,
      styles: { fontSize: 8 },
      margin: { top: 10 }
    });

    // Add DutyInfo data
    duties.forEach((duty, index) => {
      if (index !== 0) {
        doc.addPage();
      }

      doc.setFontSize(12);
      doc.text(`Duty ${index + 1}`, 20, 10);

      const dutyInfoData = [
        ['Sign In', duty.signIn ? duty.signIn.toLocaleString() : '-'],
        ['Sign Off', duty.signOff ? duty.signOff.toLocaleString() : '-'],
        ['Total Allowance', `₹ ${duty.calculateTotalAllowance().toFixed(2)}`],
        ['Total Distance', `${duty.calculateTotalDistance().toFixed(2)} km`],
        ['Duty Hours', `${duty.dutyHours.toFixed(2)} H`],
        ['Night Duty Hours', `${duty.nightDutyHours.toFixed(2)} H`],
        ['Progressive Duty Hours', `${duty.progressiveDutyHours.toFixed(2)} H`],
        ['OSDA', duty.isOSDA ? 'Yes' : 'No'],
        ['RRA', duty.isRRA ? 'Yes' : 'No'],
      ];

      doc.autoTable({
        head: [['Key', 'Value']],
        body: dutyInfoData,
        theme: 'grid',
        styles: { fontSize: 8 },
        margin: { top: 20 },
      });
    });

    doc.save('duty-report.pdf');
  };

  return (
    <button onClick={generatePDF}>Generate PDF</button>
  );
};

export default PDFGenerator;