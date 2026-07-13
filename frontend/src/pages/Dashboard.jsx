import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, CreditCard, ArrowUpRight, Activity, Clock, Stethoscope } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../utils/axiosConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/stats');
        setStats([
          {
            name: 'Total Patients',
            value: data.totalPatients.toLocaleString(),
            change: 'Live patient registry',
            icon: Users,
            color: 'border-primary',
            iconColor: 'text-primary bg-primary-light',
          },
          {
            name: 'Today\'s Appointments',
            value: data.todaysAppointments.toLocaleString(),
            change: 'Scheduled for today',
            icon: Calendar,
            color: 'border-secondary',
            iconColor: 'text-secondary bg-secondary-light',
          },
          {
            name: 'Revenue Collected',
            value: `$${Number(data.totalRevenue).toLocaleString()}`,
            change: 'Paid invoices only',
            icon: CreditCard,
            color: 'border-accent',
            iconColor: 'text-accent bg-accent-light',
          }
        ]);
        setActivities(data.recentActivity || []);
      } catch (error) {
        setStats([]);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Container variants for staggered entrance animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-800">
            Welcome back, <span className="text-primary">{user?.name || 'User'}</span>!
          </h1>
          <p className="text-neutral-500">Here's what is happening at your clinic today.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1.5 rounded-button bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            <span>New Appointment</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-card border border-neutral-100 bg-white p-6 shadow-card">
              <div className="h-4 w-24 rounded bg-neutral-100" />
              <div className="mt-4 h-8 w-20 rounded bg-neutral-100" />
              <div className="mt-3 h-3 w-32 rounded bg-neutral-100" />
            </div>
          ))
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className={`rounded-card border-t-4 ${stat.color} bg-white p-6 shadow-card transition-all duration-250 hover:shadow-card-hover hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-500">{stat.name}</span>
                  <div className={`rounded-full p-2.5 ${stat.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-neutral-800">{stat.value}</span>
                  <p className="mt-1 text-xs text-neutral-400 font-medium">{stat.change}</p>
                </div>
              </div>
            );
          })
        )}
      </motion.div>

      {/* Main Grid Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activity Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-card bg-white p-6 shadow-card"
        >
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-neutral-800 font-sans">Live System Activity</h3>
          </div>
          <div className="mt-4 divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                  <div className="h-4 w-2/3 rounded bg-neutral-100" />
                  <div className="h-4 w-20 rounded bg-neutral-100" />
                </div>
              ))
            ) : activities.length === 0 ? (
              <p className="py-6 text-sm text-neutral-500">No recent activity yet.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-secondary-400"></div>
                    <p className="text-sm text-neutral-600 leading-relaxed">{act.text}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 pl-4 text-xs text-neutral-400 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{act.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* System Health / Overview Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-card bg-white p-6 shadow-card"
        >
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <Stethoscope className="h-5 w-5 text-secondary" />
            <h3 className="text-lg font-bold text-neutral-800 font-sans">Specialties Overview</h3>
          </div>
          <div className="mt-6 space-y-4">
            {/* General Practice Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1.5">
                <span>General Medicine</span>
                <span>80% Occupancy</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Pediatrics Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1.5">
                <span>Pediatrics</span>
                <span>45% Occupancy</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* Cardiology Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1.5">
                <span>Cardiology</span>
                <span>92% Occupancy</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-accent rounded-full animate-pulse-soft" style={{ width: '92%' }}></div>
              </div>
            </div>

            {/* Orthopedics Progress */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-600 mb-1.5">
                <span>Orthopedics</span>
                <span>60% Occupancy</span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
