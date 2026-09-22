import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, Search, Bell, Calendar, LogOut } from 'lucide-react';

const Header = ({ onMobileMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  const handleNotificationClick = () => {
    toast.info('Notifications: System initialized cleanly at 0 baseline.');
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search room no, guest name, reservation ID..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Right: Date/Time, Notifications & User Info */}
      <div className="flex items-center gap-3">
        {/* Date Time Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-[11px] text-slate-700">{currentDateTime}</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={handleNotificationClick}
          className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border border-slate-200 transition cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[100px]">
              {currentUser?.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
