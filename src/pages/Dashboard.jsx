import { useState } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import RevenueSummary from '../components/RevenueSummary';
import RecentBookingsTable from '../components/RecentBookingsTable';
import QuickActions from '../components/QuickActions';
import BookingFormModal from '../components/BookingFormModal';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

import {
  Building2,
  CheckCircle2,
  BedDouble,
  Users,
  LogIn,
  LogOut,
  BookmarkCheck,
  Sparkles,
  RotateCcw,
  Shield,
  User,
  PlusCircle
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { kpi, revenue, resetToCleanState } = useHotel();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const handleNewReservationClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-8 bg-white min-h-full">
        
        {/* Top Header & User Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-indigo-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Celestia Grand Luxury Suite
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Property Dashboard & Desk
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, <span className="text-indigo-600 font-bold">{currentUser?.name}</span>! System initialized at <strong className="text-emerald-600">0 Baseline</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNewReservationClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 font-bold" />
              New Reservation
            </button>

            <button
              type="button"
              onClick={resetToCleanState}
              className="bg-white border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer shadow-xs"
              title="Reset state to 0 baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Baseline
            </button>

            <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl flex items-center gap-2 text-xs text-slate-700 shadow-xs">
              {currentUser?.role === 'Admin' ? <Shield className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4 text-indigo-600" />}
              <span>Role: <strong className="text-slate-900">{currentUser?.role || 'Guest'}</strong></span>
            </div>
          </div>
        </div>

        {/* 1. Quick Actions */}
        <section className="bg-white">
          <QuickActions onNewReservation={handleNewReservationClick} />
        </section>

        {/* 2. KPI Metrics Grid */}
        <section className="space-y-4 bg-white">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Key Performance Indicators (KPIs) - 0 Baseline
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
            <RecentBookingsTable onNewReservation={handleNewReservationClick} />
          </div>
        </section>

      </div>

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </Layout>
  );
};

export default Dashboard;
