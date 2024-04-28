import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet, TouchableOpacity } from 'react-native';
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
      <View style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.heading}>End Duty</Text>
          <View>
            <Text>Duty Start Date and Time:</Text>
            <TextInput
              style={styles.input}
              value={dutyStartDateTime}
              onChangeText={(text) => this.setState({ dutyStartDateTime: text })}
              mode="datetime"
            />
          </View>
          <View>
            <Text>Duty End Date and Time:</Text>
            <TextInput
              style={styles.input}
              value={dutyEndDateTime}
              onChangeText={(text) => this.setState({ dutyEndDateTime: text })}
              mode="datetime"
            />
          </View>
          <View style={styles.checkboxGroup}>
            <Text>Is OSDA Applicable</Text>
            <Switch
              value={isOSDAApplicable}
              onValueChange={(value) => this.setState({ isOSDAApplicable: value })}
            />
          </View>
          <View style={styles.checkboxGroup}>
            <Text>Is RRA Applicable</Text>
            <Switch
              value={isRRAApplicable}
              onValueChange={(value) => this.setState({ isRRAApplicable: value })}
            />
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={this.handleEndDuty}>
              <Text style={styles.buttonText}>End Duty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  checkboxGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EndDutyModal;