const express = require('express');
const router = express.Router();
const { register, login, getDoctors } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/doctors', protect, getDoctors);

module.exports = router;
