import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const HotelContext = createContext();

export const useHotel = () => useContext(HotelContext);

export const HotelProvider = ({ children }) => {
  // Start cleanly with 0 rooms and 0 bookings
  const [rooms, setRooms] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_app_rooms_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_app_bookings_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hotel_app_rooms_v3', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hotel_app_bookings_v3', JSON.stringify(bookings));
  }, [bookings]);

  // Derived Real-Time KPI Metrics (Start cleanly at 0)
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;
  
  const totalBookings = bookings.length;
  const totalGuests = occupiedRooms > 0 ? occupiedRooms * 2 : 0;
  
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

  // Action: Add New Booking & Dynamic Room Registration
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

    // Add or update room in inventory as Occupied
    setRooms((prev) => {
      const exists = prev.find((r) => r.number === rNum);
      if (exists) {
        return prev.map((r) => (r.number === rNum ? { ...r, status: 'Occupied' } : r));
      } else {
        return [
          ...prev,
          {
            id: `R-${rNum}`,
            number: rNum,
            type: rType,
            price: rPrice,
            status: 'Occupied'
          }
        ];
      }
    });

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

  // Reset State to 0 Baseline
  const resetToCleanState = () => {
    setRooms([]);
    setBookings([]);
    localStorage.removeItem('hotel_app_rooms_v3');
    localStorage.removeItem('hotel_app_bookings_v3');
    toast.info('Hotel Operations reset to 0 baseline.');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        kpi: {
          totalRooms,
          availableRooms,
          occupiedRooms,
          maintenanceRooms,
          totalGuests,
          todayCheckIns,
          todayCheckOuts,
          totalBookings
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
