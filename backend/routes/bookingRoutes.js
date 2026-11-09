
const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");

// CREATE BOOKING
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

// GET ALL BOOKINGS
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

module.exports = router;
