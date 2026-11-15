
const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workspaceId: {
      type: String,
      required: true,
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
    },

    price: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    capacity: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
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

// Prevent the same user from saving a workspace twice.
favouriteSchema.index(
  { userId: 1, workspaceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Favourite", favouriteSchema);
