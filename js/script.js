document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector(".add-button");
  const overflowContainer = document.querySelector(".owerflow");
  const closeButton = document.querySelector(".cross");
  const form = document.querySelector(".add-user-form");
  const tableBody = document.querySelector(".table-position");
  const searchInput = document.querySelector(".search input[type='text']");
  const searchButton = document.querySelector(".btn-search");

  let editMode = false; // Переменная для отслеживания режима редактирования
  let currentUserId;

  const getStoredUsers = () => JSON.parse(localStorage.getItem("users")) || [];

  // Генерация id
  const generateUniqueId = (storedUsers) => {
    let id;
    do {
      id = Math.floor(100 + Math.random() * 900);
    } while (storedUsers.some((user) => user.id === id));
    return id;
  };

  const populateTable = () => {
    tableBody.innerHTML = "";
    const storedUsers = getStoredUsers();
    storedUsers.forEach((user) => addToTable(user));
  };

  if (addButton) {
    addButton.addEventListener("click", () => {
      overflowContainer.style.display = "block";
      clearErrors();
      editMode = false;
      form.reset();
      document.querySelector(".position-text").textContent =
        "Добавить пользователя";
      document.querySelector(".add-button-ac").textContent =
        "Добавить пользователя";
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      overflowContainer.style.display = "none";
      clearErrors();
      editMode = false;
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors();

      const firstName = document.querySelector("#firstName").value.trim();
      const lastName = document.querySelector("#lastName").value.trim();
      const phone = document.querySelector("#phone").value.trim();
      const role = document.querySelector("#role").value.trim();
      const login = document.querySelector("#login").value.trim();
      const password = document.querySelector("#password").value.trim();

      // Получение существующих пользователей из localStorage
      const storedUsers = getStoredUsers();

      if (storedUsers.some((user) => user.login === login && !editMode)) {
        showError("loginError", "Логин должен быть уникальным.");
        return;
      }

      if (!/^[а-яА-ЯёЁ]+$/.test(firstName)) {
        // Проверка на наличие только русских букв в имени
        showError(
          "firstNameError",
          "Имя должно содержать только русские буквы."
        );
        return;
      }

      if (!/^[а-яА-ЯёЁ]+$/.test(lastName)) {
        showError(
          "lastNameError",
          "Фамилия должна содержать только русские буквы."
        );
        return;
      }

      const validationResult = validateLoginAndPassword(login, password);
      if (!validationResult.isValid) {
        showError(
          validationResult.errorElementId,
          validationResult.errorMessage
        );
        return;
      }

      if (!phone || phone.length < 18) {
        // Проверка длины номера телефона
        showError("phoneError", "Пожалуйста, введите полный номер телефона");
        return;
      }

      if (!password || /\s/.test(password)) {
        showError(
          "passwordError",
          "Пароль не может быть пустым и не должен содержать пробелов."
        );
        return;
      }

      if (editMode) {
        const updatedUserData = {
          id: currentUserId,
          firstName,
          lastName,
          phone,
          role,
          login,
          password,
        };
        saveUpdatedUserData(updatedUserData);
      } else {
        const userId = generateUniqueId(storedUsers);
        const userData = {
          id: userId,
          firstName,
          lastName,
          phone,
          role,
          login,
          password,
        };
        saveUserData(userData);
        addToTable(userData);
      }

      overflowContainer.style.display = "none";
      form.reset();
    });
  }

  // Функция для сохранения данных в localStorage
  const saveUserData = (userData) => {
    const storedUsers = getStoredUsers();
    storedUsers.push(userData);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  // Функция для обновления данных пользователя в localStorage
  const saveUpdatedUserData = (updatedUserData) => {
    let storedUsers = getStoredUsers();
    storedUsers = storedUsers.map((user) =>
      user.id === updatedUserData.id ? updatedUserData : user
    );
    localStorage.setItem("users", JSON.stringify(storedUsers));
    populateTable();
    overflowContainer.style.display = "none";
    form.reset();
  };

  // Функция для добавления данных в таблицу
  const addToTable = (userData) => {
    const newRow = `
        <tr class="table-section__tr font-regular" data-id="${userData.id}">
            <td>${userData.id}</td>
            <td>${userData.firstName}</td>
            <td>${userData.lastName}</td>
            <td>${userData.role}</td>
            <td>${userData.login}</td>
            <td>${userData.password}</td>
            <td>${userData.phone}</td>
            <td><img src="../icons/edit.svg" alt="изменение" class="edit-button"></td>
            <td><img src="../icons/delete.svg" alt="удаление" class="delete-button"></td>
        </tr>`;

    tableBody.insertAdjacentHTML("beforeend", newRow);

    tableBody
      .querySelector(`tr[data-id="${userData.id}"] .delete-button`)
      .addEventListener("click", () => {
        deleteUser(userData.id);
      });

    tableBody
      .querySelector(`tr[data-id="${userData.id}"] .edit-button`)
      .addEventListener("click", () => {
        editUser(userData.id);
      });
  };

  // Функция для удаления пользователя из localStorage и таблицы
  const deleteUser = (id) => {
    let storedUsers = getStoredUsers();
    storedUsers = storedUsers.filter((user) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(storedUsers));
    populateTable();
  };

  // Функция для редактирования пользователя
  const editUser = (userId) => {
    editMode = true;
    currentUserId = userId;

    const storedUsers = getStoredUsers();
    const userToEdit = storedUsers.find((user) => user.id === userId);

    document.querySelector("#firstName").value = userToEdit.firstName;
    document.querySelector("#lastName").value = userToEdit.lastName;
    document.querySelector("#phone").value = userToEdit.phone;
    document.querySelector("#role").value = userToEdit.role;
    document.querySelector("#login").value = userToEdit.login;

    overflowContainer.style.display = "block";
    document.querySelector(".position-text").textContent =
      "Редактировать пользователя";
    document.querySelector(".add-button-ac").textContent =
      "Сохранить изменения";
  };

  // Функция для маски номера телефона
  const maskPhoneInput = (event) => {
    const input = event.target;
    const value = input.value.replace(/\D/g, "");

    let formattedValue = "+7 (";

    if (value.length > 1) formattedValue += value.substring(1, 4);

    if (value.length >= 5) formattedValue += ") " + value.substring(4, 7);

    if (value.length >= 7) formattedValue += "-" + value.substring(7, 9);

    if (value.length >= 9) formattedValue += "-" + value.substring(9, 11);

    input.value = formattedValue;
  };

  document.querySelector("#phone").addEventListener("input", maskPhoneInput);

  populateTable();

  const showError = (elementId, message) => {
    const errorElement = document.querySelector(`#${elementId}`);
    errorElement.textContent = message;
  };

  const clearErrors = () => {
    document.querySelector("#firstNameError").textContent = "";
    document.querySelector("#lastNameError").textContent = "";
    document.querySelector("#phoneError").textContent = "";
    document.querySelector("#loginError").textContent = "";
    document.querySelector("#passwordError").textContent = "";
  };

  const removeSpaces = function (event) {
    this.value = this.value.replace(/\s+/g, "");
  };

  document.querySelector("#firstName").addEventListener("input", removeSpaces);
  document.querySelector("#lastName").addEventListener("input", removeSpaces);
  document.querySelector("#login").addEventListener("input", removeSpaces);
  document.querySelector("#password").addEventListener("input", removeSpaces);

  const allowOnlyRussianLetters = function (event) {
    this.value = this.value.replace(/[^а-яА-ЯёЁ]/g, "");
  };

  const allowOnlyRussianLettersLastName = function (event) {
    this.value = this.value.replace(/[^а-яА-ЯёЁ]/g, "");
  };

  /**
   * Валидация логина и пароля.
   */
  const validateLoginAndPassword = (login, password) => {
    if (/^[а-яА-ЯёЁ]*$/.test(login)) {
      return {
        isValid: false,
        errorElementId: "loginError",
        errorMessage: "Логин не должен содержать русские буквы.",
      };
    }
    if (/^[а-яА-ЯёЁ]*$/.test(password)) {
      return {
        isValid: false,
        errorElementId: "passwordError",
        errorMessage: "Пароль не должен содержать русские буквы.",
      };
    }
    return { isValid: true };
  };

  //  *Поиск по имени и фамилии.

  searchButton.addEventListener("click", () => {
    const queryString = searchInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    Array.from(rows).forEach((row) => {
      const firstNameCellText = row.cells[1]
        ? row.cells[1].textContent.toLowerCase()
        : "";
      const lastNameCellText = row.cells[2]
        ? row.cells[2].textContent.toLowerCase()
        : "";

      if (
        firstNameCellText.includes(queryString) ||
        lastNameCellText.includes(queryString)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  document
    .querySelector("#firstName")
    .addEventListener("input", allowOnlyRussianLetters);
  document
    .querySelector("#lastName")
    .addEventListener("input", allowOnlyRussianLettersLastName);
});

document.addEventListener("DOMContentLoaded", () => {
  // Массив с путями страниц, на которых будет работать скрипт
  const allowedPages = ["/pages/administrator.html", "/pages/managerPage.html"]; // Замените на нужные пути

  // Проверяем, находится ли пользователь на одной из разрешённых страниц
  if (allowedPages.includes(window.location.pathname)) {
    const logOutButton = document.querySelector(".log-out-button");

    // Функция для создания меню выхода
    const createExitMenu = () => {
      const exitMenu = document.createElement("div");
      exitMenu.className = "owerflow-exit font-regular";

      exitMenu.innerHTML = `
          <div class="exit-container">
              <span class="cross-exit"><img src="../icons/krest.svg" alt="cross"></span>
              <span class="exit-text">Вы действительно хотите выйти?</span>
              <div class="button-exit-container font-regular-white">
                  <button class="exit-cancellation font-regular-white">Отмена</button>
                  <button class="exit-completed font-regular-white">Выйти</button>
              </div>
          </div>
      `;

      // закрытие меню
      const closeButton = exitMenu.querySelector(".cross-exit");
      const cancelButton = exitMenu.querySelector(".exit-cancellation");
      const completeButton = exitMenu.querySelector(".exit-completed");

      closeButton.addEventListener("click", () => {
        exitMenu.remove(); 
      });

      cancelButton.addEventListener("click", () => {
        exitMenu.remove(); 
      });

      completeButton.addEventListener("click", () => {
        window.location.href = "../index.html"; // Перенаправление на вход
      });

      return exitMenu;
    };

    logOutButton.addEventListener("click", () => {
      const header = document.querySelector(".dute__header");
      const exitMenu = createExitMenu(); 
      header.appendChild(exitMenu); 
    });
  }
});
