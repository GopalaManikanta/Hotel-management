import axios from 'axios';

// Enterprise Dataset for 10 Real-Time Hotel Guests with High-Res Avatars
const defaultGuests = [
  {
    id: 'GST-1001',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    mobileNumber: '+91 98765 43210',
    address: 'Suite 402, Jubilee Hills, Hyderabad, Telangana',
    idProofType: 'Aadhaar Card',
    idProofNumber: '8921-4412-9012',
    nationality: 'Indian',
    status: 'Active In-House',
    roomNumber: '103',
    visitsCount: 4,
    totalSpend: 42500,
    emergencyContact: '+91 98765 00000 (Ramesh Sharma - Spouse)',
    notes: 'VIP Guest. Prefers high-floor room with ocean view and extra pillows.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1002',
    fullName: 'Vikram Reddy',
    email: 'vikram.r@example.com',
    mobileNumber: '+91 91234 56789',
    address: 'Plot 18, Banjara Hills, Hyderabad, Telangana',
    idProofType: 'Aadhaar Card',
    idProofNumber: '4512-8890-1234',
    nationality: 'Indian',
    status: 'Active In-House',
    roomNumber: '202',
    visitsCount: 6,
    totalSpend: 78000,
    emergencyContact: '+91 91234 00000 (Suresh Reddy - Brother)',
    notes: 'Frequent business traveler. Prefers executive lounge access.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1003',
    fullName: 'David Miller',
    email: 'david.m@globalcorp.com',
    mobileNumber: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace, New York, NY 10001, USA',
    idProofType: 'Passport',
    idProofNumber: 'PASSPORT-Z7819201',
    nationality: 'American',
    status: 'VIP Guest',
    roomNumber: '401',
    visitsCount: 8,
    totalSpend: 185000,
    emergencyContact: '+1 (555) 999-8888 (Sarah Miller - Wife)',
    notes: 'Corporate Account VP. Requires late checkout and express airport transfer.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1004',
    fullName: 'Pooja Verma',
    email: 'pooja.verma@techsolutions.in',
    mobileNumber: '+91 98111 22334',
    address: 'Sector 62, Noida, Uttar Pradesh',
    idProofType: 'Voter ID',
    idProofNumber: 'VOTER-UP982104',
    nationality: 'Indian',
    status: 'Checked-Out',
    roomNumber: '105',
    visitsCount: 2,
    totalSpend: 19500,
    emergencyContact: '+91 98111 00000 (Amit Verma - Father)',
    notes: 'Standard room traveler. Attended Tech Summit 2026.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1005',
    fullName: 'Emma Watson',
    email: 'emma.w@londondesign.co.uk',
    mobileNumber: '+44 7911 123456',
    address: '221B Baker Street, London, NW1 6XE, UK',
    idProofType: 'Passport',
    idProofNumber: 'PASSPORT-UK492100',
    nationality: 'British',
    status: 'VIP Guest',
    roomNumber: '304',
    visitsCount: 5,
    totalSpend: 120000,
    emergencyContact: '+44 7911 000000 (James Watson - Parent)',
    notes: 'Loves spa amenities and organic green tea in mini bar.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1006',
    fullName: 'Rahul Dravid',
    email: 'rahul.d@cricketindia.org',
    mobileNumber: '+91 99000 11223',
    address: 'Indiranagar 10th Main, Bengaluru, Karnataka',
    idProofType: 'Aadhaar Card',
    idProofNumber: '7721-9988-3344',
    nationality: 'Indian',
    status: 'Active In-House',
    roomNumber: '405',
    visitsCount: 12,
    totalSpend: 310000,
    emergencyContact: '+91 99000 00000 (Vijeta Dravid - Wife)',
    notes: 'Executive Suite regular. Demands maximum privacy and quiet wing.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1007',
    fullName: 'Klaus Schmidt',
    email: 'klaus.schmidt@berlingroup.de',
    mobileNumber: '+49 30 1234567',
    address: 'Friedrichstraße 12, 10117 Berlin, Germany',
    idProofType: 'Passport',
    idProofNumber: 'PASSPORT-DE891023',
    nationality: 'German',
    status: 'Checked-Out',
    roomNumber: '204',
    visitsCount: 3,
    totalSpend: 54000,
    emergencyContact: '+49 30 999999 (Greta Schmidt - Sister)',
    notes: 'Engineering consultant. Requested ergonomic desk and fiber internet.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'GST-1008',
    fullName: 'Sneha Rao',
    email: 'sneha.rao@fintech.in',
    mobileNumber: '+91 97444 55667',
    address: 'Marine Drive, Mumbai, Maharashtra',
    idProofType: 'Driving License',
    idProofNumber: 'DL-MH0120190012345',
    nationality: 'Indian',
    status: 'Active In-House',
    roomNumber: '101',
    visitsCount: 1,
    totalSpend: 14500,
    emergencyContact: '+91 97444 00000 (Karan Rao - Brother)',
    notes: 'First time guest. Booked standard room with breakfast.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
  }
];

// Helper to fetch guests from localStorage (key v2)
const getStoredGuests = () => {
  try {
    const data = localStorage.getItem('hotel_app_guests_v2');
    return data ? JSON.parse(data) : defaultGuests;
  } catch {
    return defaultGuests;
  }
};

const saveStoredGuests = (guests) => {
  localStorage.setItem('hotel_app_guests_v2', JSON.stringify(guests));
};

export const guestApi = {
  // GET: Fetch all guests & sync with Third-Party User API (DummyJSON / ReqRes)
  async getGuests() {
    let apiUsers = [];
    try {
      // Call Third-Party User API (DummyJSON / ReqRes)
      const res = await axios.get('https://dummyjson.com/users?limit=10', { timeout: 3000 });
      apiUsers = res.data?.users || [];
    } catch {
      // API fallback silently
    }

    const stored = getStoredGuests();

    // Enrich guests with API user images and data
    const enrichedGuests = stored.map((g, idx) => {
      const apiUser = apiUsers[idx % (apiUsers.length || 1)];
      return {
        ...g,
        image: g.image || apiUser?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        apiSource: apiUser ? 'Synced via DummyJSON User API' : 'Real-Time Hotel DB'
      };
    });

    return { data: enrichedGuests };
  },

  // GET: Fetch single guest by ID
  async getGuestById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const guests = (await this.getGuests()).data;
    const guest = guests.find((g) => g.id === id);
    if (!guest) {
      throw new Error(`Guest with ID ${id} not found`);
    }
    return { data: guest };
  },

  // POST: Create a new guest
  async createGuest(guestData) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const guests = getStoredGuests();

    const newGuest = {
      id: `GST-${1000 + guests.length + 1}`,
      fullName: guestData.fullName,
      email: guestData.email,
      mobileNumber: guestData.mobileNumber,
      address: guestData.address,
      idProofType: guestData.idProofType || 'Aadhaar Card',
      idProofNumber: guestData.idProofNumber,
      nationality: guestData.nationality || 'Indian',
      status: guestData.status || 'Active In-House',
      roomNumber: guestData.roomNumber || 'N/A',
      visitsCount: 1,
      totalSpend: Number(guestData.totalSpend) || 12000,
      emergencyContact: guestData.emergencyContact || 'Not Specified',
      notes: guestData.notes || 'Registered guest record.',
      image: guestData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    };

    const updatedGuests = [newGuest, ...guests];
    saveStoredGuests(updatedGuests);
    return { data: newGuest };
  },

  // PUT: Update guest profile
  async updateGuest(id, updatedData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const guests = getStoredGuests();
    const index = guests.findIndex((g) => g.id === id);

    if (index === -1) {
      throw new Error(`Guest with ID ${id} not found`);
    }

    const updatedGuest = {
      ...guests[index],
      ...updatedData
    };

    guests[index] = updatedGuest;
    saveStoredGuests(guests);
    return { data: updatedGuest };
  },

  // DELETE: Remove guest record
  async deleteGuest(id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const guests = getStoredGuests();
    const updatedGuests = guests.filter((g) => g.id !== id);
    saveStoredGuests(updatedGuests);
    return { data: { success: true, id } };
  }
};
