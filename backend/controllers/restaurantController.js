const Restaurant = require('../models/restaurantModel');

// Register a new restaurant
const registerRestaurant = async (req, res) => {
    try {
        const { name, location, logoImageUrl, openingTime, closingTime } = req.body;
        const newRestaurant = new Restaurant({
            name,
            location,
            logoImageUrl,
            openingTime,
            closingTime
        });

        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant registered successfully', restaurant: newRestaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error registering restaurant', error: error.message });
    }
};

// Get all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ restaurants });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

// Get a single restaurant by ID
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ restaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
    }
};

// Update restaurant details
const updateRestaurant = async (req, res) => {
    try {
        const { name, location, logoImageUrl, openingTime, closingTime } = req.body;
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { name, location, logoImageUrl, openingTime, closingTime },
            { new: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json({ message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
    } catch (error) {
        res.status(500).json({ message: 'Error updating restaurant', error: error.message });
    }
};

// Delete a restaurant
const deleteRestaurant = async (req, res) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting restaurant', error: error.message });
    }
};

module.exports = { registerRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant };
