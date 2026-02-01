const express = require('express');
const router = express.Router();
const { 
  createClub, 
  getClubs, 
  getClub, 
  updateClub, 
  joinClub, 
  leaveClub, 
  getClubMembers 
} = require('../controllers/clubController');
const { authenticateToken, requireClubLeadOrAdmin } = require('../middleware/auth');
const { validate, clubSchema } = require('../utils/validation');

// Public routes
router.get('/', getClubs);
router.get('/:id', getClub);
router.get('/:id/members', getClubMembers);

// Protected routes
router.post('/', authenticateToken, requireClubLeadOrAdmin, validate(clubSchema), createClub);
router.put('/:id', authenticateToken, requireClubLeadOrAdmin, validate(clubSchema), updateClub);
router.post('/:id/join', authenticateToken, joinClub);
router.post('/:id/leave', authenticateToken, leaveClub);

module.exports = router;