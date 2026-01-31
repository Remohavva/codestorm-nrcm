const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getAllEvents, 
  getAllUsers, 
  updateUserRole,
  getPendingEvents,
  updateEventStatus,
  getReports,
  handleReport,
  getCommunityAnalytics
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Analytics and dashboard
router.get('/analytics', getAnalytics);
router.get('/events/pending', getPendingEvents);
router.get('/community/analytics', getCommunityAnalytics);

// Management routes
router.get('/events', getAllEvents);
router.put('/events/:id/status', updateEventStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Community moderation routes
router.get('/reports', getReports);
router.put('/reports/:id', handleReport);

module.exports = router;