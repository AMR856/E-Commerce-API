const Joi = require("joi");
const objectId = require('../../utils/objectID');

class UserValidationSchemas {
  static register = Joi.object({
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
    role: Joi.string().valid("user", "admin").messages({
      "any.only": "Role must be either 'user' or 'admin'",
    }),
    street: Joi.string().allow("").optional(),
    apartment: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    zip: Joi.string().allow("").optional(),
    country: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
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

    static update = Joi.object({
    name: Joi.string().trim().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().min(6).messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password cannot be empty",
    }),
    street: Joi.string().trim().allow("").messages({
      "string.base": "Street must be a string",
    }),
    apartment: Joi.string().trim().allow("").messages({
      "string.base": "Apartment must be a string",
    }),
    city: Joi.string().trim().allow("").messages({
      "string.base": "City must be a string",
    }),
    zip: Joi.string().trim().allow("").messages({
      "string.base": "ZIP must be a string",
    }),
    country: Joi.string().trim().allow("").messages({
      "string.base": "Country must be a string",
    }),
    phone: Joi.string().trim().allow("").messages({
      "string.base": "Phone must be a string",
    }),
    role: Joi.string().valid("user", "admin").messages({
      "any.only": "Role must be either 'user' or 'admin'",
    }),
  }).min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  });

  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "User ID is required",
    }),
  });
  static changePassword = Joi.object({
    oldPassword: Joi.string().min(6).required().messages({
      "string.base": "Old password must be a string",
      "string.empty": "Old password is required",
      "string.min": "Old password must be at least 6 characters",
      "any.required": "Old password is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
      "string.base": "New password must be a string",
      "string.empty": "New password is required",
      "string.min": "New password must be at least 6 characters",
      "any.required": "New password is required",
    }),
  });
}

module.exports = UserValidationSchemas;
