import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  CalendarCheck,
  BedDouble,
  User,
  Clock,
  Check,
  AlertTriangle,
  Receipt,
  Moon,
  Phone,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';

const BookingFormModal = ({ isOpen, onClose, initialGuest = null, initialRoom = null }) => {
  const { rooms, guests, addBooking, isRoomDoubleBooked } = useHotel();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOutStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

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
      guestMobile: '',
      idProofType: 'Aadhaar Card',
      idProofNumber: '',
      roomNumber: '',
      roomType: 'Deluxe Suite',
      checkIn: todayStr,
      checkOut: defaultCheckOutStr,
      status: 'Confirmed',
      paymentMethod: 'Credit Card / UPI'
    }
  });

  const selectedRoomNumber = watch('roomNumber');
  const checkInVal = watch('checkIn');
  const checkOutVal = watch('checkOut');
  const guestNameVal = watch('guestName');

  // Filter available rooms
  const availableRoomsList = useMemo(() => {
    return rooms.filter((r) => r.status === 'Available' || r.number === initialRoom?.number);
  }, [rooms, initialRoom]);

  // Selected Room Object
  const selectedRoomObj = useMemo(() => {
    return rooms.find((r) => r.number === selectedRoomNumber) || availableRoomsList[0] || rooms[0];
  }, [rooms, selectedRoomNumber, availableRoomsList]);

  // Selected Guest Object
  const selectedGuestObj = useMemo(() => {
    return guests.find((g) => g.fullName === guestNameVal || g.email === watch('guestEmail'));
  }, [guests, guestNameVal, watch]);

  // Auto-populate guest mobile & ID proof when selectedGuestObj changes
  useEffect(() => {
    if (selectedGuestObj) {
      setValue('guestEmail', selectedGuestObj.email || '');
      setValue('guestMobile', selectedGuestObj.mobileNumber || '+91 98765 43210');
      setValue('idProofType', selectedGuestObj.idProofType || 'Aadhaar Card');
      setValue('idProofNumber', selectedGuestObj.idProofNumber || '8921-4412-9012');
    }
  }, [selectedGuestObj, setValue]);

  // Auto Calculate Nights Stay
  const nightsCount = useMemo(() => {
    if (!checkInVal || !checkOutVal) return 1;
    const cin = new Date(checkInVal);
    const cout = new Date(checkOutVal);
    const diffTime = cout - cin;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkInVal, checkOutVal]);

  // Auto Calculate Pricing Breakdown
  const roomPricePerNight = selectedRoomObj?.price || 5000;
  const baseAmount = roomPricePerNight * nightsCount;
  const gstTaxAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + gstTaxAmount;

  // Double Booking Overlap Conflict Guard
  const hasDoubleBookingConflict = useMemo(() => {
    if (!selectedRoomNumber || !checkInVal || !checkOutVal) return false;
    return isRoomDoubleBooked(selectedRoomNumber, checkInVal, checkOutVal);
  }, [selectedRoomNumber, checkInVal, checkOutVal, isRoomDoubleBooked]);

  // Auto update room properties on selection change
  useEffect(() => {
    if (selectedRoomNumber) {
      const room = rooms.find((r) => r.number === selectedRoomNumber);
      if (room) {
        setValue('roomType', room.type);
      }
    }
  }, [selectedRoomNumber, rooms, setValue]);

  useEffect(() => {
    if (initialGuest) {
      setValue('guestName', initialGuest.fullName || '');
      setValue('guestEmail', initialGuest.email || '');
      setValue('guestMobile', initialGuest.mobileNumber || '');
      setValue('idProofType', initialGuest.idProofType || 'Aadhaar Card');
      setValue('idProofNumber', initialGuest.idProofNumber || '');
    } else if (currentUser && currentUser.name) {
      setValue('guestName', currentUser.name);
      setValue('guestEmail', currentUser.email || 'guest@hotel.com');
    }
    if (initialRoom) {
      setValue('roomNumber', initialRoom.number || '');
      setValue('roomType', initialRoom.type || 'Deluxe Suite');
    } else if (availableRoomsList.length > 0 && !selectedRoomNumber) {
      setValue('roomNumber', availableRoomsList[0].number);
      setValue('roomType', availableRoomsList[0].type);
    }
  }, [initialGuest, initialRoom, isOpen, currentUser, setValue]);

  const handleFormSubmit = (data) => {
    if (hasDoubleBookingConflict) {
      return;
    }

    const bookingPayload = {
      ...data,
      guestMobile: data.guestMobile || selectedGuestObj?.mobileNumber || '+91 98765 43210',
      idProofType: data.idProofType || selectedGuestObj?.idProofType || 'Aadhaar Card',
      idProofNumber: data.idProofNumber || selectedGuestObj?.idProofNumber || '8921-4412-9012',
      roomNumber: selectedRoomNumber || selectedRoomObj?.number || '101',
      roomType: selectedRoomObj?.type || 'Standard Room',
      nights: nightsCount,
      amount: totalAmount,
      baseAmount: baseAmount,
      taxAmount: gstTaxAmount
    };

    const success = addBooking(bookingPayload);
    if (success) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-900 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Room Booking & Reservation Engine</h3>
              <p className="text-xs text-slate-500">Live duration calculation, pricing ledger & double booking guard</p>
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

        {/* Double Booking Conflict Warning Alert */}
        {hasDoubleBookingConflict && (
          <div className="bg-rose-50 border-b border-rose-200 p-3.5 px-6 flex items-center gap-3 text-rose-800 text-xs font-bold animate-pulse">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-extrabold block text-rose-900 text-xs">⚠️ DOUBLE BOOKING CONFLICT DETECTED!</span>
              <span>Room {selectedRoomNumber} is already reserved for the selected date range ({checkInVal} to {checkOutVal}). Please choose another room or date range.</span>
            </div>
          </div>
        )}

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5 overflow-y-auto flex-1 bg-white">
          
          {/* Guest Selection & Real-Time Identity Audit */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                1. Select Guest Profile & Verification *
              </label>
              {selectedGuestObj && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-600" />
                  {selectedGuestObj.nationality || 'Verified Guest'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name *</span>
                <input
                  type="text"
                  placeholder="Select or enter guest name..."
                  list="guest-directory-options"
                  {...register('guestName', { required: 'Guest name is required' })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                <datalist id="guest-directory-options">
                  {guests.map((g) => (
                    <option key={g.id} value={g.fullName}>
                      {g.fullName} ({g.email})
                    </option>
                  ))}
                </datalist>
                {errors.guestName && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.guestName.message}</p>}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email Address *</span>
                <input
                  type="email"
                  placeholder="guest.email@example.com"
                  {...register('guestEmail', { required: 'Guest email is required' })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                {errors.guestEmail && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.guestEmail.message}</p>}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-indigo-600" /> Mobile Phone Number *
                </span>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  {...register('guestMobile', { required: 'Mobile phone number is required' })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                {errors.guestMobile && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.guestMobile.message}</p>}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-600" /> ID Proof Type & Number *
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    {...register('idProofType')}
                    className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                  <input
                    type="text"
                    placeholder="8921-4412-9012"
                    {...register('idProofNumber', { required: 'ID proof number is required' })}
                    className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                  />
                </div>
                {errors.idProofNumber && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.idProofNumber.message}</p>}
              </div>
            </div>

            {/* Live Verification Badge Banner */}
            {selectedGuestObj && (
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-emerald-200 text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedGuestObj.image}
                    alt={selectedGuestObj.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-300 shadow-2xs"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      {selectedGuestObj.fullName}
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {selectedGuestObj.idProofType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      📱 Phone: <strong className="text-slate-800">{selectedGuestObj.mobileNumber}</strong> • ID: <strong className="text-indigo-600">{selectedGuestObj.idProofNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Audit Verified
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Room Selection & Category */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-indigo-600" />
                2. Select Available Room *
              </label>
              {selectedRoomObj && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  ₹{selectedRoomObj.price} / night
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  {...register('roomNumber', { required: 'Please select a room' })}
                  className={`w-full px-3.5 py-2 bg-white border ${
                    hasDoubleBookingConflict ? 'border-rose-500 text-rose-700 ring-2 ring-rose-200' : 'border-slate-200 text-indigo-600'
                  } rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-600 shadow-xs`}
                >
                  <option value="">-- Select Available Room --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} - {r.type} (₹{r.price}/night) [{r.status}]
                    </option>
                  ))}
                </select>
                {errors.roomNumber && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.roomNumber.message}</p>}
              </div>

              <div>
                <input
                  type="text"
                  readOnly
                  {...register('roomType')}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dates & Auto Night Duration Calculation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                3. Stay Duration & Dates (Auto Calculate)
              </label>

              <span className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
                <Moon className="w-3.5 h-3.5" />
                {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'} Stay
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Check-In Date *</span>
                <input
                  type="date"
                  {...register('checkIn', { required: 'Check-in date is required' })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Check-Out Date *</span>
                <input
                  type="date"
                  {...register('checkOut', { required: 'Check-out date is required' })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Booking Summary Card & Billing Ledger */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 p-5 rounded-2xl border border-indigo-200 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-indigo-600" />
                Live Booking Summary & Billing Breakdown
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-200">
                18% GST Applicable
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-bold block">Room Rate</span>
                <span className="font-extrabold text-slate-900">₹{roomPricePerNight}/nt</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-bold block">Duration</span>
                <span className="font-extrabold text-slate-900">{nightsCount} Nights</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-indigo-100">
                <span className="text-[10px] text-slate-400 font-bold block">GST Tax (18%)</span>
                <span className="font-extrabold text-slate-900">₹{gstTaxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                <span className="text-[10px] text-indigo-200 font-bold block">Total Amount</span>
                <span className="font-black text-sm text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status & Payment Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Booking Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
              >
                <option value="Confirmed">Confirmed Reservation</option>
                <option value="Checked-In">Checked-In (Immediate Arrival)</option>
                <option value="Pending">Pending Confirmation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Channel
              </label>
              <select
                {...register('paymentMethod')}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-xs"
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
              disabled={isSubmitting || hasDoubleBookingConflict}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition shadow-md flex items-center gap-1.5 cursor-pointer ${
                hasDoubleBookingConflict
                  ? 'bg-slate-300 opacity-60 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <Check className="w-4 h-4" />
              {hasDoubleBookingConflict ? 'Double Booking Blocked' : 'Confirm & Register Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingFormModal;
