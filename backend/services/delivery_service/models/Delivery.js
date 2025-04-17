const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { 
    type: String, 
    enum: ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"], 
    default: "Pending" 
  },
  pickupLocation: { type: { latitude: Number, longitude: Number }, required: true },
  dropLocation: { type: { latitude: Number, longitude: Number }, required: true },
  assignedAt: { type: Date },
  deliveredAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
