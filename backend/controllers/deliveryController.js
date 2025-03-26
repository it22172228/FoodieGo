const Delivery = require("../models/Delivery");
const DriverLocation = require("../models/DriverLocation");
const Notification = require("../models/Notification");
const haversine = require("haversine-distance");

// Assign the nearest available driver
exports.assignDriver = async (req, res) => {
  try {
    const { orderId, restaurantId, dropLatitude, dropLongitude } = req.body;
    const drivers = await DriverLocation.find().populate("driverId");

    if (!drivers.length) return res.status(400).json({ error: "No drivers available" });

    let nearestDriver = null;
    let minDistance = Infinity;

    for (const driver of drivers) {
      const driverLocation = { latitude: driver.latitude, longitude: driver.longitude };
      const dropLocation = { latitude: parseFloat(dropLatitude), longitude: parseFloat(dropLongitude) };

      const distance = haversine(driverLocation, dropLocation);

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver.driverId;
      }
    }

    if (!nearestDriver) return res.status(400).json({ error: "No suitable driver found" });

    const newDelivery = new Delivery({
      orderId,
      customerId: req.user.id,
      restaurantId,
      driverId: nearestDriver._id,
      status: "Assigned",
      dropLocation: { latitude: dropLatitude, longitude: dropLongitude },
      assignedAt: Date.now(),
    });

    await newDelivery.save();

    await Notification.create({
      userId: nearestDriver._id,
      message: `You have a new delivery assignment!`,
    });

    res.json({ message: "Driver assigned successfully", delivery: newDelivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Auto-reassign driver if no response or rejected
exports.reassignDriver = async (req, res) => {
  try {
    const { deliveryId } = req.body;
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) return res.status(404).json({ error: "Delivery not found" });

    delivery.driverId = null;
    delivery.status = "Pending";
    await delivery.save();

    await exports.assignDriver(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const validStatuses = ["Picked Up", "In Transit", "Delivered"];

    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });

    delivery.status = status;
    if (status === "Delivered") delivery.deliveredAt = Date.now();
    await delivery.save();

    await Notification.create({ userId: delivery.customerId, message: `Your order has been ${status.toLowerCase()}.` });
    await Notification.create({ userId: delivery.restaurantId, message: `Order ${delivery.orderId} is now ${status.toLowerCase()}.` });

    res.json({ message: "Delivery status updated", delivery });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all deliveries for a user
exports.getUserDeliveries = async (req, res) => {
  try {
    const { role, userId } = req.query;

    let filter = {};
    if (role === "Customer") filter.customerId = userId;
    if (role === "Driver") filter.driverId = userId;
    if (role === "Restaurant") filter.restaurantId = userId;
    if (role === "Admin") filter = {};

    const deliveries = await Delivery.find(filter);
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
