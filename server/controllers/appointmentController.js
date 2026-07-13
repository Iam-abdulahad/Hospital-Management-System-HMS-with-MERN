const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, timeSlot, reason } = req.body;

    if (!patientId || !doctorId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Doctor is already booked at that date and time' });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: 'pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
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

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
};
