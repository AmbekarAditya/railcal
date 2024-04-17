// EndDutyModal.js
import React, { useState } from 'react';
import Duty from './Duty';

interface EndDutyModalProps {
  duty: Duty;
  updateDutyDetails: (updatedDuty: Duty) => void;
  closeModal: () => void;
}

const EndDutyModal: React.FC<EndDutyModalProps> = ({ duty, updateDutyDetails, closeModal }) => {
  const [dutyStartTime, setDutyStartTime] = useState('');
  const [dutyEndTime, setDutyEndTime] = useState('');
  const [isOSDAApplicable, setIsOSDAApplicable] = useState(false);
  const [isOTApplicable, setIsOTApplicable] = useState(false);

  const handleEndDuty = () => {
    const updatedDuty = {
      ...duty,
      startTime: dutyStartTime,
      endTime: dutyEndTime,
      isOSDAApplicable,
      isOTApplicable,
    };
    updateDutyDetails(updatedDuty);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>End Duty</h2>
        <div>
          <label>Duty Start Time:</label>
          <input
            type="time"
            value={dutyStartTime}
            onChange={(e) => setDutyStartTime(e.target.value)}
          />
        </div>
        <div>
          <label>Duty End Time:</label>
          <input
            type="time"
            value={dutyEndTime}
            onChange={(e) => setDutyEndTime(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isOSDAApplicable}
              onChange={(e) => setIsOSDAApplicable(e.target.checked)}
            />
            Is OSDA Applicable
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isOTApplicable}
              onChange={(e) => setIsOTApplicable(e.target.checked)}
            />
            Is OT Applicable
          </label>
        </div>
        <button onClick={handleEndDuty}>End Duty</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default EndDutyModal;