// EndDutyModalMobile.tsx
import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity } from 'react-native';
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

class EndDutyModalMobile extends React.Component<EndDutyModalProps, EndDutyModalState> {
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
      <View>
        <Text>End Duty</Text>
        <TextInput
          value={dutyStartDateTime}
          onChangeText={(text) => this.setState({ dutyStartDateTime: text })}
          placeholder="Duty Start Date and Time"
        />
        <TextInput
          value={dutyEndDateTime}
          onChangeText={(text) => this.setState({ dutyEndDateTime: text })}
          placeholder="Duty End Date and Time"
        />
        <View>
          <Text>Is OSDA Applicable</Text>
          <Switch
            value={isOSDAApplicable}
            onValueChange={(value) => this.setState({ isOSDAApplicable: value })}
          />
        </View>
        <View>
          <Text>Is RRA Applicable</Text>
          <Switch
            value={isRRAApplicable}
            onValueChange={(value) => this.setState({ isRRAApplicable: value })}
          />
        </View>
        <TouchableOpacity onPress={this.handleEndDuty}>
          <Text>End Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeModal}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default EndDutyModalMobile;