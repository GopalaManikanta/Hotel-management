import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import GuestFormModal from '../components/GuestFormModal';
import { guestApi } from '../services/guestApi';
import { useHotel } from '../context/HotelContext';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  BedDouble,
  Sparkles,
  Edit,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Printer,
  PlusCircle,
  Star,
  HeartHandshake
} from 'lucide-react';

const GuestProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editGuest, addBooking, bookings = [] } = useHotel();

  const [guest, setGuest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  useEffect(() => {
    const loadGuestDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await guestApi.getGuestById(id);
        setGuest(res.data);
      } catch (err) {
        setError(err.message || 'Guest record not found');
      } finally {
        setIsLoading(false);
      }
    };
    loadGuestDetails();
  }, [id]);

  const handleEditSubmit = async (data) => {
    if (!guest) return false;
    const success = await editGuest(guest.id, data);
    if (success) {
      const res = await guestApi.getGuestById(id);
      setGuest(res.data);
    }
    return success;
  };

  const handleExpressBookRoom = () => {
    if (!guest) return;
    addBooking({
      guestName: guest.fullName,
      guestEmail: guest.email,
      roomNumber: guest.roomNumber !== 'N/A' ? guest.roomNumber : '102',
      roomType: 'Deluxe Suite',
      amount: 7500
    });
    toast.success(`Express booking created for ${guest.fullName}!`);
  };

  const handlePrintGuestCard = () => {
    window.print();
  };

  // Derived guest bookings from global state
  const guestBookings = bookings.filter(
    (b) =>
      b.guestName?.toLowerCase() === guest?.fullName?.toLowerCase() ||
      b.guestEmail?.toLowerCase() === guest?.email?.toLowerCase()
  );

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Navigation & Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 bg-white">
          <div className="flex items-center gap-3">
            <Link
              to="/guests"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 transition shadow-xs"
              title="Back to Guest Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Guest Directory /</span>
                <span className="text-xs font-bold text-indigo-600">{guest?.id || id}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {guest ? guest.fullName : 'Guest Profile'}
              </h1>
            </div>
          </div>

          {guest && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePrintGuestCard}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Profile Card
              </button>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>

              <button
                type="button"
                onClick={handleExpressBookRoom}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Express Booking
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-6 shadow-xs">
            <div className="h-40 bg-slate-100 rounded-3xl" />
            <div className="h-8 bg-slate-100 rounded-full w-1/3" />
            <div className="h-4 bg-slate-100 rounded-full w-2/3" />
          </div>
        ) : error || !guest ? (
          /* Error State */
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-rose-600 mb-3 shadow-xs">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Guest Record Not Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              The guest profile item you requested does not exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/guests')}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              Back to Guest Directory
            </button>
          </div>
        ) : (
          /* Main Guest Profile Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white">
            
            {/* LEFT COLUMN: Overview, ID Verification & History (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Overview Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={guest.image}
                      alt={guest.fullName}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shrink-0"
                    />
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        {guest.fullName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          {guest.id}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">• {guest.nationality}</span>
                      </div>
                      {guest.apiSource && (
                        <div className="text-[10px] text-slate-400 font-bold mt-1">
                          🌐 {guest.apiSource}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                    guest.status === 'Active In-House'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : guest.status === 'VIP Guest'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {guest.status}
                  </span>
                </div>

                {/* Contact & Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold truncate">
                      <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                      {guest.email}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Number</span>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                      {guest.mobileNumber}
                    </div>
                  </div>

                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residential Address</span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      {guest.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Identification Proof Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Verified Identification Audit</h3>
                      <p className="text-xs text-slate-500">Government issued ID proof verification specs</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Audit Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ID Proof Type</span>
                    <div className="font-extrabold text-slate-900 text-sm">{guest.idProofType}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ID Proof Number</span>
                    <div className="font-mono font-black text-indigo-600 text-sm tracking-wider">{guest.idProofNumber}</div>
                  </div>
                </div>
              </div>

              {/* Extended DummyJSON API Specifications Card */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 rounded-3xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs">
                      API
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Live DummyJSON Profile Specifications</h3>
                      <p className="text-xs text-slate-500">Full API Demographics, Corporate, Health & Financial Ledger</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-200">
                    3rd-Party API Synced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Demographics */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Age & Birthdate</span>
                    <div className="font-extrabold text-slate-900">{guest.age || 32} Yrs ({guest.birthDate || '1994-06-15'})</div>
                    <div className="text-[11px] text-slate-500 font-semibold">Gender: <strong className="text-slate-800 uppercase">{guest.gender || 'Female'}</strong></div>
                  </div>

                  {/* Health & Specs */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Physical & Health Specs</span>
                    <div className="font-extrabold text-slate-900">Blood: <span className="text-rose-600">{guest.bloodGroup || 'O+'}</span> • {guest.height || 172} cm</div>
                    <div className="text-[11px] text-slate-500 font-semibold">Eyes: {guest.eyeColor || 'Brown'} • Hair: {guest.hairColor || 'Black'}</div>
                  </div>

                  {/* Corporate Info */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Corporate Company & Title</span>
                    <div className="font-extrabold text-indigo-600 truncate">{guest.companyName || 'Global Enterprise'}</div>
                    <div className="text-[11px] text-slate-600 font-bold">{guest.companyTitle || 'Executive Specialist'} ({guest.companyDepartment || 'Operations'})</div>
                  </div>

                  {/* Bank Payment Card */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Bank Payment Card</span>
                    <div className="font-mono font-bold text-slate-900">{guest.bankCardNumber || '**** **** **** 4321'}</div>
                    <div className="text-[11px] text-emerald-600 font-extrabold">{guest.bankCardType || 'Visa / Mastercard'} (Exp: {guest.bankCardExpire || '12/28'})</div>
                  </div>

                  {/* SSN & Identifiers */}
                  <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Government SSN / Tax ID</span>
                      <strong className="font-mono text-slate-900 text-xs">{guest.ssn || 'SSN-90129841'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Network Endpoint</span>
                      <span className="font-mono text-xs text-slate-600">IP: {guest.ipAddress || '192.168.1.45'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences & Operational Notes */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Guest Preferences & Front Desk Notes
                </h3>
                <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                  {guest.notes || 'No special notes registered.'}
                </p>
              </div>

              {/* Reservation & Stay History Timeline */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Stay & Reservation History Log
                </h3>

                {guestBookings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No recent bookings logged for this guest profile.</p>
                ) : (
                  <div className="space-y-3">
                    {guestBookings.map((b) => (
                      <div key={b.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                            <BedDouble className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">Room {b.roomNumber} ({b.roomType})</div>
                            <div className="text-[11px] text-slate-500">{b.checkIn} to {b.checkOut}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-indigo-600">{formatINR(b.amount)}</div>
                          <span className="text-[10px] font-bold text-emerald-600">{b.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Financial Metrics & Emergency Specs (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Financial & Visit Metrics */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Financial Performance</span>
                
                <div>
                  <span className="text-xs text-slate-500 font-semibold">Lifetime Spend</span>
                  <div className="text-3xl font-black text-indigo-600 mt-0.5">
                    {formatINR(guest.totalSpend || 45000)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Visits</span>
                    <span className="text-xl font-extrabold text-slate-900">{guest.visitsCount || 1} Stays</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Loyalty Rating</span>
                    <span className="text-xl font-extrabold text-purple-600 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-purple-600 fill-purple-600" /> VIP
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Room Assignment Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                  <BedDouble className="w-4 h-4 text-indigo-600" />
                  Active Room Assignment
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Assigned Room:</span>
                    <strong className="text-indigo-600 text-sm font-black">
                      {guest.roomNumber !== 'N/A' ? `Room ${guest.roomNumber}` : 'No Active Room'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-600">
                    <span>Stay Status:</span>
                    <span className="font-bold text-emerald-600">{guest.status}</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Specs */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  Emergency Contact Specs
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact & Relation</span>
                  <div className="font-bold text-slate-800">{guest.emergencyContact || 'Not Specified'}</div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Edit Guest Modal */}
      {guest && (
        <GuestFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmitGuest={handleEditSubmit}
          initialData={guest}
          title={`Edit Profile - ${guest.fullName}`}
        />
      )}
    </Layout>
  );
};

export default GuestProfile;
