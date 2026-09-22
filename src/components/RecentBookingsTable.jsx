import { Calendar, BedDouble, UserCheck, Clock, CheckCircle, AlertCircle, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

const RecentBookingsTable = ({ onNewReservation }) => {
  const { bookings, checkInBooking, checkOutBooking } = useHotel();

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-emerald-700 border border-slate-200 shadow-xs">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Checked-In
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-indigo-700 border border-slate-200 shadow-xs">
            <CheckCircle className="w-3 h-3 text-indigo-600" /> Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-amber-700 border border-slate-200 shadow-xs">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Checked-Out':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-xs">
            <AlertCircle className="w-3 h-3 text-slate-500" /> Checked-Out
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Table Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                Recent Guest Reservations
                <span className="text-[10px] bg-white text-indigo-700 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs font-bold">
                  {bookings.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-500">Live guest bookings with real-time check-in/out triggers</p>
            </div>
          </div>
        </div>

        {/* Conditional Empty State or Table */}
        {bookings.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 p-6 shadow-xs">
            <div className="p-4 rounded-2xl bg-white text-indigo-600 border border-slate-200 mb-3 shadow-xs">
              <Calendar className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No Active Bookings (0 Baseline)</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Your property system is completely clean and ready. Click below to register your first reservation!
            </p>
            <button
              type="button"
              onClick={onNewReservation}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Create First Reservation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse bg-white">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold bg-white">
                  <th className="pb-3">Guest</th>
                  <th className="pb-3">Room Details</th>
                  <th className="pb-3">Dates</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition bg-white">
                    {/* Guest Info */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-indigo-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {b.avatar || 'G'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{b.guestName}</div>
                          <div className="text-[11px] text-slate-500">{b.guestEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Room Details */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Room {b.roomNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{b.roomType}</div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 text-slate-700">
                      <div className="font-semibold">{b.checkIn}</div>
                      <div className="text-[11px] text-slate-500">to {b.checkOut}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 font-extrabold text-indigo-600">
                      {formatINR(b.amount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 text-right">
                      {b.status === 'Confirmed' || b.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => checkInBooking(b.id)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer shadow-xs"
                        >
                          <LogIn className="w-3 h-3 text-emerald-600" /> Check-In
                        </button>
                      ) : b.status === 'Checked-In' ? (
                        <button
                          type="button"
                          onClick={() => checkOutBooking(b.id)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer shadow-xs"
                        >
                          <LogOut className="w-3 h-3 text-rose-600" /> Check-Out
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-semibold">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentBookingsTable;
