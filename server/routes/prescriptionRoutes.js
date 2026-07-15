const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionById
} = require('../controllers/prescriptionController');

// All prescription routes require authentication
router.use(protect);

// Create a new prescription (only doctors and admins)
router.post('/', authorize('doctor', 'admin'), createPrescription);

// Get all prescriptions for a specific patient (doctors and admins)
router.get('/patient/:patientId', authorize('doctor', 'admin'), getPrescriptionsByPatient);

// Get a specific prescription by ID (doctors and admins)
router.get('/:prescriptionId', authorize('doctor', 'admin'), getPrescriptionById);

module.exports = router;
