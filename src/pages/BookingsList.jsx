import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import BookingFormModal from '../components/BookingFormModal';
import { useHotel } from '../context/HotelContext';
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
  X
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const BookingsList = () => {
  const { bookings, checkInBooking, checkOutBooking, cancelBooking, kpi } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Filtered Bookings Calculation
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.id.toLowerCase().includes(query) ||
        b.guestName.toLowerCase().includes(query) ||
        b.guestEmail?.toLowerCase().includes(query) ||
        b.roomNumber.toLowerCase().includes(query) ||
        b.roomType.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCurrentPage(1);
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
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shadow-xs">
            <AlertCircle className="w-3 h-3 text-slate-500" /> Checked-Out
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

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Bookings & Reservations Engine
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Reservation Directory & Front Desk Ledger
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Live guest bookings, double-booking prevention, express check-in/out triggers, and receipts.
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
                title="Grid Cards View"
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

        {/* Operational KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{kpi.totalBookings} Registered</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Check-Ins</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">{kpi.todayCheckIns} Arriving</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <LogIn className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Check-Outs</span>
              <div className="text-2xl font-black text-rose-600 mt-0.5">{kpi.todayCheckOuts} Scheduled</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <LogOut className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Occupancy Rate</span>
              <div className="text-2xl font-black text-indigo-600 mt-0.5">{kpi.occupancyRate}% Live</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Booking ID, Guest Name, Room #, Email..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Reservation Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-In">Checked-In</option>
                <option value="Checked-Out">Checked-Out</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Active Filter Counter & Reset */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredBookings.length}</strong> reservations found
            </span>

            {(searchTerm || statusFilter !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-3 shadow-xs">
              <CalendarCheck className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Matching Reservations</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Adjust your search term or status filter to locate guest bookings.
            </p>
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Reservation
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold bg-white">
                    <th className="p-4">Booking ID & Guest</th>
                    <th className="p-4">Room Specs</th>
                    <th className="p-4">Stay Dates & Duration</th>
                    <th className="p-4">Billing Specs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
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
                              <span>•</span>
                              <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 font-bold">
                                {b.idProofType || 'Aadhaar'}: {b.idProofNumber || '8921-4412-9012'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                          Room {b.roomNumber}
                        </div>
                        <div className="text-[11px] text-slate-500">{b.roomType}</div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        <div className="flex items-center gap-1">
                          <Moon className="w-3 h-3 text-indigo-600" />
                          <span className="font-bold text-indigo-600">{b.nights || 2} Nights</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{b.checkIn} to {b.checkOut}</div>
                      </td>

                      <td className="p-4 font-black text-indigo-600">
                        <div>{formatINR(b.amount)}</div>
                        <span className="text-[10px] text-slate-400 font-semibold">{b.paymentMethod || 'Card/UPI'}</span>
                      </td>

                      <td className="p-4">{getStatusBadge(b.status)}</td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptBooking(b)}
                          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs inline-flex items-center gap-1 font-bold text-[11px]"
                          title="View Receipt Sheet"
                        >
                          <Receipt className="w-3.5 h-3.5 text-indigo-600" /> Receipt
                        </button>

                        {b.status === 'Confirmed' || b.status === 'Pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => checkInBooking(b.id)}
                              className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                            >
                              <LogIn className="w-3.5 h-3.5 text-emerald-600" /> Check-In
                            </button>
                            <button
                              type="button"
                              onClick={() => cancelBooking(b.id)}
                              className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 px-2 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          </>
                        ) : b.status === 'Checked-In' ? (
                          <button
                            type="button"
                            onClick={() => checkOutBooking(b.id)}
                            className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 px-2.5 py-1 rounded-xl font-bold text-[11px] transition cursor-pointer shadow-xs"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-600" /> Check-Out
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-semibold">Archived</span>
                        )}
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
                    <div className="text-slate-500">{b.guestEmail}</div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 my-2 space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>Room {b.roomNumber} ({b.roomType})</span>
                        <span className="text-indigo-600 font-black">{formatINR(b.amount)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>{b.nights || 2} Nights</span>
                        <span>{b.checkIn} to {b.checkOut}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptBooking(b)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex-1 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-indigo-600" /> Receipt
                  </button>

                  {b.status === 'Confirmed' ? (
                    <button
                      type="button"
                      onClick={() => checkInBooking(b.id)}
                      className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Check-In
                    </button>
                  ) : b.status === 'Checked-In' ? (
                    <button
                      type="button"
                      onClick={() => checkOutBooking(b.id)}
                      className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
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

              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Stay Duration:</span>
                <span className="font-bold text-slate-800">{selectedReceiptBooking.nights || 2} Nights</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-600">{formatINR(selectedReceiptBooking.amount)}</span>
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
