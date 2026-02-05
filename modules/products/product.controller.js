const productService = require("./product.service");

const postProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ status: "Success", product });
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts(req.query);
    if (products.length === 0) {
      return res.status(200).json({ status: "Success", message: "No products found" });
    }
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
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ status: "Success", product: updated });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ status: "Success", message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getCount = async (_, res, next) => {
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
    if (products.length === 0) {
      return res.status(200).json({ status: "Success", message: "No featured products" });
    }
    res.status(200).json({ status: "Success", products });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCount,
  isFeatured
};
