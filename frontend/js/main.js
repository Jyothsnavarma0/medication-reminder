document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login clicked");
});
document.getElementById("signup-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Signup clicked");
});
document.getElementById("add-medicine-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Medicine added");
});
document.getElementById("signup-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Signup successful! Redirecting to login...");
        window.location.href = "login.html"; // Redirect to Login Page
    } else {
        alert("Signup failed: " + data.error);
    }
});

document.getElementById("login-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Store user session in localStorage
        localStorage.setItem("user", JSON.stringify(data));

        alert("Login successful! Redirecting to dashboard...");
        window.location.href = "dashboard.html"; // ✅ Redirect to Dashboard
    } else {
        alert("Login failed: " + data.error);
    }
});
 
async function fetchMedications() {
    const response = await fetch("http://localhost:5000/medications");
    const medications = await response.json();

    const listContainer = document.getElementById("medications-list");
    listContainer.innerHTML = medications.map(med => `
        <div class="med-card">
            <h3>${med.name}</h3>
            <p>Time: ${med.time}</p>
        </div>
    `).join("");
}

if (document.getElementById("medications-list")) {
    fetchMedications();
}
document.getElementById("add-medicine-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("med-name").value;
    const dosage = document.getElementById("dosage").value;
    const time = document.getElementById("time").value;
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("Please log in first!");
        return;
    }

    const response = await fetch("http://localhost:5000/add-medication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dosage, time, email: user.email }),
    });

    if (response.ok) {
        alert("Medicine added successfully!");
        window.location.href = "dashboard.html";
    } else {
        alert("Failed to add medicine.");
    }
});
function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("profile-info").innerHTML = `
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
        `;
    } else {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "logout.html";
}

if (document.getElementById("profile-info")) {
    loadProfile();
}
document.getElementById("login-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data)); // Store user session
        alert("Login Successful!");
        window.location.href = "dashboard.html"; // ✅ Redirect to Dashboard
    } else {
        alert("Invalid credentials!");
    }
});
function logout() {
    localStorage.removeItem("user"); // Remove user session
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect to login page
}
document.getElementById("medication-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
    if (!user) {
        alert("Please log in first!");
        window.location.href = "login.html";
        return;
    }

    const name = document.getElementById("med-name").value;
    const dosage = document.getElementById("med-dosage").value;
    const time = document.getElementById("med-time").value;

    const response = await fetch("http://localhost:5000/add-medication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, name, dosage, time }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Medication added successfully!");
        document.getElementById("medication-form").reset();
    } else {
        alert("Error: " + data.error);
    }
});

