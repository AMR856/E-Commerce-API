const Joi = require('joi');
const mongoose = require("mongoose");
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message("Invalid MongoDB ObjectId");
  }
  return value;
});

module.exports = objectId;
