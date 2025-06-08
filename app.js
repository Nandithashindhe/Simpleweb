const validUser = {
    email: "test@example.com",
    password: "password123",
    company: "cmrit"
};

const loginView = document.getElementById("login-view");
const userListView = document.getElementById("user-list-view");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const companyInput = document.getElementById("company");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const companyError = document.getElementById("company-error");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const userListContainer = document.getElementById("user-list-container");
const userListElement = document.getElementById("user-list");
const loadingIndicator = document.getElementById("loading");

let isLoading = false;
let batchSize = 10;
let currentBatch = 0;
let allUsers = [];

function validateInputs() {
    let valid = true;
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value.trim();
    const companyVal = companyInput.value.trim();
    emailError.textContent = "";
    passwordError.textContent = "";
    companyError.textContent = "";
    loginError.textContent = "";
    if (!emailVal || !emailVal.includes("@")) {
        emailError.textContent = "Please enter a valid email.";
        valid = false;
    }
    if (!passwordVal || passwordVal.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters.";
        valid = false;
    }
    if (!companyVal) {
        companyError.textContent = "Company is required.";
        valid = false;
    }
    return valid;
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validateInputs()) return;
    if (
        emailInput.value.trim() === validUser.email &&
        passwordInput.value.trim() === validUser.password &&
        companyInput.value.trim().toLowerCase() === validUser.company
    ) {
        loginView.style.display = "none";
        userListView.style.display = "block";
        userListElement.innerHTML = "";
        currentBatch = 0;
        allUsers = [];
        loadUsers();
    } else {
        loginError.textContent = "Invalid credentials. Please try again.";
    }
});

logoutBtn.addEventListener("click", function () {
    userListView.style.display = "none";
    loginView.style.display = "block";
    loginForm.reset();
    emailError.textContent = "";
    passwordError.textContent = "";
    companyError.textContent = "";
    loginError.textContent = "";
});

async function loadUsers() {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.style.display = "block";
    try {
        if (allUsers.length === 0) {
            const res = await fetch("https://jsonplaceholder.typicode.com/users");
            const users = await res.json();
            allUsers = users;
        }
        const startIndex = currentBatch * batchSize;
        const batchUsers = [];
        for (let i = 0; i < batchSize; i++) {
            const userIndex = (startIndex + i) % allUsers.length;
            const user = Object.assign({}, allUsers[userIndex]);
            user.id = startIndex + i + 1;
            user.name = user.name + " #" + user.id;
            batchUsers.push(user);
        }
        await new Promise(function (r) { return setTimeout(r, 800); });
        renderUsers(batchUsers);
        currentBatch++;
    } catch (err) {
        console.error("Failed to load users", err);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = "none";
    }
}

function renderUsers(users) {
    users.forEach(function (user) {
        const li = document.createElement("li");
        li.textContent = user.name + " (" + user.email + ") - Phone: " + user.phone;
        userListElement.appendChild(li);
    });
}

userListContainer.addEventListener("scroll", function () {
    if (isLoading) return;
    const scrollTop = userListContainer.scrollTop;
    const scrollHeight = userListContainer.scrollHeight;
    const clientHeight = userListContainer.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadUsers();
    }
});