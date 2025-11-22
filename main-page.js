// Модальные окна для авторизации
document.addEventListener("DOMContentLoaded", function () {
  // Элементы модальных окон
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const closeButtons = document.querySelectorAll(".close");

  // Кнопки в хедере
  const loginBtn = document.querySelector('.auth-nav a[href="#"]:first-child');
  const registerBtn = document.querySelector(
    '.auth-nav a[href="#"]:last-child'
  );

  // Ссылки переключения между формами
  const switchToRegister = document.querySelector(".switch-to-register");
  const switchToLogin = document.querySelector(".switch-to-login");

  // Открытие модального окна входа
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }

  // Открытие модального окна регистрации
  if (registerBtn) {
    registerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }

  // Закрытие модальных окон
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      loginModal.style.display = "none";
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  });

  // Закрытие при клике вне окна
  window.addEventListener("click", function (e) {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    if (e.target === registerModal) {
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Переключение между формами
  if (switchToRegister) {
    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "block";
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "block";
    });
  }

  // Обработка отправки форм
  const authForms = document.querySelectorAll(".auth-form");
  authForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const action = this.querySelector(".btn-submit").textContent;

      // Здесь можно добавить AJAX запрос к серверу
      console.log("Отправка формы:", Object.fromEntries(formData));
      alert(`${action}... (заглушка для демонстрации)`);

      // Закрываем модальное окно после успешной отправки
      loginModal.style.display = "none";
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  });

  // Закрытие по ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      loginModal.style.display = "none";
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Остальной код главной страницы...
  const startTrackingBtn = document.getElementById("startTracking");
  if (startTrackingBtn) {
    startTrackingBtn.addEventListener("click", function () {
      registerModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }
});

/*основная логика странички */
/*основная логика странички */
/*основная логика странички */
/*основная логика странички */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Главная страница загружена");

  // Анимация появления элементов
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(".feature-card, .cta-section");

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Установка начальных стилей для анимации
  const featureCards = document.querySelectorAll(".feature-card");
  const ctaSection = document.querySelector(".cta-section");

  featureCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  if (ctaSection) {
    ctaSection.style.opacity = "0";
    ctaSection.style.transform = "translateY(30px)";
    ctaSection.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  }

  // Запуск анимации
  setTimeout(() => {
    animateOnScroll();
  }, 100);

  window.addEventListener("scroll", animateOnScroll);

  // Обработчики кнопок
  const startTrackingBtn = document.getElementById("startTracking");
  if (startTrackingBtn) {
    startTrackingBtn.addEventListener("click", function () {
      // Здесь можно добавить логику перехода
      alert("Начинаем работу с трекером!");
      // window.location.href = 'registration.html';
    });
  }

  const learnMoreBtn = document.getElementById("learnMore");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", function () {
      // Плавная прокрутка к features
      document.querySelector(".features-grid").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  // Иконка дома (для консистентности)
  const homeButton = document.getElementById("homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", function (e) {
      if (!window.location.href.endsWith("index.html")) {
        e.preventDefault();
        window.location.href = "index.html";
      }
    });
  }

  // Добавляем небольшой эффект при загрузке
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});
