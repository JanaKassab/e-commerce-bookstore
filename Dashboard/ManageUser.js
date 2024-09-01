document.addEventListener("DOMContentLoaded", function () {
    // Load navigation
    fetch("Navigation.html")
      .then((response) => response.text())
      .then((data) => {
        const navPlaceholder = document.getElementById("Nav-placeholder");
        if (navPlaceholder) {
          navPlaceholder.innerHTML = data;
        }
      })
      .catch((error) => console.error("Error loading navigation:", error));

    const userForm = document.getElementById("userForm");
    const usersTableBody = document.getElementById("usersTableBody");
    const userIdInput = document.getElementById("userId");
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const userRoleInput = document.getElementById("userRole");
    const addUserBtn = document.getElementById("addUserBtn");
    const saveUserBtn = document.getElementById("saveUserBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    function loadUsers() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      usersTableBody.innerHTML = "";
      users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="editBtn" data-id="${user.id}">Edit</button>
                        <button class="deleteBtn" data-id="${user.id}">Delete</button>
                    </td>
                `;
        usersTableBody.appendChild(row);
      });

      document.querySelectorAll(".editBtn").forEach((button) => {
        button.addEventListener("click", handleEdit);
      });

      document.querySelectorAll(".deleteBtn").forEach((button) => {
        button.addEventListener("click", handleDelete);
      });
    }

    function showForm(user = {}) {
      userForm.style.display = "block";
      userIdInput.value = user.id || "";
      userNameInput.value = user.name || "";
      userEmailInput.value = user.email || "";
      userRoleInput.value = user.role || "";
    }

    function hideForm() {
      userForm.style.display = "none";
      userIdInput.value = "";
      userNameInput.value = "";
      userEmailInput.value = "";
      userRoleInput.value = "";
    }

    // Handle save button click
    function handleSave() {
      const id = userIdInput.value;
      const name = userNameInput.value.trim();
      const email = userEmailInput.value.trim();
      const role = userRoleInput.value.trim();

      // Validate that all fields are filled
      if (!name || !email || !role) {
        alert("All fields are required!");
        return;
      }

      // Validate email format (basic check)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Check for duplicate email
      const duplicateEmail = users.find((user) => user.email === email);
      if (duplicateEmail) {
        alert(
          "This email address is already in use. Please use a different email."
        );
        return;
      } else {
        // Add new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          role,
        };
        users.push(newUser);
      }

      localStorage.setItem("users", JSON.stringify(users));
      loadUsers();
      hideForm();
    }

    function handleEdit(event) {
      const id = event.target.dataset.id;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((user) => user.id === id);
      showForm(user);
    }

    function handleDelete(event) {
      const id = event.target.dataset.id;
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      loadUsers();
    }

    addUserBtn.addEventListener("click", () => {
      showForm();
    });

    saveUserBtn.addEventListener("click", handleSave);
    cancelBtn.addEventListener("click", hideForm);

    loadUsers();
});
