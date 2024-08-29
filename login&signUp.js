const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const messageElement = document.getElementById('loginMessage');

    console.log("Email entered:", email);
    console.log("Password entered:", password);

    // Retrieve users array from local storage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    if (storedUsers.length === 0) {
        messageElement.textContent = "No account found. Please sign up first.";
        messageElement.style.color = "red";
        return;
    }

    // Hash the input password
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Find a matching user in the stored users array
    const user = storedUsers.find(user => user.email === email && user.password === hashedPassword);

    if (user) {
        messageElement.textContent = "Login successful!";
        messageElement.style.color = "green";

        // Optional: Save the logged-in user info to localStorage or session storage
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Clear form fields
        document.getElementById('loginForm').reset();

        // Redirect to another page after a short delay
        setTimeout(() => {
            window.location.href = 'contactUs.html'; // Redirect to your target page
        }, 1000);
    } else {
        messageElement.textContent = "Invalid email or password.";
        messageElement.style.color = "red";
    }

});

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const messageElement = document.getElementById('signupMessage');

    // Validation
    const errors = [];
    if (username.length < 3) errors.push("Username must be at least 3 characters long.");
    if (!validateEmail(email)) errors.push("Invalid email address.");
    if (!validatePhone(phone)) errors.push("Invalid phone number.");
    if (password.length < 8) errors.push("Password must be at least 8 characters long.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    // Retrieve users array from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email or phone already exists
    const emailExists = storedUsers.some(user => user.email === email);
    const phoneExists = storedUsers.some(user => user.phone === phone);

    if (emailExists) errors.push("Email already exists. Please use a different email.");
    if (phoneExists) errors.push("Phone number already exists. Please use a different phone number.");

    if (errors.length > 0) {
        messageElement.innerHTML = errors.join("<br>");
        messageElement.style.color = "red";
    } else {
        // Hash the password before storing it
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Create a user object
        const newUser = {
            username: username,
            email: email,
            phone: phone,
            password: hashedPassword
        };

        // Add the new user to the stored users array
        storedUsers.push(newUser);

        // Save the updated users array to localStorage
        localStorage.setItem('users', JSON.stringify(storedUsers));

        // Also store the new user in 'user' key for backward compatibility
        localStorage.setItem('user', JSON.stringify(newUser));

        messageElement.textContent = "Signup successful!";
        messageElement.style.color = "green";

        // Redirect to another page after a short delay
        setTimeout(() => {
            window.location.href = 'aboutUs.html'; // Change to your target page
        }, 1000);
    }
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    const phonePattern = /\+?[0-9]{10,}$/;
    return phonePattern.test(phone);
}