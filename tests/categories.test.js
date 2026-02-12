const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../app");
const Category = require("../modules/catergories/category.model");
const errorHandler = require("../utils/errorHandler");

app.use(errorHandler);

const API_URL = process.env.API_URL;

describe("Categories Routes", () => {
  let adminToken;
  let userToken;
  let category;

  beforeEach(async () => {
    adminToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId(), role: "admin" },
      process.env.JWT_SECRET,
    );

    userToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId(), role: "user" },
      process.env.JWT_SECRET,
    );

    category = await Category.create({
      name: "Electronics",
      slug: "electronics",
      icon: "some-icon-here",
      description: "All electronic products",
    });
  });

  describe("GET /categories", () => {
    it("should get all categories", async () => {
      const res = await request(app).get(`${API_URL}/categories`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.results).toBe(1);
    });
  });

  describe("GET /categories/:id", () => {
    it("should get category by id", async () => {
      const res = await request(app).get(
        `${API_URL}/categories/${category._id}`,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe("Electronics");
    });

    it("should return 404 if category not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).get(`${API_URL}/categories/${fakeId}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /categories/slug/:slug", () => {
    it("should get category by slug", async () => {
      const res = await request(app).get(
        `${API_URL}/categories/slug/electronics`,
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.data.slug).toBe("electronics");
    });
  });

  describe("GET /categories/count", () => {
    it("should return categories count", async () => {
      const res = await request(app).get(`${API_URL}/categories/count`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(1);
    });
  });

  describe("POST /categories", () => {
    it("should create category (admin)", async () => {
      const res = await request(app)
        .post(`${API_URL}/categories`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Books",
          slug: "books",
          description: "All books",
          icon:"clementine-icon"
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe("Books");
    });

    it("should fail if duplicate category name", async () => {
      const res = await request(app)
        .post(`${API_URL}/categories`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Electronics",
          slug: "electronics-2",
        });

      expect(res.statusCode).toBe(409);
    });

    it("should fail if not admin", async () => {
      const res = await request(app)
        .post(`${API_URL}/categories`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Clothes",
          slug: "clothes",
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("PUT /categories/:id", () => {
    it("should update category (admin)", async () => {
      const res = await request(app)
        .put(`${API_URL}/categories/${category._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Electronics" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe("Updated Electronics");
    });

    it("should return 404 if category not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`${API_URL}/categories/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Nothing" });

      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /categories/:id", () => {
    it("should delete category (admin)", async () => {
      const res = await request(app)
        .delete(`${API_URL}/categories/${category._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Category deleted successfully");

      const exists = await Category.findById(category._id);
      expect(exists).toBeNull();
    });

    it("should return 404 if category not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`${API_URL}/categories/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
// npx jest tests/categories.test.js
