const OrderItem = require("./orderItem.model");
const CustomError = require("../../utils/customError");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class OrderItemService {
  static async getAll(user) {
    const filter = user.role === "admin" ? {} : { user: user._id };
    return await OrderItem.find(filter).populate("product");
  }

  static async getOne(id, user) {
    const orderItem = await OrderItem.findById(id).populate("product");
    
    if (!orderItem) {
      throw new CustomError("Order item not found", 404, HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user.userId.toString()
    ) {
      throw new CustomError("Unauthorized access", 403, HTTPStatusText.FAIL);
    }

    return orderItem;
  }

  static async getCount(user) {
    const filter = user.role === "admin" ? {} : { user: user._id };
    return await OrderItem.countDocuments(filter);
  }

  static async create(data, user) {
    const orderItem = new OrderItem({
      ...data,
      user: user.userId,
    });
    return await orderItem.save();
  }

  static async update(id, data, user) {
    const orderItem = await OrderItem.findById(id);
    if (!orderItem) {
      throw new CustomError("Order item not found", 404, HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user.userId.toString()
    ) {
      throw new CustomError("Unauthorized update", 403, HTTPStatusText.FAIL);
    }

    return await OrderItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id, user) {
    const orderItem = await OrderItem.findById(id);

    if (!orderItem) {
      throw new CustomError("Order item not found", 404, HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user.userId.toString()
    ) {
      throw new CustomError("Unauthorized delete", 403, HTTPStatusText.FAIL);
    }

    await orderItem.deleteOne();
  }
}

module.exports = OrderItemService;
