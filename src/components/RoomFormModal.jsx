import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, BedDouble, Image, PlusCircle, Check } from 'lucide-react';

const availableAmenitiesList = [
  'High-Speed WiFi',
  'Air Conditioning',
  'Smart TV',
  'Mini Bar',
  'Private Balcony',
  'Ocean View',
  'Jacuzzi',
  'Work Desk',
  'Tea & Coffee Maker',
  'Executive Lounge Access',
  'Butler Service'
];

const RoomFormModal = ({ isOpen, onClose, onSubmitRoom, initialData = null, title = 'Add New Room' }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      number: '',
      type: 'Deluxe Suite',
      price: 7500,
      capacity: 2,
      floor: 1,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      description: 'Modern luxury hotel room with premium amenities.',
      amenities: ['High-Speed WiFi', 'Air Conditioning']
    }
  });

  const selectedAmenities = watch('amenities') || [];

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number || '');
      setValue('type', initialData.type || 'Deluxe Suite');
      setValue('price', initialData.price || 7500);
      setValue('capacity', initialData.capacity || 2);
      setValue('floor', initialData.floor || 1);
      setValue('status', initialData.status || 'Available');
      setValue('image', initialData.image || '');
      setValue('description', initialData.description || '');
      setValue('amenities', initialData.amenities || ['High-Speed WiFi', 'Air Conditioning']);
    } else {
      reset({
        number: '',
        type: 'Deluxe Suite',
        price: 7500,
        capacity: 2,
        floor: 1,
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
        description: 'Modern luxury hotel room with premium amenities.',
        amenities: ['High-Speed WiFi', 'Air Conditioning']
      });
    }
  }, [initialData, isOpen, setValue, reset]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setValue(
        'amenities',
        selectedAmenities.filter((a) => a !== amenity)
      );
    } else {
      setValue('amenities', [...selectedAmenities, amenity]);
    }
  };

  const handleFormSubmit = async (data) => {
    const success = await onSubmitRoom(data);
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
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">Configure room specs, pricing, and amenities</p>
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
          
          {/* Room Number & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BedDouble className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 101"
                  {...register('number', { required: 'Room number is required' })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition shadow-xs font-bold"
                />
              </div>
              {errors.number && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.number.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Room Type *
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              >
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Room">Executive Room</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>
          </div>

          {/* Price, Capacity & Floor */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price Per Night (₹) *
              </label>
              <input
                type="number"
                {...register('price', { required: 'Price is required', min: 1000 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-indigo-600 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              />
              {errors.price && <p className="mt-1 text-xs text-rose-600 font-semibold">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Capacity (Guests)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                {...register('capacity', { required: 'Capacity is required' })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Floor Number
              </label>
              <input
                type="number"
                min="1"
                max="20"
                {...register('floor')}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              />
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Availability Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-emerald-300 transition shadow-xs">
                <input type="radio" value="Available" {...register('status')} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700">Available</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-indigo-300 transition shadow-xs">
                <input type="radio" value="Occupied" {...register('status')} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700">Occupied</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:border-amber-300 transition shadow-xs">
                <input type="radio" value="Maintenance" {...register('status')} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-700">Maintenance</span>
              </label>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Room Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Image className="w-4 h-4" />
              </div>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register('image')}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              />
            </div>
          </div>

          {/* Amenities Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Room Amenities & Features
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAmenitiesList.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Room Description
            </label>
            <textarea
              rows="2"
              placeholder="Provide room details, views, and features..."
              {...register('description')}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-xs"
            />
          </div>

          {/* Buttons */}
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
              {initialData ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RoomFormModal;
