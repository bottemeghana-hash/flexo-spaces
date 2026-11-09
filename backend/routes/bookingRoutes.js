
const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// =====================================
// CREATE NEW BOOKING
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

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully!",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// GET ALL BOOKINGS
// =====================================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================
// UPDATE BOOKING STATUS
// APPROVE / REJECT / CANCEL
// =====================================
router.patch("/:id/status", async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully!`,
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
