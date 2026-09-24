import { createContext, useContext, useState, useEffect } from 'react';
import { roomApi } from '../services/roomApi';
import { guestApi } from '../services/guestApi';
import { toast } from 'react-toastify';

const HotelContext = createContext();

export const useHotel = () => useContext(HotelContext);

const initialSeedBookings = [
  {
    id: 'BK-1001',
    guestName: 'Rajesh Verma',
    guestEmail: 'rajesh.verma@example.com',
    guestMobile: '+91 98765 43210',
    idProofType: 'Aadhaar Card',
    idProofNumber: '8921-4412-9012',
    roomNumber: '101',
    roomType: 'Standard Room',
    checkIn: '2026-09-23',
    checkOut: '2026-09-26',
    nights: 3,
    amount: 11500,
    baseAmount: 10000,
    taxAmount: 1500,
    status: 'Checked-In',
    actualCheckInTime: '23 Sep 2026, 02:30 PM',
    keyCardNumber: 'KEY-9012',
    keysIssued: 2,
    paymentMethod: 'UPI / GPay',
    avatar: 'RV'
  },
  {
    id: 'BK-1002',
    guestName: 'Ananya Sharma',
    guestEmail: 'ananya.sharma@example.com',
    guestMobile: '+91 91234 56789',
    idProofType: 'Passport',
    idProofNumber: 'Z-8921401',
    roomNumber: '201',
    roomType: 'Deluxe Suite',
    checkIn: '2026-09-24',
    checkOut: '2026-09-27',
    nights: 3,
    amount: 23500,
    baseAmount: 20000,
    taxAmount: 3500,
    status: 'Checked-In',
    actualCheckInTime: '24 Sep 2026, 11:15 AM',
    keyCardNumber: 'KEY-4412',
    keysIssued: 2,
    paymentMethod: 'Credit Card (Visa)',
    avatar: 'AS'
  },
  {
    id: 'BK-1003',
    guestName: 'Vikram Malhotra',
    guestEmail: 'vikram.m@example.com',
    guestMobile: '+91 99887 76655',
    idProofType: 'Driving License',
    idProofNumber: 'DL-091240192',
    roomNumber: '301',
    roomType: 'Executive Room',
    checkIn: '2026-09-25',
    checkOut: '2026-09-28',
    nights: 3,
    amount: 42000,
    baseAmount: 36000,
    taxAmount: 6000,
    status: 'Confirmed',
    paymentMethod: 'Corporate Transfer',
    avatar: 'VM'
  }
];

export const HotelProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('hotel_app_bookings_v5');
      return saved ? JSON.parse(saved) : initialSeedBookings;
    } catch {
      return initialSeedBookings;
    }
  });

  // System Live Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New Check-In Expected',
      message: 'Guest Vikram Malhotra expected for Check-In today at 02:00 PM.',
      time: '10 mins ago',
      type: 'booking',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Housekeeping Audit Completed',
      message: 'Room 101 marked as Cleaned & Sanitized with 99.8% score.',
      time: '1 hour ago',
      type: 'room',
      read: false
    },
    {
      id: 'notif-3',
      title: 'System Baseline Active',
      message: 'Celestia Grand Hotel Management system operating cleanly on 0 Baseline.',
      time: '2 hours ago',
      type: 'system',
      read: true
    }
  ]);

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.info('Notifications cleared.');
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Rooms & Guests on Mount and auto-sync with active bookings
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomsRes, guestsRes] = await Promise.all([
        roomApi.getRooms(),
        guestApi.getGuests()
      ]);

      const loadedRooms = roomsRes.data;
      const syncedRooms = loadedRooms.map((room) => {
        const activeBooking = bookings.find(
          (b) =>
            b.roomNumber?.toString().trim() === room.number?.toString().trim() &&
            (b.status === 'Confirmed' || b.status === 'Checked-In')
        );
        if (activeBooking) {
          return {
            ...room,
            status: 'Occupied',
            currentOccupant: {
              bookingId: activeBooking.id,
              guestName: activeBooking.guestName,
              email: activeBooking.guestEmail,
              phone: activeBooking.guestMobile || '+91 98765 43210',
              checkIn: activeBooking.checkIn,
              checkOut: activeBooking.checkOut,
              paymentStatus: `Confirmed (${activeBooking.paymentMethod || 'Card/UPI'})`
            }
          };
        }
        return {
          ...room,
          status: room.status === 'Maintenance' ? 'Maintenance' : 'Available',
          currentOccupant: null
        };
      });

      setRooms(syncedRooms);
      setGuests(guestsRes.data);
    } catch {
      setError('Failed to fetch data from API server. Please try again.');
      toast.error('Failed to load hotel operations data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Persist bookings to localStorage
  useEffect(() => {
    localStorage.setItem('hotel_app_bookings_v4', JSON.stringify(bookings));
  }, [bookings]);

  // Persist rooms to localStorage for real-time room management sync
  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem('hotel_app_rooms_v6', JSON.stringify(rooms));
    }
  }, [rooms]);

  // Derived Real-Time KPI Metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;
  
  const totalBookings = bookings.length;
  const totalGuests = guests.length || bookings.length;
  
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

  // GUEST ACTIONS: Add, Edit, Delete Guest
  const addGuest = async (guestData) => {
    try {
      const res = await guestApi.createGuest(guestData);
      setGuests((prev) => [res.data, ...prev]);
      toast.success(`Guest ${res.data.fullName} registered successfully!`);
      return true;
    } catch {
      toast.error('Failed to register guest.');
      return false;
    }
  };

  const editGuest = async (guestId, updatedData) => {
    try {
      const res = await guestApi.updateGuest(guestId, updatedData);
      setGuests((prev) => prev.map((g) => (g.id === guestId ? res.data : g)));
      toast.success(`Guest profile for ${res.data.fullName} updated!`);
      return true;
    } catch {
      toast.error('Failed to update guest profile.');
      return false;
    }
  };

  const deleteGuest = async (guestId) => {
    try {
      const guest = guests.find((g) => g.id === guestId);
      await guestApi.deleteGuest(guestId);
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
      toast.info(`Guest ${guest?.fullName || ''} record removed.`);
      return true;
    } catch {
      toast.error('Failed to delete guest.');
      return false;
    }
  };

  // Double Booking Prevention Helper
  const isRoomDoubleBooked = (roomNumber, checkIn, checkOut, excludeBookingId = null) => {
    if (!roomNumber || !checkIn || !checkOut) return false;
    const reqIn = new Date(checkIn);
    const reqOut = new Date(checkOut);

    return bookings.some((b) => {
      if (b.id === excludeBookingId) return false;
      if (b.roomNumber?.toString().trim() !== roomNumber?.toString().trim()) return false;
      if (b.status === 'Cancelled' || b.status === 'Checked-Out') return false;

      const existingIn = new Date(b.checkIn);
      const existingOut = new Date(b.checkOut);

      return reqIn < existingOut && reqOut > existingIn;
    });
  };

  // Action: Add Booking
  const addBooking = (newBookingData) => {
    const rNum = newBookingData.roomNumber?.toString().trim() || '101';
    const cIn = newBookingData.checkIn || todayDateStr;
    const cOut = newBookingData.checkOut || todayDateStr;

    // Double Booking Prevention Guard
    if (isRoomDoubleBooked(rNum, cIn, cOut)) {
      toast.error(`Double Booking Conflict: Room ${rNum} is already reserved for the selected dates!`);
      return false;
    }

    const rType = newBookingData.roomType || 'Standard Room';
    const rPrice = Number(newBookingData.amount) || 5000;
    const nights = Number(newBookingData.nights) || 1;

    const initials = newBookingData.guestName
      ? newBookingData.guestName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'G';

    const newBooking = {
      id: `BK-${1000 + bookings.length + 1}`,
      guestName: newBookingData.guestName,
      guestEmail: newBookingData.guestEmail,
      roomNumber: rNum,
      roomType: rType,
      checkIn: cIn,
      checkOut: cOut,
      nights: nights,
      amount: rPrice,
      baseAmount: newBookingData.baseAmount || rPrice,
      taxAmount: newBookingData.taxAmount || 0,
      status: newBookingData.status || 'Confirmed',
      paymentMethod: newBookingData.paymentMethod || 'Credit Card / UPI',
      avatar: initials || 'G'
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update Room status to Occupied in Room Management
    if (newBooking.status !== 'Cancelled') {
      setRooms((prev) =>
        prev.map((r) =>
          r.number?.toString().trim() === rNum?.toString().trim()
            ? {
                ...r,
                status: 'Occupied',
                currentOccupant: {
                  bookingId: newBooking.id,
                  guestName: newBooking.guestName,
                  email: newBooking.guestEmail,
                  phone: newBooking.guestMobile || '+91 98765 43210',
                  checkIn: newBooking.checkIn,
                  checkOut: newBooking.checkOut
                }
              }
            : r
        )
      );
    }

    addNotification({
      title: 'New Room Booking',
      message: `Reservation confirmed for ${newBooking.guestName} in Room ${rNum} (${newBooking.roomType}).`,
      type: 'booking'
    });

    toast.success(`Booking ${newBooking.id} created for ${newBooking.guestName} in Room ${rNum}! Room marked as Occupied.`);
    return true;
  };

  // Action: Cancel Booking
  const cancelBooking = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.number?.toString().trim() === booking.roomNumber?.toString().trim()
          ? { ...r, status: 'Available', currentOccupant: null }
          : r
      )
    );

    addNotification({
      title: 'Booking Cancelled',
      message: `Reservation ${booking.id} (${booking.guestName}) was cancelled.`,
      type: 'cancel'
    });

    toast.info(`Booking ${booking.id} cancelled. Room ${booking.roomNumber} is now Available.`);
  };

  // Action: Check In Booking (with real-time metadata)
  const checkInBooking = (bookingId, checkInData = {}) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const timestamp = checkInData.checkInTime || new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const keyCard = checkInData.keyCardNumber || `KEY-${Math.floor(1000 + Math.random() * 9000)}`;
    const keysIssued = checkInData.keysIssued || 2;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Checked-In',
              actualCheckInTime: b.actualCheckInTime || timestamp,
              keyCardNumber: keyCard,
              keysIssued: keysIssued,
              checkInNotes: checkInData.notes || 'Guest Checked-In successfully at Front Desk',
              idVerified: checkInData.idVerified !== undefined ? checkInData.idVerified : true
            }
          : b
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.number?.toString().trim() === booking.roomNumber?.toString().trim()
          ? {
              ...r,
              status: 'Occupied',
              currentOccupant: {
                bookingId: booking.id,
                guestName: booking.guestName,
                email: booking.guestEmail,
                phone: booking.guestMobile || '+91 98765 43210',
                checkIn: booking.checkIn,
                checkOut: booking.checkOut
              }
            }
          : r
      )
    );

    addNotification({
      title: 'Guest Checked In',
      message: `Guest ${booking.guestName} checked into Room ${booking.roomNumber} (Key: ${keyCard}) at ${timestamp}.`,
      type: 'booking'
    });

    toast.success(`Guest ${booking.guestName} checked into Room ${booking.roomNumber}! Key Card ${keyCard} issued.`);
  };

  // Action: Check Out Booking (with billing settlement & room transition)
  const checkOutBooking = (bookingId, checkOutData = {}) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const timestamp = checkOutData.checkOutTime || new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const roomNextStatus = checkOutData.roomNextStatus || 'Available';
    const extraCharges = Number(checkOutData.extraCharges) || 0;
    const finalAmount = (Number(booking.amount) || 0) + extraCharges;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'Checked-Out',
              actualCheckOutTime: b.actualCheckOutTime || timestamp,
              extraCharges: extraCharges,
              finalAmount: finalAmount,
              keysReturned: checkOutData.keysReturned !== undefined ? checkOutData.keysReturned : true,
              checkOutNotes: checkOutData.notes || 'Guest Checked-Out and Folio settled'
            }
          : b
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.number?.toString().trim() === booking.roomNumber?.toString().trim()
          ? { ...r, status: roomNextStatus, currentOccupant: null }
          : r
      )
    );

    addNotification({
      title: 'Guest Checked Out',
      message: `Guest ${booking.guestName} checked out from Room ${booking.roomNumber} at ${timestamp}. Room status set to ${roomNextStatus}.`,
      type: 'booking'
    });

    toast.info(`Guest ${booking.guestName} checked out. Room ${booking.roomNumber} is now ${roomNextStatus}.`);
  };

  // Action: Explicitly Update Booking Status
  const updateBookingStatus = (bookingId, newStatus) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const timestamp = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updated = { ...b, status: newStatus };
        if (newStatus === 'Checked-In' && !b.actualCheckInTime) {
          updated.actualCheckInTime = timestamp;
        }
        if (newStatus === 'Checked-Out' && !b.actualCheckOutTime) {
          updated.actualCheckOutTime = timestamp;
        }
        return updated;
      })
    );

    // Sync room status
    if (newStatus === 'Checked-In' || newStatus === 'Confirmed') {
      setRooms((prev) =>
        prev.map((r) =>
          r.number?.toString().trim() === booking.roomNumber?.toString().trim()
            ? {
                ...r,
                status: 'Occupied',
                currentOccupant: {
                  bookingId: booking.id,
                  guestName: booking.guestName,
                  email: booking.guestEmail,
                  phone: booking.guestMobile || '+91 98765 43210',
                  checkIn: booking.checkIn,
                  checkOut: booking.checkOut
                }
              }
            : r
        )
      );
    } else if (newStatus === 'Checked-Out' || newStatus === 'Cancelled') {
      setRooms((prev) =>
        prev.map((r) =>
          r.number?.toString().trim() === booking.roomNumber?.toString().trim()
            ? { ...r, status: 'Available', currentOccupant: null }
            : r
        )
      );
    }

    toast.success(`Booking ${bookingId} status updated to ${newStatus}.`);
  };

  // Action: Explicitly Update Room Availability
  const updateRoomAvailability = (roomNumber, newStatus) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.number?.toString().trim() === roomNumber?.toString().trim()
          ? { ...r, status: newStatus }
          : r
      )
    );
    toast.info(`Room ${roomNumber} availability updated to ${newStatus}.`);
  };

  // Reset State to Clean Baseline
  const resetToCleanState = () => {
    setRooms([]);
    setGuests([]);
    setBookings([]);
    setNotifications([]);
    localStorage.removeItem('hotel_app_rooms_v4');
    localStorage.removeItem('hotel_app_guests_v1');
    localStorage.removeItem('hotel_app_bookings_v4');
    toast.info('Hotel Operations reset to 0 baseline.');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        guests,
        bookings,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        removeNotification,
        isLoading,
        error,
        fetchRooms: fetchAllData,
        addRoom,
        editRoom,
        deleteRoom,
        toggleRoomStatus,
        addGuest,
        editGuest,
        deleteGuest,
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
        updateBookingStatus,
        updateRoomAvailability,
        cancelBooking,
        isRoomDoubleBooked,
        resetToCleanState
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};
