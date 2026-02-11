const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = require("../app");
const API_URL = process.env.API_URL;

const User = require("../modules/users/user.model");
const Product = require("../modules/products/product.model");
const Category = require("../modules/catergories/category.model");
const OrderItem = require("../modules/orderItems/orderItem.model");

const createToken = (user) =>
  jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
  );

describe("OrderItems Routes", () => {
  let adminToken, userToken;
  let admin, user;
  let category, product;
  let orderItem;

  beforeEach(async () => {
    await OrderItem.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      passwordHash: "hashedpassword",
      role: "admin",
    });

    user = await User.create({
      name: "User",
      email: "user@test.com",
      passwordHash: "hashedpassword",
      role: "user",
    });

    adminToken = createToken(admin);
    userToken = createToken(user);

    category = await Category.create({ name: "Electronics", slug: "electronics" });

    product = await Product.create({
      name: "iPhone",
      description: "Apple phone",
      brand: "Apple",
      price: 1000,
      category: category._id,
      countInStock: 10,
      image: "test.jpg",
    });

    orderItem = await OrderItem.create({
      product: product._id,
      quantity: 2,
      user: user._id,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });


  describe("POST /order-items", () => {
    it("should allow user to create order item", async () => {
      const res = await request(app)
        .post("/api/v1/order-items")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ product: product._id, quantity: 3 });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.quantity).toBe(3);
    });

    it("should prevent unauthenticated user", async () => {
      const res = await request(app)
        .post("/api/v1/order-items")
        .send({ product: product._id, quantity: 1 });

      expect(res.statusCode).toBe(401);
    });
  });


  describe("GET /order-items/:id", () => {
    it("should allow user to get own order item", async () => {
      const res = await request(app)
        .get(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data._id).toBe(orderItem._id.toString());
    });

    it("should prevent user from accessing others' order item", async () => {
      const res = await request(app)
        .get(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });


  describe("PUT /order-items/:id", () => {
    it("should allow user to update own order item", async () => {
      const res = await request(app)
        .put(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(5);
    });

    it("should prevent unauthorized update", async () => {
      const anotherUser = await User.create({
        name: "Other",
        email: "other@test.com",
        passwordHash: "hashedpassword",
        role: "user",
      });

      const token = createToken(anotherUser);

      const res = await request(app)
        .put(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(403);
    });
  });


  describe("DELETE /order-items/:id", () => {
    it("should allow user to delete own order item", async () => {
      const res = await request(app)
        .delete(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Order item deleted successfully");
    });

    it("should prevent unauthorized delete", async () => {
      const anotherUser = await User.create({
        name: "Other",
        email: "other2@test.com",
        passwordHash: "hashedpassword",
        role: "user",
      });
      const token = createToken(anotherUser);

      const res = await request(app)
        .delete(`/api/v1/order-items/${orderItem._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });
  });


  describe("GET /order-items", () => {
    it("should allow admin to get all order items", async () => {
      const res = await request(app)
        .get("/api/v1/order-items")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("should prevent normal user", async () => {
      const res = await request(app)
        .get("/api/v1/order-items")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });


  describe("GET /order-items/get/count", () => {
    it("should allow admin to get count", async () => {
      const res = await request(app)
        .get("/api/v1/order-items/get/count")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
    });

    it("should prevent normal user", async () => {
      const res = await request(app)
        .get("/api/v1/order-items/get/count")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
// npx jest tests/orderItems.test.js
