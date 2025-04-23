const Delivery = require("../models/Delivery");
const User = require("../../user_service/Models/User");
const Notification = require("../models/Notification");

exports.assignDriver = async (req, res) => {
  try {
    const { orderId, customerId, restaurantId } = req.body;

    // Fetch customer and restaurant details to get their locations
    const customer = await User.findById(customerId);
    const restaurant = await User.findById(restaurantId);

    if (!customer || !restaurant) {
      return res.status(404).json({ error: "Customer or restaurant not found" });
    }

    const pickupLocation = {
      location: restaurant.location.location, // e.g., "Malabe"
      city: restaurant.location.city,         // e.g., "Colombo"
    };

    const dropLocation = {
      location: customer.location.location,   // e.g., "Kaduwela"
      city: customer.location.city,           // e.g., "Colombo"
    };

    // Step 1: Search for available drivers in the same pickup location
    let driver = await User.findOne({
      role: "Driver",
      status: "Available",
      "location.location": pickupLocation.location,
    });

    // Step 2: If no driver found, search in the same city
    if (!driver) {
      driver = await User.findOne({
        role: "Driver",
        status: "Available",
        "location.city": pickupLocation.city,
      });
    }

    // Step 3: If no driver in location or city, assign any available driver
    if (!driver) {
      driver = await User.findOne({
        role: "Driver",
        status: "Available",
      });
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    // Step 4: Create delivery assignment
    const newDelivery = new Delivery({
      orderId,
      customerId,
      restaurantId,
      driverId: driver._id,
      pickupLocation,
      dropLocation,
      status: "Assigned",
      assignedAt: new Date(),
    });

    await newDelivery.save();

    // Step 5: Mark driver as busy
    driver.status = "Busy";
    await driver.save();

    // Step 6: Notify driver
    await Notification.create({
      userId: driver._id,
      message: "You have been assigned a new delivery!",
    });

    res.status(201).json({
      message: "Driver assigned successfully",
      delivery: newDelivery,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


//  Auto-reassign driver if no response or rejected
exports.reassignDriver = async (req, res) => {
  try {
    const { deliveryId } = req.body; // Pass the delivery ID for reassignment

    // Step 1: Find the delivery to be reassigned
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Step 2: Check if the delivery is in "Assigned" state and rejected
    if (delivery.status !== "Assigned") {
      return res.status(400).json({ error: "Driver has not rejected the assignment yet" });
    }

    // Step 3: Mark current driver as "Available"
    const previousDriver = await User.findById(delivery.driverId);
    if (previousDriver) {
      previousDriver.status = "Available"; // Mark the previous driver as available
      await previousDriver.save();
    }

    // Step 4: Try to find a new driver in the same location or city
    let driver = await User.findOne({
      role: "Driver",
      status: "Available",
      "location.location": delivery.pickupLocation.location,
    });

    // Step 5: If no driver found, check for a driver in the same city
    if (!driver) {
      driver = await User.findOne({
        role: "Driver",
        status: "Available",
        "location.city": delivery.pickupLocation.city,
      });
    }

    // Step 6: If no driver found in location or city, assign any available driver
    if (!driver) {
      driver = await User.findOne({
        role: "Driver",
        status: "Available",
      });
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    // Step 7: Assign the new driver to the delivery
    delivery.driverId = driver._id;
    delivery.status = "Assigned"; // Reassign the delivery status
    delivery.assignedAt = new Date();
    
    await delivery.save();

    // Step 8: Mark the new driver as "Busy"
    driver.status = "Busy";
    await driver.save();

    // Step 9: Notify the new driver
    await Notification.create({
      userId: driver._id,
      message: "You have been reassigned a new delivery!",
    });

    res.status(200).json({
      message: "Driver reassigned successfully",
      delivery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const validStatuses = ["Picked Up", "In Transit", "Delivered"];

    // Step 1: Check if the status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Step 2: Find the delivery document
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Step 3: Check if the driver is assigned to this delivery
    if (!delivery.driverId || delivery.driverId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update the status" });
    }

    // Step 4: Update the delivery status
    delivery.status = status;
    if (status === "Picked Up") {
      // Handle Picked Up logic (e.g., set the pickup timestamp)
      delivery.assignedAt = Date.now();
    } else if (status === "In Transit") {
      // Handle In Transit logic (e.g., set in-transit timestamp)
      delivery.updatedAt = Date.now();
    } else if (status === "Delivered") {
      // Handle Delivered logic (e.g., set delivered timestamp)
      delivery.deliveredAt = Date.now();
    }

    await delivery.save();

    // Step 5: Notify the customer and restaurant about the delivery status change
    await Notification.create({
      userId: delivery.customerId,
      message: `Your order has been ${status.toLowerCase()}.`,
    });
    await Notification.create({
      userId: delivery.restaurantId,
      message: `Order ${delivery.orderId} is now ${status.toLowerCase()}.`,
    });

    // Step 6: Respond with the updated delivery status
    res.json({ message: "Delivery status updated", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverDeliveries = async (req, res) => {
  try {
    const driverId = req.user.id; // Assuming the driver is logged in and their ID is available in req.user.id

    // Step 1: Find all deliveries assigned to the driver
    const deliveries = await Delivery.find({ driverId });

    if (!deliveries.length) {
      return res.status(404).json({ error: "No deliveries found for this driver" });
    }

    // Step 2: Return the list of deliveries
    res.json({ message: "Deliveries fetched successfully", deliveries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};