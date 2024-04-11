import React from "react";
import Duty from "./Duty";
import Trip from "./Trip";
import DutyRow from "./DutyRow";
import EndDutyModal from "./EndDutyModal";
import "./MainTable.css";

interface MainTableProps {
  payband: number;
}

interface MainTableState {
  duties: Duty[];
  showModal: boolean;
  selectedDuty: Duty | null;
}

class MainTable extends React.Component<MainTableProps, MainTableState> {
  constructor(props: MainTableProps) {
    super(props);
    this.state = {
      duties: [
        {
          id: 1,
          trips: [
            {
              id: 1,
              date: "2023-06-10",
              type: "Regular",
              startTime: "09:00",
              endTime: "17:00",
              distance: "100",
            },
          ],
          startTime: "09:00",
          endTime: "17:00",
          isOSDAApplicable: false,
          isOTApplicable: false,
        },
      ],
      showModal: false,
      selectedDuty: null,
    };
  }

  addDuty = () => {
    const newDuty = new Duty(this.state.duties.length + 1);
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

  calculateTotalAllowance = () => {
    // Implement your allowance calculation logic here
    // Based on the duty details and trips
    // Return the total allowance
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
