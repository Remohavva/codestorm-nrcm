const express = require('express');
const router = express.Router();
const { createClub, getClubs, getClub, updateClub } = require('../controllers/clubController');
const { authenticateToken, requireClubLeadOrAdmin } = require('../middleware/auth');
const { validate, clubSchema } = require('../utils/validation');

// Public routes
router.get('/', getClubs);
router.get('/:id', getClub);

// Protected routes
router.post('/', authenticateToken, requireClubLeadOrAdmin, validate(clubSchema), createClub);
router.put('/:id', authenticateToken, requireClubLeadOrAdmin, validate(clubSchema), updateClub);

module.exports = router;