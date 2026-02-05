const Order = require("./order.model");
const OrderItem = require("../orderItems/orderItem.model");

class OrderService {
  async createOrder(data) {
    const orderItemIds = await Promise.all(
      data.orderItem.map(async (item) => {
        let orderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product,
        });
        orderItem = await orderItem.save();
        return orderItem._id;
      })
    );

    const totalPrices = await Promise.all(
      orderItemIds.map(async (id) => {
        const orderItem = await OrderItem
          .findById(id)
          .populate("product", "price");
        return orderItem.product.price * orderItem.quantity;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const order = new Order({
      orderItem: orderItemIds,
      shippingAddress1: data.shippingAddress1,
      shippingAddress2: data.shippingAddress2,
      city: data.city,
      zip: data.zip,
      country: data.country,
      phone: data.phone,
      status: data.status,
      totalPrice,
      user: data.user,
      dateOrdered: data.dateOrdered,
    });

    return await order.save();
  }

  async getAllOrders() {
    return await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
  }

  async getOrderById(orderId) {
    return await Order.findById(orderId)
      .populate("user", "name")
      .populate({
        path: "orderItem",
        populate: {
          path: "product",
          populate: "category",
        },
      });
  }

  async updateOrderStatus(orderId, status) {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  }

  async deleteOrder(orderId) {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return null;

    await Promise.all(
      order.orderItem.map(id => OrderItem.findByIdAndDelete(id))
    );

    return order;
  }

  async getTotalSales() {
    const result = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ]);
    return result.length ? result[0].totalSales : 0;
  }

  async getOrderCount() {
    return await Order.countDocuments();
  }

  async getUserOrders(userId) {
    return await Order.find({ user: userId })
      .populate({
        path: "orderItem",
        populate: {
          path: "product",
          populate: "category",
        },
      });
  }
}

module.exports = new OrderService();
