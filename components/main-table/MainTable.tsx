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
import calculateDearnessAllowance from "../allowancecalculation/dearnessAllowance";
import calculateOsdaAllowance from "../allowancecalculation/osdaAllowance";
import computeNightDutyAllowance from "../allowancecalculation/nightDutyAllowance";
import { overtimeCalculation } from '../allowancecalculation/overtimeAllowance';
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import ReportDocument from "./ReportDocument";

interface MainTableProps {
  navigation: NavigationProp<any>;
  selectedMonth: string;
  rateOfPay: Number;
  designation:string;
}
interface MainTableState {
  duties: Duty[];
  showModal: boolean;
  selectedDuty: Duty | null;
  totalLeaves: number;
  overtimeResult: OverTimeCalculationResult | null;
}

class MainTable extends React.Component<MainTableProps, MainTableState> {
  state: MainTableState = {
    duties: [],
    showModal: false,
    selectedDuty: null,
    totalLeaves: 0,
    overtimeResult: null
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

  calculateTotalNightDutyHours = (): number => {
    const { duties } = this.state;
    const totalNightDutyHours = duties.reduce(
      (acc, duty) => acc + duty.nightDutyHours,
      0
    );

    return totalNightDutyHours;
  };

  componentDidUpdate(prevProps: MainTableProps, prevState: MainTableState) {
    if (prevState.duties !== this.state.duties) {
      let startDate = null;
      if (this.state.duties.length > 0 && this.state.duties[0].trips.length > 0) {
        const firstTripDate = this.state.duties[0].trips[0].date;
        if (firstTripDate) {
          startDate = new Date(firstTripDate);
        }
      }
  
      const overtimeResult = overtimeCalculation(this.state.duties, startDate);
      this.setState({ overtimeResult });
    }
  }

  deleteDuty = (dutyId: number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.filter((duty) => duty.id !== dutyId),
    }));
  };
  setTotalLeaves = (newTotalLeaves: number) => {
    this.setState({ totalLeaves: newTotalLeaves });
  };

  render() {
    const { overtimeResult } = this.state;
    const totalDuties = this.state.duties;

totalDuties.forEach((duty, index) => {
  const progressiveDutyHours = duty.calculateprogressiveDutyHours(index, totalDuties);
  
});

  if (overtimeResult) {
    console.log('Overtime Calculation Result:', overtimeResult);

    if (overtimeResult.firstFortnight) {
      console.log('First Fortnight:');
      console.log('Start Date:', overtimeResult.firstFortnight.startDate);
      console.log('End Date:', overtimeResult.firstFortnight.endDate);
      console.log('Overtime Hours:', overtimeResult.firstFortnight.overtimeHours);
      console.log('Overtime Minutes:', overtimeResult.firstFortnight.overtimeMinutes);
      console.log('Overtime Unit:', overtimeResult.firstFortnight.overtimeUnit);
    }

    if (overtimeResult.secondFortnight) {
      console.log('Second Fortnight:');
      console.log('Start Date:', overtimeResult.secondFortnight.startDate);
      console.log('End Date:', overtimeResult.secondFortnight.endDate);
      console.log('Overtime Hours:', overtimeResult.secondFortnight.overtimeHours);
      console.log('Overtime Minutes:', overtimeResult.secondFortnight.overtimeMinutes);
      console.log('Overtime Unit:', overtimeResult.secondFortnight.overtimeUnit);
    }
  }
    const { duties, showModal, selectedDuty, totalLeaves } = this.state;
    const { rateOfPay, selectedMonth, designation} = this.props;
    console.log('Received designation prop:', designation);
    if (designation === undefined) {
      console.error('Designation prop is undefined');
    }
    // Calculate the number of days in the month from the first trip date if available
    let daysInMonth = 1;
    let startDate = ""; // Default to 1 to prevent division by zero errors
    if (duties.length > 0 && duties[0].trips.length > 0) {
      const firstTripDate = duties[0].trips[0].date;
      if (firstTripDate) {
        startDate = firstTripDate;
        const year = new Date(firstTripDate).getFullYear();
        const month = new Date(firstTripDate).getMonth();
        daysInMonth = new Date(year, month + 1, 0).getDate(); // Correctly calculate days in month
      }
    }

    // Calculate leave mileage allowance
    const { lmc, lma } = calculateLeaveMileage({
      rateOfPay,
      daysInMonth,
      totalLeaves,
    });

    // Calculate total kilometers from duties
    const totalKilometers = duties.reduce((acc, duty) => {
      const dutyDistance = duty.trips.reduce(
        (tripAcc, trip) => tripAcc + (trip.distance || 0),
        0
      );
      return acc + dutyDistance;
    }, 0);

    const totalAllowance = this.calculateTotalAllowance();
    const mileage = 1.5; // Example mileage rate, replace as needed

    const nationalHolidayAllowance = 1; // Example fixed national holiday allowance, replace as needed
    const overTimeAllowance = 75; // Example overtime allowance, replace as needed
    const dearnessAllowance = calculateDearnessAllowance(rateOfPay);
    const totalNightDutyHours = this.calculateTotalNightDutyHours();
    const nightDutyAllowance = computeNightDutyAllowance(
      rateOfPay,
      dearnessAllowance,
      totalNightDutyHours
    );
    const osdaCount = this.state.duties.reduce(
      (count, duty) => (duty.isOSDA ? count + 1 : count),
      0
    );
    const rraCount = this.state.duties.reduce(
      (count, duty) => (duty.isRRA ? count + 1 : count),
      0
    );

    const osdaAllowance = calculateOsdaAllowance(designation, osdaCount);
    const lastDuty = duties[duties.length - 1];
    const progressiveDutyHours = lastDuty ? lastDuty.progressiveDutyHours : 0;

    console.log("OSDA Count:", osdaCount);
    console.log("RRA Count:", rraCount);
    console.log("Leaves: ", totalLeaves);
    console.log("Rate Of Pay: ", rateOfPay);
    console.log("Start Date: ", startDate);
    console.log("Days In Month: ", daysInMonth);
    console.log("Dearness Allowance: ",dearnessAllowance);
    console.log("OSDA Allowance: ",osdaAllowance);
    console.log("Total night duty hours ",totalNightDutyHours);
    console.log("Night Duty Allowance ",nightDutyAllowance);
    console.log("Progressive Duty Hours :",progressiveDutyHours);
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
                    deleteDuty={this.deleteDuty}
                  ></DutyRow>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollView>
        <div>
          <button onClick={this.addDuty}>Add Duty</button>
        </div>
        {duties.length > 0 && duties[0].trips.length > 0 && (
          <SummaryBlock
            totalAllowance={totalAllowance}
            totalKilometers={totalKilometers}
            mileage={mileage}
            nightDutyAllowance={nightDutyAllowance}
            nationalHolidayAllowance={nationalHolidayAllowance}
            leaveMileageAllowance={lma}
            overTimeAllowance={overTimeAllowance}
            dearnessAllowance={dearnessAllowance}
            startDate={startDate}
            progressiveDutyHours={progressiveDutyHours}
            endDate={""}
            daysInMonth={daysInMonth}
            overtimeResult={overtimeResult}
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
