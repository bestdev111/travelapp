import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  // copy and paste your firebase credential here
  apiKey: "AIzaSyCTBy9jOQEqhtOwDHkQji4jrKPp8LqUZYo",
  authDomain: "travelapp-57af7.firebaseapp.com",
  projectId: "travelapp-57af7",
  storageBucket: "travelapp-57af7.appspot.com",
  messagingSenderId: "1041158445036",
  appId: "1:1041158445036:web:3cd280b8da63412d4bd2c9",
  measurementId: "G-0SS08Z5SYH",
});

const db = firebaseApp.firestore();
const storage = firebaseApp.storage();

export { db, storage };
