const Product = require("./product.model");
const Category = require("../catergories/category.model");
const CustomError = require("../../utils/customError");
const HTTPStatusText = require("../../utils/HTTPStatusText");

class ProductService {
  static selectionStr = "name description brand price category rating _id";

  static async getAll(filterQuery) {
    let filter = {};
    let skip = 0;
    let pageSize = filterQuery.limit || 10;
    if (filterQuery.page) {
      skip = parseInt(filterQuery.page) * pageSize;
    }
    if (filterQuery.categories) {
      const categories = filterQuery.categories.split(",");
      filter.category = { $in: categories };
    }

    if (filterQuery.price) {
      filter.price = Number(filterQuery.price);
    }

    if (filterQuery.isFeatured) {
      filter.isFeatured = filterQuery.isFeatured === "true";
    }

    if (filterQuery.inStock) {
      filter.countInStock = { $gt: 0 };
    }

    if (filterQuery.search) {
      filter.name = { $regex: filterQuery.search, $options: "i" };
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(pageSize)
      .populate("category")
      .select(this.selectionStr);

    return products;
  }

  static async getOneByID(productId) {
    const product = await Product.findById(productId).populate("category");
    if (!product)
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    return product;
  }

  static async getOneByName(productName) {
    const product = await Product.findOne({
      name: { $regex: `^${productName}$`, $options: "i" },
    }).populate("category");

    if (!product)
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    return product;
  }

  static async getCount() {
    return await Product.countDocuments();
  }
  static async getRatings(productId) {
    const product =
      await Product.findById(productId).select("rating numReviews");

    if (!product) {
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    }

    return {
      rating: product.rating,
      numReviews: product.numReviews,
    };
  }
  static async getFeaturedProducts(query) {
    const { page, pageSize } = query;
    const skip = parseInt(page) * pageSize;
    const products = await Product.find({ isFeatured: true })
      .skip(skip)
      .limit(pageSize)
      .select(this.selectionStr);

    return products;
  }

  static async create(req) {
    const file = req.file;
    if (!file)
      throw new CustomError(
        "No image in the request",
        400,
        HTTPStatusText.FAIL,
      );

    // The image saved in the database by its URL
    // (The URL directs you the location of the image in the server)
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    req.body.image = `${basePath}${file.filename}`;
    const data = req.body;
    const category = await Category.findById(data.category);
    if (!category)
      throw new CustomError("Invalid Category", 400, HTTPStatusText.FAIL);

    const product = new Product(data);
    return await product.save();
  }

  static async update(productId, data) {
    const category = await Category.findById(data.category);
    if (!category)
      throw new CustomError("Invalid Category", 400, HTTPStatusText.FAIL);

    const updated = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });
    if (!updated)
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);

    return updated;
  }
  static async addRating(productId, data) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    }

    const newRating = data.rating;

    const totalRating = product.rating * product.numReviews + newRating;

    product.numReviews += 1;
    product.rating = totalRating / product.numReviews;

    await product.save();

    return product;
  }
  static async delete(productId) {
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted)
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    return deleted;
  }
  static async updateGalleryImages(productId, files, req) {
    if (!files || files.length === 0) {
      throw new CustomError("No images uploaded", 400, HTTPStatusText.FAIL);
    }

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const imagesPaths = files.map((file) => `${basePath}${file.filename}`);

    const product = await Product.findByIdAndUpdate(
      productId,
      { images: imagesPaths },
      { new: true },
    );

    if (!product) {
      throw new CustomError("Product not found", 404, HTTPStatusText.FAIL);
    }

    return product;
  }
}

module.exports = ProductService;
