// Добавьте в самое начало файла add-book.js
console.log("=== DEBUG ===");
console.log("Firebase доступен?", typeof firebase !== "undefined");
console.log("dataManager доступен?", typeof dataManager !== "undefined");
console.log("db доступен?", typeof db !== "undefined");

// add-book.js
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация звезд рейтинга
  initializeRatingStars();

  // Обработчик отправки формы
  const bookForm = document.getElementById("book-form");
  bookForm.addEventListener("submit", handleFormSubmit);

  // Инициализация дат и ограничений
  setupDates();

  // Инициализация стилей
  addStyles();
});

// ПРОСТАЯ и надежная инициализация звезд
function initializeRatingStars() {
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("book-rating");

  if (!stars.length || !ratingInput) return;

  // Обработчик клика по звездам
  document
    .querySelector(".rating-stars")
    .addEventListener("click", function (e) {
      if (e.target.closest(".star")) {
        const star = e.target.closest(".star");
        const rating = parseInt(star.getAttribute("data-rating"));

        ratingInput.value = rating;

        // Обновляем отображение
        stars.forEach((s, index) => {
          const icon = s.querySelector("i");
          if (index < rating) {
            icon.className = "fas fa-star";
            s.classList.add("active");
          } else {
            icon.className = "far fa-star";
            s.classList.remove("active");
          }
        });
      }
    });
}

// ПРОСТАЯ настройка дат - ИСПРАВЛЕННАЯ ВЕРСИЯ
function setupDates() {
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");

  if (!startDate || !endDate) return;

  // Когда меняется дата начала, обновляем минимальную дату для конца
  startDate.addEventListener("input", function () {
    if (this.value) {
      // Устанавливаем минимальную дату для конца как дату начала
      endDate.min = this.value;

      // Если дата конца уже выбрана и она раньше новой даты начала
      if (endDate.value && endDate.value < this.value) {
        // Автоматически исправляем на дату начала
        endDate.value = this.value;
      }
    }
  });

  // Когда меняется дата конца
  endDate.addEventListener("change", function () {
    const startValue = startDate.value;
    const endValue = this.value;

    if (startValue && endValue && endValue < startValue) {
      // Автоматически исправляем на дату начала
      this.value = startValue;
    }
  });

  // При загрузке страницы проверяем
  if (startDate.value && endDate.value && endDate.value < startDate.value) {
    endDate.value = startDate.value;
  }

  // Убираем ограничение min для поля "Начало" (можно выбрать любую дату)
  startDate.removeAttribute("min");
}

// Обработчик отправки формы
async function handleFormSubmit(event) {
  event.preventDefault();

  const bookData = {
    title: document.getElementById("book-title").value.trim(),
    author: document.getElementById("book-author").value.trim(),
    genre: document.getElementById("book-genre").value,
    status: document.getElementById("book-status").value,
    startDate: document.getElementById("start-date").value,
    endDate: document.getElementById("end-date").value,
    notes: document.getElementById("book-notes").value.trim(),
    rating: parseInt(document.getElementById("book-rating").value) || 0,
    addedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  // Простая валидация
  if (
    !bookData.title ||
    !bookData.author ||
    !bookData.genre ||
    bookData.status === "planned"
  ) {
    alert("Заполните обязательные поля");
    return;
  }

  try {
    await dataManager.addBook(bookData);
    alert("Книга успешно добавлена!");
    resetForm();
    setTimeout(() => (window.location.href = "my-library.html"), 1000);
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Не удалось сохранить книгу");
  }
}

// Очистка формы
function resetForm() {
  document.getElementById("book-form").reset();
  document.getElementById("book-rating").value = 0;

  const stars = document.querySelectorAll(".star");
  stars.forEach((star) => {
    const icon = star.querySelector("i");
    icon.className = "far fa-star";
    star.classList.remove("active");
  });

  setupDates();
}

// Простые стили для ошибок
function addStyles() {
  if (!document.querySelector("#add-book-styles")) {
    const style = document.createElement("style");
    style.id = "add-book-styles";
    style.textContent = `
      .star.active i { color: #f6ad55 !important; }
      .star:hover i { color: #ffc107 !important; }
    `;
    document.head.appendChild(style);
  }
}
