const orderService = require("./order.service");


const getAllOrders = async (_, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "Failed",
        message: "Order wasn't found",
      });
    }
    res.status(200).json({
      status: "Success",
      order,
    });
  } catch (err) {
    next(err);
  }
};


const getTotalSales = async (_, res) => {
  try {
    const totalSales = await orderService.getTotalSales();
    res.status(200).json({
      status: "Success",
      totalSales,
    });
  } catch (err) {
    next(err);
  }
};

const getOrderCount = async (_, res) => {
  try {
    const count = await orderService.getOrderCount();
    res.status(200).json({
      status: "Success",
      count,
    });
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.params.userId);
    res.status(200).json({
      status: "Success",
      orders,
    });
  } catch (err) {
    next(err);
  }
};


const postOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({
      status: "Success",
      order,
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    if (!order) {
      return res.status(404).json({
        status: "Failed",
        message: "Order wasn't found",
      });
    }
    res.status(200).json({
      status: "Success",
      order,
    });
  } catch (err) {
    next(err);
  }
};


const deleteOrder = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: "Failed",
        message: "Order wasn't found",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Order was deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postOrder,
  getAllOrders,
  getOrder,
  updateStatus,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
};
