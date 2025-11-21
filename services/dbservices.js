const mongoose = require("mongoose");
const Cruise = require("../models/cruises");
const Customer = require("../models/customers");
const Booking = require("../models/bookings");

let db = {
  async connect() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cruiseDB");
      return "Connecting to Mongo DB. Please wait...";
    } catch (e) {
      console.log(e.message);
      throw new Error("Error connecting to Mongo DB");
    }
  },

async addCruise(
  name,
  shipType,
  price,
  departurePort,
  arrivalPort,
  departureDate,
  arrivalDate,
  checkInTime,
  checkOutTime
) {
  try {
    const cruise = await Cruise.create({
      name,
      shipType,
      price,
      departurePort,
      arrivalPort,
      schedule: {
        departureDate,
        arrivalDate,
        checkInTime,
        checkOutTime,
      },
    });

    return cruise;
  } catch (e) {
    console.log("Cruise validation failed:", e.message);
    throw new Error(`Cruise "${name}" is not in the database.`);
  }
},

  async addCustomer(
    customerId,
    firstName,
    lastName,
    email,
    phone,
    nationality,
    emergencyName,
    emergencyPhone
  ) {
    try {
      const customer = await Customer.create({
        customerId,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone
        }
      });

      return customer;
    } catch (e) {
      console.log(e.message);
      throw new Error(`Customer "${customerId}" was not added.`);
    }
  },

  async AddBooking(cruiseId, customerId) {
  try {
    // find customer by their customerid (C001)
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      throw new Error(`Customer "${customerId}" not found.`);
    }

    // create booking
    const booking = await Booking.create({
      cruise: cruiseId,
      customerId: customerId
    });

    return { booking, customer }; //get customer data
  } catch (e) {
    console.log("Booking validation failed:", e.message);
    throw new Error("Booking was not created.");
  }
},

  async listCruises() {
    try {
      const cruises = await Cruise.find();
      return cruises;
    } catch (e) {
      console.log(e.message);
      throw new Error("Error retrieving cruises.");
    }
  },

  async listCustomers() {
    try {
      const customers = await Customer.find();
      return customers;
    } catch (e) {
      console.log(e.message);
      throw new Error("Error retrieving customers.");
    }
  },

async listBookings() {
  try {
    //get bookings with cruise details
    const bookings = await Booking.find()
      .populate("cruise")
      .lean(); // plain JS objects

    //get unique customerId values from bookings
    const customerIds = [...new Set(
      bookings
        .map((b) => b.customerId)
        .filter(Boolean)
    )];

    //fetch matching customers
    const customers = await Customer.find({
      customerId: { $in: customerIds },
    }).lean();

    //build map
    const customerMap = {};
    customers.forEach((c) => {
      customerMap[c.customerId] = c;
    });

    //attach customer to the booking
    const enrichedBookings = bookings.map((b) => ({
      ...b,
      customer: customerMap[b.customerId] || null,
    }));

    return enrichedBookings;
  } catch (e) {
    console.log(e.message);
    throw new Error("Error retrieving bookings.");
  }
}
};

module.exports = db;
