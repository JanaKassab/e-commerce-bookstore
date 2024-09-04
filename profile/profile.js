let welcome = document.getElementById("welcome");
let user = document.getElementById("user");
let email = document.getElementById("email");
let phone = document.getElementById("phone");
let pass = document.getElementById("pass");
let userError = document.getElementById("user-error");
let passError = document.getElementById("password-error");
let emailError = document.getElementById("email-error");
let numberError = document.getElementById("number-error");
let changeButton = document.getElementById("change");

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!loggedInUser) {
    alert("User not logged in.");
    window.location.replace("../Login-Signup/login&SignUp.html");
} else {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    let changedObject = storedUsers.find((userObj) => userObj.username === loggedInUser.username);

    if (!changedObject) {
        alert("User not found.");
        window.location.replace("../Login-Signup/login&SignUp.html");
    } else {
        document.addEventListener("DOMContentLoaded", function() {
            welcome.innerText = "Welcome " + loggedInUser.username;
            user.value = loggedInUser.username;
            email.value = loggedInUser.email;
            phone.value = loggedInUser.phone;
        });
    }

    changeButton.addEventListener("click", function() {
        if (validateCredentials()) {
            changedObject.username = user.value.trim();
            changedObject.email = email.value.trim();
            changedObject.phone = phone.value.trim();
            changedObject.password = CryptoJS.SHA256(pass.value).toString();

            // Update stored users in localStorage
            localStorage.setItem('users', JSON.stringify(storedUsers));

            // Update the loggedInUser in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(changedObject));

            alert("Credentials changed successfully");
            window.location.replace("../Login-Signup/login&SignUp.html");
        }
    });
}

function validateCredentials() {
    const isUserNameValid = validateUserName();
    const isPasswordValid = validatePassword();
    const isEmailValid = validateEmail();
    const isPhoneNumberValid = validatePhone();

    return isUserNameValid && isPasswordValid && isEmailValid && isPhoneNumberValid;
}

function validateUserName() {
    if (user.value.trim() === "") {
        userError.innerText = "Please enter a username!";
        return false;
    }
    userError.innerText = "";
    return true;
}

function validatePassword() {
    if (pass.value.trim() === "" || pass.value.trim().length < 8) {
        passError.innerText = "Please enter a valid password with at least 8 characters.";
        return false;
    }
    passError.innerText = "";
    return true;
}

function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        emailError.innerText = "Please enter a valid email address.";
        return false;
    }
    emailError.innerText = "";
    return true;
}

function validatePhone() {
    const phonePattern = /\+?[0-9]{10,}$/;
    if (!phonePattern.test(phone.value.trim())) {
        numberError.innerText = "Please enter a valid phone number.";
        return false;
    }
    numberError.innerText = "";
    return true;
}
