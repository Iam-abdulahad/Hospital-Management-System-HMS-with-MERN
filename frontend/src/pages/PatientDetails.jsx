import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { getPatientById, deletePatient } from '../services/patientService';
import { getPrescriptionsByPatient } from '../services/prescriptionService';
import useAuth from '../hooks/useAuth';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = user?.role === 'admin';
  const canViewPrescriptions = user?.role === 'doctor' || user?.role === 'admin';

  useEffect(() => {
    const loadPatient = async () => {
      setLoading(true);
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);

        // Load prescriptions if user is doctor or admin
        if (canViewPrescriptions) {
          try {
            const prescriptionsData = await getPrescriptionsByPatient(id);
            setPrescriptions(prescriptionsData);
          } catch (error) {
            console.log('Could not load prescriptions');
          }
        }
      } catch (error) {
        setMessage(error?.response?.data?.message || 'Unable to load patient details');
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id, canViewPrescriptions]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePatient(id);
      setMessage('Patient deleted successfully');
      setTimeout(() => navigate('/dashboard/patients'), 1500);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to delete patient');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-card bg-white p-8 shadow-card text-center text-neutral-500">
          Loading patient details...
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="rounded-card bg-white p-8 shadow-card text-center text-neutral-500">
          Patient not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:text-primary-dark transition font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </button>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-button border border-secondary-light bg-secondary-light/70 px-4 py-3 text-sm text-secondary"
        >
          {message}
        </motion.div>
      )}

      {/* Patient Header Card */}
      <div className="rounded-card bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">{patient.name}</h1>
            <p className="text-sm text-neutral-500">Patient ID: {patient.patientId}</p>
          </div>
          {canDelete && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 rounded-button border border-accent-light bg-accent-light/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent-light/20 transition"
            >
              <Trash2 className="h-4 w-4" />
              Delete Patient
            </button>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-input bg-neutral-50 p-3">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Age</p>
            <p className="mt-1 text-lg font-semibold text-neutral-800">{patient.age}</p>
          </div>
          <div className="rounded-input bg-neutral-50 p-3">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Gender</p>
            <p className="mt-1 text-lg font-semibold text-neutral-800">{patient.gender}</p>
          </div>
          <div className="rounded-input bg-neutral-50 p-3">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Contact</p>
            <p className="mt-1 text-lg font-semibold text-neutral-800">{patient.contact}</p>
          </div>
          <div className="rounded-input bg-neutral-50 p-3">
            <p className="text-xs uppercase tracking-wider text-neutral-500">Address</p>
            <p className="mt-1 text-sm font-medium text-neutral-800 truncate">{patient.address}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-card bg-white shadow-card">
        <div className="border-b border-neutral-100 flex">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition ${
              activeTab === 'info'
                ? 'border-b-2 border-primary text-primary'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Basic Information
          </button>
          {canViewPrescriptions && (
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition ${
                activeTab === 'prescriptions'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Medical History
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase">Full Address</h3>
                <p className="mt-2 text-neutral-800">{patient.address}</p>
              </div>
              {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase">Medical History</h3>
                  <ul className="mt-2 space-y-2">
                    {patient.medicalHistory.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-neutral-800">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && canViewPrescriptions && (
            <div>
              {prescriptions.length === 0 ? (
                <div className="rounded-input border border-neutral-100 bg-neutral-50 p-4 text-center text-neutral-500">
                  No prescriptions found for this patient
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription._id} className="rounded-input border border-neutral-100 bg-neutral-50 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-neutral-500">
                            {new Date(prescription.issuedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="mt-1 text-sm font-medium text-neutral-800">
                            Dr. {prescription.doctorId?.name}
                          </p>
                        </div>
                      </div>

                      {/* Medicines */}
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Medicines</h4>
                        <ul className="mt-2 space-y-1">
                          {prescription.medicines.map((medicine, idx) => (
                            <li key={idx} className="text-sm text-neutral-700">
                              <span className="font-medium">{medicine.name}</span> - {medicine.dosage} for {medicine.duration}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Notes */}
                      {prescription.notes && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">Notes</h4>
                          <p className="mt-2 text-sm text-neutral-700">{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-card bg-white p-6 shadow-modal"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent-light/20 p-3">
                <AlertCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">Delete Patient?</h2>
                <p className="text-sm text-neutral-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-button border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-button bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDetails;
