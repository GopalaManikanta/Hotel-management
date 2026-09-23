import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, CalendarCheck, BedDouble, User, IndianRupee, Clock, Check } from 'lucide-react';
import { useHotel } from '../context/HotelContext';

const BookingFormModal = ({ isOpen, onClose, initialGuest = null, initialRoom = null }) => {
  const { rooms, guests, addBooking } = useHotel();

  // Filter rooms available for booking
  const availableRoomsList = rooms.filter((r) => r.status === 'Available' || r.number === initialRoom?.number);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      guestName: '',
      guestEmail: '',
      roomNumber: '',
      roomType: 'Deluxe Suite',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      amount: 7500,
      paymentMethod: 'Credit Card / UPI'
    }
  });

  const selectedRoomNumber = watch('roomNumber');

  // Auto update room type & price when room selection changes
  useEffect(() => {
    if (selectedRoomNumber) {
      const room = rooms.find((r) => r.number === selectedRoomNumber);
      if (room) {
        setValue('roomType', room.type);
        setValue('amount', room.price * 2);
      }
    }
  }, [selectedRoomNumber, rooms, setValue]);

  useEffect(() => {
    if (initialGuest) {
      setValue('guestName', initialGuest.fullName || '');
      setValue('guestEmail', initialGuest.email || '');
    }
    if (initialRoom) {
      setValue('roomNumber', initialRoom.number || '');
      setValue('roomType', initialRoom.type || 'Deluxe Suite');
      setValue('amount', (initialRoom.price || 3500) * 2);
    } else if (availableRoomsList.length > 0 && !selectedRoomNumber) {
      setValue('roomNumber', availableRoomsList[0].number);
      setValue('roomType', availableRoomsList[0].type);
      setValue('amount', availableRoomsList[0].price * 2);
    }
  }, [initialGuest, initialRoom, isOpen, setValue]);

  const handleFormSubmit = (data) => {
    const success = addBooking(data);
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
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Create New Reservation</h3>
              <p className="text-xs text-slate-500">Book room, assign guest & register live transaction</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 bg-white">
          
          {/* Guest Selection / Guest Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Guest Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Select or enter guest name"
                list="guest-list-options"
                {...register('guestName', { required: 'Guest name is required' })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
              <datalist id="guest-list-options">
                {guests.map((g) => (
                  <option key={g.id} value={g.fullName}>
                    {g.fullName} ({g.email})
                  </option>
                ))}
              </datalist>
            </div>
            {errors.guestName && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.guestName.message}</p>}
          </div>

          {/* Guest Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Guest Email Address *
            </label>
            <input
              type="email"
              placeholder="guest@example.com"
              {...register('guestEmail', { required: 'Guest email is required' })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
            />
            {errors.guestEmail && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.guestEmail.message}</p>}
          </div>

          {/* Room Selector & Room Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assign Available Room *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BedDouble className="w-4 h-4" />
                </div>
                <select
                  {...register('roomNumber', { required: 'Please select an available room' })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 focus:outline-none focus:border-indigo-600 transition shadow-xs"
                >
                  <option value="">-- Select Available Room --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} - {r.type} (₹{r.price}/night) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>
              {errors.roomNumber && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.roomNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Category
              </label>
              <input
                type="text"
                readOnly
                {...register('roomType')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Check-In & Check-Out Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Check-In Date *
              </label>
              <input
                type="date"
                {...register('checkIn', { required: 'Check-in date is required' })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
              {errors.checkIn && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.checkIn.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Check-Out Date *
              </label>
              <input
                type="date"
                {...register('checkOut', { required: 'Check-out date is required' })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
              {errors.checkOut && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.checkOut.message}</p>}
            </div>
          </div>

          {/* Amount & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Reservation Amount (₹) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="number"
                  {...register('amount', { required: 'Amount is required' })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-emerald-600 focus:outline-none focus:border-indigo-600 transition shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Channel
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="Credit Card / UPI">Credit Card / UPI</option>
                <option value="Cash at Desk">Cash at Desk</option>
                <option value="Corporate Direct Billing">Corporate Direct Billing</option>
              </select>
            </div>
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Confirm & Book Room
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
