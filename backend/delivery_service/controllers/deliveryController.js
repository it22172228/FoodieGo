const Delivery = require("../models/Delivery");
const User = require("../../user_service/Models/User");
const Notification = require("../models/Notification");
const axios = require("axios");

exports.assignDriver = async (req, res) => {
  try {
    const { orderId, customerId, restaurantId } = req.body;

    // Fetch customer and restaurant details to get their locations
    const customerResponse = await axios.get(
      `http://localhost:5600/api/auth/${customerId}`
    );
    const restaurantResponse = await axios.get(
      `http://localhost:5600/api/auth/${restaurantId}`
    );

    const customer = customerResponse.data;
    const restaurant = restaurantResponse.data;

    console.log("customer response:", customerResponse.data);
    console.log("restaurant response:", restaurantResponse.data);

    if (!customer || !restaurant) {
      return res
        .status(404)
        .json({ error: "Customer or restaurant not found" });
    }

    const pickupLocation = {
      location: restaurant.location?.location,
      city: restaurant.location?.city,
    };
    console.log("pickupLocation:", pickupLocation);

    const dropLocation = {
      location: customer.location?.location,
      city: customer.location?.city,
    };
    console.log("dropLocation:", dropLocation);

    // Fetch all delivery drivers from external service
    const driverResponse = await axios.get('http://localhost:5600/api/auth/getAllDrivers'); 
    const allDrivers = driverResponse.data;

    console.log("allDrivers:", allDrivers);

    // Step 1: Filter drivers based on pickup location
    let driver = allDrivers.find((d) =>
      new RegExp(`^${pickupLocation.location}$`, "i").test(d.location.location)
    );

    // Step 2: If no driver is found, try by city
    if (!driver) {
      driver = allDrivers.find((d) =>
        new RegExp(`^${pickupLocation.city}$`, "i").test(d.location.city)
      );
    }

    // Step 3: Fallback to any available driver if no match found
    if (!driver) {
      driver = allDrivers.find((d) => d.status === "active");
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    console.log("Assigned driver:", driver);
     
    // Step 4: Create delivery assignment
    const newDelivery = new Delivery({
      orderId,
      customerId,
      customerName: customer.name,
      restaurantId,
      restaurantName: restaurant.name,
      driverId: driver._id,
      pickupLocation,
      dropLocation,
      status: "Pending",
      assignedAt: new Date(),
    });

    await newDelivery.save();

    console.log("New delivery assignment:", newDelivery);
    // // Step 5: Mark driver as busy
    // await axios.patch(`http://localhost:5600/api/auth/${driver._id}`, {
    //   status: "Busy",
    // });

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
    if (delivery.status !== "pending" && delivery.status !== "Cancelled") {
      return res.status(400).json({ error: "Driver has not rejected the assignment yet" });
    }

    // Step 3: Get all active drivers and exclude the rejected one
    const { excludeDriverId } = req.query; // Pass the rejected driver's ID in the request query
    let driverResponse = await axios.get('http://localhost:5600/api/auth/getAllDrivers'); // Use the existing endpoint to fetch active drivers

    let availableDrivers = driverResponse.data; // Array of all active drivers

    // Filter out the previously assigned (rejected) driver
    if (excludeDriverId) {
      availableDrivers = availableDrivers.filter(driver => driver._id.toString() !== excludeDriverId);
    }

    // Step 4: Check for drivers in the same location or city
    let driver = availableDrivers.find(d => d.location === delivery.pickupLocation.location);

    // Step 5: If no driver found, check for a driver in the same city
    if (!driver) {
      driver = availableDrivers.find(d => d.city === delivery.pickupLocation.city);
    }

    // Step 6: If no driver found in location or city, assign any available driver
    if (!driver) {
      driver = availableDrivers[0]; // Assign the first available driver
    }

    if (!driver) {
      return res.status(404).json({ error: "No available driver found" });
    }

    // Step 7: Assign the new driver to the delivery
    delivery.driverId = driver._id;
    delivery.status = "Cancelled"; // Reassign the delivery status
    delivery.assignedAt = new Date();

    await delivery.save();

    // Step 8: Mark the new driver as "Busy"
    // await axios.patch(`http://localhost:5600/api/auth/${driver._id}`, {
    //   status: "Busy",
    // });

    // Step 9: Notify the new driver
    await Notification.create({
      userId: driver._id,
      message: "Reassigned a new delivery!",
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
    const validStatuses = ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered", "Cancelled"];

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
    // if (!delivery.driverId || delivery.driverId.toString() !== req.user.id) {
    //   return res
    //     .status(403)
    //     .json({ error: "You are not authorized to update the status" });
    // }

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

    // Step 6: Respond with the updated delivery status
    res.json({ message: "Delivery status updated", delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverDeliveries = async (req, res) => {
  try {
    // Fetch all deliveries from the database (no filtering)
    const deliveries = await Delivery.find();

    if (!deliveries.length) {
      return res.status(404).json({ error: "No deliveries found" });
    }

    res.json({ message: "Deliveries fetched successfully", deliveries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    if (!notifications.length) {
      return res.status(404).json({ error: "No notifications found" });
    }

    res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const newNotification = await Notification.create({ userId, message });

    res.status(201).json({
      success: true,
      notification: newNotification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Server error while creating notification' });
  }
};