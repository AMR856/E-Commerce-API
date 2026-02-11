const dotenv = require("dotenv");
dotenv.config({ path: ".env.test" });

const request = require("supertest");
const app = require("../app");
const User = require("../modules/users/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const errorHandler = require("../utils/error-handler");

app.use(errorHandler);

const API_URL = process.env.API_URL;

const createToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);

describe("Users Routes", () => {
  let userToken;
  let adminToken;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: "Test User",
      email: "user@test.com",
      passwordHash: bcrypt.hashSync("12345678", 10),
      street: "El Geish Road",
      apartment: "12B",
      city: "Alexandria",
      zip: "21500",
      country: "Egypt",
      phone: "+201234567890",
      role: "user",
    });

    userId = user._id;
    userToken = createToken(user);

    const admin = await User.create({
      name: "Admin",
      email: "admin@test.com",
      passwordHash: bcrypt.hashSync("12345678", 10),
      street: "Grove Street",
      apartment: "12B",
      city: "Savannah",
      zip: "21500",
      country: "USA",
      phone: "+201234567890",
      role: "admin",
    });

    adminToken = createToken(admin);
  });

  describe("POST /users/register", () => {
    it("should register new user", async () => {
      const res = await request(app)
        .post(`${API_URL}/users/register`)
        .send({
          name: "New User",
          email: "new@test.com",
          password: bcrypt.hashSync("12345678", 10),
          street: "Boulevard of broken dreams",
          apartment: "12B",
          city: "New Jersey",
          zip: "21500",
          country: "USA",
          phone: "+201234567890",
          role: "admin",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty("email", "new@test.com");
      expect(res.body.user).toHaveProperty(
        "street",
        "Boulevard of broken dreams"
      );
      expect(res.body.user).toHaveProperty("apartment", "12B");
      expect(res.body.user).toHaveProperty("city", "New Jersey");
    });
  });

  describe("POST /users/login", () => {
    it("should login user", async () => {
      const res = await request(app)
        .post(`${API_URL}/users/login`)
        .send({
          email: "user@test.com",
          password: "12345678",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });

  describe("POST /users/login - failing cases", () => {
    it("should fail if email does not exist", async () => {
      const res = await request(app)
        .post(`${API_URL}/users/login`)
        .send({
          email: "nonexistent@test.com",
          password: "12345678",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    it("should fail if password is incorrect", async () => {
      const res = await request(app)
        .post(`${API_URL}/users/login`)
        .send({
          email: "user@test.com",
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });
  });

  describe("GET /users/me", () => {
    it("should get current user", async () => {
      const res = await request(app)
        .get(`${API_URL}/users/me`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty(
        "email",
        "user@test.com"
      );
    });
  });

  describe("PUT /users/me", () => {
    it("should update current user", async () => {
      const res = await request(app)
        .put(`${API_URL}/users/me`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated Name" });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty(
        "name",
        "Updated Name"
      );
    });
  });

  describe("POST /users/change-password", () => {
    it("should change password", async () => {
      const res = await request(app)
        .post(`${API_URL}/users/change-password`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          oldPassword: "12345678",
          newPassword: "newpassword123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Password updated"
      );
    });
  });

  describe("GET /users", () => {
    it("should allow admin to get users", async () => {
      const res = await request(app)
        .get(`${API_URL}/users`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should deny normal user", async () => {
      const res = await request(app)
        .get(`${API_URL}/users`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /users/:id", () => {
    it("should get user by id (admin)", async () => {
      const res = await request(app)
        .get(`${API_URL}/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("_id");
    });

    it("should deny normal user", async () => {
      const res = await request(app)
        .get(`${API_URL}/users/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete user (admin)", async () => {
      const res = await request(app)
        .delete(`${API_URL}/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
    });
  });
});
// npx jest tests/users.test.js