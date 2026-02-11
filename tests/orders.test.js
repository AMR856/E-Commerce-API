const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const Order = require("../modules/orders/order.model");
const OrderItem = require("../modules/orderItems/orderItem.model");
const Category = require("../modules/catergories/category.model");
const Product = require("../modules/products/product.model");
const User = require("../modules/users/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const API_URL = process.env.API_URL;

let adminToken;
let userToken;
let adminId;
let userId;
let orderItemId;
let orderId;

beforeEach(async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash: "hashedPassword",
    role: "admin",
  });
  adminId = admin._id;
  adminToken = jwt.sign({ userId: adminId, role: "admin" }, JWT_SECRET);

  const user = await User.create({
    name: "User",
    email: "user@test.com",
    passwordHash: "hashedPassword",
    role: "user",
  });
  userId = user._id;
  userToken = jwt.sign({ userId: userId, role: "user" }, JWT_SECRET);

  const category = await Category.create({
    name: "Electronics",
    slug: "electronics",
  });
  const product = await Product.create({
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
  productId = product._id;
  const orderItem = await OrderItem.create({
    product: productId,
    quantity: 2,
    user: userId,
  });
  orderItemId = orderItem._id;
  const order = await Order.create({
    orderItem: [orderItem],
    shippingAddress1: "123 Main St",
    shippingAddress2: "Apt 4B",
    city: "Alex",
    zip: "21500",
    country: "Egypt",
    phone: "+201234567890",
    status: "Pending",
    totalPrice: 2000,
    user: userId,
    dateOrdered: new Date(),
  });
  orderId = order._id; 
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Order API", () => {
  describe("POST /orders", () => {
    it("should create a new order", async () => {
      const res = await request(app)
        .post(`${API_URL}/orders`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          orderItem: [{
            product: productId,
            quantity: 2,
            user: userId,
          }],
          shippingAddress1: "Address 1",
          shippingAddress2: "Address 2",
          city: "City",
          zip: "12345",
          country: "Country",
          phone: "1234567890",
          status: "Pending",
          user: userId.toString(),
        });
      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
    });

    it("should fail without order items", async () => {
      const res = await request(app)
        .post(`${API_URL}/orders`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          shippingAddress1: "Address 1",
          city: "City",
          country: "Country",
          phone: "1234567890",
          user: userId.toString(),
        });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /orders/:id", () => {
    it("should get an order by ID for admin", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should get an order by ID for owner", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should fail for other users", async () => {
      const otherUser = await User.create({
        name: "Other",
        email: "other@test.com",
        passwordHash: "pass",
        role: "user",
      });
      const token = jwt.sign(
        { userId: otherUser._id, role: "user" },
        JWT_SECRET,
      );
      const res = await request(app)
        .get(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe("PUT /orders/:id", () => {
    it("should update an order for owner", async () => {
      const res = await request(app)
        .put(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ city: "New City" });
      expect(res.status).toBe(200);
      expect(res.body.order.city).toBe("New City");
    });

    it("should update an order for admin", async () => {
      const res = await request(app)
        .put(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ city: "Admin City" });
      expect(res.status).toBe(200);
      expect(res.body.order.city).toBe("Admin City");
    });
  });

  describe("POST /orders/:id/status", () => {
    it("should allow admin to update status", async () => {
      const res = await request(app)
        .post(`${API_URL}/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Shipped" });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("Shipped");
    });

    it("should forbid user from updating status", async () => {
      const res = await request(app)
        .post(`${API_URL}/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ status: "Delivered" });
      expect(res.status).toBe(403);
    });
  });

  describe("GET /orders", () => {
    it("should get all orders for admin", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.orders)).toBe(true);
    });
  });

  describe("GET /orders/get/userorders/:userId", () => {
    it("should get orders for a specific user", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders/get/userorders/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.orders)).toBe(true);
    });
  });

  describe("GET /orders/get/count", () => {
    it("should get total order count", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders/get/count`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("GET /orders/get/totalsales", () => {
    it("should get total sales amount", async () => {
      const res = await request(app)
        .get(`${API_URL}/orders/get/totalsales`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.totalSales).toBeGreaterThanOrEqual(0);
    });
  });

  describe("DELETE /orders/:id", () => {
    it("should allow admin to delete", async () => {
      const res = await request(app)
        .delete(`${API_URL}/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("should fail for normal user if not owner", async () => {
      const order = await Order.create({
        orderItem: [orderItemId],
        shippingAddress1: "Addr",
        city: "City",
        country: "Country",
        phone: "123",
        user: adminId,
      });

      const res = await request(app)
        .delete(`${API_URL}/orders/${order._id}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });
});
