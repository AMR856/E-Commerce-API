const express = require("express");
const router = express.Router();
const {
  postUser,
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  getCount,
  deleteUser,
} = require("./user.controller");

router.get("/", getAllUsers);
router.post("/", postUser);
router.get("/:id", getUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/get/count", getCount);
router.delete("/:id", deleteUser);
module.exports = router;
