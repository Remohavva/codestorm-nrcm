// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error'
  };

  // Supabase errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Resource already exists';
        return res.status(409).json(error);
      case '23503': // Foreign key violation
        error.message = 'Referenced resource not found';
        return res.status(400).json(error);
      case '23514': // Check violation
        error.message = 'Invalid data provided';
        return res.status(400).json(error);
      default:
        error.message = 'Database error';
        return res.status(500).json(error);
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.errors = err.details;
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Default 500 error
  res.status(500).json(error);
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = {
  errorHandler,
  notFound
};