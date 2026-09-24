import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import GuestFormModal from '../components/GuestFormModal';
import DeleteGuestModal from '../components/DeleteGuestModal';
import { useHotel } from '../context/HotelContext';
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Globe,
  Sparkles,
  RefreshCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Star,
  UserCheck
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const GuestList = () => {
  const { guests, isLoading, addGuest, editGuest, deleteGuest } = useHotel();

  // Search, Filter, Pagination, View Mode States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [nationalityFilter, setNationalityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [deletingGuestId, setDeletingGuestId] = useState(null);


  // Extract unique nationalities for filter dropdown
  const uniqueNationalities = useMemo(() => {
    const set = new Set(guests.map((g) => g.nationality).filter(Boolean));
    return Array.from(set);
  }, [guests]);

  // Filtered Guests Calculation
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        g.fullName.toLowerCase().includes(query) ||
        g.email.toLowerCase().includes(query) ||
        g.mobileNumber.toLowerCase().includes(query) ||
        g.idProofNumber.toLowerCase().includes(query) ||
        g.id.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || g.status === statusFilter;
      const matchesNationality = nationalityFilter === 'All' || g.nationality === nationalityFilter;

      return matchesSearch && matchesStatus && matchesNationality;
    });
  }, [guests, searchTerm, statusFilter, nationalityFilter]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE) || 1;
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuests, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setNationalityFilter('All');
    setCurrentPage(1);
  };

  const handleAddSubmit = async (data) => {
    const success = await addGuest(data);
    return success;
  };

  const handleEditSubmit = async (data) => {
    if (!editingGuest) return false;
    const success = await editGuest(editingGuest.id, data);
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingGuestId) return;
    await deleteGuest(deletingGuestId);
    setDeletingGuestId(null);
  };

  const guestToDeleteName = guests.find((g) => g.id === deletingGuestId)?.fullName || '';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active In-House':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-emerald-700 border border-slate-200 shadow-xs flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" /> Active In-House
          </span>
        );
      case 'VIP Guest':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-purple-700 border border-slate-200 shadow-xs flex items-center gap-1">
            <Star className="w-3 h-3 text-purple-600 fill-purple-600" /> VIP Guest
          </span>
        );
      case 'Checked-Out':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-slate-600 border border-slate-200 shadow-xs">
            Checked-Out
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Top Header & Page Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Guest Directory Operations
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Hotel Guest Directory & Profiles
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage guest identification records, contact specs, room assignments, and VIP profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Guest Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Add New Guest
            </button>
          </div>
        </div>

        {/* Search, Filter & Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search Name, Email, Mobile, ID Proof..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Stay Statuses</option>
                <option value="Active In-House">Active In-House</option>
                <option value="VIP Guest">VIP Guest</option>
                <option value="Checked-Out">Checked-Out</option>
              </select>
            </div>

            {/* Nationality Filter */}
            <div>
              <select
                value={nationalityFilter}
                onChange={(e) => {
                  setNationalityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition shadow-xs"
              >
                <option value="All">All Nationalities</option>
                {uniqueNationalities.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Active Filter Bar & Counter */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredGuests.length}</strong> guest records
            </span>

            {(searchTerm || statusFilter !== 'All' || nationalityFilter !== 'All') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-5 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-xs">
                <div className="h-12 w-12 bg-slate-100 rounded-full" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredGuests.length === 0 ? (
          /* Empty Guest View */
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-3 shadow-xs">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Guest Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No registered guests match your current search query or status filter.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Register New Guest
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGuests.map((guest) => (
              <div
                key={guest.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Avatar & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={guest.image}
                        alt={guest.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                          {guest.fullName}
                        </h3>
                        <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                          {guest.id}
                        </span>
                      </div>
                    </div>

                    <div>{getStatusBadge(guest.status)}</div>
                  </div>

                  {/* Contact Specs */}
                  <div className="space-y-2 border-y border-slate-100 py-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{guest.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                      <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{guest.mobileNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-800">{guest.idProofType}: {guest.idProofNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{guest.nationality}</span>
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Visits</span>
                      <span className="font-extrabold text-slate-900">{guest.visitsCount || 1} Stays</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Room Assignment</span>
                      <span className="font-extrabold text-indigo-600">
                        {guest.roomNumber !== 'N/A' ? `Room ${guest.roomNumber}` : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/guests/${guest.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold text-center flex items-center justify-center gap-1 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" /> View Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEditingGuest(guest)}
                    className="p-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 transition cursor-pointer shadow-xs"
                    title="Edit Profile"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingGuestId(guest.id)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer shadow-xs"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold bg-white">
                    <th className="p-4">Guest Info</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">ID Proof Specs</th>
                    <th className="p-4">Nationality & Room</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {paginatedGuests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={guest.image}
                            alt={guest.fullName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm">{guest.fullName}</div>
                            <div className="text-[10px] text-indigo-600 font-bold">{guest.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{guest.mobileNumber}</div>
                        <div className="text-[11px] text-slate-500">{guest.email}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-mono font-bold text-slate-900">{guest.idProofNumber}</div>
                        <div className="text-[11px] text-slate-500">{guest.idProofType}</div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">
                        {guest.nationality} • {guest.roomNumber !== 'N/A' ? `Room ${guest.roomNumber}` : 'No Room'}
                      </td>

                      <td className="p-4">{getStatusBadge(guest.status)}</td>

                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/guests/${guest.id}`}
                          className="inline-flex items-center gap-1 p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 font-bold hover:bg-slate-50 transition shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Profile
                        </Link>

                        <button
                          type="button"
                          onClick={() => setEditingGuest(guest)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition cursor-pointer shadow-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingGuestId(guest.id)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 bg-white">
            <span className="text-xs text-slate-500 font-semibold">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                      currentPage === pNum
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Guest Modal */}
      <GuestFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitGuest={handleAddSubmit}
        title="Register New Guest"
      />

      {/* Edit Guest Modal */}
      <GuestFormModal
        isOpen={!!editingGuest}
        onClose={() => setEditingGuest(null)}
        onSubmitGuest={handleEditSubmit}
        initialData={editingGuest}
        title={`Edit Profile - ${editingGuest?.fullName || ''}`}
      />

      {/* Delete Confirmation Modal */}
      <DeleteGuestModal
        isOpen={!!deletingGuestId}
        onClose={() => setDeletingGuestId(null)}
        onConfirm={handleDeleteConfirm}
        guestName={guestToDeleteName}
      />
    </Layout>
  );
};

export default GuestList;
