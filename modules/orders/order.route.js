const express = require("express");
const router = express.Router();
const { getAllOrders, postOrder, getOrder, updateStatus, deleteOrder, getTotalSales, getOrderCount, getUserOrders } = require("./order.controller");

router.get('/', getAllOrders);
router.post('/', postOrder);
router.get('/:id', getOrder);
router.post('/:id', updateStatus);
router.delete('/:id', deleteOrder);
router.get('/get/totalsales', getTotalSales);
router.get('/get/count', getOrderCount);
router.get('/get/userorders/:userId', getUserOrders);
module.exports = router;
