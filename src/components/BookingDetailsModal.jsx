import {
  CalendarCheck,
  User,
  Mail,
  Phone,
  ShieldCheck,
  BedDouble,
  Clock,
  LogIn,
  LogOut,
  Key,
  Receipt,
  X,
  Printer,
  CheckCircle,
  AlertCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

const BookingDetailsModal = ({
  isOpen,
  onClose,
  booking,
  onCheckIn,
  onCheckOut,
  onCancel,
  onUpdateStatus,
  onOpenReceipt
}) => {
  if (!isOpen || !booking) return null;

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <User className="w-3.5 h-3.5 text-emerald-600" /> Checked-In (In-House)
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" /> Confirmed Reservation
          </span>
        );
      case 'Completed':
      case 'Checked-Out':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 text-slate-600" /> Completed Stay
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">Reservation Details</h3>
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                  {booking.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Comprehensive guest stay parameters & transaction ledger.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 bg-white text-slate-800 text-xs">
          {/* Status & Quick Overview Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Booking Status</span>
              <div>{getStatusBadge(booking.status)}</div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Folio Amount</span>
              <div className="text-xl font-black text-indigo-600">{formatINR(booking.amount)}</div>
            </div>
          </div>

          {/* Section 1: Guest Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-indigo-600" /> Guest Profile & ID Verification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200 bg-white">
              <div>
                <span className="text-slate-400 font-medium">Guest Full Name</span>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{booking.guestName}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Email Address</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {booking.guestEmail}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Contact Phone</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {booking.guestMobile || '+91 98765 43210'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Government ID Proof</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {booking.idProofType || 'Aadhaar Card'}: {booking.idProofNumber || '8921-4412-9012'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Room & Accommodation Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <BedDouble className="w-4 h-4 text-indigo-600" /> Room Allocation & Stay Duration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-slate-200 bg-white">
              <div>
                <span className="text-slate-400 font-medium">Assigned Room</span>
                <p className="font-black text-slate-900 text-sm mt-0.5">Room {booking.roomNumber}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Room Category</span>
                <p className="font-bold text-slate-800 mt-0.5">{booking.roomType || 'Standard Room'}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Stay Duration</span>
                <p className="font-bold text-indigo-600 mt-0.5">🌙 {booking.nights || 2} Nights</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Scheduled Check-In</span>
                <p className="font-semibold text-slate-800 mt-0.5">{booking.checkIn}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Scheduled Check-Out</span>
                <p className="font-semibold text-slate-800 mt-0.5">{booking.checkOut}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Key Card Issued</span>
                <p className="font-bold text-indigo-600 mt-0.5 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> {booking.keyCardNumber || 'KEY-9012'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Timestamp Operations Log */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-indigo-600" /> Real-Time Operations Timestamps Log
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" /> Actual Check-In Timestamp
                </span>
                <p className="font-bold text-emerald-700 mt-1">
                  {booking.actualCheckInTime || 'Pending Check-In Execution'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5 text-rose-600" /> Actual Check-Out Timestamp
                </span>
                <p className="font-bold text-rose-700 mt-1">
                  {booking.actualCheckOutTime || 'Scheduled for Check-Out'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Financial & Tax Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-indigo-600" /> GST Tax & Billing Ledger
            </h4>

            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges Base Amount</span>
                <span className="font-bold text-slate-900">{formatINR(booking.baseAmount || Math.round(booking.amount * 0.85))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (6%) + SGST (6%) Tax (12% Total)</span>
                <span className="font-bold text-slate-900">{formatINR(booking.taxAmount || Math.round(booking.amount * 0.15))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Settlement Status</span>
                <span className="font-bold text-emerald-700">{booking.paymentMethod || 'Credit Card / UPI'} (Paid in Full)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-sm text-slate-900">
                <span>Grand Total Settled</span>
                <span className="text-indigo-600">{formatINR(booking.amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenReceipt) onOpenReceipt(booking);
            }}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-indigo-600" /> Print Tax Receipt
          </button>

          <div className="flex items-center gap-2">
            {booking.status === 'Confirmed' || booking.status === 'Pending' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onCheckIn) onCheckIn(booking);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Express Check-In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onCancel) onCancel(booking);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" /> Cancel Booking
                </button>
              </>
            ) : booking.status === 'Checked-In' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onCheckOut) onCheckOut(booking);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Express Check-Out
              </button>
            ) : booking.status === 'Checked-Out' ? (
              <button
                type="button"
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(booking.id, 'Completed');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" /> Mark Stay Completed
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
