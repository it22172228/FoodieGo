const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String, // e.g., "Appetizer", "Main Course", "Dessert", etc.
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
