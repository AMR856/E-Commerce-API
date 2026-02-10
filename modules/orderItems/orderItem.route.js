const express = require("express");
const router = express.Router();
const OrderItemController = require("./orderItem.controller");
const validator = require("../../middlewares/validator");
const OrderItemValidationSchemas = require("./orderItem.validation");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Order item management
 *
 * components:
 *   schemas:
 *     OrderItemCreate:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           example: 65fb3cc2c65a920adea3394f
 *         quantity:
 *           type: integer
 *           example: 2
 *
 *     OrderItemUpdate:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 3
 *
 *     OrderItemResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         product:
 *           type: string
 *         quantity:
 *           type: integer
 *         user:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     OrderItemListResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: integer
 *           example: 5
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemResponse'
 *
 *     CountResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 20
 */

// User

/**
 * @swagger
 * /order-items:
 *   post:
 *     summary: Create a new order item (authenticated user)
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItemCreate'
 *     responses:
 *       201:
 *         description: Order item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemResponse'
 */
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateBody(OrderItemValidationSchemas.create),
  OrderItemController.create
);

/**
 * @swagger
 * /order-items/{id}:
 *   get:
 *     summary: Get a specific order item (owner only)
 *     tags: [OrderItems]
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
 *         description: Order item data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemResponse'
 */
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  OrderItemController.getOne
);

/**
 * @swagger
 * /order-items/{id}:
 *   put:
 *     summary: Update an order item (owner only)
 *     tags: [OrderItems]
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
 *             $ref: '#/components/schemas/OrderItemUpdate'
 *     responses:
 *       200:
 *         description: Order item updated
 */
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  validator.validateBody(OrderItemValidationSchemas.update),
  OrderItemController.update
);



/**
 * @swagger
 * /order-items/{id}:
 *   delete:
 *     summary: Delete an order item (owner only)
 *     tags: [OrderItems]
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
 *         description: Order item deleted
 */
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_OWN_ORDER_ITEMS),
  validator.validateParams(OrderItemValidationSchemas.idParam),
  OrderItemController.delete
);

// Admin

/**
 * @swagger
 * /order-items:
 *   get:
 *     summary: Get all order items (admin only)
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItemListResponse'
 */
router.get(
  "/",
  authorize(PERMISSIONS.READ_ALL_ORDER_ITEMS),
  OrderItemController.getAll
);

/**
 * @swagger
 * /order-items/get/count:
 *   get:
 *     summary: Get total order items count (admin only)
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountResponse'
 */
router.get(
  "/get/count",
  authorize(PERMISSIONS.READ_ALL_ORDER_ITEMS),
  OrderItemController.getCount
);


module.exports = router;
