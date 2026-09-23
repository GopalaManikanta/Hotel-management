import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomFormModal from '../components/RoomFormModal';
import { roomApi } from '../services/roomApi';
import { useHotel } from '../context/HotelContext';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  BedDouble,
  Users,
  Layers,
  Sparkles,
  Wifi,
  Tv,
  Wind,
  Coffee,
  ShieldCheck,
  Edit,
  AlertCircle,
  Maximize2,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  CheckCircle2,
  Sparkle,
  Printer,
  PlusCircle,
  Clock,
  Wine,
  Lock,
  Bath
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editRoom, toggleRoomStatus, addBooking } = useHotel();

  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const loadRoomDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await roomApi.getRoomById(id);
      setRoom(res.data);
      if (res.data.galleryImages?.length > 0) {
        setActiveImage(res.data.galleryImages[0]);
      } else {
        setActiveImage(res.data.image);
      }
    } catch (err) {
      setError(err.message || 'Room details not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoomDetails();
  }, [id]);

  const handleEditSubmit = async (data) => {
    if (!room) return false;
    const success = await editRoom(room.id, data);
    if (success) {
      loadRoomDetails();
    }
    return success;
  };

  const handleStatusChange = async (newStatus) => {
    if (!room) return;
    await toggleRoomStatus(room.id, newStatus);
    setRoom((prev) => ({ ...prev, status: newStatus }));
  };

  const handleMarkCleaned = () => {
    toast.success(`Room ${room?.number} marked as Cleaned & Sanitized by Housekeeping!`);
  };

  const handleExpressBookRoom = () => {
    if (room?.status === 'Occupied') {
      toast.warn(`Room ${room.number} is currently occupied.`);
      return;
    }
    addBooking({
      guestName: 'Express Guest',
      guestEmail: 'guest@hotel.com',
      roomNumber: room.number,
      roomType: room.type,
      amount: room.price * 2
    });
    setRoom((prev) => ({
      ...prev,
      status: 'Occupied',
      currentOccupant: {
        bookingId: `BK-${Date.now().toString().slice(-4)}`,
        guestName: 'Express Guest',
        email: 'guest@hotel.com',
        phone: '+91 98765 00000',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        paymentStatus: 'Confirmed'
      }
    }));
  };

  const handlePrintSpecSheet = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/rooms"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition shadow-xs"
              title="Back to Room Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Rooms /</span>
                <span className="text-xs font-bold text-indigo-600">Room {room?.number || id}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {room ? `Room ${room.number} - ${room.type}` : 'Room Details'}
              </h1>
            </div>
          </div>

          {room && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePrintSpecSheet}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Sheet
              </button>

              <button
                type="button"
                onClick={handleMarkCleaned}
                className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Sparkle className="w-3.5 h-3.5 text-emerald-600" /> Mark Cleaned
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Specs
              </button>

              <button
                type="button"
                onClick={handleExpressBookRoom}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Express Book
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 shadow-xs">
            <div className="h-80 bg-slate-100 rounded-3xl" />
            <div className="h-8 bg-slate-100 rounded-full w-1/3" />
            <div className="h-4 bg-slate-100 rounded-full w-2/3" />
          </div>
        ) : error || !room ? (
          /* Error State */
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-rose-600 mb-3 shadow-xs">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Room Specs Not Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              The room inventory item you requested does not exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Back to Room List
            </button>
          </div>
        ) : (
          /* Enterprise Room Dashboard Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
            
            {/* Left Column: Media Gallery, Occupant Info, & Categorized Amenities (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Photo Gallery Viewer */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={activeImage || room.image}
                    alt={`Room ${room.number}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                      Room {room.number}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black shadow-md ${
                      room.status === 'Available'
                        ? 'bg-emerald-600 text-white'
                        : room.status === 'Occupied'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>

                {/* Thumbnail Gallery Switcher */}
                {room.galleryImages?.length > 1 && (
                  <div className="flex items-center gap-3 pt-1 overflow-x-auto">
                    {room.galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                          activeImage === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Current Occupant Card (If Occupied or Confirmed) */}
              {room.status === 'Occupied' && (
                <div className="bg-white border border-indigo-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">Live Current Guest & Stay Info</h3>
                        <p className="text-xs text-slate-500">Active reservation registered in room</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      In-House Guest
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Guest Name</span>
                      <div className="font-extrabold text-slate-900 text-sm">{room.currentOccupant?.guestName || 'Ananya Sharma'}</div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                        <Mail className="w-3.5 h-3.5 text-indigo-600" />
                        {room.currentOccupant?.email || 'ananya@example.com'}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        {room.currentOccupant?.phone || '+91 98765 43210'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Reservation Specs</span>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Booking ID:</span>
                        <strong className="text-indigo-600 font-bold">{room.currentOccupant?.bookingId || 'BK-1002'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Check-In:</span>
                        <span className="font-bold text-slate-800">{room.currentOccupant?.checkIn || '2026-09-22'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Check-Out:</span>
                        <span className="font-bold text-slate-800">{room.currentOccupant?.checkOut || '2026-09-25'}</span>
                      </div>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-slate-500">Payment:</span>
                        <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {room.currentOccupant?.paymentStatus || 'Paid (Confirmed)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categorized Amenities Matrix */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Categorized Luxury Amenities Matrix
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Connectivity */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Wifi className="w-4 h-4 text-indigo-600" /> Connectivity & Media
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {room.categorizedAmenities?.connectivity?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item}
                        </li>
                      )) || (
                        <li className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> High-Speed WiFi & Smart TV
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Luxury & Comfort */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-indigo-600" /> Comfort & Climate
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {room.categorizedAmenities?.comfort?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item}
                        </li>
                      )) || (
                        <li className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Central Climate Control & King Bed
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Bathroom & Spa */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-indigo-600" /> Spa & Bathroom
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {room.categorizedAmenities?.bathroom?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item}
                        </li>
                      )) || (
                        <li className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Jacuzzi Tub & Rain Shower
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Dining & Safety */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Wine className="w-4 h-4 text-indigo-600" /> Dining & Safety
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {room.categorizedAmenities?.dining?.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {item}
                        </li>
                      )) || (
                        <li className="flex items-center gap-2 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stocked Mini Bar & Digital Safe
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Pricing Specs & Operations Audit (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Specifications & Rate Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rate Per Night</span>
                  <div className="text-3xl font-black text-indigo-600 mt-1">
                    {formatINR(room.price)}
                    <span className="text-xs text-slate-500 font-semibold"> / night</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-4 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold text-[10px]">ROOM AREA</div>
                      <div className="font-extrabold text-slate-900">{room.sizeSqFt || 450} sq ft</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold text-[10px]">BED TYPE</div>
                      <div className="font-extrabold text-slate-900 truncate">{room.bedType || 'King Bed'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold text-[10px]">MAX GUESTS</div>
                      <div className="font-extrabold text-slate-900">{room.capacity} Persons</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold text-[10px]">FLOOR & WING</div>
                      <div className="font-extrabold text-slate-900 truncate">Floor {room.floor}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Status Toggle Controls */}
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Quick Status Toggle
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange('Available')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        room.status === 'Available'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      Available
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('Occupied')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        room.status === 'Occupied'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      Occupied
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange('Maintenance')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                        room.status === 'Maintenance'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      Maintenance
                    </button>
                  </div>
                </div>

                {/* Housekeeping & Sanitization Audit Log */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Housekeeping Audit Log
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {room.housekeeping?.score || '99.8% Clean'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Last Sanitized:</span>
                    <strong className="text-slate-900">{room.housekeeping?.lastCleaned || 'Today at 11:30 AM'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Lead Inspector:</span>
                    <span className="font-semibold text-slate-800">{room.housekeeping?.inspector || 'Suresh Kumar'}</span>
                  </div>
                </div>

                {/* Hotel Rules & Policy Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Check-In & Stay Terms
                  </div>
                  <ul className="text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                    <li>Standard Check-In: 12:00 PM | Check-Out: 11:00 AM</li>
                    <li>Non-Smoking Room with Smoke Detectors</li>
                    <li>Complimentary Daily Breakfast & Room Service</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Edit Room Modal */}
      {room && (
        <RoomFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmitRoom={handleEditSubmit}
          initialData={room}
          title={`Edit Room ${room.number}`}
        />
      )}
    </Layout>
  );
};

export default RoomDetails;
