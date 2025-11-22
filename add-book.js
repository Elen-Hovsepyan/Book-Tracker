class BookManager {
  constructor() {
    this.currentEditingId = null;
    this.init();
  }

  init() {
    this.setupEventListeners();

    // Проверяем редактирование
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("edit");
    if (editId) {
      this.loadBookForEditing(editId);
    }
  }

  setupEventListeners() {
    const form = document.getElementById("book-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveBook();
      });
    }

    // Звёзды рейтинга
    document.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", (e) => {
        this.setRating(parseInt(e.currentTarget.dataset.rating));
      });
    });
  }

  setRating(rating) {
    const stars = document.querySelectorAll(".star");
    const ratingInput = document.getElementById("book-rating");

    ratingInput.value = rating;

    stars.forEach((star, index) => {
      const icon = star.querySelector("i");
      if (index < rating) {
        icon.className = "fas fa-star";
        star.classList.add("active");
      } else {
        icon.className = "far fa-star";
        star.classList.remove("active");
      }
    });
  }

  loadBookForEditing(bookId) {
    const book = window.dataManager.getBookById(bookId);
    if (!book) return;

    this.currentEditingId = bookId;

    document.getElementById("book-title").value = book.title || "";
    document.getElementById("book-author").value = book.author || "";
    document.getElementById("book-genre").value = book.genre || "";
    document.getElementById("book-status").value = book.status || "planned";
    document.getElementById("start-date").value = book.startDate || "";
    document.getElementById("end-date").value = book.endDate || "";
    document.getElementById("book-notes").value = book.notes || "";

    this.setRating(book.rating || 0);

    const submitBtn = document.querySelector(".btn-primary");
    if (submitBtn) {
      submitBtn.innerHTML =
        '<i class="fas fa-save btn-icon"></i> Обновить книгу';
    }
  }

  saveBook() {
    const formData = {
      title: document.getElementById("book-title").value.trim(),
      author: document.getElementById("book-author").value.trim(),
      genre: document.getElementById("book-genre").value,
      status: document.getElementById("book-status").value,
      startDate: document.getElementById("start-date").value,
      endDate: document.getElementById("end-date").value,
      notes: document.getElementById("book-notes").value.trim(),
      rating: parseInt(document.getElementById("book-rating").value) || 0,
    };

    // Валидация
    if (!formData.title || !formData.author) {
      alert("Пожалуйста, заполните название книги и автора");
      return;
    }

    let success = false;

    if (this.currentEditingId) {
      // Редактирование
      success = window.dataManager.updateBook(this.currentEditingId, formData);
    } else {
      // Новая книга
      success = window.dataManager.addBook(formData);
    }

    if (success) {
      alert(
        this.currentEditingId
          ? "Книга успешно обновлена!"
          : "Книга успешно создана!"
      );
      setTimeout(() => {
        window.location.href = "my-library.html";
      }, 1000);
    } else {
      alert("Ошибка сохранения книги!");
    }
  }
}

// Запускаем
document.addEventListener("DOMContentLoaded", function () {
  new BookManager();
});

// test-firebase.js
import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

async function testConnection() {
  try {
    console.log("Проверяем подключение к Firebase...");
    const snapshot = await getDocs(collection(db, "test"));
    console.log("Подключение успешно!");
  } catch (error) {
    console.log(" Ошибка подключения:", error);
  }
}

testConnection();
