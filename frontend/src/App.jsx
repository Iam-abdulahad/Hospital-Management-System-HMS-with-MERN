import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import PatientDetails from './pages/PatientDetails'
import Appointments from './pages/Appointments'
import MyPatients from './pages/MyPatients'
import Invoices from './pages/Invoices'
import Staff from './pages/Staff'

const Doctors = () => <div className="p-6 bg-white rounded-card shadow-card"><h2 className="text-2xl font-bold mb-4 text-neutral-800">Doctors Directory</h2><p className="text-neutral-500">Manage doctors profiles, specializations, and availability schedules.</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/patients" element={<Patients />} />
              <Route path="dashboard/patient/:id" element={<PatientDetails />} />
              <Route path="dashboard/appointments" element={<Appointments />} />
              <Route path="dashboard/my-patients" element={<MyPatients />} />
              <Route path="dashboard/staff" element={<Staff />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
