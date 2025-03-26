const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.post("/assignDriver", authenticate, deliveryController.assignDriver);
router.post("/reassignDriver", authenticate, deliveryController.reassignDriver);
router.put("/updateStatus", authenticate, deliveryController.updateDeliveryStatus);
router.get("/userDeliveries", authenticate, authorize(["admin"]), deliveryController.getUserDeliveries);

module.exports = router;
