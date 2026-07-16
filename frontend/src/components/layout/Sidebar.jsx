import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Stethoscope, CreditCard, HeartPulse, Shield } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  // Define role-based navigation
  const getNavigation = () => {
    if (!user?.role) return [];

    const baseNav = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ];

    const roleNav = {
      admin: [
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Staff', href: '/dashboard/staff', icon: Shield },
        { name: 'Doctors', href: '/doctors', icon: Stethoscope },
        { name: 'Invoices', href: '/invoices', icon: CreditCard },
      ],
      doctor: [
        { name: 'My Patients', href: '/dashboard/my-patients', icon: Users },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
      ],
      receptionist: [
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Invoices', href: '/invoices', icon: CreditCard },
      ],
    };

    return [...baseNav, ...(roleNav[user.role] || [])];
  };

  const navigation = getNavigation();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-primary-600 text-white shadow-sidebar">
      {/* Brand logo */}
      <div className="flex h-16 items-center gap-2 border-b border-primary-500 px-6">
        <HeartPulse className="h-8 w-8 text-secondary-300 animate-pulse-soft" />
        <span className="text-xl font-bold tracking-tight">HealTrack</span>
      </div>

      {/* User Role Badge */}
      {user && (
        <div className="px-4 py-3 border-b border-primary-500">
          <p className="text-xs text-primary-200">Logged in as</p>
          <p className="text-sm font-medium text-white capitalize">{user.name}</p>
          <p className="text-xs text-primary-300 capitalize">{user.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-button px-4 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'text-primary-100 hover:bg-primary-500/50 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-primary-500 p-4 text-center text-xs text-primary-200">
        &copy; {new Date().getFullYear()} HealTrack HMS
      </div>
    </aside>
  );
};

export default Sidebar;
