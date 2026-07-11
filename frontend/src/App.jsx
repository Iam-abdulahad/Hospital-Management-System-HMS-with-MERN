import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Placholder views for other dashboard routes
const Patients = () => <div className="p-6 bg-white rounded-card shadow-card"><h2 className="text-2xl font-bold mb-4 text-neutral-800">Patients Directory</h2><p className="text-neutral-500">Manage patient records, histories, and registrations here.</p></div>;
const Appointments = () => <div className="p-6 bg-white rounded-card shadow-card"><h2 className="text-2xl font-bold mb-4 text-neutral-800">Appointments Schedule</h2><p className="text-neutral-500">View, schedule, and cancel appointments with healthcare professionals.</p></div>;
const Doctors = () => <div className="p-6 bg-white rounded-card shadow-card"><h2 className="text-2xl font-bold mb-4 text-neutral-800">Doctors Directory</h2><p className="text-neutral-500">Manage doctors profiles, specializations, and availability schedules.</p></div>;
const Invoices = () => <div className="p-6 bg-white rounded-card shadow-card"><h2 className="text-2xl font-bold mb-4 text-neutral-800">Billing & Invoices</h2><p className="text-neutral-500">Track invoices, billing statements, and payments processing.</p></div>;

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
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
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
