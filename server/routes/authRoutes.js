const express = require('express');
const router = express.Router();
const { register, login, getDoctors, getAllStaff, updateStaffRole, deleteStaff } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.post('/register', register);
router.post('/login', login);
router.get('/doctors', protect, getDoctors);
router.get('/staff', protect, authorize('admin'), getAllStaff);
router.put('/staff/:id/role', protect, authorize('admin'), updateStaffRole);
router.delete('/staff/:id', protect, authorize('admin'), deleteStaff);

module.exports = router;
