const express = require("express");
const router = express.Router();
const OrderItemController = require("./orderItem.controller");
const validator = require("../../middlewares/validator");
const OrderItemValidationSchema = require("./orderItem.validation");

router.get("/", OrderItemController.getAll);

router.get(
  "/:id",
  validator.validateParams(OrderItemValidationSchema.idParam),
  OrderItemController.getOne
);

router.get("/get/count", OrderItemController.getCount);

router.post(
  "/",
  validator.validateBody(OrderItemValidationSchema.create),
  OrderItemController.create
);

router.put(
  "/:id",
  validator.validateParams(OrderItemValidationSchema.idParam),
  validator.validateBody(OrderItemValidationSchema.update),
  OrderItemController.update
);

router.delete(
  "/:id",
  validator.validateParams(OrderItemValidationSchema.idParam),
  OrderItemController.delete
);

module.exports = router;
