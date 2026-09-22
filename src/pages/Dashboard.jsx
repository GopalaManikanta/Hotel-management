import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Shield, CheckCircle2, BedDouble, Utensils, CreditCard, Sparkles, Clock, HardDrive } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-10 mb-8 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Grand Horizon Guest Experience
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  {currentUser?.name || 'Guest'}
                </span>
                ! 👋
              </h1>
              <p className="mt-2 text-slate-400 text-sm max-w-xl">
                You are securely logged into your account. Explore hotel rooms, manage reservations, and experience seamless real-time authentication.
              </p>
            </div>

            <div className="flex flex-col gap-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs min-w-[220px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Account Role:</span>
                <span className="font-semibold text-amber-400 flex items-center gap-1">
                  {currentUser?.role === 'Admin' ? <Shield className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3" />}
                  {currentUser?.role || 'Guest'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Email:</span>
                <span className="font-medium text-slate-200 truncate max-w-[140px]">{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Session Status:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 1 Completed Features Checklist */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-400" />
            Module 1: Real-Time Authentication System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-200">User Login & Registration</h3>
                <p className="text-xs text-slate-400 mt-1">Form validation, custom roles (Guest / Admin), and auto-login after register.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-200">Forgot Password Flow</h3>
                <p className="text-xs text-slate-400 mt-1">Real-time credentials update stored persistently in LocalStorage.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-200">Protected & Public Routes</h3>
                <p className="text-xs text-slate-400 mt-1">Route guards prevent unauthorized access to private views.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Modules Preview */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Upcoming Modules Preview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-4">
                <BedDouble className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-200 mb-2">Module 2: Room Booking System</h3>
              <p className="text-xs text-slate-400">Room search, filters (Deluxe, Suite, Executive), date picker check-in/out, and live pricing calculator.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 w-fit mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-200 mb-2">Module 3: Dining & Food Menu</h3>
              <p className="text-xs text-slate-400">In-room dining menu, cart management, meal ordering, and real-time total calculation.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-200 mb-2">Module 4: Checkout & Payment</h3>
              <p className="text-xs text-slate-400">Mock payment gateway integration, invoice generation, and booking history tracking.</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
