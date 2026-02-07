const OrderItem = require("./orderItem.model");

class OrderItemService {
  static async getAllOrderItems() {
    return await OrderItem.find().populate("product");
  }

  static async getOrderItemById(id) {
    return await OrderItem.findById(id).populate("product");
  }

  static async getOrderItemCount() {
    return await OrderItem.countDocuments();
  }

  static async createOrderItem(data) {
    const orderItem = new OrderItem(data);
    return await orderItem.save();
  }

  static async updateOrderItem(id, data) {
    return await OrderItem.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteOrderItem(id) {
    return await OrderItem.findByIdAndDelete(id);
  }
}

module.exports = OrderItemService;
