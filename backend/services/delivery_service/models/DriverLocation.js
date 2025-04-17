const mongoose = require("mongoose");

const DriverLocationSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming drivers are stored in the User collection
    required: true,
    unique: true,
  },
  location: {
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DriverLocation", DriverLocationSchema);
