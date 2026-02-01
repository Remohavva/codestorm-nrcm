const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { uploadImage } = require('../controllers/uploadController');

// Upload image endpoint
router.post('/image', authenticateToken, uploadImage);

module.exports = router;