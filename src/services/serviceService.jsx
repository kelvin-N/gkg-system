import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "services"));

    const services = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return services;

  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};