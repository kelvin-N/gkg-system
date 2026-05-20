import { db, collection, getDocs, addDoc, updateDoc, doc, onSnapshot } from "../firebase/firebaseConfig";

// Staff service for managing healthcare staff members
export const getStaff = async () => {
  try {
    const staffCollection = collection(db, "staff");
    const staffSnapshot = await getDocs(staffCollection);
    const staffList = staffSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return staffList;
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
};

export const addStaff = async (staffData) => {
  try {
    const staffCollection = collection(db, "staff");
    const docRef = await addDoc(staffCollection, {
      ...staffData,
      createdAt: new Date(),
      isActive: true
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding staff:", error);
    return { success: false, error: error.message };
  }
};

export const updateStaff = async (staffId, updates) => {
  try {
    const staffDoc = doc(db, "staff", staffId);
    await updateDoc(staffDoc, {
      ...updates,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating staff:", error);
    return { success: false, error: error.message };
  }
};

export const subscribeStaff = (onUpdate, onError) => {
  const staffCollection = collection(db, "staff");
  let unsubscribe = () => {};

  try {
    const result = onSnapshot(
      staffCollection,
      (snapshot) => {
        const staffList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onUpdate(staffList);
      },
      (error) => {
        console.error("Error subscribing to staff:", error);
        if (onError) onError(error);
      }
    );

    if (typeof result === "function") {
      unsubscribe = result;
    }
  } catch (error) {
    console.error("Error initializing staff subscription:", error);
    if (onError) onError(error);
  }

  return unsubscribe;
};