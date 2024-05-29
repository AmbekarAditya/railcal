import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Button,
  Platform,
} from "react-native";
import Duty from "../duty/Duty";
import DutyRow from "../duty/DutyRow";
import EndDutyModal from "../end-duty-modal/EndDutyModal";
import Modal from "../modal/Modal";
import { NavigationProp } from "@react-navigation/native";
import SummaryBlock from "../summary-block/SummaryBlock";
import calculateLeaveMileage from "../allowancecalculation/leaveMileage";
import calculateDearnessAllowance from "../allowancecalculation/dearnessAllowance";
import calculateOsdaAllowance from "../allowancecalculation/osdaAllowance";
import computeNightDutyAllowance from "../allowancecalculation/nightDutyAllowance";
import { overtimeCalculation } from "../allowancecalculation/overtimeAllowance";
import mileageCalculation from "../allowancecalculation/mileageCalculation";
import PdfGeneratorMobile from "../pdfGeneration/PdfGenerator.mobile";
import Trip from "../trip/Trip";
let PDFGenerator: JSX.IntrinsicAttributes | null = null;
if (Platform.OS === "web") {
  PDFGenerator = require("../pdfGeneration/PDFGenerator").default;
}

interface MainTableProps {
  navigation: NavigationProp<any>;
  selectedMonth: string;
  rateOfPay: Number;
  designation: string;
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
    overtimeResult: null,
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
    this.setState(
      (prevState) => ({
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
      }),
      () => {
        // Call handleDutiesChange after state is updated
        this.handleDutiesChange(this.state.duties);
      }
    );
  };

  calculateTotalAllowance = () => {
    const { duties } = this.state;
    const totalAllowance = duties.reduce(
      (acc, duty) => acc + duty.dutyAllowance,
      0
    );
    return totalAllowance;
  };

  isPreviousDutyEnded = () => {
    const { duties } = this.state;
    const lastDuty = duties[duties.length - 1];
    return lastDuty && lastDuty.dutyHours > 0.0;
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

  calculateOvertimeResult = (duties: Duty[], startDate: Date) => {
    return overtimeCalculation(duties, startDate);
  };

  deleteDuty = (dutyId: number) => {
    this.setState((prevState) => {
      const updatedDuties = prevState.duties.filter((duty) => duty.id !== dutyId);

      // If all the duties are deleted, there should be a default duty present.
  
      if (updatedDuties.length === 0) {
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
  
        const newDuty = new Duty(1, [newTrip]);
        return { duties: [newDuty] };
      }
  
      return { duties: updatedDuties };
    });
  };

  setTotalLeaves = (newTotalLeaves: number) => {
    this.setState({ totalLeaves: newTotalLeaves });
  };

  handleDutiesChange = (updatedDuties: Duty[] | any[]) => {
    let startDate = null;
    if (updatedDuties.length > 0 && updatedDuties[0].trips.length > 0) {
      const firstTripDate = updatedDuties[0].trips[0].date;
      if (firstTripDate) {
        startDate = new Date(firstTripDate);
      }
    }
  
    const overtimeResult = this.calculateOvertimeResult(updatedDuties, startDate);
  
    // Calculate progressive night duty hours
    updatedDuties.forEach((duty, index) => {
      const progressiveNightDutyHours = duty.calculateProgressiveNightDutyHours(index, updatedDuties);
    });
  
    this.setState({ duties: updatedDuties, overtimeResult });
  };

  render() {
    const { overtimeResult } = this.state;
    const totalDuties = this.state.duties;

    totalDuties.forEach((duty, index) => {
      const progressiveDutyHours = duty.calculateprogressiveDutyHours(
        index,
        totalDuties
      );
    });

    const { duties, showModal, selectedDuty, totalLeaves } = this.state;
    const { rateOfPay, selectedMonth, designation, payBand, level } =
      this.props;

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
    let totalKilometers = duties.reduce((acc, duty) => {
      const dutyDistance = duty.trips.reduce(
        (tripAcc, trip) =>
          tripAcc + (typeof trip.distance === "number" ? trip.distance : 0),
        0
      );
      return acc + dutyDistance;
    }, 0);

    // Set totalKilometers to 120 if it's less than 120
    totalKilometers = Math.max(totalKilometers, 120);

    const totalAllowance = this.calculateTotalAllowance();
    const mileage = mileageCalculation(designation, totalAllowance); // Example mileage rate, replace as needed

    const nationalHolidayAllowance = 1; // Example fixed national holiday allowance, replace as needed
    const overTimeAllowance = 75; // Example overtitotalAllowanceme allowance, replace as needed
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

    return (
      <ScrollView
        horizontal
        style={styles.container}
        contentContainerStyle={styles.horizontalContent}
      >
        <View style={styles.tableContainer}>
          <FlatList
            data={duties}
            renderItem={({ item: duty }) => (
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
                
              />
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.addDuty}>
            <Button
              title="Add Duty"
              onPress={this.addDuty}
              disabled={!this.isPreviousDutyEnded()}
              color={colors.primary}
            />
          </View>
          <View style={styles.addDuty}>
            {Platform.OS === "web" && (
              <PDFGenerator
                duties={duties}
                designation={designation}
                payBand={payBand}
                level={level}
                rateOfPay={rateOfPay}
                selectedMonth={selectedMonth}
                totalAllowance={totalAllowance}
                totalKilometers={totalKilometers}
                mileage={mileage}
                nightDutyAllowance={nightDutyAllowance}
                leaveMileageAllowance={lma}
                dearnessAllowance={dearnessAllowance}
                progressiveDutyHours={progressiveDutyHours}
                rraOsda={osdaAllowance}
                overtimeResult={overtimeResult}
              />
            )}
            {Platform.OS !== "web" && (
              <PdfGeneratorMobile
                duties={duties}
                designation={designation}
                payBand={payBand}
                level={level}
                rateOfPay={rateOfPay}
                selectedMonth={selectedMonth}
                totalKilometers={totalKilometers}
                mileage={mileage}
                nightDutyAllowance={nightDutyAllowance}
                leaveMileageAllowance={lma}
                dearnessAllowance={dearnessAllowance}
                progressiveDutyHours={progressiveDutyHours}
                overtimeResult={overtimeResult}
              />
            )}
          </View>
        </View>
        {duties.length > 0 && duties[0].trips.length > 0 && (
          <SummaryBlock
            totalAllowance={this.calculateTotalAllowance()}
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
            rraOsda={osdaAllowance}
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


const colors = {
  primary: "#007AFF",
  border: "#CCCCCC",
  // Add more colors as needed
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalContent: {
    flexDirection: "column",
    flexGrow: 1,
    padding: 16,
  },
  tableContainer: {
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addDuty: {
    flex: 1,
    marginLeft: 8,
  },
  summaryBlockContainer: {
    height: "15%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
});

export default MainTable;
