const express = require('express');
const { register, login, getUsers } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// User management routes
router.get('/', protect, getUsers);

module.exports = router;