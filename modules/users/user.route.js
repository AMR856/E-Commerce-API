const express = require("express");
const router = express.Router();
const validator = require("../../middlewares/validator");
const authorize = require("../../middlewares/authorize");
const UserValidationSchemas = require("./user.validation");
const UserController = require("./user.controller");
const { PERMISSIONS } = require("../../config/roles");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: password123
 *         phone:
 *           type: string
 *           example: 0123456789
 *         street:
 *           type: string
 *           example: 123 Main St
 *         apartment:
 *           type: string
 *           example: Apt 4B
 *         city:
 *           type: string
 *           example: Alexandria
 *         zip:
 *           type: string
 *           example: 21500
 *         country:
 *           type: string
 *           example: Egypt
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: password123
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         street:
 *           type: string
 *         apartment:
 *           type: string
 *         city:
 *           type: string
 *         zip:
 *           type: string
 *         country:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *     UserChangePassword:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: oldpassword123
 *         newPassword:
 *           type: string
 *           example: newpassword123
 *     UserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: 0123456789
 *         street:
 *           type: string
 *           example: 123 Main St
 *         apartment:
 *           type: string
 *           example: Apt 4B
 *         city:
 *           type: string
 *           example: Alexandria
 *         zip:
 *           type: string
 *           example: 21500
 *         country:
 *           type: string
 *           example: Egypt
 *         role:
 *           type: string
 *           example: user
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *     CountResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           example: 42
 *     UserListResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 */

// Public routes
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 */
router.post(
  "/register",
  validator.validateBody(UserValidationSchemas.register),
  UserController.register,
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  validator.validateBody(UserValidationSchemas.login),
  UserController.login,
);

// User profile
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authorize(PERMISSIONS.READ_MYSELF), UserController.getMe);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.get("/logout", UserController.logout);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/me",
  authorize(PERMISSIONS.UPDATE_MYSELF),
  validator.validateBody(UserValidationSchemas.update),
  UserController.update,
);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserChangePassword'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Old password incorrect
 */
router.post(
  "/change-password",
  authorize(PERMISSIONS.UPDATE_MYSELF),
  validator.validateBody(UserValidationSchemas.changePassword),
  UserController.changePassword,
);

// Admin Routes

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authorize(PERMISSIONS.READ_USERS), UserController.getAll);

/**
 * @swagger
 * /users/count:
 *   get:
 *     summary: Get total user count (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns total count
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CountResponse'
 *       401:
 *         description: Unauthorized
 */
router.get("/count", authorize(PERMISSIONS.READ_USERS), UserController.getCount);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *     responses:
 *       200:
 *         description: Returns user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  UserController.getOne,
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  validator.validateBody(UserValidationSchemas.update),
  UserController.update,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 698b3cc2c65a920adea3394f
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validator.validateParams(UserValidationSchemas.idParam),
  UserController.delete,
);

module.exports = router;
