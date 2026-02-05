const CategoryService = require("./category.service");

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();

      res.status(200).json({
        status: "Success",
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);

      res.status(200).json({
        status: "Success",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCount(req, res, next) {
    try {
      const count = await CategoryService.getCategoryCount();

      res.status(200).json({
        status: "Success",
        count,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);

      res.status(201).json({
        status: "Success",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );

      res.status(200).json({
        status: "Success",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);

      res.status(200).json({
        status: "Success",
        message: "Category deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
