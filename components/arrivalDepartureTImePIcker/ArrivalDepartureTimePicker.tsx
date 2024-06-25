import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import TimePicker from "../time-picker/TimePicker";
import DateTimePicker from '@react-native-community/datetimepicker';

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (arrival: string, departure: string, dutyHours: string) => void;
  disabled: boolean;
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({
  onTimesChange,
  disabled,
}) => {
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);

  useEffect(() => {
    if (arrivalTime && departureTime) {
      const timeDiff = calculateTimeDifference(arrivalTime, departureTime);
      onTimesChange(arrivalTime, departureTime, timeDiff);
    }
  }, [arrivalTime, departureTime]);

  const calculateTimeDifference = (arrival: string, departure: string) => {
    const arrivalDate = new Date(`2021/01/01 ${arrival}`);
    const departureDate = new Date(`2021/01/01 ${departure}`);

    // Check if arrival time is less than departure time
    if (arrivalDate.getTime() > departureDate.getTime()) {
      // Increment the departure date by one day
      departureDate.setDate(departureDate.getDate() + 1);
    }

    const timeDiff = getTimeDifference(arrivalDate, departureDate);
    const hours = Math.floor(timeDiff / 60);
    const minutes = timeDiff % 60;
    return `${hours}h ${minutes}m`;
  };


  const getTimeDifference = (arrivalTime: Date, departureTime: Date): number => {
    if (!arrivalTime || !departureTime) {
      return 0;
    }
  
    // Check if arrival and departure times are equal
    if (arrivalTime.getTime() === departureTime.getTime()) {
      // Special case: both times are at midnight
      if (arrivalTime.getHours() === 0 && arrivalTime.getMinutes() === 0) {
        return 24 * 60;
      }
      return 0;
    }
  
    if (
      arrivalTime.getHours() === 0 &&
      arrivalTime.getMinutes() === 0 &&
      departureTime.getHours() === 0 &&
      departureTime.getMinutes() === 0
    ) {
      return 24 * 60;
    }
  
    const timeDiff = Math.round(
      (departureTime.getTime() - arrivalTime.getTime()) / 60000
    );
  
    // Return 0 if the time difference is negative
    return timeDiff >= 0 ? timeDiff : 0;
  };
  
  const handleArrivalTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalTime(event.target.value);
  };

  const handleDepartureTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartureTime(event.target.value);
  };

  const openArrivalPicker = () => {
    setShowArrivalPicker(true);
  };

  const openDeparturePicker = () => {
    setShowDeparturePicker(true);
  };

  const handleArrivalDateTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === "set") {
      const hour = String(selectedTime?.getHours()).padStart(2, '0');
      const minute = String(selectedTime?.getMinutes()).padStart(2, '0');
      setArrivalTime(`${hour}:${minute}`);
      setShowArrivalPicker(false);
    } else {
      setShowArrivalPicker(false);
    }
  };

  const handleDepartureDateTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === "set") {
      const hour = String(selectedTime?.getHours()).padStart(2, '0');
      const minute = String(selectedTime?.getMinutes()).padStart(2, '0');
      setDepartureTime(`${hour}:${minute}`);
      setShowDeparturePicker(false);
    } else {
      setShowDeparturePicker(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Departure Time:</Text>
        <View style={styles.timePickerWrapper}>
          {Platform.OS === "web" ? (
            <input
              type="time"
              value={arrivalTime}
              onChange={handleArrivalTimeChange}
              disabled={disabled}
              style={styles.timeInput}
            />
          ) : (
            <View>
              <TouchableOpacity onPress={() => setShowArrivalPicker(true)} disabled={disabled}>
                <View style={styles.timeContainer}>
                  <Text>{arrivalTime || "--:--"}</Text>
                </View>
              </TouchableOpacity>
              {showArrivalPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleArrivalDateTimeChange}
                />
              )}
            </View>
          )}
        </View>
      </View>
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Arrival Time:</Text>
        <View style={styles.timePickerWrapper}>
          {Platform.OS === "web" ? (
            <input
              type="time"
              value={departureTime}
              onChange={handleDepartureTimeChange}
              disabled={disabled}
              style={styles.timeInput}
            />
          ) : (
            <View>
              <TouchableOpacity onPress={() => setShowDeparturePicker(true)} disabled={disabled}>
                <View style={styles.timeContainer}>
                  <Text>{departureTime || "--:--"}</Text>
                </View>
              </TouchableOpacity>
              {showDeparturePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={handleDepartureDateTimeChange}
                />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  label: {
    marginTop: 5,
    marginBottom: 5,
  },
  timePickerContainer: {
    alignItems: "center",
  },
  timePickerWrapper: {
    width: 200,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  timeInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
});

export default ArrivalDepartureTimePicker;