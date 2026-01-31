const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getMyEvents,
  getMyClubs,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations
} = require('../controllers/coordinatorController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All coordinator routes require club_lead role
router.use(authenticateToken);
router.use(requireRole(['club_lead', 'admin'])); // Admin can also access coordinator features

// Dashboard and overview
router.get('/dashboard', getDashboard);

// Club management
router.get('/clubs', getMyClubs);

// Event management
router.get('/events', getMyEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Event registrations
router.get('/events/:id/registrations', getEventRegistrations);

module.exports = router;