const Menu = require("../models/menuModel");

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, restaurantId } = req.body;
    const newMenuItem = new Menu({ name, description, price, imageUrl, category, restaurantId });

    const savedMenuItem = await newMenuItem.save();
    res.status(201).json({
      message: "Menu item created successfully",
      menuItem: savedMenuItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating menu item", error });
  }
};

// Get all menu items for a specific restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await Menu.find({ restaurantId });

    res.status(200).json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting menu item", error });
  }
};
