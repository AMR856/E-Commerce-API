const Category = require("./category.model");
const CustomError = require("../../utils/customError");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class CategoryService {
  static async getAll() {
    return await Category.find();
  }

  static async getOne(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError(404, "Category not found", HTTPStatusText.FAIL);
    }
    return category;
  }

  static async getCount() {
    return await Category.countDocuments();
  }

  static async create(data) {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw new CustomError(
        409,
        "Category already exists",
        HTTPStatusText.ERROR,
      );
    }

    const category = new Category(data);
    return await category.save();
  }

  static async update(id, data) {
    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError(404, "Category not found", HTTPStatusText.FAIL);
    }

    if (data.name) {
      const duplicate = await Category.findOne({
        name: data.name,
        _id: { $ne: id },
      });

      if (duplicate) {
        throw new CustomError(
          409,
          "Category name already exists",
          HTTPStatusText.ERROR,
        );
      }
    }

    Object.assign(category, data);
    return await category.save();
  }

  static async delete(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new CustomError(404, "Category not found", HTTPStatusText.FAIL);
    }

    await category.deleteOne();
  }

  static async getBySlug(slug) {
    const category = await Category.findOne({ slug });
    if (!category) {
      throw new CustomError(404, "Category not found", HTTPStatusText.FAIL);
    }
    return category;
  }
}

module.exports = CategoryService;
