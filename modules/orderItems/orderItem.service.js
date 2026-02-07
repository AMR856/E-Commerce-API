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
      throw new CustomError(404, "Order item not found", HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user._id.toString()
    ) {
      throw new CustomError(403, "Unauthorized access", HTTPStatusText.FAIL);
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
      user: user._id,
    });

    return await orderItem.save();
  }

  static async update(id, data, user) {
    const orderItem = await OrderItem.findById(id);

    if (!orderItem) {
      throw new CustomError(404, "Order item not found", HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user._id.toString()
    ) {
      throw new CustomError(403, "Unauthorized update", HTTPStatusText.FAIL);
    }

    return await OrderItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id, user) {
    const orderItem = await OrderItem.findById(id);

    if (!orderItem) {
      throw new CustomError(404, "Order item not found", HTTPStatusText.FAIL);
    }

    if (
      user.role !== "admin" &&
      orderItem.user.toString() !== user._id.toString()
    ) {
      throw new CustomError(403, "Unauthorized delete", HTTPStatusText.FAIL);
    }

    await orderItem.deleteOne();
  }
}

module.exports = OrderItemService;
