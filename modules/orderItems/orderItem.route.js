const express = require("express");
const router = express.Router();
const {
  getAllOrderItems,
  getOrderitem,
  getCount,
} = require("./orderItem.controller");
const { validateParams } = require("../../middlewares/validator");
const { getOrderItemSchema } = require("./orderItem.validation");

router.get("/", getAllOrderItems);
router.get("/:id", validateParams(getOrderItemSchema), getOrderitem);
router.get("/get/count", getCount);
module.exports = router;
