const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin-only route
router.get('/admin-data', authMiddleware, roleMiddleware('Admin'), (req, res) => {
    res.json({ message: 'Admin Access Granted' });
});

module.exports = router;
