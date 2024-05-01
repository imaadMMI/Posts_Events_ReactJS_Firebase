// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmgSOuclmy3PtB45HB3qGE1s5NX4tK5us",
  authDomain: "event-1dbe2.firebaseapp.com",
  projectId: "event-1dbe2",
  storageBucket: "event-1dbe2.appspot.com",
  messagingSenderId: "277649947808",
  appId: "1:277649947808:web:b4bc36d85254ed240d5dc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();