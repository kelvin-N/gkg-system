import { db, collection, addDoc } from "../firebase/firebaseConfig";

const servicesData = [
  {
    name: "Home Health Care",
    description: "Comprehensive in-home medical care including vital sign monitoring, medication management, wound care, and chronic condition management.",
    category: "Medical Care",
    price: 150,
    duration: "2-4 hours",
    features: [
      "Vital signs monitoring",
      "Medication administration",
      "Wound care and dressing changes",
      "Chronic disease management",
      "Patient education and support"
    ],
    image: "/images/home-health-care.jpg",
    available: true
  },
  {
    name: "House Keeping",
    description: "Professional cleaning and maintenance services to keep your home safe, clean, and comfortable for recovery and daily living.",
    category: "Support Services",
    price: 80,
    duration: "2-3 hours",
    features: [
      "Deep cleaning of all rooms",
      "Kitchen and bathroom sanitization",
      "Laundry and linen care",
      "Trash removal and recycling",
      "Light organization and tidying"
    ],
    image: "/images/house-keeping.jpg",
    available: true
  }
];

export const addServicesToFirebase = async () => {
  try {
    console.log("Adding services to Firebase...");

    for (const service of servicesData) {
      const docRef = await addDoc(collection(db, "services"), service);
      console.log(`Added service: ${service.name} with ID: ${docRef.id}`);
    }

    console.log("All services added successfully!");
    return { success: true };

  } catch (error) {
    console.error("Error adding services:", error);
    return { success: false, error: error.message };
  }
};

// For one-time use - run this in browser console or create a temporary component
// addServicesToFirebase();