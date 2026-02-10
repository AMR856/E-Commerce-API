const express = require("express");
const router = express.Router();
const uploadOptions = require("../../config/multer");
const ProductController = require("./product.controller");
const ProductValidationSchemas = require("./product.validation");
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 *
 * components:
 *   schemas:
 *     ProductCreate:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: iPhone 14
 *         description:
 *           type: string
 *           example: Latest Apple iPhone
 *         richDescription:
 *           type: string
 *           example: Detailed product description
 *         image:
 *           type: string
 *           format: binary
 *         brand:
 *           type: string
 *           example: Apple
 *         price:
 *           type: number
 *           example: 999
 *         category:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *         countInStock:
 *           type: integer
 *           example: 50
 *         isFeatured:
 *           type: boolean
 *           example: true
 *
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         richDescription:
 *           type: string
 *         brand:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         countInStock:
 *           type: integer
 *         isFeatured:
 *           type: boolean
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *         name:
 *           type: string
 *           example: iPhone 14
 *         description:
 *           type: string
 *         richDescription:
 *           type: string
 *         image:
 *           type: string
 *         brand:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         countInStock:
 *           type: integer
 *         isFeatured:
 *           type: boolean
 *         ratings:
 *           type: number
 *           example: 4.5
 *         numReviews:
 *           type: integer
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductResponse'
 *
 *     CountResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 42
 */

// Public

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs to filter
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Filter by price
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter featured products
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter products in stock
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */
router.get("/", ProductController.getAll);

/**
 * @swagger
 * /products/by-id/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */
router.get(
  "/by-id/:id",
  validator.validateParams(ProductValidationSchemas.idParam),
  ProductController.getOneByID,
);

/**
 * @swagger
 * /products/by-name/{name}:
 *   get:
 *     summary: Get a product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name
 *     responses:
 *       200:
 *         description: Product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */
router.get(
  "/by-name/:name",
  validator.validateParams(ProductValidationSchemas.name),
  ProductController.getOneByName,
);

/**
 * @swagger
 * /products/{id}/ratings:
 *   get:
 *     summary: Get product ratings
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product rating and number of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ratings:
 *                   type: number
 *                   example: 4.5
 *                 numReviews:
 *                   type: integer
 *                   example: 12
 */
router.get(
  "/:id/ratings",
  validator.validateParams(ProductValidationSchemas.idParam),
  ProductController.getRatings,
);

/**
 * @swagger
 * /products/get/count:
 *   get:
 *     summary: Get total number of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Total count of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountResponse'
 */
router.get("/get/count", ProductController.getCount);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of featured products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */
router.get("/featured", ProductController.getFeaturedProducts);

// Admin

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreate'
 *     responses:
 *       201:
 *         description: Created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */
router.post(
  "/",
  uploadOptions.single("image"),
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateBody(ProductValidationSchemas.create),
  ProductController.create,
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  validator.validateBody(ProductValidationSchemas.update),
  ProductController.update,
);

/**
 * @swagger
 * /products/{id}/ratings:
 *   post:
 *     summary: Add a rating to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product updated with new rating
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */

router.post(
  "/:id/ratings",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  validator.validateBody(ProductValidationSchemas.createRating),
  ProductController.addRating,
);

/**
 * @swagger
 * /products/gallery-images/{id}:
 *   put:
 *     summary: Update product gallery images
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated with gallery images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */
router.put(
  "/gallery-images/:id",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  uploadOptions.array("images", 10),
  ProductController.updateGalleryImages,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete(
  "/:id",
  validator.validateParams(ProductValidationSchemas.idParam),
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  ProductController.delete,
);

module.exports = router;
