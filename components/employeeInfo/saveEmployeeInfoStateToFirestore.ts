import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export interface EmployeeInfoState {
  designation: string;
  payBand: string;
  level: string;
  rateOfPay: string;
  selectedMonth: string;
  showWarning: boolean;
}

const withTimeout = <T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs)
    ),
  ]);
};

export const saveEmployeeInfoStateToFirestore = async (state: EmployeeInfoState) => {
  try {
    const db = getFirestore();
    const employeeInfoRef = doc(db, 'employeeInfo', 'currentState');
    await withTimeout(setDoc(employeeInfoRef, state));
    return true;
  } catch (error) {
    console.warn('Firestore save non-blocking warning:', error);
    return false;
  }
};

export const loadEmployeeInfoStateFromFirestore = async (): Promise<EmployeeInfoState | null> => {
  try {
    const db = getFirestore();
    const employeeInfoRef = doc(db, 'employeeInfo', 'currentState');
    const docSnap = await withTimeout(getDoc(employeeInfoRef));

    if (docSnap && docSnap.exists()) {
      return docSnap.data() as EmployeeInfoState;
    } else {
      return null;
    }
  } catch (error) {
    console.warn('Firestore load non-blocking warning:', error);
    return null;
  }
};
