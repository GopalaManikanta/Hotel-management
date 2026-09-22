import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = (data) => {
    const res = forgotPassword(data.email, data.newPassword);
    if (res.success) {
      toast.success(res.message);
      navigate('/login');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-4 shadow-sm">
          <KeyRound className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your registered email and choose a new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-200 sm:rounded-3xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* Registered Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Registered Email
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
                  className={`block w-full pl-11 pr-4 py-2.5 bg-white border ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                  } rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-11 pr-11 py-2.5 bg-white border ${
                    errors.newPassword ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-500'
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
              {errors.newPassword && (
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (val) => val === newPasswordValue || 'Passwords do not match'
                  })}
                  className={`block w-full pl-11 pr-11 py-2.5 bg-white border ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-slate-200 focus:border-indigo-500'
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
                <p className="mt-1.5 text-xs text-rose-600 font-semibold">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center border-t border-slate-100 pt-5">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
