const express = require("express");
const router = express.Router();
const uploadOptions = require("../../config/multer");
const ProductController = require("./product.controller");
const ProductValidationSchemas = require("./product.validation");
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

// public
router.get(
  "/",
  ProductController.getAll,
);
router.get(
  "/by-id/:id",
  validator.validateParams(ProductValidationSchemas.idParam),
  ProductController.getOneByID,
);
router.get(
  "/by-name/:name",
  validator.validateParams(ProductValidationSchemas.name),
  ProductController.getOneByName,
);
router.get(
  "/:id/ratings",
  validator.validateParams(ProductValidationSchemas.idParam),
  ProductController.getRatings,
);
router.get(
  "/get/count",
  ProductController.getCount,
);
router.get("/featured", ProductController.getFeaturedProducts);

// Admin

router.post(
  "/",
  uploadOptions.single("image"),
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateBody(ProductValidationSchemas.create),
  ProductController.create,
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  validator.validateBody(ProductValidationSchemas.update),
  ProductController.update,
);
router.post(
  "/:id/ratings",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  validator.validateBody(ProductValidationSchemas.createRating),
  ProductController.addRating,
);
router.put(
  "/gallery-images/:id",
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  validator.validateParams(ProductValidationSchemas.idParam),
  uploadOptions.array("images", 10),
  ProductController.updateGalleryImages,
);
router.delete(
  "/:id",
  validator.validateParams(ProductValidationSchemas.idParam),
  authorize(PERMISSIONS.MANAGE_PRODUCTS),
  ProductController.delete,
);
module.exports = router;
