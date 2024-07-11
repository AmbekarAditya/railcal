import { db } from "../../firebase/firebaseConfig";
import Duty from "../duty/Duty";

const saveDutiesToFirestore = async (duties: Duty[], selectedMonth: string) => {
  try {
    const dutiesData = duties.map(duty => duty.toJSON());
    await db.collection("duties").doc(selectedMonth).set({ duties: dutiesData });
    console.log("Duties successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving duties to Firestore: ", error);
  }
};

export default saveDutiesToFirestore;
