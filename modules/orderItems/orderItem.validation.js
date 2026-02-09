const Joi = require("joi");
const objectId = require('../../utils/objectID');

class OrderItemValidationSchemas {
  static idParam = Joi.object({
    id: objectId.required().messages({
      "any.required": "OrderItem ID is required",
    }),
  });
  static create = Joi.object({});
}

module.exports = OrderItemValidationSchemas;
