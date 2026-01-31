const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  getEvent, 
  approveEvent, 
  rejectEvent, 
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { authenticateToken, requireAdmin, requireClubLeadOrAdmin } = require('../middleware/auth');
const { validate, eventSchema, eventUpdateSchema } = require('../utils/validation');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', authenticateToken, requireClubLeadOrAdmin, validate(eventSchema), createEvent);
router.put('/:id', authenticateToken, requireClubLeadOrAdmin, validate(eventUpdateSchema), updateEvent);
router.delete('/:id', authenticateToken, requireClubLeadOrAdmin, deleteEvent);

// Admin only routes
router.put('/:id/approve', authenticateToken, requireAdmin, approveEvent);
router.put('/:id/reject', authenticateToken, requireAdmin, rejectEvent);

module.exports = router;