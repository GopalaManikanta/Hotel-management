import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, User, Shield, Hotel, UserPlus, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
          <Hotel className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
          Create Your Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Join Grand Horizon Hotel to book luxury rooms & manage reservations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-950 border ${
                    errors.name ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition`}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
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
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`block w-full pl-11 pr-4 py-2.5 bg-slate-950 border ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Account Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="radio"
                    value="Guest"
                    {...register('role')}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    Guest / Customer
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                  <input
                    type="radio"
                    value="Admin"
                    {...register('role')}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    Hotel Manager
                  </span>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
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
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase and a number'
                    }
                  })}
                  className={`block w-full pl-11 pr-11 py-2.5 bg-slate-950 border ${
                    errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordValue || 'Passwords do not match'
                  })}
                  className={`block w-full pl-11 pr-11 py-2.5 bg-slate-950 border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  } rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                Complete Registration
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
