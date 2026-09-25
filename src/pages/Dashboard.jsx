import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import RevenueSummary from '../components/RevenueSummary';
import RecentBookingsTable from '../components/RecentBookingsTable';
import QuickActions from '../components/QuickActions';
import BookingFormModal from '../components/BookingFormModal';
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';
import GuestPortalHub from '../components/GuestPortalHub';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

import {
  Building2,
  CheckCircle2,
  BedDouble,
  Users,
  LogIn,
  LogOut,
  BookmarkCheck,
  Sparkles,
  PlusCircle,
  Clock,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { kpi, revenue, checkInBooking, checkOutBooking } = useHotel();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [checkInModalBooking, setCheckInModalBooking] = useState(null);
  const [checkOutModalBooking, setCheckOutModalBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isGuestUser = currentUser?.role === 'Guest';

  const handleNewReservationClick = () => {
    setIsBookingModalOpen(true);
  };

  const handleConfirmCheckIn = (bookingId, details) => {
    checkInBooking(bookingId, details);
    toast.success(`✅ Check-In completed! Guest ${checkInModalBooking?.guestName} assigned to Room ${checkInModalBooking?.roomNumber}.`);
    setCheckInModalBooking(null);
  };

  const handleConfirmCheckOut = (bookingId, details) => {
    checkOutBooking(bookingId, details);
    toast.success(`✅ Check-Out completed! Guest ${checkOutModalBooking?.guestName} released Room ${checkOutModalBooking?.roomNumber}.`);
    setCheckOutModalBooking(null);
  };

  const occupancyRate = kpi.totalRooms > 0 ? Math.round((kpi.occupiedRooms / kpi.totalRooms) * 100) : 0;

  return (
    <Layout>
      {isGuestUser ? (
        <GuestPortalHub />
      ) : (
        <div className="space-y-8 bg-white min-h-full">
          {/* Advanced Top Luxury Header & Welcome Deck */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Celestia Grand 5-Star Luxury Suite Control Desk
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                Property Command Center
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Welcome back, <strong className="text-white font-bold">{currentUser?.name || 'Administrator'}</strong>. Real-time front desk operations & inventory management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
              {/* Ticking Seconds Clock */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-white">
                <Clock className="w-4 h-4 text-indigo-300 animate-spin-slow" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">IST Standard Time</div>
                  <div className="font-mono font-black text-sm text-white tracking-wider">{currentTime}</div>
                </div>
              </div>

              {/* Occupancy Meter Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-2.5 text-white">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Occupancy Index</div>
                  <div className="font-black text-sm text-emerald-400 flex items-center gap-1">
                    {occupancyRate}% <span className="text-[10px] text-slate-300 font-normal">({kpi.occupiedRooms}/{kpi.totalRooms})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNewReservationClick}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                New Reservation
              </button>
            </div>
          </div>

          {/* 1. Quick Actions */}
          <section className="bg-white">
            <QuickActions
              onNewReservation={handleNewReservationClick}
              onCheckInClick={(b) => setCheckInModalBooking(b)}
              onCheckOutClick={(b) => setCheckOutModalBooking(b)}
            />
          </section>

          {/* 2. KPI Metrics Grid */}
          <section className="space-y-4 bg-white">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Key Performance Indicators (KPIs)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Rooms */}
              <StatCard
                title="Total Rooms"
                value={kpi.totalRooms}
                icon={Building2}
                color="indigo"
                description="Inventory Capacity"
                trend="up"
                trendValue={`${kpi.totalRooms} Registered`}
              />

              {/* Available Rooms */}
              <StatCard
                title="Available Rooms"
                value={kpi.availableRooms}
                icon={CheckCircle2}
                color="emerald"
                description="Ready for booking"
                trend="up"
                trendValue={`${kpi.availableRooms} Vacant`}
              />

              {/* Occupied Rooms */}
              <StatCard
                title="Occupied Rooms"
                value={kpi.occupiedRooms}
                icon={BedDouble}
                color="purple"
                description="Guests currently in-house"
                trend="up"
                trendValue={`${kpi.occupiedRooms} Active`}
              />

              {/* Total Guests */}
              <StatCard
                title="Total Guests"
                value={kpi.totalGuests}
                icon={Users}
                color="amber"
                description="Active checked-in guests"
                trend="up"
                trendValue="Live Guest Count"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Today's Check-Ins */}
              <StatCard
                title="Today's Check-Ins"
                value={kpi.todayCheckIns}
                icon={LogIn}
                color="emerald"
                description="Expected arriving guests"
                trend="up"
                trendValue={`${kpi.todayCheckIns} Arriving`}
              />

              {/* Today's Check-Outs */}
              <StatCard
                title="Today's Check-Outs"
                value={kpi.todayCheckOuts}
                icon={LogOut}
                color="rose"
                description="Departing guests today"
                trend="down"
                trendValue={`${kpi.todayCheckOuts} Scheduled`}
              />

              {/* Total Bookings */}
              <StatCard
                title="Total Bookings"
                value={kpi.totalBookings}
                icon={BookmarkCheck}
                color="sky"
                description="Cumulative reservation record"
                trend="up"
                trendValue={`${kpi.totalBookings} Total`}
              />
            </div>
          </section>

          {/* 3. Analytics Main Section: Revenue Summary & Recent Bookings */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
            {/* Revenue Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white">
              <RevenueSummary revenue={revenue} />
            </div>

            {/* Recent Bookings Table (7 cols) */}
            <div className="lg:col-span-7 bg-white">
              <RecentBookingsTable
                onNewReservation={handleNewReservationClick}
                onCheckInClick={(b) => setCheckInModalBooking(b)}
                onCheckOutClick={(b) => setCheckOutModalBooking(b)}
              />
            </div>
          </section>

          {/* Booking Form Modal */}
          <BookingFormModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
          />

          {/* Check-In Modal with Guest Specs */}
          {checkInModalBooking && (
            <CheckInModal
              isOpen={!!checkInModalBooking}
              onClose={() => setCheckInModalBooking(null)}
              booking={checkInModalBooking}
              onConfirmCheckIn={handleConfirmCheckIn}
            />
          )}

          {/* Check-Out Modal with Guest Specs */}
          {checkOutModalBooking && (
            <CheckOutModal
              isOpen={!!checkOutModalBooking}
              onClose={() => setCheckOutModalBooking(null)}
              booking={checkOutModalBooking}
              onConfirmCheckOut={handleConfirmCheckOut}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
