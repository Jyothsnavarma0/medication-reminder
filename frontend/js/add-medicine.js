const express = require("express");
const Medication = require("../models/Medication");

const router = express.Router();

// ✅ Add a new medication
router.post("/add", async (req, res) => {
    try {
        const { userId, name, dosage, time } = req.body;

        // 🔹 Ensure all fields are present
        if (!userId || !name || !dosage || !time) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // 🔹 Validate userId format (MongoDB ObjectId)
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return res.status(400).json({ error: "Invalid userId format." });
        }

        // 🔹 Save medication to the database
        const newMedication = new Medication({ userId, name, dosage, time });
        await newMedication.save();

        return res.status(201).json({ message: "Medication added successfully!", medication: newMedication });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
