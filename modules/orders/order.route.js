const express = require("express");
const router = express.Router();
const {
  validateBody,
  validateParams,
} = require("../../middlewares/validator");
const {
  createOrderSchema,
  getOrderSchema,
  deleteOrderSchema,
  getUserOrdersSchema,
  updateOrderStatusSchema,
} = require("./order.validation");

const {
  getAllOrders,
  postOrder,
  getOrder,
  updateStatus,
  deleteOrder,
  getTotalSales,
  getOrderCount,
  getUserOrders,
} = require("./order.controller");

router.get("/", getAllOrders);
router.get(
  "/get/userorders/:userId",
  validateParams(getUserOrdersSchema),
  getUserOrders,
);
router.get("/get/count", getOrderCount);
router.get("/get/totalsales", getTotalSales);
router.get("/:id", validateParams(getOrderSchema), getOrder);
router.post("/", validateBody(createOrderSchema), postOrder);
router.post("/:id", validateParams(updateOrderStatusSchema), updateStatus);
router.delete("/:id", validateParams(deleteOrderSchema), deleteOrder);

module.exports = router;
