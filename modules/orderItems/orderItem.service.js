const OrderItem = require("./orderItem.model");

class OrderItemService {
  async getAllOrderItems() {
    return await OrderItem.find().populate("product");
  }

  async getOrderItemById(id) {
    return await OrderItem.findById(id).populate("product");
  }

  async getOrderItemCount() {
    return await OrderItem.countDocuments();
  }

  async createOrderItem(data) {
    const orderItem = new OrderItem(data);
    return await orderItem.save();
  }

  async updateOrderItem(id, data) {
    return await OrderItem.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteOrderItem(id) {
    return await OrderItem.findByIdAndDelete(id);
  }
}

module.exports = new OrderItemService();
