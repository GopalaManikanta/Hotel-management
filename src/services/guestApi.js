import axios from 'axios';

// Helper to fetch custom added guests from localStorage
const getCustomGuests = () => {
  try {
    const data = localStorage.getItem('hotel_app_custom_guests');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCustomGuests = (guests) => {
  localStorage.setItem('hotel_app_custom_guests', JSON.stringify(guests));
};

export const guestApi = {
  // GET: Fetch all guests directly from Third-Party DummyJSON User API
  async getGuests() {
    let apiUsers = [];
    try {
      const res = await axios.get('https://dummyjson.com/users?limit=15', { timeout: 4000 });
      apiUsers = res.data?.users || [];
    } catch {
      // API fallback silently
    }

    const transformedGuests = apiUsers.map((user) => {
      const proofTypes = ['Aadhaar Card', 'Passport', 'Driving License', 'Voter ID'];
      const proofType = user.bank?.cardType || proofTypes[user.id % proofTypes.length];
      const proofNum = user.ssn ? `SSN-${user.ssn}` : `892${user.id}-4412-90${user.id}`;

      return {
        id: `GST-${1000 + user.id}`,
        apiUserId: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        mobileNumber: user.phone || `+91 98765 4321${user.id}`,
        address: `${user.address?.address || 'Jubilee Hills'}, ${user.address?.city || 'Hyderabad'}, ${user.address?.state || 'Telangana'}`,
        idProofType: proofType,
        idProofNumber: proofNum,
        nationality: user.address?.country || (user.id % 2 === 0 ? 'Indian' : 'American'),
        status: user.id % 3 === 0 ? 'VIP Guest' : user.id % 2 === 0 ? 'Active In-House' : 'Checked-Out',
        roomNumber: user.id % 2 === 0 ? `10${(user.id % 8) + 1}` : 'N/A',
        visitsCount: user.age ? Math.floor(user.age / 5) : 3,
        totalSpend: (user.id * 14500) + 16000,
        emergencyContact: `+1 (555) 019-80${user.id} (${user.lastName} Family)`,
        notes: `Corporate Role: ${user.role || 'Executive'}. Department: ${user.company?.department || 'Operations'}. Blood Group: ${user.bloodGroup || 'O+'}. Prefers high-floor room with express breakfast.`,
        image: user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        
        // Full DummyJSON API Specifications
        age: user.age,
        gender: user.gender,
        birthDate: user.birthDate,
        bloodGroup: user.bloodGroup,
        eyeColor: user.eyeColor,
        hairColor: user.hair?.color,
        hairType: user.hair?.type,
        height: user.height,
        weight: user.weight,
        companyName: user.company?.name || 'Global Enterprise',
        companyTitle: user.company?.title || 'Executive Specialist',
        companyDepartment: user.company?.department || 'Operations',
        bankCardNumber: user.bank?.cardNumber ? `**** **** **** ${user.bank.cardNumber.slice(-4)}` : '**** 4321',
        bankCardType: user.bank?.cardType || 'Visa / Mastercard',
        bankCardExpire: user.bank?.cardExpire || '12/28',
        ssn: user.ssn || `SSN-${user.id}98102`,
        ein: user.ein || 'EIN-901290',
        macAddress: user.macAddress || '00:1A:2B:3C:4D:5E',
        ipAddress: user.ip || '192.168.1.100',
        apiSource: 'Live Synced via DummyJSON User API'
      };
    });

    const custom = getCustomGuests();
    return { data: [...custom, ...transformedGuests] };
  },

  // GET: Fetch single guest by ID
  async getGuestById(id) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const guests = (await this.getGuests()).data;
    const guest = guests.find((g) => g.id === id);
    if (!guest) {
      throw new Error(`Guest with ID ${id} not found`);
    }
    return { data: guest };
  },

  // POST: Create a new guest
  async createGuest(guestData) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const custom = getCustomGuests();

    const newGuest = {
      id: `GST-${2000 + custom.length + 1}`,
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
      image: guestData.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      apiSource: 'User Created Profile'
    };

    const updated = [newGuest, ...custom];
    saveCustomGuests(updated);
    return { data: newGuest };
  },

  // PUT: Update guest profile
  async updateGuest(id, updatedData) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const custom = getCustomGuests();
    const index = custom.findIndex((g) => g.id === id);

    if (index !== -1) {
      custom[index] = { ...custom[index], ...updatedData };
      saveCustomGuests(custom);
      return { data: custom[index] };
    }

    return { data: { id, ...updatedData } };
  },

  // DELETE: Remove guest record
  async deleteGuest(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const custom = getCustomGuests();
    const updated = custom.filter((g) => g.id !== id);
    saveCustomGuests(updated);
    return { data: { success: true, id } };
  }
};
