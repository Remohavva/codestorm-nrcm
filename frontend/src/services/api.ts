import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'club_lead' | 'admin';
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  lead_id: string;
  created_at: string;
  lead?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  venue: string;
  capacity: number;
  club_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  club?: {
    id: string;
    name: string;
  };
  registration_count?: number;
  available_spots?: number;
}

export interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  status: 'registered' | 'cancelled';
  created_at: string;
  event?: Event;
}

export interface Attendance {
  id: string;
  user_id: string;
  event_id: string;
  checked_in_at: string;
  event?: Event;
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  getProfile: () => api.get('/api/auth/profile'),
};

// Clubs API
export const clubsAPI = {
  getAll: () => api.get('/api/clubs'),
  
  getById: (id: string) => api.get(`/api/clubs/${id}`),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/api/clubs', data),
  
  update: (id: string, data: { name: string; description?: string }) =>
    api.put(`/api/clubs/${id}`, data),
};

// Events API
export const eventsAPI = {
  getAll: (params?: { status?: string; club_id?: string; upcoming?: boolean }) =>
    api.get('/api/events', { params }),
  
  getById: (id: string) => api.get(`/api/events/${id}`),
  
  create: (data: {
    title: string;
    description?: string;
    date: string;
    venue: string;
    capacity: number;
    club_id: string;
  }) => api.post('/api/events', data),
  
  update: (id: string, data: Partial<Event>) =>
    api.put(`/api/events/${id}`, data),
  
  approve: (id: string) => api.put(`/api/events/${id}/approve`),
  
  reject: (id: string, reason?: string) =>
    api.put(`/api/events/${id}/reject`, { reason }),
};

// Registrations API
export const registrationsAPI = {
  register: (eventId: string) =>
    api.post(`/api/events/${eventId}/register`),
  
  cancel: (eventId: string) =>
    api.delete(`/api/events/${eventId}/register`),
  
  getUserRegistrations: (params?: { status?: string; upcoming?: boolean }) =>
    api.get('/api/users/me/registrations', { params }),
  
  getEventRegistrations: (eventId: string) =>
    api.get(`/api/events/${eventId}/registrations`),
};

// Attendance API
export const attendanceAPI = {
  checkIn: (eventId: string, userId?: string) =>
    api.post(`/api/events/${eventId}/checkin`, userId ? { user_id: userId } : {}),
  
  getEventAttendance: (eventId: string) =>
    api.get(`/api/events/${eventId}/attendance`),
  
  getUserAttendance: () =>
    api.get('/api/users/me/attendance'),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/api/admin/analytics'),
  
  getAllEvents: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/api/admin/events', { params }),
  
  getPendingEvents: () => api.get('/api/admin/events/pending'),
  
  getAllUsers: (params?: { role?: string; page?: number; limit?: number }) =>
    api.get('/api/admin/users', { params }),
  
  updateUserRole: (userId: string, role: string) =>
    api.put(`/api/admin/users/${userId}/role`, { role }),
};

export default api;