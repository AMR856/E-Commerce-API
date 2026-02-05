const OrderItem = require("./orderItem.model");

const getAllOrderItems = async function getAllOrderItems(_, res) {
  try {
    const orderItemsList = await OrderItem .find()
    if (orderItemsList.length === 0) {
      return res.status(200).json({
        status: "Sucesss",
        message: "No order items were added yet",
      });
    }
    res.status(200).send(orderItemsList);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getOrderitem = async function getOrderitem(req, res) {
  try {
    const orderitem = await OrderItem.findById(req.params.id);
    if (orderitem) {
      res.status(200).json({
        status: "Success",
        orderitem,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Order item wasn't found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getCount = async function getCount(_, res) {
  try {
    const orderItemListCount = await OrderItem.countDocuments();
    res.status(200).json({
      status: "Sucesss",
      count: orderItemListCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

module.exports = {
  getAllOrderItems,
  getOrderitem,
  getCount
};
