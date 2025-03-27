const express = require("express");
const menuController = require("../controllers/menuController");

const router = express.Router();

// Create a new menu item
router.post("/menu", menuController.createMenuItem);

// Get all menu items for a specific restaurant
router.get("/menu/:restaurantId", menuController.getMenuItems);

// Update a menu item
router.put("/menu/:id", menuController.updateMenuItem);

// Delete a menu item
router.delete("/menu/:id", menuController.deleteMenuItem);

module.exports = router;
