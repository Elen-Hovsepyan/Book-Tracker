import { db } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';

async function testFirebase() {
  try {
    console.log("Пробую подключиться к Firebase...");
    
    const testData = {
      title: "Test Book",
      userId: "test-user-123",
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "test"), testData);
    console.log("✅ Успех! Добавлен документ с ID:", docRef.id);
    
  } catch (error) {
    console.error("❌ Ошибка Firebase:", error);
    console.error("Код ошибки:", error.code);
    console.error("Сообщение:", error.message);
  }
}

testFirebase();
