// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJK09pB-18nlydn10EErSKmX16PdtNqPY",
  authDomain: "task2-895bb.firebaseapp.com",
  projectId: "task2-895bb",
  storageBucket: "task2-895bb.appspot.com",
  messagingSenderId: "188915352132",
  appId: "1:188915352132:web:091b80071b14454c547211"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);