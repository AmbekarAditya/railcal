import React from "react";
import Duty from "../duty/Duty";
import Trip from "../trip/Trip";
import { ScrollView, StyleSheet } from "react-native";
import DutyRow from "../duty/DutyRow";
import EndDutyModal from "../end-duty-modal/EndDutyModal";
import "./MainTable.css";
import Modal from "../modal/Modal";
import { NavigationProp } from "@react-navigation/native";
import SummaryBlock from "../summary-block/SummaryBlock";
import calculateLeaveMileage from "../allowancecalculation/leaveMileage";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import ReportDocument from "./ReportDocument";

interface MainTableProps {
  navigation: NavigationProp<any>;
  selectedMonth: string;
  rateOfPay: Number;
}
interface MainTableState {
  duties: Duty[];
  showModal: boolean;
  selectedDuty: Duty | null;
  totalLeaves: number;
}

class MainTable extends React.Component<MainTableProps, MainTableState> {
  state: MainTableState = {
    duties: [],
    showModal: false,
    selectedDuty: null,
    totalLeaves: 0,
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
      trainNumber: "",
      distance: 0,
      allowance: 1,
      remarks: "",
      dutyHours: "",
    };

    const duty: Duty = new Duty(1, [trip]);

    this.state = {
      duties: [duty],
      showModal: false,
      selectedDuty: null,
      totalLeaves: 0,
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
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === updatedDuty.id) {
          return updatedDuty;
        }
        return duty;
      }),
      showModal: false,
    }));
  };

  updateTripData = (
    dutyId: number,
    tripId: number,
    field: keyof Trip,
    value: string | number
  ) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const tripToUpdate = duty.trips.find((trip) => trip.id === tripId);
          if (tripToUpdate) {
            const updatedTrip = { ...tripToUpdate, [field]: value };
            if (field === "typeOfWork") {
              const leaveTypes = ["Paid leave", "Sick leave", "Casual leave"];
              const isLeave = leaveTypes.includes(value as string);
              if (isLeave) {
                this.setState((prevState) => ({
                  totalLeaves: prevState.totalLeaves + 1,
                }));
              } else {
                this.setState((prevState) => ({
                  totalLeaves: Math.max(prevState.totalLeaves - 1, 0),
                }));
              }
            }
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
      const dutyDistance = duty.trips.reduce(
        (tripAcc, trip) => tripAcc + (trip.distance || 0),
        0
      );
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
  setTotalLeaves = (newTotalLeaves: number) => {
    this.setState({ totalLeaves: newTotalLeaves });
  };

  render() {
    const { duties, showModal, selectedDuty, totalLeaves } = this.state;
    const { selectedMonth } = this.props;

    const totalAllowance = this.calculateTotalAllowance();
    const totalKilometers = duties.reduce((acc, duty) => {
      const dutyDistance = duty.trips.reduce(
        (tripAcc, trip) => tripAcc + (trip.distance || 0),
        0
      );
      return acc + dutyDistance;
    }, 0);


    const { lmc, lma } = calculateLeaveMileage({
      rateOfPay: 1000,
      daysInMonth: 30,
      totalLeaves: 5,
    });
    const mileage = 1.5; // Replace with the actual mileage calculation
    const nightDutyAllowance = 100; // Replace with the actual night duty allowance calculation
    const nationalHolidayAllowance = 1; // Replace with the actual national holiday allowance calculation
    const leaveMileageAllowance =lma;// Replace with the actual leave mileage allowance calculation
    const overTimeAllowance = 75; // Replace with the actual over time allowance calculation

  

    let startDate = "";
    let daysInMonth = 0;

    if (duties.length > 0 && duties[0].trips.length > 0) {
      const firstTripDate = duties[0].trips[0].date;
      if (firstTripDate) {
        startDate = firstTripDate;
        const year = new Date(firstTripDate).getFullYear();
        const month = new Date(firstTripDate).getMonth();
        daysInMonth = new Date(year, month + 1, 0).getDate();
      }
    }

    const endDate = "";
    const rateOfPay = this.props.rateOfPay;
    const osdaCount = this.state.duties.reduce(
      (count, duty) => (duty.isOSDA ? count + 1 : count),
      0
    );
    const rraCount = this.state.duties.reduce(
      (count, duty) => (duty.isRRA ? count + 1 : count),
      0
    );
    
    console.log("OSDA Count:", osdaCount);
    console.log("RRA Count:", rraCount);
    console.log("Leaves: ", totalLeaves);
    console.log("Rate Of Pay: ", rateOfPay);
    console.log("Start Date: ", startDate);
    console.log("Days In Month: ", daysInMonth);
    return (
      <ScrollView
        horizontal
        style={styles.container}
        contentContainerStyle={styles.horizontalContent}
      >
        <ScrollView vertical style={styles.tableContainer}>
          <div style={{ minWidth: 1200 }}>
            {" "}
            {/* Adjust minWidth based on your content width */}
            <table className="duty-table">
              <thead></thead>
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
                    setTotalLeaves={this.setTotalLeaves}
                  ></DutyRow>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollView>
        <div>
          <button onClick={this.addDuty}>Add Duty</button>
          <button
            onClick={() =>
              this.deleteDuty(
                duties.length > 0 ? duties[duties.length - 1].id : null
              )
            }
          >
            Delete Duty
          </button>
        </div>
        {duties.length > 0 && duties[0].trips.length > 0 && (
          <SummaryBlock
            totalAllowance={totalAllowance}
            totalKilometers={totalKilometers}
            mileage={mileage}
            nightDutyAllowance={nightDutyAllowance}
            nationalHolidayAllowance={nationalHolidayAllowance}
            leaveMileageAllowance={leaveMileageAllowance}
            overTimeAllowance={overTimeAllowance}
            startDate={startDate}
            endDate={endDate}
            daysInMonth={daysInMonth}
          />
        )}
        <Modal
          isOpen={showModal}
          onClose={() => this.setState({ showModal: false })}
        >
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
    flexDirection: "column",
    flexGrow: 1, // This makes sure it takes up as much space as it needs
  },
  tableContainer: {
    maxHeight: "80%", // Adjust as needed
  },
  summaryBlockContainer: {
    height: "15%", // Adjust as needed
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default MainTable;
