import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Hotel, LogOut, User, Shield, Compass, CalendarCheck } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
              Grand Horizon
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase -mt-1">
              Hotel & Resort
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <Compass className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="flex items-center gap-2 text-slate-500 cursor-not-allowed" title="Module 2 Feature">
            <CalendarCheck className="w-4 h-4" />
            My Bookings (Coming Soon)
          </span>
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1">
                    {currentUser.role === 'Admin' ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 hover:border-rose-500/30 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
