const Order = require("./order.model");
const OrderItem = require("../orderItems/orderItem.model");

const postOrder = async function postOrder(req, res) {
  try {
    const orderItemIdsList = await Promise.all(
      req.body.orderItem.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      }),
    );

    const totalPrices = await Promise.all(
      orderItemIdsList.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((acc, arrValue) => acc+arrValue, 0);

    let order = new Order({
      orderItem: orderItemIdsList,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
      dateOrdered: req.body.dateOrdered,
    });
    order = await order.save();
    res.status(201).json({
      status: "Success",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getAllOrders = async function getAllOrders(_, res) {
  try {
    // -1 => Newest to oldest
    const orderList = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });

    if (orderList.length === 0) {
      return res.status(200).json({
        status: "Sucesss",
        message: "No orders were added yet",
      });
    }
    res.status(200).send(orderList);
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getOrder = async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItem",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    if (order) {
      res.status(200).json({
        status: "Success",
        order,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Order wasn't found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const updateStatus = async function updateStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      { new: true },
    );
    if (order) {
      res.status(201).json({
        status: "Success",
        order,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Order wasn't found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  }
};

const deleteOrder = async function deleteOrder(req, res) {
  Order.findByIdAndDelete(req.params.id)
  .then(async (order) => {
    if (order) {
      await order.orderItem.map(async orderItem => {
        await OrderItem.findByIdAndDelete(orderItem);
      });
      res.status(200).json({
        status: "Success",
        message: "Order was deleted successfully",
      });
    } else {
      res.status(404).json({
        status: "Success",
        message: "Order wasn't found",
      });
    }
  })
  .catch((err) => {
    res.status(400).json({
      status: "Failed",
      error: err,
    });
  });
};

const getTotalSales = async function getTotalSales(_, res) {
  const totalSales = await Order.aggregate([
    {$group: {_id: null, totalSales: { $sum: '$totalPrice'}}}
  ]);
  if (!totalSales) {
    res.status(400).json({
      status: 'Failed',
      message: "Couldn't get totalsales or it was 0"
    });
  }
  res.status(200).json({
    status: 'Success',
    totalSales: totalSales.pop()['totalSales']
  });
};

const getOrderCount = async function getOrderCount(_, res) {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).json({
      status: "Sucesss",
      count: orderCount,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
  }
};

const getUserOrders = async function getUserOrders(req, res) {
  try {
    const orderList = await Order.find({user: req.params.userId})
      .populate({
        path: "orderItem",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    if (orderList) {
      res.status(200).json({
        status: "Success",
        orderList,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "This user doesn't have any orders",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err,
    });
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
  getUserOrders
};
