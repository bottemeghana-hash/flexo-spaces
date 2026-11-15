
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const Workspace = require("../models/Workspace");
const adminAuth = require("../middleware/adminAuth");

// ======================================
// GET ALL WORKSPACES
// ======================================

router.get("/", async (req, res) => {
  try {
    const workspaces = await Workspace.find().sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      workspaces,
    });
  } catch (error) {
    console.error("Fetch workspaces error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch workspaces.",
    });
  }
});

// ======================================
// ADD NEW WORKSPACE (ADMIN ONLY)
// ======================================

router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      price,
      amount,
      period,
      capacity,
      area,
      image,
      amenities,
    } = req.body;

    if (
      !name?.trim() ||
      !location?.trim() ||
      !type ||
      !price?.trim() ||
      amount === undefined ||
      !capacity?.trim() ||
      !area?.trim() ||
      !image?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required workspace details.",
      });
    }

    if (
      !["PRIVATE OFFICE", "SHARED WORKSPACE", "MEETING ROOM"].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace type.",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid workspace price.",
      });
    }

    const workspace = await Workspace.create({
      workspaceId: `ws-${crypto.randomUUID()}`,
      name: name.trim(),
      location: location.trim(),
      type,
      price: price.trim(),
      amount: Number(amount),
      period: period?.trim() || "/ month",
      capacity: capacity.trim(),
      area: area.trim(),
      image: image.trim(),
      amenities: Array.isArray(amenities)
        ? amenities.filter(
            (item) => typeof item === "string" && item.trim()
          ).map((item) => item.trim())
        : [],
    });

    res.status(201).json({
      success: true,
      message: "Workspace added successfully.",
      workspace,
    });
  } catch (error) {
    console.error("Add workspace error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add workspace.",
    });
  }
});

module.exports = router;
