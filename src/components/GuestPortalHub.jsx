import { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import {
  Key,
  Wifi,
  Sparkles,
  BedDouble,
  Clock,
  CheckCircle2,
  Coffee,
  Receipt,
  LogOut,
  Zap,
  PhoneCall,
  BellRing,
  PlusCircle,
  Copy,
  Car
} from 'lucide-react';
import { toast } from 'react-toastify';
import InvoiceModal from './InvoiceModal';
import BookingFormModal from './BookingFormModal';

const GuestPortalHub = () => {
  const { currentUser } = useAuth();
  const { bookings, checkOutBooking, addNotification } = useHotel();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDND, setIsDND] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Find guest's active booking matching currentUser's email or name
  const activeBooking =
    bookings.find(
      (b) =>
        ((currentUser?.email && b.guestEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser?.name && b.guestName?.toLowerCase() === currentUser.name.toLowerCase())) &&
        (b.status === 'Checked-In' || b.status === 'Confirmed')
    ) ||
    bookings.find(
      (b) =>
        (currentUser?.email && b.guestEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
        (currentUser?.name && b.guestName?.toLowerCase() === currentUser.name.toLowerCase())
    ) ||
    (currentUser?.email === 'guest@hotel.com'
      ? bookings.find((b) => b.guestName === 'John Doe' || b.guestEmail === 'guest@hotel.com')
      : null);

  const handleUnlockDoor = () => {
    setIsUnlocked(true);
    toast.success(`🔑 Bluetooth Key Synced! Room ${activeBooking?.roomNumber || '201'} door unlocked successfully.`);
    setTimeout(() => setIsUnlocked(false), 4000);
  };

  const handleCopyWifi = () => {
    navigator.clipboard?.writeText('SuiteGuest2026');
    toast.info('📶 Wi-Fi password copied to clipboard!');
  };

  const handleToggleDND = () => {
    const nextState = !isDND;
    setIsDND(nextState);
    if (nextState) {
      toast.warning('🌙 Do Not Disturb (DND) mode enabled for your room.');
      addNotification({
        title: `Room ${activeBooking?.roomNumber || '201'} DND Active`,
        message: `Guest ${currentUser?.name} enabled Do Not Disturb mode.`,
        type: 'room'
      });
    } else {
      toast.success('☀️ DND disabled. Housekeeping service active.');
    }
  };

  const handleRequestService = (serviceName) => {
    toast.success(`🛎️ Service request sent: "${serviceName}". Front desk notified.`);
    addNotification({
      title: `Guest Service Request (${serviceName})`,
      message: `Room ${activeBooking?.roomNumber || '201'} requested ${serviceName}.`,
      type: 'guest'
    });
  };

  const handleExpressCheckOut = () => {
    if (!activeBooking) return;
    checkOutBooking(activeBooking.id, activeBooking.roomNumber);
    toast.success('✅ Express Check-Out completed! Invoice sent to your email.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Live Guest Self-Service Portal
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Valued Guest'}!
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl">
              Enjoy 5-star digital hospitality. Control your room keycard, order in-room dining, or request instant room service in real-time.
            </p>
          </div>

          {activeBooking && (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center md:text-right shrink-0">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Active Reservation</span>
              <div className="text-xl font-black text-white mt-0.5">Room {activeBooking.roomNumber}</div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-1">
                <CheckCircle2 className="w-3 h-3" /> {activeBooking.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {activeBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: Digital Room Controls & Keycard */}
          <div className="lg:col-span-7 space-y-6">
            {/* Digital Keycard Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-600" /> Digital Room Keycard
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Encrypted Bluetooth key access for Room {activeBooking.roomNumber}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeBooking.keyCardNumber || 'KEY-9012'}
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col items-center text-center space-y-4 shadow-lg">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${isUnlocked ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/50' : 'bg-white/10 text-indigo-300'}`}>
                  <Key className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {isUnlocked ? 'Door Unlocked!' : `Room ${activeBooking.roomNumber} Lock Ready`}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isUnlocked ? 'Smart Bluetooth latch engaged for 10 seconds' : 'Tap button below to send Bluetooth unlock signal'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleUnlockDoor}
                  disabled={isUnlocked}
                  className="w-full max-w-xs py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUnlocked ? '✓ Unlocked (Latch Open)' : '🔑 Unlock Room Door'}
                </button>
              </div>

              {/* Wi-Fi & Climate Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High-Speed Wi-Fi</span>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-indigo-600" /> Celestia_Guest_5G
                    </div>
                    <p className="text-[11px] text-slate-500">Pass: SuiteGuest2026</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyWifi}
                    className="p-2 rounded-xl bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 shadow-2xs cursor-pointer"
                    title="Copy Wi-Fi Password"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do Not Disturb</span>
                    <div className="text-xs font-bold text-slate-900">
                      {isDND ? '🌙 DND Active' : '☀️ Housekeeping OK'}
                    </div>
                    <p className="text-[11px] text-slate-500">Toggle room privacy</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDND}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isDND ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {isDND ? 'Disable DND' : 'Enable DND'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Guest In-Room Requests */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <BellRing className="w-4 h-4 text-indigo-600" /> Express Room Service Requests
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleRequestService('Fresh Towels & Toiletries')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <Sparkles className="w-5 h-5 mx-auto text-indigo-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Extra Towels</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestService('Morning Coffee & Breakfast')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <Coffee className="w-5 h-5 mx-auto text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Fresh Coffee</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestService('Luggage & Valet Pickup')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <Zap className="w-5 h-5 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Luggage Aid</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestService('Concierge Assistance')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <PhoneCall className="w-5 h-5 mx-auto text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Concierge</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestService('Airport Transfer Shuttle')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <Car className="w-5 h-5 mx-auto text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Airport Taxi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestService('Late Check-Out (+2 Hours Extension)')}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition text-center space-y-1.5 cursor-pointer group"
                >
                  <Clock className="w-5 h-5 mx-auto text-rose-600 group-hover:scale-110 transition-transform" />
                  <span className="block text-xs font-bold text-slate-800">Late Check-Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: Stay Summary & Invoice Ledger */}
          <div className="lg:col-span-5 space-y-6">
            {/* Active Stay Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-indigo-600" /> Active Stay Ledger
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {activeBooking.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-bold text-slate-900 font-mono">{activeBooking.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Room Category</span>
                  <span className="font-bold text-slate-900">{activeBooking.roomType || 'Deluxe Suite'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check-In Date</span>
                  <span className="font-bold text-slate-900">{activeBooking.checkIn}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check-Out Date</span>
                  <span className="font-bold text-slate-900">{activeBooking.checkOut}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-slate-900">{activeBooking.nights || 3} Nights</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Total Folio Amount</span>
                  <span className="font-black text-slate-900 text-sm">₹{activeBooking.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-semibold text-emerald-700">{activeBooking.paymentMethod || 'Credit Card (Visa)'}</span>
                </div>
              </div>

              {/* Invoice & Express Checkout Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceBooking(activeBooking)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-indigo-600" /> View GST Tax Invoice
                </button>

                {activeBooking.status === 'Checked-In' && (
                  <button
                    type="button"
                    onClick={handleExpressCheckOut}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Request Express Check-Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Stay Card -> Express Booking Trigger */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 w-14 h-14 mx-auto flex items-center justify-center">
            <BedDouble className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No Active Room Stay Registered</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You currently have no active check-in. Reserve a luxury room suite now to activate digital keycard access and in-room services.
          </p>
          <button
            type="button"
            onClick={() => setIsBookingModalOpen(true)}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Book Luxury Room Now
          </button>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceBooking && (
        <InvoiceModal
          isOpen={!!selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
          booking={selectedInvoiceBooking}
        />
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingFormModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GuestPortalHub;
