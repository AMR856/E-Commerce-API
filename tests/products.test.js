const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = require("../app");
const API_URL = process.env.API_URL;

const Product = require("../modules/products/product.model");
const Category = require("../modules/catergories/category.model");
const User = require("../modules/users/user.model");

const createToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );

describe("Products Routes - Full Integration Suite", () => {
  let adminToken;
  let userToken;
  let category;
  let product;

  beforeEach(async () => {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      passwordHash: "hashedpassword",
      street: "street",
      apartment: "12",
      city: "Alex",
      zip: "21500",
      country: "Egypt",
      phone: "+201234567890",
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: "user@test.com",
      passwordHash: "hashedpassword",
      street: "street",
      apartment: "12",
      city: "Alex",
      zip: "21500",
      country: "Egypt",
      phone: "+201234567890",
      role: "user",
    });

    adminToken = createToken(admin);
    userToken = createToken(user);

    category = await Category.create({
      name: "Electronics",
      slug: "electronics",
    });

    product = await Product.create({
      name: "iPhone",
      description: "Apple phone",
      brand: "Apple",
      price: 1000,
      category: category._id,
      countInStock: 10,
      rating: 4.5,
      numReviews: 2,
      isFeatured: true,
      image: "test.jpg",
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /products", () => {
    it("should get all products", async () => {
      const res = await request(app).get(`${API_URL}/products`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should filter by search", async () => {
      const res = await request(app)
        .get(`${API_URL}/products`)
        .query({ search: "iphone" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data[0].name).toBe("iPhone");
    });
  });

  describe("GET /products/by-id/:id", () => {
    it("should get product by id", async () => {
      const res = await request(app).get(
        `${API_URL}/products/by-id/${product._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.product.name).toBe("iPhone");
    });

    it("should fail if not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(
        `${API_URL}/products/by-id/${fakeId}`
      );

      expect(res.statusCode).toBe(404);
    });
  });


  describe("GET /products/by-name/:name", () => {
    it("should get product by name", async () => {
      const res = await request(app).get(
        `${API_URL}/products/by-name/iPhone`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.product.brand).toBe("Apple");
    });
  });

  describe("GET /products/get/count", () => {
    it("should return count", async () => {
      const res = await request(app).get(
        `${API_URL}/products/get/count`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
    });
  });


  describe("GET /products/:id/ratings", () => {
    it("should get ratings", async () => {
      const res = await request(app).get(
        `${API_URL}/products/${product._id}/ratings`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.ratings.rating).toBe(4.5);
    });
  });


  describe("GET /products/featured", () => {
    it("should get featured products", async () => {
      const res = await request(app).get(
        `${API_URL}/products/featured`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.products.length).toBeGreaterThan(0);
    });
  });


  describe("POST/products", () => {
    it("should create product (admin)", async () => {
      const res = await request(app)
        .post(`${API_URL}/products`)
        .set("Authorization", `Bearer ${adminToken}`)
        .field("name", "MacBook")
        .field("description", "Laptop")
        .field("brand", "Apple")
        .field("price", 2000)
        .field("category", category._id.toString())
        .field("countInStock", 5)
        .attach("image", path.join(__dirname, "test.jpg"));
      expect(res.statusCode).toBe(201);
      expect(res.body.product.name).toBe("MacBook");
    });

    it("should deny normal user", async () => {
      const res = await request(app)
        .post(`${API_URL}/products`)
        .set("Authorization", `Bearer ${userToken}`)
        .field("name", "Test");

      expect(res.statusCode).toBe(403);
    });
  });


  describe("PUT /products/:id", () => {
    it("should update product (admin)", async () => {
      const res = await request(app)
        .put(`${API_URL}/products/${product._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 1500 });

      expect(res.statusCode).toBe(200);
      expect(res.body.product.price).toBe(1500);
    });
  });


  describe("POST /products/:id/ratings", () => {
    it("should add rating", async () => {
      const res = await request(app)
        .post(`${API_URL}/products/${product._id}/ratings`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ rating: 5 });

      expect(res.statusCode).toBe(201);
      expect(res.body.product.numReviews).toBe(3);
    });
  });


  describe("DELETE /products/:id", () => {
    it("should delete product (admin)", async () => {
      const res = await request(app)
        .delete(`${API_URL}/products/${product._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
// npx jest tests/products.test.js
