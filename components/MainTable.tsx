import React from "react";
import Duty from "./Duty";
import Trip from "./Trip";
import DutyRow from "./DutyRow";
import EndDutyModal from "./EndDutyModal";
import "./MainTable.css";
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import ReportDocument from "./ReportDocument";

interface MainTableProps {
  payband: number;
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
    };

    const duty: Duty = new Duty(1, [trip]);

    this.state = {
      duties: [duty],
      showModal: false,
      selectedDuty: null,
    };
  }

  addDuty = () => {
    const newDuty = new Duty(this.state.duties.length + 1, [Trip]);
    this.setState(
      (prevState) => ({
        duties: [...prevState.duties, newDuty],
      }),

      () => {
        console.log("New duty added:", newDuty);
        console.log("Updated duties:", this.state.duties);
      }
    );
  };

  addTrip = (dutyId: number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const newTrip = new Trip(duty.trips.length + 1);
          return { ...duty, trips: [...duty.trips, newTrip] };
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

  updateTripData = (dutyId: number, tripId: number, field: keyof Trip, value: string | number) => {
    this.setState((prevState) => ({
      duties: prevState.duties.map((duty) => {
        if (duty.id === dutyId) {
          const updatedTrips = duty.trips.map((trip) => {
            if (trip.id === tripId) {
              return { ...trip, [field]: value };
            }
            return trip;
          });
          return { ...duty, trips: updatedTrips };
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


  render() {
    const { duties, showModal, selectedDuty } = this.state;
    const { payband } = this.props;

    return (
      <div>
        <table className="duty-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type of Duty</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Trip Distance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {duties.map((duty) => (
              <DutyRow
                key={duty.id}
                duty={duty}
                addTrip={this.addTrip}
                handleEndDuty={this.handleEndDuty}
                updateTripData={this.updateTripData}
              />
            ))}
          </tbody>
        </table>
     
        <div>
          <button onClick={this.addDuty}>Add Duty</button>
        </div>
        <div className="summary-block">
          {/* Display the summary of the complete allowance */}
          <div>{`Total Allowance: ${this.calculateTotalAllowance()}`}</div>
        </div>
        {showModal && selectedDuty && (
          <EndDutyModal
            duty={selectedDuty}
            updateDutyDetails={this.updateDutyDetails}
            closeModal={() => this.setState({ showModal: false })}
          />
        )}
      </div>
    );
  }
}

export default MainTable;
