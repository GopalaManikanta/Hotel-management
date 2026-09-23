import { createContext, useContext, useState, useEffect } from 'react';
import { roomApi } from '../services/roomApi';
import { toast } from 'react-toastify';

const HotelContext = createContext();

export const useHotel = () => useContext(HotelContext);

export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_app_bookings_v4');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Rooms from API on Mount
  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await roomApi.getRooms();
      setRooms(res.data);
    } catch (err) {
      setError('Failed to fetch rooms from API server. Please try again.');
      toast.error('Failed to load room inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Persist bookings to localStorage
  useEffect(() => {
    localStorage.setItem('hotel_app_bookings_v4', JSON.stringify(bookings));
  }, [bookings]);

  // Derived Real-Time KPI Metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;
  
  const totalBookings = bookings.length;
  const uniqueGuestIdentifiers = new Set(
    bookings.map((b) => (b.guestEmail || b.guestName || '').toLowerCase().trim()).filter(Boolean)
  );
  const totalGuests = uniqueGuestIdentifiers.size || (occupiedRooms > 0 ? occupiedRooms * 2 : 0);
  
  const todayDateStr = new Date().toISOString().split('T')[0];

  const todayCheckIns = bookings.filter(
    (b) => b.checkIn === todayDateStr || b.status === 'Confirmed' || b.status === 'Checked-In'
  ).length;

  const todayCheckOuts = bookings.filter(
    (b) => b.checkOut === todayDateStr || b.status === 'Checked-Out'
  ).length;

  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const averageDailyRate = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Revenue Breakdown by Room Type (Dynamic)
  const breakdownByRoomType = [
    { type: 'Deluxe Suite', color: 'bg-indigo-500' },
    { type: 'Executive Room', color: 'bg-emerald-500' },
    { type: 'Standard Room', color: 'bg-amber-500' },
    { type: 'Presidential Suite', color: 'bg-purple-500' }
  ].map((item) => {
    const typeBookings = bookings.filter((b) => b.roomType === item.type);
    const rev = typeBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const percentage = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 100) : 0;
    return {
      ...item,
      revenue: rev,
      percentage
    };
  });

  // Action: Add New Room via API
  const addRoom = async (roomData) => {
    try {
      const res = await roomApi.createRoom(roomData);
      setRooms((prev) => [res.data, ...prev]);
      toast.success(`Room ${res.data.number} created successfully!`);
      return true;
    } catch {
      toast.error('Failed to create room.');
      return false;
    }
  };

  // Action: Edit Room via API
  const editRoom = async (roomId, updatedData) => {
    try {
      const res = await roomApi.updateRoom(roomId, updatedData);
      setRooms((prev) => prev.map((r) => (r.id === roomId ? res.data : r)));
      toast.success(`Room ${res.data.number} updated successfully!`);
      return true;
    } catch {
      toast.error('Failed to update room.');
      return false;
    }
  };

  // Action: Delete Room via API
  const deleteRoom = async (roomId) => {
    try {
      await roomApi.deleteRoom(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      toast.info(`Room removed from inventory.`);
      return true;
    } catch {
      toast.error('Failed to delete room.');
      return false;
    }
  };

  // Action: Toggle Room Status
  const toggleRoomStatus = async (roomId, newStatus) => {
    try {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;
      const res = await roomApi.updateRoom(roomId, { status: newStatus });
      setRooms((prev) => prev.map((r) => (r.id === roomId ? res.data : r)));
      toast.info(`Room ${room.number} status changed to ${newStatus}.`);
    } catch {
      toast.error('Failed to change room status.');
    }
  };

  // Action: Add Booking
  const addBooking = (newBookingData) => {
    const rNum = newBookingData.roomNumber?.toString().trim() || '101';
    const rType = newBookingData.roomType || 'Standard Room';
    const rPrice = Number(newBookingData.amount) || 5000;

    const initials = newBookingData.guestName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newBooking = {
      id: `BK-${1000 + bookings.length + 1}`,
      guestName: newBookingData.guestName,
      guestEmail: newBookingData.guestEmail,
      roomNumber: rNum,
      roomType: rType,
      checkIn: newBookingData.checkIn || todayDateStr,
      checkOut: newBookingData.checkOut || todayDateStr,
      amount: rPrice,
      status: 'Confirmed',
      avatar: initials || 'G'
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update Room status to Occupied
    setRooms((prev) =>
      prev.map((r) => (r.number === rNum ? { ...r, status: 'Occupied' } : r))
    );

    toast.success(`Booking ${newBooking.id} created for ${newBooking.guestName} in Room ${rNum}!`);
    return true;
  };

  // Action: Check In Booking
  const checkInBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Checked-In' } : b))
    );

    setRooms((prev) =>
      prev.map((r) => (r.number === booking.roomNumber ? { ...r, status: 'Occupied' } : r))
    );

    toast.success(`Guest ${booking.guestName} checked into Room ${booking.roomNumber}!`);
  };

  // Action: Check Out Booking
  const checkOutBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Checked-Out' } : b))
    );

    setRooms((prev) =>
      prev.map((r) => (r.number === booking.roomNumber ? { ...r, status: 'Available' } : r))
    );

    toast.info(`Guest ${booking.guestName} checked out. Room ${booking.roomNumber} is now Available.`);
  };

  // Reset State to Clean Baseline
  const resetToCleanState = () => {
    setRooms([]);
    setBookings([]);
    localStorage.removeItem('hotel_app_rooms_v4');
    localStorage.removeItem('hotel_app_bookings_v4');
    toast.info('Hotel Operations reset to 0 baseline.');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        isLoading,
        error,
        fetchRooms,
        addRoom,
        editRoom,
        deleteRoom,
        toggleRoomStatus,
        kpi: {
          totalRooms,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          totalGuests,
          todayCheckIns,
          todayCheckOuts,
          totalBookings,
          occupancyRate
        },
        revenue: {
          totalRevenue,
          monthlyTarget: 500000,
          occupancyRate,
          averageDailyRate,
          breakdownByRoomType
        },
        addBooking,
        checkInBooking,
        checkOutBooking,
        resetToCleanState
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};
