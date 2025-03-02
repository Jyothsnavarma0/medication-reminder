const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    time: { type: String, required: true }
});

module.exports = mongoose.model("Medication", MedicationSchema);

