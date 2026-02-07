const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");
const OrderValidationSchemas = require("./order.validation");
const OrderController = require("./order.controller");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

// Admin
router.get("/", authorize(PERMISSIONS.READ_ALL_ORDERS), OrderController.getAll);
router.get(
  "/get/userorders/:userId",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  validator.validateParams(OrderValidationSchemas.getUserOrders),
  OrderController.getUserOrders,
);
router.get(
  "/get/count",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  OrderController.getCount,
);
router.get(
  "/get/totalsales",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  OrderController.getTotalSales,
);

// User Specfic (It has the match the id of the user or be an admin)
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  OrderController.getOne, // Checked
);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateBody(OrderValidationSchemas.create),
  OrderController.create,
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  OrderController.update, // Checked 
);
router.post(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  OrderController.updateStatus, // Checked 
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  OrderController.delete,  // Checked 
);

module.exports = router;
