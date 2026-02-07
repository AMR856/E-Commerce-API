const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const UserValidationSchemas = require("./user.validation");
const UserController = require("./user.controller");
const { PERMISSIONS } = require("../../config/roles");

// public
router.post(
  "/register",
  validator.validateBody(UserValidationSchemas.regiser),
  UserController.register,
);

router.post(
  "/login",
  validator.validateBody(UserValidationSchemas.login),
  UserController.login,
);

// User Roles (JWT will be used)
router.get("/me", authorize(PERMISSIONS.READ_USERS), UserController.getMe);
router.get("/", authorize(PERMISSIONS.READ_USERS), UserController.getAll);
router.get(
  "/get/count",
  authorize(PERMISSIONS.READ_USERS),
  UserController.getCount,
);
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_USERS),
  validator.validateParams(UserValidationSchemas.get),
  UserController.getOne,
);
router.get("/logout", UserController.logout);

// Admin Roles
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validator.validateParams(UserValidationSchemas.get),
  UserController.delete,
);

module.exports = router;
