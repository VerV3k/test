let titleTag = document.querySelector("head title");
console.log(titleTag.textContent);

const defaultEmployeeUser = [
  {
    id: 1,
    firstName: "Виталий",
    lastName: "Галенко",
    phone: "+7 (977) 549-79-73",
    role: "Главный администратор",
    login: "verve",
    password: "mainadmin",
  },
  {
    id: 253,
    firstName: "Сотрудник",
    lastName: "Первый",
    phone: "+7 (111) 111-11-11",
    role: "Сотрудник",
    login: "111",
    password: "111",
  },
  {
    id: 538,
    firstName: "Сотрудник",
    lastName: "Второй",
    phone: "+7 (222) 222-22-22",
    role: "Сотрудник",
    login: "222",
    password: "222",
  },
  {
    id: 404,
    firstName: "Сотрудник",
    lastName: "Третий",
    phone: "+7 (333) 333-33-33",
    role: "Сотрудник",
    login: "333",
    password: "333",
  },
  {
    id: 470,
    firstName: "Сотрудник",
    lastName: "Четвертый",
    phone: "+7 (444) 444-44-44",
    role: "Сотрудник",
    login: "444",
    password: "444",
  },
];

const saveUsersToLocalStorage = (users) => {
  const existingUsersJSON = localStorage.getItem("users");

  const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

  const uniqueUsers = users.filter(
    (newUser) =>
      !existingUsers.some((existingUser) => existingUser.id === newUser.id)
  );

  if (uniqueUsers.length > 0) {
    const allUsers = [...existingUsers, ...uniqueUsers];
    localStorage.setItem("users", JSON.stringify(allUsers));
    console.log("Пользователи успешно сохранены в localStorage.");
  } else {
    console.log(
      "Все пользователи уже существуют в localStorage и не будут перезаписаны."
    );
  }
};

saveUsersToLocalStorage(defaultEmployeeUser);

console.log(JSON.parse(localStorage.getItem("users")));

// ---------------------------------------------------------------

const generateScheduleIfNeeded = (users, year) => {
  const schedules = JSON.parse(localStorage.getItem("schedules")) || {};

  const monthsToCheck = [10, 11];
  let needsGeneration = false;

  monthsToCheck.forEach((month) => {
    if (!schedules[year] || !schedules[year][month]) {
      needsGeneration = true;
    }
  });

  if (needsGeneration) {
    monthsToCheck.forEach((month) => {
      if (!schedules[year]) schedules[year] = {};
      if (!schedules[year][month]) schedules[year][month] = {};

      const daysInMonth = new Date(year, month, 0).getDate();

      const halfSize = Math.ceil(users.length / 2);
      const group1 = users.slice(0, halfSize);
      const group2 = users.slice(halfSize);

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${String(year).padStart(4, "0")}-${String(
          month
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (!schedules[year][month][dateKey]) {
          schedules[year][month][dateKey] = { user: {} };
        }

        const scheduleDate = new Date(year, month - 1, day);
        let assignedGroup;

        if ((day - 1) % 4 < 2) {
          assignedGroup = group1;
        } else {
          assignedGroup = group2;
        }

        assignedGroup.forEach((user) => {
          let userStatus;

          const currentHourMSK = new Date().getUTCHours() + 3;

          if (scheduleDate < new Date()) {
            userStatus = {
              note: ["дежурство прошло без инцидентов"],
              status: "выполненное",
            };
          } else {
            userStatus = { note: [], status: "будущее" };
          }

          schedules[year][month][dateKey].user[user.id] = userStatus;
        });
      }
    });

    localStorage.setItem("schedules", JSON.stringify(schedules));
    return true;
  }

  return false;
};

const users = [
  {
    id: 1,
    firstName: "Виталий",
    lastName: "Галенко",
    phone: "+7 (977) 549-79-73",
    role: "Главный администратор",
    login: "verve",
    password: "mainadmin",
  },
  {
    id: 253,
    firstName: "Сотрудник",
    lastName: "Первый",
    phone: "+7 (111) 111-11-11",
    role: "Сотрудник",
    login: "111",
    password: "111",
  },
  {
    id: 538,
    firstName: "Сотрудник",
    lastName: "Второй",
    phone: "+7 (222) 222-22-22",
    role: "Сотрудник",
    login: "222",
    password: "222",
  },
  {
    id: 404,
    firstName: "Сотрудник",
    lastName: "Третий",
    phone: "+7 (333) 333-33-33",
    role: "Сотрудник",
    login: "333",
    password: "333",
  },
  {
    id: 470,
    firstName: "Сотрудник",
    lastName: "Четвертый",
    phone: "+7 (444) 444-44-44",
    role: "Сотрудник",
    login: "444",
    password: "444",
  },
  {
    id: 235,
    firstName: "Администратор",
    lastName: "Первый",
    phone: "+7 (222) 222-22-22",
    role: "Администратор",
    login: "www",
    password: "www",
  },
];

const year = new Date().getFullYear();
generateScheduleIfNeeded(users, year);

// --------------------------------------------------------------------------------------------
if (
  titleTag.textContent === "Страница руководителя" ||
  titleTag.textContent === "Страница администратора" ||
  titleTag.textContent === "security system"
) {
  document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector(".add-button");
    const overflowContainer = document.querySelector(".owerflow");
    const closeButton = document.querySelector(".cross");
    const form = document.querySelector(".add-user-form");
    const tableBody = document.querySelector(".table-position");
    const searchInput = document.querySelector(".search input[type='text']");
    const searchButton = document.querySelector(".btn-search");
    const notificationContainer = document.querySelector(
      ".owerflow-complitede"
    );

    const getStoredUsers = () =>
      JSON.parse(localStorage.getItem("users")) || [];

    const saveUserData = (userData) => {
      const storedUsers = getStoredUsers();

      const userExists = storedUsers.some(
        (user) => user.login === userData.login
      );

      if (!userExists) {
        storedUsers.push(userData);
        localStorage.setItem("users", JSON.stringify(storedUsers));
        console.log("Пользователь добавлен:", userData);
      } else {
        console.log("Пользователь уже существует:", userData);
      }
    };

    // const defaultEmployeeUser = {
    //   id: 1,
    //   firstName: "Виталий",
    //   lastName: "Галенко",
    //   phone: "+7 (977) 549-79-73",
    //   role: "Главный администратор",
    //   login: "verve",
    //   password: "mainadmin",
    // };

    // saveUserData(defaultEmployeeUser);

    const notificationText = notificationContainer.querySelector(
      ".completed-chek span"
    );

    const exitCompletedButton =
      notificationContainer.querySelector(".exit-completed");

    let message;
    let editMode = false;
    let currentUserId;

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
        const storedUsers = getStoredUsers();

        // Проверка длины имени и фамилии
        if (firstName.length > 18) {
          showError("firstNameError", "Имя не может превышать 18 символов.");
          return;
        }
        if (lastName.length > 18) {
          showError("lastNameError", "Фамилия не может превышать 18 символов.");
          return;
        }

        // Проверка длины логина и пароля
        if (login.length < 3 || login.length > 18) {
          showError(
            "loginError",
            "Логин должен содержать от 3 до 18 символов."
          );
          return;
        }
        if (password.length < 3 || password.length > 18) {
          showError(
            "passwordError",
            "Пароль должен содержать от 3 до 18 символов."
          );
          return;
        }

        // Проверка уникальности логина
        if (
          storedUsers.some(
            (user) => user.login === login && user.id !== currentUserId
          )
        ) {
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

        const validationResult = validateLoginAndPassword(login, password);
        if (!validationResult.isValid) {
          showError(
            validationResult.errorElementId,
            validationResult.errorMessage
          );
          return;
        }

        if (!phone || phone.length < 18) {
          showError("phoneError", "Пожалуйста, введите полный номер телефона.");
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

    const addToTable = (userData) => {
      const newRow = `<tr class="table-section__tr font-regular" data-id="${
        userData.id
      }">
              <td>${userData.id}</td>
              <td>${userData.firstName}</td>
              <td>${userData.lastName}</td>
              <td>${userData.role}</td>
              <td>${userData.login}</td>
              <td>********</td>
              <td>${userData.phone}</td>
              ${
                userData.role !== "Главный администратор"
                  ? `<td><img src="../icons/edit.svg" alt="изменение" class="edit-button"></td>
                  <td><img src="../icons/delete.svg" alt="удаление" class="delete-button"></td>`
                  : `<td></td><td></td>`
              }
          </tr>`;

      tableBody.insertAdjacentHTML("beforeend", newRow);

      if (userData.role !== "Главный администратор") {
        tableBody
          .querySelector(`tr[data-id="${userData.id}"] .delete-button`)
          .addEventListener("click", () => {
            handleDeleteUser(userData.id);
          });

        tableBody
          .querySelector(`tr[data-id="${userData.id}"] .edit-button`)
          .addEventListener("click", () => {
            editUser(userData.id);
          });
      }
    };

    // Функция для удаления пользователя
    const handleDeleteUser = (id) => {
      deleteUser(id);
      populateTable();
    };
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const roleSelect = document.querySelector("#role");

    if (currentUser && currentUser.role === "Администратор") {
      const adminOption = Array.from(roleSelect.options).find(
        (option) => option.value === "Главный администратор"
      );
      if (adminOption) {
        roleSelect.removeChild(adminOption);
      }
    }
    const deleteUser = (id) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const storedUsers = getStoredUsers();
      const userToDelete = storedUsers.find((user) => user.id === id);

      if (
        currentUser.role !== "Главный администратор" &&
        userToDelete.role === "Главный администратор"
      ) {
        alert("Вы не имеете права удалять главного администратора.");
        return;
      }

      let updatedUsers = storedUsers.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      populateTable();
    };

    const editUser = (userId) => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const storedUsers = getStoredUsers();
      const userToEdit = storedUsers.find((user) => user.id === userId);

      if (
        currentUser.role !== "Главный администратор" &&
        userToEdit.role === "Главный администратор"
      ) {
        alert("Вы не имеете права редактировать главного администратора.");
        return;
      }

      editMode = true;
      currentUserId = userId;
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
    const removeSpaces = (event) => {
      event.target.value = event.target.value.replace(/\s+/g, "");
    };

    document
      .querySelector("#firstName")
      .addEventListener("input", removeSpaces);
    document.querySelector("#lastName").addEventListener("input", removeSpaces);
    document.querySelector("#login").addEventListener("input", removeSpaces);
    document.querySelector("#password").addEventListener("input", removeSpaces);

    const forma = document.querySelector(".add-user-form");

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const allowOnlyRussianLettersInFirstName = (event) => {
      let value = event.target.value.replace(/[^а-яА-ЯёЁ]/g, "");
      event.target.value = capitalizeFirstLetter(value);
    };

    const allowOnlyRussianLettersInLastName = (event) => {
      let value = event.target.value.replace(/[^а-яА-ЯёЁ]/g, "");
      event.target.value = capitalizeFirstLetter(value);
    };

    if (forma) {
      document
        .querySelector("#firstName")
        .addEventListener("input", allowOnlyRussianLettersInFirstName);
      document
        .querySelector("#lastName")
        .addEventListener("input", allowOnlyRussianLettersInLastName);
    }

    const validateLoginAndPassword = (login, password) => {
      if (/.*[а-яА-ЯёЁ].*/.test(login)) {
        return {
          isValid: false,
          errorElementId: "loginError",
          errorMessage: "Логин не должен содержать кириллицу.",
        };
      }
      if (/.*[а-яА-ЯёЁ].*/.test(password)) {
        return {
          isValid: false,
          errorElementId: "passwordError",
          errorMessage: "Пароль не должен содержать кириллицу.",
        };
      }
      return { isValid: true };
    };

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
}
if (titleTag.textContent != "security system") {
  document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".log-out-button");

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
        window.location.href = "../index.html";
      });

      return exitMenu;
    };

    logOutButton.addEventListener("click", () => {
      const header = document.querySelector(".dute__header");
      const exitMenu = createExitMenu();
      header.appendChild(exitMenu);
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const logOutButton = document.querySelector(".log-out-button");
    const userNameSpan = logOutButton.querySelector(".user-name");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && userNameSpan) {
      userNameSpan.textContent = `${
        currentUser.firstName
      } ${currentUser.lastName.charAt(0)}.`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-sign-in");
  const errorMessageElement = document.querySelector(".error-message-log");

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
        localStorage.setItem("currentUser", JSON.stringify(user));

        switch (user.role) {
          case "Администратор":
            window.location.href = "pages/administrator.html";
            break;
          case "Главный администратор":
            window.location.href = "pages/managerPage.html";
            break;
          case "Сотрудник":
            window.location.href = "pages/duty.html";
            break;
          default:
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

if (
  titleTag.textContent === "График" ||
  titleTag.textContent === "Страница руководителя отчеты"
) {
  document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const monthName = today.toLocaleString("ru-RU", { month: "long" });
    const monthElement = document.querySelector(".month");
    if (titleTag.textContent === "График") {
      monthElement.textContent = monthName;
    }

    let systemStatus = "Запрос не возможен";
    let firstDate = null;
    let secondDate = null;

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startDayIndex = firstDayOfMonth.getDay();
    const dayOffset = startDayIndex === 0 ? 6 : startDayIndex - 1;

    const daysInMonth = new Date(year, month, 0).getDate();
    const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();

    const dateElements = document.querySelectorAll(".calendar .date");
    let dateCounter = 1;

    for (let i = 0; i < dateElements.length; i++) {
      if (i >= dayOffset && dateCounter <= daysInMonth) {
        dateElements[i].textContent = dateCounter;
        dateElements[i].classList.remove("empty");
        dateCounter++;
      } else if (i < dayOffset) {
        dateElements[i].textContent = daysInPreviousMonth - dayOffset + i + 1;
        dateElements[i].classList.add("empty");
      } else {
        const nextMonthDayCounter = dateCounter - daysInMonth;
        dateElements[i].textContent = nextMonthDayCounter;
        dateElements[i].classList.add("empty");
        dateCounter++;
      }
    }

    const getStoredUsers = () =>
      JSON.parse(localStorage.getItem("users")) || [];

    const createScheduleIfNotExists = () => {
      const schedules = JSON.parse(localStorage.getItem("schedules")) || {};

      if (!schedules[year]) {
        schedules[year] = {};
      }
      if (!schedules[year][month]) {
        schedules[year][month] = {};
      }

      if (Object.keys(schedules[year][month]).length > 0) {
        console.log(
          `График на ${month}/${year} уже существует. Назначение дежурств не требуется.`
        );
        return false;
      }

      const storedUsers = getStoredUsers();
      const employees = storedUsers.filter((user) => user.role === "Сотрудник");

      const halfSize = Math.ceil(employees.length / 2);
      const group1 = employees.slice(0, halfSize);
      const group2 = employees.slice(halfSize);

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${String(year).padStart(4, "0")}-${String(
          month
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (!schedules[year][month][dateKey]) {
          schedules[year][month][dateKey] = { user: {} };
        }

        const scheduleDate = new Date(year, month - 1, day);
        let assignedGroup;

        if ((day - 1) % 4 < 2) {
          assignedGroup = group1;
        } else {
          assignedGroup = group2;
        }

        assignedGroup.forEach((user) => {
          let userStatus;

          const currentHourMSK = today.getUTCHours() + 3;

          if (scheduleDate.toDateString() === today.toDateString()) {
            if (currentHourMSK >= 8 && currentHourMSK < 20) {
              userStatus = {
                note: ["дежурство проходит без инцидентов"],
                status: "текущее",
              };
            } else if (currentHourMSK === 20 && today.getMinutes() >= 1) {
              userStatus = {
                note: ["дежурство прошло без инцидентов"],
                status: "выполненное",
              };
            } else {
              userStatus = { note: [], status: "будущее" };
            }
          } else if (scheduleDate < today) {
            userStatus = {
              note: ["дежурство прошло без инцидентов"],
              status: "выполненное",
            };
          } else {
            userStatus = { note: [], status: "будущее" };
          }

          schedules[year][month][dateKey].user[user.id] = userStatus;
        });
      }

      localStorage.setItem("schedules", JSON.stringify(schedules));
      return true;
    };

    const updateUserStatuses = () => {
      const schedules = JSON.parse(localStorage.getItem("schedules")) || {};
      const today = new Date();

      for (const date in schedules[year][month]) {
        const dailySchedule = schedules[year][month][date];

        for (const userId in dailySchedule.user) {
          const userStatus = dailySchedule.user[userId];
          const scheduleDate = new Date(date);

          let updatedStatus;

          if (userStatus.status === "Заменено") {
            updatedStatus = { ...userStatus };
          } else {
            const currentHourMSK = today.getUTCHours() + 3;

            if (scheduleDate.toDateString() === today.toDateString()) {
              if (currentHourMSK >= 8 && currentHourMSK < 20) {
                updatedStatus = {
                  note: ["дежурство проходит без инцидентов"],
                  status: "текущее",
                };
              } else if (currentHourMSK === 20 && today.getMinutes() >= 1) {
                updatedStatus = {
                  note: ["дежурство прошло без инцидентов"],
                  status: "выполненное",
                };
              } else {
                updatedStatus = { note: [], status: "будущее" };
              }
            } else if (scheduleDate < today) {
              updatedStatus = {
                note: ["дежурство прошло без инцидентов"],
                status: "выполненное",
              };
            } else {
              updatedStatus = { note: [], status: "будущее" };
            }
          }

          dailySchedule.user[userId] = updatedStatus;
        }
      }

      localStorage.setItem("schedules", JSON.stringify(schedules));
    };

    const highlightUserStatusInCalendar = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      if (!currentUserStr) return;

      const currentUser = JSON.parse(currentUserStr);
      const currentUserId = currentUser.id;

      if (!currentUserId) return;

      const schedules = JSON.parse(localStorage.getItem("schedules")) || {};

      if (!schedules[year] || !schedules[year][month]) return;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${String(year).padStart(4, "0")}-${String(
          month
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (schedules[year][month][dateKey]) {
          const userSchedule =
            schedules[year][month][dateKey].user[currentUserId];

          if (userSchedule) {
            const dateElementIndex = day + dayOffset - 1;

            if (dateElements[dateElementIndex]) {
              switch (userSchedule.status) {
                case "текущее":
                  dateElements[dateElementIndex].classList.add("current");
                  console.log(`Добавлен класс 'current' для ${dateKey}`);
                  break;
                case "выполненное":
                  dateElements[dateElementIndex].classList.add("completed");
                  console.log(`Добавлен класс 'completed' для ${dateKey}`);
                  break;
                case "будущее":
                  dateElements[dateElementIndex].classList.add("future");
                  console.log(`Добавлен класс 'future' для ${dateKey}`);
                  break;
                case "Заменено":
                  dateElements[dateElementIndex].classList.add("replaced");
                  console.log(`Добавлен класс 'replaced' для ${dateKey}`);
                  break;
                case "wait_start_date":
                  dateElements[dateElementIndex].classList.add(
                    "wait_start_date"
                  );
                  console.log(
                    `Добавлен класс 'wait_start_date' для ${dateKey}`
                  );
                  break;
              }
            }
          }
        }
      }
    };

    if (createScheduleIfNotExists()) {
      console.log(`График на ${month}/${year} был создан.`);
    }

    updateUserStatuses();

    highlightUserStatusInCalendar();

    const updateUserStatusToWaitStartDate = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      if (!currentUserStr) return;

      const currentUser = JSON.parse(currentUserStr);
      const currentUserId = currentUser.id;

      if (!currentUserId) return;

      const schedules = JSON.parse(localStorage.getItem("schedules")) || {};
      const waitData = JSON.parse(localStorage.getItem("wait")) || {};

      const excludedDates = new Set();

      for (const dateKey in waitData) {
        if (waitData.hasOwnProperty(dateKey)) {
          const userData = waitData[dateKey].user;
          if (userData.userId === currentUserId) {
            excludedDates.add(userData.firstDate);
            excludedDates.add(userData.secondDate);
          }
        }
      }

      if (!schedules[year] || !schedules[year][month]) return;

      const dateElements = document.querySelectorAll(".calendar .date");

      dateElements.forEach((element) => {
        const dayNumber = parseInt(element.textContent, 10);
        const dateKey = `${String(year).padStart(4, "0")}-${String(
          month
        ).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

        if (excludedDates.has(dateKey)) {
          element.classList.remove("wait_start_date-local");
          element.classList.remove("wait_end_date-local");
          element.classList.add("del-bgc");
        } else {
          element.classList.remove("future");
        }
      });

      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${String(year).padStart(4, "0")}-${String(
          month
        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (schedules[year][month][dateKey]) {
          const userSchedule =
            schedules[year][month][dateKey].user[currentUserId];

          if (excludedDates.has(dateKey)) {
            continue;
          }

          if (userSchedule && userSchedule.status === "будущее") {
            userSchedule.status = "wait_start_date";
            schedules[year][month][dateKey].user[currentUserId] = userSchedule;
          }
        }
      }

      localStorage.setItem("schedules", JSON.stringify(schedules));
    };

    const resetWaitStartDateToFutureClassesOnlyIfSystemStatusIsNotPossible =
      () => {
        if (systemStatus === "Запрос не возможен") {
          dateElements.forEach((dateElement) => {
            const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
              dateElement.textContent
            ).padStart(2, "0")}`;

            firstDate = null;
            secondDate = null;
            if (
              dateElement.classList.contains("wait_start_date") &&
              firstDate !== dateKey
            ) {
              dateElement.classList.remove("wait_start_date");
              dateElement.classList.add("future");
              console.log(
                `Класс 'wait_start_date' заменен на 'future' для даты ${dateElement.textContent}`
              );
            }

            if (dateElement.classList.contains("wait_end_date")) {
              dateElement.classList.remove("wait_end_date");
              console.log(
                `Класс 'wait_end_date' заменен на 'future' для даты ${dateElement.textContent}`
              );
            }
          });
        }
      };

    const editButtonBlockDefault = document.querySelector(
      ".button-block__with-quest-defolt"
    );
    const newButtonBlock = document.querySelector(".new-button-block");

    if (titleTag.textContent === "График") {
      document.querySelector(".edit-btn").addEventListener("click", () => {
        systemStatus = "Запрос возможен";
        console.log(systemStatus);

        updateUserStatusToWaitStartDate();

        highlightUserStatusInCalendar();

        editButtonBlockDefault.style.display = "none";
        newButtonBlock.style.display = "flex";

        const notificationBlock = document.querySelector(".notif-edit");

        notificationBlock.classList.add("show");
        notificationBlock.style.display = "flex";

        setTimeout(() => {
          notificationBlock.classList.remove("show");
          setTimeout(() => {
            notificationBlock.style.display = "flex";
          }, 500);
        }, 3000);
      });
      document.querySelector(".cancel-btn").addEventListener("click", () => {
        editButtonBlockDefault.style.display = "flex";
        newButtonBlock.style.display = "none";

        highlightUserStatusInCalendar();
        displayUserDatesFromLocalStorage();
        const notificationBlock = document.querySelector(".notif-edit");

        notificationBlock.classList.remove("show");

        setTimeout(() => {
          notificationBlock.style.display = "flex";
        }, 500);

        systemStatus = "Запрос не возможен";

        resetWaitStartDateToFutureClassesOnlyIfSystemStatusIsNotPossible();
        firstDate = null;
        secondDate = null;
        console.log(firstDate);
        console.log(systemStatus);
      });
    }

    dateElements.forEach((dateElement) => {
      dateElement.addEventListener("click", () => {
        if (dateElement.classList.contains("wait_start_date")) {
          firstDate = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${dateElement.textContent.padStart(2, "0")}`;
          console.log(`Выбрана дата: ${firstDate}`);

          resetWaitStartDateToFutureClasses();
        }
      });
    });

    dateElements.forEach((dateElement) => {
      dateElement.addEventListener("click", () => {
        if (dateElement.classList.contains("wait_start_date")) {
          firstDate = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${dateElement.textContent.padStart(2, "0")}`;
          console.log(`Выбрана первая дата: ${firstDate}`);

          resetWaitStartDateToFutureClasses();
        } else if (dateElement.classList.contains("wait_end_date")) {
          secondDate = `${year}-${String(month).padStart(
            2,
            "0"
          )}-${dateElement.textContent.padStart(2, "0")}`;
          console.log(`Выбрана вторая дата: ${secondDate}`);

          dateElement.classList.add("wait_end_date");
          dateElement.classList.remove("future");

          resetWaitEndDates();
        }
      });
    });

    const resetWaitEndDates = () => {
      dateElements.forEach((dateElement) => {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
          dateElement.textContent
        ).padStart(2, "0")}`;

        if (
          dateElement.classList.contains("wait_end_date") &&
          secondDate !== dateKey
        ) {
          dateElement.classList.remove("wait_end_date");
          dateElement.classList.remove("future");
        }
      });
    };

    const resetWaitStartDateToFutureClasses = () => {
      dateElements.forEach((dateElement) => {
        const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
          dateElement.textContent
        ).padStart(2, "0")}`;

        if (
          dateElement.classList.contains("wait_start_date") &&
          firstDate !== dateKey
        ) {
          dateElement.classList.remove("wait_start_date");
          dateElement.classList.remove("future");
          console.log(
            `Класс 'wait_start_date' заменен на 'future' для даты ${dateElement.textContent}`
          );

          const schedules = JSON.parse(localStorage.getItem("schedules")) || {};
          const currentUserStr = localStorage.getItem("currentUser");

          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const currentUserId = currentUser.id;

            console.log("Текущий пользователь:", currentUser);
            console.log("ID текущего пользователя:", currentUserId);

            if (!schedules[year]) {
              console.log(`Нет расписания для года ${year}`);
              return;
            }
            if (!schedules[year][month]) {
              console.log(`Нет расписания для месяца ${month}`);
              return;
            }

            const today = new Date();
            const fourteenDaysFromNow = new Date(today);
            fourteenDaysFromNow.setDate(today.getDate() + 14);
            dateElements.forEach((dateElement) => {
              const day = parseInt(dateElement.textContent, 10);
              const dateKey = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const userSchedule = schedules[year][month][dateKey];

              console.log(`Расписание на ${dateKey}:`, userSchedule);

              const scheduleDate = new Date(year, month - 1, day);

              if (scheduleDate > fourteenDaysFromNow) {
                console.log(
                  `Дата ${dateKey} превышает предел в 14 дней и будет пропущена.`
                );
                return;
              }

              if (
                !dateElement.classList.contains("empty") &&
                (!userSchedule ||
                  !userSchedule.user ||
                  !userSchedule.user[currentUserId])
              ) {
                dateElement.classList.add("wait_end_date");
                console.log(
                  `Класс 'wait_end_date' добавлен для даты ${dateElement.textContent}`
                );
              } else {
                console.log(
                  `Пользователь ${currentUserId} найден в расписании на ${dateKey} или дата пустая.`
                );
              }
            });
          } else {
            console.log("Текущий пользователь не найден в localStorage.");
          }
        }
      });
    };

    const submitButton = document.querySelector(".submit-btn");

    if (titleTag.textContent === "График") {
      submitButton.addEventListener("click", () => {
        if (firstDate === null || secondDate === null) {
          const notificationBlock = document.querySelector(".notif-edit");

          notificationBlock.classList.add("show");
          notificationBlock.style.display = "flex";

          setTimeout(() => {
            notificationBlock.classList.remove("show");
            setTimeout(() => {
              notificationBlock.style.display = "flex";
            }, 500);
          }, 3000);
        }

        if (firstDate !== null && secondDate !== null) {
          const currentUserStr = localStorage.getItem("currentUser");
          let currentUserId = null;

          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            currentUserId = currentUser.id;
          }

          const now = new Date();
          const requestDateKey = `${
            now.getMonth() + 1
          }-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
          const waitData = JSON.parse(localStorage.getItem("wait")) || {};

          waitData[requestDateKey] = {
            user: {
              userId: currentUserId,
              firstDate: firstDate,
              secondDate: secondDate,
            },
            replacedUserId: null,
            statusWait: "ожидание",
          };

          localStorage.setItem("wait", JSON.stringify(waitData));

          systemStatus = "Запрос отправлен";
          console.log(`Статус системы изменен на: ${systemStatus}`);
          showCompletionWindow();
        }
      });
    }

    const showCompletionWindow = () => {
      const completionWindow = document.createElement("div");
      completionWindow.className = "owerflow-complitede";
      completionWindow.style.display = "flex";
      completionWindow.innerHTML = `
          <div class="completed-wrapper font-regular-menu">
              <span class="exit-completed"><img src="../icons/krest.svg" alt="cross"></span>
              <div class="completed-chek" style="gap: 30px;margin: auto;">
                  <span>Запрос отправлен</span>
                  <span><img src="../icons/checkbox.svg" alt="" style></span>
              </div>
          </div>
      `;

      const calendarBlock = document.querySelector(".calendar-block");

      calendarBlock.appendChild(completionWindow);

      const exitButton = completionWindow.querySelector(".exit-completed");
      exitButton.addEventListener("click", () => {
        calendarBlock.removeChild(completionWindow);
        systemStatus = "Запрос не возможен";
        newButtonBlock.style.display = "none";
        editButtonBlockDefault.style.display = "flex";
        location.reload();
      });

      setTimeout(() => {
        if (document.body.contains(completionWindow)) {
          calendarBlock.removeChild(completionWindow);
          systemStatus = "Запрос не возможен";
          console.log(`Статус системы изменен на: ${systemStatus}`);
          newButtonBlock.style.display = "none";
          editButtonBlockDefault.style.display = "flex";
          location.reload();
        }
      }, 3000);
    };

    const displayUserDatesFromLocalStorage = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      let currentUserId = null;

      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUserId = currentUser.id;
      }

      const waitData = JSON.parse(localStorage.getItem("wait"));

      if (waitData && currentUserId !== null) {
        for (const dateKey in waitData) {
          if (waitData.hasOwnProperty(dateKey)) {
            const userData = waitData[dateKey].user;

            if (userData.userId === currentUserId) {
              const firstDate = userData.firstDate;
              const secondDate = userData.secondDate;

              const firstDateDay = new Date(firstDate).getDate();
              const secondDateDay = new Date(secondDate).getDate();

              const dateElements = document.querySelectorAll(".calendar .date");

              dateElements.forEach((dateElement) => {
                const dayNumber = parseInt(dateElement.textContent, 10);

                if (!dateElement.classList.contains("empty")) {
                  if (dayNumber === firstDateDay) {
                    dateElement.classList.add("wait_start_date-local");
                    dateElement.classList.remove("del-bgc");
                  } else if (dayNumber === secondDateDay) {
                    dateElement.classList.add("wait_end_date-local");
                    dateElement.classList.remove("del-bgc");
                  }
                }
              });
            }
          }
        }
      } else {
        console.warn("Нет данных о пользователе или объект wait не найден.");
      }
    };
    displayUserDatesFromLocalStorage();

    const removeCurrentDateFromWait = () => {
      const currentUserStr = localStorage.getItem("currentUser");
      let currentUserId = null;

      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        currentUserId = currentUser.id;
      }

      const today = new Date();
      const todayKey = today.toISOString().split("T")[0];

      const waitData = JSON.parse(localStorage.getItem("wait")) || {};

      if (waitData && currentUserId !== null) {
        let dateFound = false;

        for (const key in waitData) {
          if (waitData.hasOwnProperty(key)) {
            const userData = waitData[key].user;

            if (userData && userData.userId === currentUserId) {
              if (
                userData.firstDate === todayKey ||
                userData.secondDate === todayKey
              ) {
                delete waitData[key];
                dateFound = true;
                console.log(
                  `Объект с ключом ${key} удален из wait для пользователя ${currentUserId}.`
                );
              }
            }
          }
        }

        if (!dateFound) {
          console.log(
            `Нет записей для удаления для пользователя ${currentUserId} на дату ${todayKey}.`
          );
        }

        localStorage.setItem("wait", JSON.stringify(waitData));
      } else {
        console.warn("Нет данных о пользователе или объект wait не найден.");
      }
    };

    removeCurrentDateFromWait();

    const addRecordNode = document.querySelector(".node");
    const overflowNode = document.querySelector(".owerflow-node");
    const crossIcon = document.querySelector(".cross");
    const form = document.querySelector(".add-user-form");
    const inputField = document.querySelector(".node-input");
    let records = [];

    const currentUserStr = localStorage.getItem("currentUser");
    let currentUserId = null;

    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      currentUserId = currentUser.id;
    }

    const schedules = JSON.parse(localStorage.getItem("schedules")) || {};
    let isCurrentStatus = false;

    for (const year in schedules) {
      for (const month in schedules[year]) {
        for (const dateKey in schedules[year][month]) {
          const userSchedule =
            schedules[year][month][dateKey].user[currentUserId];
          if (userSchedule && userSchedule.status === "текущее") {
            isCurrentStatus = true;
            break;
          }
        }
        if (isCurrentStatus) break;
      }
      if (isCurrentStatus) break;
    }

    if (titleTag.textContent === "График") {
      addRecordNode.addEventListener("click", () => {
        if (isCurrentStatus) {
          overflowNode.style.display = "block";
          inputField.value = "";
          inputField.focus();
        } else {
          const completionWindow = document.createElement("div");
          completionWindow.className = "owerflow-complitede";
          completionWindow.style.display = "flex";
          completionWindow.innerHTML = `
                  <div class="completed-wrapper font-regular-menu">
                      <span class="exit-completed"><img src="../icons/krest.svg" alt="cross"></span>
                      <div class="completed-chek" style="gap: 30px">
                          <span>Для добавления записи необходимо быть на дежурстве</span>
                      </div>
                  </div>
              `;

          const calendarBlock = document.querySelector(".calendar-block");

          calendarBlock.appendChild(completionWindow);

          const exitCompletedButton =
            completionWindow.querySelector(".exit-completed");
          exitCompletedButton.addEventListener("click", () => {
            calendarBlock.removeChild(completionWindow);
          });
        }
      });

      crossIcon.addEventListener("click", () => {
        overflowNode.style.display = "none";
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const inputValue = inputField.value.trim();

        if (inputValue) {
          records.push(inputValue);
          console.log("Запись добавлена:", inputValue);
          console.log("Все записи:", records);

          const notesData = JSON.parse(localStorage.getItem("notesData")) || {};

          const today = new Date();
          const todayKey = today.toISOString().split("T")[0];

          if (!notesData[todayKey]) {
            notesData[todayKey] = { user: {} };
          }

          if (!notesData[todayKey].user[currentUserId]) {
            notesData[todayKey].user[currentUserId] = { note: [] };
          }

          notesData[todayKey].user[currentUserId].note.push(inputValue);

          localStorage.setItem("notesData", JSON.stringify(notesData));

          inputField.value = "";
          overflowNode.style.display = "none";
        } else {
          alert("Пожалуйста, введите подробности об инциденте.");
        }
      });
    }
  });
}

if (titleTag.textContent === "Страница администратора Редактирование графика") {
  const waitData = JSON.parse(localStorage.getItem("wait"));
  const usersData = JSON.parse(localStorage.getItem("users"));
  const schedulesData = JSON.parse(localStorage.getItem("schedules"));
  const confirmData = JSON.parse(localStorage.getItem("confirm")) || {};

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", options);
  };

  if (waitData && usersData && schedulesData) {
    let hasRequests = false;

    for (const key in waitData) {
      if (waitData.hasOwnProperty(key)) {
        const entry = waitData[key];

        if (entry.statusWait === "ожидание") {
          hasRequests = true;
          const userId = entry.user.userId;
          const firstDate = entry.user.firstDate.split("T")[0];
          const secondDate = entry.user.secondDate.split("T")[0];

          const user = usersData.find((u) => u.id === userId);
          if (user) {
            const formattedName = `${user.lastName} ${user.firstName.charAt(
              0
            )}.`;
            const editBlock = document.createElement("div");
            editBlock.classList.add("edit");

            editBlock.innerHTML = `
              <div class="edit-block font-regular-white">
                <div class="edit-request">Запрос на изменение графика от:</div>
                <div class="name-user">
                  <span class="formatted-name">${formattedName}</span>
                  <span class="first-date">заменить дежурство ${formatDate(
                    entry.user.firstDate
                  )} на </span>
                  <span class="two-date">${formatDate(
                    entry.user.secondDate
                  )}</span>
                </div>
              </div>
              <div>
                <button class="edit-block-button font-bold">Внести изменения</button>
              </div>
              <div class="owerflow-edit" style="display: none;">
                <div class="user-form-container-edit">
                  <span class="cross"><img src="../icons/krest.svg" alt="cross"></span>
                  <span class="font-medium-24px position-text-edit ">Изменение графика с ${formatDate(
                    entry.user.firstDate
                  )} на <span class="two-date">${formatDate(
              entry.user.secondDate
            )}</span></span>
                  <span class="position-text-edit-n ">Выберите возможного сотрудника для замены:</span>
                  <form class="add-user-form font-bold">
                    <div class="input-container-edit">
                      <label for="">
                        <select name="edit-input" id="" class="edit-input"></select>
                      </label>
                      <img src="../icons/arrowSelect.svg" alt="" class="edit-arow">
                      <button type="submit" class="edit-button-acc font-medium-white">Добавить запись</button>
                    </div>
                  </form>
                </div>
              </div>
            `;

            const selectElement = editBlock.querySelector(".edit-input");
            const dateKey = entry.user.secondDate.split("T")[0];
            const yearKey = new Date(entry.user.secondDate).getFullYear();
            const monthKey = new Date(entry.user.secondDate).getMonth() + 1;

            if (
              schedulesData[yearKey] &&
              schedulesData[yearKey][monthKey] &&
              schedulesData[yearKey][monthKey][dateKey]
            ) {
              const usersOnDate =
                schedulesData[yearKey][monthKey][dateKey].user;

              for (const userId in usersOnDate) {
                if (usersOnDate.hasOwnProperty(userId)) {
                  const option = document.createElement("option");
                  option.value = userId;
                  const userDetails = usersData.find(
                    (u) => u.id === parseInt(userId)
                  );

                  if (userDetails) {
                    option.textContent = `${userDetails.lastName} ${userDetails.firstName}`;
                  } else {
                    option.textContent = `Пользователь ${userId}`;
                  }

                  selectElement.appendChild(option);
                }
              }
            }

            editBlock
              .querySelector(".add-user-form")
              .addEventListener("submit", (event) => {
                event.preventDefault();
                const selectedUserId = selectElement.value;

                if (!selectedUserId) {
                  alert("Пожалуйста, выберите пользователя.");
                  return;
                }

                delete schedulesData[yearKey][monthKey][dateKey].user[
                  selectedUserId
                ];

                if (schedulesData[yearKey][monthKey][firstDate]?.user[userId]) {
                  schedulesData[yearKey][monthKey][firstDate].user[
                    userId
                  ].status = "Заменено";
                }

                if (!schedulesData[yearKey][monthKey][firstDate]) {
                  schedulesData[yearKey][monthKey][firstDate] = { user: {} };
                }

                schedulesData[yearKey][monthKey][firstDate].user[
                  selectedUserId
                ] = {
                  note: [],
                  status: "будущее",
                };

                confirmData[key] = {
                  ...entry,
                  statusWait: "Изменено",
                  replacedUserId: selectedUserId,
                };

                delete waitData[key];

                localStorage.setItem(
                  "schedules",
                  JSON.stringify(schedulesData)
                );
                localStorage.setItem("wait", JSON.stringify(waitData));
                localStorage.setItem("confirm", JSON.stringify(confirmData));

                alert(
                  `Пользователь с ID ${selectedUserId} удален из ${formatDate(
                    entry.user.secondDate
                  )} и перемещен на ${formatDate(
                    firstDate
                  )} со статусом "будущее".`
                );

                location.reload();
              });

            editBlock
              .querySelector(".edit-block-button")
              .addEventListener("click", () => {
                const overflowEdit = editBlock.querySelector(".owerflow-edit");
                overflowEdit.style.display = "block";
                overflowEdit.querySelector(".two-date").textContent =
                  formatDate(entry.user.secondDate);
              });

            editBlock.querySelector(".cross").addEventListener("click", () => {
              const overflowEdit = editBlock.querySelector(".owerflow-edit");
              overflowEdit.style.display = "none";
            });

            document.querySelector(".request").appendChild(editBlock);
          }
        }
      }




    }

    if (!hasRequests) {
      const noRequestsMessage = document.createElement("div");
      noRequestsMessage.classList.add("no-requests-message");
      noRequestsMessage.textContent = "Запросов на изменение нет.";
      document.querySelector(".request").appendChild(noRequestsMessage);
    }
  }
}

if (
  titleTag.textContent === "График" ||
  titleTag.textContent === "Отчет прошедших дежурств"
) {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", options);
  };

  const confirmData = JSON.parse(localStorage.getItem("confirm")) || {};
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    const currentUserId = currentUser.id;

    for (const key in confirmData) {
      if (confirmData.hasOwnProperty(key)) {
        const entry = confirmData[key];

        // Получаем дату отправки в формате Date
        const firstDate = new Date(entry.user.firstDate);
        const secondDate = new Date(entry.user.secondDate);

        // Получаем текущую дату
        const currentDate = new Date();

        // Проверяем, прошло ли больше 24 часов с первой даты
        const oneDayInMillis = 24 * 60 * 60 * 1000; // Миллисекунды в одном дне
        const isExpired = currentDate - firstDate > oneDayInMillis;

        // Если уведомление не истекло, показываем его
        if (!isExpired) {
          const firstUserId = entry.user.userId;
          const secondUserId = entry.replacedUserId;

          let notificationMessage; // Переменная для хранения уведомления

          if (Number(firstUserId) === currentUserId) {
            notificationMessage = `
              <span>Дежурство заменено с ${formatDate(
                entry.user.firstDate
              )} на ${formatDate(entry.user.secondDate)}</span>
            `;
          }

          if (String(secondUserId) === String(currentUserId)) {
            notificationMessage = `
              <span>Вы были заменены в дежурстве с ${formatDate(
                entry.user.secondDate
              )} на ${formatDate(entry.user.firstDate)}.</span>
            `;
          }
        }
      }
    }
  } else {
    console.warn("Текущий пользователь не найден в localStorage.");
  }
}

// Функция для форматирования даты
const formatDate = (dateString) => {
  const options = { day: "numeric", month: "long" }; // Форматируем как "11 ноября"
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", options);
};

// Проверка заголовка страницы
if (
  titleTag.textContent === "Страница администратора Редактирование графика" ||
  titleTag.textContent === "Страница администратора" ||
  titleTag.textContent === "Страница руководителя"
) {
  const waitData = JSON.parse(localStorage.getItem("wait")) || {};

  // Проверяем наличие новых запросов
  if (Object.keys(waitData).length > 0) {
    // Проверяем, было ли уже создано уведомление
    const existingNotification = document.querySelector(
      ".notification-new-requests"
    );

    if (!existingNotification) {
      // Если уведомление еще не добавлено
      const notificationMessage = document.createElement("div");
      notificationMessage.classList.add("notification-new-requests"); // Добавляем класс для идентификации
      notificationMessage.innerHTML = `
        <span>Появились новые запросы на изменение графика.</span>
      `;
      document.querySelector(".notifications").appendChild(notificationMessage);
    }
  }
}

// Проверка заголовка страницы для уведомлений о замене
if (
  titleTag.textContent === "График" ||
  titleTag.textContent === "Отчет прошедших дежурств"
) {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", options);
  };

  const confirmData = JSON.parse(localStorage.getItem("confirm")) || {};
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    const currentUserId = currentUser.id;
    const notificationsSet = new Set(); // Множество для хранения уникальных уведомлений

    for (const key in confirmData) {
      if (confirmData.hasOwnProperty(key)) {
        const entry = confirmData[key];

        // Получаем дату отправки в формате Date
        const firstDate = new Date(entry.user.firstDate);
        const secondDate = new Date(entry.user.secondDate);

        // Получаем текущую дату
        const currentDate = new Date();

        // Проверяем, прошло ли больше 24 часов с первой даты
        const oneDayInMillis = 24 * 60 * 60 * 1000; // Миллисекунды в одном дне
        const isExpired = currentDate - firstDate > oneDayInMillis;

        // Если уведомление не истекло, показываем его
        if (!isExpired) {
          const firstUserId = entry.user.userId;
          const secondUserId = entry.replacedUserId;

          let notificationMessage; // Переменная для хранения уведомления

          if (Number(firstUserId) === currentUserId) {
            notificationMessage = `
              <span>Дежурство заменено с ${formatDate(
                entry.user.firstDate
              )} на ${formatDate(entry.user.secondDate)}</span>
            `;
          }

          if (String(secondUserId) === String(currentUserId)) {
            notificationMessage = `
              <span>Вы были заменены в дежурстве с ${formatDate(
                entry.user.secondDate
              )} на ${formatDate(entry.user.firstDate)}.</span>
            `;
          }

          // Если уведомление было создано и его еще нет в множестве, добавляем его в DOM
          if (
            notificationMessage &&
            !notificationsSet.has(notificationMessage)
          ) {
            // Добавляем уведомление в множество

            const notificationElement = document.createElement("div");
            notificationElement.innerHTML = notificationMessage;
            document
              .querySelector(".notifications")
              .appendChild(notificationElement);

            // Удаляем уведомление через 30 секунд
            setTimeout(() => {
              notificationElement.remove(); // Удаляем элемент из DOM
            }, 30000); // 30000 миллисекунд = 30 секунд
          }
        }
      }
    }
  }
}

//------------------------------------------------------------------------------------------

if (titleTag.textContent === "Отчет прошедших дежурств") {
  const ctx = document.querySelector(".myPieChart").getContext("2d");

  // Задайте userId вручную
  const currentUserData = localStorage.getItem("currentUser");

  // Проверяем, есть ли данные и парсим их
  const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

  // Извлекаем userId, если текущий пользователь существует
  const userId = currentUser ? currentUser.id : null;

  const schedules = JSON.parse(localStorage.getItem("schedules"));

  const storedNotesData = localStorage.getItem("notesData");

  // Проверяем, есть ли данные и парсим их
  const notesData = storedNotesData ? JSON.parse(storedNotesData) : {};

  // Создаем объект для хранения заметок конкретного пользователя
  const userNotesData = {};

  // Проходим по всем записям в notesData
  for (const date in notesData) {
    if (notesData.hasOwnProperty(date)) {
      const userNotes = notesData[date].user;

      // Проверяем, есть ли заметки для данного userId
      if (userNotes && userNotes[userId]) {
        // Если заметки есть, добавляем их в объект userNotesData
        userNotesData[date] = {
          user: {
            [userId]: userNotes[userId],
          },
        };
      }
    }
  }

  let completedCount = 0;
  let replacedCount = 0;
  let futureCount = 0;

  const reportYear = 2024;
  let reportMonth = "12";

  let myPieChart;

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  let currentPage = 1;
  const itemsPerPage = 4;

  let dutyCardsArray = [];

  const updateChart = () => {
    completedCount = 0;
    replacedCount = 0;
    futureCount = 0;

    const now = new Date();
    const currentDateString = now.toISOString().split("T")[0];

    if (schedules[reportYear] && schedules[reportYear][reportMonth]) {
      const monthSchedules = schedules[reportYear][reportMonth];

      for (const day in monthSchedules) {
        const userSchedule = monthSchedules[day].user;

        if (userSchedule[userId]) {
          const status = userSchedule[userId].status;

          if (status === "выполненное") {
            completedCount++;
          } else if (status === "Заменено") {
            replacedCount++;
          }
        }
      }

      for (const day in monthSchedules) {
        if (day > currentDateString) {
          const userSchedule = monthSchedules[day].user;

          if (userSchedule[userId]) {
            const status = userSchedule[userId].status;

            if (status !== "выполненное") {
              futureCount++;
            }
          }
        }
      }
    }

    let data = [completedCount, replacedCount, futureCount];

    const createGradient = (color) => {
      const gradient = ctx.createRadialGradient(100, 100, 0, 110, 120, 90);
      gradient.addColorStop(0, "rgba(128, 128, 128, 0.5)");
      gradient.addColorStop(1, color);
      return gradient;
    };

    if (myPieChart) {
      myPieChart.destroy();
    }

    myPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            label: "Мои данные",
            data: data,
            backgroundColor: [
              createGradient("#77C375"),
              createGradient("#D05AFF"),
              createGradient("#CACE00"),
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "50%",
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });

    const selectedMonthName = monthNames[parseInt(reportMonth) - 1];

    const monthGoElement = document.querySelector(".mounth-go");
    if (monthGoElement) {
      monthGoElement.textContent = ` ${selectedMonthName} ${reportYear}`;
    }
  };

  updateChart();

  const calendarIcon = document.getElementById("calendar-icon");
  const monthDropdown = document.getElementById("month-dropdown");

  calendarIcon.addEventListener("click", () => {
    monthDropdown.style.display =
      monthDropdown.style.display === "block" ? "none" : "block";
  });

  const monthItems = monthDropdown.querySelectorAll("li");

  monthItems.forEach((item) => {
    item.addEventListener("click", () => {
      reportMonth = item.getAttribute("data-month");
      console.log(`Выбран месяц: ${reportMonth}`);

      updateChart();

      monthDropdown.style.display = "none";

      generateDutyCardsForCurrentUser();
    });
  });

  document.addEventListener("click", (event) => {
    if (
      !calendarIcon.contains(event.target) &&
      !monthDropdown.contains(event.target)
    ) {
      monthDropdown.style.display = "none";
    }
  });

  const generateDutyCardsForCurrentUser = () => {
    if (schedules[reportYear] && schedules[reportYear][reportMonth]) {
      const monthSchedules = schedules[reportYear][reportMonth];

      const mainContainer = document.querySelector(".fake-main");
      mainContainer.innerHTML = "";

      dutyCardsArray = [];

      for (const day in monthSchedules) {
        const userSchedule = monthSchedules[day].user;

        if (userSchedule[userId]) {
          // Используем заданный userId
          const dutyData = userSchedule[userId];

          const notesForDay =
            notesData[day] &&
            notesData[day].user[userId] &&
            notesData[day].user[userId].note
              ? notesData[day].user[userId].note.join(", ")
              : "Нет записей";

          const dutyCardHTML = `
                    <div class="past font-regular">
                        <div class="past-block">
                            <div class="past-block__history">
                                <div><span>Дежурство: </span><span class="duty-date">${parseInt(
                                  day.split("-")[2]
                                )} ${
            monthNames[parseInt(reportMonth) - 1]
          }</span></div>
                                <div><span>Время дежурства: </span><span>${
                                  dutyData.time || "8:00 - 20:00"
                                }</span></div>
                                <div><span>Статус: </span><span class="duty-status">${
                                  dutyData.status
                                }</span></div>
                            </div>
                            <div class="button-open">
                                <button class="past-block__history-button font-bold-white">Подробности дежурств</button>
                            </div>
                        </div>
                        <div class="discription close">
                            <div class="discription-text font-regular-white">
                                <span>Записи: </span><span class="duty-notes">${notesForDay}</span></div>
                            <div class="discription-button__block">
                                <button class="discription-button font-bold">Свернуть</button>
                            </div>
                        </div>
                    </div>`;

          dutyCardsArray.push(dutyCardHTML);
        }
      }

      mainContainer.innerHTML = dutyCardsArray.join("");

      displayDutyCards(dutyCardsArray);

      setupPagination(dutyCardsArray.length);
    }
  };

  const displayDutyCards = (cardsArray) => {
    const mainContainer = document.querySelector(".fake-main");

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    mainContainer.innerHTML = "";

    cardsArray.slice(startIndex, endIndex).forEach((cardHTML) => {
      mainContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

    attachAccordionFunctionality();
  };

  const setupPagination = (totalCards) => {
    const paginationContainer = document.querySelector(".nav-number");

    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(totalCards / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageSpan = document.createElement("span");
      pageSpan.textContent = i;

      if (i === currentPage) {
        pageSpan.classList.add("active");
      }

      pageSpan.addEventListener("click", () => {
        currentPage = i;
        displayDutyCards(dutyCardsArray);
        setupPagination(totalCards);
      });

      paginationContainer.appendChild(pageSpan);
    }
  };

  const attachAccordionFunctionality = () => {
    const detailButtons = document.querySelectorAll(
      ".past-block__history-button"
    );

    detailButtons.forEach((detailButton) => {
      detailButton.addEventListener("click", () => {
        const descriptionBlock = detailButton
          .closest(".past")
          .querySelector(".discription");
        descriptionBlock.classList.toggle("close");
        detailButton.classList.toggle("close");
      });
    });

    const collapseButtons = document.querySelectorAll(".discription-button");

    collapseButtons.forEach((collapseButton) => {
      collapseButton.addEventListener("click", () => {
        const descriptionBlock = collapseButton.closest(".discription");
        descriptionBlock.classList.add("close");
        collapseButton
          .closest(".past")
          .querySelector(".past-block__history-button")
          .classList.remove("close");
      });
    });
  };

  generateDutyCardsForCurrentUser();
}
// --------------------------------------------------------------------

// if (titleTag.textContent === "Страница руководителя отчеты") {
// // Получаем данные пользователей из localStorage
// const users = JSON.parse(localStorage.getItem("users")) || [];

// // Проверяем, соответствует ли заголовок страницы нужному значению
// const titleTag = document.querySelector("title"); // Или используйте другой селектор, если необходимо
// if (titleTag.textContent === "Страница руководителя отчеты") {
//     const reportContainer = document.querySelector(".report"); // Контейнер для карточек

//     // Очищаем контейнер перед добавлением новых карточек
//     reportContainer.innerHTML = "";

//     // Фильтруем пользователей с ролью "Сотрудник"
//     const employees = users.filter(user => user.role === "Сотрудник");

//     // Генерируем карточки для каждого сотрудника
//     employees.forEach(employee => {
//         const cardHTML = `
//             <div class="report-block">
//                 <span>${employee.firstName} ${employee.lastName} <span>${employee.id}</span></span>
//                 <div class="report-block__user">
//                     <span>Сводка о пользователе</span>
//                     <span><img src="../icons/Arrowundblack.png" alt=""></span>
//                 </div>
//             </div>`;

//         // Добавляем карточку в контейнер
//         reportContainer.innerHTML += cardHTML;
//     });
// }
// }
if (titleTag.textContent === "Страница руководителя отчеты") {
  // Создаем график и добавляем его в конец report-foter
  const createReportUser = (user) => {
    const createGraphBlock = () => {
      const graphBlockHTML = `
        <div class="graf-block-manager">
          <div class="main-history__duty font-regular">
            <div class="">
              <img src="../icons/calendar.png" alt="календарь" id="calendar-icon" style="cursor:pointer;">
            </div>
            <div class="month-dropdown" id="month-dropdown">
              <ul>
                <li data-month="01">Январь</li>
                <li data-month="02">Февраль</li>
                <li data-month="03">Март</li>
                <li data-month="04">Апрель</li>
                <li data-month="05">Май</li>
                <li data-month="06">Июнь</li>
                <li data-month="07">Июль</li>
                <li data-month="08">Август</li>
                <li data-month="09">Сентябрь</li>
                <li data-month="10">Октябрь</li>
                <li data-month="11">Ноябрь</li>
                <li data-month="12">Декабрь</li>
              </ul>
            </div>
            <div class="short-state">
              <div class="short-state__text"><span>Краткая сводка за</span><span class="mounth-go"></span></div>
            </div>
          </div>
          <div class="open-graf">
            <div class="open-graf__align-items font-regular-white">
              <div class="open-graf__align-span">
                <span><img src="../icons/EllipseGreen.png" alt="" style="width: 22px;height: 22px;"></span> 
                <span>- Число выполненых дежурств</span>
              </div>
              <div class="open-graf__align-span">
                <span><img src="../icons/EllipseYellow.png" alt="" style="width: 22px;height: 22px;"></span> 
                <span>- Число запланированных дежурств</span>
              </div>
              <div class="open-graf__align-span">
                <span><img src="../icons/EllipsePurple.png" alt="" style="width: 22px;height: 22px;"></span> 
                <span>- Число замененных дежурств</span>
              </div>
            </div>
            <div class="chart">
              <div>
                <canvas class="myPieChart" width="232" height="232"></canvas>
              </div>
              <div class="font-regular-white"><span> </span><span></span></div>
            </div>
          </div>
        </div>
        <div class="fake-main-s"></div>
        <div class="nav-number" style="color: #000;margin-left: 350px;"> <span
                            class="active">1</span><span>2</span><span>3</span><span>4</span>
                    </div>
        `;

      const reportFooter = document.querySelector(".report-foter");
      reportFooter.insertAdjacentHTML("beforeend", graphBlockHTML);
    };

    createGraphBlock(); // Вызов функции для создания и добавления графика

    const ctx = document.querySelector(".myPieChart").getContext("2d");

    // Задайте userId вручную

    // Задайте userId вручную
    const userId = user; // Замените на нужный вам ID пользователя

    // Получаем данные о заметках из localStorage
    const storedNotesData = localStorage.getItem("notesData");

    // Проверяем, есть ли данные и парсим их
    const notesData = storedNotesData ? JSON.parse(storedNotesData) : {};

    // Создаем объект для хранения заметок конкретного пользователя
    const userNotesData = {};

    // Проходим по всем записям в notesData
    for (const date in notesData) {
      if (notesData.hasOwnProperty(date)) {
        const userNotes = notesData[date].user;

        // Проверяем, есть ли заметки для данного userId
        if (userNotes && userNotes[userId]) {
          // Если заметки есть, добавляем их в объект userNotesData
          userNotesData[date] = {
            user: {
              [userId]: userNotes[userId],
            },
          };
        }
      }
    }

    // Теперь у вас есть объект userNotesData, содержащий только заметки для указанного пользователя
    console.log(userNotesData);

    const schedules = JSON.parse(localStorage.getItem("schedules"));

    let completedCount = 0;
    let replacedCount = 0;
    let futureCount = 0;

    const reportYear = 2024;
    let reportMonth = "12";

    let myPieChart;

    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];

    let currentPage = 1;
    const itemsPerPage = 4;

    let dutyCardsArray = [];

    const updateChart = () => {
      completedCount = 0;
      replacedCount = 0;
      futureCount = 0;

      const now = new Date();
      const currentDateString = now.toISOString().split("T")[0];

      if (schedules[reportYear] && schedules[reportYear][reportMonth]) {
        const monthSchedules = schedules[reportYear][reportMonth];

        for (const day in monthSchedules) {
          const userSchedule = monthSchedules[day].user;

          if (userSchedule[userId]) {
            const status = userSchedule[userId].status;

            if (status === "выполненное") {
              completedCount++;
            } else if (status === "Заменено") {
              replacedCount++;
            }
          }
        }

        for (const day in monthSchedules) {
          if (day > currentDateString) {
            const userSchedule = monthSchedules[day].user;

            if (userSchedule[userId]) {
              const status = userSchedule[userId].status;

              if (status !== "выполненное") {
                futureCount++;
              }
            }
          }
        }
      }

      let data = [completedCount, replacedCount, futureCount];

      const createGradient = (color) => {
        const gradient = ctx.createRadialGradient(100, 100, 0, 110, 120, 90);
        gradient.addColorStop(0, "rgba(128, 128, 128, 0.5)");
        gradient.addColorStop(1, color);
        return gradient;
      };

      if (myPieChart) {
        myPieChart.destroy();
      }

      myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          datasets: [
            {
              label: "Мои данные",
              data: data,
              backgroundColor: [
                createGradient("#77C375"),
                createGradient("#D05AFF"),
                createGradient("#CACE00"),
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "50%",
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });

      const selectedMonthName = monthNames[parseInt(reportMonth) - 1];

      const monthGoElement = document.querySelector(".mounth-go");
      if (monthGoElement) {
        monthGoElement.textContent = ` ${selectedMonthName} ${reportYear}`;
      }
    };

    updateChart();

    const calendarIcon = document.getElementById("calendar-icon");
    const monthDropdown = document.getElementById("month-dropdown");

    calendarIcon.addEventListener("click", () => {
      monthDropdown.style.display =
        monthDropdown.style.display === "block" ? "none" : "block";
    });

    const monthItems = monthDropdown.querySelectorAll("li");

    monthItems.forEach((item) => {
      item.addEventListener("click", () => {
        reportMonth = item.getAttribute("data-month");
        console.log(`Выбран месяц: ${reportMonth}`);

        updateChart();

        monthDropdown.style.display = "none";

        generateDutyCardsForCurrentUser();
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !calendarIcon.contains(event.target) &&
        !monthDropdown.contains(event.target)
      ) {
        monthDropdown.style.display = "none";
      }
    });

    const generateDutyCardsForCurrentUser = () => {
      if (schedules[reportYear] && schedules[reportYear][reportMonth]) {
        const monthSchedules = schedules[reportYear][reportMonth];

        const mainContainer = document.querySelector(".fake-main-s");
        mainContainer.innerHTML = "";

        dutyCardsArray = [];

        for (const day in monthSchedules) {
          const userSchedule = monthSchedules[day].user;

          if (userSchedule[userId]) {
            // Используем заданный userId
            const dutyData = userSchedule[userId];

            const notesForDay =
              notesData[day] &&
              notesData[day].user[userId] &&
              notesData[day].user[userId].note
                ? notesData[day].user[userId].note.join(", ")
                : "Нет записей";

            const dutyCardHTML = `
                       <div class="past font-regular">
                           <div class="past-block">
                               <div class="past-block__history">
                                   <div><span>Дежурство: </span><span class="duty-date">${parseInt(
                                     day.split("-")[2]
                                   )} ${
              monthNames[parseInt(reportMonth) - 1]
            }</span></div>
                                   <div><span>Время дежурства: </span><span>${
                                     dutyData.time || "8:00 - 20:00"
                                   }</span></div>
                                   <div><span>Статус: </span><span class="duty-status">${
                                     dutyData.status
                                   }</span></div>
                               </div>
                               <div class="button-open">
                                   <button class="past-block__history-button font-bold-white">Подробности дежурств</button>
                               </div>
                           </div>
                           <div class="discription close">
                               <div class="discription-text font-regular-white">
                                   <span>Записи: </span><span class="duty-notes">${notesForDay}</span></div>
                               <div class="discription-button__block">
                                   <button class="discription-button font-bold">Свернуть</button>
                               </div>
                           </div>
                       </div>`;

            dutyCardsArray.push(dutyCardHTML);
          }
        }

        mainContainer.innerHTML = dutyCardsArray.join("");

        displayDutyCards(dutyCardsArray);

        setupPagination(dutyCardsArray.length);
      }
    };

    const displayDutyCards = (cardsArray) => {
      const mainContainer = document.querySelector(".fake-main-s");

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      mainContainer.innerHTML = "";

      cardsArray.slice(startIndex, endIndex).forEach((cardHTML) => {
        mainContainer.insertAdjacentHTML("beforeend", cardHTML);
      });

      attachAccordionFunctionality();
    };

    const setupPagination = (totalCards) => {
      const paginationContainer = document.querySelector(".nav-number");

      paginationContainer.innerHTML = "";

      const totalPages = Math.ceil(totalCards / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const pageSpan = document.createElement("span");
        pageSpan.textContent = i;

        if (i === currentPage) {
          pageSpan.classList.add("active");
        }

        pageSpan.addEventListener("click", () => {
          currentPage = i;
          displayDutyCards(dutyCardsArray);
          setupPagination(totalCards);
        });

        paginationContainer.appendChild(pageSpan);
      }
    };

    const attachAccordionFunctionality = () => {
      const detailButtons = document.querySelectorAll(
        ".past-block__history-button"
      );

      detailButtons.forEach((detailButton) => {
        detailButton.addEventListener("click", () => {
          const descriptionBlock = detailButton
            .closest(".past")
            .querySelector(".discription");
          descriptionBlock.classList.toggle("close");
          detailButton.classList.toggle("close");
        });
      });

      const collapseButtons = document.querySelectorAll(".discription-button");

      collapseButtons.forEach((collapseButton) => {
        collapseButton.addEventListener("click", () => {
          const descriptionBlock = collapseButton.closest(".discription");
          descriptionBlock.classList.add("close");
          collapseButton
            .closest(".past")
            .querySelector(".past-block__history-button")
            .classList.remove("close");
        });
      });
    };

    generateDutyCardsForCurrentUser();
  };

  // Получаем пользователей из localStorage
  let users = JSON.parse(localStorage.getItem("users"));

  // Фильтруем пользователей с ролью "Сотрудник"
  let employees = users.filter((user) => user.role === "Сотрудник");

  // Находим элемент, в который будем добавлять карточки
  let reportDiv = document.querySelector(".report");

  // Переменная для хранения ссылки на текущую открытую карточку
  let currentOpenCard = null;

  // Создаем карточки для каждого сотрудника
  employees.forEach((employee) => {
    // Создаем элемент карточки
    let card = document.createElement("div");
    card.className = "report-wrapper";

    // Добавляем содержимое карточки без report-foter
    card.innerHTML = `
        <div class="report-block">
            <span class="card-user-name">${employee.firstName} ${employee.lastName}</span>
            <div class="report-block__user">
                <span>Сводка о пользователе</span>
                <span><img src="../icons/Arrowundblack.png" alt=""></span>
            </div>
        </div>
    `;

    // Находим элемент report-block внутри карточки
    const reportBlock = card.querySelector(".report-block");

    // Добавляем обработчик события клика только на report-block
    reportBlock.addEventListener("click", () => {
      // Ищем элемент report-foter в текущей карточке
      let footerDiv = card.querySelector(".report-foter");

      if (footerDiv) {
        // Если report-foter существует, удаляем его
        card.removeChild(footerDiv);
        currentOpenCard = null; // Сбрасываем текущую открытую карточку
      } else {
        // Если report-foter не существует, проверяем открытую карточку
        if (currentOpenCard) {
          // Удаляем report-foter из предыдущей открытой карточки, если она существует
          let previousFooterDiv =
            currentOpenCard.querySelector(".report-foter");
          if (previousFooterDiv) {
            currentOpenCard.removeChild(previousFooterDiv);
          }
        }

        // Создаем новый элемент report-foter
        footerDiv = document.createElement("div");
        footerDiv.className = "report-foter";

        // Создаем новый элемент для добавления в report-foter
        let footerContent = document.createElement("div");
        footerContent.textContent = `Отчет для пользователя с ID: ${employee.id}`;

        // Добавляем созданный элемент в report-foter
        footerDiv.appendChild(footerContent);

        // Добавляем report-foter в карточку
        card.appendChild(footerDiv);

        // Вызываем функцию createReportUser с ID сотрудника
        createReportUser(employee.id);

        // Обновляем ссылку на текущую открытую карточку
        currentOpenCard = card;
      }
    });

    // Добавляем карточку в конец элемента reportDiv
    reportDiv.appendChild(card);
  });
}
