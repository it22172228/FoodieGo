const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
  deliveryDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
