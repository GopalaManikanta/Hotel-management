import { useState } from 'react';
import { LogOut, Key, CheckCircle, Receipt, X, BedDouble, Moon, Calculator } from 'lucide-react';

const CheckOutModal = ({ isOpen, onClose, booking, onConfirmCheckOut }) => {
  if (!isOpen || !booking) return null;

  const [extraCharges, setExtraCharges] = useState(0);
  const [keysReturned, setKeysReturned] = useState(true);
  const [roomNextStatus, setRoomNextStatus] = useState('Available');
  const [notes, setNotes] = useState('Folio paid in full. Key returned.');

  const baseAmount = Number(booking.amount) || 0;
  const grandTotal = baseAmount + Number(extraCharges || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmCheckOut(booking.id, {
      extraCharges: Number(extraCharges),
      finalAmount: grandTotal,
      keysReturned,
      roomNextStatus,
      notes,
      checkOutTime: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    });
    onClose();
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 space-y-0">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-xs">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Express Guest Check-Out & Folio</h3>
              <p className="text-xs text-slate-500">Settle billing folio, verify key return & set room availability</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-800 border border-slate-200 shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white">
          {/* Reservation Card Specs */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-extrabold text-slate-900 text-sm">{booking.guestName}</span>
              <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {booking.id}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <BedDouble className="w-3.5 h-3.5 text-indigo-600" /> Room {booking.roomNumber} ({booking.roomType})
              </span>
              <span className="font-bold text-indigo-600">{formatINR(booking.amount)}</span>
            </div>

            <div className="flex justify-between text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                <Moon className="w-3.5 h-3.5" /> 🌙 {booking.nights || 2} Nights Stay
              </span>
              <span>Checked In: {booking.actualCheckInTime || booking.checkIn}</span>
            </div>

            {booking.keyCardNumber && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700 font-bold">
                <span className="flex items-center gap-1 text-indigo-600">
                  <Key className="w-3.5 h-3.5" /> Issued Key RFID: {booking.keyCardNumber}
                </span>
                <span className="text-emerald-700 font-bold">Key Cards: {booking.keysIssued || 2}</span>
              </div>
            )}
          </div>

          {/* Billing Settlement Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" /> Extra Incidental Charges (₹)
              </label>
              <input
                type="number"
                min="0"
                value={extraCharges}
                onChange={(e) => setExtraCharges(e.target.value)}
                placeholder="Minibar, Late fees..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next Room Availability Status
              </label>
              <select
                value={roomNextStatus}
                onChange={(e) => setRoomNextStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
              >
                <option value="Available">Available (Ready for next guest)</option>
                <option value="Cleaning">Cleaning (Housekeeping Required)</option>
                <option value="Maintenance">Maintenance (Inspection Required)</option>
              </select>
            </div>
          </div>

          {/* Key Return Verification */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="keyReturnCheck"
              checked={keysReturned}
              onChange={(e) => setKeysReturned(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="keyReturnCheck" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1">
              <Key className="w-4 h-4 text-indigo-600" /> RFID Room Key Cards Returned to Front Desk Counter
            </label>
          </div>

          {/* Folio Total Calculation */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 flex justify-between items-center text-xs font-black">
            <span className="text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Receipt className="w-4 h-4 text-indigo-600" /> Grand Total Settlement
            </span>
            <span className="text-base text-indigo-700">{formatINR(grandTotal)}</span>
          </div>

          {/* Check-Out Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Front Desk Check-Out Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add check-out remarks..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer shadow-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Confirm Check-Out & Settle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOutModal;
