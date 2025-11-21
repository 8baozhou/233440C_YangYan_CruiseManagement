// models/bookings.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    //db ref
    cruise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cruise",
      required: true,
    },

    //C001, C002
    customerId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "checked-in", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
