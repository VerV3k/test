document.addEventListener("DOMContentLoaded", () => {
  // Check if the current page is either administrator.html or managerPage.html
  const currentPage = window.location.pathname;
  if (
    currentPage !== "/pages/administrator.html" &&
    currentPage !== "/pages/pastdutyreport.html"
  ) {
    return; // Exit if not on the specified pages
  }

  const addButton = document.querySelector(".add-button");
  const overflowContainer = document.querySelector(".owerflow");
  const closeButton = document.querySelector(".cross");
  const form = document.querySelector(".add-user-form");
  const tableBody = document.querySelector(".table-position");
  const searchInput = document.querySelector(".search input[type='text']");
  const searchButton = document.querySelector(".btn-search");
  const notificationContainer = document.querySelector(".owerflow-complitede"); // Container for notifications
  const notificationText = notificationContainer.querySelector(
    ".completed-chek span"
  ); // Notification text
  const exitCompletedButton =
    notificationContainer.querySelector(".exit-completed"); // Close button for notifications
  let message;
  let editMode = false; // Variable to track edit mode
  let currentUserId; // Variable to store the ID of the currently edited user

  // Get existing users from localStorage
  const getStoredUsers = () => JSON.parse(localStorage.getItem("users")) || [];

  // Generate a unique three-digit ID
  const generateUniqueId = (storedUsers) => {
    let id;
    do {
      id = Math.floor(100 + Math.random() * 900); // Generate a number between 100 and 999
    } while (storedUsers.some((user) => user.id === id)); // Check if this ID already exists
    return id;
  };

  // Populate the table with data from localStorage on page load
  const populateTable = () => {
    tableBody.innerHTML = "";
    const storedUsers = getStoredUsers();
    storedUsers.forEach((user) => addToTable(user));
  };

  if (addButton) {
    addButton.addEventListener("click", () => {
      overflowContainer.style.display = "block";
      clearErrors(); // Clear errors when opening the form
      editMode = false; // Set to add mode
      form.reset(); // Reset form
      document.querySelector(".position-text").textContent =
        "Добавить пользователя"; // Reset header text
      document.querySelector(".add-button-ac").textContent =
        "Добавить пользователя"; // Reset button text
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      overflowContainer.style.display = "none";
      clearErrors(); // Clear errors when closing the form
      editMode = false; // Reset mode when closing
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form behavior
      clearErrors(); // Clear previous error messages

      // Get data from the form and trim whitespace from edges
      const firstName = document.querySelector("#firstName").value.trim();
      const lastName = document.querySelector("#lastName").value.trim();
      const phone = document.querySelector("#phone").value.trim();
      const role = document.querySelector("#role").value.trim();
      const login = document.querySelector("#login").value.trim();
      const password = document.querySelector("#password").value.trim();

      // Get existing users from localStorage
      const storedUsers = getStoredUsers();

      // Check for unique login and no spaces
      if (storedUsers.some((user) => user.login === login && !editMode)) {
        showError("loginError", "Логин должен быть уникальным.");
        return;
      }

      if (!/^[а-яА-ЯёЁ]+$/.test(firstName)) {
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

      // Validate login and password in a separate function
      const validationResult = validateLoginAndPassword(login, password);
      if (!validationResult.isValid) {
        showError(
          validationResult.errorElementId,
          validationResult.errorMessage
        );
        return;
      }

      if (!phone || phone.length < 18) {
        showError(
          "phoneError",
          "Пожалуйста, введите полный номер телефона (должен быть не менее 18 символов)."
        );
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
        message = "Пользователь изменён";
        displayNotification(message);
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
        message = "Пользователь добавлен";
        displayNotification(message);
      }

      overflowContainer.style.display = "none";
      form.reset();
    });
  }

  // Function to save data to localStorage
  const saveUserData = (userData) => {
    const storedUsers = getStoredUsers();
    storedUsers.push(userData);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  };

  // Function to update user data in localStorage
  const saveUpdatedUserData = (updatedUserData) => {
    let storedUsers = getStoredUsers();
    storedUsers = storedUsers.map((user) =>
      user.id === updatedUserData.id ? updatedUserData : user
    );
    localStorage.setItem("users", JSON.stringify(storedUsers));
    populateTable();
    overflowContainer.style.display = "none"; // Close form after update
    form.reset(); // Reset form after update
  };

  // Function to add data to the table
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

  // Function to delete a user from localStorage and the table
  const deleteUser = (id) => {
    let storedUsers = getStoredUsers();
    storedUsers = storedUsers.filter((user) => user.id !== id);
    localStorage.setItem("users", JSON.stringify(storedUsers));
    populateTable();
  };

  // Function to edit a user
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

  // Function to mask phone number input
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

  /**
   * Remove spaces when typing in form fields.
   */
  const removeSpaces = function (event) {
    this.value = this.value.replace(/\s+/g, "");
  };

  document.querySelector("#firstName").addEventListener("input", removeSpaces);
  document.querySelector("#lastName").addEventListener("input", removeSpaces);
  document.querySelector("#login").addEventListener("input", removeSpaces);
  document.querySelector("#password").addEventListener("input", removeSpaces);

  /**
   * Allow only Russian letters in Name field.
   */
  const allowOnlyRussianLettersInFirstName = function (event) {
    this.value = this.value.replace(/[^а-яА-ЯёЁ]/g, "");
  };

  /**
   * Allow only Russian letters in Last Name field.
   */
  const allowOnlyRussianLettersInLastName = function (event) {
    this.value = this.value.replace(/[^а-яА-ЯёЁ]/g, "");
  };

  /**
   * Validate login and password.
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

  /**
   * Search by first name and last name.
   */

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
    .addEventListener("input", allowOnlyRussianLettersInFirstName);
  document
    .querySelector("#lastName")
    .addEventListener("input", allowOnlyRussianLettersInLastName);

  const displayNotification = (message) => {
    notificationText.textContent = message;
    notificationContainer.style.display = "block";

    setTimeout(() => {
      notificationContainer.style.display = "none";
    }, 3000);

    exitCompletedButton.onclick = () => {
      notificationContainer.style.display = "none";
    };
  };
});

document.addEventListener("DOMContentLoaded", () => {
  // Массив с путями страниц, на которых будет работать скрипт
  const allowedPages = [
    "/pages/administrator.html",
    "/pages/administratorEdit.html",
    "/pages/duty.html",
    "/pages/pastdutyreport.html",
    "/test/pages/managerPage.html",
    "/pages/manageDutyReport.html",
  ];

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

document.addEventListener("DOMContentLoaded", () => {
  // if (window.location.pathname !== "index.html") {
  //   return;
  // }

  const form = document.querySelector("#form-sign-in");
  const errorMessageElement = document.querySelector(".error-message-log"); // Элемент для вывода ошибок

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (errorMessageElement) {
        errorMessageElement.textContent = "";
      }

      const loginInput = document.querySelector("#login").value.trim();
      const passwordInput = document.querySelector("#password").value.trim();

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

      const user = storedUsers.find(
        (user) => user.login === loginInput && user.password === passwordInput
      );

      if (user) {
        switch (user.role) {
          case "администратор":
            window.location.href = "pages/administrator.html";
            break;
          case "главный администратор":
            window.location.href = "pages/managerPage.html";
            break;
          case "сотрудник":
            window.location.href = "pages/duty.html";
            break;
          default:
            if (errorMessageElement) {
              errorMessageElement.textContent =
                "Неизвестная роль пользователя.";
            }
        }
      } else {
        if (storedUsers.length === 0) {
          window.location.href = "pages/managerPage.html";
        } else {
          if (errorMessageElement) {
            errorMessageElement.textContent =
              "Неправильное имя пользователя или пароль";
          }
        }
      }
    });
  }
});
