import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Trash2, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../utils/axiosConfig';

const roleColors = {
  admin: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  doctor: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  receptionist: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  patient: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' }
};

const Staff = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/staff');
      setStaffList(data);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to load staff members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStaff();
    }
  }, [user]);

  const visibleStaff = useMemo(() => {
    return staffList.filter(staff => {
      const searchLower = searchTerm.toLowerCase();
      return (
        staff.name.toLowerCase().includes(searchLower) ||
        staff.email.toLowerCase().includes(searchLower) ||
        staff.role.toLowerCase().includes(searchLower)
      );
    });
  }, [staffList, searchTerm]);

  const handleRoleChange = async (staffId, newRole) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await api.put(`/auth/staff/${staffId}/role`, { role: newRole });
      
      setStaffList(staffList.map(staff => 
        staff._id === staffId ? { ...staff, role: newRole } : staff
      ));
      
      setSuccessMessage('Staff role updated successfully');
      setSelectedRole({});
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to update staff role');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }

    setDeletingId(staffId);
    try {
      setErrorMessage('');
      setSuccessMessage('');
      
      await api.delete(`/auth/staff/${staffId}`);
      
      setStaffList(staffList.filter(staff => staff._id !== staffId));
      setSuccessMessage('Staff member deleted successfully');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Unable to delete staff member');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="rounded-card bg-white p-8 shadow-card text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Access Denied</h2>
          <p className="text-neutral-600">You don't have permission to access this page. Only administrators can manage staff.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 rounded-card bg-white p-6 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">Staff Management</h1>
          <p className="text-sm text-neutral-500">Manage hospital staff roles and permissions.</p>
        </div>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-button border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="rounded-card bg-white p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <input
            type="text"
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-input border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-neutral-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Current Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Change Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-neutral-500">
                    Loading staff members...
                  </td>
                </tr>
              ) : visibleStaff.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-neutral-500">
                    {staffList.length === 0 ? 'No staff members found.' : 'No staff members match your search.'}
                  </td>
                </tr>
              ) : (
                visibleStaff.map((staff) => {
                  const roleColor = roleColors[staff.role] || roleColors.patient;
                  return (
                    <motion.tr
                      key={staff._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-primary-light/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-neutral-800">{staff.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{staff.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
                          {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={selectedRole[staff._id] || staff.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            if (newRole !== staff.role) {
                              handleRoleChange(staff._id, newRole);
                            }
                          }}
                          className="rounded-input border border-neutral-200 px-2 py-1 text-xs text-neutral-700 outline-none focus:border-primary"
                        >
                          <option value="admin">Admin</option>
                          <option value="doctor">Doctor</option>
                          <option value="receptionist">Receptionist</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          staff.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {staff.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(staff._id)}
                          disabled={deletingId === staff._id}
                          className="inline-flex items-center gap-2 rounded-button border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {deletingId === staff._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">Role Descriptions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border border-neutral-100 rounded-input">
            <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              Admin
            </h4>
            <p className="text-sm text-neutral-600">Full system access with staff management capabilities.</p>
          </div>
          <div className="p-4 border border-neutral-100 rounded-input">
            <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              Doctor
            </h4>
            <p className="text-sm text-neutral-600">Can manage appointments, prescriptions, and patient records.</p>
          </div>
          <div className="p-4 border border-neutral-100 rounded-input">
            <h4 className="font-semibold text-neutral-800 mb-2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              Receptionist
            </h4>
            <p className="text-sm text-neutral-600">Can book appointments and manage patient inquiries.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Staff;
