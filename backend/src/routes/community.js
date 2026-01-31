const express = require('express');
const router = express.Router();
const { 
  createPost,
  getPosts,
  getPost,
  addComment,
  reactToPost,
  reportContent,
  updatePost,
  deletePost
} = require('../controllers/communityController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, postSchema, commentSchema, reactionSchema, reportSchema } = require('../utils/validation');

// Public routes (with optional auth for user reactions)
router.get('/posts', (req, res, next) => {
  // Optional authentication - if token exists, verify it, otherwise continue
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
}, getPosts);

router.get('/posts/:id', (req, res, next) => {
  // Optional authentication
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
}, getPost);

// Protected routes (require authentication)
router.post('/posts', authenticateToken, validate(postSchema), createPost);
router.put('/posts/:id', authenticateToken, validate(postSchema), updatePost);
router.delete('/posts/:id', authenticateToken, deletePost);

// Comment routes
router.post('/posts/:id/comments', authenticateToken, validate(commentSchema), addComment);

// Reaction routes
router.post('/posts/:id/react', authenticateToken, validate(reactionSchema), reactToPost);

// Report routes
router.post('/reports', authenticateToken, validate(reportSchema), reportContent);

module.exports = router;