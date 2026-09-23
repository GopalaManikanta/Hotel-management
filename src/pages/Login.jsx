import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Hotel,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Building2,
  CheckCircle2,
  Star,
  Zap,
  Check
} from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    const res = login(data.email, data.password);
    if (res.success) {
      toast.success(res.message);
      navigate(from, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  const setDemoCredentials = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    toast.info(`Filled credentials for ${email.includes('admin') ? 'Admin' : 'Guest'}`);
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12 select-none">
      
      {/* LEFT COLUMN: Real-Time Luxury Hotel Image Showcase (Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Dark Overlay */}
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
          alt="Grand Horizon Resort Exterior"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950/40" />

        {/* Top Header: Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white p-2.5 rounded-2xl shadow-xl border border-white/20">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Grand Horizon</h1>
              <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest -mt-0.5">
                Luxury Hotel & Resort Suite
              </p>
            </div>
          </div>
        </div>

        {/* Middle Real-Time Feature Overlays */}
        <div className="relative z-10 space-y-6 max-w-xl my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-xs font-bold shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            Enterprise Desk Operations Platform
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Seamless Guest Operations & Real-Time Room Suite.
          </h2>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed font-medium">
            Manage reservations, room availability, guest check-ins, and financial revenue tracking with zero delay in real-time.
          </p>

          {/* Floating Glassmorphism Cards */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center gap-3 mb-1">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">Inventory Sync</span>
              </div>
              <p className="text-2xl font-black text-white">20 Rooms</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Live real-time status updates</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="flex items-center gap-3 mb-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-slate-200">Rating & Safety</span>
              </div>
              <p className="text-2xl font-black text-white">5-Star Standard</p>
              <p className="text-[11px] text-slate-400 mt-0.5">256-Bit SSL Encrypted</p>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges & Testimonial */}
        <div className="relative z-10 border-t border-white/15 pt-6 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Instant Check-In
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Role-Based Access
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              0 Baseline Ready
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            © 2026 Grand Horizon Suite
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Pure White Authentication Form Container */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-md">
            <Hotel className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">Grand Horizon</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest -mt-0.5">
              Hotel Suite
            </p>
          </div>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-8">
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 text-xs font-bold mb-3">
              <Hotel className="w-3.5 h-3.5 text-indigo-600" />
              Portal Authentication
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Sign in with your credentials to access the Grand Horizon Desk.
            </p>
          </div>

          {/* Quick Demo Credentials Panel */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Quick Demo Accounts:
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Click to auto-fill</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDemoCredentials('guest@hotel.com', 'Password@123')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 text-xs font-bold transition flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <span>Guest User</span>
                <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-600 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('admin@hotel.com', 'Password@123')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition flex items-center justify-between group shadow-xs cursor-pointer"
              >
                <span>Admin User</span>
                <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-11 pr-4 py-3 bg-white border ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-11 pr-11 py-3 bg-white border ${
                    errors.password ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer disabled:opacity-50"
              >
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Register Callout */}
          <div className="text-center border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 font-medium mt-8">
          Grand Horizon Hotel Suite v4.2 • Secured Access
        </div>

      </div>

    </div>
  );
};

export default Login;
