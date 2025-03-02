const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router(); // ✅ Define the router properly

// 🔹 Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully!" }); // ✅ Use return
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔹 Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // ✅ Use return
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" }); // ✅ Use return
        }

        // ✅ Send only one response
        return res.status(200).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router; // ✅ Only one module.exports
