
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ======================================
// HEALTH CHECK
// ======================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Flexo Spaces backend is running",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Not connected",
  });
});

// ======================================
// API ROUTES
// ======================================

// User and Space Owner authentication
app.use("/api/auth", authRoutes);

// Admin login
app.use("/api/admin", adminRoutes);

// Booking APIs
app.use("/api/bookings", bookingRoutes);

// Favourites APIs
app.use("/api/favourites", favouriteRoutes);

// Workspace APIs
app.use("/api/workspaces", workspaceRoutes);

// ======================================
// SERVER CONFIGURATION
// ======================================

const PORT = process.env.PORT || 5000;

// ======================================
// CONNECT DATABASE AND START SERVER
// ======================================

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from backend .env"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Flexo Spaces backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
