import { Search, LogOut, User as UserIcon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Helper for role badge colors
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-accent-light text-accent';
      case 'doctor':
        return 'bg-primary-light text-primary';
      case 'receptionist':
        return 'bg-warning-light text-warning-dark';
      case 'patient':
      default:
        return 'bg-secondary-light text-secondary';
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-neutral-100 bg-white px-6 shadow-sm">
      {/* Search Bar */}
      <div className="relative w-72">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-neutral-400" />
        </span>
        <input
          type="text"
          placeholder="Search patients, records, doctors..."
          className="w-full rounded-input border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        {/* User Info & Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-neutral-800">{user?.name || 'User'}</p>
            <span
              className={`inline-block rounded-badge px-2.5 py-0.5 text-xs font-semibold capitalize ${getRoleBadgeColor(
                user?.role
              )}`}
            >
              {user?.role || 'Patient'}
            </span>
          </div>

          {/* User Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 ring-2 ring-primary-50">
            {user?.name ? getInitials(user.name) : <UserIcon className="h-5 w-5" />}
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-neutral-200"></div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-button border border-neutral-200 px-3.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
