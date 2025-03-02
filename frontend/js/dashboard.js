document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user || !user._id) {
        alert("Please log in first!");
        window.location.href = "login.html";
        return;
    }

    fetchMedications(user._id);
});

// Function to fetch all medications from the backend
async function fetchMedications(userId) {
    try {
        const response = await fetch(`http://localhost:5000/medications/${userId}`);
        const medications = await response.json();

        const medsList = document.getElementById("medications-list");
        medsList.innerHTML = ""; // Clear previous list

        if (medications.length === 0) {
            medsList.innerHTML = "<p>No active medications.</p>";
        } else {
            medications.forEach(med => {
                const medItem = document.createElement("div");
                medItem.className = "medication-item";
                medItem.innerHTML = `
                    <h3>${med.name}</h3>
                    <p><strong>Dosage:</strong> ${med.dosage}</p>
                    <p><strong>Time:</strong> ${med.time}</p>
                    <button class="edit-btn" onclick="editMedication('${med._id}', '${med.name}', '${med.dosage}', '${med.time}')">✏ Edit</button>
                    <button class="delete-btn" onclick="deleteMedication('${med._id}')">❌ Delete</button>
                `;
                medsList.appendChild(medItem);
            });
        }
    } catch (error) {
        console.error("Error fetching medications:", error);
    }
}

// Function to delete medication
async function deleteMedication(id) {
    if (confirm("Are you sure you want to delete this medication?")) {
        try {
            const response = await fetch(`http://localhost:5000/medications/${id}`, { 
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Failed to delete medication");
            }

            alert("Medication deleted successfully!");
            fetchMedications(JSON.parse(localStorage.getItem("user"))._id); // Refresh the list
        } catch (error) {
            console.error("Error deleting medication:", error);
            alert("Error deleting medication. Please try again.");
        }
    }
}





// Function to edit medication
function editMedication(id, name, dosage, time) {
    const newName = prompt("Enter new medication name:", name);
    const newDosage = prompt("Enter new dosage:", dosage);
    const newTime = prompt("Enter new time:", time);

    if (newName && newDosage && newTime) {
        updateMedication(id, newName, newDosage, newTime);
    }
}

// Function to update medication
async function updateMedication(id, name, dosage, time) {
    try {
        await fetch(`http://localhost:5000/medications/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, dosage, time })
        });
        alert("Medication updated successfully!");
        fetchMedications(JSON.parse(localStorage.getItem("user"))._id);
    } catch (error) {
        console.error("Error updating medication:", error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
