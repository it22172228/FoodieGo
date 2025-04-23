const express = require('express');
const { register, login, logout, getUserProfile } = require('../Controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/userprofile', getUserProfile);

module.exports = router;

