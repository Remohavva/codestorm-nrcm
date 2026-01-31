// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://10.10.10.143:3002/api'  // Development - Use computer's IP for mobile testing
  : 'https://your-production-api.com/api'; // Production

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Community
  COMMUNITY_POSTS: '/community/posts',
  COMMUNITY_POST: (id) => `/community/posts/${id}`,
  COMMUNITY_COMMENT: (id) => `/community/posts/${id}/comments`,
  COMMUNITY_REACT: (id) => `/community/posts/${id}/react`,
};