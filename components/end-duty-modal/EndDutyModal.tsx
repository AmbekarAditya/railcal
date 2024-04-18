// EndDutyModal.tsx
import React from 'react';
import Duty from '../duty/Duty';

interface EndDutyModalProps {
  duty: Duty;
  updateDutyDetails: (updatedDuty: Duty) => void;
  closeModal: () => void;
}

interface EndDutyModalState {
  dutyStartDateTime: string;
  dutyEndDateTime: string;
  isOSDAApplicable: boolean;
  isRRAApplicable: boolean;
}

class EndDutyModal extends React.Component<EndDutyModalProps, EndDutyModalState> {
  state: EndDutyModalState = {
    dutyStartDateTime: '',
    dutyEndDateTime: '',
    isOSDAApplicable: false,
    isRRAApplicable: false,
  };

  handleEndDuty = () => {
    const { duty, updateDutyDetails } = this.props;
    const { dutyStartDateTime, dutyEndDateTime, isOSDAApplicable, isRRAApplicable } = this.state;

    const signInDateTime = new Date(dutyStartDateTime);
    const signOffDateTime = new Date(dutyEndDateTime);

    const updatedDuty = new Duty(duty.id, duty.trips);
    updatedDuty.setSignInAndSignOff(signInDateTime, signOffDateTime);
    updatedDuty.isOSDA = isOSDAApplicable;
    updatedDuty.isRRA = isRRAApplicable;

    updateDutyDetails(updatedDuty);
  };

  render() {
    const { closeModal } = this.props;
    const { dutyStartDateTime, dutyEndDateTime, isOSDAApplicable, isRRAApplicable } = this.state;

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>End Duty</h2>
          <div>
            <label>Duty Start Date and Time:</label>
            <input
              type="datetime-local"
              value={dutyStartDateTime}
              onChange={(e) => this.setState({ dutyStartDateTime: e.target.value })}
            />
          </div>
          <div>
            <label>Duty End Date and Time:</label>
            <input
              type="datetime-local"
              value={dutyEndDateTime}
              onChange={(e) => this.setState({ dutyEndDateTime: e.target.value })}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isOSDAApplicable}
                onChange={(e) => this.setState({ isOSDAApplicable: e.target.checked })}
              />
              Is OSDA Applicable
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isRRAApplicable}
                onChange={(e) => this.setState({ isRRAApplicable: e.target.checked })}
              />
              Is RRA Applicable
            </label>
          </div>
          <button onClick={this.handleEndDuty}>End Duty</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default EndDutyModal;