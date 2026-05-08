const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/fiesta-api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('fiesta_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Rooms
  getRooms: async () => {
    const response = await fetch(`${API_URL}/rooms/list.php`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getRoomById: async (id) => {
    const response = await fetch(`${API_URL}/rooms/view.php?id=${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Bookings
  createBooking: async (bookingData) => {
    const response = await fetch(`${API_URL}/bookings/create.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  // Admin
  getAdminStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats.php`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getRecentBookings: async () => {
    const response = await fetch(`${API_URL}/admin/bookings.php`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  approveBooking: async (id) => {
    const response = await fetch(`${API_URL}/admin/approve_booking.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },

  // Room Management
  addRoom: async (roomData) => {
    const response = await fetch(`${API_URL}/admin/add_room.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(roomData),
    });
    return handleResponse(response);
  },

  updateRoom: async (id, roomData) => {
    const response = await fetch(`${API_URL}/admin/update_room.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ id, ...roomData }),
    });
    return handleResponse(response);
  },

  deleteRoom: async (id) => {
    const response = await fetch(`${API_URL}/admin/delete_room.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    return handleResponse(response);
  },

  // Guests
  getGuests: async () => {
    const response = await fetch(`${API_URL}/admin/guests.php`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
