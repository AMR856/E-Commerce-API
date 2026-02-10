const express = require("express");
const router = express.Router();
const CategoryValidationSchemas = require("./category.validation");
const CategoryController = require("./category.controller");
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 * 
 * components:
 *   schemas:
 *     CategoryCreate:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           example: Electronics
 *         slug:
 *           type: string
 *           example: electronics
 *         description:
 *           type: string
 *           example: All electronic products
 * 
 *     CategoryUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 * 
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *         name:
 *           type: string
 *           example: Electronics
 *         slug:
 *           type: string
 *           example: electronics
 *         description:
 *           type: string
 *           example: All electronic products
 * 
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CategoryResponse'
 * 
 *     CountResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 42
 */

// Public Routes

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 */
router.get("/", CategoryController.getAll);

/**
 * @swagger
 * /categories/count:
 *   get:
 *     summary: Get total number of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Total count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountResponse'
 */
router.get("/count", CategoryController.getCount);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
router.get(
  "/:id",
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.getOne
);

/**
 * @swagger
 * /categories/slug/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
router.get("/slug/:slug", CategoryController.getBySlug);

// Admin Routes

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreate'
 *     responses:
 *       201:
 *         description: Created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
router.post(
  "/",
  validator.validateBody(CategoryValidationSchemas.create),
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  CategoryController.create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdate'
 *     responses:
 *       200:
 *         description: Updated category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  validator.validateParams(CategoryValidationSchemas.idParam),
  validator.validateBody(CategoryValidationSchemas.update),
  CategoryController.update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Success message
 */
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.delete
);

module.exports = router;
