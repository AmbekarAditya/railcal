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
import saveDutiesToFirestore from "./saveDutiesToFirestore";
import { leaveTypes, monthNames } from "../../utils/constants";
import DutyRow from "../duty/DutyRow";
import EndDutyModal from "../end-duty-modal/EndDutyModal";
import Modal from "../modal/Modal";
import { NavigationProp } from "@react-navigation/native";
import SummaryBlock from "../summary-block/SummaryBlock";
import calculateLeaveMileage from "../allowancecalculation/leaveMileage";
import calculateDearnessAllowance from "../allowancecalculation/dearnessAllowance";
import calculateTransportationAllowance from "../allowancecalculation/transportationAllowance";
import calculateOsdaAllowance from "../allowancecalculation/osdaAllowance";
import computeNightDutyAllowance from "../allowancecalculation/nightDutyAllowance";
import mileageCalculation from "../allowancecalculation/mileageCalculation";
import PdfGeneratorMobile from "../pdfGeneration/PdfGenerator.mobile";
import Trip from "../trip/Trip";
import FortnightBlock from "../fortnight-block/FortnightBlock";
import Fortnight from "../fortnight-block/Fortnight";

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
  progressiveDutyHours: number;
  fortnights: Fortnight[];
}

class MainTable extends React.Component<MainTableProps, MainTableState> {
  state: MainTableState = {
    duties: [],
    showModal: false,
    selectedDuty: null,
    totalLeaves: 0,
    overtimeResult: 0,
    progressiveDutyHours: 0,
    fortnights: [],
  };

  constructor(props: MainTableProps) {
    super(props);
    const monthNumber = monthNames[this.props.selectedMonth];
    const paddedMonth = String(monthNumber).padStart(2, "0");

    const trip: Trip = {
      id: 1,
      date: `${new Date().getFullYear()}-${paddedMonth}-01`,
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
    this.setState((prevState) => {
      const monthNumber = monthNames[this.props.selectedMonth];
      const paddedMonth = String(monthNumber).padStart(2, "0");
      
      let newTripDate = `${new Date().getFullYear()}-${paddedMonth}-01`;
      let newSourceStation = "";
  
      const setNextDayDate = (currentDate) => {
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
      };
  
      if (prevState.duties.length > 0) {
        const lastDuty = prevState.duties[prevState.duties.length - 1];
        if (lastDuty.trips.length > 0) {
          const lastTrip = lastDuty.trips[lastDuty.trips.length - 1];
  
          if (leaveTypes.includes(lastTrip.typeOfWork)) {
            // If the last trip is a leave type, set the new trip date to the next day
            newTripDate = setNextDayDate(lastTrip.date);
          } else if (lastTrip.departureTime && lastTrip.arrivalTime) {
            const lastDepartureTime = new Date(`2000-01-01T${lastTrip.departureTime}`);
            const lastArrivalTime = new Date(`2000-01-01T${lastTrip.arrivalTime}`);
            
            if (lastDepartureTime < lastArrivalTime) {
              newTripDate = setNextDayDate(lastTrip.date);
            } else {
              newTripDate = lastTrip.date;
            }
          } else {
            newTripDate = lastTrip.date;
          }
  
          newSourceStation = lastTrip.destinationStation;
        }
      }
  
      const newTrip: Trip = {
        id: 1,
        date: newTripDate,
        typeOfWork: "",
        arrivalTime: "",
        departureTime: "",
        timeDifference: 0,
        sourceStation: newSourceStation,
        destinationStation: "",
        distance: 0,
        allowance: 0,
        remarks: "",
        trainNumber: "",
        dutyHours: "",
      };
  
      const newDuty = new Duty(prevState.duties.length + 1, [newTrip]);
  
      return {
        duties: [...prevState.duties, newDuty],
      };
    });
  };

  addTrip = (dutyId: number) => {
    this.setState((prevState) => {
      const updatedDuties = prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const monthNumber = monthNames[this.props.selectedMonth];
          const paddedMonth = String(monthNumber).padStart(2, "0");
          
          let newTripDate = `${new Date().getFullYear()}-${paddedMonth}-01`;
          let newSourceStation = "";
          
          if (duty.trips.length > 0) {
            // There are existing trips in this duty
            const lastTrip = duty.trips[duty.trips.length - 1];
            if (lastTrip.departureTime && lastTrip.arrivalTime) {
              const lastDepartureTime = new Date(`2000-01-01T${lastTrip.departureTime}`);
              const lastArrivalTime = new Date(`2000-01-01T${lastTrip.arrivalTime}`);
              
              if (lastDepartureTime < lastArrivalTime) {
                // If departure time is less than arrival time, add one day
                const nextDay = new Date(lastTrip.date);
                nextDay.setDate(nextDay.getDate() + 1);
                newTripDate = nextDay.toISOString().split('T')[0];
              } else {
                newTripDate = lastTrip.date;
              }
            } else {
              newTripDate = lastTrip.date;
            }
            newSourceStation = lastTrip.destinationStation;
          } else if (dutyId > 1) {
            // This is the first trip of a duty, but not the first duty
            const previousDuty = prevState.duties.find(d => d.id === dutyId - 1);
            if (previousDuty && previousDuty.trips.length > 0) {
              const lastTripOfPreviousDuty = previousDuty.trips[previousDuty.trips.length - 1];
              if (lastTripOfPreviousDuty.departureTime && lastTripOfPreviousDuty.arrivalTime) {
                const lastDepartureTime = new Date(`2000-01-01T${lastTripOfPreviousDuty.departureTime}`);
                const lastArrivalTime = new Date(`2000-01-01T${lastTripOfPreviousDuty.arrivalTime}`);
                
                if (lastDepartureTime < lastArrivalTime) {
                  // If departure time is less than arrival time, add one day
                  const nextDay = new Date(lastTripOfPreviousDuty.date);
                  nextDay.setDate(nextDay.getDate() + 1);
                  newTripDate = nextDay.toISOString().split('T')[0];
                } else {
                  newTripDate = lastTripOfPreviousDuty.date;
                }
              } else {
                newTripDate = lastTripOfPreviousDuty.date;
              }
              newSourceStation = lastTripOfPreviousDuty.destinationStation;
            }
          }
  
          const newTrip: Trip = {
            id: duty.trips.length + 1,
            date: newTripDate,
            typeOfWork: "",
            arrivalTime: "",
            departureTime: "",
            timeDifference: 0,
            sourceStation: newSourceStation,
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
      });
  
      return { duties: updatedDuties };
    });
  };

  handleEndDuty = (duty: Duty) => {
    this.setState((prevState) => {
      const updatedDuties = prevState.duties.map((d) => {
        if (d.id === duty.id) {
          return duty;
        }
        return d;
      });

      // Filter non-leave duties
      const nonLeaveDuties = updatedDuties.filter((d) => !d.isLeave);

      // Sort duties by signIn time
      const sortedDuties = nonLeaveDuties.sort((a, b) => {
        return new Date(a.signIn).getTime() - new Date(b.signIn).getTime();
      });

      // Calculate cumulative night duty hours and update progressive night duty
      let cumulativeNightDutyHours = 0;
      sortedDuties.forEach((d) => {
        cumulativeNightDutyHours += d.nightDutyHours;
        d.progressiveNightDutyHours = cumulativeNightDutyHours;
      });

      return {
        duties: updatedDuties,
        selectedDuty: duty,
        showModal: true,
      };
    });
  };

  updateProgressiveNightDutyHours = () => {
    this.setState((prevState) => {
      const duties = [...prevState.duties];

      // Filter duties with signIn and signOff
      const completedDuties = duties.filter(
        (duty) => duty.signIn && duty.signOff
      );

      // Sort completed duties by signIn time
      const sortedDuties = completedDuties.sort((a, b) => {
        return new Date(a.signIn).getTime() - new Date(b.signIn).getTime();
      });

      // Calculate cumulative night duty hours and update progressive night duty
      let cumulativeNightDutyHours = 0;
      sortedDuties.forEach((duty) => {
        if (!duty.isLeave) {
          cumulativeNightDutyHours += duty.nightDutyHours;
          duty.progressiveNightDutyHours = cumulativeNightDutyHours;
        }
      });

      return {
        duties: duties,
      };
    });
  };

  updateDutyDetails = (updatedDuty: Duty) => {
    this.setState(
      (prevState) => ({
        duties: prevState.duties.map((duty) => {
          if (duty.id === updatedDuty.id) {
            return updatedDuty;
          }
          return duty;
        }),
        showModal: false,
      }),
      () => {
        // Call updateProgressiveNightDutyHours after the state is updated
        if (updatedDuty.signIn && updatedDuty.signOff) {
          this.updateProgressiveNightDutyHours();
        }
      }
    );
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
                const isLeave = leaveTypes.includes(value as string);
                const wasLeave = leaveTypes.includes(tripToUpdate.typeOfWork);
                if (isLeave && !wasLeave) {
                  this.setState((prevState) => ({
                    totalLeaves: prevState.totalLeaves + 1,
                  }));
                  // Reset arrival and departure time, sign-on and sign-off times, and arrival and departure stations
                  updatedTrip.arrivalTime = "";
                  updatedTrip.departureTime = "";
                  updatedTrip.sourceStation = "";
                  updatedTrip.destinationStation = "";
                  duty.signIn = null;
                  duty.signOff = null;
                  duty.isLeave = true;
                } else if (!isLeave && wasLeave) {
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

  calculateTotalDutyAllowance = () => {
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
    if (!lastDuty) {
      return false;
    }
    return lastDuty.hasEnded;
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

  deleteDuty = (dutyId: number) => {
    this.setState((prevState) => {
      const updatedDuties = prevState.duties.filter(
        (duty) => duty.id !== dutyId
      );

      // If all the duties are deleted, there should be a default duty present.

      if (updatedDuties.length === 0) {
        const monthNumber = monthNames[this.props.selectedMonth];
        const paddedMonth = String(monthNumber).padStart(2, "0");

        const newTrip: Trip = {
          id: 1,
          date: `${new Date().getFullYear()}-${paddedMonth}-01`,
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
  };

  handleOvertimeAllowanceChange = (newAllowance: number) => {
    this.setState({ overtimeResult: newAllowance });
  };

  handleFortnightsChange = (fortnights: Fortnight[]) => {
    this.setState({ fortnights });
  };

  saveDuties = () => {
    // Implement the save functionality here
    saveDutiesToFirestore(this.state.duties, this.props.selectedMonth);
  };

  render() {
    const { overtimeResult, fortnights } = this.state;

    const { duties, showModal, selectedDuty, totalLeaves } = this.state;
    const { rateOfPay, selectedMonth, designation, payBand, level } =
      this.props;

    let startDate = ""; // Default to an empty string

    if (duties.length > 0 && duties[0].trips.length > 0) {
      startDate = duties[0].trips[0].date;
    }

    // Calculate the number of days in the month from the first trip date if available// Assuming selectedMonth is passed as a prop and is the full name of the month
    const year = new Date().getFullYear(); // Use the current year or another relevant year

    let daysInMonth = 1;
    if (selectedMonth && monthNames[selectedMonth]) {
      const month = monthNames[selectedMonth];
      daysInMonth = new Date(year, month, 0).getDate(); // Get the total number of days in the selected month
    }

    // Calculate leave mileage allowance
    const { leaveMileageAllowance } = calculateLeaveMileage({
      rateOfPay,
      daysInMonth,
      duties,
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

    const totalDutyAllowance = this.calculateTotalDutyAllowance();
    const mileage = mileageCalculation(designation, totalDutyAllowance); // Example mileage rate, replace as needed

    const nationalHolidayAllowance = 1; // Example fixed national holiday allowance, replace as needed
    const overTimeAllowance = 75; // Example overtitotalAllowanceme allowance, replace as needed
    const dearnessAllowance = calculateDearnessAllowance(rateOfPay);
    const transportationAllowance =
      calculateTransportationAllowance(designation);
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

    const totalAllowance =
      mileage +
      nightDutyAllowance +
      osdaAllowance +
      leaveMileageAllowance +
      overtimeResult; // OT to be added
    // const progressiveDutyHours = lastDuty ? lastDuty.progressiveDutyHours : 0;

    const calculateTotalDutyHours = (duties: Duty[]): number => {
      return duties.reduce((total, duty) => {
        return (
          total +
          duty.trips.reduce((dutyTotal, trip) => {
            const dutyHours = parseFloat(trip.dutyHours);
            return dutyTotal + (isNaN(dutyHours) ? 0 : dutyHours);
          }, 0)
        );
      }, 0);
    };

    const totalDutyHours = calculateTotalDutyHours(duties);

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
            <Button
              title="Save"
              onPress={this.saveDuties}
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
                totalAllowance={totalDutyAllowance}
                mileage={mileage}
                nightDutyAllowance={nightDutyAllowance}
                leaveMileageAllowance={leaveMileageAllowance}
                dearnessAllowance={dearnessAllowance}
                progressiveDutyHours={totalDutyHours}
                rraOsda={osdaAllowance}
                overtimeResult={overtimeResult}
                grandTotalAllowance={totalAllowance}
                fortnights={fortnights}
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
                mileage={mileage}
                nightDutyAllowance={nightDutyAllowance}
                leaveMileageAllowance={leaveMileageAllowance}
                dearnessAllowance={dearnessAllowance}
                progressiveDutyHours={totalDutyHours}
                overtimeResult={overtimeResult}
              />
            )}
          </View>
        </View>
        <FortnightBlock
          selectedMonth={selectedMonth}
          duties={duties}
          rateOfPay={Number(rateOfPay)}
          dearnessAllowance={dearnessAllowance}
          transportationAllowance={transportationAllowance}
          totalOvertimeAllowance={overtimeResult}
          onOvertimeAllowanceChange={this.handleOvertimeAllowanceChange}
          onFortnightsChange={this.handleFortnightsChange}
        />
        {duties.length > 0 && (
          <ScrollView>
            <SummaryBlock
              totalAllowance={totalDutyAllowance}
              totalKilometers={totalKilometers}
              mileage={mileage}
              nightDutyAllowance={nightDutyAllowance}
              nationalHolidayAllowance={nationalHolidayAllowance}
              leaveMileageAllowance={leaveMileageAllowance}
              overTimeAllowance={overTimeAllowance}
              dearnessAllowance={dearnessAllowance}
              transportationAllowance={transportationAllowance}
              startDate={startDate}
              endDate={""}
              rraOsda={osdaAllowance}
              daysInMonth={daysInMonth}
              grandTotalAllowance={totalAllowance}
              overtimeResult={overtimeResult}
            />
          </ScrollView>
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
              selectedMonth={selectedMonth}
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
  summaryBlockContainer: {
    height: "15%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
  },
  tableContainer: {
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "20%",
    // marginBottom: 16,
  },
  addDuty: {
    flex: 1,
    marginLeft: 8,
  },
});

export default MainTable;
