import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface EmployeeInfoState {
  designation: string;
  payBand: string;
  level: string;
  rateOfPay: string;
  selectedMonth: string;
  showWarning: boolean;
}

export const saveEmployeeInfoStateToFirestore = async (state: EmployeeInfoState) => {
  try {
    const db = getFirestore();
    const employeeInfoRef = doc(db, 'employeeInfo', 'currentState');
    await setDoc(employeeInfoRef, state);
    return true;
  } catch (error) {
    console.error('Error saving employee info state:', error);
    return false;
  }
};

export const loadEmployeeInfoStateFromFirestore = async (): Promise<EmployeeInfoState | null> => {
  try {
    const db = getFirestore();
    const employeeInfoRef = doc(db, 'employeeInfo', 'currentState');
    const docSnap = await getDoc(employeeInfoRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as EmployeeInfoState;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error loading employee info state:', error);
    return null;
  }
};
