const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const {
  createAppointment,
  getAllAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

router.use(protect);

router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.get('/doctor/me', getDoctorAppointments);
router.put('/:id/status', authorize('admin', 'doctor', 'receptionist'), updateAppointmentStatus);

module.exports = router;
