import { useState, useEffect } from 'react';
import { LogIn, Key, ShieldCheck, UserCheck, X, BedDouble, Moon, Calendar } from 'lucide-react';

const CheckInModal = ({ isOpen, onClose, booking, onConfirmCheckIn }) => {
  if (!isOpen || !booking) return null;

  const [keyCardNumber, setKeyCardNumber] = useState('');
  const [keysIssued, setKeysIssued] = useState(2);
  const [idVerified, setIdVerified] = useState(true);
  const [notes, setNotes] = useState('Physical ID verified at Front Desk counter.');

  useEffect(() => {
    if (booking) {
      setKeyCardNumber(booking.keyCardNumber || `KEY-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [booking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmCheckIn(booking.id, {
      keyCardNumber,
      keysIssued: Number(keysIssued),
      idVerified,
      notes,
      checkInTime: new Date().toLocaleString('en-IN', {
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
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Express Guest Check-In</h3>
              <p className="text-xs text-slate-500">Verify guest credentials and assign room key card</p>
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
              <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
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
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {booking.checkIn} to {booking.checkOut}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-emerald-800 font-semibold">
              <span>📱 {booking.guestMobile || '+91 98765 43210'}</span>
              <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold text-[11px]">
                {booking.idProofType || 'Aadhaar Card'}: {booking.idProofNumber || '8921-4412-9012'}
              </span>
            </div>
          </div>

          {/* Form Fields: Key Card Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-indigo-600" /> Key Card RFID Number
              </label>
              <input
                type="text"
                required
                value={keyCardNumber}
                onChange={(e) => setKeyCardNumber(e.target.value)}
                placeholder="e.g. KEY-9081"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keys Issued
              </label>
              <select
                value={keysIssued}
                onChange={(e) => setKeysIssued(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
              >
                <option value={1}>1 RFID Card</option>
                <option value={2}>2 RFID Cards</option>
                <option value={3}>3 RFID Cards</option>
              </select>
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <input
              type="checkbox"
              id="idCheck"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="idCheck" className="text-xs font-bold text-emerald-800 cursor-pointer flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Physical ID Proof Presented & Scanned
            </label>
          </div>

          {/* Front Desk Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Check-In Front Desk Remarks
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add check-in remarks..."
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" /> Confirm Check-In & Issue Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckInModal;
