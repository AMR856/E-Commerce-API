const Joi = require("joi");

class OrderItemValidationSchema {
  static get = Joi.object({
    id: Joi.string().length(24).hex().required().messages({
      "string.empty": "OrderItem ID is required",
      "string.length": "OrderItem  must be 24 characters",
      "string.hex": "OrderItem ID must be a valid hexadecimal",
    }),
  });
  static create = Joi.object({

  });
}

module.exports = OrderItemValidationSchema;
