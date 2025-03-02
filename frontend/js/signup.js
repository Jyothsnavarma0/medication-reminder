document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form refresh

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    message.style.color = "red"; // Default error message color

    if (!name || !email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Signup successful! Redirecting...";
            
            // Redirect to login page after successful signup
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            message.textContent = data.error || "Error signing up. Try again.";
        }
    } catch (error) {
        console.error("Signup Error:", error);
        message.textContent = "Server error. Please try again later.";
    }
});

