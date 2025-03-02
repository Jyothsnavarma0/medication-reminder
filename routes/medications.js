const express = require("express");
const mongoose = require("mongoose");
const Medication = require("../models/Medication"); // Import the Medication model

const router = express.Router();

// ✅ Add a new medication
router.post("/add", async (req, res) => {
    try {
        const { userId, name, dosage, time } = req.body;

        // ✅ Ensure userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format!" });
        }

        // ✅ Check required fields
        if (!userId || !name || !dosage || !time) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const newMedication = new Medication({ userId, name, dosage, time });
        await newMedication.save();

        res.status(201).json({ message: "Medication added successfully!", medication: newMedication });
    } catch (error) {
        console.error("Error adding medication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get all medications for a specific user
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Ensure userId is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format!" });
        }

        const medications = await Medication.find({ userId });

        res.json(medications);
    } catch (error) {
        console.error("Error fetching medications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Edit medication
router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dosage, time } = req.body;

        // ✅ Ensure medication ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid medication ID!" });
        }

        const updatedMedication = await Medication.findByIdAndUpdate(
            id,
            { name, dosage, time },
            { new: true }
        );

        if (!updatedMedication) {
            return res.status(404).json({ error: "Medication not found!" });
        }

        res.json({ message: "Medication updated successfully!", medication: updatedMedication });
    } catch (error) {
        console.error("Error updating medication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ DELETE Medication (Updated Route to `/medications/:id`)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Ensure medication ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid medication ID!" });
        }

        const deletedMedication = await Medication.findByIdAndDelete(id);

        if (!deletedMedication) {
            return res.status(404).json({ error: "Medication not found!" });
        }

        res.json({ message: "Medication deleted successfully!" });
    } catch (error) {
        console.error("Error deleting medication:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Export the router
module.exports = router;
