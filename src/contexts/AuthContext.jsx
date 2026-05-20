/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "../firebase/firebaseConfig";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 🔍 Get user role from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            console.log("USER DATA:", userData); // debug

            // ✅ Check role ONLY (no email restriction)
            const adminStatus = userData?.role === "admin";

            setIsAdmin(adminStatus);
            setUser({ ...firebaseUser, ...userData });
          } else {
            // 🆕 Auto-create admin user document if it doesn't exist
            console.log("No user document found, creating admin user...");
            const userData = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              role: "admin",
              createdAt: new Date(),
              lastLogin: new Date()
            };

            try {
              await setDoc(doc(db, "users", firebaseUser.uid), userData);
              console.log("Created admin user document:", userData);
              setIsAdmin(true);
              setUser({ ...firebaseUser, ...userData });
            } catch (createError) {
              console.error("Failed to create admin user document:", createError);
              setIsAdmin(false);
              setUser(firebaseUser);
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Login function
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // 🔍 Get role from Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let userData;

      if (!userSnap.exists()) {
        // 🆕 Create user document if it doesn't exist
        userData = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: "admin",
          createdAt: new Date(),
          lastLogin: new Date()
        };

        try {
          await setDoc(userRef, userData);
          console.log("Created new user document:", userData);
        } catch (createError) {
          console.error("Failed to create user document:", createError);
          await signOut(auth);
          return {
            success: false,
            error: "Failed to create user profile. Please try again."
          };
        }
      } else {
        userData = userSnap.data();
        // Update last login
        try {
          await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        } catch (updateError) {
          console.warn("Failed to update last login:", updateError);
        }
      }

      // ✅ Check admin role
      if (userData.role !== "admin") {
        await signOut(auth);
        setLoading(false);
        return {
          success: false,
          error: "Access denied. Admin privileges required."
        };
      }

      setLoading(false);
      return { success: true, user: result.user };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};