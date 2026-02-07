const Product = require("./product.model");
const Category = require("../catergories/category.model");

class ProductService {
  static selectionStr = "name description brand price category rating _id";

  static async create(data) {
    const category = await Category.findById(data.category);
    if (!category) throw new Error("Invalid Category");

    const product = new Product(data);
    return await product.save();
  }

  async getAllProducts(filterQuery) {
    let filter = {};
    if (filterQuery.categories) {
      filter = { category: filterQuery.categories.split(",") };
    }
    const products = await Product.find(filter)
      .populate("category")
      .select(this.selectionStr);
    return products;
  }

  async getProductById(productId) {
    const product = await Product.findById(productId).populate("category");
    if (!product) throw new Error("Product not found");
    return product;
  }

  async updateProduct(productId, data) {
    const category = await Category.findById(data.category);
    if (!category) throw new Error("Invalid Category");

    const updated = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });
    if (!updated) throw new Error("Product not found");

    return updated;
  }

  async deleteProduct(productId) {
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) throw new Error("Product not found");
    return deleted;
  }

  async getProductCount() {
    return await Product.countDocuments();
  }

  async getFeaturedProducts(page = 0, pageSize = 10) {
    const skip = parseInt(page) * pageSize;
    const products = await Product.find({ isFeatured: true })
      .skip(skip)
      .limit(pageSize)
      .select(this.selectionStr);

    return products;
  }
}

module.exports = new ProductService();
