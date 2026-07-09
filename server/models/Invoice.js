const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'paid', 'insurance'], 
        default: 'unpaid' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
