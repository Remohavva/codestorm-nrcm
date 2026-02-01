const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  getUnreadCount,
  searchUsers
} = require('../controllers/chatController');

// All chat routes require authentication
router.use(authenticateToken);

// Get user's conversations
router.get('/conversations', getConversations);

// Get or create conversation with another user
router.get('/conversations/with/:otherUserId', getOrCreateConversation);

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', getMessages);

// Send a message
router.post('/conversations/:conversationId/messages', sendMessage);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Search users to start new conversations
router.get('/users/search', searchUsers);

module.exports = router;