const Joi = require("joi");
const objectId = require('../../utils/objectID');

class ProductValidationSchemas {
  static create = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
      "string.base": "Product name must be a text string",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least {#limit} character long",
      "string.max": "Product name cannot exceed {#limit} characters",
      "any.required": "Please provide a product name",
    }),
    description: Joi.string().required().messages({
      "string.base": "Description must be a text string",
      "string.empty": "Description is required",
      "any.required": "Please provide a description",
    }),
    richDescrition: Joi.string().allow("").optional().messages({
      "string.base": "Rich description must be a text string",
    }),
    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "any.required": "Price is required",
    }),
    category: Joi.string().length(24).hex().required().messages({
      "string.base": "Category ID must be a string",
      "string.empty": "Category ID is required",
      "string.length": "Category ID must be 24 characters",
      "string.hex": "Category ID must be a valid hexadecimal",
      "any.required": "Category is required",
    }),
    countInStock: Joi.number().min(0).max(1000).optional().messages({
      "number.base": "Count in stock must be a number",
      "number.min": "Count in stock cannot be negative",
      "number.max": "Count in stock cannot exceed {#limit}",
    }),
    brand: Joi.string().allow("").optional().messages({
      "string.base": "Brand must be a text string",
    }),
    images: Joi.array()
      .items(
        Joi.string().uri().messages({
          "string.uri": "Each image must be a valid URL",
          "string.base": "Each image must be a string",
        }),
      )
      .optional(),
    isFeatured: Joi.boolean().optional().messages({
      "boolean.base": "isFeatured must be true or false",
    }),
  });
  static update = Joi.object({
    name: Joi.string().min(1).max(50).optional().messages({
      "string.base": "Product name must be a text string",
      "string.empty": "Product name cannot be empty",
      "string.min": "Product name must be at least {#limit} character long",
      "string.max": "Product name cannot exceed {#limit} characters",
    }),
    description: Joi.string().optional().messages({
      "string.base": "Description must be a text string",
      "string.empty": "Description cannot be empty",
    }),
    richDescrition: Joi.string().allow("").optional().messages({
      "string.base": "Rich description must be a text string",
    }),
    price: Joi.number().min(0).optional().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
    }),
    category: Joi.string().length(24).hex().optional().messages({
      "string.base": "Category ID must be a string",
      "string.length": "Category ID must be 24 characters",
      "string.hex": "Category ID must be a valid hexadecimal",
    }),
    countInStock: Joi.number().min(0).max(1000).optional().messages({
      "number.base": "Count in stock must be a number",
      "number.min": "Count in stock cannot be negative",
      "number.max": "Count in stock cannot exceed {#limit}",
    }),
    brand: Joi.string().allow("").optional().messages({
      "string.base": "Brand must be a text string",
    }),
    images: Joi.array()
      .items(
        Joi.string().uri().messages({
          "string.uri": "Each image must be a valid URL",
          "string.base": "Each image must be a string",
        }),
      )
      .optional(),
    isFeatured: Joi.boolean().optional().messages({
      "boolean.base": "isFeatured must be true or false",
    }),
  });
  static isName = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
      "string.base": "Product name must be a text string",
      "string.empty": "Product name is required",
      "string.min": "Product name must be at least {#limit} character long",
      "string.max": "Product name cannot exceed {#limit} characters",
      "any.required": "Please provide a product name",
    }),
  });

  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "Product ID is required",
    }),
  });
  static createRating = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot exceed 5",
      "any.required": "Rating is required",
    }),
  });
}

module.exports = ProductValidationSchemas;
