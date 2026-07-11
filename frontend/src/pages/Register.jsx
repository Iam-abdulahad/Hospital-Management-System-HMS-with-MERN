import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, Mail, Lock, User, UserPlus, AlertCircle, Loader } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const { register, token, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-secondary px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative floating bg elements */}
      <div className="absolute inset-0 bg-radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%) pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 rounded-card bg-white p-8 shadow-modal"
      >
        {/* Logo & Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
            <HeartPulse className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-neutral-800 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-neutral-500">Register a new HealTrack management user</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-button bg-accent-light p-4 text-sm text-accent"
          >
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-neutral-400" />
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-input border border-neutral-200 py-3 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-input border border-neutral-200 py-3 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="name@hospital.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-input border border-neutral-200 py-3 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div>
              <label htmlFor="role" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                Portal Access Role
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-neutral-400" />
                </span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-input border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm text-neutral-800 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
                {/* Custom arrow decoration */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-button bg-primary py-3 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-75"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
