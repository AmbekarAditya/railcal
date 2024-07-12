import { db, auth } from "../../firebase/firebaseConfig";

export const saveDutiesToFirestore = async (duties, selectedMonth) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const dutiesData = duties.map(duty => duty.toJSON());
    await db.collection("duties").doc(selectedMonth).set({
      duties: dutiesData,
      userId: user.uid
    });
    console.log("Duties successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving duties to Firestore: ", error);
    throw error;
  }
};

export const loadDutiesFromFirestore = async (selectedMonth) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const docRef = db.collection("duties").doc(selectedMonth);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();
      if (data && data.userId === user.uid) {
        return data.duties;
      }
    }

    return null;
  } catch (error) {
    console.error("Error loading duties from Firestore: ", error);
    throw error;
  }
};
