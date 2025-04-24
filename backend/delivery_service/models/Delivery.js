const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  pickupLocation: {
    location: { type: String, required: true }, // e.g., "Malabe"
    city: { type: String, required: true }      // e.g., "Colombo"
  },
  dropLocation: {
    location: { type: String, required: true }, // e.g., "Kaduwela"
    city: { type: String, required: true }      // e.g., "Colombo"
  },

  status: { 
    type: String, 
    enum: ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  assignedAt: { type: Date },
  deliveredAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
