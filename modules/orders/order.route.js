const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");
const OrderValidationSchemas = require("./order.validation");
const OrderController = require("./order.controller");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a specific order (owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  OrderController.getOne
);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreate'
 *     responses:
 *       201:
 *         description: Order created
 */
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateBody(OrderValidationSchemas.create),
  OrderController.create
);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order (owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdate'
 *     responses:
 *       200:
 *         description: Order updated
 */
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  validator.validateBody(OrderValidationSchemas.update),
  OrderController.update
);

/**
 * @swagger
 * /orders/{id}/status:
 *   post:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderStatusUpdate'
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.post(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  validator.validateBody(OrderValidationSchemas.updateStatus),
  OrderController.updateStatus
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order (owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted
 */
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDERS),
  validator.validateParams(OrderValidationSchemas.idParam),
  OrderController.delete
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get(
  "/",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  OrderController.getAll
);

/**
 * @swagger
 * /orders/get/userorders/{userId}:
 *   get:
 *     summary: Get orders of a specific user (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User orders
 */
router.get(
  "/get/userorders/:userId",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  validator.validateParams(OrderValidationSchemas.getUserOrders),
  OrderController.getUserOrders
);

/**
 * @swagger
 * /orders/get/count:
 *   get:
 *     summary: Get total number of orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders count
 */
router.get(
  "/get/count",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  OrderController.getCount
);

/**
 * @swagger
 * /orders/get/totalsales:
 *   get:
 *     summary: Get total sales amount (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total sales
 */
router.get(
  "/get/totalsales",
  authorize(PERMISSIONS.READ_ALL_ORDERS),
  OrderController.getTotalSales
);

module.exports = router;
