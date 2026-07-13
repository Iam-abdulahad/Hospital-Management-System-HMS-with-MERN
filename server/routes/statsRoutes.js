const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/statsController');

router.use(protect);
router.get('/', getDashboardStats);

module.exports = router;
