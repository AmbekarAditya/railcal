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
    const doc = new jsPDF('l'); // Set landscape orientation

    duties.forEach((duty, dutyIndex) => {
      if (dutyIndex !== 0) {
        doc.addPage();
      }

      doc.setFontSize(12);
      doc.text(`Duty ${dutyIndex + 1}`, 20, 10);

      // Trip header and data
      const tripTable = [
        [
          'Date',
          'Type of Work',
          'Train No.',
          'Dep. Time',
          'Arr. Time',
          
          'Source',
          'Dest.',
          'Distance',
          'Duty Hours',
          'Allowance',
          'Remarks'
        ],
        ...duty.trips.map(trip => [
          trip.date,
          trip.typeOfWork,
          trip.trainNumber,
          trip.departureTime,
          trip.arrivalTime,
          trip.sourceStation,
          trip.destinationStation,
          trip.distance.toString(),
          trip.dutyHours,
          trip.allowance.toString(),
          trip.remarks
        ])
      ];

      doc.autoTable({
        head: [tripTable[0]], // Use the first row as the header
        body: tripTable.slice(1), // Use the remaining rows as the body
        theme: 'grid',
        styles: { fontSize: 8 },
        margin: { top: 20 },
      });

      // DutyInfo
      const dutyInfoData = [
        [
          {
            content: 'Sign In',
            colSpan: 1,
          },
          {
            content: duty.signIn ? duty.signIn.toLocaleString() : '-',
            colSpan: 1,
          },
          {
            content: 'Sign Off',
            colSpan: 1,
          },
          {
            content: duty.signOff ? duty.signOff.toLocaleString() : '-',
            colSpan: 1,
          },
          {
            content: 'Total Allowance:',
            colSpan: 1,
          },
          {
            content: `₹ ${duty.calculateTotalAllowance().toFixed(2)}`,
            colSpan: 1,
          },
          {
            content: 'Total Distance:',
            colSpan: 1,
          },
          {
            content: `${duty.calculateTotalDistance().toFixed(2)} km`,
            colSpan: 1,
          },
          {
            content: 'Duty Hours',
            colSpan: 1,
          },
          {
            content: `${duty.dutyHours.toFixed(2)} H`,
            colSpan: 1,
          },
          {
            content: 'Night Duty Hours :',
            colSpan: 1,
          },
          {
            content: `${duty.nightDutyHours.toFixed(2)} H`,
            colSpan: 1,
          },
        ],
        [
          {
            content: 'Progressive Duty Hours',
            colSpan: 2,
          },
          {
            content: `${duty.progressiveDutyHours.toFixed(2)} H`,
            colSpan: 2,
          },
          {
            content: 'OSDA',
            colSpan: 2,
          },
          {
            content: duty.isOSDA ? 'Yes' : 'No',
            colSpan: 2,
          },
          {
            content: 'RRA',
            colSpan: 2,
          },
          {
            content: duty.isRRA ? 'Yes' : 'No',
            colSpan: 2,
          },
        ],
      ];

      doc.autoTable({
        head: [],
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