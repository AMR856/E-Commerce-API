const Category = require("./category.model");

class CategoryService {
  static async getAll() {
    return await Category.find();
  }

  static async getOne(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  static async getCount() {
    return await Category.countDocuments();
  }
  static async create(data) {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw new Error("Category already exists");
    }
    const category = new Category(data);
    return await category.save();
  }

  static async update(id, data) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    if (data.name) {
      const duplicate = await Category.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (duplicate) {
        throw new Error("Category name already exists");
      }
    }

    Object.assign(category, data);
    return await category.save();
  }

  static async delete(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return await Category.findByIdAndDelete(id);
  }
  static async getBySlug(slug) {
    return await Category.findOne({ slug });
  }
}

module.exports = CategoryService;
