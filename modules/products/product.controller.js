const productService = require("./product.service");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class ProductController {
  static getAll = async (req, res, next) => {
    try {
      const products = await productService.getAll(req.query);
      if (!products.length)
        return res.status(200).json({
          status: HTTPStatusText.SUCCESS,
          message: "No products found",
        });
      res.status(200).json({ status: HTTPStatusText.SUCCESS, data: products });
    } catch (err) {
      next(err);
    }
  };

  static getOneByID = async (req, res, next) => {
    try {
      const product = await productService.getOneByID(req.params.id);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, product });
    } catch (err) {
      next(err);
    }
  };

  static getOneByName = async (req, res, next) => {
    try {
      const product = await productService.getOneByName(req.params.name);
      res.status(200).json({ status: HTTPStatusText.SUCCESS, product });
    } catch (err) {
      next(err);
    }
  };

  static getCount = async (req, res, next) => {
    try {
      const count = await productService.getCount();
      res.status(200).json({ status: HTTPStatusText.SUCCESS, count });
    } catch (err) {
      next(err);
    }
  };
  static getRatings = async (req, res, next) => {
    try {
      const ratings = await productService.getRatings(req.params.id);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        ratings,
      });
    } catch (err) {
      next(err);
    }
  };
  static getFeaturedProducts = async (req, res, next) => {
    try {
      const products = await productService.getFeaturedProducts(req.query);
      if (!products.length)
        return res.status(200).json({
          status: HTTPStatusText.SUCCESS,
          message: "No featured products",
        });
      res.status(200).json({ status: HTTPStatusText.SUCCESS, products });
    } catch (err) {
      next(err);
    }
  };

  static create = async (req, res, next) => {
    try {
      const product = await productService.create(req);
      res.status(201).json({ status: HTTPStatusText.SUCCESS, product });
    } catch (err) {
      next(err);
    }
  };

  static update = async (req, res, next) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.status(200).json({ status: "Success", product });
    } catch (err) {
      next(err);
    }
  };
  static addRating = async (req, res, next) => {
    try {
      const product = await productService.addRating(req.params.id, req.body);

      res.status(201).json({
        status: HTTPStatusText.SUCCESS,
        product,
      });
    } catch (err) {
      next(err);
    }
  };
  static delete = async (req, res, next) => {
    try {
      await productService.delete(req.params.id);
      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
  static updateGalleryImages = async (req, res, next) => {
    try {
      const product = await productService.updateGalleryImages(
        req.params.id,
        req.files,
        req,
      );

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        product,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProductController;
