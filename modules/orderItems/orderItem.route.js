const express = require("express");
const router = express.Router();
const OrderItemController = require("./orderItem.controller");
const validator = require("../../middlewares/validator");
const OrderItemValidationSchemas = require("./orderItem.validation");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

// User Specfic
// Authenticated users (ownership enforced in service, should be the same owner)
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateBody(OrderItemValidationSchemas.create),
  OrderItemController.create,
);

router.get(
  "/:id",
  authorize(PERMISSIONS.READ_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  OrderItemController.getOne, // Checked
);

router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  validator.validateBody(OrderItemValidationSchemas.update),
  OrderItemController.update, // Checked
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  OrderItemController.delete, // Checked
);

// Admin-only
router.get(
  "/",
  authorize(PERMISSIONS.READ_ALL_ORDER_ITEMS),
  OrderItemController.getAll,
);

router.get(
  "/get/count",
  authorize(PERMISSIONS.READ_ALL_ORDER_ITEMS),
  OrderItemController.getCount,
);

module.exports = router;
