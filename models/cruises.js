const mongoose = require('mongoose');

const cruiseSchema = new mongoose.Schema(
  {
    //14Nov Singapore to Tokyo Cruise
    name: {
      type: String,
      required: true,
    },

    //Queen Cruise, Nanyang Cruise, New Cruise, Party Cruise
    shipType: {
      type: String,
      required: true,
    },

    //price to be stored
    price: {
      type: Number,
      required: true,
    },

    // e.g. Singapore, Melaka, Yokohama, Phuket
    departurePort: {
      type: String,
      required: true,
    },

    arrivalPort: {
      type: String,
      required: true,
    },

    schedule: {
      departureDate: { type: String, required: true },
      arrivalDate:   { type: String, required: true },
      checkInTime:   { type: String, required: true },
      checkOutTime:  { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["active", "inactive", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cruise", cruiseSchema);
