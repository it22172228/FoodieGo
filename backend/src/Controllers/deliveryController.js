const Delivery = require('../models/deliveryModel');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeliveriesByStatus = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: req.params.status });
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
