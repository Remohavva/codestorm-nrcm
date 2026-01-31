import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
};

// Clubs API
export const clubsAPI = {
  getAll: () => api.get('/api/clubs'),
  getById: (id) => api.get(`/api/clubs/${id}`),
  create: (data) => api.post('/api/clubs', data),
  update: (id, data) => api.put(`/api/clubs/${id}`, data),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  approve: (id) => api.put(`/api/events/${id}/approve`),
  reject: (id, reason) => api.put(`/api/events/${id}/reject`, { reason }),
};

// Registrations API
export const registrationsAPI = {
  register: (eventId) => api.post(`/api/events/${eventId}/register`),
  cancel: (eventId) => api.delete(`/api/events/${eventId}/register`),
  getUserRegistrations: (params) => api.get('/api/users/me/registrations', { params }),
  getEventRegistrations: (eventId) => api.get(`/api/events/${eventId}/registrations`),
};

// Attendance API
export const attendanceAPI = {
  checkIn: (eventId, userId) => api.post(`/api/events/${eventId}/checkin`, userId ? { user_id: userId } : {}),
  getEventAttendance: (eventId) => api.get(`/api/events/${eventId}/attendance`),
  getUserAttendance: () => api.get('/api/users/me/attendance'),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/api/admin/analytics'),
  getAllEvents: (params) => api.get('/api/admin/events', { params }),
  getPendingEvents: () => api.get('/api/admin/events/pending'),
  getAllUsers: (params) => api.get('/api/admin/users', { params }),
  updateUserRole: (userId, role) => api.put(`/api/admin/users/${userId}/role`, { role }),
};

// Coordinator API
export const coordinatorAPI = {
  getDashboard: () => api.get('/api/coordinator/dashboard'),
  getMyClubs: () => api.get('/api/coordinator/clubs'),
  getMyEvents: (params) => api.get('/api/coordinator/events', { params }),
  createEvent: (data) => api.post('/api/coordinator/events', data),
  updateEvent: (id, data) => api.put(`/api/coordinator/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/api/coordinator/events/${id}`),
  getEventRegistrations: (id) => api.get(`/api/coordinator/events/${id}/registrations`),
};

export default api;