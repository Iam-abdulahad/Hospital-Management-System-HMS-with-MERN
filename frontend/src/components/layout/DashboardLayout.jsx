import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar - fixed left */}
      <Sidebar />

      {/* Main content viewport */}
      <div className="flex min-h-screen flex-col pl-64">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page contents */}
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
