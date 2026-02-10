const express = require("express");
const router = express.Router();
const CategoryValidationSchemas = require("./category.validation");
const CategoryController = require("./category.controller");
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const { PERMISSIONS } = require("../../config/roles");

// public

router.get("/", CategoryController.getAll);
router.get("/count", CategoryController.getCount);
router.get(
  "/:id",
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.getOne,
);
router.get("/slug/:slug", CategoryController.getBySlug);

// admin specfic
router.post(
  "/",
  validator.validateBody(CategoryValidationSchemas.create),
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  CategoryController.create,
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  validator.validateParams(CategoryValidationSchemas.idParam),
  validator.validateBody(CategoryValidationSchemas.update),
  CategoryController.update,
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_CATEGORIES),
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.delete,
);

module.exports = router;
