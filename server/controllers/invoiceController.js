const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// Generate an invoice for an appointment
const generateInvoice = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId || !mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: 'Valid appointmentId is required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Fixed consultation fee
    const consultationFee = 50;

    // Check prescriptions for this appointment and calculate medicine fees
    const prescriptions = await Prescription.find({ appointmentId });
    let medicineFee = 0;
    if (prescriptions && prescriptions.length > 0) {
      // Charge $10 per medicine item as an example
      prescriptions.forEach((presc) => {
        if (Array.isArray(presc.medicines)) {
          medicineFee += presc.medicines.length * 10;
        }
      });
    }

    const totalAmount = consultationFee + medicineFee;

    const invoice = await Invoice.create({
      patientId: appointment.patientId,
      appointmentId: appointment._id,
      totalAmount,
      paymentStatus: 'unpaid'
    });

    // Populate patient and appointment -> doctor
    await invoice.populate('patientId', 'name contact');
    await invoice.populate({ path: 'appointmentId', populate: { path: 'doctorId', select: 'name email' } });

    return res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error('generateInvoice error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Admin: get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('patientId', 'name contact')
      .populate({ path: 'appointmentId', populate: { path: 'doctorId', select: 'name email' } })
      .sort({ createdAt: -1 });

    return res.json({ success: true, invoices });
  } catch (error) {
    console.error('getAllInvoices error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Admin/Receptionist: update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['unpaid', 'paid', 'insurance'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status' });
    }

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.paymentStatus = status;
    await invoice.save();

    return res.json({ success: true, invoice });
  } catch (error) {
    console.error('updatePaymentStatus error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Admin: revenue stats (total paid amount)
const getRevenueStats = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const totalRevenue = (result[0] && result[0].totalRevenue) || 0;
    const paidCount = (result[0] && result[0].count) || 0;

    return res.json({ success: true, totalRevenue, paidCount });
  } catch (error) {
    console.error('getRevenueStats error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = {
  generateInvoice,
  getAllInvoices,
  updatePaymentStatus,
  getRevenueStats
};
