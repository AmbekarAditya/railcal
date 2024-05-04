import React from 'react';
import { Platform, Text, View, Button, ScrollView, StyleSheet,TextInput, TouchableOpacity,Dimensions } from 'react-native';
import Duty from '../duty/Duty';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Use Dimensions to get window size for responsive design
const { width } = Dimensions.get('window');

interface EndDutyModalProps {
  duty: Duty;
  updateDutyDetails: (updatedDuty: Duty) => void;
  closeModal: () => void;
}

interface EndDutyModalState {
  dutyStartDate: Date;
  dutyStartTime: Date;
  dutyEndDate: Date;
  dutyEndTime: Date;
  isOSDAApplicable: boolean;
  isRRAApplicable: boolean;
  isStartDatePickerVisible: boolean;
  isStartTimePickerVisible: boolean;
  isEndDatePickerVisible: boolean;
  isEndTimePickerVisible: boolean;
}

class EndDutyModal extends React.Component<EndDutyModalProps, EndDutyModalState> {
  constructor(props: EndDutyModalProps) {
    super(props);
    this.state = {
      dutyStartDate: new Date(),
      dutyStartTime: new Date(),
      dutyEndDate: new Date(),
      dutyEndTime: new Date(),
      isOSDAApplicable: false,
      isRRAApplicable: false,
      isStartDatePickerVisible: false,
      isStartTimePickerVisible: false,
      isEndDatePickerVisible: false,
      isEndTimePickerVisible: false,
    };
  }
  handleEndDuty = () => {
    const { duty, updateDutyDetails } = this.props;
    const { dutyStartDate, dutyStartTime, dutyEndDate, dutyEndTime, isOSDAApplicable, isRRAApplicable } = this.state;

    const signInDateTime = new Date(dutyStartDate.getFullYear(), dutyStartDate.getMonth(), dutyStartDate.getDate(), dutyStartTime.getHours(), dutyStartTime.getMinutes());
    const signOffDateTime = new Date(dutyEndDate.getFullYear(), dutyEndDate.getMonth(), dutyEndDate.getDate(), dutyEndTime.getHours(), dutyEndTime.getMinutes());

    const updatedDuty = new Duty(duty.id, duty.trips);
    updatedDuty.setSignInAndSignOff(signInDateTime, signOffDateTime);
    updatedDuty.isOSDA = isOSDAApplicable;
    updatedDuty.isRRA = isRRAApplicable;

    updateDutyDetails(updatedDuty);
  };

  handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) { // Check if the date is valid
      this.setState({ dutyStartDate: date });
    }
  };
  
  handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date(this.state.dutyStartDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    this.setState({ dutyStartTime: date });
  };
  
  handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    this.setState({ dutyEndDate: date });
  };
  
  handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date(this.state.dutyEndDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    this.setState({ dutyEndTime: date });
  };
  



  showStartDatePicker = () => {
    this.setState({ isStartDatePickerVisible: true });
  };

  hideStartDatePicker = () => {
    this.setState({ isStartDatePickerVisible: false });
  };

  handleStartDateConfirm = (date: Date) => {
    this.setState({ dutyStartDate: date, isStartDatePickerVisible: false });
  };

  showStartTimePicker = () => {
    this.setState({ isStartTimePickerVisible: true });
  };

  hideStartTimePicker = () => {
    this.setState({ isStartTimePickerVisible: false });
  };

  handleStartTimeConfirm = (time: Date) => {
    this.setState({ dutyStartTime: time, isStartTimePickerVisible: false });
  };

  showEndDatePicker = () => {
    this.setState({ isEndDatePickerVisible: true });
  };

  hideEndDatePicker = () => {
    this.setState({ isEndDatePickerVisible: false });
  };

  handleEndDateConfirm = (date: Date) => {
    this.setState({ dutyEndDate: date, isEndDatePickerVisible: false });
  };

  showEndTimePicker = () => {
    this.setState({ isEndTimePickerVisible: true });
  };

  hideEndTimePicker = () => {
    this.setState({ isEndTimePickerVisible: false });
  };

  handleEndTimeConfirm = (time: Date) => {
    this.setState({ dutyEndTime: time, isEndTimePickerVisible: false });
  };

  render() {
    const { closeModal } = this.props;
    const { dutyStartDate, dutyStartTime, dutyEndDate, dutyEndTime, isOSDAApplicable, isRRAApplicable, isStartDatePickerVisible, isStartTimePickerVisible, isEndDatePickerVisible, isEndTimePickerVisible } = this.state;
    
      console.log('dutyStartDate:', this.state.dutyStartDate, typeof this.state.dutyStartDate);
    
    
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.heading}>End Duty</Text>
            {Platform.OS === 'web' ? (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duty Start Date:</Text>
                  <input
                type="date"
                value={`${dutyStartDate.getFullYear()}-${String(dutyStartDate.getMonth() + 1).padStart(2, '0')}-${String(dutyStartDate.getDate()).padStart(2, '0')}`}
                onChange={this.handleStartDateChange}
              />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duty Start Time:</Text>
                  <input
                type="time"
                value={`${String(dutyStartTime.getHours()).padStart(2, '0')}:${String(dutyStartTime.getMinutes()).padStart(2, '0')}`}
                onChange={this.handleStartTimeChange}
              />

                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duty End Date:</Text>
                  <input
                type="date"
                value={`${dutyEndDate.getFullYear()}-${String(dutyEndDate.getMonth() + 1).padStart(2, '0')}-${String(dutyEndDate.getDate()).padStart(2, '0')}`}
                onChange={this.handleEndDateChange}
              />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Duty End Time:</Text>
                  <input
                type="time"
                value={`${String(dutyEndTime.getHours()).padStart(2, '0')}:${String(dutyEndTime.getMinutes()).padStart(2, '0')}`}
                onChange={this.handleEndTimeChange}
              />

                    </View>
                    </>
                    ) : (
                    <>
                    <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duty Start Date:</Text>
                    <TouchableOpacity style={styles.inputButton} onPress={this.showStartDatePicker}>
                    <Text style={styles.inputText}>{dutyStartDate.toDateString()}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                                   isVisible={isStartDatePickerVisible}
                                   mode="date"
                                   onConfirm={this.handleStartDateConfirm}
                                   onCancel={this.hideStartDatePicker}
                                 />
                    </View>
                    <View style={styles.inputContainer}>
            <Text style={styles.label}>Duty Start Time:</Text>
            <TouchableOpacity style={styles.inputButton} onPress={this.showStartTimePicker}>
              <Text style={styles.inputText}>{dutyStartTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartTimePickerVisible}
              mode="time"
              onConfirm={this.handleStartTimeConfirm}
              onCancel={this.hideStartTimePicker}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duty End Date:</Text>
            <TouchableOpacity style={styles.inputButton} onPress={this.showEndDatePicker}>
              <Text style={styles.inputText}>{dutyEndDate.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={this.handleEndDateConfirm}
              onCancel={this.hideEndDatePicker}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Duty End Time:</Text>
            <TouchableOpacity style={styles.inputButton} onPress={this.showEndTimePicker}>
              <Text style={styles.inputText}>{dutyEndTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isEndTimePickerVisible}
              mode="time"
              onConfirm={this.handleEndTimeConfirm}
              onCancel={this.hideEndTimePicker}
            />
          </View>
        </>
      )}

      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Is OSDA Applicable:</Text>
        <TouchableOpacity
          style={[styles.toggleButton, isOSDAApplicable && styles.toggleButtonActive]}
          onPress={() => this.setState({ isOSDAApplicable: !isOSDAApplicable })}
        >
          <Text style={styles.toggleButtonText}>{isOSDAApplicable ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Is RRA Applicable:</Text>
        <TouchableOpacity
          style={[styles.toggleButton, isRRAApplicable && styles.toggleButtonActive]}
          onPress={() => this.setState({ isRRAApplicable: !isRRAApplicable })}
        >
          <Text style={styles.toggleButtonText}>{isRRAApplicable ? 'Yes' : 'No'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={this.handleEndDuty}>
          <Text style={styles.buttonText}>End Duty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={closeModal}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);}
}
const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
paddingHorizontal: 20,
paddingVertical: 30,
},
scrollViewContent: {
flexGrow: 1,
},
heading: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 20,
},
inputContainer: {
marginBottom: 20,
},
label: {
fontSize: 16,
fontWeight: 'bold',
marginBottom: 8,
},
input: {
height: 40,
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 8,
paddingHorizontal: 12,
fontSize: 16,
},
inputButton: {
backgroundColor: '#f5f5f5',
borderRadius: 8,
paddingHorizontal: 12,
paddingVertical: 16,
justifyContent: 'center',
},
inputText: {
fontSize: 16,
color: '#333',
},
toggleContainer: {
flexDirection: 'row',
alignItems: 'center',
marginBottom: 20,
},
toggleButton: {
backgroundColor: '#e6e6e6',
borderRadius: 20,
paddingHorizontal: 16,
paddingVertical: 8,
marginLeft: 'auto',
},
toggleButtonActive: {
backgroundColor: '#007aff',
},
toggleButtonText: {
fontSize: 16,
fontWeight: 'bold',
color: '#fff',
},
buttonContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
marginTop: 20,

},
button: {
backgroundColor: '#007aff',
borderRadius: 8,
paddingHorizontal: 16,
paddingVertical: 12,
alignItems: 'center',
flex: 1,
},
cancelButton: {
backgroundColor: '#ff3b30',
marginLeft: 16,
},
buttonText: {
fontSize: 16,
fontWeight: 'bold',
color: '#fff',
},
});
export default EndDutyModal;