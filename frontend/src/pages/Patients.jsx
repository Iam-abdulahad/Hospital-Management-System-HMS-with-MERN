import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, UserRoundPlus } from 'lucide-react';
import { createPatient, getPatients } from '../services/patientService';

const emptyForm = {
  name: '',
  age: '',
  gender: 'Male',
  contact: '',
  address: '',
  medicalHistory: ''
};

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadPatients = async (query = '') => {
    setLoading(true);
    try {
      const data = await getPatients(query);
      setPatients(data);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients(search);
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    loadPatients(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createPatient({
        ...formData,
        age: Number(formData.age),
        medicalHistory: formData.medicalHistory
          ? formData.medicalHistory.split(',').map((item) => item.trim()).filter(Boolean)
          : []
      });
      setFormData(emptyForm);
      setIsModalOpen(false);
      setMessage('Patient registered successfully');
      await loadPatients(search);
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Patients</h1>
          <p className="text-sm text-neutral-500">Manage patient profiles and keep medical records up to date.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-button border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search by name or contact"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Register New Patient
          </button>
        </div>
      </div>

      {message ? <div className="rounded-button border border-secondary-light bg-secondary-light/70 px-4 py-3 text-sm text-secondary">{message}</div> : null}

      <div className="overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Age</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-neutral-500">Loading patients...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-neutral-500">No patients found.</td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr
                    key={patient._id}
                    onClick={() => navigate(`/dashboard/patient/${patient._id}`)}
                    className="hover:bg-primary-light/40 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-primary">{patient.patientId}</td>
                    <td className="px-6 py-4 text-sm text-neutral-800">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{patient.contact}</td>
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
                  <h2 className="text-xl font-semibold text-neutral-800">Register Patient</h2>
                  <p className="text-sm text-neutral-500">Create a new patient profile for the clinic.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-sm text-neutral-500">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-neutral-700">
                  Full Name
                  <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Age
                  <input required type="number" min="0" value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Gender
                  <select required value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-neutral-700">
                  Contact
                  <input required value={formData.contact} onChange={(event) => setFormData({ ...formData, contact: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="md:col-span-2 text-sm font-medium text-neutral-700">
                  Address
                  <input required value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} className="mt-1 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <label className="md:col-span-2 text-sm font-medium text-neutral-700">
                  Medical History (comma separated)
                  <textarea value={formData.medicalHistory} onChange={(event) => setFormData({ ...formData, medicalHistory: event.target.value })} className="mt-1 min-h-24 w-full rounded-input border border-neutral-200 px-3 py-2 outline-none focus:border-primary" />
                </label>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-button border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600">Cancel</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
                    <UserRoundPlus className="h-4 w-4" />
                    {submitting ? 'Saving...' : 'Save Patient'}
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

export default Patients;
