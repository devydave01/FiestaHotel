import { create } from 'zustand';

const useStore = create((set) => ({
  // Auth State
  user: JSON.parse(localStorage.getItem('fiesta_user')) || null,
  token: localStorage.getItem('fiesta_token') || null,
  isAuthenticated: !!localStorage.getItem('fiesta_token'),

  // Room state
  selectedRoom: null,
  setSelectedRoom: (room) => set({ selectedRoom: room }),

  // Booking details
  bookingDetails: {
    checkIn: null,
    checkOut: null,
    guests: 1,
  },
  setBookingDetails: (details) => 
    set((state) => ({ 
      bookingDetails: { ...state.bookingDetails, ...details } 
    })),

  // User info (for booking form)
  userInfo: {
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  },
  setUserInfo: (info) => 
    set((state) => ({ 
      userInfo: { ...state.userInfo, ...info } 
    })),

  // Auth Actions
  setAuth: (user, token) => {
    localStorage.setItem('fiesta_user', JSON.stringify(user));
    localStorage.setItem('fiesta_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('fiesta_user');
    localStorage.removeItem('fiesta_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Reset store
  resetBooking: () => set({
    selectedRoom: null,
    bookingDetails: { checkIn: null, checkOut: null, guests: 1 },
    userInfo: { fullName: '', email: '', phone: '', specialRequests: '' },
  }),

  // Helpers
  getNights: () => {
    const { checkIn, checkOut } = useStore.getState().bookingDetails;
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }
}));

export default useStore;
