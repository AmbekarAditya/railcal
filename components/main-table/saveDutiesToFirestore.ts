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
    }, { merge: true });
    console.log("Duties successfully saved to Firestore!");
  } catch (error) {
    console.error("Error saving duties to Firestore: ", error);
    if (error.code === 'permission-denied') {
      console.error("Permission denied. Please check Firestore rules.");
    }
    throw error;
  }
};

export const loadDutiesFromFirestore = async (selectedMonth) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("User is not authenticated");
      return null;
    }

    console.log("Attempting to load duties for user:", user.uid);
    console.log("Selected month:", selectedMonth);

    const docRef = db.collection("duties").doc(selectedMonth);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();
      if (data && data.userId === user.uid) {
        console.log("Duties loaded successfully");
        return data.duties;
      } else {
        console.log("No duties found for the current user in this month");
        return null;
      }
    } else {
      console.log("No document found for the selected month");
      return null;
    }
  } catch (error) {
    console.error("Error loading duties from Firestore: ", error);
    if (error.code === 'permission-denied') {
      console.error("Permission denied. Please check Firestore rules.");
      console.error("Current user UID:", auth.currentUser?.uid);
      console.error("Attempted to access document:", selectedMonth);
      console.error("Firestore rules might be incorrect. Please review them.");
    }
    return null;
  }
};
