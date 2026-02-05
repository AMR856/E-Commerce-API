const express = require("express");
const router = express.Router();
const { getAllOrderItems, getOrderitem, getCount } = require("./orderItem.controller");

router.get('/', getAllOrderItems);
router.get('/:id', getOrderitem);
router.get('/get/count', getCount);
module.exports = router;
