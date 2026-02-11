const { required } = require("joi");
const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const orderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = orderItem;
