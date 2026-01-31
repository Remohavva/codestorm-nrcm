import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // You can add navigation to login screen here
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email, password) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Events methods
  async getEvents(params = {}) {
    const response = await this.api.get('/events', { params });
    return response.data;
  }

  async getEvent(id) {
    const response = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async registerForEvent(eventId) {
    const response = await this.api.post(`/events/${eventId}/register`);
    return response.data;
  }

  async checkinToEvent(eventId) {
    const response = await this.api.post(`/events/${eventId}/checkin`);
    return response.data;
  }

  // Clubs methods
  async getClubs() {
    const response = await this.api.get('/clubs');
    return response.data;
  }

  async getClub(id) {
    const response = await this.api.get(`/clubs/${id}`);
    return response.data;
  }

  // Community methods
  async getPosts(params = {}) {
    const response = await this.api.get('/community/posts', { params });
    return response.data;
  }

  async getPost(id) {
    const response = await this.api.get(`/community/posts/${id}`);
    return response.data;
  }

  async createPost(postData) {
    const response = await this.api.post('/community/posts', postData);
    return response.data;
  }

  async updatePost(id, postData) {
    const response = await this.api.put(`/community/posts/${id}`, postData);
    return response.data;
  }

  async deletePost(id) {
    const response = await this.api.delete(`/community/posts/${id}`);
    return response.data;
  }

  async addComment(postId, content) {
    const response = await this.api.post(`/community/posts/${postId}/comments`, { content });
    return response.data;
  }

  async reactToPost(postId, type) {
    const response = await this.api.post(`/community/posts/${postId}/react`, { type });
    return response.data;
  }

  async reportContent(reportData) {
    const response = await this.api.post('/community/reports', reportData);
    return response.data;
  }

  // User methods
  async getUserRegistrations() {
    const response = await this.api.get('/users/me/registrations');
    return response.data;
  }

  async getUserAttendance() {
    const response = await this.api.get('/users/me/attendance');
    return response.data;
  }
}

export default new ApiService();