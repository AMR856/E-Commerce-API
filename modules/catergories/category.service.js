const Category = require("./category.model");

class CategoryService {
  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }

  async createCategory(data) {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw new Error("Category already exists");
    }

    const category = new Category(data);
    return await category.save();
  }

  async updateCategory(id, data) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    // optional: prevent duplicate name on update
    if (data.name) {
      const duplicate = await Category.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (duplicate) {
        throw new Error("Category name already exists");
      }
    }

    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return await Category.findByIdAndDelete(id);
  }

  async getCategoryCount() {
    return await Category.countDocuments();
  }
}

module.exports = new CategoryService();
