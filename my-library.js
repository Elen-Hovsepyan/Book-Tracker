class LibraryManager {
  constructor() {
    this.filteredBooks = [];
    this.init();
  }

  init() {
    this.renderBooks();
    this.setupEventListeners();
    this.updateStats();
  }

  setupEventListeners() {
    // Поиск
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterBooks());
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.filterBooks();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.filterBooks());
    }

    // Фильтры
    document
      .getElementById("genre-filter")
      ?.addEventListener("change", () => this.filterBooks());
    document
      .getElementById("status-filter")
      ?.addEventListener("change", () => this.filterBooks());
    document
      .getElementById("month-filter")
      ?.addEventListener("change", () => this.filterBooks());
  }

  filterBooks() {
    const searchTerm = document.getElementById("search-input")?.value || "";
    const genreFilter = document.getElementById("genre-filter")?.value || "";
    const statusFilter = document.getElementById("status-filter")?.value || "";
    const monthFilter = document.getElementById("month-filter")?.value || "";

    this.filteredBooks = window.dataManager.searchBooks(
      searchTerm,
      genreFilter,
      statusFilter,
      monthFilter
    );
    this.renderBooks();
  }

  renderBooks() {
    const grid = document.getElementById("books-grid");
    const emptyLibrary = document.getElementById("empty-library");

    if (!grid || !emptyLibrary) return;

    if (this.filteredBooks.length === 0) {
      grid.style.display = "none";
      emptyLibrary.style.display = "block";
      return;
    }

    grid.style.display = "grid";
    emptyLibrary.style.display = "none";
    grid.innerHTML = "";

    this.filteredBooks.forEach((book) => {
      const bookCard = this.createBookCard(book);
      grid.appendChild(bookCard);
    });
  }

  createBookCard(book) {
    const card = document.createElement("div");
    card.className = "book-card";

    const startDate = book.startDate
      ? new Date(book.startDate).toLocaleDateString("ru-RU")
      : "-";
    const endDate = book.endDate
      ? new Date(book.endDate).toLocaleDateString("ru-RU")
      : "-";
    const ratingStars =
      "★".repeat(book.rating || 0) + "☆".repeat(5 - (book.rating || 0));

    card.innerHTML = `
            <div class="book-header">
                <div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                </div>
                <span class="book-status status-${
                  book.status
                }">${this.getStatusText(book.status)}</span>
            </div>
            
            <div class="book-meta">
                <div class="book-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${book.genre || "Не указан"}</span>
                </div>
                <div class="book-meta-item">
                    <i class="fas fa-calendar-start"></i>
                    <span>Начало: ${startDate}</span>
                </div>
                <div class="book-meta-item">
                    <i class="fas fa-calendar-check"></i>
                    <span>Конец: ${endDate}</span>
                </div>
                <div class="book-meta-item">
                    <i class="fas fa-star"></i>
                    <span class="book-rating">${ratingStars}</span>
                </div>
            </div>

            ${
              book.notes
                ? `
                <div class="book-notes">
                    <p><strong>Заметки:</strong> ${book.notes.substring(
                      0,
                      100
                    )}${book.notes.length > 100 ? "..." : ""}</p>
                </div>
            `
                : ""
            }

            <div class="book-actions">
                <button class="btn-small btn-edit" onclick="libraryManager.editBook('${
                  book.id
                }')">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="btn-small btn-delete" onclick="libraryManager.deleteBook('${
                  book.id
                }')">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `;

    return card;
  }

  getStatusText(status) {
    const statusMap = {
      planned: "Запланирована",
      reading: "Читаю",
      finished: "Прочитана",
      paused: "На паузе",
    };
    return statusMap[status] || status;
  }

  updateStats() {
    const books = window.dataManager.getAllBooks();
    const total = books.length;
    const read = books.filter((book) => book.status === "finished").length;
    const reading = books.filter((book) => book.status === "reading").length;

    document.getElementById("total-books").textContent = total;
    document.getElementById("read-books").textContent = read;
    document.getElementById("reading-books").textContent = reading;
  }

  editBook(bookId) {
    window.location.href = `add-book.html?edit=${bookId}`;
  }

  deleteBook(bookId) {
    if (confirm("Вы уверены, что хотите удалить эту книгу?")) {
      if (window.dataManager.deleteBook(bookId)) {
        this.filterBooks();
        this.updateStats();
      }
    }
  }
}

// Запускаем
document.addEventListener("DOMContentLoaded", function () {
  window.libraryManager = new LibraryManager();
});
