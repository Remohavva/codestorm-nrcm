const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getAllEvents, 
  getAllUsers, 
  updateUserRole,
  getPendingEvents,
  updateEventStatus
} = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Analytics and dashboard
router.get('/analytics', getAnalytics);
router.get('/events/pending', getPendingEvents);

// Management routes
router.get('/events', getAllEvents);
router.put('/events/:id/status', updateEventStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
router.get('/events', getAllEvents);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;