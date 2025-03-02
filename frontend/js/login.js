document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // ✅ Ensure user data contains _id before storing
            if (!data._id) {
                throw new Error("User ID missing in response. Check backend.");
            }

            // ✅ Store user _id, username, and email in localStorage
            localStorage.setItem("user", JSON.stringify({
                _id: data._id,
                username: data.username, 
                email: data.email
            }));

            // Redirect to dashboard after successful login
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("message").innerText = data.error || "Login failed. Try again.";
        }
    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("message").innerText = "Something went wrong. Please try again.";
    }
});

// ✅ Logout Function
function logout() {
    localStorage.removeItem("user"); // Remove stored user data
    window.location.href = "login.html"; // Redirect to login page
}
