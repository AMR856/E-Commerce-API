const OrderItemService = require("./orderItem.service");

class OrderItemController {
  static async getAll(req, res, next) {
    try {
      const orderItems = await OrderItemService.getAllOrderItems();

      if (!orderItems.length) {
        return res.status(200).json({
          status: "Success",
          message: "No order items were added yet",
        });
      }

      res.status(200).json({
        status: "Success",
        data: orderItems,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const orderItem = await OrderItemService.getOrderItemById(req.params.id);

      res.status(200).json({
        status: "Success",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(req, res, next) {
    try {
      const count = await OrderItemService.getOrderItemCount();

      res.status(200).json({
        status: "Success",
        count,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const orderItem = await OrderItemService.createOrderItem(req.body);
      res.status(201).json({
        status: "Success",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const orderItem = await OrderItemService.updateOrderItem(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "Success",
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await OrderItemService.deleteOrderItem(req.params.id);
      res.status(200).json({
        status: "Success",
        message: "Order item deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderItemController;
