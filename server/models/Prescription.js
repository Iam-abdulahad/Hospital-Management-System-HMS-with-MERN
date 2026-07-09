const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    notes: { type: String },
    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
