const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'string.empty': 'Name is a required field',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is a required field',
    'string.email': 'Invalid email address',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  street: Joi.string().allow('').optional(),
  apartment: Joi.string().allow('').optional(),
  city: Joi.string().allow('').optional(),
  zip: Joi.string().allow('').optional(),
  country: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  isAdmin: Joi.boolean().optional(),
});
