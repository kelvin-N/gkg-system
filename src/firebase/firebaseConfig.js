import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from "firebase/auth";
import {
  getFirestore as firebaseGetFirestore,
  collection as firebaseCollection,
  doc as firebaseDoc,
  addDoc as firebaseAddDoc,
  getDocs as firebaseGetDocs,
  setDoc as firebaseSetDoc,
  updateDoc as firebaseUpdateDoc,
  onSnapshot as firebaseOnSnapshot,
  query as firebaseQuery,
  orderBy as firebaseOrderBy,
  Timestamp as firebaseTimestamp,
  getDoc as firebaseGetDoc
} from "firebase/firestore";
import * as demoFirebase from "./demoFirebase.js";

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true' ||
                 !import.meta.env.VITE_FIREBASE_API_KEY ||
                 import.meta.env.VITE_FIREBASE_API_KEY === 'your_key';

let auth;
let db;
let collection;
let doc;
let addDoc;
let getDocs;
let setDoc;
let updateDoc;
let onSnapshot;
let query;
let orderBy;
let Timestamp;
let getDoc;
let signInWithEmailAndPassword;
let signOut;
let onAuthStateChanged;

if (USE_DEMO) {
  console.log("🔧 Using Demo Firebase for development/testing");

  auth = demoFirebase.auth;
  db = demoFirebase.db;
  collection = (database, name) => demoFirebase.db.collection(name);
  doc = (database, ...pathSegments) => demoFirebase.db.doc(pathSegments.join("/"));
  addDoc = async (collectionRef, data) => await collectionRef.add(data);
  getDocs = async (collectionRef) => await collectionRef.get();
  getDoc = async (docRef) => await docRef.get();
  setDoc = async (docRef, data) => await docRef.set(data);
  updateDoc = async (docRef, data) => await docRef.update(data);
  query = (collectionRef, ...constraints) => ({ collectionRef, constraints });
  orderBy = (fieldPath, directionStr = "asc") => ({ type: "orderBy", fieldPath, directionStr });
  onSnapshot = async (queryOrCollectionRef, callback, errorCallback) => {
    try {
      const result = queryOrCollectionRef.collectionRef
        ? await queryOrCollectionRef.collectionRef.get()
        : await queryOrCollectionRef.get();

      let docs = result.docs;

      const orderConstraint = queryOrCollectionRef.constraints?.find((constraint) => constraint.type === "orderBy");
      if (orderConstraint) {
        docs = [...docs].sort((a, b) => {
          const aValue = a.data()[orderConstraint.fieldPath];
          const bValue = b.data()[orderConstraint.fieldPath];
          if (aValue === bValue) return 0;
          const direction = orderConstraint.directionStr === "desc" ? -1 : 1;
          return aValue < bValue ? -direction : direction;
        });
      }

      callback({ docs });
    } catch (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }

    return () => {};
  };
  Timestamp = { now: () => new Date() };
  signInWithEmailAndPassword = (_auth, email, password) => demoFirebase.auth.signInWithEmailAndPassword(null, email, password);
  signOut = (_auth) => demoFirebase.auth.signOut();
  onAuthStateChanged = (_auth, callback) => demoFirebase.auth.onAuthStateChanged(callback);
} else {
  console.log("🔥 Using Real Firebase");

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = firebaseGetFirestore(app);
  collection = firebaseCollection;
  doc = firebaseDoc;
  addDoc = firebaseAddDoc;
  getDocs = firebaseGetDocs;
  setDoc = firebaseSetDoc;
  updateDoc = firebaseUpdateDoc;
  onSnapshot = firebaseOnSnapshot;
  query = firebaseQuery;
  orderBy = firebaseOrderBy;
  Timestamp = firebaseTimestamp;
  getDoc = firebaseGetDoc;
  signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
  signOut = firebaseSignOut;
  onAuthStateChanged = firebaseOnAuthStateChanged;
}

export {
  auth,
  db,
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  getDoc,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
}; 