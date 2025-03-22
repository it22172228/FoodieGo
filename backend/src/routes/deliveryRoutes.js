const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// CRUD operations
router.post('/', deliveryController.createDelivery);
router.get('/', deliveryController.getAllDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.put('/:id', deliveryController.updateDelivery);
router.delete('/:id', deliveryController.deleteDelivery);

// Additional operations
router.get('/status/:status', deliveryController.getDeliveriesByStatus);
router.put('/:id/status', deliveryController.updateDeliveryStatus);

module.exports = router;
