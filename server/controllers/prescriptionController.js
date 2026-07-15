const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, notes } = req.body;
    const doctorId = req.user._id;

    // Validate required fields
    if (!appointmentId || !patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ 
        message: 'Please provide appointmentId, patientId, and at least one medicine' 
      });
    }

    // Validate medicines structure
    const invalidMedicine = medicines.some(m => !m.name || !m.dosage || !m.duration);
    if (invalidMedicine) {
      return res.status(400).json({ 
        message: 'Each medicine must have name, dosage, and duration' 
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify the appointment belongs to the patient and is assigned to this doctor
    if (appointment.patientId.toString() !== patientId || 
        appointment.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to create prescription for this appointment' });
    }

    // Create the prescription
    const prescription = await Prescription.create({
      appointmentId,
      doctorId,
      patientId,
      medicines,
      notes: notes || ''
    });

    // Update appointment status to 'completed'
    appointment.status = 'completed';
    await appointment.save();

    // Return populated prescription
    const populatedPrescription = await prescription.populate([
      { path: 'appointmentId' },
      { path: 'doctorId', select: 'name email specialization' },
      { path: 'patientId', select: 'name patientId' }
    ]);

    res.status(201).json(populatedPrescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId })
      .populate('appointmentId', 'date timeSlot reason')
      .populate('doctorId', 'name email specialization')
      .populate('patientId', 'name patientId')
      .sort({ issuedDate: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('appointmentId', 'date timeSlot reason')
      .populate('doctorId', 'name email specialization')
      .populate('patientId', 'name patientId');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionById
};
