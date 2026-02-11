const Joi = require("joi");
const objectId = require("../../utils/objectID");

class OrderItemValidationSchemas {
  static create = Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
    product: objectId.required().messages({
      "any.required": "Product ID is required",
    })
  });

  static update = Joi.object({
    quantity: Joi.number().integer().min(1).messages({
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "number.min": "Quantity must be at least 1",
    }),
    product: objectId.messages({
      "any.required": "Product ID is required",
    }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    });

  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "OrderItem ID is required",
    }),
  });
}

module.exports = OrderItemValidationSchemas;
