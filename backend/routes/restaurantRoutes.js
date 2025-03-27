const express = require('express');
const { 
    registerRestaurant, 
    getAllRestaurants, 
    getRestaurantById, 
    updateRestaurant, 
    deleteRestaurant 
} = require('../controllers/restaurantController');

const router = express.Router();

// Route for creating a restaurant
router.post('/register', registerRestaurant);

// Route for getting all restaurants
router.get('/', getAllRestaurants);

// Route for getting a single restaurant by ID
router.get('/:id', getRestaurantById);

// Route for updating restaurant details
router.put('/:id', updateRestaurant);

// Route for deleting a restaurant
router.delete('/:id', deleteRestaurant);

module.exports = router;
