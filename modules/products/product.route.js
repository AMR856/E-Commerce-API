const express = require("express");
const router = express.Router();
const uploadOptions = require("../../config/multer");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCount,
  isFeatured,
  updateGalleryImages,
} = require("./product.controller");

router.post("/", uploadOptions.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/get/count", getCount);
router.get("/get/isFeatured", isFeatured);
router.put("/gallery-images/:id", uploadOptions.array("images", 10), updateGalleryImages);

module.exports = router;
