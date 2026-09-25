import { AlertTriangle, XCircle, X } from 'lucide-react';

const CancelBookingModal = ({ isOpen, onClose, onConfirm, booking }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 text-slate-900 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Confirm Cancellation</h3>
              <p className="text-xs text-slate-500">Reservation {booking.id}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Guest Name:</span>
            <strong className="text-slate-900">{booking.guestName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Room:</span>
            <strong className="text-slate-900">Room {booking.roomNumber} ({booking.roomType})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheduled Dates:</span>
            <span className="font-semibold text-slate-800">{booking.checkIn} to {booking.checkOut}</span>
          </div>
        </div>

        <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 leading-relaxed font-semibold">
          ⚠️ Are you sure you want to cancel this reservation? Room {booking.roomNumber} will be released back to <strong>Available</strong> status instantly in real-time.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 border border-slate-300 cursor-pointer"
          >
            Keep Reservation
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(booking.id);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4" /> Yes, Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
