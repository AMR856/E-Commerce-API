const express = require("express");
const router = express.Router();
const CategoryValidationSchemas = require("./category.validation");
const CategoryController = require('./category.controller');
const validator = require("../../middlewares/validator");

router.get(
  "/:id",
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.getOne,
);
router.get("/", CategoryController.getAll);
router.get("/get/count", CategoryController.getCount);
router.post(
  "/",
  validator.validateBody(CategoryValidationSchemas.create),
  CategoryController.create,
);
router.put(
  "/:id",
  validator.validateParams(CategoryValidationSchemas.idParam),
  validator.validateBody(CategoryValidationSchemas.update),
  CategoryController.update,
);
router.delete(
  "/:id",
  validator.validateParams(CategoryValidationSchemas.idParam),
  CategoryController.delete,
);

module.exports = router;
