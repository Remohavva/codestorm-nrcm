const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  downloadCertificate,
  verifyCertificate,
  getUserCertificates
} = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/:certificateId/verify', verifyCertificate);
router.get('/:certificateId/download', downloadCertificate);

// Protected routes
router.post('/generate/:registrationId', authenticateToken, generateCertificate);
router.get('/my-certificates', authenticateToken, getUserCertificates);

module.exports = router;