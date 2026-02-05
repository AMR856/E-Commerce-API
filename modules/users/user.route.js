const express = require("express");
const router = express.Router();
const {
  validateBody,
  validateParams,
} = require("../../middlewares/validators");

const {
  createUserSchema,
  loginUserSchema,
  getUserParamsSchema,
  deleteUserParamsSchema,
} = require("./user.validation");
const {
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  getCount,
  deleteUser,
} = require("./user.controller");

router.get("/", getAllUsers);
router.get("/:id", validateParams(getUserParamsSchema), getUser);
router.get("/get/count", getCount);
router.post("/register", validateBody(createUserSchema), registerUser);
router.post("/login", validateBody(loginUserSchema), loginUser);
router.delete("/:id", validateParams(deleteUserParamsSchema), deleteUser);
module.exports = router;
