import { useState } from 'react';
import Duty from '../duty/Duty';

const useDutyEndModal = (duty: Duty, updateDutyDetails: (updatedDuty: Duty) => void) => {
  const [dutyStartDate, setDutyStartDate] = useState<Date>(new Date());
  const [dutyStartTime, setDutyStartTime] = useState<Date>(new Date());
  const [dutyEndDate, setDutyEndDate] = useState<Date>(new Date());
  const [dutyEndTime, setDutyEndTime] = useState<Date>(new Date());
  const [isOSDAApplicable, setIsOSDAApplicable] = useState<boolean>(false);
  const [isRRAApplicable, setIsRRAApplicable] = useState<boolean>(false);
  const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState<boolean>(false);
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState<boolean>(false);
  const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState<boolean>(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState<boolean>(false);

  const handleEndDuty = () => {
    const signInDateTime = new Date(dutyStartDate.getFullYear(), dutyStartDate.getMonth(), dutyStartDate.getDate(), dutyStartTime.getHours(), dutyStartTime.getMinutes());
    const signOffDateTime = new Date(dutyEndDate.getFullYear(), dutyEndDate.getMonth(), dutyEndDate.getDate(), dutyEndTime.getHours(), dutyEndTime.getMinutes());

    const updatedDuty = new Duty(duty.id, duty.trips);
    updatedDuty.setSignInAndSignOff(signInDateTime, signOffDateTime);
    updatedDuty.isOSDA = isOSDAApplicable;
    updatedDuty.isRRA = isRRAApplicable;

    updateDutyDetails(updatedDuty);
  };

  const toggleOSDAApplicable = () => setIsOSDAApplicable(!isOSDAApplicable);
  const toggleRRAApplicable = () => setIsRRAApplicable(!isRRAApplicable);

  const showStartDatePicker = () => setIsStartDatePickerVisible(true);
  const hideStartDatePicker = () => setIsStartDatePickerVisible(false);
  const handleStartDateConfirm = (date: Date) => {
    setDutyStartDate(date);
    setIsStartDatePickerVisible(false);
  };

  const showStartTimePicker = () => setIsStartTimePickerVisible(true);
  const hideStartTimePicker = () => setIsStartTimePickerVisible(false);
  const handleStartTimeConfirm = (time: Date) => {
    setDutyStartTime(time);
    setIsStartTimePickerVisible(false);
  };

  const showEndDatePicker = () => setIsEndDatePickerVisible(true);
  const hideEndDatePicker = () => setIsEndDatePickerVisible(false);
  const handleEndDateConfirm = (date: Date) => {
    setDutyEndDate(date);
    setIsEndDatePickerVisible(false);
  };

  const showEndTimePicker = () => setIsEndTimePickerVisible(true);
  const hideEndTimePicker = () => setIsEndTimePickerVisible(false);
  const handleEndTimeConfirm = (time: Date) => {
    setDutyEndTime(time);
    setIsEndTimePickerVisible(false);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      setDutyStartDate(date);
    }
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date(dutyStartDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    setDutyStartTime(date);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    setDutyEndDate(date);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date(dutyEndDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    setDutyEndTime(date);
  };

  return {
    dutyStartDate,
    dutyStartTime,
    dutyEndDate,
    dutyEndTime,
    isOSDAApplicable,
    isRRAApplicable,
    isStartDatePickerVisible,
    isStartTimePickerVisible,
    isEndDatePickerVisible,
    isEndTimePickerVisible,
    handleEndDuty,
    toggleOSDAApplicable,
    toggleRRAApplicable,
    showStartDatePicker,
    hideStartDatePicker,
    handleStartDateConfirm,
    showStartTimePicker,
    hideStartTimePicker,
    handleStartTimeConfirm,
    showEndDatePicker,
    hideEndDatePicker,
    handleEndDateConfirm,
    showEndTimePicker,
    hideEndTimePicker,
    handleEndTimeConfirm,
    handleStartDateChange,
    handleStartTimeChange,
    handleEndDateChange,
    handleEndTimeChange,
  };
};

export default useDutyEndModal;