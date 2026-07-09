const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    medicalHistory: [{ type: String }]
}, { timestamps: true });

// Auto-generate patientId before saving if not provided
patientSchema.pre('validate', function(next) {
    if (!this.patientId) {
        this.patientId = 'PT-' + Math.floor(100000 + Math.random() * 900000);
    }
    next();
});

module.exports = mongoose.model('Patient', patientSchema);
