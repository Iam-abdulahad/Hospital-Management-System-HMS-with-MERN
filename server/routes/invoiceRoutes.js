const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const {
  generateInvoice,
  getAllInvoices,
  updatePaymentStatus,
  getRevenueStats
} = require('../controllers/invoiceController');

router.use(protect);

// Create invoice for an appointment (manual)
router.post('/', authorize('admin', 'receptionist'), generateInvoice);

// Get all invoices (admin only)
router.get('/', authorize('admin'), getAllInvoices);

// Update payment status
router.patch('/:id/status', authorize('admin', 'receptionist'), updatePaymentStatus);

// Revenue stats
router.get('/stats/revenue', authorize('admin'), getRevenueStats);

module.exports = router;
