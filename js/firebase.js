import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGUOEUxcvPB8r-KssnS1xytmI-TbqUxcY", // ИЗ ВАШЕГО СКРИНШОТА
  authDomain: "book-tracker-3b321.firebaseapp.com",
  projectId: "book-tracker-3b321",
  storageBucket: "book-tracker-3b321.firebasestorage.app",
  messagingSenderId: "408279477366", // ИСПРАВЛЕНО
  appId: "1:408279477366:web:6f2ef478832ddd0155c357", // ИЗ ВАШЕГО СКРИНШОТА
  measurementId: "G-BGCQV4N59H", // ИЗ ВАШЕГО СКРИНШОТА
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
