import { db, collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc } from "../firebase/firebaseConfig";

export const createBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      status: "pending",
      createdAt: Timestamp.now()
    });

    console.log("Booking created:", docRef.id);

  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const subscribeBookings = (callback, onError) => {
  const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  return onSnapshot(bookingsQuery, (snapshot) => {
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(bookings);
  }, (error) => {
    console.error("Error subscribing to bookings:", error);
    if (onError) onError(error);
  });
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: status,
      updatedAt: Timestamp.now()
    });
    console.log("Booking status updated:", bookingId, status);
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
};

export const assignStaffToBooking = async (bookingId, staffId, staffName) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      assignedStaff: {
        id: staffId,
        name: staffName
      },
      updatedAt: Timestamp.now()
    });
    console.log("Staff assigned to booking:", bookingId, staffName);
  } catch (error) {
    console.error("Error assigning staff to booking:", error);
    throw error;
  }
};