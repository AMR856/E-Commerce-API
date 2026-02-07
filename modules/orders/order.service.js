const Order = require("./order.model");
const OrderItem = require("../orderItems/orderItem.model");
const CustomError = require("../../utils/customError");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class OrderService {
  static async getTotalSales() {
    const result = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);

    return result.length ? result[0].totalSales : 0;
  }

  static async getCount() {
    return await Order.countDocuments();
  }

  static async getUserOrders(userId) {
    return await Order.find({ user: userId }).populate({
      path: "orderItem",
      populate: {
        path: "product",
        populate: "category",
      },
    });
  }

  static async getAll() {
    return await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
  }

  static async getOne(orderId, user) {
    const order = await Order.findById(orderId)
      .populate("user", "name role")
      .populate({
        path: "orderItem",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    if (!order) {
      throw new CustomError("Order not found", 404, HTTPStatusText.FAIL);
    }

    if (user.role !== "admin" && order.user._id.toString() !== user.userId) {
      throw new CustomError("Unauthorized access", 403, HTTPStatusText.FAIL);
    }

    return order;
  }

  static async create(data) {
    if (!data.orderItem || !data.orderItem.length) {
      throw new CustomError(
        "Order items are required",
        400,
        HTTPStatusText.FAIL,
      );
    }

    const orderItemIds = await Promise.all(
      data.orderItem.map(async (item) => {
        const orderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product,
        });

        const savedOrderItem = await orderItem.save();
        return savedOrderItem._id;
      }),
    );

    const totalPrices = await Promise.all(
      orderItemIds.map(async (id) => {
        const orderItem = await OrderItem.findById(id).populate(
          "product",
          "price",
        );

        if (!orderItem || !orderItem.product) {
          throw new CustomError(
            "Invalid product in order",
            400,
            HTTPStatusText.FAIL,
          );
        }

        return orderItem.product.price * orderItem.quantity;
      }),
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

  static async update(orderId, data, user) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new CustomError("Order not found", 404, HTTPStatusText.FAIL);
    }

    if (user.role !== "admin" && order.user._id.toString() !== user.userId) {
      throw new CustomError("Unauthorized update", 403, HTTPStatusText.FAIL);
    }

    order.shippingAddress1 = data.shippingAddress1 ?? order.shippingAddress1;
    order.shippingAddress2 = data.shippingAddress2 ?? order.shippingAddress2;
    order.city = data.city ?? order.city;
    order.zip = data.zip ?? order.zip;
    order.country = data.country ?? order.country;
    order.phone = data.phone ?? order.phone;

    return await order.save();
  }

  static async updateStatus(orderId, status, user) {
    if (user.role !== "admin") {
      throw new CustomError(
        "Only admins can update order status",
        403,
        HTTPStatusText.FAIL,
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      throw new CustomError("Order not found", 404, HTTPStatusText.FAIL);
    }

    return order;
  }

  static async delete(orderId, user) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new CustomError("Order not found", 404, HTTPStatusText.FAIL);
    }

    if (user.role !== "admin" && order.user._id.toString() !== user.userId) {
      throw new CustomError("Unauthorized delete", 403, HTTPStatusText.FAIL);
    }

    await Promise.all(
      order.orderItem.map((id) => OrderItem.findByIdAndDelete(id)),
    );

    await order.deleteOne();
    return order;
  }
}

module.exports = OrderService;
