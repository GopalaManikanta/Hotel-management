import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import { toast } from 'react-toastify';
import {
  Hotel,
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  BarChart3,
  Utensils,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Sparkles,
  X
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const { kpi } = useHotel();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Room Management',
      path: '/rooms',
      icon: BedDouble,
      badge: `${kpi.totalRooms} Rooms`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      name: 'Bookings & Reservations',
      path: '/bookings',
      icon: CalendarCheck,
      badge: `${kpi.totalBookings}`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      name: 'Guest Directory',
      path: '/guests',
      icon: Users,
      badge: `${kpi.totalGuests}`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      name: 'Analytics & Reports',
      path: '/analytics',
      icon: BarChart3,
      badge: null
    },
    {
      name: 'Dining & Services',
      path: '/dining',
      icon: Utensils,
      badge: null
    },
    {
      name: 'System Settings',
      path: '/settings',
      icon: Settings,
      badge: null
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200 text-slate-800 transition-all duration-300 relative select-none shadow-sm">
      
      {/* Top Header & Brand */}
      <div>
        <div className={`h-16 flex items-center px-4 border-b border-slate-200 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white p-2.5 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Hotel className="w-5 h-5 font-bold" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-slate-900">
                  Grand Horizon
                </h1>
                <p className="text-[9px] text-indigo-600 font-bold tracking-widest uppercase -mt-0.5">
                  Hotel Suite
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all group relative ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 border border-indigo-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Tooltip on Collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name} {item.badge ? `(${item.badge})` : ''}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Profile Footer */}
      <div>
        {/* Occupancy Meter (when expanded) */}
        {!isCollapsed && (
          <div className="mx-3 mb-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Live Occupancy
              </span>
              <span className="text-indigo-600 font-bold">{kpi.occupancyRate || 0}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${kpi.occupancyRate || 0}%` }}
              />
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div className={`p-3 border-t border-slate-200 bg-slate-50/60 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              
              {!isCollapsed && (
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</div>
                  <div className="text-[10px] text-indigo-600 flex items-center gap-1 font-semibold">
                    {currentUser?.role === 'Admin' ? <Shield className="w-2.5 h-2.5 text-indigo-600" /> : <User className="w-2.5 h-2.5" />}
                    {currentUser?.role || 'Guest'}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden md:block h-screen sticky top-0 shrink-0 z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
