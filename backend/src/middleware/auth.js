const { supabaseAdmin } = require('../utils/supabase');

// Middleware to verify JWT token and extract user info
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // For development/testing, we'll use simple token verification
    // In production, you'd use proper Supabase Auth verification
    
    try {
      // Decode our simple token format
      const decoded = Buffer.from(token, 'base64').toString();
      const [userId, timestamp] = decoded.split(':');
      
      // Check if token is expired (1 hour)
      if (Date.now() - parseInt(timestamp) > 3600000) {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      // Get user details from our users table
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = userData;
      next();
    } catch (decodeError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Middleware to check user roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(['admin']);

// Middleware to check if user is club lead or admin
const requireClubLeadOrAdmin = requireRole(['club_lead', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireClubLeadOrAdmin
};