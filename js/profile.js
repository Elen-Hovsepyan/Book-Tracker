// profile.js - Загрузка данных профиля

document.addEventListener("DOMContentLoaded", async function () {
  // Подождать загрузки dataManager
  if (typeof dataManager === "undefined") {
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof dataManager !== "undefined") {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  // Загрузить данные профиля
  await loadProfileData();
});

async function loadProfileData() {
  try {
    // 1. Загружаем данные пользователя
    await loadUserInfo();

    // 2. Загружаем статистику книг
    await loadBooksStatistics();

    // 3. Загружаем дополнительную информацию
    await loadAdditionalInfo();
  } catch (error) {
    console.error("Ошибка при загрузке профиля:", error);
    showError("Не удалось загрузить данные профиля");
  }
}

async function loadUserInfo() {
  // Проверяем, откуда брать данные пользователя
  // Вариант 1: Firebase (если используете)
  if (typeof firebase !== "undefined" && firebase.auth().currentUser) {
    const user = firebase.auth().currentUser;
    document.getElementById("user-name").textContent =
      user.displayName || "Пользователь";
    document.getElementById("user-email").textContent = user.email;

    // Вариант 2: LocalStorage (если используете)
  } else if (localStorage.getItem("userData")) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    document.getElementById("user-name").textContent =
      userData.name || "Пользователь";
    document.getElementById("user-email").textContent =
      userData.email || "email@example.com";

    // Вариант 3: Статические данные (для демо)
  } else {
    document.getElementById("user-name").textContent = "Имя пользователя";
    document.getElementById("user-email").textContent = "user@example.com";
  }
}

async function loadBooksStatistics() {
  try {
    // Получаем все книги из библиотеки
    const books = await dataManager.getAllBooks();

    // Общее количество книг
    const totalBooks = books.length;
    document.getElementById("total-books-count").textContent = totalBooks;

    // Прочитанные книги
    const readBooks = books.filter((book) => book.status === "finished").length;
    document.getElementById("read-books-count").textContent = readBooks;

    // Книги в процессе чтения
    const readingBooks = books.filter(
      (book) => book.status === "reading"
    ).length;
    document.getElementById("reading-books-count").textContent = readingBooks;

    // Если книг нет
    if (totalBooks === 0) {
      showEmptyLibraryMessage();
    }
  } catch (error) {
    console.error("Ошибка при загрузке статистики книг:", error);
    document.getElementById("total-books-count").textContent = "0";
    document.getElementById("read-books-count").textContent = "0";
    document.getElementById("reading-books-count").textContent = "0";
  }
}

async function loadAdditionalInfo() {
  try {
    const books = await dataManager.getAllBooks();

    // Самый популярный жанр
    const genreStats = {};
    books.forEach((book) => {
      if (book.genre) {
        genreStats[book.genre] = (genreStats[book.genre] || 0) + 1;
      }
    });

    let topGenre = "Нет данных";
    let maxCount = 0;
    Object.entries(genreStats).forEach(([genre, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topGenre = genre;
      }
    });

    // Средний рейтинг
    const ratedBooks = books.filter((book) => book.rating && book.rating > 0);
    const avgRating =
      ratedBooks.length > 0
        ? (
            ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
            ratedBooks.length
          ).toFixed(1)
        : "0.0";

    // Можно добавить дополнительную информацию в профиль
    addProfileDetail("Любимый жанр", topGenre);
    addProfileDetail("Средний рейтинг", `${avgRating}/5`);

    // Дату регистрации (если есть)
    if (localStorage.getItem("registrationDate")) {
      const regDate = new Date(localStorage.getItem("registrationDate"));
      addProfileDetail("Дата регистрации", regDate.toLocaleDateString("ru-RU"));
    }
  } catch (error) {
    console.error("Ошибка при загрузке дополнительной информации:", error);
  }
}

function addProfileDetail(label, value) {
  // Создаем элемент для отображения дополнительной информации
  const detailsContainer =
    document.querySelector(".profile-details") || createDetailsContainer();

  const detailItem = document.createElement("div");
  detailItem.className = "profile-detail-item";
  detailItem.innerHTML = `
        <span class="detail-label">${label}:</span>
        <span class="detail-value">${value}</span>
    `;

  detailsContainer.appendChild(detailItem);
}

function createDetailsContainer() {
  const profileCard = document.querySelector(".profile-card");
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "profile-details";
  profileCard.appendChild(detailsContainer);
  return detailsContainer;
}

function showEmptyLibraryMessage() {
  const profileCard = document.querySelector(".profile-card");
  const message = document.createElement("div");
  message.className = "empty-library-message";
  message.innerHTML = `
        <p>📚 У вас пока нет книг в библиотеке</p>
        <a href="add-book.html" class="btn btn-small btn-primary">
            Добавить первую книгу
        </a>
    `;
  profileCard.appendChild(message);
}

function showError(message) {
  const profileCard = document.querySelector(".profile-card");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
        <p>⚠️ ${message}</p>
        <button onclick="loadProfileData()" class="btn btn-small">
            Попробовать снова
        </button>
    `;
  profileCard.appendChild(errorDiv);
}
