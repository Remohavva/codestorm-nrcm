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
  
  // Chat
  CHAT_CONVERSATIONS: '/chat/conversations',
  CHAT_CONVERSATION_WITH: (userId) => `/chat/conversations/with/${userId}`,
  CHAT_MESSAGES: (conversationId) => `/chat/conversations/${conversationId}/messages`,
  CHAT_SEND_MESSAGE: (conversationId) => `/chat/conversations/${conversationId}/messages`,
  CHAT_UNREAD_COUNT: '/chat/unread-count',
  CHAT_SEARCH_USERS: '/chat/users/search',
  
  // Events
  EVENTS: '/events',
  EVENT: (id) => `/events/${id}`,
  
  // Admin
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_USERS: '/admin/users',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_PENDING_EVENTS: '/admin/events/pending',
  ADMIN_UPDATE_USER_ROLE: (id) => `/admin/users/${id}/role`,
  ADMIN_UPDATE_EVENT_STATUS: (id) => `/admin/events/${id}/status`,
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_HANDLE_REPORT: (id) => `/admin/reports/${id}`,
  ADMIN_COMMUNITY_ANALYTICS: '/admin/community/analytics',
  
  // Upload
  UPLOAD_IMAGE: '/upload/image',
};