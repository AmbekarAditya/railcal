import { db, auth } from "../../firebase/firebaseConfig";
import firebase from 'firebase/compat/app';
import { MainTableState } from "./types";
import Duty from "../duty/Duty";
import Fortnight from "../fortnight-block/Fortnight";
import Trip from '../trip/Trip';  // Adjust the import path as necessary



const fortnightToPlainObject = (fortnight: Fortnight) => ({
  startDate: fortnight.startDate instanceof Date ? fortnight.startDate.toISOString() : fortnight.startDate,
  endDate: fortnight.endDate instanceof Date ? fortnight.endDate.toISOString() : fortnight.endDate,
  totalForthnightDuration: fortnight.totalForthnightDuration,
  overtimeAllowance: fortnight.overtimeAllowance,
  totalOvertimeHours: fortnight.totalOvertimeHours,
});

export const saveMainTableStateToFirestore = async (state: MainTableState, selectedMonth: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const stateToSave = {
      duties: state.duties.map(duty => ({
        ...duty.toJSON(),
        signIn: duty.signIn ? firebase.firestore.Timestamp.fromDate(duty.signIn) : null,
        signOff: duty.signOff ? firebase.firestore.Timestamp.fromDate(duty.signOff) : null,
      })),
      showModal: state.showModal,
      selectedDuty: state.selectedDuty ? state.selectedDuty.toJSON() : null,
      totalLeaves: state.totalLeaves,
      overtimeResult: state.overtimeResult,
      progressiveDutyHours: state.progressiveDutyHours,
      fortnights: state.fortnights.map(fortnight => ({
        startDate: fortnight.startDate.toISOString(),
        endDate: fortnight.endDate.toISOString(),
        totalForthnightDuration: fortnight.totalForthnightDuration,
        overtimeAllowance: fortnight.overtimeAllowance,
        totalOvertimeHours: fortnight.totalOvertimeHours,
      })),
    };

    await db.collection("mainTableStates").doc(`${user.uid}_${selectedMonth}`).set(stateToSave);
    console.log("MainTable state successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving MainTable state to Firestore: ", error);
    throw error;
  }
};

export const loadMainTableStateFromFirestore = async (selectedMonth: string): Promise<MainTableState | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User is not authenticated");
      return null;
    }

    const docRef = db.collection("mainTableStates").doc(`${user.uid}_${selectedMonth}`);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data() as any;
      const convertedState: MainTableState = {
        duties: data.duties.map((dutyData: any) => {
          const duty = new Duty(dutyData.id, dutyData.trips.map((tripData: any) => new Trip(tripData.id, tripData)));
          Object.assign(duty, dutyData);
          duty.signIn = dutyData.signIn ? new Date(dutyData.signIn.seconds * 1000) : null;
          duty.signOff = dutyData.signOff ? new Date(dutyData.signOff.seconds * 1000) : null;
          duty.hasEnded = dutyData.hasEnded || false;
          return duty;
        }),
        showModal: data.showModal,
        selectedDuty: data.selectedDuty ? new Duty(data.selectedDuty.id, data.selectedDuty.trips.map((tripData: any) => new Trip(tripData.id, tripData))) : null,
        totalLeaves: data.totalLeaves,
        overtimeResult: data.overtimeResult,
        progressiveDutyHours: data.progressiveDutyHours,
        fortnights: data.fortnights.map((fortnightData: any) => new Fortnight(
          new Date(fortnightData.startDate),
          new Date(fortnightData.endDate),
          fortnightData.totalForthnightDuration,
          fortnightData.overtimeAllowance,
          fortnightData.totalOvertimeHours
        )),
      };
      console.log("MainTable state loaded successfully");
      return convertedState;
    } else {
      console.log("No MainTable state found for the selected month");
      return null;
    }
  } catch (error) {
    console.error("Error loading MainTable state from Firestore: ", error);
    return null;
  }
};
