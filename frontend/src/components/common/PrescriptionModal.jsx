import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { createPrescription } from '../../services/prescriptionService';

const PrescriptionModal = ({ isOpen, appointment, onClose, onSuccess }) => {
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', duration: '' }
  ]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const validateForm = () => {
    if (medicines.some(m => !m.name || !m.dosage || !m.duration)) {
      setError('All medicine fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await createPrescription({
        appointmentId: appointment._id,
        patientId: appointment.patientId._id,
        medicines,
        notes
      });

      // Reset form
      setMedicines([{ name: '', dosage: '', duration: '' }]);
      setNotes('');
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-card bg-white shadow-modal max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">Write Prescription</h2>
            <p className="text-sm text-neutral-500">
              Patient: <span className="font-medium">{appointment.patientId?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-button border border-accent-light bg-accent-light/20 px-4 py-3 text-sm text-accent">
              {error}
            </div>
          )}

          {/* Medicines Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">Medicines</h3>
              <p className="text-xs text-neutral-500 mb-3">Add all prescribed medicines with dosage and duration</p>
            </div>

            {medicines.map((medicine, index) => (
              <div key={index} className="p-4 rounded-input border border-neutral-200 bg-neutral-50 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="text-sm font-medium text-neutral-700">
                    Medicine Name
                    <input
                      type="text"
                      placeholder="e.g., Amoxicillin"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary text-sm"
                      required
                    />
                  </label>
                  <label className="text-sm font-medium text-neutral-700">
                    Dosage
                    <input
                      type="text"
                      placeholder="e.g., 500mg"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary text-sm"
                      required
                    />
                  </label>
                  <label className="text-sm font-medium text-neutral-700">
                    Duration
                    <input
                      type="text"
                      placeholder="e.g., 7 days"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary text-sm"
                      required
                    />
                  </label>
                </div>

                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    className="flex items-center gap-2 text-xs text-accent hover:text-accent-dark transition"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove Medicine
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMedicine}
              className="flex items-center gap-2 rounded-button border border-primary text-primary px-4 py-2 text-sm font-semibold hover:bg-primary-light transition"
            >
              <Plus className="h-4 w-4" />
              Add Another Medicine
            </button>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes & Advice
              <span className="text-neutral-400 font-normal"> (Optional)</span>
            </label>
            <textarea
              placeholder="e.g., Take with food. Avoid alcohol. Schedule follow-up after 7 days."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-button border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PrescriptionModal;
