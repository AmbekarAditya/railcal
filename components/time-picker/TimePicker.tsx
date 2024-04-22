import React from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
  onTimeChange: (hour: string, minute: string) => void;
  disabled: boolean;
}

interface TimePickerState {
  selectedHour: string | null;
  selectedMinute: string | null;
  showTimePicker: boolean;
}

class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
  constructor(props: TimePickerProps) {
    super(props);
    this.state = {
      selectedHour: null,
      selectedMinute: null,
      showTimePicker: false,
    };
  }

  handleHourChange = (itemValue: string) => {
    const { onTimeChange, disabled } = this.props;
    if (!disabled) {
      this.setState({ selectedHour: itemValue }, () => {
        if (itemValue !== '-') {
          onTimeChange(itemValue, this.state.selectedMinute || '');
        }
      });
    }
  };

  handleMinuteChange = (itemValue: string) => {
    const { onTimeChange, disabled } = this.props;
    if (!disabled) {
      this.setState({ selectedMinute: itemValue }, () => {
        if (itemValue !== '-') {
          onTimeChange(this.state.selectedHour || '', itemValue);
        }
      });
    }
  };

  handleTimeChange = (event: any, selectedTime?: Date) => {
    const { onTimeChange, disabled } = this.props;
    if (event.type === 'set' && !disabled) {
      const hour = String(selectedTime?.getHours()).padStart(2, '0');
      const minute = String(selectedTime?.getMinutes()).padStart(2, '0');
      this.setState(
        {
          selectedHour: hour,
          selectedMinute: minute,
          showTimePicker: false,
        },
        () => {
          onTimeChange(hour, minute);
        }
      );
    } else {
      this.setState({ showTimePicker: false });
    }
  };

  openTimePicker = () => {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState({ showTimePicker: true });
    }
  };

  render() {
    const { disabled } = this.props;
    const { selectedHour, selectedMinute, showTimePicker } = this.state;

    if (Platform.OS === 'web') {
      return (
        <View style={styles.container}>
          <Picker
            selectedValue={selectedHour}
            style={styles.picker}
            onValueChange={this.handleHourChange}
            enabled={!disabled}
          >
            <Picker.Item label="-" value="-" />
            {Array.from({ length: 24 }).map((_, index) => (
              <Picker.Item
                key={index}
                label={String(index).padStart(2, '0')}
                value={String(index).padStart(2, '0')}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedMinute}
            style={styles.picker1}
            onValueChange={this.handleMinuteChange}
            enabled={!disabled}
          >
            <Picker.Item label="-" value="-" />
            {Array.from({ length: 60 }).map((_, index) => (
              <Picker.Item
                key={index}
                label={String(index).padStart(2, '0')}
                value={String(index).padStart(2, '0')}
              />
            ))}
          </Picker>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.openTimePicker} disabled={disabled}>
            <View style={styles.timeContainer}>
              <View>
                <Text>{selectedHour || '--'}</Text>
              </View>
              <Text>:</Text>
              <View>
                <Text>{selectedMinute || '--'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={this.handleTimeChange}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    margin: 1,
    height: 25,
  },
  picker1: {
    flex: 1,
    margin: 1,
    height: 25,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default TimePicker;