const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Prescription = require('../models/Prescription');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = req.body;

    if (!patientId || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid patientId or doctorId' });
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      timeSlot,
      date: { $gte: dayStart, $lt: dayEnd },
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Doctor is already booked at that date and time' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: new Date(date),
      timeSlot,
      reason,
      status: 'pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('createAppointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name role')
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name patientId')
      .populate('doctorId', 'name role')
      .sort({ date: 1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const previousStatus = appointment.status;

    appointment.status = status;
    await appointment.save();

    // If a doctor marked the appointment as completed, auto-generate an invoice
    let createdInvoice = null;
    try {
      if (
        status === 'completed' &&
        req.user &&
        String(req.user.role) === 'doctor' &&
        previousStatus !== 'completed'
      ) {
        // Avoid duplicate invoices
        const existingInvoice = await Invoice.findOne({ appointmentId: appointment._id });
        if (!existingInvoice) {
          const consultationFee = 50;
          const prescriptions = await Prescription.find({ appointmentId: appointment._id });
          let medicineFee = 0;
          if (prescriptions && prescriptions.length > 0) {
            prescriptions.forEach((presc) => {
              if (Array.isArray(presc.medicines)) {
                medicineFee += presc.medicines.length * 10;
              }
            });
          }

          const totalAmount = consultationFee + medicineFee;

          createdInvoice = await Invoice.create({
            patientId: appointment.patientId,
            appointmentId: appointment._id,
            totalAmount,
            paymentStatus: 'unpaid'
          });

          await createdInvoice.populate('patientId', 'name contact');
          await createdInvoice.populate({ path: 'appointmentId', populate: { path: 'doctorId', select: 'name email' } });
        }
      }
    } catch (invoiceErr) {
      console.error('Error generating invoice after appointment completion:', invoiceErr);
      // Do not fail the whole request if invoice generation fails; just log
    }

    return res.json({ appointment, invoice: createdInvoice });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
