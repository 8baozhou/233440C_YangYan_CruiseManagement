const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    //C001, C002
    customerId: {
      type: String,
      required: true,
      unique: true
    },

    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },

    nationality: {
      type: String,
      required: true,
    },

    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },


    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);
