import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Duty from './Duty';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      padding: 10
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: '#bfbfbf',
      borderStyle: "solid",
      alignItems: 'center',
      height: 24
    },
    tableColHeader: {
      width: "25%",
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
      borderStyle: "solid",
      padding: 5,
      fontWeight: 'bold'
    },
    tableCol: {
      width: "25%",
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
      borderStyle: "solid",
      padding: 5
    },
    tableCell: {
      fontSize: 10
    }
  });
  

interface ReportDocumentProps {
    duties: Duty[];
  }

  const ReportDocument: React.FC<ReportDocumentProps> = ({ duties }) => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ flexDirection: 'column', marginBottom: 20 }}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Duty ID</Text>
              <Text style={styles.tableColHeader}>Start</Text>
              <Text style={styles.tableColHeader}>End</Text>
              <Text style={styles.tableColHeader}>Trips</Text>
            </View>
            {duties.map((duty, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{duty.id}</Text>
                <Text style={styles.tableCol}>{duty.startTime}</Text>
                <Text style={styles.tableCol}>{duty.endTime}</Text>
                <Text style={styles.tableCol}>
                  {duty.trips.map((trip, index) => `Trip ID: ${trip.id}`).join(", ")}
                </Text>
              </View>
            ))}
          </View>
          <Text style={{ marginTop: 10 }}>Summary: Total Duties - {duties.length}</Text>
        </Page>
      </Document>
    );
  }
  
  export default ReportDocument;
