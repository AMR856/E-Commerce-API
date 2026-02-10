const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const UserValidationSchemas = require("./user.validation");
const UserController = require("./user.controller");
const { PERMISSIONS } = require("../../config/roles");

// Public
router.post(
  "/register",
  validator.validateBody(UserValidationSchemas.register),
  UserController.register,
);

router.post(
  "/login",
  validator.validateBody(UserValidationSchemas.login),
  UserController.login,
);

// USER
router.get("/me", authorize(PERMISSIONS.READ_MYSELF), UserController.getMe);
router.get("/logout", UserController.logout);

router.put(
  "/me",
  authorize(PERMISSIONS.UPDATE_MYSELF),
  validator.validateBody(UserValidationSchemas.update),
  UserController.update,
);
router.post(
  "/change-password",
  authorize(PERMISSIONS.UPDATE_MYSELF),
  validator.validateBody(UserValidationSchemas.changePassword),
  UserController.changePassword,
);

// Admin
router.get("/", authorize(PERMISSIONS.READ_USERS), UserController.getAll);
router.get(
  "/count",
  authorize(PERMISSIONS.READ_USERS),
  UserController.getCount,
);
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  UserController.getOne,
);

router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  validator.validateBody(UserValidationSchemas.update),
  UserController.update,
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  UserController.delete,
);

module.exports = router;
