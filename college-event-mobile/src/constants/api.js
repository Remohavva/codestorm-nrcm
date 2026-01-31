// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://10.10.10.143:3001/api'  // Development
  : 'https://your-production-api.com/api'; // Production

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',
  
  // Events
  EVENTS: '/events',
  EVENT_REGISTER: (id) => `/events/${id}/register`,
  EVENT_CHECKIN: (id) => `/events/${id}/checkin`,
  
  // Clubs
  CLUBS: '/clubs',
  
  // Community
  COMMUNITY_POSTS: '/community/posts',
  COMMUNITY_POST: (id) => `/community/posts/${id}`,
  COMMUNITY_COMMENT: (id) => `/community/posts/${id}/comments`,
  COMMUNITY_REACT: (id) => `/community/posts/${id}/react`,
  COMMUNITY_REPORT: '/community/reports',
  
  // User
  USER_REGISTRATIONS: '/users/me/registrations',
  USER_ATTENDANCE: '/users/me/attendance',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};