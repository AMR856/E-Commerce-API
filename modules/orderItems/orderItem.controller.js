const OrderItemService = require("./orderItem.service");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class OrderItemController {
  static async getAll(req, res, next) {
    try {
      const orderItems = await OrderItemService.getAll(req.user);
      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        results: orderItems.length,
        data: orderItems,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const orderItem = await OrderItemService.getOne(
        req.params.id,
        req.user
      );
      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(req, res, next) {
    try {
      const count = await OrderItemService.getCount(req.user);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        count,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const orderItem = await OrderItemService.create(
        req.body,
        req.user
      );
      res.status(201).json({
        status: HTTPStatusText.SUCCESS,
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const orderItem = await OrderItemService.update(
        req.params.id,
        req.body,
        req.user
      );

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        data: orderItem,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await OrderItemService.delete(req.params.id, req.user);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        message: "Order item deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderItemController;
