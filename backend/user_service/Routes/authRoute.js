const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");


router.post("/login",authController.login);
router.post("/register",authController.register);
router.put("/logout", authController.logout);
router.get("/getUserProfile", authController.getUserProfile);
router.get("/:userId", authController.getUserById); 

module.exports = router;