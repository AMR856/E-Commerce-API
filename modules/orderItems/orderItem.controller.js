const OrderItemService = require("./orderItem.service");

const getAllOrderItems = async (_, res) => {
  try {
    const orderItems = await OrderItemService.getAllOrderItems();
    if (!orderItems.length) {
      return res.status(200).json({
        status: "Success",
        message: "No order items were added yet",
      });
    }
    res.status(200).json({ status: "Success", orderItems });
  } catch (err) {
    next(err);
  }
};

const getOrderitem = async (req, res) => {
  try {
    const orderItem = await OrderItemService.getOrderItemById(req.params.id);
    if (!orderItem) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Order item wasn't found" });
    }
    res.status(200).json({ status: "Success", orderItem });
  } catch (err) {
    next(err);
  }
};

const getCount = async (_, res) => {
  try {
    const count = await OrderItemService.getOrderItemCount();
    res.status(200).json({ status: "Success", count });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllOrderItems,
  getOrderitem,
  getCount,
};
