import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import BookingFormModal from '../components/BookingFormModal';
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';
import BookingDetailsModal from '../components/BookingDetailsModal';
import CancelBookingModal from '../components/CancelBookingModal';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Search,
  PlusCircle,
  UserCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  LogIn,
  LogOut,
  BedDouble,
  Sparkles,
  RefreshCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Printer,
  Receipt,
  Moon,
  X,
  History,
  Eye,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

const BookingsList = () => {
  const { currentUser } = useAuth();
  const { bookings, checkInBooking, checkOutBooking, updateBookingStatus, cancelBooking } = useHotel();

  // Navigation Sub-tabs: 'all', 'check-in', 'completed', 'cancelled'
  const [activeTab, setActiveTab] = useState('all');
  
  // Real-Time Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [datePresetFilter, setDatePresetFilter] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkInModalBooking, setCheckInModalBooking] = useState(null);
  const [checkOutModalBooking, setCheckOutModalBooking] = useState(null);
  const [detailsModalBooking, setDetailsModalBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Date Presets Calculation Helper
  const isDateInPreset = (checkInDateStr, preset) => {
    if (preset === 'All') return true;
    if (!checkInDateStr) return false;

    const bDate = new Date(checkInDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (preset === 'Today') {
      return bDate.toDateString() === today.toDateString();
    }

    if (preset === 'This Week') {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return bDate >= weekStart && bDate <= weekEnd;
    }

    if (preset === 'This Month') {
      return bDate.getMonth() === today.getMonth() && bDate.getFullYear() === today.getFullYear();
    }

    return true;
  };

  // Filtered Bookings Computation
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 0. Guest Role Isolation: Guests ONLY see their own bookings!
      if (currentUser?.role === 'Guest') {
        const matchesEmail = currentUser?.email && b.guestEmail?.toLowerCase() === currentUser.email.toLowerCase();
        const matchesName = currentUser?.name && b.guestName?.toLowerCase() === currentUser.name.toLowerCase();
        if (!matchesEmail && !matchesName) return false;
      }

      // 1. Search filter across multiple fields
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.id.toLowerCase().includes(query) ||
        b.guestName.toLowerCase().includes(query) ||
        b.guestEmail?.toLowerCase().includes(query) ||
        b.guestMobile?.toLowerCase().includes(query) ||
        b.roomNumber.toLowerCase().includes(query) ||
        b.roomType.toLowerCase().includes(query);

      // 2. Sub-tab filter
      let matchesTab = true;
      if (activeTab === 'check-in') {
        matchesTab = b.status === 'Checked-In' || !!b.actualCheckInTime;
      } else if (activeTab === 'completed') {
        matchesTab = b.status === 'Checked-Out' || b.status === 'Completed' || !!b.actualCheckOutTime;
      } else if (activeTab === 'cancelled') {
        matchesTab = b.status === 'Cancelled';
      }

      // 3. Status filter dropdown
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        if (statusFilter === 'Completed' || statusFilter === 'Checked-Out') {
          matchesStatus = b.status === 'Checked-Out' || b.status === 'Completed';
        } else {
          matchesStatus = b.status === statusFilter;
        }
      }

      // 4. Date preset filter
      const matchesDatePreset = isDateInPreset(b.checkIn, datePresetFilter);

      // 5. Explicit date range filter
      let matchesDateRange = true;
      if (startDateFilter) {
        matchesDateRange = matchesDateRange && new Date(b.checkIn) >= new Date(startDateFilter);
      }
      if (endDateFilter) {
        matchesDateRange = matchesDateRange && new Date(b.checkOut || b.checkIn) <= new Date(endDateFilter);
      }

      return matchesSearch && matchesTab && matchesStatus && matchesDatePreset && matchesDateRange;
    });
  }, [bookings, currentUser, activeTab, searchTerm, statusFilter, datePresetFilter, startDateFilter, endDateFilter]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDatePresetFilter('All');
    setStartDateFilter('');
    setEndDateFilter('');
    setActiveTab('all');
    setCurrentPage(1);
    toast.info('Filters reset to default view.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Checked-In
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
            <CheckCircle className="w-3 h-3 text-indigo-600" /> Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Checked-Out':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
            <AlertCircle className="w-3 h-3 text-slate-500" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <XCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const checkInCount = bookings.filter((b) => b.status === 'Checked-In' || b.actualCheckInTime).length;
  const completedCount = bookings.filter((b) => b.status === 'Checked-Out' || b.status === 'Completed' || b.actualCheckOutTime).length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Real-Time Booking History & Operations Suite
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Booking History & Reservations
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Search, filter by date/status, view complete reservation details, and manage real-time check-in/out and cancellations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* New Reservation Action */}
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Reservation
            </button>
          </div>
        </div>

        {/* Operational KPI Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{bookings.length} Registered</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active In-House</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{checkInCount} Checked-In</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <LogIn className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Completed Stays</span>
              <div className="text-2xl font-black text-slate-700 mt-0.5">{completedCount} Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
              <LogOut className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Cancelled Bookings</span>
              <div className="text-2xl font-black text-rose-600 mt-0.5">{cancelledCount} Cancelled</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Sub-Navigation History Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 bg-white">
          <button
            type="button"
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            All Bookings ({bookings.length})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('check-in'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'check-in'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Checked-In Stays ({checkInCount})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            Completed History ({completedCount})
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('cancelled'); setCurrentPage(1); }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'cancelled'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            <XCircle className="w-4 h-4" />
            Cancelled ({cancelledCount})
          </button>
        </div>

        {/* Search & Comprehensive Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            <Filter className="w-4 h-4 text-indigo-600" /> Real-Time Search & Filter Controls
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search Keywords</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Guest Name, ID, Room #, Mobile..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>
            </div>

            {/* Status Filter Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Filter by Booking Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Booking Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Checked-Out">Completed / Checked-Out</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Quick Date Presets Dropdown */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Quick Date Presets</label>
              <select
                value={datePresetFilter}
                onChange={(e) => {
                  setDatePresetFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today's Check-Ins</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>

            {/* Date Range Start/End Inputs */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Check-In Date Range</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => {
                    setStartDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-800"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => {
                    setEndDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Counter & Reset */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredBookings.length}</strong> matching records
            </span>

            {(searchTerm || statusFilter !== 'All' || datePresetFilter !== 'All' || startDateFilter || endDateFilter || activeTab !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-3 shadow-xs">
              <History className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Matching Reservation Records</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Adjust your search keywords or reset active date/status filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <RefreshCcw className="w-4 h-4" /> Clear All Filters
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold bg-white">
                    <th className="p-4">Booking Specs & Guest Profile</th>
                    <th className="p-4">Room & Amount</th>
                    <th className="p-4">Dates & Duration</th>
                    <th className="p-4">Operational Timestamps</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      {/* Guest Specs */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {b.avatar || 'G'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{b.guestName}</div>
                            <div className="text-[10px] text-indigo-600 font-bold">{b.id} • {b.guestEmail}</div>
                            <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                              <span>📱 {b.guestMobile || '+91 98765 43210'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Room & Amount */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                          Room {b.roomNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">{b.roomType || 'Standard Room'}</div>
                        <div className="font-black text-indigo-600 text-xs mt-1">{formatINR(b.amount)}</div>
                      </td>

                      {/* Stay Duration & Dates */}
                      <td className="p-4 font-semibold text-slate-700">
                        <div className="inline-flex items-center gap-1 text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 mb-1">
                          <Moon className="w-3 h-3 text-indigo-600" />
                          <span>🌙 {b.nights || 2} Nights</span>
                        </div>
                        <div className="text-[11px] text-slate-600">{b.checkIn} to {b.checkOut}</div>
                      </td>

                      {/* Check-In / Check-Out Timestamps Log */}
                      <td className="p-4 text-xs">
                        {b.actualCheckInTime ? (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <LogIn className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>In: {b.actualCheckInTime}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400">In: Pending</div>
                        )}

                        {b.actualCheckOutTime ? (
                          <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1 mt-0.5">
                            <LogOut className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Out: {b.actualCheckOutTime}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 mt-0.5">Out: Scheduled</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {getStatusBadge(b.status)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setDetailsModalBooking(b)}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition cursor-pointer shadow-xs inline-flex items-center gap-1 font-bold text-[11px]"
                          title="View Complete Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" /> Details
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedReceiptBooking(b)}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition cursor-pointer shadow-xs inline-flex items-center gap-1 font-bold text-[11px]"
                          title="Print Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5 text-indigo-600" /> Receipt
                        </button>

                        {b.status === 'Confirmed' || b.status === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setCheckInModalBooking(b)}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                            >
                              <LogIn className="w-3.5 h-3.5" /> Check-In
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancelModalBooking(b)}
                              className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 px-2 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancel
                            </button>
                          </>
                        ) : b.status === 'Checked-In' ? (
                          <button
                            type="button"
                            onClick={() => setCheckOutModalBooking(b)}
                            className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Check-Out
                          </button>
                        ) : b.status === 'Checked-Out' ? (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(b.id, 'Completed')}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Complete
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBookings.map((b) => (
              <div key={b.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="text-xs font-black text-indigo-600">{b.id}</span>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-extrabold text-slate-900 text-base">{b.guestName}</div>
                    <div className="text-slate-500">{b.guestEmail} • 📱 {b.guestMobile || '+91 98765 43210'}</div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 my-2 space-y-1.5">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Room {b.roomNumber} ({b.roomType})</span>
                        <span className="text-indigo-600 font-black">{formatINR(b.amount)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                        <span className="text-indigo-600 font-extrabold flex items-center gap-1">
                          <Moon className="w-3 h-3 text-indigo-600" /> 🌙 {b.nights || 2} Nights
                        </span>
                        <span>{b.checkIn} to {b.checkOut}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailsModalBooking(b)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex-1 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" /> Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedReceiptBooking(b)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex-1 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" /> Receipt
                  </button>

                  {b.status === 'Confirmed' || b.status === 'Pending' ? (
                    <button
                      type="button"
                      onClick={() => setCheckInModalBooking(b)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Check-In
                    </button>
                  ) : b.status === 'Checked-In' ? (
                    <button
                      type="button"
                      onClick={() => setCheckOutModalBooking(b)}
                      className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Check-Out
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 bg-white">
            <span className="text-xs text-slate-500 font-semibold">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pNum
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={!!detailsModalBooking}
        onClose={() => setDetailsModalBooking(null)}
        booking={detailsModalBooking}
        onCheckIn={(b) => setCheckInModalBooking(b)}
        onCheckOut={(b) => setCheckOutModalBooking(b)}
        onCancel={(b) => setCancelModalBooking(b)}
        onUpdateStatus={(id, s) => updateBookingStatus(id, s)}
        onOpenReceipt={(b) => setSelectedReceiptBooking(b)}
      />

      {/* Real-Time Express Check-In Modal */}
      <CheckInModal
        isOpen={!!checkInModalBooking}
        onClose={() => setCheckInModalBooking(null)}
        booking={checkInModalBooking}
        onConfirmCheckIn={(id, data) => checkInBooking(id, data)}
      />

      {/* Real-Time Express Check-Out & Folio Settlement Modal */}
      <CheckOutModal
        isOpen={!!checkOutModalBooking}
        onClose={() => setCheckOutModalBooking(null)}
        booking={checkOutModalBooking}
        onConfirmCheckOut={(id, data) => checkOutBooking(id, data)}
      />

      {/* Real-Time Cancel Booking Confirmation Modal */}
      <CancelBookingModal
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        booking={cancelModalBooking}
        onConfirm={(id) => cancelBooking(id)}
      />

      {/* Printable Booking Confirmation Receipt Modal */}
      {selectedReceiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 text-slate-900 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
                <Receipt className="w-5 h-5 text-indigo-600" />
                Booking Confirmation Receipt
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptBooking(null)}
                className="p-1 rounded-xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-400 font-bold uppercase">Booking Reference</span>
                <span className="font-mono font-black text-indigo-600 text-sm">{selectedReceiptBooking.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Guest Name:</span>
                <strong className="text-slate-900">{selectedReceiptBooking.guestName} ({selectedReceiptBooking.guestEmail})</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Mobile Phone:</span>
                <strong className="text-slate-900">{selectedReceiptBooking.guestMobile || '+91 98765 43210'}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Verified ID Proof:</span>
                <strong className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedReceiptBooking.idProofType || 'Aadhaar Card'}: {selectedReceiptBooking.idProofNumber || '8921-4412-9012'}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Assigned Room:</span>
                <strong className="text-indigo-600">Room {selectedReceiptBooking.roomNumber} ({selectedReceiptBooking.roomType})</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Check-In / Check-Out:</span>
                <span className="font-semibold text-slate-800">{selectedReceiptBooking.checkIn} to {selectedReceiptBooking.checkOut}</span>
              </div>

              {selectedReceiptBooking.actualCheckInTime && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Actual Check-In Timestamp:</span>
                  <span>{selectedReceiptBooking.actualCheckInTime}</span>
                </div>
              )}

              {selectedReceiptBooking.actualCheckOutTime && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Actual Check-Out Timestamp:</span>
                  <span>{selectedReceiptBooking.actualCheckOutTime}</span>
                </div>
              )}

              {selectedReceiptBooking.keyCardNumber && (
                <div className="flex justify-between text-indigo-600 font-bold">
                  <span>RFID Key Card:</span>
                  <span>{selectedReceiptBooking.keyCardNumber} ({selectedReceiptBooking.keysIssued || 2} cards)</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Stay Duration:</span>
                <span className="font-bold text-slate-800">🌙 {selectedReceiptBooking.nights || 2} Nights</span>
              </div>

              {selectedReceiptBooking.extraCharges > 0 && (
                <div className="flex justify-between text-slate-700 font-bold">
                  <span>Incidental / Extra Charges:</span>
                  <span>{formatINR(selectedReceiptBooking.extraCharges)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black">
                <span>Total Amount Settled:</span>
                <span className="text-emerald-600">{formatINR(selectedReceiptBooking.finalAmount || selectedReceiptBooking.amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default BookingsList;
