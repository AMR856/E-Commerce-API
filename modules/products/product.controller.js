const productService = require("./product.service");
const Product = require("./product.model");
const productService = require("./product.service");

const createProduct = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    // The image saved in the database by its URL
    // (The URL directs you the location of the image in the server)
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    req.body.image = `${basePath}${file.filename}`;

    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: "Success", product });
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    if (!products.length)
      return res
        .status(200)
        .json({ status: "Success", message: "No products found" });
    res.status(200).json({ status: "Success", data: products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ status: "Success", product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ status: "Success", product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res
      .status(200)
      .json({ status: "Success", message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getCount = async (req, res, next) => {
  try {
    const count = await productService.getProductCount();
    res.status(200).json({ status: "Success", count });
  } catch (err) {
    next(err);
  }
};

const isFeatured = async (req, res, next) => {
  try {
    const { page = 0, pageSize = 10 } = req.query;
    const products = await productService.getFeaturedProducts(page, pageSize);
    if (!products.length)
      return res
        .status(200)
        .json({ status: "Success", message: "No featured products" });
    res.status(200).json({ status: "Success", products });
  } catch (err) {
    next(err);
  }
};

const updateGalleryImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).send("Invalid Product Id");

    const files = req.files;
    if (!files || files.length === 0)
      return res.status(400).send("No images uploaded");

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imagesPaths = files.map((file) => `${basePath}${file.filename}`);

    const product = await Product.findByIdAndUpdate(
      id,
      { images: imagesPaths },
      { new: true },
    );
    if (!product) return res.status(500).send("Gallery cannot be updated!");

    res.status(200).json({ status: "Success", product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCount,
  isFeatured,
  updateGalleryImages,
};
