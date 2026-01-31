import { createClient } from '@supabase/supabase-js';

import { mockApiResponses } from './mockData';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Mock mode flag
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false;

// Auth service
export const authService = {
  // Login with email and password
  async login(email, password) {
    try {
      // Mock authentication for demo purposes
      if (password === 'password123') {
        let user;
        
        // Check if it's a coordinator
        if (email === 'alex.chen@university.edu') {
          user = {
            id: 'coord_1',
            name: 'Alex Chen',
            email: 'alex.chen@university.edu',
            role: 'coordinator',
            clubId: 1,
            clubName: 'Tech Society',
            position: 'President'
          };
        } else if (email === 'emma.wilson@university.edu') {
          user = {
            id: 'coord_2',
            name: 'Emma Wilson',
            email: 'emma.wilson@university.edu',
            role: 'coordinator',
            clubId: 2,
            clubName: 'Photography Club',
            position: 'President'
          };
        } else if (email === 'coordinator@university.edu') {
          user = {
            id: 'coord_demo',
            name: 'Demo Coordinator',
            email: 'coordinator@university.edu',
            role: 'coordinator',
            clubId: 1,
            clubName: 'Tech Society',
            position: 'Coordinator'
          };
        } else if (email === 'admin@university.edu') {
          user = {
            id: 'admin_1',
            name: 'Admin User',
            email: 'admin@university.edu',
            role: 'admin'
          };
        } else {
          // Default student user
          user = {
            id: 'student_1',
            name: 'John Doe',
            email: email,
            role: 'student',
            year: '3rd Year',
            course: 'Computer Science'
          };
        }

        const session = {
          access_token: 'mock_token_' + Date.now(),
          user: user
        };

        // Store auth data
        localStorage.setItem('auth_token', session.access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        return { user, session };
      }

      // If not demo credentials, try API call
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Store auth data
        localStorage.setItem('auth_token', data.data.session.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.data.user));
        
        return {
          user: data.data.user,
          session: data.data.session,
        };
      }

      throw new Error(data.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        // Store auth data
        localStorage.setItem('auth_token', data.data.session.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.data.user));
        
        return {
          user: data.data.user,
          session: data.data.session,
        };
      }

      throw new Error(data.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Get current user
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      
      // Ensure user properties are safe for rendering
      if (user && typeof user === 'object') {
        // Convert any nested objects to strings to prevent rendering issues
        const safeUser = {
          ...user,
          name: typeof user.name === 'string' ? user.name : String(user.name || 'User'),
          email: typeof user.email === 'string' ? user.email : String(user.email || ''),
          role: typeof user.role === 'string' ? user.role : String(user.role || 'student'),
          // Ensure other properties are safe
          id: user.id,
          student_id: user.student_id || user.studentId,
          department: user.department,
          year: user.year,
          course: user.course
        };
        return safeUser;
      }
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear corrupted data
      localStorage.removeItem('user_data');
      return null;
    }
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role || null;
  },

  // Check if user has specific role
  hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  },

  // Refresh token (if needed)
  async refreshToken() {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth_token', data.data.access_token);
        return data.data.access_token;
      }

      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  },
};

// API helper with auth
export const apiClient = {
  async request(endpoint, options = {}) {
    // Check if we should use mock data
    if (USE_MOCK_DATA && mockApiResponses[endpoint]) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockApiResponses[endpoint];
    }

    const token = authService.getToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle auth errors
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          return;
        }
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Fallback to mock data if API fails
      if (mockApiResponses[endpoint]) {
        console.warn(`API failed, using mock data for ${endpoint}`);
        return mockApiResponses[endpoint];
      }
      
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },
};

export default authService;