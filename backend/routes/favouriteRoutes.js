
const express = require("express");
const router = express.Router();

const Favourite = require("../models/Favourite");
const userAuth = require("../middleware/userAuth");

// ======================================
// GET LOGGED-IN USER'S FAVOURITES
// ======================================

router.get("/", userAuth, async (req, res) => {
  try {
    const favourites = await Favourite.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      favourites,
    });
  } catch (error) {
    console.error("Fetch favourites error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch saved workspaces.",
    });
  }
});

// ======================================
// ADD A WORKSPACE TO FAVOURITES
// ======================================

router.post("/", userAuth, async (req, res) => {
  try {
    const {
      workspaceId,
      name,
      location,
      type,
      price,
      period,
      image,
      capacity,
      area,
      amenities,
    } = req.body;

    if (!workspaceId || !name || !location || !type || !price) {
      return res.status(400).json({
        success: false,
        message: "Required workspace details are missing.",
      });
    }

    const existingFavourite = await Favourite.findOne({
      userId: req.user.id,
      workspaceId,
    });

    if (existingFavourite) {
      return res.status(409).json({
        success: false,
        message: "This workspace is already in your favourites.",
      });
    }

    const favourite = await Favourite.create({
      userId: req.user.id,
      workspaceId,
      name,
      location,
      type,
      price,
      period: period || "",
      image: image || "",
      capacity: capacity || "",
      area: area || "",
      amenities: Array.isArray(amenities) ? amenities : [],
    });

    res.status(201).json({
      success: true,
      message: "Workspace added to favourites.",
      favourite,
    });
  } catch (error) {
    console.error("Add favourite error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save workspace.",
    });
  }
});

// ======================================
// REMOVE A WORKSPACE FROM FAVOURITES
// ======================================

router.delete("/:workspaceId", userAuth, async (req, res) => {
  try {
    const favourite = await Favourite.findOneAndDelete({
      userId: req.user.id,
      workspaceId: req.params.workspaceId,
    });

    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Saved workspace not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workspace removed from favourites.",
    });
  } catch (error) {
    console.error("Remove favourite error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove workspace.",
    });
  }
});

module.exports = router;
