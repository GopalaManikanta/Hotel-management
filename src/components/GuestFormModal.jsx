import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, User, Mail, Phone, MapPin, ShieldCheck, Globe, BedDouble } from 'lucide-react';

const GuestFormModal = ({ isOpen, onClose, onSubmitGuest, initialData = null, title = 'Add New Guest' }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      nationality: 'Indian',
      status: 'Active In-House',
      roomNumber: '101',
      emergencyContact: '',
      notes: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('fullName', initialData.fullName || '');
      setValue('email', initialData.email || '');
      setValue('mobileNumber', initialData.mobileNumber || '');
      setValue('address', initialData.address || '');
      setValue('idProofType', initialData.idProofType || 'Aadhaar Card');
      setValue('idProofNumber', initialData.idProofNumber || '');
      setValue('nationality', initialData.nationality || 'Indian');
      setValue('status', initialData.status || 'Active In-House');
      setValue('roomNumber', initialData.roomNumber || 'N/A');
      setValue('emergencyContact', initialData.emergencyContact || '');
      setValue('notes', initialData.notes || '');
      setValue('image', initialData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    } else {
      reset({
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
        idProofType: 'Aadhaar Card',
        idProofNumber: '',
        nationality: 'Indian',
        status: 'Active In-House',
        roomNumber: '101',
        emergencyContact: '',
        notes: '',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      });
    }
  }, [initialData, isOpen, setValue, reset]);

  const handleFormSubmit = async (data) => {
    const success = await onSubmitGuest(data);
    if (success) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">Register guest contact, identification proof & status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 transition shadow-xs cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Ananya Sharma"
                {...register('fullName', {
                  required: 'Full Name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs font-bold"
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.fullName.message}</p>}
          </div>

          {/* Email & Mobile Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="ananya@example.com"
                  {...register('email', {
                    required: 'Email Address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  {...register('mobileNumber', {
                    required: 'Mobile Number is required',
                    minLength: { value: 8, message: 'Enter a valid mobile number' }
                  })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs font-bold"
                />
              </div>
              {errors.mobileNumber && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.mobileNumber.message}</p>}
            </div>
          </div>

          {/* ID Proof Type & Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ID Proof Type *
              </label>
              <select
                {...register('idProofType')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ID Proof Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 8921-4412-9012"
                  {...register('idProofNumber', { required: 'ID Proof Number is required' })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-600 transition shadow-xs"
                />
              </div>
              {errors.idProofNumber && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.idProofNumber.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Residential Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Street name, City, State, Country"
                {...register('address', { required: 'Address is required' })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
            </div>
            {errors.address && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.address.message}</p>}
          </div>

          {/* Nationality, Status & Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nationality *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Indian"
                  {...register('nationality', { required: 'Nationality is required' })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition shadow-xs"
                />
              </div>
              {errors.nationality && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.nationality.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stay Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="Active In-House">Active In-House</option>
                <option value="VIP Guest">VIP Guest</option>
                <option value="Checked-Out">Checked-Out</option>
                <option value="Registered">Registered</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BedDouble className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 101 or N/A"
                  {...register('roomNumber')}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Emergency Contact & Relation
            </label>
            <input
              type="text"
              placeholder="+91 98765 00000 (Spouse / Family Contact)"
              {...register('emergencyContact')}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
            />
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Guest Preferences & Notes
            </label>
            <textarea
              rows="2"
              placeholder="Room preferences, dietary requests, VIP tags..."
              {...register('notes')}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition shadow-xs"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-200 transition cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer"
            >
              {initialData ? 'Save Guest Changes' : 'Register Guest'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default GuestFormModal;
