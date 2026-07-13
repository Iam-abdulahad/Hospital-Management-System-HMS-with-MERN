import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, Search, Plus } from 'lucide-react';
import { createAppointment, getAppointments, updateAppointmentStatus } from '../services/appointmentService';
import api from '../utils/axiosConfig';

const emptyForm = {
  patientId: '',
  doctorId: '',
  date: '',
  timeSlot: '09:00',
  reason: ''
};

const statusStyles = {
  pending: 'bg-warning-light text-warning-dark',
  confirmed: 'bg-secondary-light text-secondary',
  completed: 'bg-primary-light text-primary',
  cancelled: 'bg-accent-light text-accent'
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadAppointments = async (selectedStatus = '') => {
    setLoading(true);
    try {
      const data = await getAppointments(selectedStatus);
      setAppointments(data);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [patientsResponse, doctorsResponse] = await Promise.all([
        api.get('/patients'),
        api.get('/auth/doctors')
      ]);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (error) {
      setMessage('Unable to load patient and doctor options');
    }
  };

  useEffect(() => {
    loadOptions();
    loadAppointments(statusFilter);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      await loadAppointments(statusFilter);
      setMessage('Appointment status updated');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to update status');
    }
  };

  const handleFilter = (value) => {
    setStatusFilter(value);
    loadAppointments(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createAppointment({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
      setFormData(emptyForm);
      setIsModalOpen(false);
      setMessage('Appointment booked successfully');
      await loadAppointments(statusFilter);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const visibleAppointments = useMemo(() => appointments, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Appointments</h1>
          <p className="text-sm text-neutral-500">Track upcoming consultations and update appointment states.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-button border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
            <Search className="h-4 w-4" />
            <select value={statusFilter} onChange={(event) => handleFilter(event.target.value)} className="bg-transparent outline-none">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
            <Plus className="h-4 w-4" />
            Book Appointment
          </button>
        </div>
      </div>

      {message ? <div className="rounded-button border border-secondary-light bg-secondary-light/70 px-4 py-3 text-sm text-secondary">{message}</div> : null}

      <div className="overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-neutral-500">Loading appointments...</td></tr>
              ) : visibleAppointments.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-neutral-500">No appointments found.</td></tr>
              ) : (
                visibleAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-primary-light/40">
                    <td className="px-6 py-4 text-sm text-neutral-800">{appointment.patientId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800">{appointment.doctorId?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{appointment.timeSlot}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[appointment.status] || statusStyles.pending}`}>
                          {appointment.status}
                        </span>
                        <select value={appointment.status} onChange={(event) => handleStatusChange(appointment._id, event.target.value)} className="rounded-button border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-600">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-2xl rounded-card bg-white p-6 shadow-modal">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-800">Book Appointment</h2>
                  <p className="text-sm text-neutral-500">Create a new consultation slot for the clinic diary.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-neutral-700">
                  Patient
                  <select required value={formData.patientId} onChange={(event) => setFormData({ ...formData, patientId: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary">
                    <option value="">Select patient</option>
                    {patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Doctor
                  <select required value={formData.doctorId} onChange={(event) => setFormData({ ...formData, doctorId: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary">
                    <option value="">Select doctor</option>
                    {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Date
                  <input required type="date" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Time
                  <input required type="time" value={formData.timeSlot} onChange={(event) => setFormData({ ...formData, timeSlot: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="md:col-span-2 text-sm font-medium text-neutral-700">
                  Reason
                  <textarea value={formData.reason} onChange={(event) => setFormData({ ...formData, reason: event.target.value })} className="mt-1 min-h-24 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-button border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                    <CalendarPlus className="h-4 w-4" />
                    {submitting ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
