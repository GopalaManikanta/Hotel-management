import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, Hotel, ArrowRight, KeyRound } from 'lucide-react';

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
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-sm">
          <Hotel className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to access your Grand Horizon Hotel Suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-3xl sm:px-10">
          
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-500 font-semibold block mb-2">⚡ Quick Fill Demo Accounts:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('guest@hotel.com', 'Password@123')}
                className="flex-1 py-1 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition cursor-pointer"
              >
                Guest User
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@hotel.com', 'Password@123')}
                className="flex-1 py-1 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition cursor-pointer"
              >
                Admin User
              </button>
            </div>
          </div>

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
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-50 border ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'
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
                  <KeyRound className="w-3 h-3" />
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
                  className={`block w-full pl-11 pr-11 py-2.5 bg-slate-50 border ${
                    errors.password ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-500 focus:bg-white'
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
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
