import { db, collection, addDoc, Timestamp, query, orderBy, onSnapshot, doc, updateDoc } from "../firebase/firebaseConfig";

export const createBooking = async (bookingData) => {
  try {
    const bookingPayload = {
      ...bookingData,
      status: "pending",
      createdAt: Timestamp?.now ? Timestamp.now() : new Date(),
      updatedAt: Timestamp?.now ? Timestamp.now() : new Date()
    };

    const docRef = await addDoc(collection(db, "bookings"), bookingPayload);
    return { success: true, id: docRef.id, booking: bookingPayload };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message || "Booking creation failed." };
  }
};

export const subscribeBookings = (callback, onError) => {
  const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  let unsubscribe = () => {};

  try {
    const result = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(bookings);
      },
      (error) => {
        console.error("Error subscribing to bookings:", error);
        if (onError) onError(error);
      }
    );

    if (typeof result === "function") {
      unsubscribe = result;
    }
  } catch (error) {
    console.error("Error initializing booking subscription:", error);
    if (onError) onError(error);
  }

  return unsubscribe;
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: Timestamp?.now ? Timestamp.now() : new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: error.message || "Failed to update booking status." };
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
      updatedAt: Timestamp?.now ? Timestamp.now() : new Date()
    });
    return { success: true };
  } catch (error) {
    console.error("Error assigning staff to booking:", error);
    return { success: false, error: error.message || "Failed to assign staff." };
  }
};