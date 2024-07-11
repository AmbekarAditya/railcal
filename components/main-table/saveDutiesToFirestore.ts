import { db } from "../../firebase/firebaseConfig";

const queue: (() => Promise<void>)[] = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  
  isProcessing = true;
  const operation = queue.shift();
  
  if (operation) {
    try {
      await operation();
    } catch (error) {
      console.error("Error processing operation:", error);
    }
  }
  
  isProcessing = false;
  setTimeout(processQueue, 1000); // Wait 1 second before next operation
};

const addToQueue = (operation: () => Promise<void>) => {
  queue.push(operation);
  if (!isProcessing) processQueue();
};

// Example usage
const saveDutiesToFirestore = (duties: any[], selectedMonth: string) => {
  addToQueue(async () => {
    const dutiesData = duties.map(duty => duty.toJSON());
    await db.collection("duties").doc(selectedMonth).set({ duties: dutiesData });
    console.log("Duties successfully saved to Firestore!");
  });
};

export { saveDutiesToFirestore };