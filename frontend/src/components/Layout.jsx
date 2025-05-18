import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-indigo-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`${isOpen ? 'block' : 'hidden'} text-xl font-bold`}>Lead Management</h1>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? '◄' : '►'}
          </button>
        </div>
        <nav className="flex-1">
          <Link to="/" className="block p-4 hover:bg-indigo-700">
            {isOpen ? 'Dashboard' : '🏠'}
          </Link>
          <Link to="/leads" className="block p-4 hover:bg-indigo-700">
            {isOpen ? 'Leads' : '📋'}
          </Link>
          {user?.role === 'super_admin' && (
            <Link to="/users" className="block p-4 hover:bg-indigo-700">
              {isOpen ? 'Users' : '👥'}
            </Link>
          )}
        </nav>
        <button onClick={handleLogout} className="p-4 hover:bg-indigo-700 text-left">
          {isOpen ? 'Logout' : '🚪'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;