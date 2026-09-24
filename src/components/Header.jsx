import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  LogOut,
  CheckCheck,
  Trash2,
  X,
  BedDouble,
  CalendarCheck,
  UserCheck,
  AlertCircle,
  Sparkles,
  Check
} from 'lucide-react';

const Header = ({ onMobileMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const {
    notifications = [],
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    removeNotification
  } = useHotel();

  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const res = logout();
    if (res.success) {
      toast.info(res.message);
      navigate('/login');
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-indigo-600" />;
      case 'room':
        return <BedDouble className="w-4 h-4 text-emerald-600" />;
      case 'guest':
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      case 'cancel':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 cursor-pointer"
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

        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className={`relative p-2 rounded-xl border transition cursor-pointer ${
              isNotifOpen
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 ring-2 ring-indigo-100'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 border-slate-200'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Notifications</h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllNotifications}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                      title="Clear all notifications"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/60 px-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`pb-2 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                    activeTab === 'all'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unread')}
                  className={`pb-2 px-3 text-xs font-bold transition border-b-2 cursor-pointer ${
                    activeTab === 'unread'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white">
                {filteredNotifs.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-xs font-semibold">
                    <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No notifications available
                  </div>
                ) : (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 flex items-start gap-3 transition cursor-pointer group ${
                        n.read ? 'bg-white hover:bg-slate-50/80' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                        {getNotifIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-extrabold text-xs text-slate-900 truncate">
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                        {!n.read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationAsRead(n.id);
                            }}
                            className="p-1 rounded-md hover:bg-indigo-100 text-indigo-600 transition"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(n.id);
                          }}
                          className="p-1 rounded-md hover:bg-rose-100 text-rose-600 transition"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 self-center group-hover:hidden" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      navigate('/bookings');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
                  >
                    View All Hotel Reservations & Operations →
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

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
