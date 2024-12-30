// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBdCjKdUuA2HSKFsh_viDT2hrBVNfvV2mQ",
    authDomain: "next-tasks-board.firebaseapp.com",
    projectId: "next-tasks-board",
    storageBucket: "next-tasks-board.firebasestorage.app",
    messagingSenderId: "1022140978115",
    appId: "1:1022140978115:web:8fdb90c4b6a7757b8e2376"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp)
