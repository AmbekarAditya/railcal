// EndDutyModal.tsx
import React from 'react';
import { Platform, Text, View, Button, ScrollView } from 'react-native';
import Duty from '../duty/Duty';


if (Platform.OS === 'web') {
  import('./enddutymodalstyles.css');
}

// Import DateTimePicker for Android
const DateTimePicker = Platform.OS === 'android'
  ? require('@react-native-community/datetimepicker').default
  : null;

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
    if (Platform.OS === 'web') {
      // Web-specific UI using standard HTML elements
      return (
        <div className="modal">
          <div className="modal-content">
            <h2>End Duty</h2>
            <div>
              <label>Duty Start Date and Time:</label>
              <input
                type="datetime-local"
                value={this.state.dutyStartDateTime}
                onChange={(e) => this.setState({ dutyStartDateTime: e.target.value })}
              />
            </div>
            <div>
              <label>Duty End Date and Time:</label>
              <input
                type="datetime-local"
                value={this.state.dutyEndDateTime}
                onChange={(e) => this.setState({ dutyEndDateTime: e.target.value })}
              />
            </div>
            <div className="checkbox-row">
  <div className="checkbox-group">
    <label>
      <input
        type="checkbox"
        checked={this.state.isOSDAApplicable}
        onChange={(e) => this.setState({ isOSDAApplicable: e.target.checked })}
      />
      Is OSDA Applicable
    </label>
  </div>
  <div className="checkbox-group">
    <label>
      <input
        type="checkbox"
        checked={this.state.isRRAApplicable}
        onChange={(e) => this.setState({ isRRAApplicable: e.target.checked })}
      />
      Is RRA Applicable
    </label>
  </div>
</div>
            <button onClick={this.handleEndDuty}>End Duty</button>
            <button onClick={this.closeModal}>Cancel</button>
          </div>
        </div>
      );
    } else if (Platform.OS === 'android') {
      // Android-specific UI using React Native components
      return (
        <View style={{ padding: 20 }}>
          <ScrollView>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>End Duty</Text>
            <View>
              <Text>Duty Start Date and Time:</Text>
              <DateTimePicker
                value={new Date(this.state.dutyStartDateTime)}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || this.state.dutyStartDateTime;
                  this.setState({ dutyStartDateTime: currentDate.toISOString() });
                }}
              />
            </View>
            <View>
              <Text>Duty End Date and Time:</Text>
              <DateTimePicker
                value={new Date(this.state.dutyEndDateTime)}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || this.state.dutyEndDateTime;
                  this.setState({ dutyEndDateTime: currentDate.toISOString() });
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text>Is OSDA Applicable:</Text>
              <Button
                title={this.state.isOSDAApplicable ? "Yes" : "No"}
                onPress={() => this.setState({ isOSDAApplicable: !this.state.isOSDAApplicable })}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text>Is RRA Applicable:</Text>
              <Button
                title={this.state.isRRAApplicable ? "Yes" : "No"}
                onPress={() => this.setState({ isRRAApplicable: !this.state.isRRAApplicable })}
              />
            </View>
            <Button title="End Duty" onPress={this.handleEndDuty} />
            <Button title="Cancel" onPress={this.closeModal} />
          </ScrollView>
        </View>
      );
    } else {
      // Fallback or other platforms
      return <Text>Unsupported platform</Text>;
    }
  }
}

export default EndDutyModal;
