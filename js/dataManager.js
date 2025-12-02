// dataManager.js - менеджер данных для работы с Firebase
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

class DataManager {
  constructor() {
    this.userId = this.getUserId();
  }

  getUserId() {
    // Временно используем фиксированный ID
    // Позже можно добавить аутентификацию
    return localStorage.getItem("userId") || "test-user-123";
  }

  // Получить все книги пользователя
  async getAllBooks() {
    try {
      const q = query(
        collection(db, "books"),
        where("userId", "==", this.userId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const books = [];

      querySnapshot.forEach((doc) => {
        books.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return books;
    } catch (error) {
      console.error("Ошибка получения книг:", error);
      return [];
    }
  }

  // Поиск книг
  async searchBooks(
    searchTerm = "",
    genreFilter = "",
    statusFilter = "",
    monthFilter = ""
  ) {
    const allBooks = await this.getAllBooks();

    return allBooks.filter((book) => {
      // Поиск по тексту
      const searchMatch =
        !searchTerm ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      // Фильтр по жанру
      const genreMatch = !genreFilter || book.genre === genreFilter;

      // Фильтр по статусу
      const statusMatch = !statusFilter || book.status === statusFilter;

      // Фильтр по месяцу
      let monthMatch = true;
      if (monthFilter && book.startDate) {
        const date = new Date(book.startDate);
        monthMatch = date.getMonth() + 1 === parseInt(monthFilter);
      }

      return searchMatch && genreMatch && statusMatch && monthMatch;
    });
  }

  // Добавить книгу
  async addBook(bookData) {
    try {
      const bookWithMetadata = {
        ...bookData,
        userId: this.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "books"), bookWithMetadata);
      console.log("Книга добавлена с ID:", docRef.id);

      return {
        success: true,
        id: docRef.id,
        book: { ...bookWithMetadata, id: docRef.id },
      };
    } catch (error) {
      console.error("Ошибка добавления книги:", error);
      console.error("Подробности ошибки:", error.message, error.code);
      throw new Error(`Не удалось сохранить книгу: ${error.message}`);
    }
  }

  // Обновить книгу
  async updateBook(bookId, bookData) {
    try {
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        ...bookData,
        updatedAt: new Date().toISOString(),
      });
      console.log("Книга обновлена:", bookId);
      return true;
    } catch (error) {
      console.error("Ошибка обновления книги:", error);
      return false;
    }
  }

  // Удалить книгу
  async deleteBook(bookId) {
    try {
      await deleteDoc(doc(db, "books", bookId));
      console.log("Книга удалена:", bookId);
      return true;
    } catch (error) {
      console.error("Ошибка удаления книги:", error);
      return false;
    }
  }

  // Получить книгу по ID
  async getBookById(bookId) {
    try {
      const q = query(
        collection(db, "books"),
        where("__name__", "==", bookId),
        where("userId", "==", this.userId)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error("Ошибка получения книги:", error);
      return null;
    }
  }
}

// Создаем глобальный экземпляр
const dataManager = new DataManager();
window.dataManager = dataManager;

export default dataManager;
