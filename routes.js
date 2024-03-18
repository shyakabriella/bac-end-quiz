const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

// Define routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Add more routes as needed

module.exports = router;
