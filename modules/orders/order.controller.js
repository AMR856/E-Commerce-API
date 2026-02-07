const orderService = require("./order.service");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class OrderController {
  static getAll = async (req, res, next) => {
    try {
      const orders = await orderService.getAll(req.user);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, orders });
    } catch (err) {
      next(err);
    }
  };

  static getOne = async (req, res, next) => {
    try {
      const order = await orderService.getOne(req.params.id, req.user);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, order });
    } catch (err) {
      next(err);
    }
  };

  static getTotalSales = async (req, res, next) => {
    try {
      const totalSales = await orderService.getTotalSales(req.user);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, totalSales });
    } catch (err) {
      next(err);
    }
  };

  static getCount = async (req, res, next) => {
    try {
      const count = await orderService.getCount(req.user);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, count });
    } catch (err) {
      next(err);
    }
  };

  static getUserOrders = async (req, res, next) => {
    try {
      const orders = await orderService.getUserOrders(
        req.params.userId,
        req.user,
      );
      res.status(200).json({ status: HTTPStatusText.SUCCESS, orders });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req, res, next) => {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json({ status: HTTPStatusText.SUCCESS, order });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req, res, next) => {
    try {
      const order = await orderService.update(
        req.params.id,
        req.body,
        req.user,
      );
      res.status(200).json({ status: HTTPStatusText.SUCCESS, order });
    } catch (err) {
      next(err);
    }
  };

  static updateStatus = async (req, res, next) => {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        req.body.status,
        req.user,
      );
      res.status(200).json({ status: HTTPStatusText.SUCCESS, order });
    } catch (err) {
      next(err);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const order = await orderService.delete(req.params.id, req.user);
      res
        .status(200)
        .json({
          status: HTTPStatusText.SUCCESS,
          message: "Order deleted successfully",
          order,
        });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = OrderController;
