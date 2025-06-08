const validUser = {
    email: "test@example.com",
    password: "password123",
    company: "cmrit",
};

const loginView = document.getElementById("login-view") as HTMLElement;
const userListView = document.getElementById("user-list-view") as HTMLElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;

const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const companyInput = document.getElementById("company") as HTMLInputElement;

const emailError = document.getElementById("email-error") as HTMLElement;
const passwordError = document.getElementById("password-error") as HTMLElement;
const companyError = document.getElementById("company-error") as HTMLElement;
const loginError = document.getElementById("login-error") as HTMLElement;

const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
const userListContainer = document.getElementById("user-list-container") as HTMLElement;
const userListElement = document.getElementById("user-list") as HTMLElement;
const loadingIndicator = document.getElementById("loading") as HTMLElement;

let isLoading = false;
const batchSize = 10;
let currentBatch = 0;
let allUsers: any[] = [];

function validateInputs(): boolean {
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

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    if (
        emailInput.value.trim() === validUser.email &&
        passwordInput.value.trim() === validUser.password &&
        companyInput.value.trim().toLowerCase() === validUser.company
    ) {
        loginView.style.display = "none";
        userListView.style.display = "flex";
        userListElement.innerHTML = "";
        currentBatch = 0;
        allUsers = [];
        loadUsers();
    } else {
        loginError.textContent = "Invalid credentials. Please try again.";
    }
});

logoutBtn.addEventListener("click", () => {
    userListView.style.display = "none";
    loginView.style.display = "flex";
    loginForm.reset();
    emailError.textContent = "";
    passwordError.textContent = "";
    companyError.textContent = "";
    loginError.textContent = "";
});

async function loadUsers() {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.classList.remove("hidden");

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
            const user = { ...allUsers[userIndex] };
            user.id = startIndex + i + 1;
            user.name = `${user.name} #${user.id}`;
            batchUsers.push(user);
        }

        await new Promise((r) => setTimeout(r, 800));
        renderUsers(batchUsers);
        currentBatch++;
    } catch (err) {
        console.error("Failed to load users", err);
    } finally {
        isLoading = false;
        loadingIndicator.classList.add("hidden");
    }
}

function renderUsers(users: any[]) {
    users.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `${user.name} (${user.email}) - Phone: ${user.phone}`;
        userListElement.appendChild(li);
    });
}

userListContainer.addEventListener("scroll", () => {
    if (isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = userListContainer;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadUsers();
    }
});
