const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");


router.post("/login",authController.login);
router.post("/register",authController.register);
router.put("/logout", authController.logout);
router.get("/getUserProfile", authController.getUserProfile);
router.get("/getAllDrivers", authController.getAllDrivers);
router.get("/:userId", authController.getUserById); 
// router.patch('/:id', authController.updateDriverStatus);
router.put("/updateProfile/:id", authController.updateProfile);

module.exports = router;