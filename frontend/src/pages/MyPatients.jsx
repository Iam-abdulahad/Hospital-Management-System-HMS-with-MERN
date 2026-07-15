import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search } from 'lucide-react';
import { getDoctorAppointments } from '../services/prescriptionService';
import useAuth from '../hooks/useAuth';
import PrescriptionModal from '../components/common/PrescriptionModal';

const statusStyles = {
  pending: 'bg-warning-light text-warning-dark',
  confirmed: 'bg-secondary-light text-secondary',
  completed: 'bg-primary-light text-primary',
  cancelled: 'bg-accent-light text-accent'
};

const MyPatients = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getDoctorAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Filter appointments by status and search term
  useEffect(() => {
    let filtered = appointments;

    if (statusFilter) {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientId?.patientId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [statusFilter, searchTerm, appointments]);

  const handleWritePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionSuccess = async () => {
    setIsPrescriptionModalOpen(false);
    setSelectedAppointment(null);
    setMessage('Prescription created successfully!');
    await loadAppointments();
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">My Patients</h1>
          <p className="text-sm text-neutral-500">View your scheduled appointments and manage patient consultations.</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-button border border-secondary-light bg-secondary-light/70 px-4 py-3 text-sm text-secondary"
        >
          {message}
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-card sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-input border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none"
          />
        </label>
        <label className="flex items-center gap-2 rounded-button border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-neutral-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-neutral-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-primary-light/40">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                      <div>
                        <p className="font-semibold">{appointment.patientId?.name || 'Unknown'}</p>
                        <p className="text-xs text-neutral-500">{appointment.patientId?.patientId || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{appointment.timeSlot}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{appointment.reason || 'General checkup'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status] || statusStyles.pending}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleWritePrescription(appointment)}
                          className="inline-flex items-center gap-2 rounded-button bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors"
                        >
                          <ClipboardList className="h-3 w-3" />
                          Write Prescription
                        </button>
                      )}
                      {appointment.status === 'completed' && (
                        <span className="text-xs text-neutral-500">Completed</span>
                      )}
                      {appointment.status !== 'confirmed' && appointment.status !== 'completed' && (
                        <span className="text-xs text-neutral-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      <AnimatePresence>
        {isPrescriptionModalOpen && selectedAppointment && (
          <PrescriptionModal
            isOpen={isPrescriptionModalOpen}
            appointment={selectedAppointment}
            onClose={() => {
              setIsPrescriptionModalOpen(false);
              setSelectedAppointment(null);
            }}
            onSuccess={handlePrescriptionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPatients;
