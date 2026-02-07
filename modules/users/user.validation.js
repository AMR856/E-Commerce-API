const Joi = require("joi");

class UserValidationSchemas {
  static regiser = Joi.object({
    name: Joi.string().min(1).required().messages({
      "string.empty": "Name is a required field",
    }),
    email: Joi.string().email().required().messages({
      "string.empty": "Email is a required field",
      "string.email": "Invalid email address",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    street: Joi.string().allow("").optional(),
    apartment: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    zip: Joi.string().allow("").optional(),
    country: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    isAdmin: Joi.boolean().optional(),
  });

  static login = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": "Email is a required field",
      "string.email": "Invalid email address",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
  });

  static idParam = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
      "string.empty": "User ID is required",
      "string.length": "User ID must be 24 characters",
      "string.hex": "User ID must be a valid hexadecimal",
    }),
  });
}

module.exports = UserValidationSchemas;