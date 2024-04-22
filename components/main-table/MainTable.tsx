import React from "react";
import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import { ScrollView, StyleSheet } from "react-native";
import DutyRow from "../duty/DutyRow";
import EndDutyModal from "../end-duty-modal/EndDutyModal";
import "./MainTable.css";
import Modal from "../modal/Modal";
import { NavigationProp } from '@react-navigation/native';
import SummaryBlock from "../summary-block/SummaryBlock";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import ReportDocument from "./ReportDocument";

interface MainTableProps {
  navigation: NavigationProp<any>;
  selectedMonth: string;
}

interface MainTableState {
  duties: Duty[];
  showModal: boolean;
  selectedDuty: Duty | null;
}

class MainTable extends React.Component<MainTableProps, MainTableState> {
  state: MainTableState = {
    duties: [],
    showModal: false,
    selectedDuty: null,
  };

  constructor(props: MainTableProps) {
    super(props);

    const trip: Trip = {
      id: 1,
      date: "",
      typeOfWork: "",
      arrivalTime: "",
      departureTime: "",
      timeDifference: 0,
      sourceStation: "",
      destinationStation: "",
      trainNumber:"",
      distance: 0,
      allowance: 1,
      remarks: "",
      dutyHours:"",
    };

    const duty: Duty = new Duty(1, [trip]);

    this.state = {
      duties: [duty],
      showModal: false,
      selectedDuty: null,
    };
  }

  addDuty = () => {
    const newTrip: Trip = {
      id: 1,
      date: "",
      typeOfWork: "",
      arrivalTime: "",
      departureTime: "",
      timeDifference: 0,
      sourceStation: "",
      destinationStation: "",
      distance: 0,
      allowance: 0,
      remarks: "",
      trainNumber: "",
      dutyHours: "",
    };
  
    const newDuty = new Duty(this.state.duties.length + 1, [newTrip]);
    this.setState((prevState) => ({
      duties: [...prevState.duties, newDuty],
    }));
  };
  
  addTrip = (dutyId: number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const newTrip: Trip = {
            id: duty.trips.length + 1,
            date: "",
            typeOfWork: "",
            arrivalTime: "",
            departureTime: "",
            timeDifference: 0,
            sourceStation: "",
            destinationStation: "",
            distance: 0,
            allowance: 0,
            remarks: "",
            trainNumber: "",
            dutyHours: "",
          };
          return new Duty(duty.id, [...duty.trips, newTrip]);
        }
        return duty;
      }),
    }));
  };

  handleEndDuty = (duty: Duty) => {
    this.setState({ selectedDuty: duty, showModal: true });
  };

  updateDutyDetails = (updatedDuty: Duty) => {
    console.log('updateDutyDetails called with updatedDuty:', updatedDuty);
    this.setState((prevState) => {
      // Check if the updated duty has at least one trip with a leave type
      const hasLeaveTypeTrip = updatedDuty.trips.some((trip) =>
        ['Sick leave', 'Casual leave', 'Paid leave'].includes(trip.typeOfWork)
      );
  
      console.log('hasLeaveTypeTrip:', hasLeaveTypeTrip);
  
      // If there is at least one trip with a leave type, set dutyHours to "7h 25m"
      if (hasLeaveTypeTrip) {
        updatedDuty.dutyHours = "7h 25m";
        console.log('updatedDuty.dutyHours set to "7h 25m"');
      }
  
      const updatedDuties = prevState.duties.map((duty) => {
        if (duty.id === updatedDuty.id) {
          console.log('Updating duty with id:', duty.id);
          return updatedDuty;
        }
        return duty;
      });
  
      console.log('updatedDuties:', updatedDuties);
  
      return {
        duties: updatedDuties,
        showModal: false,
      };
    });
  };

  updateTripData = (dutyId: number, tripId: number, field: keyof Trip, value: string | number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const tripToUpdate = duty.trips.find((trip) => trip.id === tripId);
          if (tripToUpdate) {
            const updatedTrip = { ...tripToUpdate, [field]: value };
            duty.updateTrip(tripId, updatedTrip);
          }
        }
        return duty;
      }),
    }));
  };

  calculateTotalAllowance = () => {
    const { duties } = this.state;
    const totalDistance = duties.reduce((acc, duty) => {
      const dutyDistance = duty.trips.reduce((tripAcc, trip) => tripAcc + (trip.distance || 0), 0);
      return acc + dutyDistance;
    }, 0);

    return totalDistance;
  };
  deleteTrip = (dutyId: number, tripId: number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const updatedTrips = duty.trips.filter((trip) => trip.id !== tripId);
          return new Duty(duty.id, updatedTrips);
        }
        return duty;
      }),
    }));
  };

  deleteDuty = (dutyId: number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.filter((duty) => duty.id !== dutyId),
    }));
  };
  render() {
    const { duties, showModal, selectedDuty } = this.state;
    const { selectedMonth } = this.props;

    const totalAllowance = this.calculateTotalAllowance();
    const totalKilometers = duties.reduce((acc, duty) => {
      const dutyDistance = duty.trips.reduce((tripAcc, trip) => tripAcc + (trip.distance || 0), 0);
      return acc + dutyDistance;
    }, 0);

    const mileage = 1.5; // Replace with the actual mileage calculation
    const nightDutyAllowance = 100; // Replace with the actual night duty allowance calculation
    const nationalHolidayAllowance = 200; // Replace with the actual national holiday allowance calculation
    const leaveMileageAllowance = 150; // Replace with the actual leave mileage allowance calculation
    const rraOsda = 50; // Replace with the actual RRA/OSDA calculation
    const overTimeAllowance = 75; // Replace with the actual over time allowance calculation
    const startDate = "24/05/2023"; // Replace with the actual start date
    const endDate = "06/06/2023"; // Replace with the actual end date
  
    return (
      <ScrollView
        horizontal
        style={styles.container}
        contentContainerStyle={styles.horizontalContent}
      >
        <ScrollView
          vertical
          style={styles.tableContainer}
        >
          <div style={{ minWidth: 1200 }}> {/* Adjust minWidth based on your content width */}
            <table className="duty-table">
              <thead>
                
              </thead>
              <tbody>
                {duties.map((duty) => (
                <DutyRow
                key={duty.id}
                duty={duty}
                addTrip={this.addTrip}
                handleEndDuty={this.handleEndDuty}
                updateTripData={this.updateTripData}
                selectedMonth={selectedMonth}
                deleteTrip={this.deleteTrip}
                updateDutyDetails={this.updateDutyDetails}
                deleteDuty={this.deleteDuty}
              >
               
              </DutyRow>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollView>
        <div>
          <button onClick={this.addDuty}>Add Duty</button>
        </div>

        <SummaryBlock
          totalAllowance={totalAllowance}
          totalKilometers={totalKilometers}
          mileage={mileage}
          nightDutyAllowance={nightDutyAllowance}
          nationalHolidayAllowance={nationalHolidayAllowance}
          leaveMileageAllowance={leaveMileageAllowance}
          rraOsda={rraOsda}
          overTimeAllowance={overTimeAllowance}
          startDate={startDate}
          endDate={endDate}
        />
        <Modal isOpen={showModal} onClose={() => this.setState({ showModal: false })}>
          {selectedDuty && (
            <EndDutyModal
              duty={selectedDuty}
              updateDutyDetails={this.updateDutyDetails}
              closeModal={() => this.setState({ showModal: false })}
            />
          )}
        </Modal>
      </ScrollView>
    );
  }
}  
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: 'column',
    flexGrow: 1, // This makes sure it takes up as much space as it needs
  },
  tableContainer: {
    maxHeight: '80%', // Adjust as needed
  },
  summaryBlockContainer: {
    height: '15%', // Adjust as needed
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default MainTable;