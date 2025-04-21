import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDJ7N98nC_vMPajSilU7cS0_QuP8URwQ_c",
    authDomain: "myfinanceapp-d9be2.firebaseapp.com",
    projectId: "myfinanceapp-d9be2",
    storageBucket: "myfinanceapp-d9be2.firebasestorage.app",
    messagingSenderId: "726062330950",
    appId: "1:726062330950:web:6e4ce9650731f9e733c647",
    measurementId: "G-N2Q1ZVG3WB"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);