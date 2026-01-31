const express = require('express');
const router = express.Router();
const { 
  registerForEvent, 
  cancelRegistration, 
  getUserRegistrations,
  getEventRegistrations 
} = require('../controllers/registrationController');
const { authenticateToken, requireClubLeadOrAdmin } = require('../middleware/auth');

// User registration routes
router.post('/events/:id/register', authenticateToken, registerForEvent);
router.delete('/events/:id/register', authenticateToken, cancelRegistration);
router.get('/users/me/registrations', authenticateToken, getUserRegistrations);

// Event registration management (for club leads and admins)
router.get('/events/:id/registrations', authenticateToken, requireClubLeadOrAdmin, getEventRegistrations);

module.exports = router;