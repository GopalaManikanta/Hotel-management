import axios from 'axios';

// Enterprise Initial Seed Rooms Dataset (20 Rooms with Rich Operations Data)
const defaultRooms = Array.from({ length: 20 }, (_, i) => {
  const roomNum = (101 + (i % 5) + Math.floor(i / 5) * 100).toString();
  const floor = Math.floor(i / 5) + 1;

  let type = 'Standard Room';
  let price = 3500 + (i % 5) * 300;
  let capacity = 2;
  let sizeSqFt = 380;
  let bedType = 'King Bed';
  let wing = `East Wing - Floor ${floor}`;
  let images = [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  ];

  if (floor === 2) {
    type = 'Deluxe Suite';
    price = 7500 + (i % 5) * 400;
    capacity = 3;
    sizeSqFt = 540;
    bedType = 'King Suite Bed';
    wing = 'Ocean View Wing';
    images = [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ];
  } else if (floor === 3) {
    type = 'Executive Room';
    price = 14000 + (i % 5) * 500;
    capacity = 4;
    sizeSqFt = 720;
    bedType = 'Executive King Bed';
    wing = 'Executive Club Tower';
    images = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ];
  } else if (floor >= 4) {
    type = 'Presidential Suite';
    price = 25000 + (i % 5) * 1500;
    capacity = 6;
    sizeSqFt = 1250;
    bedType = 'Super King Master Bed';
    wing = 'Penthouse Royal Floor';
    images = [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ];
  }

  // Default status is Available (occupancy driven dynamically by bookings ledger)
  let status = 'Available';
  let currentOccupant = null;

  if (i === 11) {
    status = 'Maintenance';
  }

  return {
    id: `R-${roomNum}`,
    number: roomNum,
    type,
    price,
    capacity,
    floor,
    sizeSqFt,
    bedType,
    wing,
    status,
    image: images[0],
    galleryImages: images,
    currentOccupant,
    housekeeping: {
      lastCleaned: 'Today at 11:30 AM',
      inspector: 'Suresh Kumar (Lead Inspector)',
      score: '99.8% Clean',
      status: 'Passed Sanitization'
    },
    categorizedAmenities: {
      connectivity: ['High-Speed Fiber WiFi', '55" 4K Smart TV', 'Bluetooth Soundbar System'],
      comfort: ['Central Climate Control', bedType, 'Soundproof Double Glazed Windows', 'Ergonomic Work Desk'],
      bathroom: ['Jacuzzi Bathtub', 'Rainfall Pressure Shower', 'Luxury Spa Bathrobes', 'Hairdryer & Toiletries'],
      dining: ['Stocked Mini Bar', 'Espresso Coffee Machine', '24/7 Room Service Menu'],
      safety: ['Digital Room Safe', 'Keycard Access Lock', 'Smoke & Fire Alarm System']
    },
    amenities: ['High-Speed WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Jacuzzi', 'Ocean View'],
    description: `Executive level ${type} situated in ${wing}. Offers superior comfort, acoustic soundproofing, high-speed fiber internet, and luxury room service.`
  };
});

// Local Storage Helper with key v6
const getStoredRooms = () => {
  try {
    const data = localStorage.getItem('hotel_app_rooms_v6');
    return data ? JSON.parse(data) : defaultRooms;
  } catch {
    return defaultRooms;
  }
};

const saveStoredRooms = (rooms) => {
  localStorage.setItem('hotel_app_rooms_v6', JSON.stringify(rooms));
};

export const roomApi = {
  // GET: Fetch all rooms
  async getRooms() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      await axios.get('https://jsonplaceholder.typicode.com/todos/1', { timeout: 2000 });
    } catch {
      // Fallback silently
    }
    const rooms = getStoredRooms();
    return { data: rooms };
  },

  // GET: Fetch single room by ID
  async getRoomById(id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const rooms = getStoredRooms();
    const room = rooms.find((r) => r.id === id || r.number === id);
    if (!room) {
      throw new Error(`Room with ID ${id} not found`);
    }
    return { data: room };
  },

  // POST: Create a new room
  async createRoom(roomData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const rooms = getStoredRooms();

    const newRoom = {
      id: `R-${roomData.number}`,
      number: roomData.number.toString().trim(),
      type: roomData.type || 'Standard Room',
      price: Number(roomData.price) || 5000,
      capacity: Number(roomData.capacity) || 2,
      floor: Number(roomData.floor) || 1,
      sizeSqFt: Number(roomData.sizeSqFt) || 450,
      bedType: roomData.bedType || 'King Bed',
      wing: `Floor ${roomData.floor || 1} Wing`,
      status: roomData.status || 'Available',
      image: roomData.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        roomData.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
      ],
      currentOccupant: null,
      housekeeping: {
        lastCleaned: 'Today at 10:00 AM',
        inspector: 'Pooja Verma (Inspector)',
        score: '100% Clean',
        status: 'Sanitized & Ready'
      },
      categorizedAmenities: {
        connectivity: ['High-Speed Fiber WiFi', 'Smart TV'],
        comfort: ['Air Conditioning', 'King Bed', 'Work Desk'],
        bathroom: ['Rainfall Shower', 'Luxury Toiletries'],
        dining: ['Tea & Coffee Maker', 'Room Service'],
        safety: ['Digital Safe', 'Keycard Access']
      },
      amenities: Array.isArray(roomData.amenities) ? roomData.amenities : ['WiFi', 'Air Conditioning'],
      description: roomData.description || 'Modern luxury hotel room with premium amenities.'
    };

    const updatedRooms = [newRoom, ...rooms];
    saveStoredRooms(updatedRooms);
    return { data: newRoom };
  },

  // PUT: Update an existing room
  async updateRoom(id, roomData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const rooms = getStoredRooms();
    const index = rooms.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Room ${id} not found`);
    }

    const updatedRoom = {
      ...rooms[index],
      ...roomData,
      price: Number(roomData.price) || rooms[index].price,
      capacity: Number(roomData.capacity) || rooms[index].capacity,
      floor: Number(roomData.floor) || rooms[index].floor
    };

    rooms[index] = updatedRoom;
    saveStoredRooms(rooms);
    return { data: updatedRoom };
  },

  // DELETE: Remove a room
  async deleteRoom(id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const rooms = getStoredRooms();
    const updatedRooms = rooms.filter((r) => r.id !== id);
    saveStoredRooms(updatedRooms);
    return { data: { success: true, id } };
  }
};
