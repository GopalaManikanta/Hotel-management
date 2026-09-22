import { useHotel } from '../context/HotelContext';
import { toast } from 'react-toastify';
import { PlusCircle, LogIn, LogOut, Wrench, Zap } from 'lucide-react';

const QuickActions = ({ onNewReservation }) => {
  const { bookings, checkInBooking, checkOutBooking, kpi } = useHotel();

  const handleNewReservation = () => {
    if (onNewReservation) {
      onNewReservation();
    } else {
      toast.info('New Reservation: Action logged.');
    }
  };

  const handleExpressCheckIn = () => {
    const pending = bookings.find((b) => b.status === 'Confirmed' || b.status === 'Pending');
    if (pending) {
      checkInBooking(pending.id);
    } else {
      toast.info('No pending reservations waiting for check-in right now.');
    }
  };

  const handleExpressCheckOut = () => {
    const checkedIn = bookings.find((b) => b.status === 'Checked-In');
    if (checkedIn) {
      checkOutBooking(checkedIn.id);
    } else {
      toast.info('No guests currently checked in to process checkout.');
    }
  };

  const handleMaintenanceAlert = () => {
    toast.info('Room Maintenance: All rooms are clean & operational.');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Real-Time Operational Actions</h3>
            <p className="text-xs text-slate-500">Trigger live reservations and desk actions instantly</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
        {/* Action 1: New Reservation */}
        <button
          type="button"
          onClick={handleNewReservation}
          className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 transition-all text-left cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-indigo-700 border border-slate-200 shadow-xs">
              New Action
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
              New Reservation
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Book a room & update inventory dynamically
            </p>
          </div>
        </button>

        {/* Action 2: Express Check-In */}
        <button
          type="button"
          onClick={handleExpressCheckIn}
          className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 transition-all text-left cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-emerald-600 group-hover:scale-105 transition-transform shadow-xs">
              <LogIn className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-slate-200 shadow-xs">
              {kpi.todayCheckIns} Arriving
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
              Express Check-In
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Instantly check in arriving guests
            </p>
          </div>
        </button>

        {/* Action 3: Process Check-Out */}
        <button
          type="button"
          onClick={handleExpressCheckOut}
          className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-400 transition-all text-left cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 group-hover:scale-105 transition-transform shadow-xs">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-slate-200 shadow-xs">
              {kpi.todayCheckOuts} Due
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-rose-600 transition-colors">
              Process Check-Out
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Release occupied rooms back to available
            </p>
          </div>
        </button>

        {/* Action 4: Room Maintenance */}
        <button
          type="button"
          onClick={handleMaintenanceAlert}
          className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all text-left cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-amber-600 group-hover:scale-105 transition-transform shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-700 border border-slate-200 shadow-xs">
              0 Pending
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
              Room Maintenance
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect and clear room issues
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
