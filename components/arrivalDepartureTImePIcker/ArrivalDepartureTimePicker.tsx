import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import TimePicker from "../time-picker/TimePicker";
import DateTimePicker from "@react-native-community/datetimepicker";

interface ArrivalDepartureTimePickerProps {
  onTimesChange: (
    arrival: string,
    departure: string,
    dutyHours: string,
  ) => void;
  disabled: boolean;
  initialArrivalTime: string,
  initialDepartureTime: string
}

const ArrivalDepartureTimePicker: React.FC<ArrivalDepartureTimePickerProps> = ({
  onTimesChange,
  disabled,
  initialArrivalTime,
  initialDepartureTime,
}) => {
  const [arrivalTime, setArrivalTime] = useState(initialArrivalTime || "");
  const [departureTime, setDepartureTime] = useState(initialDepartureTime || "");
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

  const getTimeDifference = (
    arrivalTime: Date,
    departureTime: Date
  ): number => {
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

  const handleArrivalTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setArrivalTime(event.target.value);
  };

  const handleDepartureTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureTime(event.target.value);
  };

  const openArrivalPicker = () => {
    setShowArrivalPicker(true);
  };

  const openDeparturePicker = () => {
    setShowDeparturePicker(true);
  };

  const handleTimeChange =
    (isArrival: boolean) => (event: any, selectedTime?: Date) => {
      if (event.type === "set" && selectedTime) {
        const hour = String(selectedTime.getHours()).padStart(2, "0");
        const minute = String(selectedTime.getMinutes()).padStart(2, "0");
        const timeString = `${hour}:${minute}`;

        if (isArrival) {
          setArrivalTime(timeString);
          setShowArrivalPicker(false);
        } else {
          setDepartureTime(timeString);
          setShowDeparturePicker(false);
        }
      } else {
        setShowArrivalPicker(false);
        setShowDeparturePicker(false);
      }
    };

  const renderTimePicker = (isArrival: boolean) => {
    const time = isArrival ? arrivalTime : departureTime;
    const setShowPicker = isArrival
      ? setShowArrivalPicker
      : setShowDeparturePicker;
    const showPicker = isArrival ? showArrivalPicker : showDeparturePicker;

    return (
      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>{isArrival ? "Dep:" : "Arr:"}</Text>
        {Platform.OS === "web" ? (
          <input
            type="time"
            value={time}
            onChange={(e) =>
              isArrival
                ? setArrivalTime(e.target.value)
                : setDepartureTime(e.target.value)
            }
            disabled={disabled}
            style={styles.timeInput}
          />
        ) : (
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            disabled={disabled}
          >
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{time || "--:--"}</Text>
            </View>
          </TouchableOpacity>
        )}
        {Platform.OS !== "web" && showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange(isArrival)}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTimePicker(true)}
      {renderTimePicker(false)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    marginRight: 4,
  },
  timeContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 2,
  },
  timeText: {
    fontSize: 12,
  },
  timeInput: {
    width: "70%",
    height: 24,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 2,
    fontSize: 12,
  },
});

export default ArrivalDepartureTimePicker;
