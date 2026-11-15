
const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    // Preserve IDs 1–9 for existing workspaces.
    // New workspaces will receive unique IDs.
    workspaceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["PRIVATE OFFICE", "SHARED WORKSPACE", "MEETING ROOM"],
    },

    price: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    period: {
      type: String,
      default: "/ month",
    },

    capacity: {
      type: String,
      required: true,
    },

    area: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workspace", workspaceSchema);
