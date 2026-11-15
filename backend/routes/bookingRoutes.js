
const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const User = require("../models/User");

const adminAuth = require("../middleware/adminAuth");
const userAuth = require("../middleware/userAuth");

// =====================================
// CREATE BOOKING - PUBLIC CUSTOMER FORM
// =====================================

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      workspaceId,
      workspaceName,
      location,
      bookingDate,
      bookingTime,
      people,
    } = req.body;

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      workspaceId,
      workspaceName,
      location,
      bookingDate,
      bookingTime,
      people,
    });

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully!",
      booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// GET LOGGED-IN USER'S BOOKINGS
// =====================================

router.get("/my", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const bookings = await Booking.find({
      email: user.email,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("User bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load your bookings.",
    });
  }
});

// =====================================
// CANCEL OWN BOOKING - USER ONLY
// =====================================

router.patch("/:id/cancel", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      email: user.email,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found in your account.",
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be cancelled.",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully!",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error.message);

    return res.status(400).json({
      success: false,
      message: "Unable to cancel booking.",
    });
  }
});

// =====================================
// GET ALL BOOKINGS - ADMIN ONLY
// =====================================

router.get("/", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// UPDATE BOOKING STATUS - ADMIN ONLY
// =====================================

router.patch("/:id/status", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully!`,
      booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
