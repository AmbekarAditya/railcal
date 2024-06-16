// FortnightBlock.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { format } from 'date-fns';
import Duty from '../duty/Duty';
import Fortnight from './Fortnight';


interface FortnightBlockProps {
  selectedMonth: string;
  duties: Duty[];
  rateOfPay: number;
  dearnessAllowance: number;
  transportationAllowance: number;
  totalOvertimeAllowance: number;
  onOvertimeAllowanceChange: (newAllowance: number) => void;
  onFortnightsChange: (fortnights: Fortnight[]) => void;
}

const FORTNIGHT_DATES = [
  new Date('2024-01-01'),
  new Date('2024-01-15'),
  new Date('2024-01-29'),
  new Date('2024-02-12'),
  new Date('2024-02-26'),
  new Date('2024-03-11'),
  new Date('2024-03-25'),
  new Date('2024-04-08'),
  new Date('2024-04-22'),
  new Date('2024-05-06'),
  new Date('2024-05-19'),
  new Date('2024-06-02'),
  new Date('2024-06-16'),
  new Date('2024-06-30'),
  new Date('2024-07-14'),
  new Date('2024-07-28'),
  new Date('2024-08-11'),
  new Date('2024-08-25'),
  new Date('2024-09-08'),
  new Date('2024-09-22'),
  new Date('2024-10-06'),
  new Date('2024-10-20'),
  new Date('2024-11-03'),
  new Date('2024-11-17'),
  new Date('2024-12-01'),
  new Date('2024-12-15'),
  new Date('2024-12-29')
];


const FortnightBlock: React.FC<FortnightBlockProps> = ({
    selectedMonth,
    duties,
    rateOfPay,
    dearnessAllowance,
    transportationAllowance,
    totalOvertimeAllowance,
    onOvertimeAllowanceChange,
    onFortnightsChange,
  }) => {
    const [fortnights, setFortnights] = useState<Fortnight[]>([]);
    const [inputHours, setInputHours] = useState(0);
  
    useEffect(() => {
      recalculateFortnights(inputHours);
      onFortnightsChange(fortnights);
    }, [selectedMonth, duties, inputHours]);
  
    const recalculateFortnights = (baseProgressiveHours: number) => {
      const monthIndex = new Date(Date.parse(`${selectedMonth} 1, 2024`)).getMonth();
      const startDate = new Date(2024, monthIndex, 1);
      const endDate = new Date(2024, monthIndex + 1, 0);
    
      // Sort duties by start date in ascending order
      const sortedDuties = [...duties].sort((a, b) => new Date(a.signIn).getTime() - new Date(b.signIn).getTime());
    
      const intersectingFortnights: Fortnight[] = FORTNIGHT_DATES.filter((date) => {
        const fortnightEnd = new Date(date);
        fortnightEnd.setDate(fortnightEnd.getDate() + 13);
        return date <= endDate && fortnightEnd >= startDate;
      }).map((startDate, index) => {
        const endDate = new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000);
        let totalForthnightDuration = 0;
        let progressiveDutyHours = index === 0 ? baseProgressiveHours : 0;
        let lastDutyProgressiveHours = progressiveDutyHours;
    
        sortedDuties.forEach((duty) => {
          const dutyStart = new Date(duty.signIn);
          if (dutyStart >= startDate && dutyStart <= endDate) {
            const dutyHours = duty.dutyHours && !isNaN(duty.dutyHours) ? parseFloat(duty.dutyHours) : 0;
            totalForthnightDuration += dutyHours;
            progressiveDutyHours += dutyHours;
            duty.progressiveDutyHours = progressiveDutyHours;
            lastDutyProgressiveHours = progressiveDutyHours;
          }
        });
    
        const basicPlusDAPlusTA = rateOfPay + dearnessAllowance + transportationAllowance + (rateOfPay * 0.30);
        const lowerRate = (basicPlusDAPlusTA * 1.5) / 223;
        const higherRate = (basicPlusDAPlusTA * 2) / 223;
    
        let overtimeAllowance = 0;
        if (totalForthnightDuration > 104) {
          if (totalForthnightDuration <= 108) {
            overtimeAllowance = (totalForthnightDuration - 104) * lowerRate;
          } else {
            overtimeAllowance = (108 - 104) * lowerRate + (totalForthnightDuration - 108) * higherRate;
          }
        }
    
        const totalOvertimeHours = Math.max(totalForthnightDuration - 104, 0);
    
        return new Fortnight(
          startDate,
          endDate,
          lastDutyProgressiveHours,
          overtimeAllowance,
          totalOvertimeHours
        );
      });
    
      const totalOvertimeAllowance = intersectingFortnights.reduce(
        (total, fortnight) => total + fortnight.overtimeAllowance,
        0
      );
    
      setFortnights(intersectingFortnights);
      onOvertimeAllowanceChange(totalOvertimeAllowance);
    };

    const handleApply = () => {
      const hours = Number(inputHours);
      setInputHours(hours);
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fortnights in {selectedMonth}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Progressive Duty Hours</Text>
          <TextInput
            style={styles.input}
            value={inputHours.toString()}
            keyboardType="numeric"
            onChangeText={(text) => setInputHours(Number(text))}
          />
          <Button title="Apply" onPress={handleApply} />
        </View>
        {fortnights.map((fortnight, index) => (
          <View key={index} style={styles.fortnight}>
            <Text style={styles.fortnightText}>
              {format(fortnight.startDate, 'dd MMM yyyy')} - {format(fortnight.endDate, 'dd MMM yyyy')}
            </Text>
            <Text style={styles.fortnightText}>
            Total Fortnight Duration: {fortnight.totalForthnightDuration ? fortnight.totalForthnightDuration.toFixed(2) : '0.00'} hours
            </Text>
            <Text style={styles.fortnightText}>
            Total Overtime Hours: {fortnight.totalOvertimeHours.toFixed(2)}
          </Text>
            <Text style={styles.fortnightText}>
            Overtime Allowance: {fortnight.overtimeAllowance ? fortnight.overtimeAllowance.toFixed(2) : '0.00'}
            </Text>
          </View>
        ))}
        <Text style={styles.totalText}>
        Total Overtime Allowance: {totalOvertimeAllowance ? totalOvertimeAllowance.toFixed(2) : '0.00'}
        </Text>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fortnight: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fortnightText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default FortnightBlock;

