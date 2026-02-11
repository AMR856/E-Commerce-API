const Joi = require("joi");
const objectId = require("../../utils/objectID");

class CategoryValidationSchemas {
  static create = Joi.object({
    name: Joi.string().trim().required().messages({
      "string.base": "Name must be a string",
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

    description: Joi.string().trim().allow("").messages({
      "string.base": "Description must be a string",
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

    slug: Joi.string().trim().allow("").messages({
      "string.base": "Slug must be a string",
    }),

    description: Joi.string().trim().allow("").messages({
      "string.base": "Description must be a string",
    }),
  });

  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "Category ID is required",
    }),
  });

  static slugParam = Joi.object({
    slug: Joi.string().trim().required().messages({
      "string.base": "Slug must be a string",
      "string.empty": "Slug is required",
      "any.required": "Slug is required",
    }),
  });
}

module.exports = CategoryValidationSchemas;
