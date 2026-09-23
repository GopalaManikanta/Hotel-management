import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import RoomFormModal from '../components/RoomFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useHotel } from '../context/HotelContext';
import {
  BedDouble,
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Users,
  Layers,
  Sparkles,
  RefreshCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

const RoomList = () => {
  const { rooms, isLoading, error, fetchRooms, addRoom, editRoom, deleteRoom } = useHotel();

  // Search, Filter, Sort, Pagination, View Mode States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filtered & Sorted Rooms Calculation
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((r) => {
        // Search term
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          r.number.toLowerCase().includes(query) ||
          r.type.toLowerCase().includes(query) ||
          r.amenities?.some((a) => a.toLowerCase().includes(query));

        // Type Filter
        const matchesType = typeFilter === 'All' || r.type === typeFilter;

        // Status Filter
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === 'price-low') return a.price - b.price;
        if (sortOrder === 'price-high') return b.price - a.price;
        if (sortOrder === 'number') return a.number.localeCompare(b.number);
        return 0;
      });
  }, [rooms, searchTerm, typeFilter, statusFilter, sortOrder]);

  // Pagination Calculation
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1;
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRooms.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRooms, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setStatusFilter('All');
    setSortOrder('default');
    setCurrentPage(1);
  };

  const handleAddSubmit = async (data) => {
    const success = await addRoom(data);
    return success;
  };

  const handleEditSubmit = async (data) => {
    if (!editingRoom) return false;
    const success = await editRoom(editingRoom.id, data);
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRoomId) return;
    await deleteRoom(deletingRoomId);
    setDeletingRoomId(null);
  };

  const roomToDeleteNumber = rooms.find((r) => r.id === deletingRoomId)?.number || '';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-emerald-700 border border-slate-200 shadow-xs">Available</span>;
      case 'Occupied':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-indigo-700 border border-slate-200 shadow-xs">Occupied</span>;
      case 'Maintenance':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-amber-700 border border-slate-200 shadow-xs">Maintenance</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 bg-white min-h-full">
        
        {/* Top Header & Page Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 bg-white">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Module 2 Room Management Suite
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Hotel Room Directory & Inventory
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage room list, add/edit rooms, filter availability, and view room specs in real-time.
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

            {/* Add Room Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2.5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Room
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between text-rose-800 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              {error}
            </div>
            <button
              type="button"
              onClick={fetchRooms}
              className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 font-bold transition cursor-pointer"
            >
              Retry Load
            </button>
          </div>
        )}

        {/* Search, Filter & Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
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
                placeholder="Search Room #, Type, Amenities..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              />
            </div>

            {/* Room Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              >
                <option value="All">All Room Types</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Suite">Deluxe Suite</option>
                <option value="Executive Room">Executive Room</option>
                <option value="Presidential Suite">Presidential Suite</option>
              </select>
            </div>

            {/* Availability Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              >
                <option value="All">All Availability Statuses</option>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-xs"
              >
                <option value="default">Sort by Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="number">Room Number</option>
              </select>
            </div>

          </div>

          {/* Active Filter Bar & Counter */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Showing <strong className="text-slate-900">{filteredRooms.length}</strong> rooms found
            </span>

            {(searchTerm || typeFilter !== 'All' || statusFilter !== 'All' || sortOrder !== 'default') && (
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
              <div key={i} className="p-4 rounded-3xl bg-white border border-slate-200 animate-pulse space-y-4 shadow-xs">
                <div className="h-44 bg-slate-100 rounded-2xl" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                <div className="h-4 bg-slate-100 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          /* Empty Room Inventory View */
          <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 shadow-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 mb-3 shadow-xs">
              <BedDouble className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Rooms Match Your Criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try adjusting your search query, room type filter, or status filter.
            </p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Room
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Room Image & Status Overlay */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={room.image}
                      alt={`Room ${room.number}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                        Room {room.number}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(room.status)}
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-slate-900">{room.type}</h3>
                      <div className="text-lg font-black text-indigo-600">
                        {formatINR(room.price)}
                        <span className="text-[10px] text-slate-500 font-semibold font-sans">/night</span>
                      </div>
                    </div>

                    {/* Room Specs */}
                    <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold border-y border-slate-100 py-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> {room.capacity} Guests
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" /> Floor {room.floor}
                      </span>
                    </div>

                    {/* Amenities Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shadow-xs">
                          {amenity}
                        </span>
                      ))}
                      {room.amenities?.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-indigo-600">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2 border-t border-slate-100 mt-2">
                  <Link
                    to={`/rooms/${room.id}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold text-center flex items-center justify-center gap-1 transition shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-600" /> Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEditingRoom(room)}
                    className="p-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 transition cursor-pointer shadow-xs"
                    title="Edit Room"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingRoomId(room.id)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer shadow-xs"
                    title="Delete Room"
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
                    <th className="p-4">Room</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price / Night</th>
                    <th className="p-4">Capacity & Floor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
                  {paginatedRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={room.image} alt="" className="w-12 h-10 rounded-xl object-cover border border-slate-200" />
                          <div className="font-extrabold text-slate-900 text-sm">Room {room.number}</div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{room.type}</td>
                      <td className="p-4 font-black text-indigo-600">{formatINR(room.price)}</td>
                      <td className="p-4 text-slate-600 font-semibold">{room.capacity} Guests • Floor {room.floor}</td>
                      <td className="p-4">{getStatusBadge(room.status)}</td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/rooms/${room.id}`}
                          className="inline-flex items-center gap-1 p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 font-bold hover:bg-slate-50 transition shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditingRoom(room)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition cursor-pointer shadow-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingRoomId(room.id)}
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

      {/* Add Room Modal */}
      <RoomFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitRoom={handleAddSubmit}
        title="Add New Hotel Room"
      />

      {/* Edit Room Modal */}
      <RoomFormModal
        isOpen={!!editingRoom}
        onClose={() => setEditingRoom(null)}
        onSubmitRoom={handleEditSubmit}
        initialData={editingRoom}
        title={`Edit Room ${editingRoom?.number || ''}`}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingRoomId}
        onClose={() => setDeletingRoomId(null)}
        onConfirm={handleDeleteConfirm}
        roomNumber={roomToDeleteNumber}
      />
    </Layout>
  );
};

export default RoomList;
