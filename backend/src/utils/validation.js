const Joi = require('joi');

// User validation schemas
const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'club_lead', 'admin').default('student')
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Club validation schemas
const clubSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional()
});

// Event validation schemas
const eventSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional(),
  date: Joi.date().iso().greater('now').required(),
  venue: Joi.string().min(2).max(255).required(),
  capacity: Joi.number().integer().min(1).required(),
  club_id: Joi.string().uuid().required()
});

const eventUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  date: Joi.date().iso().greater('now').optional(),
  venue: Joi.string().min(2).max(255).optional(),
  capacity: Joi.number().integer().min(1).optional()
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  clubSchema,
  eventSchema,
  eventUpdateSchema,
  validate
};