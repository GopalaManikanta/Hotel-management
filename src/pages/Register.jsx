import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Shield,
  Hotel,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'Guest',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordValue = watch('password');

  const onSubmit = (data) => {
    const res = registerAuth({
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password
    });

    if (res.success) {
      toast.success(res.message);
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-12 select-none">
      
      {/* LEFT COLUMN: Real-Time Luxury Hotel Image Showcase (Desktop) */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Dark Overlay */}
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
          alt="Grand Horizon Luxury Resort Pool & Lounge"
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
            Join the Enterprise Operations Suite
          </div>

          <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            Create Your Account & Experience Modern Hospitality.
          </h2>

          <p className="text-slate-300 text-sm xl:text-base leading-relaxed font-medium">
            Register as a Guest Customer or Hotel Manager to gain full access to live room availability and desk tools.
          </p>

          {/* Feature Bullets */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-100">Real-Time Inventory Access across 20+ Deluxe Suites</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-100">Role-Based Security for Managers & Guests</span>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 border-t border-white/15 pt-6 flex items-center justify-between text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-4">
            <span>24/7 Security Protocol</span>
            <span>•</span>
            <span>Instant Activation</span>
          </div>

          <div className="text-[11px] text-slate-400">
            © 2026 Grand Horizon Suite
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Pure White Registration Form */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-14 bg-white min-h-screen">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
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

        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-indigo-700 text-xs font-bold mb-3">
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              New Account Registration
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your information below to get started.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-white border ${
                    errors.name ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-white border ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Account Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-indigo-300 transition shadow-xs">
                  <input
                    type="radio"
                    value="Guest"
                    {...register('role')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    Guest Customer
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-indigo-300 transition shadow-xs">
                  <input
                    type="radio"
                    value="Admin"
                    {...register('role')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    Hotel Manager
                  </span>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
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
                  className={`block w-full pl-11 pr-11 py-2.5 bg-white border ${
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
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  className={`block w-full pl-11 pr-11 py-2.5 bg-white border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                Complete Registration
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400 font-medium mt-6">
          Grand Horizon Hotel Suite v4.2 • Registration Portal
        </div>

      </div>

    </div>
  );
};

export default Register;
