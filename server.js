// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ✅ Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
    startServer(); // Start server only after successful connection
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

// ✅ Import routes (only after successful connection)
const medicationRoutes = require("./routes/medications");
const authRoutes = require("./routes/auth");

// ✅ Function to start the server
const startServer = () => {
  app.use("/medications", medicationRoutes);
  app.use("/auth", authRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
};

// ✅ Connect to MongoDB first, then start the server
connectDB();
