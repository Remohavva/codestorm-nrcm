const express = require('express');
const router = express.Router();
const { 
  checkInUser, 
  getEventAttendance, 
  getUserAttendance 
} = require('../controllers/attendanceController');
const { authenticateToken, requireClubLeadOrAdmin } = require('../middleware/auth');

// Check-in routes
router.post('/events/:id/checkin', authenticateToken, checkInUser);

// Attendance viewing routes
router.get('/events/:id/attendance', authenticateToken, requireClubLeadOrAdmin, getEventAttendance);
router.get('/users/me/attendance', authenticateToken, getUserAttendance);

module.exports = router;