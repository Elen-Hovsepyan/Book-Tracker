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

  // Обработка отправки форм с редиректом на профиль
  const authForms = document.querySelectorAll(".auth-form");
  authForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const action = this.querySelector(".btn-submit").textContent;

      // Здесь можно добавить AJAX запрос к серверу
      console.log("Отправка формы:", Object.fromEntries(formData));

      // Показываем сообщение об успехе
      alert(`${action} успешно! Перенаправляем на страницу профиля...`);

      // Закрываем модальное окно
      loginModal.style.display = "none";
      registerModal.style.display = "none";
      document.body.style.overflow = "auto";

      // Редирект на страницу профиля через 1 секунду
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 1000);
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

  // Обработчик для кнопки "Начать отслеживание" на главной
  const startTrackingBtn = document.getElementById("startTracking");
  if (startTrackingBtn) {
    startTrackingBtn.addEventListener("click", function () {
      // Открываем форму регистрации
      registerModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }
});
