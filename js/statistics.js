// statistics.js

document.addEventListener("DOMContentLoaded", async function () {
  // Подождем, пока загрузится dataManager
  await new Promise((resolve) => {
    if (typeof dataManager !== "undefined") {
      resolve();
    } else {
      // Если dataManager еще не загружен, ждем немного
      setTimeout(resolve, 100);
    }
  });

  // Инициализация статистики
  await initializeStatistics();
});

async function initializeStatistics() {
  try {
    // Получаем все книги из библиотеки
    const books = await dataManager.getAllBooks();

    if (books.length === 0) {
      showNoDataMessage();
      return;
    }

    // Обновляем общую статистику
    updateGeneralStats(books);

    // Создаем графики
    createGenreChart(books);
    createAuthorChart(books);
    createMonthlyChart(books);
    createStatusChart(books);

    // Обновляем детальную информацию
    updateDetailedStats(books);
  } catch (error) {
    console.error("Ошибка при загрузке статистики:", error);
  }
}

function updateGeneralStats(books) {
  // Общее количество книг
  document.getElementById("total-books-stat").textContent = books.length;

  // Прочитанные книги
  const readBooks = books.filter((book) => book.status === "finished").length;
  document.getElementById("read-books-stat").textContent = readBooks;

  // Книги в процессе чтения
  const readingBooks = books.filter((book) => book.status === "reading").length;
  document.getElementById("reading-books-stat").textContent = readingBooks;

  // Средний рейтинг
  const ratedBooks = books.filter((book) => book.rating && book.rating > 0);
  const avgRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
          ratedBooks.length
        ).toFixed(1)
      : "0.0";
  document.getElementById("avg-rating-stat").textContent = avgRating;
}

function createGenreChart(books) {
  // Собираем статистику по жанрам
  const genreStats = {};
  books.forEach((book) => {
    if (book.genre) {
      genreStats[book.genre] = (genreStats[book.genre] || 0) + 1;
    }
  });

  const genres = Object.keys(genreStats);
  const counts = Object.values(genreStats);

  const colors = generateColors(genres.length);

  const ctx = document.getElementById("genreChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: genres,
      datasets: [
        {
          data: counts,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "white",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
      },
    },
  });
}

function createAuthorChart(books) {
  // Собираем статистику по авторам (топ-5)
  const authorStats = {};
  books.forEach((book) => {
    if (book.author) {
      const author = book.author.trim();
      if (author) {
        authorStats[author] = (authorStats[author] || 0) + 1;
      }
    }
  });

  // Сортируем по количеству книг и берем топ-5
  const sortedAuthors = Object.entries(authorStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const authors = sortedAuthors.map((item) => item[0]);
  const counts = sortedAuthors.map((item) => item[1]);

  const ctx = document.getElementById("authorChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: authors,
      datasets: [
        {
          label: "Количество книг",
          data: counts,
          backgroundColor: "#082567",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function createMonthlyChart(books) {
  // Статистика по месяцам добавления
  const monthlyStats = Array(12).fill(0);
  const currentYear = new Date().getFullYear();

  books.forEach((book) => {
    if (book.addedDate) {
      const date = new Date(book.addedDate);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth(); // 0-11
        monthlyStats[month]++;
      }
    }
  });

  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const ctx = document.getElementById("monthlyChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Книг добавлено",
          data: monthlyStats,
          borderColor: "#1073b4",
          backgroundColor: "rgba(8, 37, 103, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#082567",
          pointRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

function createStatusChart(books) {
  // Статистика по статусам
  const statusStats = {
    reading: 0,
    finished: 0,
    planned: 0,
  };

  books.forEach((book) => {
    if (book.status && statusStats.hasOwnProperty(book.status)) {
      statusStats[book.status]++;
    }
  });

  const labels = ["Читаю", "Прочитано", "Запланировано"];
  const data = [statusStats.reading, statusStats.finished, statusStats.planned];
  const colors = ["#dd6b20", "#38a169", "#4a5568"];

  const ctx = document.getElementById("statusChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "white",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
}

function updateDetailedStats(books) {
  // Самый популярный жанр
  const genreStats = {};
  books.forEach((book) => {
    if (book.genre) {
      genreStats[book.genre] = (genreStats[book.genre] || 0) + 1;
    }
  });

  let topGenre = "-";
  let maxCount = 0;
  for (const [genre, count] of Object.entries(genreStats)) {
    if (count > maxCount) {
      maxCount = count;
      topGenre = genre;
    }
  }
  document.getElementById("top-genre").textContent = topGenre;

  // Любимый автор
  const authorStats = {};
  books.forEach((book) => {
    if (book.author) {
      const author = book.author.trim();
      if (author) {
        authorStats[author] = (authorStats[author] || 0) + 1;
      }
    }
  });

  let topAuthor = "-";
  let maxAuthorCount = 0;
  for (const [author, count] of Object.entries(authorStats)) {
    if (count > maxAuthorCount) {
      maxAuthorCount = count;
      topAuthor = author;
    }
  }
  document.getElementById("top-author").textContent = topAuthor;

  // Книг добавлено в этом году
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter((book) => {
    if (book.addedDate) {
      const date = new Date(book.addedDate);
      return date.getFullYear() === currentYear;
    }
    return false;
  }).length;
  document.getElementById("books-this-year").textContent = booksThisYear;

  // Самая высокая оценка
  const ratedBooks = books.filter((book) => book.rating && book.rating > 0);
  let highestRating = "-";
  if (ratedBooks.length > 0) {
    const maxRating = Math.max(...ratedBooks.map((book) => book.rating));
    const topRatedBooks = books.filter((book) => book.rating === maxRating);
    highestRating = `${maxRating}/5 - ${topRatedBooks[0].title}`;
  }
  document.getElementById("highest-rating").textContent = highestRating;
}

function generateColors(count) {
  const baseColor = [8, 37, 103]; // #082567 в RGB
  const colors = [];

  for (let i = 0; i < count; i++) {
    // Создаем вариации основного цвета
    const hueShift = (i * 30) % 360;
    const lightness = 40 + i * 5;

    // Конвертируем HSL в RGB (упрощенный вариант)
    const color = `hsl(${(hueShift + 210) % 360}, 70%, ${lightness}%)`;
    colors.push(color);
  }

  return colors;
}

function showNoDataMessage() {
  // Показываем сообщение, если нет данных
  const statsOverview = document.querySelector(".stats-overview");
  statsOverview.innerHTML = `
        <div class="empty-library">
            <i class="fas fa-chart-bar empty-icon"></i>
            <h3>Нет данных для статистики</h3>
            <p>Добавьте книги в библиотеку, чтобы увидеть статистику</p>
            <a href="add-book.html" class="btn btn-primary">
                <i class="fas fa-plus-circle btn-icon"></i>
                Добавить книгу
            </a>
        </div>
    `;
}
