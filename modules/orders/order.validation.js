const Joi = require("joi");
const objectId = require("../../utils/objectID");

class OrderValidationSchemas {
  static create = Joi.object({
    orderItem: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().length(24).hex().required().messages({
            "string.empty": "Product ID is required",
            "string.length": "Product ID must be 24 characters",
            "string.hex": "Product ID must be a valid hexadecimal",
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Quantity must be a number",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required",
          }),
          user: Joi.string().length(24).hex().required().messages({
            "string.empty": "User ID is required",
            "string.length": "User ID must be 24 characters",
            "string.hex": "User ID must be a valid hexadecimal",
          }),
        }),
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one order item is required",
        "any.required": "Order items are required",
      }),

    shippingAddress1: Joi.string().required().messages({
      "string.empty": "Shipping Address 1 is required",
    }),
    shippingAddress2: Joi.string().allow("").optional(),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),
    zip: Joi.string().allow("").optional(),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
    phone: Joi.string().required().messages({
      "string.empty": "Phone number is required",
    }),
    status: Joi.string().valid("Pending", "Shipped", "Delivered").optional(),
    user: Joi.string().length(24).hex().required().messages({
      "string.empty": "User ID is required",
      "string.length": "User ID must be 24 characters",
      "string.hex": "User ID must be a valid hexadecimal",
    }),
    dateOrdered: Joi.date().optional(),
  });

  static getUserOrders = Joi.object({
    userId: Joi.string().length(24).hex().required().messages({
      "string.empty": "User ID is required",
      "string.length": "User ID must be 24 characters",
      "string.hex": "User ID must be a valid hexadecimal",
    }),
  });

  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "Order ID is required",
    }),
  });
}

module.exports = OrderValidationSchemas;
