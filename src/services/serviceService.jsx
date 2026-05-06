import { db, collection, getDocs } from "../firebase/firebaseConfig";

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