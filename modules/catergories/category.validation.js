const Joi = require("joi");

class CategoryValidationSchemas {
  static create = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required",
      "any.required": "Name is a required field",
    }),
    icon: Joi.string().trim().allow("").messages({
      "string.base": "Icon must be a string",
    }),
    color: Joi.string().trim().allow("").messages({
      "string.base": "Color must be a string",
    }),
    slug: Joi.string().trim().allow("").messages({
      "string.base": "Slug must be a string",
    }),
  });

  static update = Joi.object({
    name: Joi.string().trim().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
    }),
    icon: Joi.string().trim().allow("").messages({
      "string.base": "Icon must be a string",
    }),
    color: Joi.string().trim().allow("").messages({
      "string.base": "Color must be a string",
    }),
  });

  static idParam = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
      "string.empty": "Category ID is required",
      "string.length": "Category ID must be 24 characters",
      "string.hex": "Category ID must be a valid hexadecimal",
    }),
  });
}

module.exports = CategoryValidationSchemas;
