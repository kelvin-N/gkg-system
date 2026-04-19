// Demo Firebase Auth Mock for Development
// This simulates Firebase Auth for demo purposes

class DemoAuth {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
  }

  // Simulate sign in with email and password
  async signInWithEmailAndPassword(auth, email, password) {
    // Demo admin credentials
    if (email === "admin@gkghealth.com" && password === "admin123") {
      const user = {
        uid: "demo-admin-uid",
        email: "admin@gkghealth.com",
        displayName: "Demo Admin",
        emailVerified: true
      };
      this.currentUser = user;
      this.notifyAuthStateListeners(user);
      return { user };
    }

    // For demo purposes, accept any email/password combination
    const user = {
      uid: `demo-user-${Date.now()}`,
      email: email,
      displayName: email.split('@')[0],
      emailVerified: true
    };
    this.currentUser = user;
    this.notifyAuthStateListeners(user);
    return { user };
  }

  // Simulate sign out
  async signOut() {
    this.currentUser = null;
    this.notifyAuthStateListeners(null);
  }

  // Simulate auth state listener
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);
    // Immediately call with current user
    callback(this.currentUser);
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach(callback => callback(user));
  }
}

// Demo Firestore Mock
class DemoFirestore {
  constructor() {
    this.collections = {
      services: [
        {
          id: "service-1",
          name: "Nursing Care",
          description: "Professional nursing services at home",
          category: "Medical Care",
          price: 120,
          duration: "2 hours",
          available: true,
          features: ["Vital monitoring", "Medication", "Care coordination"]
        },
        {
          id: "service-2",
          name: "Home Health Care",
          description: "Comprehensive in-home medical care including vital sign monitoring, medication management, wound care, and chronic condition management.",
          category: "Medical Care",
          price: 150,
          duration: "2-4 hours",
          available: true,
          features: [
            "Vital signs monitoring",
            "Medication administration",
            "Wound care and dressing changes",
            "Chronic disease management",
            "Patient education and support"
          ]
        },
        {
          id: "service-3",
          name: "House Keeping",
          description: "Professional cleaning and maintenance services to keep your home safe, clean, and comfortable for recovery and daily living.",
          category: "Support Services",
          price: 80,
          duration: "2-3 hours",
          available: true,
          features: [
            "Deep cleaning of all rooms",
            "Kitchen and bathroom sanitization",
            "Laundry and linen care",
            "Trash removal and recycling",
            "Light organization and tidying"
          ]
        }
      ],
      bookings: [],
      users: [
        {
          uid: "demo-admin-uid",
          email: "admin@gkghealth.com",
          role: "admin",
          displayName: "Demo Admin",
          createdAt: new Date()
        }
      ]
    };
  }

  // Simulate collection reference
  collection(name) {
    return {
      get: async () => ({
        docs: this.collections[name].map((doc, index) => ({
          id: doc.id || `doc-${index}`,
          data: () => doc
        }))
      }),
      add: async (data) => {
        const newDoc = { ...data, id: `doc-${Date.now()}`, createdAt: new Date() };
        if (name === 'bookings') {
          this.collections.bookings.push(newDoc);
        }
        return { id: newDoc.id };
      }
    };
  }

  // Simulate document reference
  doc(path) {
    const [collectionName, docId] = path.split('/');
    return {
      get: async () => {
        const doc = this.collections[collectionName]?.find(d => d.id === docId || d.uid === docId);
        return {
          data: () => doc || null,
          exists: () => !!doc
        };
      },
      set: async (data) => {
        if (!this.collections[collectionName]) {
          this.collections[collectionName] = [];
        }
        const existingIndex = this.collections[collectionName].findIndex(d => d.id === docId || d.uid === docId);
        if (existingIndex >= 0) {
          this.collections[collectionName][existingIndex] = { ...data, id: docId };
        } else {
          this.collections[collectionName].push({ ...data, id: docId });
        }
      },
      update: async (data) => {
        const existingIndex = this.collections[collectionName].findIndex(d => d.id === docId || d.uid === docId);
        if (existingIndex >= 0) {
          this.collections[collectionName][existingIndex] = {
            ...this.collections[collectionName][existingIndex],
            ...data
          };
        }
      }
    };
  }
}

// Create demo instances
const demoAuth = new DemoAuth();
const demoFirestore = new DemoFirestore();

// Export demo versions that mimic Firebase API
export const auth = {
  signInWithEmailAndPassword: (email, password) => demoAuth.signInWithEmailAndPassword(null, email, password),
  signOut: () => demoAuth.signOut(),
  onAuthStateChanged: (callback) => demoAuth.onAuthStateChanged(callback)
};

export const db = {
  collection: (name) => demoFirestore.collection(name),
  doc: (path) => demoFirestore.doc(path)
};

// Export functions that match Firebase API
export { collection, doc, addDoc, getDocs, setDoc, updateDoc, onSnapshot } from "firebase/firestore";