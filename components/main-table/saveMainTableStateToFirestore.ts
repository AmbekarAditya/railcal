import { db, auth } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { MainTableState } from "./types";
import Duty from "../duty/Duty";
import Fortnight from "../fortnight-block/Fortnight";
import Trip from '../trip/Trip';

export const saveMainTableStateToFirestore = async (state: MainTableState, selectedMonth: string) => {
  try {
    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      console.log("User is not authenticated");
      return;
    }
    const docRef = doc(db, "mainTableStates", `${userUid}_${selectedMonth}`);

    // Create a new object with the state properties we want to save
    const stateToSave = {
      duties: state.duties.map(duty => ({
        ...duty,
        trips: duty.trips.map(trip => ({ ...trip }))
      })),
      totalLeaves: state.totalLeaves,
      overtimeResult: state.overtimeResult,
      progressiveDutyHours: state.progressiveDutyHours,
      fortnights: state.fortnights.map(fortnight => ({
        startDate: fortnight.startDate.toISOString(),
        endDate: fortnight.endDate.toISOString(),
        totalForthnightDuration: fortnight.totalForthnightDuration,
        overtimeAllowance: fortnight.overtimeAllowance,
        totalOvertimeHours: fortnight.totalOvertimeHours
      })),
      // Omit selectedDuty as it's causing issues
    };

    await setDoc(docRef, stateToSave);
    console.log("MainTable state saved successfully");
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

    const docRef = doc(db, "mainTableStates", `${user.uid}_${selectedMonth}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as any;
      const convertedState: MainTableState = {
        duties: data.duties.map((dutyData: any) => {
          const duty = new Duty(dutyData.id, dutyData.trips.map((tripData: any) => new Trip(tripData.id, tripData)));
          Object.assign(duty, dutyData);
          duty.signIn = dutyData.signIn ? (dutyData.signIn as Timestamp).toDate() : null;
          duty.signOff = dutyData.signOff ? (dutyData.signOff as Timestamp).toDate() : null;
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