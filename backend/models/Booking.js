
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    workspaceId: {
      type: String,
      required: true,
    },

    workspaceName: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    bookingTime: {
      type: String,
      required: true,
    },

    people: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
