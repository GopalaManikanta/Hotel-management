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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
          <Hotel className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to access your Grand Horizon Hotel account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
          
          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-semibold block mb-2">⚡ Quick Fill Demo Accounts:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('guest@hotel.com', 'Password@123')}
                className="flex-1 py-1 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition cursor-pointer"
              >
                Guest User
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@hotel.com', 'Password@123')}
                className="flex-1 py-1 px-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition cursor-pointer"
              >
                Admin User
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-950 border ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className={`block w-full pl-11 pr-11 py-2.5 bg-slate-950 border ${
                    errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
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
