const CategoryService = require("./category.service");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll();

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        results: categories.length,
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const category = await CategoryService.getOne(req.params.id);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req, res, next) {
    try {
      const category = await CategoryService.getBySlug(req.params.slug);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(req, res, next) {
    try {
      const count = await CategoryService.getCount();

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        count,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const category = await CategoryService.create(req.body);

      res.status(201).json({
        status: HTTPStatusText.SUCCESS,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);

      res.status(200).json({
        status: HTTPStatusText.SUCCESS,
        message: "Category deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
