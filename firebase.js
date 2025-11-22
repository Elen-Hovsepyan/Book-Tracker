// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ВСТАВЬТЕ СЮДА ВАШУ КОНФИГУРАЦИЮ ИЗ FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAGUOEUxcvPB8r-KssnS1xytmI-TbqUxcY",
  authDomain: "book-tracker-3b321.firebaseapp.com",
  projectId: "book-tracker-3b321",
  storageBucket: "book-tracker-3b321.firebasestorage.app",
  messagingSenderId: "408279477366",
  appId: "1:408279477366:web:6f2ef4708320dd0155c357",
  measurementId: "G-BGC0Y4N59H",
};
// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Подключаем базу данных Firestore
export const db = getFirestore(app);

// Подключаем аутентификацию
export const auth = getAuth(app);

export default app;
