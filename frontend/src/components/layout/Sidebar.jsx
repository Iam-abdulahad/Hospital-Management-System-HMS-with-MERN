import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Stethoscope, CreditCard, HeartPulse } from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Invoices', href: '/invoices', icon: CreditCard },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-primary-600 text-white shadow-sidebar">
      {/* Brand logo */}
      <div className="flex h-16 items-center gap-2 border-b border-primary-500 px-6">
        <HeartPulse className="h-8 w-8 text-secondary-300 animate-pulse-soft" />
        <span className="text-xl font-bold tracking-tight">HealTrack</span>
      </div>

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
